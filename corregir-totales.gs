/*  ════════════════════════════════════════════════════════════════
    VDH · CORRECCIÓN DE LOS TOTALES PONDERADOS EN LAS PLANILLAS
    Va en la planilla CONSOLIDADORA, como archivo APARTE de Código.gs.
    Reusa LOCALES, MESES, BLOQ_I y BLOQ_T de ahí.

    QUÉ ARREGLA
    Algunas celdas de total promedian promedios, y eso le da el mismo peso
    a una semana de 3 tickets que a una de 40. Con los datos de septiembre
    el desvío llegaba a +12,1% (San Justo 1) y +7,1% en Rivadavia, donde
    el dashboard mostraba $80.447 contra los $70.522 de la propia planilla.

    Lo correcto, y lo que ya usa el dashboard desde el 2026-10-01:
      tickets del período = Σ (venta / ticket promedio) de cada celda
      TP         = Σ venta / Σ tickets
      Conversión = Σ tickets / Σ tráfico
      PxT        = Σ prendas / Σ tickets      (prendas = tickets × PxT)

    Validado contra blueSoft: Sebas Ramon del 1/9 al 13/9 da 28 tickets,
    $2.085.599 y $74.485 de ticket promedio — idéntico a lo que reporta el
    sistema de ventas.

    QUÉ ENCONTRÓ LA AUDITORÍA (corrida del 2026-10-01, 2.268 celdas)
    Las 14 planillas están armadas EXACTAMENTE igual: una sola variante de
    fórmula por métrica en toda la red. Y no todo estaba mal:

      MAL, hay que corregir:
      · Informe Vendedor, Total/Prom de Conversión real, TP real y PxT real
        (420 celdas cada una): =IFERROR(IF(COUNT(C:H)=0;"";AVERAGE(C:H));"")
      · Tráfico, "Total Sem" de Conversión real (504 celdas):
        =IFERROR(AVERAGE(C:I);"")

      YA ESTABA BIEN, no se toca:
      · Tráfico, "Total Sem" de Ticket promedio real: ya divide la venta
        por los tickets derivados. Es la fórmula correcta.
      · Las tarjetas de arriba (F4 TICKET PROMEDIO y D4 CONVERSIÓN REAL):
        la de ticket ya es ponderada —por eso da los $70.522 que coinciden
        clavados con el dashboard— y la de conversión ya pondera por
        tráfico, que es matemáticamente lo mismo que tickets ÷ tráfico.

    OJO con las funciones: las planillas guardan los nombres en INGLÉS
    (IFERROR, SUMPRODUCT, AVERAGE) con ";" de separador. La primera versión
    de este script generaba SI.ERROR/SUMAPRODUCTO y habría roto las 420
    celdas de una. Lo detectó la auditoría antes de escribir nada — por eso
    se audita primero.

    OJO 2: nada de esto cambia un número del dashboard. El consolidador lee
    las celdas DIARIAS y SEMANALES, nunca las de total. Esto es para que la
    planilla deje de contradecir al dashboard cuando se miran las dos.

    POR QUÉ LEE POR HOJA Y NO POR CELDA
    La primera versión hacía un getFormula() por celda: unas 850 idas y
    vueltas a Drive, y se comía los 6 minutos de límite de Apps Script sin
    llegar a terminar. Ahora cada hoja se lee de una sola vez con
    getFormulas()/getValues() y el resto se resuelve en memoria: 2.268
    celdas en 119 segundos.

    CÓMO USARLO
      1. auditarTotales()          — solo lectura, no escribe nada.
      2. corregirInformeVendedor() — las 3 filas de cada vendedor.
      3. corregirTrafico()         — el "Total Sem" de conversión.
    Las dos correcciones arrancan con MODO_PRUEBA en true: solo loguean lo
    que escribirían. Recién poniéndolo en false escriben de verdad.

    Antes de la corrida real conviene duplicar una planilla a mano, para
    tener de dónde volver.
    ════════════════════════════════════════════════════════════════ */

// true = no escribe nada, solo loguea lo que haría. Poner en false recién después de revisar.
var MODO_PRUEBA = true;

// Corte de seguridad: Apps Script mata la ejecución a los 6 minutos sin dejar log. Cortando antes
// a propósito, el log se escribe igual y dice hasta dónde llegó.
var LIMITE_MS = 4.5 * 60 * 1000;

// Desplazamiento de cada métrica desde el inicio del bloque del vendedor (BLOQ_I). Mismo mapa que
// usa leerLocal() en Código.gs: +0 Venta obj, +1 Venta real, +2 Tráfico obj, +3 Tráfico real,
// +4 Conv obj, +5 Conv real, +6 TP obj, +7 TP real, +8/+9 Perfumes, +10/+11 Boxer,
// +12 PxT obj, +13 PxT real.
var OFF = { ventaReal: 1, traficoReal: 3, convReal: 5, tpReal: 7, pxtReal: 13 };
var COL_TOTAL = 'I';                      // columna "Total/Prom" en Informe Vendedor
var COL_DESDE = 'C', COL_HASTA = 'H';     // las 6 semanas en Informe Vendedor
var COL_TOTAL_N = 9;                      // I, como número de columna

// En la hoja Tráfico los días van de C a I y cada bloque semanal tiene 4 filas:
// +1 Tráfico necesario, +2 Tráfico real, +3 Conversión real, +4 Ticket promedio real.
var DIA_DESDE = 'C', DIA_HASTA = 'I';
var OFF_T = { traficoReal: 2, convReal: 3, ticketReal: 4 };

// Lee una hoja ENTERA de una sola vez (fórmulas y valores) y la devuelve como dos matrices
// indexables por fila/columna 1-based. Es lo que evita las cientos de llamadas sueltas.
function leerHojaEntera(hoja, filas, cols) {
  var f = Math.min(filas, hoja.getMaxRows()), c = Math.min(cols, hoja.getMaxColumns());
  var rng = hoja.getRange(1, 1, f, c);
  return { formulas: rng.getFormulas(), valores: rng.getValues(), filas: f, cols: c };
}
function celdaF(h, fila, col) { return (fila <= h.filas && col <= h.cols) ? h.formulas[fila - 1][col - 1] : ''; }
function celdaV(h, fila, col) { return (fila <= h.filas && col <= h.cols) ? h.valores[fila - 1][col - 1] : ''; }
function letraCol(n) { var s = ''; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; } return s; }

// Las tres fórmulas ponderadas del bloque de vendedor que arranca en 'fila0', como {fila: fórmula}.
// Nombres de función en INGLÉS y separador ";", que es como las guardan estas planillas.
function formulasVendedor(fila0) {
  var R = function (off) { return COL_DESDE + (fila0 + off) + ':' + COL_HASTA + (fila0 + off); };
  var tp = R(OFF.tpReal), venta = R(OFF.ventaReal), pxt = R(OFF.pxtReal), traf = R(OFF.traficoReal);
  // El IF() del divisor evita dividir por cero en las semanas sin TP; esas semanas ya quedan
  // anuladas por el (TP>0) de adelante, así que no suman nada.
  var tickets = 'SUMPRODUCT((' + tp + '>0)*' + venta + '/IF(' + tp + '>0;' + tp + ';1))';
  var ventaConTicket = 'SUMPRODUCT((' + tp + '>0)*' + venta + ')';
  var prendas = 'SUMPRODUCT((' + tp + '>0)*' + venta + '/IF(' + tp + '>0;' + tp + ';1)*' + pxt + ')';
  var res = {};
  res[fila0 + OFF.convReal] = '=IFERROR(' + tickets + '/SUM(' + traf + ');"")';
  res[fila0 + OFF.tpReal]   = '=IFERROR(' + ventaConTicket + '/' + tickets + ';"")';
  res[fila0 + OFF.pxtReal]  = '=IFERROR(' + prendas + '/' + tickets + ';"")';
  return res;
}

// "Total Sem" de la conversión de un bloque de la hoja Tráfico: pondera por el tráfico de cada día,
// que es exactamente Σ tickets / Σ tráfico. Mismo criterio que ya usa la tarjeta D4 de esa hoja.
function formulaConversionSemana(fila0) {
  var traf = DIA_DESDE + (fila0 + OFF_T.traficoReal) + ':' + DIA_HASTA + (fila0 + OFF_T.traficoReal);
  var conv = DIA_DESDE + (fila0 + OFF_T.convReal) + ':' + DIA_HASTA + (fila0 + OFF_T.convReal);
  return '=IFERROR(SUMPRODUCT((' + traf + '>0)*' + traf + '*' + conv + ')/SUMPRODUCT((' + traf + '>0)*' + traf + ');"")';
}

// Agrupa por hoja + etiqueta + forma de la fórmula, ocultando los números de fila para que dos
// bloques iguales en filas distintas cuenten como la misma variante.
function anotar(acc, hoja, etiqueta, formula) {
  var clave = hoja + ' · ' + String(etiqueta || '(sin etiqueta)').trim() + ' · ' +
              (String(formula).replace(/\d+/g, '#') || '(SIN FÓRMULA — valor fijo)');
  acc[clave] = (acc[clave] || 0) + 1;
}

// Ubica la columna "Total Sem" de un bloque de la hoja Tráfico buscando el texto en su encabezado,
// en vez de dar por sentada una letra: así no depende de cuántas columnas tenga cada semana.
function columnaTotal(h, filaCabecera) {
  for (var c = 1; c <= h.cols; c++) {
    if (String(celdaV(h, filaCabecera, c)).toLowerCase().indexOf('total') === 0) return c;
  }
  return 0;
}

// ── 1. AUDITORÍA — no escribe nada ────────────────────────────────
function auditarTotales() {
  var t0 = new Date(), variantes = {}, ejemploIV = [], ejemploTR = [], revisados = 0, corto = '';

  for (var L = 0; L < LOCALES.length; L++) {
    if (new Date() - t0 > LIMITE_MS) { corto = 'CORTADO por tiempo en el local ' + (L + 1) + ' de ' + LOCALES.length; break; }
    var local = LOCALES[L];
    try {
      var ss = SpreadsheetApp.openById(local.id);
      for (var m = 0; m < MESES.length; m++) {

        var shI = ss.getSheetByName(MESES[m] + ' Informe Vendedor');
        if (shI) {
          var hI = leerHojaEntera(shI, 110, 10);
          for (var v = 0; v < BLOQ_I.length; v++) {
            var filas = [BLOQ_I[v] + OFF.convReal, BLOQ_I[v] + OFF.tpReal, BLOQ_I[v] + OFF.pxtReal];
            for (var i = 0; i < filas.length; i++) {
              var etiqueta = celdaV(hI, filas[i], 2);
              var formula = celdaF(hI, filas[i], COL_TOTAL_N);
              anotar(variantes, 'Informe Vendedor', etiqueta, formula);
              revisados++;
              if (L === 0 && m === 0 && v === 0) {
                ejemploIV.push('  ' + COL_TOTAL + filas[i] + '  [' + etiqueta + ']\n     ' + (formula || '(SIN FÓRMULA, valor fijo: ' + celdaV(hI, filas[i], COL_TOTAL_N) + ')'));
              }
            }
          }
        }

        var shT = ss.getSheetByName(MESES[m] + ' Tráfico');
        if (shT) {
          var hT = leerHojaEntera(shT, 70, 14);
          for (var b = 0; b < BLOQ_T.length; b++) {
            var colTotal = columnaTotal(hT, BLOQ_T[b]);
            if (!colTotal) continue;
            [OFF_T.convReal, OFF_T.ticketReal].forEach(function (off) {
              var fila = BLOQ_T[b] + off;
              var etq = celdaV(hT, fila, 2), fml = celdaF(hT, fila, colTotal);
              anotar(variantes, 'Tráfico · Total Sem', etq, fml);
              revisados++;
              if (L === 0 && m === 0 && b === 0) {
                ejemploTR.push('  ' + letraCol(colTotal) + fila + '  [' + etq + ']\n     ' + (fml || '(SIN FÓRMULA, valor fijo: ' + celdaV(hT, fila, colTotal) + ')'));
              }
            });
          }
          if (L === 0 && m === 0) {
            for (var r = 1; r <= Math.min(12, hT.filas); r++) {
              for (var c3 = 1; c3 <= hT.cols; c3++) {
                var fc = celdaF(hT, r, c3);
                if (fc) ejemploTR.push('  TARJETA ' + letraCol(c3) + r + '\n     ' + fc);
              }
            }
          }
        }
      }
    } catch (e) {
      ejemploIV.push('  ERROR en ' + local.nombre + ': ' + e.message);
    }
  }

  var log = ['═══ AUDITORÍA DE TOTALES ═══',
             'Celdas revisadas: ' + revisados + '   ·   ' + ((new Date() - t0) / 1000).toFixed(0) + ' s'];
  if (corto) log.push('⚠ ' + corto);
  log.push('', '── Ejemplo: primer local, primer mes, primer vendedor (Informe Vendedor) ──');
  log = log.concat(ejemploIV.slice(0, 10));
  log.push('', '── Ejemplo: primer local, primer mes (hoja Tráfico) ──');
  log = log.concat(ejemploTR.slice(0, 40));
  log.push('', '── Variantes distintas en TODA la red (los números de fila van como #) ──');
  Object.keys(variantes).sort().forEach(function (k) { log.push('  ' + variantes[k] + ' celdas  ·  ' + k); });
  Logger.log(log.join('\n'));
}

// ── 2. CORRECCIÓN de Informe Vendedor ─────────────────────────────
function corregirInformeVendedor() {
  recorrerYCorregir('Informe Vendedor', function (ss, mes, log, cuenta) {
    var sh = ss.getSheetByName(mes + ' Informe Vendedor');
    if (!sh) return;
    var h = leerHojaEntera(sh, 110, 10);   // una sola lectura por hoja
    for (var v = 0; v < BLOQ_I.length; v++) {
      var fs = formulasVendedor(BLOQ_I[v]);
      for (var fila in fs) {
        aplicar(sh, COL_TOTAL + fila, celdaF(h, Number(fila), COL_TOTAL_N), fs[fila], log, cuenta, mes);
      }
    }
  });
}

// ── 3. CORRECCIÓN del "Total Sem" de conversión en la hoja Tráfico ─
// El Ticket promedio de esa hoja NO se toca: ya estaba ponderado (lo confirmó la auditoría).
function corregirTrafico() {
  recorrerYCorregir('Tráfico', function (ss, mes, log, cuenta) {
    var sh = ss.getSheetByName(mes + ' Tráfico');
    if (!sh) return;
    var h = leerHojaEntera(sh, 70, 14);
    for (var b = 0; b < BLOQ_T.length; b++) {
      var colTotal = columnaTotal(h, BLOQ_T[b]);
      if (!colTotal) continue;
      var fila = BLOQ_T[b] + OFF_T.convReal;
      var celda = letraCol(colTotal) + fila;
      aplicar(sh, celda, celdaF(h, fila, colTotal), formulaConversionSemana(BLOQ_T[b]), log, cuenta, mes);
    }
  });
}

// Escribe (o loguea) una celda. Una celda sin fórmula hoy es un total puesto a mano: pisarlo sería
// borrar algo que alguien cargó a propósito, así que se saltea y se cuenta aparte.
function aplicar(hoja, celda, formulaActual, formulaNueva, log, cuenta, mes) {
  if (!formulaActual) { cuenta.saltadas++; return; }
  if (MODO_PRUEBA) {
    if (cuenta.tocadas < 6) log.push('  ' + hoja.getParent().getName() + ' · ' + mes + ' · ' + celda + '\n     ' + formulaNueva);
  } else {
    hoja.getRange(celda).setFormula(formulaNueva);
  }
  cuenta.tocadas++;
}

// Recorre los 14 locales × 6 meses llamando a 'porMes', con el corte de tiempo y el log armados
// una sola vez para las dos correcciones.
function recorrerYCorregir(etiqueta, porMes) {
  var t0 = new Date(), cuenta = { tocadas: 0, saltadas: 0 }, log = [], corto = '';
  log.push('═══ CORRECCIÓN · ' + etiqueta + ' ═══',
           MODO_PRUEBA ? '*** MODO PRUEBA: no se escribe nada ***' : '*** ESCRIBIENDO DE VERDAD ***', '');
  for (var L = 0; L < LOCALES.length; L++) {
    if (new Date() - t0 > LIMITE_MS) { corto = 'CORTADO por tiempo en el local ' + (L + 1) + ' de ' + LOCALES.length; break; }
    try {
      var ss = SpreadsheetApp.openById(LOCALES[L].id);
      for (var m = 0; m < MESES.length; m++) porMes(ss, MESES[m], log, cuenta);
    } catch (e) {
      log.push('  ERROR en ' + LOCALES[L].nombre + ': ' + e.message);
    }
  }
  if (corto) log.push('', '⚠ ' + corto);
  log.push('', 'Celdas ' + (MODO_PRUEBA ? 'que se corregirían' : 'corregidas') + ': ' + cuenta.tocadas);
  log.push('Salteadas por no tener fórmula hoy: ' + cuenta.saltadas);
  log.push('Tiempo: ' + ((new Date() - t0) / 1000).toFixed(0) + ' s');
  if (MODO_PRUEBA) log.push('', 'Para aplicarlo de verdad: MODO_PRUEBA = false arriba y volver a correr.');
  Logger.log(log.join('\n'));
}

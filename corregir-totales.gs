/*  ════════════════════════════════════════════════════════════════
    VDH · CORRECCIÓN DE LOS TOTALES PONDERADOS EN LAS PLANILLAS
    Va en la planilla CONSOLIDADORA, como archivo APARTE de Código.gs.
    Reusa LOCALES, MESES, BLOQ_I y BLOQ_T de ahí.

    QUÉ ARREGLA
    Varias celdas de total promedian promedios, y eso le da el mismo peso
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

    Dos lugares distintos:
      · "[Mes] Informe Vendedor", columna Total/Prom de cada vendedor:
        las filas Conversión · real, TP · real y PxT · real.
        (Las filas "obj" están BIEN con PROMEDIO: son un valor mensual
        repetido en las 6 semanas. Y venta/tráfico/perfumes/boxer se
        suman, también bien. No se tocan.)
      · "[Mes] Tráfico", el "Total Sem" de cada semana y las tarjetas de
        arriba (CONVERSIÓN REAL / TICKET PROMEDIO / PRENDAS POR TICKET).

    OJO: nada de esto cambia un número del dashboard. El consolidador lee
    las celdas DIARIAS y SEMANALES, nunca las de total. Esto es para que
    la planilla deje de contradecir al dashboard cuando se miran las dos.

    POR QUÉ LEE POR HOJA Y NO POR CELDA
    La primera versión hacía un getFormula() por celda: unas 850 idas y
    vueltas a Drive, y se comía los 6 minutos de límite de Apps Script sin
    llegar a terminar (reportado el 2026-10-01). Ahora cada hoja se lee de
    una sola vez con getFormulas()/getValues() y todo lo demás se resuelve
    en memoria: pasa de ~850 llamadas a ~30.

    CÓMO USARLO
      1. auditarTotales()  — NO escribe nada. Recorre los 14 locales y deja
         en el Registro de ejecución qué fórmula hay hoy en cada celda que
         se tocaría, y cuántas variantes distintas hay en toda la red.
      2. Pasarme ese log. Si sale UNA variante por métrica, las planillas
         son idénticas y la corrección va parejo para todas.
      3. corregirInformeVendedor() — con MODO_PRUEBA en true (como viene)
         solo loguea lo que escribiría. Recién en false escribe.

    La parte de la hoja Tráfico todavía NO tiene función de corrección: la
    escribo cuando la auditoría me diga en qué columna y con qué fórmula
    están esos totales, porque ahí el armado no es igual en las dos hojas.

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
var COL_DESDE = 'C', COL_HASTA = 'H';     // las 6 semanas
var COL_TOTAL_N = 9;                      // I, como número de columna

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

// Las tres fórmulas ponderadas del bloque que arranca en 'fila0', como {fila: fórmula}.
function formulasVendedor(fila0) {
  var R = function (off) { return COL_DESDE + (fila0 + off) + ':' + COL_HASTA + (fila0 + off); };
  var tp = R(OFF.tpReal), venta = R(OFF.ventaReal), pxt = R(OFF.pxtReal), traf = R(OFF.traficoReal);
  // El SI() del divisor evita dividir por cero en las semanas sin TP; esas semanas ya quedan
  // anuladas por el (TP>0) de adelante, así que no suman nada.
  var tickets = 'SUMAPRODUCTO((' + tp + '>0)*' + venta + '/SI(' + tp + '>0;' + tp + ';1))';
  var ventaConTicket = 'SUMAPRODUCTO((' + tp + '>0)*' + venta + ')';
  var prendas = 'SUMAPRODUCTO((' + tp + '>0)*' + venta + '/SI(' + tp + '>0;' + tp + ';1)*' + pxt + ')';
  var res = {};
  res[fila0 + OFF.convReal] = '=SI.ERROR(' + tickets + '/SUMA(' + traf + ');"")';
  res[fila0 + OFF.tpReal]   = '=SI.ERROR(' + ventaConTicket + '/' + tickets + ';"")';
  res[fila0 + OFF.pxtReal]  = '=SI.ERROR(' + prendas + '/' + tickets + ';"")';
  return res;
}

// Agrupa por hoja + etiqueta + forma de la fórmula, ocultando los números de fila para que dos
// bloques iguales en filas distintas cuenten como la misma variante.
function anotar(acc, hoja, etiqueta, formula) {
  var clave = hoja + ' · ' + String(etiqueta || '(sin etiqueta)').trim() + ' · ' +
              (String(formula).replace(/\d+/g, '#') || '(SIN FÓRMULA — valor fijo)');
  acc[clave] = (acc[clave] || 0) + 1;
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

        // ── Informe Vendedor: columna Total/Prom ──
        var shI = ss.getSheetByName(MESES[m] + ' Informe Vendedor');
        if (shI) {
          var hI = leerHojaEntera(shI, 110, 10);
          for (var v = 0; v < BLOQ_I.length; v++) {
            var filas = [BLOQ_I[v] + OFF.convReal, BLOQ_I[v] + OFF.tpReal, BLOQ_I[v] + OFF.pxtReal];
            for (var i = 0; i < filas.length; i++) {
              var etiqueta = celdaV(hI, filas[i], 2);          // columna B
              var formula = celdaF(hI, filas[i], COL_TOTAL_N);
              anotar(variantes, 'Informe Vendedor', etiqueta, formula);
              revisados++;
              if (L === 0 && m === 0 && v === 0) {
                ejemploIV.push('  ' + COL_TOTAL + filas[i] + '  [' + etiqueta + ']\n     ' + (formula || '(SIN FÓRMULA, valor fijo: ' + celdaV(hI, filas[i], COL_TOTAL_N) + ')'));
              }
            }
          }
        }

        // ── Tráfico: el "Total Sem" de cada semana ──
        // La columna del total se busca por el texto del encabezado del bloque, no por una letra
        // fija: así no depende de cuántas columnas tenga cada semana.
        var shT = ss.getSheetByName(MESES[m] + ' Tráfico');
        if (shT) {
          var hT = leerHojaEntera(shT, 70, 14);
          for (var b = 0; b < BLOQ_T.length; b++) {
            var colTotal = 0;
            for (var c = 1; c <= hT.cols; c++) {
              if (String(celdaV(hT, BLOQ_T[b], c)).toLowerCase().indexOf('total') === 0) { colTotal = c; break; }
            }
            if (!colTotal) continue;
            // +3 conversión real, +4 ticket promedio real (mismo orden que lee leerLocal)
            for (var k = 3; k <= 4; k++) {
              var fila = BLOQ_T[b] + k;
              var etq = celdaV(hT, fila, 2), fml = celdaF(hT, fila, colTotal);
              anotar(variantes, 'Tráfico · Total Sem', etq, fml);
              revisados++;
              if (L === 0 && m === 0 && b === 0) {
                ejemploTR.push('  ' + letraCol(colTotal) + fila + '  [' + etq + ']\n     ' + (fml || '(SIN FÓRMULA, valor fijo: ' + celdaV(hT, fila, colTotal) + ')'));
              }
            }
          }
          // Tarjetas de arriba del primer local: se reporta toda celda con fórmula del encabezado,
          // para poder identificar cuál es CONVERSIÓN REAL / TICKET PROMEDIO / PRENDAS POR TICKET.
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
  log.push('', 'Si por cada métrica aparece UNA sola variante, las 14 planillas están armadas igual');
  log.push('y la corrección va parejo. Si aparecen varias, hay que mirar cuáles se desviaron.');
  Logger.log(log.join('\n'));
}

// ── 2. CORRECCIÓN de Informe Vendedor ─────────────────────────────
function corregirInformeVendedor() {
  var t0 = new Date(), tocadas = 0, saltadas = 0, log = [], corto = '';
  log.push(MODO_PRUEBA ? '*** MODO PRUEBA: no se escribe nada ***' : '*** ESCRIBIENDO DE VERDAD ***', '');

  for (var L = 0; L < LOCALES.length; L++) {
    if (new Date() - t0 > LIMITE_MS) { corto = 'CORTADO por tiempo en el local ' + (L + 1) + ' de ' + LOCALES.length; break; }
    var local = LOCALES[L];
    try {
      var ss = SpreadsheetApp.openById(local.id);
      for (var m = 0; m < MESES.length; m++) {
        var shI = ss.getSheetByName(MESES[m] + ' Informe Vendedor');
        if (!shI) continue;
        var hI = leerHojaEntera(shI, 110, 10);   // una sola lectura por hoja
        for (var v = 0; v < BLOQ_I.length; v++) {
          var fs = formulasVendedor(BLOQ_I[v]);
          for (var fila in fs) {
            // Una celda sin fórmula hoy es un total escrito a mano: pisarlo sería borrar algo
            // que alguien puso a propósito, así que se saltea y se cuenta aparte.
            if (!celdaF(hI, Number(fila), COL_TOTAL_N)) { saltadas++; continue; }
            if (MODO_PRUEBA) {
              if (tocadas < 6) log.push('  ' + local.nombre + ' · ' + MESES[m] + ' · ' + COL_TOTAL + fila + '\n     ' + fs[fila]);
            } else {
              shI.getRange(COL_TOTAL + fila).setFormula(fs[fila]);
            }
            tocadas++;
          }
        }
      }
    } catch (e) {
      log.push('  ERROR en ' + local.nombre + ': ' + e.message);
    }
  }
  if (corto) log.push('', '⚠ ' + corto);
  log.push('', 'Celdas ' + (MODO_PRUEBA ? 'que se corregirían' : 'corregidas') + ': ' + tocadas);
  log.push('Salteadas por no tener fórmula hoy: ' + saltadas);
  log.push('Tiempo: ' + ((new Date() - t0) / 1000).toFixed(0) + ' s');
  if (MODO_PRUEBA) log.push('', 'Para aplicarlo de verdad: MODO_PRUEBA = false arriba y volver a correr.');
  Logger.log(log.join('\n'));
}

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

// Desplazamiento de cada métrica desde el inicio del bloque del vendedor (BLOQ_I). Mismo mapa que
// usa leerLocal() en Código.gs: +0 Venta obj, +1 Venta real, +2 Tráfico obj, +3 Tráfico real,
// +4 Conv obj, +5 Conv real, +6 TP obj, +7 TP real, +8/+9 Perfumes, +10/+11 Boxer,
// +12 PxT obj, +13 PxT real.
var OFF = { ventaReal: 1, traficoReal: 3, convReal: 5, tpReal: 7, pxtReal: 13 };
var COL_TOTAL = 'I';                      // columna "Total/Prom" en Informe Vendedor
var COL_DESDE = 'C', COL_HASTA = 'H';     // las 6 semanas

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

// ── 1. AUDITORÍA — no escribe nada ────────────────────────────────
function auditarTotales() {
  var variantes = {}, ejemploIV = [], ejemploTR = [];

  for (var L = 0; L < LOCALES.length; L++) {
    var local = LOCALES[L];
    try {
      var ss = SpreadsheetApp.openById(local.id);
      for (var m = 0; m < MESES.length; m++) {

        // ── Informe Vendedor: columna Total/Prom ──
        var hI = ss.getSheetByName(MESES[m] + ' Informe Vendedor');
        if (hI) {
          for (var v = 0; v < BLOQ_I.length; v++) {
            var filas = [BLOQ_I[v] + OFF.convReal, BLOQ_I[v] + OFF.tpReal, BLOQ_I[v] + OFF.pxtReal];
            for (var i = 0; i < filas.length; i++) {
              var celda = COL_TOTAL + filas[i];
              var formula = hI.getRange(celda).getFormula();
              anotar(variantes, 'Informe Vendedor', hI.getRange('B' + filas[i]).getValue(), formula);
              if (L === 0 && m === 0 && v === 0) ejemploIV.push('  ' + celda + '  [' + hI.getRange('B' + filas[i]).getValue() + ']  ' + (formula || '(sin fórmula)'));
            }
          }
        }

        // ── Tráfico: el "Total Sem" de cada semana y las tarjetas de arriba ──
        // La columna del total se busca por el texto del encabezado del bloque, no por una letra
        // fija: así no depende de cuántas columnas tenga cada semana.
        var hT = ss.getSheetByName(MESES[m] + ' Tráfico');
        if (hT) {
          for (var b = 0; b < BLOQ_T.length; b++) {
            var cabecera = hT.getRange(BLOQ_T[b], 1, 1, 14).getValues()[0];
            var colTotal = 0;
            for (var c = 0; c < cabecera.length; c++) {
              if (String(cabecera[c]).toLowerCase().indexOf('total') === 0) { colTotal = c + 1; break; }
            }
            if (!colTotal) continue;
            // +3 conversión real, +4 ticket promedio real (mismo orden que lee leerLocal)
            [3, 4].forEach(function (off) {
              var rng = hT.getRange(BLOQ_T[b] + off, colTotal);
              var formula = rng.getFormula();
              anotar(variantes, 'Tráfico (Total Sem)', hT.getRange(BLOQ_T[b] + off, 2).getValue(), formula);
              if (L === 0 && m === 0 && b === 0) ejemploTR.push('  ' + rng.getA1Notation() + '  [' + hT.getRange(BLOQ_T[b] + off, 2).getValue() + ']  ' + (formula || '(sin fórmula)'));
            });
          }
          // Tarjetas de arriba: se escanea el bloque de encabezado y se reporta toda celda con
          // fórmula, para poder identificar cuál es CONVERSIÓN REAL / TICKET PROMEDIO / PxT.
          if (L === 0 && m === 0) {
            var cab = hT.getRange(1, 1, 12, 14).getFormulas();
            for (var r = 0; r < cab.length; r++) {
              for (var c2 = 0; c2 < cab[r].length; c2++) {
                if (cab[r][c2]) ejemploTR.push('  TARJETA ' + hT.getRange(r + 1, c2 + 1).getA1Notation() + '  ' + cab[r][c2]);
              }
            }
          }
        }
      }
    } catch (e) {
      ejemploIV.push('  ERROR en ' + local.nombre + ': ' + e.message);
    }
  }

  var log = ['═══ AUDITORÍA DE TOTALES ═══', '',
    '── Ejemplo: primer local, primer mes, primer vendedor (Informe Vendedor) ──'];
  log = log.concat(ejemploIV);
  log.push('', '── Ejemplo: primer local, primer mes (hoja Tráfico) ──');
  log = log.concat(ejemploTR.slice(0, 30));
  log.push('', '── Variantes distintas en TODA la red (los números de fila van como #) ──');
  Object.keys(variantes).sort().forEach(function (k) {
    log.push('  ' + variantes[k] + ' celdas  ·  ' + k);
  });
  log.push('', 'Si por cada métrica aparece UNA sola variante, las 14 planillas están armadas igual');
  log.push('y la corrección va parejo. Si aparecen varias, hay que mirar cuáles se desviaron.');
  Logger.log(log.join('\n'));
}

// Agrupa por hoja + etiqueta + forma de la fórmula, ocultando los números de fila para que dos
// bloques iguales en filas distintas cuenten como la misma variante.
function anotar(acc, hoja, etiqueta, formula) {
  var clave = hoja + ' · ' + String(etiqueta || '(sin etiqueta)').trim() + ' · ' +
              (String(formula).replace(/\d+/g, '#') || '(sin fórmula, valor fijo)');
  acc[clave] = (acc[clave] || 0) + 1;
}

// ── 2. CORRECCIÓN de Informe Vendedor ─────────────────────────────
function corregirInformeVendedor() {
  var tocadas = 0, saltadas = 0, log = [];
  log.push(MODO_PRUEBA ? '*** MODO PRUEBA: no se escribe nada ***' : '*** ESCRIBIENDO DE VERDAD ***', '');

  for (var L = 0; L < LOCALES.length; L++) {
    var local = LOCALES[L];
    try {
      var ss = SpreadsheetApp.openById(local.id);
      for (var m = 0; m < MESES.length; m++) {
        var hI = ss.getSheetByName(MESES[m] + ' Informe Vendedor');
        if (!hI) continue;
        for (var v = 0; v < BLOQ_I.length; v++) {
          var fs = formulasVendedor(BLOQ_I[v]);
          for (var fila in fs) {
            var celda = COL_TOTAL + fila;
            // Una celda sin fórmula hoy es un total escrito a mano: pisarlo sería borrar algo
            // que alguien puso a propósito, así que se saltea y se cuenta aparte.
            if (!hI.getRange(celda).getFormula()) { saltadas++; continue; }
            if (MODO_PRUEBA) {
              if (tocadas < 6) log.push('  ' + local.nombre + ' · ' + MESES[m] + ' · ' + celda + '\n     ' + fs[fila]);
            } else {
              hI.getRange(celda).setFormula(fs[fila]);
            }
            tocadas++;
          }
        }
      }
    } catch (e) {
      log.push('  ERROR en ' + local.nombre + ': ' + e.message);
    }
  }
  log.push('', 'Celdas ' + (MODO_PRUEBA ? 'que se corregirían' : 'corregidas') + ': ' + tocadas);
  log.push('Salteadas por no tener fórmula hoy: ' + saltadas);
  if (MODO_PRUEBA) log.push('', 'Para aplicarlo de verdad: MODO_PRUEBA = false arriba y volver a correr.');
  Logger.log(log.join('\n'));
}

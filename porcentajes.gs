/*  ════════════════════════════════════════════════════════════════
    VDH · PORCENTAJES DE DISTRIBUCIÓN SIN DECIMALES
    Va en la planilla CONSOLIDADORA, como archivo APARTE de Código.gs.
    Reusa LOCALES, MESES y BLOQ_V de ahí.

    QUÉ SE QUIERE
    Que los porcentajes del día y el de la semana queden en número redondo,
    sin decimales, en "[Mes] Ventas" de los 14 locales.

    POR QUÉ PRIMERO SE AUDITA
    "Sin decimales" puede ser dos cosas muy distintas, y el arreglo no se
    parece en nada:
      · FORMATO — la celda vale 0,184 y se muestra "18%". El total ya suma
        bien, solo que lo que ves está redondeado. Se arregla con el formato
        de número y no se toca ningún valor.
      · VALOR — la celda vale 0,184 de verdad. Redondearla a 0,18 CAMBIA el
        objetivo de ese día, porque el objetivo diario se calcula como
        objetivo mensual × % de la semana × % del día. Y si los 7 días
        dejan de sumar 100%, el objetivo de la semana deja de cerrar.
    Además hay que saber si son valores tipeados o fórmulas: redondear el
    valor de una celda con fórmula la borra.

    Por eso esta primera función solo MIRA. Con lo que devuelva se decide
    qué hacer y recién ahí se escribe.

    DÓNDE ESTÁN
    La fila de porcentajes es la primera de cada bloque semanal de la hoja
    "Ventas" — o sea BLOQ_V (24, 35, 46, 57, 68, 79), la fila que el
    consolidador NO lee: él arranca en BLOQ_V[b]+1, que son los días.
    Columnas C a I los días, J el total de la semana. La auditoría igual
    barre hasta K para ver el contexto, y confirma la ubicación sola.
    ════════════════════════════════════════════════════════════════ */

var COL_PCT_DESDE = 3;   // C
var COL_PCT_HASTA = 11;  // K

// ── AUDITORÍA — no escribe nada ───────────────────────────────────
function auditarPorcentajes() {
  var variantes = {}, ejemplo = [], conDecimales = [], revisados = 0;

  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var ss = SpreadsheetApp.openById(LOCALES[L].id);
      for (var m = 0; m < MESES.length; m++) {
        var sh = ss.getSheetByName(MESES[m] + ' Ventas');
        if (!sh) continue;
        var ultima = BLOQ_V[BLOQ_V.length - 1];
        var rng = sh.getRange(1, 1, Math.min(ultima + 2, sh.getMaxRows()), Math.min(COL_PCT_HASTA, sh.getMaxColumns()));
        var valores = rng.getValues(), formulas = rng.getFormulas(), formatos = rng.getNumberFormats();

        for (var b = 0; b < BLOQ_V.length; b++) {
          var fila = BLOQ_V[b];
          if (fila > valores.length) continue;
          for (var c = COL_PCT_DESDE; c <= Math.min(COL_PCT_HASTA, valores[0].length); c++) {
            var v = valores[fila - 1][c - 1], f = formulas[fila - 1][c - 1], fmt = formatos[fila - 1][c - 1];
            if (v === '' && !f) continue;
            revisados++;
            // Se agrupa por "es fórmula o no" + formato, con los números de fila ocultos, para ver
            // de un vistazo si las 14 planillas están armadas igual.
            anotarPct(variantes, (f ? 'FÓRMULA ' + String(f).replace(/\d+/g, '#') : 'valor fijo') + '  ·  formato "' + fmt + '"');
            // Un valor con decimales escondidos: 0,184 se ve como 18% pero NO es 18%.
            if (typeof v === 'number' && v !== 0 && Math.abs(v * 100 - Math.round(v * 100)) > 1e-9) {
              if (conDecimales.length < 12) {
                conDecimales.push(LOCALES[L].nombre + ' · ' + MESES[m] + ' · ' + letraDeCol(c) + fila +
                                  ' = ' + (v * 100).toFixed(4) + '%  (se ve como ' + Math.round(v * 100) + '%)');
              }
            }
            if (L === 0 && m === 0 && b === 0) {
              ejemplo.push('  ' + letraDeCol(c) + fila + '  valor=' + v +
                           (typeof v === 'number' ? '  (' + (v * 100).toFixed(4) + '%)' : '') +
                           '  formato="' + fmt + '"' + (f ? '  fórmula=' + f : '  (sin fórmula)'));
            }
          }
          // La fila de abajo son los días, sirve para confirmar que estamos parados donde creemos.
          if (L === 0 && m === 0 && b === 0 && fila < valores.length) {
            ejemplo.push('  --- fila ' + (fila + 1) + ' (los días, para ubicarse): ' +
                         valores[fila].slice(2, 10).join(' | '));
          }
        }
      }
    } catch (e) {
      ejemplo.push('  ERROR en ' + LOCALES[L].nombre + ': ' + e.message);
    }
  }

  var log = ['═══ PORCENTAJES DE DISTRIBUCIÓN ═══', 'Celdas revisadas: ' + revisados, '',
             '── Primer local, primer mes, Semana 1 (fila ' + BLOQ_V[0] + ') ──'];
  log = log.concat(ejemplo);
  log.push('', '── Variantes en TODA la red ──');
  Object.keys(variantes).sort().forEach(function (k) { log.push('  ' + variantes[k] + ' celdas  ·  ' + k); });
  log.push('', '── Celdas cuyo VALOR tiene decimales (se ven redondas pero no lo son) ──');
  log = log.concat(conDecimales.length ? conDecimales : ['  Ninguna: los valores ya son porcentajes enteros.']);
  log.push('', 'Si acá no aparece ninguna, el tema es solo de FORMATO y se arregla sin tocar un solo número.');
  log.push('Si aparecen, hay que decidir: redondearlas cambia el objetivo de esos días.');
  Logger.log(log.join('\n'));
}

function letraDeCol(n) { var s = ''; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; } return s; }

function anotarPct(acc, clave) { acc[clave] = (acc[clave] || 0) + 1; }

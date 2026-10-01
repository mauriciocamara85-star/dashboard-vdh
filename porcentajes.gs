/*  ════════════════════════════════════════════════════════════════
    VDH · PORCENTAJES DE DISTRIBUCIÓN SIN DECIMALES
    Va en la planilla CONSOLIDADORA, como archivo APARTE de Código.gs.
    Reusa LOCALES, MESES y BLOQ_V de ahí.

    QUÉ HACE
    Deja en número entero todos los porcentajes de objetivo de la hoja
    "[Mes] Ventas" de los 14 locales: el % de cada DÍA dentro de su semana
    y el % de cada SEMANA dentro del mes. Todas las semanas de todos los
    meses de todas las planillas.

    EL PROBLEMA QUE ARREGLA
    La celda mostraba 22% pero valía 21,69%, y el objetivo se calculaba con
    el 21,69 — así que el número que se veía no era el que se usaba.
    Parque Brown, Semana 2 de octubre: $9.470.940 en vez de los $9.606.301
    que daría un 22% real.

    DÓNDE ESTÁN
    La primera fila de cada bloque semanal de "Ventas": BLOQ_V (24, 35, 46,
    57, 68, 79). El consolidador NO lee esa fila, arranca en BLOQ_V[b]+1.
    Columnas C a I los días, J el porcentaje de la semana.

    POR QUÉ NO REDONDEA CADA CELDA POR SU CUENTA
    Redondeando una por una, un grupo que sumaba 100% puede terminar en 99
    o 101 — y eso mueve el objetivo de verdad. Medido sobre los datos
    reales: de 130 grupos, 6 se desarman, y el peor es Unicenter de
    septiembre, que perdería $425.565 de objetivo. Así que se redondea el
    grupo entero y el punto que sobra o falta se le da a la celda cuyo
    decimal estaba más cerca del límite (método de resto mayor). Resultado:
    todas las celdas quedan enteras —que es lo pedido— y el mes sigue
    repartiendo 100%.
    Nunca se toca una celda que vale 0: un día cerrado no puede pasar a 1%.

    FÓRMULAS
    Son valores que carga el equipo a mano (confirmado el 2026-10-02), así
    que esto no debería saltar nunca. Igual, si alguna celda tuviera
    fórmula, NO se toca y se reporta aparte: escribirle un número encima la
    borraría. Si llegaran a aparecer muchas, querría decir que el porcentaje
    se calcula a partir del objetivo y no al revés, y el arreglo habría que
    hacerlo del otro lado.

    CÓMO USARLO
      1. auditarPorcentajes()   — no escribe, muestra qué hay y qué haría.
      2. redondearPorcentajes() — con MODO_PRUEBA_PCT en true solo loguea;
         en false escribe.
    ════════════════════════════════════════════════════════════════ */

// true = no escribe nada, solo loguea. Poner en false recién después de ver la lista.
var MODO_PRUEBA_PCT = true;

var COL_DIA_DESDE = 3;   // C
var COL_DIA_HASTA = 9;   // I  — los 7 días
var COL_SEMANA = 10;     // J  — el % de la semana dentro del mes
var FORMATO_PCT = '0%';

// Redondea un grupo de porcentajes a enteros conservando la suma original.
// `valores` son fracciones (0,2169). Devuelve enteros en puntos (22), o null si el grupo está vacío.
// El resto se reparte solo entre las celdas con valor > 0, para que un día cerrado no pase a 1%.
function redondearGrupo(valores) {
  var pts = valores.map(function (v) { return (Number(v) || 0) * 100; });
  var total = pts.reduce(function (a, b) { return a + b; }, 0);
  if (!total) return null;
  var objetivo = Math.round(total);
  var piso = pts.map(function (p) { return Math.floor(p); });
  var sobra = objetivo - piso.reduce(function (a, b) { return a + b; }, 0);
  var orden = pts.map(function (p, i) { return { i: i, frac: p - Math.floor(p), val: p }; })
                 .filter(function (x) { return x.val > 0; })
                 .sort(function (a, b) { return b.frac - a.frac; });
  var out = piso.slice();
  for (var k = 0; k < sobra && orden.length; k++) out[orden[k % orden.length].i]++;
  // Si sobra fuera negativo (los pisos se pasaron, no debería), se saca del de menor decimal.
  for (var k2 = 0; k2 > sobra && orden.length; k2--) {
    var idx = orden[orden.length - 1 - ((-k2) % orden.length)].i;
    if (out[idx] > 0) out[idx]--;
  }
  return out;
}

function letraDeCol(n) { var s = ''; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; } return s; }

// Recorre los 14 locales × meses × bloques y llama a `porGrupo` con cada grupo de celdas.
// Un "grupo" es: los días de una semana, o la columna J de las 6 semanas. Devuelve el log.
function recorrerPorcentajes(porGrupo) {
  var log = [], conFormula = 0, sinCerrar = [];
  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var ss = SpreadsheetApp.openById(LOCALES[L].id);
      for (var m = 0; m < MESES.length; m++) {
        var sh = ss.getSheetByName(MESES[m] + ' Ventas');
        if (!sh) continue;
        var alto = Math.min(BLOQ_V[BLOQ_V.length - 1] + 2, sh.getMaxRows());
        var ancho = Math.min(COL_SEMANA, sh.getMaxColumns());
        var rng = sh.getRange(1, 1, alto, ancho);
        var valores = rng.getValues(), formulas = rng.getFormulas();
        var etiqueta = LOCALES[L].nombre + ' · ' + MESES[m];

        // Grupo por semana: los días C..I de la fila BLOQ_V[b]
        for (var b = 0; b < BLOQ_V.length; b++) {
          var fila = BLOQ_V[b];
          if (fila > alto) continue;
          var celdas = [];
          for (var c = COL_DIA_DESDE; c <= Math.min(COL_DIA_HASTA, ancho); c++) {
            celdas.push({ fila: fila, col: c, valor: valores[fila - 1][c - 1], formula: formulas[fila - 1][c - 1] });
          }
          var r1 = porGrupo(sh, celdas, etiqueta + ' · días Sem' + (b + 1));
          conFormula += r1.conFormula; if (r1.aviso) sinCerrar.push(r1.aviso);
        }

        // Grupo del mes: la columna J de las 6 semanas
        if (ancho >= COL_SEMANA) {
          var celdasSem = [];
          for (var b2 = 0; b2 < BLOQ_V.length; b2++) {
            if (BLOQ_V[b2] > alto) continue;
            celdasSem.push({ fila: BLOQ_V[b2], col: COL_SEMANA, valor: valores[BLOQ_V[b2] - 1][COL_SEMANA - 1], formula: formulas[BLOQ_V[b2] - 1][COL_SEMANA - 1] });
          }
          var r2 = porGrupo(sh, celdasSem, etiqueta + ' · semanas del mes');
          conFormula += r2.conFormula; if (r2.aviso) sinCerrar.push(r2.aviso);
        }
      }
    } catch (e) {
      log.push('ERROR en ' + LOCALES[L].nombre + ': ' + e.message);
    }
  }
  return { log: log, conFormula: conFormula, sinCerrar: sinCerrar };
}

// ── 1. AUDITORÍA ──────────────────────────────────────────────────
function auditarPorcentajes() {
  var cambios = [], total = 0;
  var res = recorrerPorcentajes(function (sh, celdas, etiqueta) {
    var conFormula = celdas.filter(function (c) { return !!c.formula; }).length;
    if (conFormula) return { conFormula: conFormula, aviso: null };
    var nuevos = redondearGrupo(celdas.map(function (c) { return c.valor; }));
    if (!nuevos) return { conFormula: 0, aviso: null };
    celdas.forEach(function (c, i) {
      var viejo = (Number(c.valor) || 0) * 100;
      if (Math.abs(viejo - nuevos[i]) > 1e-9) {
        total++;
        if (cambios.length < 15) cambios.push('  ' + etiqueta + ' · ' + letraDeCol(c.col) + c.fila +
          ': ' + viejo.toFixed(2) + '%  ->  ' + nuevos[i] + '%');
      }
    });
    return { conFormula: 0, aviso: null };
  });

  var log = ['═══ PORCENTAJES: QUÉ SE CAMBIARÍA ═══', '',
             'Celdas con decimales que se redondearían: ' + total,
             'Celdas que son FÓRMULA (no se tocan): ' + res.conFormula, ''];
  if (res.conFormula) {
    log.push('⚠ Hay fórmulas. Si son muchas, el % se calcula a partir del objetivo y no al revés:',
             '  redondear el % no cambiaría nada y habría que ir por los objetivos.', '');
  }
  log.push('── Primeros cambios ──');
  log = log.concat(cambios.length ? cambios : ['  Ninguno: ya están todos en entero.']);
  log = log.concat(res.log);
  log.push('', 'Si cierra: MODO_PRUEBA_PCT = false y correr redondearPorcentajes().');
  Logger.log(log.join('\n'));
}

// ── 2. REDONDEO ───────────────────────────────────────────────────
function redondearPorcentajes() {
  var t0 = new Date(), escritas = 0, grupos = 0;
  var res = recorrerPorcentajes(function (sh, celdas, etiqueta) {
    var conFormula = celdas.filter(function (c) { return !!c.formula; }).length;
    if (conFormula) return { conFormula: conFormula, aviso: null };   // grupo con fórmulas: se saltea entero
    var nuevos = redondearGrupo(celdas.map(function (c) { return c.valor; }));
    if (!nuevos) return { conFormula: 0, aviso: null };
    grupos++;
    celdas.forEach(function (c, i) {
      var viejo = (Number(c.valor) || 0) * 100;
      if (Math.abs(viejo - nuevos[i]) <= 1e-9) return;
      escritas++;
      if (!MODO_PRUEBA_PCT) {
        var celda = sh.getRange(c.fila, c.col);
        celda.setValue(nuevos[i] / 100);
        celda.setNumberFormat(FORMATO_PCT);   // así tampoco puede volver a MOSTRAR decimales
      }
    });
    return { conFormula: 0, aviso: null };
  });

  var log = [MODO_PRUEBA_PCT ? '*** MODO PRUEBA: no se escribe nada ***' : '*** ESCRIBIENDO DE VERDAD ***', '',
             'Grupos procesados: ' + grupos,
             'Celdas ' + (MODO_PRUEBA_PCT ? 'que se redondearían' : 'redondeadas') + ': ' + escritas,
             'Celdas con fórmula, salteadas: ' + res.conFormula,
             'Tiempo: ' + ((new Date() - t0) / 1000).toFixed(0) + ' s'];
  log = log.concat(res.log);
  if (MODO_PRUEBA_PCT) log.push('', 'Para aplicarlo: MODO_PRUEBA_PCT = false y correr de nuevo.');
  Logger.log(log.join('\n'));
}

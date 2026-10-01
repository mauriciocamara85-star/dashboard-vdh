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

    LOS GRUPOS QUE NO DAN 100%
    Cada celda se redondea sola, sin compensar con las vecinas. Eso hace que
    un grupo que sumaba 100% pueda terminar en 99 o 101: medido sobre los
    datos reales, pasa en 6 de 130 grupos. En esos casos el script NO
    acomoda nada por su cuenta —repartir el punto que falta en otra celda
    sería cambiar un objetivo que nadie pidió cambiar— sino que AVISA: los
    lista en el log y los muestra en un cartel al terminar, con el local, el
    mes y la semana, para que alguien ajuste a mano el punto donde
    corresponde.
    Una celda en 0 queda en 0: un día cerrado no puede terminar con 1%.

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

// Redondea cada porcentaje por su cuenta, sin compensar entre celdas.
// `valores` son fracciones (0,2169). Devuelve {valores: enteros en puntos, suma} o null si el grupo
// está vacío. Que la suma dé distinto de 100 NO se corrige acá: se reporta y lo ajusta una persona.
function redondearGrupo(valores) {
  var pts = valores.map(function (v) { return (Number(v) || 0) * 100; });
  if (!pts.reduce(function (a, b) { return a + b; }, 0)) return null;
  var out = pts.map(function (p) { return Math.round(p); });
  return { valores: out, suma: out.reduce(function (a, b) { return a + b; }, 0) };
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

// Corre el redondeo sobre todos los grupos. `escribir` decide si además de calcular se guarda.
// Devuelve el resumen, con la lista de los grupos que quedaron fuera de 100%.
function procesarPorcentajes(escribir) {
  var escritas = 0, grupos = 0, cambios = [], fueraDe100 = [];
  var res = recorrerPorcentajes(function (sh, celdas, etiqueta) {
    var conFormula = celdas.filter(function (c) { return !!c.formula; }).length;
    if (conFormula) return { conFormula: conFormula, aviso: null };   // grupo con fórmulas: se saltea entero
    var r = redondearGrupo(celdas.map(function (c) { return c.valor; }));
    if (!r) return { conFormula: 0, aviso: null };
    grupos++;
    if (r.suma !== 100) fueraDe100.push(etiqueta + ' → queda en ' + r.suma + '%');
    celdas.forEach(function (c, i) {
      var viejo = (Number(c.valor) || 0) * 100;
      if (Math.abs(viejo - r.valores[i]) <= 1e-9) return;
      escritas++;
      if (cambios.length < 15) cambios.push('  ' + etiqueta + ' · ' + letraDeCol(c.col) + c.fila +
        ': ' + viejo.toFixed(2) + '%  ->  ' + r.valores[i] + '%');
      if (escribir) {
        var celda = sh.getRange(c.fila, c.col);
        celda.setValue(r.valores[i] / 100);
        celda.setNumberFormat(FORMATO_PCT);   // así tampoco puede volver a MOSTRAR decimales
      }
    });
    return { conFormula: 0, aviso: null };
  });
  return { escritas: escritas, grupos: grupos, cambios: cambios, fueraDe100: fueraDe100,
           conFormula: res.conFormula, log: res.log };
}

// Arma las líneas del aviso de los grupos que no dan 100%, o [] si están todos bien.
function avisoFueraDe100(lista) {
  if (!lista.length) return [];
  return ['', '⚠️ HAY ' + lista.length + ' GRUPO(S) QUE NO DAN 100%',
          'Redondeando, estos quedaron en 99 o 101. El script NO los acomoda solo:',
          'hay que entrar y ajustar un punto a mano donde corresponda.', ''].concat(
          lista.map(function (x) { return '  • ' + x; }));
}

// Cartel al terminar. getUi() no existe cuando la función corre desde un disparador o sin planilla
// activa, así que va envuelto — mismo criterio que ya usa consolidar() en Código.gs. El log tiene
// siempre la misma información, el cartel es solo para que no se pase por alto.
function mostrarCartel(titulo, texto) {
  try { SpreadsheetApp.getUi().alert(titulo, texto, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) {}
}

// ── 1. AUDITORÍA ──────────────────────────────────────────────────
function auditarPorcentajes() {
  var r = procesarPorcentajes(false);
  var log = ['═══ PORCENTAJES: QUÉ SE CAMBIARÍA ═══', '',
             'Grupos revisados: ' + r.grupos,
             'Celdas con decimales que se redondearían: ' + r.escritas,
             'Celdas que son FÓRMULA (no se tocan): ' + r.conFormula];
  if (r.conFormula) {
    log.push('', '⚠ Hay fórmulas. Si son muchas, el % se calcula a partir del objetivo y no al revés:',
             '  redondear el % no cambiaría nada y habría que ir por los objetivos.');
  }
  log.push('', '── Primeros cambios ──');
  log = log.concat(r.cambios.length ? r.cambios : ['  Ninguno: ya están todos en entero.']);
  log = log.concat(avisoFueraDe100(r.fueraDe100)).concat(r.log);
  log.push('', 'Si cierra: MODO_PRUEBA_PCT = false y correr redondearPorcentajes().');
  Logger.log(log.join('\n'));

  if (r.fueraDe100.length) {
    mostrarCartel('Atención: ' + r.fueraDe100.length + ' grupo(s) no dan 100%',
      'Al redondear, estos quedan en 99 o 101 y hay que ajustarlos a mano:\n\n' +
      r.fueraDe100.join('\n') + '\n\nEl detalle completo está en el Registro de ejecución.');
  }
}

// ── 2. REDONDEO ───────────────────────────────────────────────────
function redondearPorcentajes() {
  var t0 = new Date();
  var r = procesarPorcentajes(!MODO_PRUEBA_PCT);
  var log = [MODO_PRUEBA_PCT ? '*** MODO PRUEBA: no se escribe nada ***' : '*** ESCRIBIENDO DE VERDAD ***', '',
             'Grupos procesados: ' + r.grupos,
             'Celdas ' + (MODO_PRUEBA_PCT ? 'que se redondearían' : 'redondeadas') + ': ' + r.escritas,
             'Celdas con fórmula, salteadas: ' + r.conFormula,
             'Tiempo: ' + ((new Date() - t0) / 1000).toFixed(0) + ' s'];
  log = log.concat(avisoFueraDe100(r.fueraDe100)).concat(r.log);
  if (MODO_PRUEBA_PCT) log.push('', 'Para aplicarlo: MODO_PRUEBA_PCT = false y correr de nuevo.');
  Logger.log(log.join('\n'));

  if (r.fueraDe100.length) {
    mostrarCartel('Atención: ' + r.fueraDe100.length + ' grupo(s) no dan 100%',
      (MODO_PRUEBA_PCT ? 'Si se aplica, estos quedan' : 'Estos quedaron') + ' en 99 o 101 y hay que ajustarlos a mano:\n\n' +
      r.fueraDe100.join('\n') + '\n\nEl detalle completo está en el Registro de ejecución.');
  }
}

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

    DESDE QUÉ MES
    Solo OCTUBRE en adelante (MES_DESDE_PCT). Septiembre ya está cerrado y
    reportado: cambiarle los porcentajes ahora movería objetivos de un mes que
    ya se informó, y el dashboard dejaría de coincidir con lo comunicado.
    Decidido el 2026-10-01.

    DÓNDE ESTÁN
    La primera fila de cada bloque semanal de "Ventas": BLOQ_V (24, 35, 46,
    57, 68, 79). El consolidador NO lee esa fila, arranca en BLOQ_V[b]+1.
    Columnas C a I los días, J el porcentaje de la semana.

    LOS GRUPOS QUE NO DAN 100%
    Cada celda se redondea sola, sin compensar con las vecinas. El script NO
    acomoda nada por su cuenta —repartir el punto que falta en otra celda
    sería cambiar un objetivo que nadie pidió cambiar— sino que AVISA, con el
    local, el mes y la semana, en el log y en un cartel al terminar.
    Medido sobre TODOS los meses (504 grupos, 525 celdas con decimales)
    quedaban 12 fuera de 100%; cuatro eran de septiembre, que ya no se toca.
    Son dos problemas distintos, así que el aviso los separa:

      · YA NO SUMABAN 100 ANTES — los porcentajes cargados no reparten el mes
        completo. Así se detectó: Caseros Septiembre daba 97% con 6 celdas, y
        el redondeo no puede mover la suma 3 puntos (como máximo medio punto
        por celda, y en empate Math.round va para arriba), así que ese 97 ya
        estaba. Es el caso grave: hay objetivo del mes que no llegó a ninguna
        semana.
      · POR EL REDONDEO — sumaban 100 y quedaron en 99 o 101. Se ajusta un
        punto a mano donde corresponda.

    Para poder distinguirlos, el aviso muestra siempre cuánto sumaba el grupo
    ANTES de redondear.
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

// Primer mes que se toca. Los anteriores están cerrados y reportados: ni se leen.
var MES_DESDE_PCT = 'Octubre';

var COL_DIA_DESDE = 3;   // C
var COL_DIA_HASTA = 9;   // I  — los 7 días
var COL_SEMANA = 10;     // J  — el % de la semana dentro del mes
var FORMATO_PCT = '0%';

// Redondea cada porcentaje por su cuenta, sin compensar entre celdas.
// `valores` son fracciones (0,2169). Devuelve {valores: enteros en puntos, suma, sumaOriginal} o
// null si el grupo está vacío. Que la suma dé distinto de 100 NO se corrige acá: se reporta y lo
// ajusta una persona. `sumaOriginal` es lo que hace falta para saber si la culpa es del redondeo o
// si el grupo ya venía sin cerrar.
function redondearGrupo(valores) {
  var pts = valores.map(function (v) { return (Number(v) || 0) * 100; });
  var original = pts.reduce(function (a, b) { return a + b; }, 0);
  if (!original) return null;
  var out = pts.map(function (p) { return Math.round(p); });
  return { valores: out, suma: out.reduce(function (a, b) { return a + b; }, 0), sumaOriginal: original };
}

function letraDeCol(n) { var s = ''; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; } return s; }

// Recorre los 14 locales × meses × bloques y llama a `porGrupo` con cada grupo de celdas.
// Un "grupo" es: los días de una semana, o la columna J de las 6 semanas. Devuelve el log.
function recorrerPorcentajes(porGrupo) {
  var log = [], conFormula = 0;
  // Si MES_DESDE_PCT estuviera mal escrito, indexOf da -1 y el recorrido arrancaría en Septiembre,
  // que es justo lo que no hay que tocar. Mejor cortar acá con un error claro que escribir de más.
  var desdeMes = MESES.indexOf(MES_DESDE_PCT);
  if (desdeMes < 0) throw new Error('MES_DESDE_PCT = "' + MES_DESDE_PCT + '" no está en MESES (' + MESES.join(', ') + ').');

  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var ss = SpreadsheetApp.openById(LOCALES[L].id);
      for (var m = desdeMes; m < MESES.length; m++) {
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
          conFormula += porGrupo(sh, celdas, etiqueta + ' · días Sem' + (b + 1)).conFormula;
        }

        // Grupo del mes: la columna J de las 6 semanas
        if (ancho >= COL_SEMANA) {
          var celdasSem = [];
          for (var b2 = 0; b2 < BLOQ_V.length; b2++) {
            if (BLOQ_V[b2] > alto) continue;
            celdasSem.push({ fila: BLOQ_V[b2], col: COL_SEMANA, valor: valores[BLOQ_V[b2] - 1][COL_SEMANA - 1], formula: formulas[BLOQ_V[b2] - 1][COL_SEMANA - 1] });
          }
          conFormula += porGrupo(sh, celdasSem, etiqueta + ' · semanas del mes').conFormula;
        }
      }
    } catch (e) {
      log.push('ERROR en ' + LOCALES[L].nombre + ': ' + e.message);
    }
  }
  return { log: log, conFormula: conFormula };
}

// Un grupo puede no dar 100% por dos motivos que piden arreglos distintos, así que no se mezclan:
//   · yaFallaban   — los porcentajes cargados YA no sumaban 100: hay objetivo del mes que no le
//                    llegó a ninguna semana. Es un error de carga y hay que revisarlo.
//   · porRedondeo  — sumaban 100 y el redondeo los dejó en 99 o 101. Se ajusta un punto a mano.
// El corte va en medio punto porque eso es lo máximo que el redondeo de UNA celda puede mover la
// suma; si la diferencia es mayor, el grupo ya venía sin cerrar.
function clasificarFueraDe100(r, etiqueta, yaFallaban, porRedondeo) {
  var linea = etiqueta + ' → antes sumaba ' + r.sumaOriginal.toFixed(2) + '%, queda en ' + r.suma + '%';
  (Math.abs(r.sumaOriginal - 100) > 0.5 ? yaFallaban : porRedondeo).push(linea);
}

// Corre el redondeo sobre todos los grupos. `escribir` decide si además de calcular se guarda.
// Devuelve el resumen, con los grupos que quedaron fuera de 100% separados por motivo.
function procesarPorcentajes(escribir) {
  var escritas = 0, grupos = 0, cambios = [], yaFallaban = [], porRedondeo = [];
  var res = recorrerPorcentajes(function (sh, celdas, etiqueta) {
    var conFormula = celdas.filter(function (c) { return !!c.formula; }).length;
    if (conFormula) return { conFormula: conFormula };   // grupo con fórmulas: se saltea entero
    var r = redondearGrupo(celdas.map(function (c) { return c.valor; }));
    if (!r) return { conFormula: 0 };
    grupos++;
    if (r.suma !== 100) clasificarFueraDe100(r, etiqueta, yaFallaban, porRedondeo);
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
    return { conFormula: 0 };
  });
  return { escritas: escritas, grupos: grupos, cambios: cambios, conFormula: res.conFormula,
           yaFallaban: yaFallaban, porRedondeo: porRedondeo, log: res.log };
}

// Arma las líneas del aviso para el log, separadas por motivo. [] si está todo bien.
function avisoFueraDe100(r) {
  var out = [], vinetas = function (l) { return l.map(function (x) { return '  • ' + x; }); };
  if (r.yaFallaban.length) {
    out = out.concat(['', '⚠️ ' + r.yaFallaban.length + ' GRUPO(S) QUE YA NO SUMABAN 100% ANTES DE TOCAR NADA',
      'Esto NO es el redondeo: los porcentajes cargados no reparten el mes completo,',
      'así que hay objetivo que no le llegó a ninguna semana. Revisar la carga.', ''],
      vinetas(r.yaFallaban));
  }
  if (r.porRedondeo.length) {
    out = out.concat(['', '⚠️ ' + r.porRedondeo.length + ' GRUPO(S) QUE EL REDONDEO DEJA EN 99 O 101',
      'Sumaban 100%. El script NO los acomoda solo: ajustar un punto a mano.', ''],
      vinetas(r.porRedondeo));
  }
  return out;
}

// El mismo aviso, en la ventana. `aplicado` solo cambia el tiempo verbal.
function cartelFueraDe100(r, aplicado) {
  var total = r.yaFallaban.length + r.porRedondeo.length;
  if (!total) return;
  var partes = [];
  if (r.yaFallaban.length) {
    partes.push('YA NO SUMABAN 100% — no es el redondeo, falta repartir objetivo:\n\n' +
                r.yaFallaban.join('\n'));
  }
  if (r.porRedondeo.length) {
    partes.push((aplicado ? 'QUEDARON' : 'QUEDARÍAN') + ' EN 99 O 101 POR EL REDONDEO — ajustar un punto a mano:\n\n' +
                r.porRedondeo.join('\n'));
  }
  mostrarCartel('Atención: ' + total + ' grupo(s) no dan 100%',
    partes.join('\n\n──────────\n\n') + '\n\nEl detalle completo está en el Registro de ejecución.');
}

// Cartel al terminar, SIN bloquear.
// NO usar alert(): frena el script hasta que alguien aprieta OK, y si la planilla no está abierta
// en pantalla nadie lo aprieta nunca. El 2026-10-01 eso se comió los 6 minutos de ejecución y la
// corrida murió con "Exceeded maximum execution time" DESPUÉS de haber terminado todo el trabajo
// (log completo a los 71 s, error a los 6 min). showModelessDialog muestra la ventana y sigue.
// getUi() tampoco existe corriendo desde un disparador, así que va envuelto igual — mismo criterio
// que usa consolidar() en Código.gs. El log tiene siempre la misma información; el cartel es solo
// para que no se pase por alto.
function mostrarCartel(titulo, texto) {
  try {
    var html = HtmlService.createHtmlOutput(
      '<pre style="font:13px/1.5 Consolas,Menlo,monospace;white-space:pre-wrap;margin:0">' +
      String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>')
      .setWidth(620).setHeight(460);
    SpreadsheetApp.getUi().showModelessDialog(html, titulo);
  } catch (e) {}
}

// ── 1. AUDITORÍA ──────────────────────────────────────────────────
function auditarPorcentajes() {
  var r = procesarPorcentajes(false);
  var log = ['═══ PORCENTAJES: QUÉ SE CAMBIARÍA ═══', '',
             'Desde: ' + MES_DESDE_PCT + ' (los meses anteriores no se tocan)',
             'Grupos revisados: ' + r.grupos,
             'Celdas con decimales que se redondearían: ' + r.escritas,
             'Celdas que son FÓRMULA (no se tocan): ' + r.conFormula];
  if (r.conFormula) {
    log.push('', '⚠ Hay fórmulas. Si son muchas, el % se calcula a partir del objetivo y no al revés:',
             '  redondear el % no cambiaría nada y habría que ir por los objetivos.');
  }
  log.push('', '── Primeros cambios ──');
  log = log.concat(r.cambios.length ? r.cambios : ['  Ninguno: ya están todos en entero.']);
  log = log.concat(avisoFueraDe100(r)).concat(r.log);
  log.push('', 'Si cierra: MODO_PRUEBA_PCT = false y correr redondearPorcentajes().');
  Logger.log(log.join('\n'));
  cartelFueraDe100(r, false);
}

// ── 2. REDONDEO ───────────────────────────────────────────────────
function redondearPorcentajes() {
  var t0 = new Date();
  var r = procesarPorcentajes(!MODO_PRUEBA_PCT);
  var log = [MODO_PRUEBA_PCT ? '*** MODO PRUEBA: no se escribe nada ***' : '*** ESCRIBIENDO DE VERDAD ***', '',
             'Desde: ' + MES_DESDE_PCT + ' (los meses anteriores no se tocan)',
             'Grupos procesados: ' + r.grupos,
             'Celdas ' + (MODO_PRUEBA_PCT ? 'que se redondearían' : 'redondeadas') + ': ' + r.escritas,
             'Celdas con fórmula, salteadas: ' + r.conFormula,
             'Tiempo: ' + ((new Date() - t0) / 1000).toFixed(0) + ' s'];
  log = log.concat(avisoFueraDe100(r)).concat(r.log);
  if (MODO_PRUEBA_PCT) log.push('', 'Para aplicarlo: MODO_PRUEBA_PCT = false y correr de nuevo.');
  Logger.log(log.join('\n'));
  cartelFueraDe100(r, !MODO_PRUEBA_PCT);
}

/*  ════════════════════════════════════════════════════════════════
    VDH · OCULTAR LAS PESTAÑAS DE LOS MESES YA CERRADOS
    Va en la planilla CONSOLIDADORA, como archivo APARTE de Código.gs.
    Reusa LOCALES, MESES, NUM_MES y hoyReal() de ahí.

    PARA QUÉ
    Cada planilla termina con 25 pestañas y el mes en curso queda perdido
    entre las viejas. Los encargados no pueden ocultarlas ellos: las hojas
    están protegidas y Sheets considera "ocultar" como modificarlas, así que
    les sale "contactá al propietario". Corriendo esto como dueño, la
    protección no frena nada y NO se toca: las hojas siguen protegidas,
    solo dejan de verse.

    NO ROMPE EL CONSOLIDADOR
    Una hoja oculta se lee igual: getSheetByName() y getRange() no saben de
    visibilidad, eso es solo de la interfaz. Lo verificado el 2026-10-02.

    QUÉ OCULTA Y QUÉ NO
    Solo las hojas que empiezan con el nombre de un mes ANTERIOR al actual
    ("Septiembre Ventas", "Septiembre Tráfico", etc.). Nunca toca:
      · el mes en curso ni los que vienen después
      · "Informe Temporada" ni ninguna hoja que no arranque con un mes
      · nada, si al terminar no quedaría ninguna hoja visible

    CÓMO USARLO
      1. auditarOcultarMeses()  — no toca nada, lista qué ocultaría.
      2. ocultarMesesViejos()   — con MODO_PRUEBA_OCULTAR en true solo
         loguea; en false oculta de verdad.
      3. mostrarTodasLasHojas() — la vuelta atrás, por si hay que mirar un
         mes viejo. También corre como dueño, así que tampoco se traba.
    Se vuelve a correr cada vez que arranca un mes nuevo.
    ════════════════════════════════════════════════════════════════ */

// true = no oculta nada, solo loguea. Poner en false recién después de ver la lista.
var MODO_PRUEBA_OCULTAR = true;

// Devuelve los meses de MESES anteriores al actual. Si hoy cae fuera del semestre, da lista vacía
// y no se oculta nada: sin un "mes actual" claro, cualquier cosa que se oculte es a ciegas.
function mesesYaCerrados() {
  var mesActual = NUM_MES[hoyReal().getMonth()];
  var i = MESES.indexOf(mesActual);
  return i > 0 ? MESES.slice(0, i) : [];
}

// true si la hoja pertenece a uno de esos meses. Se compara con "<Mes> " y no solo con el nombre
// del mes, para agarrar las cuatro hojas (Ventas, Tráfico, Informe Vendedor, Seguimiento) sin
// tener que listarlas, y a la vez no confundirse con algo llamado "Septiembre" a secas.
function esHojaDeMes(nombre, meses) {
  for (var m = 0; m < meses.length; m++) {
    if (String(nombre).indexOf(meses[m] + ' ') === 0) return true;
  }
  return false;
}

// ── 1. AUDITORÍA — no toca nada ───────────────────────────────────
function auditarOcultarMeses() {
  var cerrados = mesesYaCerrados();
  var log = ['═══ QUÉ SE OCULTARÍA ═══',
             'Mes en curso: ' + (NUM_MES[hoyReal().getMonth()] || '(fuera del semestre)'),
             'Meses ya cerrados: ' + (cerrados.join(', ') || 'ninguno'), ''];
  if (!cerrados.length) {
    log.push('No hay meses anteriores que ocultar. Nada para hacer.');
    Logger.log(log.join('\n'));
    return;
  }

  var totalOcultar = 0;
  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var hojas = SpreadsheetApp.openById(LOCALES[L].id).getSheets();
      var ocultar = [], yaOcultas = [], quedan = 0;
      hojas.forEach(function (h) {
        var n = h.getName();
        if (esHojaDeMes(n, cerrados)) {
          if (h.isSheetHidden()) yaOcultas.push(n); else { ocultar.push(n); }
        } else if (!h.isSheetHidden()) quedan++;
      });
      totalOcultar += ocultar.length;
      log.push(LOCALES[L].nombre + ': oculta ' + ocultar.length +
               (yaOcultas.length ? ' (ya estaban ocultas ' + yaOcultas.length + ')' : '') +
               ' · quedan visibles ' + quedan);
      if (L === 0 && ocultar.length) log.push('   ej: ' + ocultar.join(', '));
    } catch (e) {
      log.push(LOCALES[L].nombre + ': ERROR — ' + e.message);
    }
  }
  log.push('', 'Total a ocultar: ' + totalOcultar + ' hojas en ' + LOCALES.length + ' planillas.');
  log.push('Si la lista cierra: MODO_PRUEBA_OCULTAR = false y correr ocultarMesesViejos().');
  Logger.log(log.join('\n'));
}

// ── 2. OCULTAR ────────────────────────────────────────────────────
function ocultarMesesViejos() {
  var cerrados = mesesYaCerrados();
  if (!cerrados.length) { Logger.log('No hay meses anteriores al actual. No se oculta nada.'); return; }

  var t0 = new Date(), ocultadas = 0, log = [];
  log.push(MODO_PRUEBA_OCULTAR ? '*** MODO PRUEBA: no se oculta nada ***' : '*** OCULTANDO DE VERDAD ***',
           'Meses: ' + cerrados.join(', '), '');

  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var hojas = SpreadsheetApp.openById(LOCALES[L].id).getSheets();
      var candidatas = hojas.filter(function (h) { return esHojaDeMes(h.getName(), cerrados) && !h.isSheetHidden(); });
      var visibles = hojas.filter(function (h) { return !h.isSheetHidden(); }).length;

      // Sheets no permite dejar un archivo sin ninguna hoja visible, y además sería un desastre
      // usable. Si por lo que sea las únicas visibles fueran meses viejos, se saltea el local
      // entero y se avisa, en vez de ocultar hasta la última y romperlo.
      if (visibles - candidatas.length < 1) {
        log.push(LOCALES[L].nombre + ': SALTEADO — quedaría sin ninguna hoja visible.');
        continue;
      }

      candidatas.forEach(function (h) {
        if (!MODO_PRUEBA_OCULTAR) h.hideSheet();
        ocultadas++;
      });
      log.push(LOCALES[L].nombre + ': ' + candidatas.length + ' hojas' +
               (candidatas.length ? ' (' + candidatas[0].getName() + (candidatas.length > 1 ? ', …' : '') + ')' : ''));
    } catch (e) {
      log.push(LOCALES[L].nombre + ': ERROR — ' + e.message);
    }
  }
  log.push('', 'Hojas ' + (MODO_PRUEBA_OCULTAR ? 'que se ocultarían' : 'ocultadas') + ': ' + ocultadas);
  log.push('Tiempo: ' + ((new Date() - t0) / 1000).toFixed(0) + ' s');
  if (MODO_PRUEBA_OCULTAR) log.push('', 'Para hacerlo de verdad: MODO_PRUEBA_OCULTAR = false y correr de nuevo.');
  Logger.log(log.join('\n'));
}

// ── 3. LA VUELTA ATRÁS ────────────────────────────────────────────
// Muestra TODAS las hojas de los 14 locales. Para cuando haga falta mirar un mes viejo, o si algo
// se ocultó de más. Los encargados no pueden hacerlo ellos (las hojas están protegidas), así que
// esta función es la forma de revertir.
function mostrarTodasLasHojas() {
  var mostradas = 0, log = ['*** MOSTRANDO TODAS LAS HOJAS ***', ''];
  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var n = 0;
      SpreadsheetApp.openById(LOCALES[L].id).getSheets().forEach(function (h) {
        if (h.isSheetHidden()) { h.showSheet(); n++; }
      });
      mostradas += n;
      log.push(LOCALES[L].nombre + ': ' + n + ' hojas vueltas a mostrar');
    } catch (e) {
      log.push(LOCALES[L].nombre + ': ERROR — ' + e.message);
    }
  }
  log.push('', 'Total: ' + mostradas);
  Logger.log(log.join('\n'));
}

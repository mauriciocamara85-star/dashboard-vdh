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
      4. soloMesActual()        — EL COMANDO DE TODOS LOS DÍAS: deja visible
         solo el mes en curso y oculta todos los demás, los que ya pasaron
         Y los que vienen. Sirve también para volver a ordenar después de
         un mostrarTodasLasHojas(). Va en el menú 🔄 VDH (ver abajo).
      5. activarCambioDeMes()   — se corre UNA vez: deja programado que
         soloMesActual() corra solo el día 1 de cada mes a las 6 de la
         mañana, así nadie se tiene que acordar.

    MENÚ: para tenerlo en el menú 🔄 VDH, en Código.gs, dentro de onOpen(),
    agregar esta línea antes de .addToUi():
        .addItem('Dejar visible solo el mes actual', 'soloMesActual')
    ════════════════════════════════════════════════════════════════ */

// true = no oculta nada, solo loguea. Poner en false recién después de ver la lista.
var MODO_PRUEBA_OCULTAR = false;

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

// ── 4. SOLO EL MES ACTUAL ─────────────────────────────────────────
// Deja visibles las hojas del mes en curso y oculta las de TODOS los otros meses del semestre,
// pasados y futuros (pedido 2026-10-06: ocultarMesesViejos() solo tocaba los anteriores, y después
// de un mostrarTodasLasHojas() quedaba todo abierto). Las hojas que no son de un mes ("Informe
// Temporada", "CONFIGURACIÓN", etc.) no se tocan. Primero MUESTRA el mes actual y recién después
// oculta el resto: así el archivo nunca queda sin ninguna hoja visible, que Sheets no permite.
// No usa MODO_PRUEBA: es reversible con mostrarTodasLasHojas() y es para correrlo seguido.
function soloMesActual() {
  var mesActual = NUM_MES[hoyReal().getMonth()];
  if (MESES.indexOf(mesActual) < 0) {
    Logger.log('Hoy no cae en ningún mes del semestre (' + MESES.join(', ') + '): no se toca nada.');
    return;
  }
  var otros = MESES.filter(function (m) { return m !== mesActual; });
  var t0 = new Date(), totalMostradas = 0, totalOcultadas = 0;
  var log = ['*** DEJANDO VISIBLE SOLO ' + mesActual.toUpperCase() + ' ***', ''];

  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var hojas = SpreadsheetApp.openById(LOCALES[L].id).getSheets();
      var mostradas = 0, ocultadas = 0;
      hojas.forEach(function (h) {
        if (esHojaDeMes(h.getName(), [mesActual]) && h.isSheetHidden()) { h.showSheet(); mostradas++; }
      });
      var hayVisibles = hojas.some(function (h) { return !h.isSheetHidden() && !esHojaDeMes(h.getName(), otros); });
      if (!hayVisibles) {
        // El local todavía no tiene las hojas del mes actual: ocultar el resto lo dejaría vacío.
        log.push(LOCALES[L].nombre + ': SALTEADO — no tiene hojas de ' + mesActual + ' y quedaría sin nada visible.');
        continue;
      }
      hojas.forEach(function (h) {
        if (esHojaDeMes(h.getName(), otros) && !h.isSheetHidden()) { h.hideSheet(); ocultadas++; }
      });
      totalMostradas += mostradas; totalOcultadas += ocultadas;
      log.push(LOCALES[L].nombre + ': ' + ocultadas + ' ocultadas' + (mostradas ? ' · ' + mostradas + ' de ' + mesActual + ' vueltas a mostrar' : ''));
    } catch (e) {
      log.push(LOCALES[L].nombre + ': ERROR — ' + e.message);
    }
  }
  log.push('', 'Total: ' + totalOcultadas + ' hojas ocultadas · ' + totalMostradas + ' mostradas · ' +
           ((new Date() - t0) / 1000).toFixed(0) + ' s');
  Logger.log(log.join('\n'));
  try { SpreadsheetApp.getActive().toast('Quedó visible solo ' + mesActual + ' en los ' + LOCALES.length + ' locales.', 'VDH', 8); } catch (e) {}
}

// ── 5. AUTOMÁTICO EL DÍA 1 DE CADA MES ────────────────────────────
// Se corre una sola vez. Borra un disparador anterior de soloMesActual (si lo hubiera) para no
// duplicarlo, y crea uno que corre el día 1 de cada mes a las 6.
function activarCambioDeMes() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'soloMesActual') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('soloMesActual').timeBased().onMonthDay(1).atHour(6).create();
  Logger.log('Listo: soloMesActual() va a correr solo el día 1 de cada mes, a las 6.');
}

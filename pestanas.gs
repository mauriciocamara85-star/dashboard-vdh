/*  ════════════════════════════════════════════════════════════════
    VDH · PESTAÑAS DE LAS PLANILLAS
    Va en la planilla CONSOLIDADORA, como archivo APARTE de Código.gs.
    Reusa LOCALES y MESES de ahí.

    PARA QUÉ
    Cuando alguien duplica una pestaña (el clásico "Septiembre Ventas (1)")
    y carga ahí, esa carga no existe para nadie: el consolidador lee las
    hojas por nombre exacto, así que ese trabajo se pierde en silencio.

    DOS FUNCIONES, EN ESTE ORDEN
      1. auditarPestanas()  — solo lectura. Lista TODAS las pestañas de los
         14 locales y arma el inventario: cuáles están en los 14 (esas son
         las oficiales) y cuáles aparecen en uno o dos (esas son las
         sospechosas). De ahí sale la lista de oficiales, con evidencia, en
         vez de adivinarla.
      2. avisarPestanasNuevas() — compara contra la última foto guardada y
         manda mail SOLO si apareció una pestaña que antes no estaba. Sin
         esto, corriendo cada hora, te llenaría la casilla y a la semana lo
         filtrarías. La primera corrida no avisa nada: guarda el punto de
         partida.

    POR QUÉ ACÁ Y NO EN CADA PLANILLA
    El consolidador ya abre las 14 planillas cada hora, así que detectar
    pestañas de más le sale gratis. Poner el código en cada local serían 14
    lugares para mantener y 14 pegadas por cada cambio. El aviso inmediato
    (onOpen/onEdit en la planilla) sí agarra a la persona en el momento y
    tiene su valor, pero conviene sumarlo DESPUÉS, si con el mail no alcanza.

    NO BORRA NADA. Una pestaña duplicada puede tener trabajo cargado adentro;
    borrarla automáticamente sería destruirlo sin que nadie lo mire.
    ════════════════════════════════════════════════════════════════ */

// A quién le llega el aviso de pestaña nueva. Es una lista aparte del MAIL general del control de
// carga a propósito: esto es un problema de estructura, no del día a día de los locales.
var MAIL_PESTANAS = 'mauriciocamara85@gmail.com,antonellamazza.vanderholl@gmail.com';

// ── 1. AUDITORÍA — no escribe nada ────────────────────────────────
// Sale la lista de oficiales POR EVIDENCIA: una pestaña que está en los 14 locales es parte del
// diseño; una que está en uno solo es, casi seguro, una copia.
function auditarPestanas() {
  var presencia = {}, porLocal = {}, errores = [];

  for (var L = 0; L < LOCALES.length; L++) {
    try {
      var hojas = SpreadsheetApp.openById(LOCALES[L].id).getSheets().map(function (h) { return h.getName(); });
      porLocal[LOCALES[L].nombre] = hojas;
      hojas.forEach(function (nombre) {
        if (!presencia[nombre]) presencia[nombre] = [];
        presencia[nombre].push(LOCALES[L].nombre);
      });
    } catch (e) {
      errores.push(LOCALES[L].nombre + ': ' + e.message);
    }
  }

  var total = LOCALES.length - errores.length;
  var enTodos = [], parciales = [];
  Object.keys(presencia).sort().forEach(function (n) {
    (presencia[n].length === total ? enTodos : parciales).push(n);
  });

  var log = ['═══ INVENTARIO DE PESTAÑAS ═══',
             total + ' locales leídos' + (errores.length ? ' (' + errores.length + ' con error)' : ''), ''];
  log.push('── En LOS ' + total + ' locales (' + enTodos.length + ') — estas son las oficiales ──');
  enTodos.forEach(function (n) { log.push('  ' + n); });
  log.push('', '── Solo en ALGUNOS (' + parciales.length + ') — acá están las sospechosas ──');
  if (!parciales.length) log.push('  Ninguna. Las 14 planillas tienen exactamente las mismas pestañas.');
  parciales.sort(function (a, b) { return presencia[a].length - presencia[b].length; })
    .forEach(function (n) {
      log.push('  "' + n + '"  ·  en ' + presencia[n].length + ' de ' + total + ': ' + presencia[n].join(', '));
    });
  log.push('', '── Cuántas pestañas tiene cada local ──');
  Object.keys(porLocal).forEach(function (l) { log.push('  ' + l + ': ' + porLocal[l].length); });
  if (errores.length) log.push('', '── Errores ──', '  ' + errores.join('\n  '));
  log.push('', 'Las de la lista de arriba van a OFICIALES; lo de abajo se revisa una por una antes',
           'de prender el aviso, para que el primer mail no venga lleno de falsos positivos.');
  Logger.log(log.join('\n'));
}

// ── 2. AVISO POR MAIL — solo cuando aparece una pestaña nueva ─────
// OFICIALES se completa DESPUÉS de mirar el inventario de auditarPestanas(). Mientras esté vacío,
// la función no manda nada: avisa en el log que primero hay que auditar, para no mandar un mail
// con las 25 pestañas legítimas de cada local marcadas como sospechosas.
var OFICIALES = [];   // ej: ['Informe Temporada', 'Control de porcentajes', ...]
var SUFIJOS_MES = ['Ventas', 'Tráfico', 'Informe Vendedor', 'Seguimiento'];   // A CONFIRMAR

function esOficial(nombre) {
  if (OFICIALES.indexOf(nombre) >= 0) return true;
  for (var m = 0; m < MESES.length; m++) {
    for (var s = 0; s < SUFIJOS_MES.length; s++) {
      if (nombre === MESES[m] + ' ' + SUFIJOS_MES[s]) return true;
    }
  }
  return false;
}

function avisarPestanasNuevas() {
  if (!OFICIALES.length) {
    Logger.log('OFICIALES está vacío: correr auditarPestanas() primero y completar la lista con lo que salga.');
    return;
  }
  var props = PropertiesService.getScriptProperties();
  var vistas = {};
  try { vistas = JSON.parse(props.getProperty('PESTANAS_VISTAS') || '{}'); } catch (e) { vistas = {}; }

  var ahora = {}, nuevas = [];
  for (var L = 0; L < LOCALES.length; L++) {
    var local = LOCALES[L];
    try {
      var sueltas = SpreadsheetApp.openById(local.id).getSheets()
        .map(function (h) { return h.getName(); })
        .filter(function (n) { return !esOficial(n); });
      ahora[local.nombre] = sueltas;
      var antes = vistas[local.nombre] || [];
      sueltas.forEach(function (n) {
        if (antes.indexOf(n) < 0) nuevas.push({ local: local.nombre, pestana: n });
      });
    } catch (e) {
      ahora[local.nombre] = vistas[local.nombre] || [];   // error de lectura: se mantiene la foto previa
    }
  }
  props.setProperty('PESTANAS_VISTAS', JSON.stringify(ahora));

  // Primera corrida: no hay con qué comparar, así que solo se guarda el punto de partida. Sin esto,
  // el primer mail avisaría de todas las pestañas sueltas que ya existen desde hace meses.
  if (!Object.keys(vistas).length) {
    Logger.log('Primera corrida: se guardó el punto de partida, sin avisar. Pestañas sueltas hoy: ' +
               JSON.stringify(ahora));
    return;
  }
  if (!nuevas.length) { Logger.log('Sin pestañas nuevas.'); return; }

  var filas = nuevas.map(function (x) {
    return '<tr><td style="padding:8px;border-bottom:1px solid #E2E8F0"><b>' + x.local +
           '</b></td><td style="padding:8px;border-bottom:1px solid #E2E8F0">' + x.pestana + '</td></tr>';
  }).join('');
  MailApp.sendEmail({
    to: MAIL_PESTANAS,
    subject: 'VDH · Pestaña nueva en ' + (nuevas.length === 1 ? 'una planilla' : nuevas.length + ' planillas'),
    htmlBody: '<div style="font-family:Arial,sans-serif;font-size:14px">' +
      '<h2 style="color:#0F172A;margin-bottom:4px">Pestaña fuera de las oficiales</h2>' +
      '<p style="color:#64748B;margin-top:0">Apareció desde el último control. Si es una copia, lo que ' +
      'se cargue ahí <b>no lo lee el consolidador</b> y no llega al dashboard.</p>' +
      '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">' +
      '<tr style="background:#0F172A;color:#fff;text-align:left">' +
      '<th style="padding:8px">Local</th><th style="padding:8px">Pestaña</th></tr>' + filas + '</table>' +
      '<p style="color:#94A3B8;font-size:12px;margin-top:16px">Antes de borrarla, mirá si tiene datos ' +
      'cargados: puede ser trabajo de alguien que se equivocó de pestaña.</p></div>'
  });
  Logger.log('Mail enviado a ' + MAIL_PESTANAS + ' por ' + nuevas.length + ' pestaña(s) nueva(s).');
}

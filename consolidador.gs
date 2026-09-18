/*  ════════════════════════════════════════════════════════════════
    VDH · CONSOLIDADOR  (v11)
    Va en la planilla CONSOLIDADORA.

    Lee los 15 locales + la planilla de e-commerce y arma tablas
    planas para el dashboard:

      LOCAL_DIARIO      · un renglón por día y local
      VENDEDOR_DIARIO   · un renglón por día, local y vendedor
      VENDEDOR_SEMANAL  · un renglón por semana, local y vendedor
      VENDEDOR_FOTOS    · foto diaria de las métricas semanales
      ECOM_DIARIO       · un renglón por día del e-commerce
      ECOM_SEMANAL      · embudo y Meta Ads por semana

    No modifica nada en los archivos de origen: sólo los lee.

    v5: LOCAL_DIARIO suma Efectivo / Tarjeta / Descuento (celdas
    I13:K13 de "[Mes] Ventas") y Conversión obj / Ticket obj
    (celdas I18 / K18, también en "[Mes] Ventas"). Son valores
    mensuales, se repiten iguales en cada día del mes.

    v6: VENDEDOR_DIARIO ya no reparte el objetivo del LOCAL entre
    quienes vendieron algo ese día puntual (dejaba a los que no
    vendieron nada sin registro, e inflaba a quien sí vendió con el
    objetivo de sus compañeros ausentes). Ahora cada vendedor usa SU
    PROPIO objetivo semanal (ya calculado en "Informe Vendedor")
    prorrateado por el % que ese día representa dentro del objetivo
    semanal del local — y se registra TODOS los días, aunque haya
    vendido $0. Limitación conocida y aceptada: no hay dato de
    franco/asistencia por persona en las planillas, así que un franco
    y un día flojo se ven igual (venta $0 vs. objetivo del día) — se
    deja así a propósito por ahora, ver conversación del 2026-08-23.

    v7: doGet() ahora sirve las tablas desde un caché en memoria
    (CacheService, 10 minutos) en vez de leer la planilla en CADA
    visita. Objetivo: si entra mucha gente junta (varios vendedores
    o supervisores al mismo tiempo), la ráfaga se sirve desde caché
    en vez de competir por el cupo de 30 ejecuciones simultáneas de
    Apps Script. consolidar() borra el caché al terminar, así el
    próximo pedido siempre trae lo último recién calculado sin
    esperar los 10 minutos. Como una tabla consolidada puede pesar
    más que el límite de 100KB por clave de CacheService, el caché
    se guarda partido en pedazos y se rearma al leer. El alert() de
    "Consolidado en X s" ahora solo aparece si hubo errores — corriendo
    bien y sin errores, "Consolidar ahora" ya no interrumpe con un
    cartel, el resumen sigue quedando en Ejecuciones igual.

    v8: VENDEDOR_SEMANAL ya no descarta al vendedor que todavía no
    vendió nada esta semana (antes, si venta/tráfico/conv/TP/perfumes/
    boxer/PxT real daban todos $0, esa fila ni se generaba — así un
    vendedor recién cargado en "Informe Vendedor" no podía identificarse
    en el ranking hasta su primera venta). Ahora el corte es por SEMANA
    YA INICIADA (semanaIniciada[]: al menos un día de esa semana con
    fecha <= hoy), no por venta — se sigue registrando la semana en
    curso aunque esté en $0, pero ya NO se generan filas fantasma de
    semanas/meses futuros que todavía ni arrancaron. (Antes de este
    ajuste sacar el filtro de $0 a secas rompió ranking-vdh: esa app
    define "semana actual" como la última semana presente en
    VENDEDOR_SEMANAL, y las semanas futuras en $0 pasaban a ser
    "la actual", dejando el ranking real vacío — ver conversación de
    2026-09-02.)

    v9: LOCAL_DIARIO ahora también trae "PxT real" y "PxT obj",
    leídos de "[Mes] Tráfico" (celda J4, que ya calcula el local ahí
    mismo como Q Prendas / Q Líneas con su propio IFERROR) y del
    objetivo fijo PXT_OBJETIVO. Igual que Efectivo/Conversión obj/
    Ticket obj: un valor mensual, se repite igual en cada día del mes.
    Sirve para que ranking-vdh saque Prendas por Ticket del LOCAL desde
    acá en vez de promediarlo entre vendedores. Ver conversación del
    2026-09-05.

    v10: consolidar() corría cada 2 horas, las 24 horas del día —
    de madrugada (locales cerrados) esas corridas no traían ningún
    dato nuevo, solo gastaban cuota de ejecución al pedo. Ahora:
      · El trigger automático pasa a correr cada 1 hora, pero a
        través de consolidarAutomatico() — que se salta la corrida
        entera (sin abrir ninguna de las 15 planillas) si la hora
        actual cae en la ventana de pausa (00:00 a 07:00). La última
        corrida automática del día queda a las 23:00, la primera del
        día siguiente a las 07:00.
        consolidar() en sí NO se toca: "Consolidar ahora" (menú) y
        el mail de las 22:00 (enviarResumenDiario) siguen corriendo
        siempre, sin importar la hora — el filtro es solo para el
        trigger automático.
      · consolidar() ahora toma un LockService al empezar: si dos
        corridas llegaran a superponerse (ej. el trigger dispara
        justo cuando alguien clickeó "Consolidar ahora"), la segunda
        se salta en vez de pisar a la primera mientras escribe las
        hojas de salida.
    Ver conversación del 2026-09-11.

    v11: ECOM_SEMANAL ahora también trae "Ticket obj" y "Conversión
    obj", los dos objetivos del canal que hasta ahora vivían SOLO en
    el bloque CONFIGURACIÓN de "[Mes] E-commerce" y nunca salían de
    la planilla. Sin ellos, el dashboard no tenía contra qué comparar
    y su tabla "Real vs. objetivo" terminaba usando las columnas de
    Meta Ads (Visitas Meta / Ventas Meta, que son lo ATRIBUIDO A LA
    PAUTA, no un objetivo) como si fueran la meta del mes: mostraba
    3.545 visitas y 19 ventas de "objetivo" contra las 7.845 y 78
    reales de la planilla. Con estos dos valores el dashboard deriva
    solo el resto (Q Ventas obj = objetivo mensual / ticket obj,
    Visitas obj = Q Ventas obj / conversión obj, y tráfico restante).
    Se leen POR ETIQUETA y no por celda fija — ver valorPorEtiqueta().
    Son valores mensuales: se repiten iguales en cada fila semanal de
    ese mes, igual que Efectivo/Conversión obj/Ticket obj en
    LOCAL_DIARIO. Ver conversación del 2026-09-17.
    ════════════════════════════════════════════════════════════════ */

var MAIL = 'mauriciocamara85@gmail.com,antonellamazza.vanderholl@gmail.com,danielacostajnk@gmail.com,franotz.vanderholl@gmail.com,brengiselle220696@gmail.com,cintiacast15@gmail.com,nicoseg.vanderholl@gmail.com';

var FECHA_PRUEBA = '';          // dejar vacío en producción

var PXT_OBJETIVO = 2.5;   // objetivo de Prendas por Ticket, igual para los 14 locales por ahora

// v10 — ventana de pausa del trigger AUTOMÁTICO (madrugada, locales cerrados): de 00:00 a 07:00,
// nada más. Última corrida del día a las 23:00, primera del día siguiente a las 07:00.
var HORA_PAUSA_DESDE = 0;   // 00:00
var HORA_PAUSA_HASTA = 7;   // 07:00 — arranca de nuevo acá

// ── 1. LOCALES ────────────────────────────────────────────────────
var LOCALES = [
  { nombre: 'Rivadavia',          id: '1EWsjHZpoBTjpZXYFyaRQSKClW6L1AKBi4VnHdEi2TpY' },
  { nombre: 'Flores',             id: '1mgJQVc1XqEbEMnRpPcq5Jd8v4PDqbC04FJo3rlBGGuU' },
  { nombre: 'Parque Brown',       id: '1HDnnhABLm5ROMmdmTXGu9iirmtUJPn_Patn1_PBICq8' },
  { nombre: 'Unicenter',          id: '1fZjsUMaDBYeBli6IV9Wm0W7J-jCQztq6Cc7uHBQqLfY' },
  { nombre: 'Morón',              id: '1W_xyM8ElwnzAyWadEXzCoi0AYnBnoVSYvm4Dv7f5xfk' },
  { nombre: 'San Justo Shopping', id: '13gU2r_RBow95CStUlQbFyEFlZYVSuyRCc2mkJUsRI80' },
  { nombre: 'Ituzaingó',          id: '1jGEKVPtV-n1KHEOXi0yKQXo-fSVWGf33Hxj-hmhkcyo' },
  { nombre: 'Pacheco',            id: '1QuxfTs8mOOTBCcBbfhLqe2RB_PMAVzCJ7uHqsCZILpE' },
  { nombre: 'Villa del Parque',   id: '1N__f0HtIiln2VdAQ3el6-j0AejkeqPQ0jjaQ7TsUBxs' },
  { nombre: 'Grand Bourg',        id: '1ONLur0D-4vPMwJkISa0zT1AGxPr5DhN44EifaINL03M' },
  { nombre: 'Lomas de Zamora',    id: '1fOxZGtm1kQtV5dh31dxheAYmz_kgYq5yuwwMf7JrOCI' },
  { nombre: 'Caseros',            id: '1brWEcpChdbWWaPTNrLm5kFynxJAOpoBH2GnYrYxFBnY' },
  { nombre: 'Shopping Dot',       id: '10h9g_gzFRKaTluujRyccqFcv1gCTzrZgXmxwacXpArQ' },
  { nombre: 'San Justo 1',        id: '1At_Kq6SuQeEU1u9QCvN4RvsPSC1tcrGHqKKNgNuMGhw' }

];

var ECOMMERCE = { nombre: 'E-commerce',
                  id: '1bxVcVKtqiND0tFC4fwifSWWLXFjPNo2iO-0fUVCeQJY' };

var MESES = ['Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero'];
var ANIO  = { 'Septiembre': 2026, 'Octubre': 2026, 'Noviembre': 2026,
              'Diciembre': 2026, 'Enero': 2027, 'Febrero': 2027 };
var NUM   = { 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10,
              'Diciembre': 11, 'Enero': 0, 'Febrero': 1 };
var NUM_MES = { 8: 'Septiembre', 9: 'Octubre', 10: 'Noviembre',
                11: 'Diciembre', 0: 'Enero', 1: 'Febrero' };

var TABLAS_DASHBOARD = [
  'LOCAL_DIARIO', 'VENDEDOR_DIARIO', 'VENDEDOR_SEMANAL',
  'VENDEDOR_FOTOS', 'ECOM_DIARIO', 'ECOM_SEMANAL'
];

// v7 — caché de doGet(). TTL en segundos (10 min): tiempo máximo que puede tardar en
// reflejarse un cambio si nadie corre consolidar() manualmente en el medio (el trigger
// automático corre cada 1 hora — ver v10 — así que en el peor caso normal esto ni se nota).
// Tamaño de pedazo por debajo del límite real de 100KB por clave que impone CacheService.
var CACHE_TTL_SEC = 600;
var CACHE_CHUNK_SIZE = 90000;

var BLOQ_V = [24, 35, 46, 57, 68, 79];   // locales · Ventas
var BLOQ_T = [23, 30, 37, 44, 51, 58];   // locales · Tráfico
var BLOQ_I = [26, 43, 60, 77, 94];       // locales · Informe Vendedor
var BLOQ_E = [22, 32, 42, 52, 62, 72];   // e-commerce · bloques semanales

function hoyReal() {
  if (FECHA_PRUEBA) {
    var p = FECHA_PRUEBA.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  return new Date();
}

// API de lectura para el dashboard publicado en Netlify.
function doGet(e) {
  var tabla = e && e.parameter ? String(e.parameter.tabla || '').trim() : '';
  if (tabla && TABLAS_DASHBOARD.indexOf(tabla) === -1) {
    return jsonResponse({ error: 'Tabla no permitida', tablas: TABLAS_DASHBOARD });
  }

  var tablas = tabla ? [tabla] : TABLAS_DASHBOARD;
  var respuesta = {};
  for (var i = 0; i < tablas.length; i++) {
    respuesta[tablas[i]] = leerTablaDashboardCacheada(tablas[i]);
  }
  return jsonResponse(tabla ? respuesta[tabla] : respuesta);
}

// v7 — capa de caché delante de leerTablaDashboard(). Primer pedido tras vencer el caché
// (o tras un consolidar()) lee la planilla real; los siguientes, dentro de CACHE_TTL_SEC,
// se sirven de memoria sin tocar la planilla.
function leerTablaDashboardCacheada(nombre) {
  var cache = CacheService.getScriptCache();
  var texto = leerCachePartido(cache, 'tabla_' + nombre);
  if (texto !== null) {
    try { return JSON.parse(texto); } catch (e) { /* caché corrupto: recalculamos abajo */ }
  }

  var datos = leerTablaDashboard(nombre);
  guardarCachePartido(cache, 'tabla_' + nombre, JSON.stringify(datos));
  return datos;
}

function leerCachePartido(cache, clave) {
  var n = cache.get(clave + '_n');
  if (n === null) return null;
  var total = Number(n), claves = [];
  for (var i = 0; i < total; i++) claves.push(clave + '_' + i);
  var partes = cache.getAll(claves);
  var texto = '';
  for (var i = 0; i < claves.length; i++) {
    if (!(claves[i] in partes)) return null;   // algún pedazo venció antes que el resto: descartamos
    texto += partes[claves[i]];
  }
  return texto;
}

function guardarCachePartido(cache, clave, texto) {
  var total = Math.ceil(texto.length / CACHE_CHUNK_SIZE) || 1;
  for (var i = 0; i < total; i++) {
    cache.put(clave + '_' + i, texto.substr(i * CACHE_CHUNK_SIZE, CACHE_CHUNK_SIZE), CACHE_TTL_SEC);
  }
  cache.put(clave + '_n', String(total), CACHE_TTL_SEC);
}

// v7 — se llama al final de consolidar() para que el próximo doGet() traiga lo último
// recién calculado, sin esperar a que venza el TTL de 10 minutos.
function invalidarCache() {
  var cache = CacheService.getScriptCache();
  var claves = [];
  for (var t = 0; t < TABLAS_DASHBOARD.length; t++) {
    var base = 'tabla_' + TABLAS_DASHBOARD[t];
    claves.push(base + '_n');
    for (var i = 0; i < 40; i++) claves.push(base + '_' + i);   // de sobra: borrar una clave que no existe no rompe nada
  }
  cache.removeAll(claves);
}

function leerTablaDashboard(nombre) {
  var h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!h || h.getLastRow() === 0 || h.getLastColumn() === 0) return [];

  var valores = h.getRange(1, 1, h.getLastRow(), h.getLastColumn()).getValues();
  var cabeceras = valores.shift().map(String);
  return valores.map(function (fila) {
    var objeto = {};
    for (var i = 0; i < cabeceras.length; i++) {
      objeto[cabeceras[i]] = serializarDashboard(fila[i]);
    }
    return objeto;
  });
}

function serializarDashboard(valor) {
  if (valor instanceof Date) {
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return valor === '' ? null : valor;
}

function jsonResponse(valor) {
  return ContentService.createTextOutput(JSON.stringify(valor))
    .setMimeType(ContentService.MimeType.JSON);
}

// v10 — wrapper para el trigger automático de cada hora. consolidar() en sí NO se toca: esta
// función es la única que respeta la ventana de pausa (madrugada, locales cerrados) — "Consolidar
// ahora" (menú) y enviarResumenDiario() (mail de las 22:00) siguen llamando a consolidar()
// directo, así que corren siempre, sin importar la hora.
function consolidarAutomatico() {
  var hora = new Date().getHours();
  if (hora >= HORA_PAUSA_DESDE && hora < HORA_PAUSA_HASTA) {
    Logger.log('consolidarAutomatico() salteada — fuera de horario (' + hora + ' hs).');
    return;
  }
  consolidar();
}

// ══════════════════════════════════════════════════════════════════
function consolidar() {
  // v10 — evita que dos corridas se pisen escribiendo las mismas hojas a la vez (ej. si el
  // trigger automático dispara justo mientras alguien clickeó "Consolidar ahora"). Espera hasta
  // 5s por el lock; si sigue ocupado, se salta esta corrida en vez de pisar a la que ya está
  // escribiendo.
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    Logger.log('consolidar() saltada: ya hay otra corrida en curso.');
    return;
  }
  try {
    var t0 = new Date(), hoy = hoyReal(), errores = [];
    var diario = [], vendDiario = [], vendSemanal = [], fotos = [];
    var ecomDia = [], ecomSem = [];

    for (var L = 0; L < LOCALES.length; L++) {
      try {
        leerLocal(LOCALES[L], hoy, diario, vendDiario, vendSemanal, fotos);
      } catch (e) {
        errores.push(LOCALES[L].nombre + ': ' + e.message);
      }
    }
    try {
      leerEcommerce(ecomDia, ecomSem);
    } catch (e) {
      errores.push('E-commerce: ' + e.message);
    }

    escribir('LOCAL_DIARIO',
      ['Fecha', 'Local', 'Mes', 'Semana', 'Día', 'Objetivo', 'Venta real',
       'Tráfico nec.', 'Tráfico real', 'Conversión', 'Ticket prom.',
       'Efectivo', 'Tarjeta', 'Descuento', 'Conversión obj', 'Ticket obj',
       'PxT real', 'PxT obj'], diario);
    escribir('VENDEDOR_DIARIO',
      ['Fecha', 'Local', 'Mes', 'Semana', 'Día', 'Vendedor',
       'Venta real', 'Objetivo del día'], vendDiario);
    escribir('VENDEDOR_SEMANAL',
      ['Local', 'Mes', 'Semana', 'Vendedor', 'Venta obj', 'Venta real',
       'Tráfico obj', 'Tráfico real', 'Conv obj', 'Conv real', 'TP obj', 'TP real',
       'Perfumes obj', 'Perfumes real', 'Boxer obj', 'Boxer real',
       'PxT obj', 'PxT real'], vendSemanal);
    escribir('ECOM_DIARIO',
      ['Fecha', 'Canal', 'Mes', 'Semana', 'Día', 'Objetivo', 'Venta real',
       'Visitas', 'Q Ventas', 'Conversión', 'Ticket prom.'], ecomDia);
    escribir('ECOM_SEMANAL',
      ['Canal', 'Mes', 'Semana', 'Visitas', 'Carritos', 'Compras', 'Facturación',
       '% Car/Vis', '% Com/Car', 'Conversión', 'Ticket prom.',
       'Inversión sin imp.', 'Inversión con imp.', 'Facturación Meta',
       'Ventas Meta', 'Visitas Meta', 'Carritos Meta',
       'ROAS', 'ROAS con imp.', 'Costo x compra', 'Costo x carrito',
       'Costo x visita', '% Inv / Fact',
       'Ticket obj', 'Conversión obj'], ecomSem);   // v11 — objetivos del canal
    acumularFotos(fotos, hoy);
    invalidarCache();   // v7 — así el próximo doGet() ya trae esto, sin esperar el TTL

    var msg = 'Consolidado en ' + ((new Date() - t0) / 1000).toFixed(1) + ' s\n\n' +
              'LOCAL_DIARIO: ' + diario.length + '\n' +
              'VENDEDOR_DIARIO: ' + vendDiario.length + '\n' +
              'VENDEDOR_SEMANAL: ' + vendSemanal.length + '\n' +
              'ECOM_DIARIO: ' + ecomDia.length + '\n' +
              'ECOM_SEMANAL: ' + ecomSem.length + '\n' +
              'Fotos de hoy: ' + fotos.length;
    if (errores.length) msg += '\n\n⚠ Errores:\n' + errores.join('\n');
    Logger.log(msg);
    if (errores.length) { try { SpreadsheetApp.getUi().alert(msg); } catch (e) {} }
  } finally {
    lock.releaseLock();
  }
}

// ── LOCALES ───────────────────────────────────────────────────────
function leerLocal(local, hoy, diario, vendDiario, vendSemanal, fotos) {
  var ss = SpreadsheetApp.openById(local.id);
  for (var m = 0; m < MESES.length; m++) {
    var mes = MESES[m];
    var hV = ss.getSheetByName(mes + ' Ventas');
    var hT = ss.getSheetByName(mes + ' Tráfico');
    var hI = ss.getSheetByName(mes + ' Informe Vendedor');
    if (!hV || !hT || !hI) continue;

    var nombreLocal = hV.getRange('C18').getValue() || local.nombre;
    var vendedores = hV.getRange('C19:G19').getValues()[0];
    if (vendedores.filter(function (v) { return v !== '' && v !== '-'; }).length === 0) continue;

    // Medios de pago del mes (I13:K13) y objetivos de conversión /
    // ticket del mes (I18 / K18), todo en "Ventas". Son valores
    // mensuales: se repiten iguales en cada día de ese mes.
    var pago = hV.getRange('I13:K13').getValues()[0];
    var efectivo = num(pago[0]), tarjeta = num(pago[1]), descuento = num(pago[2]);
    var convObjetivo = num(hV.getRange('I18').getValue());
    var ticketObjetivo = num(hV.getRange('K18').getValue());

    // v9 — Prendas por Ticket real del local, ya calculado en "Tráfico" J4
    // (=SI.ERROR(Q Prendas/Q Líneas;0), celdas J21/J20). Mismo criterio que
    // Efectivo/Conversión obj/Ticket obj: un valor mensual, se repite igual
    // en cada día de ese mes.
    var pxtReal = num(hT.getRange('J4').getValue());

    var V = hV.getRange('C24:J88').getValues();
    var T = hT.getRange('C23:J62').getValues();
    var I = hI.getRange('C26:I107').getValues();

    // v8 — qué semanas (0..5) de ESTE mes ya arrancaron a la fecha de hoy. Se usa más abajo
    // para no generar filas de VENDEDOR_SEMANAL de semanas que todavía ni empezaron (ver nota
    // v8 al principio del archivo).
    var semanaIniciada = [false, false, false, false, false, false];

    for (var b = 0; b < 6; b++) {
      var semana = b + 1, bv = BLOQ_V[b] - 24, bt = BLOQ_T[b] - 23;

      // v6 — % que representa cada día dentro del objetivo semanal del LOCAL. Se usa para
      // prorratear el objetivo SEMANAL de cada vendedor (ya viene de "Informe Vendedor", columna I,
      // más abajo) a nivel diario, en vez de repartir el objetivo del LOCAL entre quienes vendieron
      // ese día puntual como hacía la v5 (dejaba objetivo $0 a quien no vendió nada, e inflaba a
      // quien sí vendió con el objetivo de sus compañeros ausentes).
      var objSemanaLocal = 0;
      for (var c0 = 0; c0 < 7; c0++) objSemanaLocal += num(V[bv + 2][c0]);

      for (var c = 0; c < 7; c++) {
        var et = V[bv + 1][c];
        if (!et) continue;
        var p = String(et).split(' ');
        var nd = parseInt(p[p.length - 1], 10);
        if (isNaN(nd)) continue;
        var fecha = new Date(ANIO[mes], NUM[mes], nd);
        if (fecha <= hoy) semanaIniciada[b] = true;   // v8

        diario.push([fecha, nombreLocal, mes, semana, p[0],
                     num(V[bv + 2][c]), num(V[bv + 3][c]), num(T[bt + 1][c]),
                     num(T[bt + 2][c]), num(T[bt + 3][c]), num(T[bt + 4][c]),
                     efectivo, tarjeta, descuento, convObjetivo, ticketObjetivo,
                     pxtReal, PXT_OBJETIVO]);

        // v6 — objetivo diario POR VENDEDOR: su Venta obj semanal (I[bi][b], ya calculada en
        // "Informe Vendedor" a partir del % Objetivo mensual de cada uno) prorrateada por el peso
        // de este día dentro de la semana. Se registra TODOS los días, incluso con venta $0 —
        // limitación conocida: no hay dato de franco/asistencia por persona en las planillas, así
        // que un franco y un día flojo se ven igual acá (venta $0 vs. objetivo del día). Aceptado
        // a propósito por ahora (ver conversación del 2026-08-23) — si en algún momento se agrega
        // una fila de franco/asistencia, hay que sumarla acá para excluir esos días de verdad.
        var pesoDia = objSemanaLocal > 0 ? num(V[bv + 2][c]) / objSemanaLocal : (1 / 7);
        for (var v = 0; v < 5; v++) {
          var nom = vendedores[v];
          if (!nom || nom === '-') continue;
          var venta = num(V[bv + 5 + v][c]);
          var bi = BLOQ_I[v] - 26;
          var objVendedorSemana = num(I[bi][b]);
          var objDelDia = Math.round(objVendedorSemana * pesoDia);
          vendDiario.push([fecha, nombreLocal, mes, semana, p[0], nom,
                           venta, objDelDia]);
        }
      }
    }

    for (var v = 0; v < 5; v++) {
      var nom = vendedores[v];
      if (!nom || nom === '-') continue;
      var bi = BLOQ_I[v] - 26;
      for (var s = 0; s < 6; s++) {
        if (!semanaIniciada[s]) continue;   // v8 — no incluir semanas que todavía no arrancaron
        var fila = [nombreLocal, mes, s + 1, nom,
          num(I[bi][s]), num(I[bi + 1][s]), num(I[bi + 2][s]), num(I[bi + 3][s]),
          num(I[bi + 4][s]), num(I[bi + 5][s]), num(I[bi + 6][s]), num(I[bi + 7][s]),
          num(I[bi + 8][s]), num(I[bi + 9][s]), num(I[bi + 10][s]), num(I[bi + 11][s]),
          num(I[bi + 12][s]), num(I[bi + 13][s])];
        vendSemanal.push(fila);
        fotos.push([hoy, nombreLocal, mes, s + 1, nom,
                    num(I[bi + 1][s]), num(I[bi + 3][s]), num(I[bi + 5][s]),
                    num(I[bi + 7][s]), num(I[bi + 9][s]), num(I[bi + 11][s]),
                    num(I[bi + 13][s])]);
      }
    }
  }
}

// ── E-COMMERCE ────────────────────────────────────────────────────
function leerEcommerce(ecomDia, ecomSem) {
  var ss = SpreadsheetApp.openById(ECOMMERCE.id);
  for (var m = 0; m < MESES.length; m++) {
    var mes = MESES[m];
    var h = ss.getSheetByName(mes + ' E-commerce');
    if (!h) continue;

    var canal = h.getRange('C18').getValue() || ECOMMERCE.nombre;
    var B = h.getRange('C22:K80').getValues();     // bloques · fila 22 = índice 0
    var F = h.getRange('C92:K114').getValues();    // embudo y Meta · fila 92 = índice 0

    // v11 — Ticket objetivo y Conversión objetivo del bloque CONFIGURACIÓN (filas 17 a 21, las
    // celdas en ámbar). Se buscan POR ETIQUETA y no por celda fija tipo 'I18' porque en ese
    // bloque los pares etiqueta/valor están repartidos a lo ancho de la fila y hay celdas
    // combinadas en el medio: con una referencia fija, insertar o correr una columna hace que
    // empiece a traer otra cosa en silencio. Son valores MENSUALES: se repiten iguales en cada
    // fila semanal de ese mes, igual que Efectivo/Conversión obj/Ticket obj en LOCAL_DIARIO.
    // Si el bloque no está o cambian los textos, valorPorEtiqueta() devuelve 0 y el dashboard
    // muestra "—" en la columna Objetivo en vez de inventar un número.
    var CFG = h.getRange('B17:L21').getValues();
    var ticketObjCanal = valorPorEtiqueta(CFG, ['ticket promedio', 'ticket obj']);
    var convObjCanal   = valorPorEtiqueta(CFG, ['conversión obj', 'conversion obj']);
    // La conversión viaja como FRACCIÓN (0,01 = 1%), que es como la guarda Sheets cuando se
    // tipea "1%". Si alguien la cargó como número suelto queriendo decir el porcentaje (1 por
    // "1%"), se normaliza acá: un objetivo de conversión de 100% o más no existe, así que un
    // valor >= 1 solo puede ser eso. Sin esta línea, un "1" mal cargado le pasaba al dashboard
    // una conversión objetivo del 100% y le reventaba las visitas objetivo (78 en vez de 7.845).
    if (convObjCanal >= 1) convObjCanal = convObjCanal / 100;

    // ── día por día ──
    for (var b = 0; b < 6; b++) {
      var base = BLOQ_E[b] - 22, semana = b + 1;
      for (var c = 0; c < 7; c++) {              // columnas C..I
        var et = B[base + 1][c];
        if (!et) continue;
        var p = String(et).split(' ');
        var nd = parseInt(p[p.length - 1], 10);
        if (isNaN(nd)) continue;
        ecomDia.push([new Date(ANIO[mes], NUM[mes], nd), canal, mes, semana, p[0],
                      num(B[base + 2][c]), num(B[base + 3][c]),
                      num(B[base + 5][c]), num(B[base + 6][c]),
                      num(B[base + 7][c]), num(B[base + 8][c])]);
      }
    }

    // ── embudo y Meta Ads por semana (columnas D..I = índices 1..6) ──
    for (var s = 0; s < 6; s++) {
      var i = s + 1;
      var fila = [canal, mes, s + 1,
        num(F[0][i]),  num(F[1][i]),  num(F[2][i]),  num(F[3][i]),   // vis, car, com, fact
        num(F[4][i]),  num(F[5][i]),  num(F[6][i]),  num(F[7][i]),   // %cv, %cc, conv, ticket
        num(F[11][i]), num(F[12][i]), num(F[13][i]),                 // inv sin, inv con, fact meta
        num(F[14][i]), num(F[15][i]), num(F[16][i]),                 // ventas, visitas, carritos meta
        num(F[17][i]), num(F[18][i]), num(F[19][i]),                 // roas, roas imp, cpa
        num(F[20][i]), num(F[21][i]), num(F[22][i]),                 // costo carrito, visita, %inv
        ticketObjCanal, convObjCanal];                               // v11 — objetivos del mes
      var algo = fila[3] + fila[6] + fila[13];    // visitas, facturación o inversión
      if (algo === 0) continue;
      ecomSem.push(fila);
    }
  }
}

// v11 — busca una etiqueta de texto en una grilla de celdas y devuelve el primer valor numérico
// que haya a su DERECHA en la misma fila. Los bloques de configuración de las planillas están
// armados siempre igual: la etiqueta a la izquierda y su valor en la celda (o el rango combinado)
// que sigue, con celdas vacías en el medio cuando hay combinaciones. Se compara en minúsculas y
// por prefijo, así "Conversión obj" también matchea "Conversión objetivo". Devuelve 0 si no
// encuentra la etiqueta o si no hay ningún número a su derecha.
function valorPorEtiqueta(grilla, etiquetas) {
  for (var f = 0; f < grilla.length; f++) {
    for (var c = 0; c < grilla[f].length; c++) {
      var texto = String(grilla[f][c] === null || grilla[f][c] === undefined ? '' : grilla[f][c])
                  .toLowerCase().trim();
      if (!texto) continue;
      var coincide = false;
      for (var e = 0; e < etiquetas.length; e++) {
        if (texto.indexOf(etiquetas[e]) === 0) { coincide = true; break; }
      }
      if (!coincide) continue;
      for (var d = c + 1; d < grilla[f].length; d++) {
        if (typeof grilla[f][d] === 'number' && grilla[f][d] !== 0) return grilla[f][d];
      }
    }
  }
  return 0;
}

// ── MAIL DIARIO DE CONTROL ────────────────────────────────────────
function enviarResumenDiario() {
  consolidar();
  var hoy = hoyReal(), mes = NUM_MES[hoy.getMonth()];
  if (!mes) { Logger.log('Fuera del semestre.'); return; }
  var dia = hoy.getDate(), tz = Session.getScriptTimeZone();
  var cambios = informeCambioHoy(Utilities.formatDate(hoy, tz, 'yyyy-MM-dd'), tz);

  var filas = [], faltan = 0;
  for (var L = 0; L < LOCALES.length; L++) {
    var r = { nombre: LOCALES[L].nombre, venta: false, trafico: false,
              informe: cambios[LOCALES[L].nombre] };
    try {
      var ss = SpreadsheetApp.openById(LOCALES[L].id);
      var hV = ss.getSheetByName(mes + ' Ventas');
      var hT = ss.getSheetByName(mes + ' Tráfico');
      if (hV && hT) {
        var V = hV.getRange('C24:J88').getValues();
        var T = hT.getRange('C23:J62').getValues();
        for (var b = 0; b < 6; b++) {
          var bv = BLOQ_V[b] - 24, bt = BLOQ_T[b] - 23;
          for (var c = 0; c < 7; c++) {
            var et = V[bv + 1][c];
            if (!et) continue;
            var p = String(et).split(' ');
            if (parseInt(p[p.length - 1], 10) !== dia) continue;
            for (var v = 0; v < 5; v++) if (num(V[bv + 5 + v][c]) > 0) r.venta = true;
            if (num(T[bt + 2][c]) > 0) r.trafico = true;
          }
        }
        r.nombre = hV.getRange('C18').getValue() || LOCALES[L].nombre;
      }
    } catch (e) { r.error = e.message; }
    if (!r.venta || !r.trafico || r.informe === false) faltan++;
    filas.push(r);
  }

  // e-commerce
  var ec = { nombre: 'E-COMMERCE', venta: false, trafico: false, informe: null };
  try {
    var se = SpreadsheetApp.openById(ECOMMERCE.id);
    var he = se.getSheetByName(mes + ' E-commerce');
    if (he) {
      var B = he.getRange('C22:K80').getValues();
      for (var b = 0; b < 6; b++) {
        var base = BLOQ_E[b] - 22;
        for (var c = 0; c < 7; c++) {
          var et = B[base + 1][c];
          if (!et) continue;
          var p = String(et).split(' ');
          if (parseInt(p[p.length - 1], 10) !== dia) continue;
          if (num(B[base + 3][c]) > 0) ec.venta = true;      // venta
          if (num(B[base + 5][c]) > 0) ec.trafico = true;    // visitas
        }
      }
    }
  } catch (e) { ec.error = e.message; }
  if (!ec.venta || !ec.trafico) faltan++;

  var fechaTxt = Utilities.formatDate(hoy, tz, 'dd/MM/yyyy');
  var html = '<div style="font-family:Arial,sans-serif;font-size:14px">' +
    '<h2 style="color:#0F172A;margin-bottom:4px">VDH · Control de carga</h2>' +
    '<p style="color:#64748B;margin-top:0">' + fechaTxt + '  ·  ' +
    (faltan === 0 ? 'todo al día' : faltan + ' con carga incompleta') + '</p>' +
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">' +
    '<tr style="background:#0F172A;color:#fff;text-align:left">' +
    '<th>Local</th><th>Venta del día</th><th>Tráfico / Visitas</th>' +
    '<th>Informe Vendedor</th></tr>';
  for (var i = 0; i < filas.length; i++) {
    var f = filas[i], fondo = (i % 2) ? '#F8FAFC' : '#FFFFFF';
    html += '<tr style="background:' + fondo + ';border-bottom:1px solid #E2E8F0">' +
            '<td><b>' + f.nombre + '</b></td><td>' + marca(f.venta) + '</td><td>' +
            marca(f.trafico) + '</td><td>' +
            (f.informe === null ? '<span style="color:#64748B">sin referencia</span>'
                                : marca(f.informe)) + '</td></tr>';
  }
  html += '<tr style="background:#EEF2FF;border-top:2px solid #0F172A">' +
          '<td><b>' + ec.nombre + '</b></td><td>' + marca(ec.venta) + '</td><td>' +
          marca(ec.trafico) + '</td><td style="color:#64748B">—</td></tr>';
  html += '</table><p style="color:#94A3B8;font-size:12px;margin-top:16px">' +
    'El Informe por Vendedor se marca como cargado cuando cambió respecto de la ' +
    'última foto. Si un vendedor no sumó nada nuevo, puede figurar como no cargado.' +
    '</p></div>';

  MailApp.sendEmail({
    to: MAIL,
    subject: 'VDH · Control de carga ' + fechaTxt +
             (faltan ? '  —  ' + faltan + ' pendiente(s)' : '  —  todo al día'),
    htmlBody: html
  });
  Logger.log('Mail enviado a ' + MAIL);
}

function marca(ok) {
  return ok ? '<span style="color:#16A34A;font-weight:bold">✔ cargado</span>'
            : '<span style="color:#DC2626;font-weight:bold">✖ falta</span>';
}

function informeCambioHoy(claveHoy, tz) {
  var h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('VENDEDOR_FOTOS');
  var res = {};
  for (var L = 0; L < LOCALES.length; L++) res[LOCALES[L].nombre] = null;
  if (!h || h.getLastRow() < 2) return res;
  var d = h.getRange(2, 1, h.getLastRow() - 1, 12).getValues(), porLocal = {};
  for (var i = 0; i < d.length; i++) {
    var f = d[i][0];
    var k = (f instanceof Date) ? Utilities.formatDate(f, tz, 'yyyy-MM-dd') : String(f);
    var loc = d[i][1];
    if (!porLocal[loc]) porLocal[loc] = {};
    if (!porLocal[loc][k]) porLocal[loc][k] = [];
    porLocal[loc][k].push(d[i].slice(2).join('|'));
  }
  for (var loc in porLocal) {
    var fechas = Object.keys(porLocal[loc]).sort();
    var idx = fechas.indexOf(claveHoy);
    if (idx <= 0) { res[loc] = null; continue; }
    res[loc] = porLocal[loc][claveHoy].sort().join('#') !==
               porLocal[loc][fechas[idx - 1]].sort().join('#');
  }
  return res;
}

// ── ESCRITURA ─────────────────────────────────────────────────────
function escribir(nombre, cabecera, filas) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  h.clear();
  h.getRange(1, 1, 1, cabecera.length).setValues([cabecera])
   .setFontWeight('bold').setBackground('#0F172A').setFontColor('#FFFFFF');
  if (filas.length) h.getRange(2, 1, filas.length, cabecera.length).setValues(filas);
  h.setFrozenRows(1);
}

function acumularFotos(nuevas, hoy) {
  var cab = ['Fecha foto', 'Local', 'Mes', 'Semana', 'Vendedor', 'Venta acum.',
             'Tráfico acum.', 'Conversión', 'TP', 'Perfumes acum.', 'Boxer acum.', 'PxT'];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName('VENDEDOR_FOTOS'), previas = [];
  if (h && h.getLastRow() > 1) {
    var datos = h.getRange(2, 1, h.getLastRow() - 1, cab.length).getValues();
    var clave = Utilities.formatDate(hoy, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    for (var i = 0; i < datos.length; i++) {
      var f = datos[i][0];
      var fk = (f instanceof Date)
        ? Utilities.formatDate(f, Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(f);
      if (fk !== clave) previas.push(datos[i]);
    }
  }
  escribir('VENDEDOR_FOTOS', cab, previas.concat(nuevas));
}

function num(v) {
  if (v === '' || v === null || v === undefined) return 0;
  if (typeof v === 'number') return v;
  var n = parseFloat(String(v).replace(/[^0-9.,-]/g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

// ── AUTOMÁTICO ────────────────────────────────────────────────────
function activarAutomatico() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var f = t.getHandlerFunction();
    if (f === 'consolidar' || f === 'consolidarAutomatico' || f === 'enviarResumenDiario')
      ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('consolidarAutomatico').timeBased().everyHours(1).create();
  ScriptApp.newTrigger('enviarResumenDiario').timeBased()
           .atHour(22).nearMinute(0).everyDays(1).create();
  SpreadsheetApp.getUi().alert(
    'Listo.\n· Consolida cada 1 hora, de 7:00 a 23:00.\n· Manda el mail de control a las 22:00.');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔄 VDH')
    .addItem('Consolidar ahora', 'consolidar')
    .addItem('Mandar resumen ahora (prueba)', 'enviarResumenDiario')
    .addSeparator()
    .addItem('Activar automático', 'activarAutomatico')
    .addToUi();
}

const DATA_ENDPOINT='https://script.google.com/macros/s/AKfycbyuS6K8oq2KWJ6BMSayHXHHSf0v2jr70OoSD4UfwX77cD3OobN1OrzFsTTXC6JI9Yo/exec';
const state={endpoint:DATA_ENDPOINT||localStorage.getItem('vdh-endpoint')||'',tables:{},view:'overview',timer:null,sort:{key:null,direction:1,table:null},rankScope:'sellers',sellerCategory:'liga',storeCategory:'constructores',rankSortMode:'units',evoScope:'seller',storeTab:'resumen',sellerTab:'resumen',storeMetric:'venta'};
const $=id=>document.getElementById(id);const q=sel=>document.querySelector(sel);const qa=sel=>[...document.querySelectorAll(sel)];
// Librería chica de íconos SVG (trazo, currentColor — mismo lenguaje visual que ya usaba el botón
// de refresh) para reemplazar los emoji de navegación/medallero por vectores consistentes en el
// panel de gestión. Cada entrada es solo el contenido interno del <svg> — icon() arma el wrapper.
const ICONS={
  layoutDashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  store:'<path d="M3 9l1-5h16l1 5"/><path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/><path d="M4 9v10h16V9"/><path d="M9 21v-6h6v6"/>',
  users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  menu:'<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  cart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  tag:'<path d="M12.59 2.41 20 9.83a2 2 0 0 1 0 2.83l-7.17 7.17a2 2 0 0 1-2.83 0L2.41 12.24a2 2 0 0 1 0-2.83L9.83 2.41a2 2 0 0 1 2.83 0Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>',
  trendingUp:'<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
  sun:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  trophy:'<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4a2 2 0 0 0 0 4h3"/><path d="M17 5h3a2 2 0 0 1 0 4h-3"/>',
  zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  banknote:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>',
  medal:'<path d="M7.21 15 2.66 7.14a1 1 0 0 1 .13-1.17L4.4 4.16A1 1 0 0 1 5.17 4h13.66a1 1 0 0 1 .77.36l1.6 1.8a1 1 0 0 1 .14 1.17L16.79 15"/><circle cx="12" cy="17" r="5"/><path d="M12 18.5v-3"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  shirt:'<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  sparkles:'<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>'
};
function icon(name,cls){return`<svg class="icon-svg${cls?` ${cls}`:''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||''}</svg>`}
function applyTheme(theme){const selected=theme==='light'?'light':'dark';document.documentElement.dataset.theme=selected;localStorage.setItem('vdh-theme',selected);qa('.theme-btn').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.themeChoice===selected)))}
// Acá vivía `tableNames`, una lista fija de las seis tablas que nadie leía: loadData() hace
// state.tables={...data} y toma lo que venga, y cada vista usa state.tables[x]||[]. Se sacó al
// dejar de recibir VENDEDOR_FOTOS (v14 del consolidador), porque la lista decía que llegaban seis
// y era mentira.
// LOCAL_DIARIO_ANTERIOR es opcional y todavía no la manda el consolidador (ver README, sección
// "Comparación contra el semestre anterior") — habilita sola la línea de semestre anterior del
// gráfico de Resumen general apenas el endpoint la incluya, sin tocar este archivo.
const MONTH_ORDER=['Septiembre','Octubre','Noviembre','Diciembre','Enero','Febrero'];
const GREETINGS={
  morning:['Buenos días, equipo.','A darle con todo.','Arrancamos el día, vamos por más.'],
  midday:['Vamos por la segunda mitad.','A seguir sumando.','Así veníamos, sigamos así.'],
  afternoon:['Buenas tardes, equipo.','Dale que se puede.','A cerrar bien el día.'],
  night:['Buen cierre, equipo.','Así se cierra el día.','Descansen, mañana seguimos.','Hola, noctámbulo.','De vuelta al trabajo.']
};
function greetingBand(hour){if(hour>=6&&hour<12)return 'morning';if(hour>=12&&hour<15)return 'midday';if(hour>=15&&hour<20)return 'afternoon';return 'night'}
function pickGreeting(){const options=GREETINGS[greetingBand(new Date().getHours())];return options[Math.floor(Math.random()*options.length)]}
const money=value=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(parseNumber(value));
// Versión compacta ($50M / $850K) para bajadas de texto donde el monto es contexto, no el dato
// principal — nunca para el número hero de una tarjeta (ese siempre va con money(), completo).
function moneyShort(value){
  const n=parseNumber(value),abs=Math.abs(n),sign=n<0?'-':'';
  if(abs>=1e6)return`${sign}$${(abs/1e6).toFixed(1).replace('.0','')}M`;
  if(abs>=1e3)return`${sign}$${(abs/1e3).toFixed(0)}K`;
  return money(n);
}
const number=value=>new Intl.NumberFormat('es-AR',{maximumFractionDigits:0}).format(parseNumber(value));
const percent=value=>`${parseNumber(value).toFixed(1).replace('.',',')}%`;
function parseNumber(value){if(typeof value==='number')return Number.isFinite(value)?value:0;if(value===null||value===undefined||value==='')return 0;const text=String(value).trim().replace(/[^\d,.-]/g,'');if(!text)return 0;const normalized=text.includes(',')?text.replace(/\./g,'').replace(',','.'):text.replace(/\./g,'');const parsed=Number(normalized);return Number.isFinite(parsed)?parsed:0}
const cleanKey=value=>String(value??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const fieldAliases={
	'Objetivo':['Objetivo','Venta obj','Objetivo diario','Objetivo mensual'],
	'Venta real':['Venta real','Venta','Ventas','Ventas reales','Facturación','Facturacion','Facturación real'],
	'Tráfico real':['Tráfico real','Trafico real','Tráfico','Trafico','Visitas'],
	'Q Ventas':['Q Ventas','Q ventas','Ventas cantidad','Compras'],
	'Inversión sin imp.':['Inversión sin imp.','Inversion sin imp.','Inversión','Inversion'],
	'Efectivo':['Efectivo','Efvo','Cash'],
	'Tarjeta':['Tarjeta','Tarjetas','Débito','Debito','Crédito','Credito'],
	'Descuento':['Descuento','Descuentos','Desc.','Dto']
};
function fieldValue(row,key){if(!row)return undefined;const aliases=fieldAliases[key]||[key];const entries=Object.entries(row);for(const alias of aliases){const exact=entries.find(([name,value])=>name===alias&&value!==''&&value!==null&&value!==undefined);if(exact)return exact[1];const normalized=cleanKey(alias);const match=entries.find(([name,value])=>cleanKey(name)===normalized&&value!==''&&value!==null&&value!==undefined);if(match)return match[1]}return undefined}
const num=(row,key)=>parseNumber(fieldValue(row,key));
// 'Conv real' (VENDEDOR_SEMANAL) a veces viene cargado como número entero de porcentaje (58, por
// "58%") en vez de fracción (0.58) — inconsistencia de tipeo en el Sheet para esa fila puntual, no
// arreglable desde acá salvo corrigiendo la carga. Una conversión real nunca puede superar 100%
// (fracción > 1), así que si el valor ya viene así se asume ese caso y se normaliza dividiendo por
// 100. Sin esto, promediar "0.58" (58%) junto con un "58" suelto (que en realidad también es 58%,
// pero sin normalizar pesa como si fuera 5800%) disparaba "Conversión media" a 354% en Métricas
// vendedores y el embudo mostraba más Ventas que Tráfico — imposible (bug real, auditoría 2026-09-06).
// Las columnas de conversión (real y objetivo) deberían venir como fracción (0,58 = 58%), pero en
// varias planillas se cargan como número entero (58, o 50 para el objetivo). Un solo día así
// rompe el promedio del local entero: Pacheco daba 396% de conversión por dos días cargados como
// 51 y 56, y Grand Bourg comparaba contra un objetivo de 5000%. Se normaliza al leer — el arreglo
// de fondo es en la planilla, esto solo evita que un tipeo tire abajo toda una vista.
const convRate=(row,key)=>{const v=num(row,key);return v>1?v/100:v};

// ── Agregación ponderada de Ticket promedio / Conversión / PxT ───────────────────────────────
// Criterio ÚNICO para todo el dashboard (decidido el 2026-10-01): el ticket promedio de un
// conjunto es la venta TOTAL dividida por la cantidad TOTAL de tickets — nunca el promedio de
// los tickets promedio de cada día, semana o persona. Promediar promedios le da el mismo peso a
// un día de 3 tickets que a uno de 40: con los datos de la red se desviaba hasta +12,1% (San
// Justo 1) y +7,1% en Rivadavia, donde la tarjeta de vendedores mostraba $80.447 contra los
// $70.522 de la planilla del local. Es además el criterio de blueSoft (venta ÷ líneas) y el de
// la tarjeta TICKET PROMEDIO de las propias planillas. Lo mismo vale para Conversión
// (tickets ÷ tráfico) y para PxT (prendas ÷ tickets).
// La cantidad de tickets NO viene en el endpoint: se deriva como venta ÷ ticket promedio de
// cada fila. TICKET_MIN_VALIDO descarta las filas con el ticket cargado en miles en vez de en
// pesos, que meterían miles de tickets de un solo día y romperían el total.
const TICKET_MIN_VALIDO=1000;
function nuevoPonderado(){return{venta:0,ventaConTicket:0,tickets:0,prendas:0,trafico:0,filasSinTicket:0,ticketsConv:0,traficoConv:0}}
// La venta entra SIEMPRE al total; al cálculo de ticket y PxT entra solo la de las filas con un
// ticket promedio usable, así el dividendo y el divisor hablan de los mismos días.
function sumarPonderado(acc,venta,ticketProm,pxt,trafico){
  acc.venta+=venta;acc.trafico+=trafico||0;
  if(venta&&ticketProm>=TICKET_MIN_VALIDO){
    const tickets=venta/ticketProm;
    acc.tickets+=tickets;acc.ventaConTicket+=venta;acc.prendas+=tickets*(pxt||0);
    // La conversión cuenta solo las filas que tienen las DOS cosas, tickets y tráfico (2026-10-02).
    // Antes dividía los tickets de todas las filas por el tráfico de todas: un local-día que cargó
    // venta sin tráfico metía tickets sin su gente, y uno con tráfico sin venta, gente sin tickets.
    // En septiembre, con todos los locales: 62,9% → 63,3%.
    if(trafico>0){acc.ticketsConv+=tickets;acc.traficoConv+=trafico}
  }else if(venta)acc.filasSinTicket++;
  return acc;
}
// El filter(Boolean) no es decorativo: si un llamante arma sus filas y se olvida de incluir el
// `pond`, sin él esto tira "Cannot read properties of undefined" y, como el error sube hasta
// loadData(), se cae el dashboard ENTERO por una sola vista mal armada (pasó el 2026-10-01 con el
// informe de temporada). Salteando los vacíos, a lo sumo se desvía un total; el resto sigue vivo.
function unirPonderados(lista){return lista.filter(Boolean).reduce((acc,p)=>{['venta','ventaConTicket','tickets','prendas','trafico','filasSinTicket','ticketsConv','traficoConv'].forEach(k=>acc[k]+=p[k]||0);return acc},nuevoPonderado())}
function cerrarPonderado(acc){
  return{venta:acc.venta,trafico:acc.trafico,tickets:acc.tickets,prendas:acc.prendas,filasSinTicket:acc.filasSinTicket,
    ticketsConv:acc.ticketsConv,traficoConv:acc.traficoConv,
    ticket:acc.tickets?acc.ventaConTicket/acc.tickets:0,
    conversion:acc.traficoConv?acc.ticketsConv/acc.traficoConv:0,
    pxt:acc.tickets?acc.prendas/acc.tickets:0};
}
function normalizeDate(value){if(value instanceof Date&&!Number.isNaN(value.getTime()))return value.toISOString().slice(0,10);const text=String(value??'').trim();if(!text)return '';const iso=text.match(/^(\d{4})-(\d{2})-(\d{2})/);if(iso)return iso.slice(1).join('-');const dmy=text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);if(dmy)return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;const parsed=new Date(text);return Number.isNaN(parsed.getTime())?'':parsed.toISOString().slice(0,10)}
// El dashboard entero muestra fechas en formato argentino día/mes/año — normalizeDate de arriba
// sigue devolviendo/comparando en ISO (año-mes-día, lo que necesita para ordenar como string), pero
// eso nunca va directo a pantalla: todo texto visible pasa por acá. Pedido explícito 2026-09-13
// (antes varios gráficos mostraban el ISO crudo tipo "2026-09-10", o su mitad "09-10" recortada con
// slice(5) — que además queda MES-día, invertido respecto al orden día/mes que pidió el usuario).
function formatDateAR(dateStr){if(!dateStr)return '';const[y,m,d]=dateStr.split('-');return `${d}/${m}/${y}`}
// Versión corta (sin año) para ejes de gráfico angostos, mismo orden día/mes que formatDateAR.
function formatDateShortAR(dateStr){if(!dateStr)return '';const[,m,d]=dateStr.split('-');return `${d}/${m}`}
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function normalizeLocalName(value){const text=String(value??'').trim();return text?text.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()):text}
function normalizeLocalNames(tables){Object.keys(tables).forEach(name=>{(tables[name]||[]).forEach(row=>{if(row&&typeof row==='object'&&'Local'in row)row.Local=normalizeLocalName(row.Local)})})}
function setStatus(text,online=false){$('connectionLabel').textContent=text;$('dataStatus').textContent=text;q('.pulse').classList.toggle('online',online)}
function showError(text){$('errorBanner').textContent=text;$('errorBanner').hidden=!text}
// Pantalla de carga inicial (#appLoading, ver index.html/styles.css) — tapa .main-content mientras
// llega la PRIMERA respuesta del endpoint, para no dejar los 8 paneles mostrando "Sin datos"/"—" a
// la vez como si la app estuviera rota. Se apaga una sola vez (agregar la clase de nuevo no hace
// nada) desde el finally de loadData(), haya salido bien o mal — si falla, el error banner ya
// cuenta la historia, no tiene sentido dejar el spinner girando para siempre.
function hideAppLoading(){$('appLoading').classList.add('is-loaded')}
// Feedback de refresh: gira el ícono mientras loadData() está en vuelo y tira una confirmación
// chica al lado del botón cuando termina bien — antes la única señal de éxito era el punto verde
// de la sidebar, lejos de donde el usuario tocó ↻. disabled evita un doble-click que dispare dos
// fetch en paralelo.
function startRefreshSpin(){const btn=$('refreshButton');btn.classList.add('is-spinning');btn.disabled=true}
function stopRefreshSpin(){const btn=$('refreshButton');btn.classList.remove('is-spinning');btn.disabled=false}
function flashRefreshConfirm(text){const el=$('refreshConfirm');el.textContent=text;el.classList.add('show');clearTimeout(flashRefreshConfirm.timer);flashRefreshConfirm.timer=setTimeout(()=>el.classList.remove('show'),2200)}
function rowMatchesFilters(row,allowSeller=true){const local=$('localFilter').value,from=$('fromDate').value,to=$('toDate').value,seller=$('sellerFilter').value;return (local==='all'||String(row.Local??'')===local)&&(!from||normalizeDate(row.Fecha||row['Fecha foto'])>=from)&&(!to||normalizeDate(row.Fecha||row['Fecha foto'])<=to)&&(!allowSeller||seller==='all'||String(row.Vendedor??'')===seller)}
function weekDates(row){const localDates=(state.tables.LOCAL_DIARIO||[]).filter(item=>String(item.Local??'')===String(row.Local??'')&&String(item.Mes??'')===String(row.Mes??'')&&String(item.Semana??'')===String(row.Semana??'')).map(item=>normalizeDate(item.Fecha));const sellerDates=(state.tables.VENDEDOR_DIARIO||[]).filter(item=>String(item.Local??'')===String(row.Local??'')&&String(item.Mes??'')===String(row.Mes??'')&&String(item.Semana??'')===String(row.Semana??'')).map(item=>normalizeDate(item.Fecha));return [...new Set([...localDates,...sellerDates].filter(Boolean))].sort()}
function weekMatchesRange(row){const from=$('fromDate').value,to=$('toDate').value;if(!from&&!to)return true;const dates=weekDates(row);return dates.length>=7&&(!from||dates[0]>=from)&&(!to||dates[dates.length-1]<=to)}
function sellerPeriodMatches(row){const monthControl=$('sellerMonthFilter'),weekControl=$('sellerWeekFilter');if(!monthControl||!weekControl)return true;const month=monthControl.value,week=weekControl.value;return (month==='all'||String(row.Mes??'')===month)&&(week==='all'||String(row.Semana??'')===week)}
function sellerWeeklyTarget(local,month,week,seller){const weekly=state.tables.VENDEDOR_SEMANAL||[];const row=weekly.find(item=>String(item.Local??'')===String(local??'')&&String(item.Mes??'')===String(month??'')&&String(item.Semana??'')===String(week??'')&&String(item.Vendedor??'')===String(seller??''));return row?num(row,'Venta obj'):0}
function sellerTargetForDay(row,sellers){const dates=[...new Set((state.tables.LOCAL_DIARIO||[]).filter(item=>String(item.Local??'')===String(row.Local??'')&&String(item.Mes??'')===String(row.Mes??'')&&String(item.Semana??'')===String(row.Semana??'')).map(item=>normalizeDate(item.Fecha)).filter(Boolean))];const weeklyTarget=sellers.reduce((sum,seller)=>sum+sellerWeeklyTarget(row.Local,row.Mes,row.Semana,seller),0);return weeklyTarget&&dates.length?weeklyTarget/dates.length:0}
function activeRows(name){const source=state.tables[name]||[],seller=$('sellerFilter').value;if(seller!=='all'&&(name==='ECOM_DIARIO'||name==='ECOM_SEMANAL'))return [];if(name==='VENDEDOR_SEMANAL'){return source.filter(row=>( $('localFilter').value==='all'||String(row.Local??'')===$('localFilter').value)&&(seller==='all'||String(row.Vendedor??'')===seller)&&sellerPeriodMatches(row))}let rows=source.filter(row=>rowMatchesFilters(row,source.some(item=>item.Vendedor!==undefined)));if(name==='VENDEDOR_DIARIO')rows=rows.filter(sellerPeriodMatches);if(seller!=='all'&&name==='LOCAL_DIARIO'){const sellerRows=(state.tables.VENDEDOR_DIARIO||[]).filter(row=>rowMatchesFilters(row));const sellers=[...new Set(sellerRows.map(row=>String(row.Vendedor??'')).filter(Boolean))];const totals={};sellerRows.forEach(row=>{const key=`${normalizeDate(row.Fecha)}|${row.Local}`;if(!totals[key])totals[key]={actual:0,target:0};totals[key].actual+=num(row,'Venta real')});rows=rows.map(row=>{const key=`${normalizeDate(row.Fecha)}|${row.Local}`,sellerTotal=totals[key],sellerTarget=sellerTargetForDay(row,sellers);return sellerTotal?{...row,'Venta real':sellerTotal.actual,Objetivo:sellerTarget||sellerTotal.target}:null}).filter(Boolean)}return rows}
function allRows(name){return state.tables[name]||[]}
// Resumen General (01) ya no tiene Local/Vendedor en su barra de filtros — a propósito, siempre
// muestra el consolidado de TODA la empresa (Red Física + E-commerce), solo respeta Desde/Hasta.
// A diferencia de activeRows(), ignora los <select> de Local/Vendedor aunque sigan existiendo en
// el DOM para las demás pestañas (ver switchView, los oculta solo en esta vista).
function overviewRows(name){
  const from=$('fromDate').value,to=$('toDate').value;
  return (state.tables[name]||[]).filter(row=>{
    const date=normalizeDate(row.Fecha||row['Fecha foto']);
    return(!from||date>=from)&&(!to||date<=to);
  });
}
function daysInCalendarMonth(dateStr){if(!dateStr)return 30;const [y,m]=dateStr.split('-').map(Number);return new Date(y,m,0).getDate()}
// El semestre VDH corre Septiembre→Febrero (ver MONTH_ORDER). Dada cualquier fecha, ubica el 1° de
// septiembre de ese ciclo y el último día de febrero siguiente. Lo usan la línea de proyección (para
// saber "fin de semestre" cuando no hay un filtro de fecha activo) y la comparación contra el
// semestre anterior (para alinear "día N" de un semestre contra "día N" del otro).
function semesterBounds(dateStr){
  const ref=dateStr?new Date(`${dateStr}T00:00:00`):new Date();
  const year=ref.getFullYear(),month=ref.getMonth();
  const startYear=month>=8?year:year-1;
  const endDate=new Date(startYear+1,2,0);
  const pad=n=>String(n).padStart(2,'0');
  return{start:`${startYear}-09-01`,end:`${endDate.getFullYear()}-${pad(endDate.getMonth()+1)}-${pad(endDate.getDate())}`};
}
// VENDEDOR_FOTOS queda afuera de estas dos uniones a propósito: es un log histórico que el
// consolidador nunca depura, así que puede arrastrar vendedores/locales viejos que ya no están
// cargados (ver memoria "vendedores fantasma en el filtro"). LOCAL_DIARIO+VENDEDOR_SEMANAL y
// VENDEDOR_SEMANAL+VENDEDOR_DIARIO ya alcanzan para reflejar el roster real y vigente.
function fillFilters(){const locals=[...new Set([...allRows('LOCAL_DIARIO'),...allRows('VENDEDOR_SEMANAL')].map(r=>r.Local).filter(Boolean))].sort();const option=(value,label)=>`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;$('localFilter').innerHTML=option('all','Todos los locales')+locals.map(x=>option(x,x)).join('');fillSellerFilter();fillPeriodFilters('metricsMonthFilter','metricsWeekFilter');fillPeriodFilters('accessoryMonthFilter','accessoryWeekFilter')}
function fillSellerFilter(){const local=$('localFilter').value;const sellers=[...new Set([...allRows('VENDEDOR_SEMANAL'),...allRows('VENDEDOR_DIARIO')].filter(row=>local==='all'||String(row.Local??'')===local).map(r=>r.Vendedor).filter(Boolean))].sort();const option=(value,label)=>`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;const previous=$('sellerFilter').value;$('sellerFilter').innerHTML=option('all','Todos los vendedores')+sellers.map(x=>option(x,x)).join('');$('sellerFilter').value=sellers.includes(previous)?previous:'all'}
function fillSellerWeeks(){const month=$('sellerMonthFilter').value;const weeks=[...new Set(allRows('VENDEDOR_SEMANAL').filter(row=>month==='all'||String(row.Mes??'')===month).map(row=>row.Semana).filter(v=>v!==undefined&&v!==null))].sort((a,b)=>Number(a)-Number(b));const option=(value,label)=>`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;$('sellerWeekFilter').innerHTML=option('all','Todas las semanas')+weeks.map(x=>option(x,`Semana ${x}`)).join('');}
// Cartel de la derecha del título: qué período se está mirando, en dd/mm y con el nombre del preset
// si hay uno ("Mes actual · 01/10 → 15/10"). Antes mostraba las fechas crudas en ISO
// (2026-10-01 → 2026-10-01), que pasó a verse siempre al arrancar el dashboard en el mes actual.
function updatePeriod(){
  const from=$('fromDate').value,to=$('toDate').value;
  if(!from&&!to){$('periodBadge').textContent='Semestre completo';return}
  const rango=from&&from===to?formatDateShortAR(from):`${from?formatDateShortAR(from):'inicio'} → ${to?formatDateShortAR(to):'hoy'}`;
  const preset=periodPicker.preset,nombre=['hoy','ayer','semana','mes','trimestre'].includes(preset)?periodPresetLabel(preset):'';
  $('periodBadge').textContent=nombre?`${nombre} · ${rango}`:rango;
}
function todayKey(){const today=new Date();return `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`}
function lastLoadedDate(name){const rows=state.tables[name]||[];const dates=rows.filter(row=>num(row,'Venta real')||num(row,'Tráfico real')||num(row,'Ticket prom.')).map(row=>normalizeDate(row.Fecha)).filter(Boolean).sort();return dates.length?dates[dates.length-1]:''}
// Hasta qué día se mide "a la fecha": el fin del período elegido, pero NUNCA más allá del último día
// con datos cargados. Desde que el dashboard arranca en "Mes actual" el período llega hasta hoy, y
// a las 10 de la mañana hoy no tiene nada cargado: su objetivo entraba entero contra $0 de venta.
// El 07/10 eso mostraba 86,2% de cumplimiento y −12,3 pts cuando al cierre de ayer se iba en 98,5%.
function objectiveCutoff(){
  const hasta=$('toDate').value,ultimo=lastLoadedDate('LOCAL_DIARIO');
  if(hasta&&ultimo)return hasta<ultimo?hasta:ultimo;
  return hasta||ultimo||todayKey();
}
function rowsThroughToday(rows){const cutoff=objectiveCutoff();return rows.filter(row=>{const date=normalizeDate(row.Fecha||row['Fecha foto']);return date&&date<=cutoff})}
async function loadData(){
  if(!state.endpoint){setStatus('Sin configurar');showError('No hay una fuente de datos configurada en este navegador.');hideAppLoading();return}
  setStatus('Conectando...');showError('');startRefreshSpin();
  try{chequearVersionNueva()}catch(e){}   // ¿hay código nuevo publicado? (ver al final). Nunca frena la carga.
  // Un intento con su propio tiempo límite. El consolidador responde en ~2 s con el caché caliente,
  // pero cada 10 minutos el caché vence y el primer pedido relee todas las hojas; si encima coincide
  // con la corrida automática de cada hora, pasa los 20 s que se esperaban antes y el dashboard
  // mostraba "tardó demasiado" con el consolidador funcionando (pasó el 2026-10-04). Ahora espera 30 s
  // y, si vence, reintenta una vez con 45 s antes de rendirse: el segundo pedido casi siempre
  // encuentra el caché recién armado por el primero.
  const intentar=async ms=>{
    const controller=new AbortController(),timeoutId=setTimeout(()=>controller.abort(),ms);
    try{
      const response=await fetch(state.endpoint,{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }finally{clearTimeout(timeoutId)}
  };
  try{
    let data;
    try{data=await intentar(30000)}
    catch(error){if(error.name!=='AbortError')throw error;setStatus('Reintentando...');data=await intentar(45000)}
    state.tables=Array.isArray(data)?{LOCAL_DIARIO:data}:{...data};
    normalizeLocalNames(state.tables);fillFilters();render();
    cargarRentabilidad();   // planilla de rentabilidad, directo de Google (ver ahí): no frena al resto
    const now=new Date();const stamp=now.toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'});
    $('lastRefresh').textContent=`actualizado ${stamp}`;$('footerUpdated').textContent=`Última actualización: ${stamp}`;$('overviewUpdated').textContent=`Datos actualizados ${stamp}`;
    setStatus('Conectado',true);
    flashRefreshConfirm('Actualizado ✓');
  }catch(error){
    const timedOut=error.name==='AbortError';
    setStatus('Error de conexión');
    showError(timedOut?'El consolidador no respondió (lo intentamos dos veces, más de un minuto en total). Se siguen viendo los últimos datos cargados; probá actualizar en un rato.':`No se pudieron cargar los datos del consolidado. Detalle: ${error.message}`);
  }finally{
    hideAppLoading();stopRefreshSpin();
  }
}
function metricsCard(label,value,detail='',tone=''){return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-detail ${tone}">${detail}</div></div>`}
function aggregate(rows){return rows.reduce((acc,row)=>{acc.target+=num(row,'Objetivo')||num(row,'Venta obj');acc.actual+=num(row,'Venta real')||num(row,'Facturación');acc.traffic+=num(row,'Tráfico real')||num(row,'Visitas');acc.targetTraffic+=num(row,'Tráfico nec.')||num(row,'Tráfico obj');acc.orders+=num(row,'Q Ventas')||num(row,'Compras');return acc},{target:0,actual:0,traffic:0,targetTraffic:0,orders:0})}
// ── SEMÁFORO DE CUMPLIMIENTO: regla general de TODO el dashboard (pedido 2026-10-07) ──
//   100% o más del objetivo → verde · de 85% a 99% → amarillo · menos de 85% → rojo
// Antes cada vista tenía su corte (la mayoría 90%, varias solo verde/rojo sin amarillo). Todo lo
// que se pinta según el objetivo cumplido pasa por acá: si cambia la regla, se cambia en estas
// dos constantes. `ratio` es real/objetivo (1 = 100%).
const UMBRAL_VERDE=1,UMBRAL_AMARILLO=.85;
// Para tarjetas, textos y barras (clases good / warning / bad).
function statusTone(ratio){return ratio>=UMBRAL_VERDE?'good':ratio>=UMBRAL_AMARILLO?'warning':'bad'}
// Para celdas de tabla (clases positive / warning / negative).
function cumplClase(ratio){return ratio>=UMBRAL_VERDE?'positive':ratio>=UMBRAL_AMARILLO?'warning':'negative'}
function dailySeries(rows){
  const byDate={};
  rows.forEach(row=>{
    const date=normalizeDate(row.Fecha);
    if(!date)return;
    if(!byDate[date])byDate[date]={actual:0,target:0};
    byDate[date].actual+=num(row,'Venta real')||num(row,'Facturación');
    byDate[date].target+=num(row,'Objetivo')||num(row,'Venta obj');
  });
  return Object.keys(byDate).sort().map(date=>{
    const d=byDate[date];
    return{date,actual:d.actual,target:d.target,ratio:d.target?d.actual/d.target*100:null};
  });
}
function cumulativeSeries(daily){
  let accActual=0,accTarget=0;
  return daily.map(d=>{
    accActual+=d.actual;accTarget+=d.target;
    return{date:d.date,actual:accActual,target:accTarget,ratio:accTarget?accActual/accTarget*100:null};
  });
}
function trendMeta(delta,invert=false,threshold=0.5){
  if(delta===null||delta===undefined||Number.isNaN(delta))return{cls:'flat',icon:'—'};
  const d=invert?-delta:delta;
  if(d>threshold)return{cls:'up',icon:'▲'};
  if(d<-threshold)return{cls:'down',icon:'▼'};
  return{cls:'flat',icon:'—'};
}
function kpiTrendRow(delta,text,invert=false){
  const t=trendMeta(delta,invert);
  return `<div class="kpi-trend pill-${t.cls}"><span class="trend-arrow ${t.cls}">${t.icon}</span><span class="trend-text">${text}</span></div>`;
}
// `pct` (opcional): {valor, tono, etiqueta} → el porcentaje de desvío o cumplimiento en grande, entre
// el monto y el texto de abajo (pedido 2026-10-07: antes iba chico, metido en la línea de detalle).
function kpiCard(label,value,detailText,detailTone,trendHtml,subText,pct){
  const pctHtml=pct?`<div class="kpi-pct"><strong class="${pct.tono||''}">${pct.valor}</strong><span>${pct.etiqueta||''}</span></div>`:'';
  return `<div class="metric-card${trendHtml?' kpi-card':''}"><div class="metric-label">${label}</div><div class="metric-value">${value}</div>${pctHtml}<div class="metric-detail ${detailTone}">${detailText}</div>${trendHtml||''}${subText?`<div class="kpi-subtrend">${subText}</div>`:''}</div>`;
}
function donutSvg(segments){
  const r=26,cx=32,cy=32,circumference=2*Math.PI*r;
  const total=segments.reduce((sum,s)=>sum+Math.max(0,s.value),0);
  if(!total)return `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)" stroke-width="10"></circle></svg>`;
  let offset=0;
  const rings=segments.map(s=>{
    const dash=Math.max(0,s.value)/total*circumference;
    const ring=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="10" stroke-dasharray="${dash.toFixed(2)} ${(circumference-dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"></circle>`;
    offset+=dash;
    return ring;
  }).join('');
  return `<svg viewBox="0 0 64 64" width="64" height="64">${rings}</svg>`;
}
// Card genérica de "real sobre objetivo" como barra de progreso — la usa Venta (Métricas vendedores).
function progressCard(label,valueFmt,real,target,fallbackDetail){
  const hasTarget=target>0,ratio=hasTarget?real/target:0,tone=hasTarget?statusTone(ratio):'';
  const fillPct=Math.min(100,Math.max(2,ratio*100));
  return `<div class="metric-card progress-card"><div class="metric-label">${label}</div><div class="metric-value">${valueFmt(real)}</div><div class="metric-detail ${tone}">${hasTarget?`${percent(ratio*100)} del objetivo (${valueFmt(target)})`:fallbackDetail}</div>${hasTarget?`<div class="progress-track"><div class="progress-fill ${tone}" style="width:${fillPct}%"></div></div>`:''}</div>`;
}
// La venta en unidades se estima como tráfico × conversión real (no desde un campo "Q Ventas"/"Compras"
// que puede no venir para todas las tablas) — así la caída del embudo coincide siempre con la conversión
// que ya se muestra en el diagnóstico de al lado. Genérico: lo usan Locales y Métricas vendedores.
function renderTrafficFunnel(containerId,hasData,traffic,avgConv){
  const container=$(containerId);
  if(!hasData){container.classList.add('empty-state');container.innerHTML='Sin datos';return}
  container.classList.remove('empty-state');
  const sales=traffic*avgConv;
  const failed=Math.max(0,traffic-sales);
  // "Ventas falladas" no es un paso secuencial más (no es un subconjunto de "Ventas", es su
  // complemento sobre el tráfico) — por eso no lleva flecha de "↓ %" arriba como las otras dos,
  // para no leerse como si fuera una conversión de Ventas hacia Ventas falladas.
  const steps=[['Tráfico',traffic,null,''],['Ventas',sales,avgConv*100,''],['Ventas falladas',failed,null,'funnel-fill-negative']];
  const top=Math.max(traffic,1);
  // El "↓ %" va como caption chico debajo del label de la fila, no como una fila propia entre medio
  // (eso rompía el ritmo: 3 barras iguales + un cuarto elemento con su propio espaciado, que se
  // terminaba viendo más grande/desparejo que las barras). Así las 3 filas quedan parejas y el % es
  // solo una aclaración chica, no compite en peso visual con Tráfico/Ventas/Ventas falladas.
  container.innerHTML=steps.map(([label,value,step,cls])=>`<div class="funnel-row"><span class="funnel-label">${label}${step!==null?`<small class="funnel-step-inline">↓ ${percent(step)}</small>`:''}</span><div class="funnel-track"><div class="funnel-fill ${cls}" style="width:${Math.max(2,value/top*100)}%"></div></div><span class="funnel-value">${number(value)}</span></div>`).join('');
}
function diagnosisRow(label,valueFmt,real,objetivo,hasObj,invert){
  if(!hasObj)return `<div class="diagnosis-row"><span class="diagnosis-label">${label}</span><span class="diagnosis-value">${valueFmt(real)}</span><span class="diagnosis-note">sin objetivo cargado</span></div>`;
  const deltaPct=objetivo?(real-objetivo)/objetivo*100:0;
  return `<div class="diagnosis-row"><span class="diagnosis-label">${label}</span><span class="diagnosis-value">${valueFmt(real)}</span>${kpiTrendRow(deltaPct,`${deltaPct>=0?'+':''}${deltaPct.toFixed(1)}% vs. objetivo (${valueFmt(objetivo)})`,invert)}</div>`;
}
// Traduce el desvío de conversión/ticket a una sola frase: cuál de las dos variables está más
// lejos del objetivo es, en general, "dónde está la falla" (atención/cierre vs. upselling).
// Genérico: lo usan Locales (a nivel local) y Métricas vendedores (a nivel persona).
function renderDiagnosisPanel(containerId,avgConv,avgConvObj,hasConvObj,avgTicket,avgTicketObj,hasTicketObj){
  const container=$(containerId);
  if(!hasConvObj&&!hasTicketObj){container.classList.add('empty-state');container.innerHTML='Sin objetivos de conversión o ticket cargados para este período.';return}
  container.classList.remove('empty-state');
  const convGap=hasConvObj&&avgConvObj?(avgConv-avgConvObj)/avgConvObj*100:null;
  const ticketGap=hasTicketObj&&avgTicketObj?(avgTicket-avgTicketObj)/avgTicketObj*100:null;
  let focusLine='';
  if(convGap!==null&&convGap<-0.5&&(ticketGap===null||convGap<=ticketGap))focusLine='Foco: conversión por debajo del objetivo — el problema está en la atención/cierre en el piso.';
  else if(ticketGap!==null&&ticketGap<-0.5)focusLine='Foco: ticket promedio por debajo del objetivo — el problema está en venta cruzada / upselling.';
  else if(convGap!==null||ticketGap!==null)focusLine='Sin desvíos relevantes contra el objetivo.';
  container.innerHTML=diagnosisRow('Conversión',v=>percent(v*100),avgConv,avgConvObj,hasConvObj,false)+diagnosisRow('Ticket promedio',money,avgTicket,avgTicketObj,hasTicketObj,false)+(focusLine?`<div class="diagnosis-focus">${focusLine}</div>`:'');
}
// Agrupa LOCAL_DIARIO por local para la tabla de "Foco" (solo tiene sentido con el filtro en "Todos los locales").
function computeStoreFocusRows(rows){
  const groups={};
  rows.forEach(row=>{
    const key=row.Local||'Sin local';
    if(!groups[key])groups[key]={local:key,pond:nuevoPonderado(),targetTraffic:0,convObjSum:0,convObjCount:0,ticketObjSum:0,ticketObjCount:0,count:0};
    const g=groups[key];
    g.targetTraffic+=num(row,'Tráfico nec.')||num(row,'Tráfico obj');
    sumarPonderado(g.pond,num(row,'Venta real'),num(row,'Ticket prom.'),num(row,'PxT real'),num(row,'Tráfico real'));
    const convObj=convRate(row,'Conversión obj'),ticketObj=num(row,'Ticket obj');
    if(convObj){g.convObjSum+=convObj;g.convObjCount++}
    if(ticketObj){g.ticketObjSum+=ticketObj;g.ticketObjCount++}
    g.count++;
  });
  return Object.values(groups).map(g=>{
    // Conversión/Ticket obj son un valor mensual constante repetido por día — promediar dividiendo
    // por g.count (TODOS los días del período) diluía el % apenas faltara un solo día con esa
    // columna sin cargar (ej. columna agregada a mitad de mes). Ahora se divide por la cantidad de
    // días donde el objetivo realmente vino cargado, igual que ya hacía avgConv/avgTicket con los
    // valores reales (bug real, auditoría 2026-09-05).
    const p=cerrarPonderado(g.pond);
    const avgConv=p.conversion,avgConvObj=g.convObjCount?g.convObjSum/g.convObjCount:0;
    const avgTicket=p.ticket,avgTicketObj=g.ticketObjCount?g.ticketObjSum/g.ticketObjCount:0;
    const trafficRatio=g.targetTraffic?p.trafico/g.targetTraffic:null;
    return{
      local:g.local,traffic:p.trafico,avgConv,avgConvObj,avgTicket,avgTicketObj,trafficRatio,
      convGapPct:avgConvObj?(avgConv-avgConvObj)/avgConvObj*100:null,
      ticketGapPct:avgTicketObj?(avgTicket-avgTicketObj)/avgTicketObj*100:null,
      trafficGapPct:trafficRatio!==null?(trafficRatio-1)*100:null
    };
  });
}
// candidates: [{label,gap}] — gap en % respecto al objetivo (negativo = por debajo). Genérico:
// lo usan la tabla de Foco por local y la de Foco por vendedor.
function focusTag(candidates){
  const negative=candidates.filter(c=>c.gap!==null&&c.gap<-0.5);
  if(!negative.length)return{label:'OK',tone:'good'};
  negative.sort((a,b)=>a.gap-b.gap);
  return{label:`${negative[0].label} ↓`,tone:'bad'};
}
// Vive en su propia pestaña "Foco" (ver storeViewTabs/applyStoreTab) — acá ya no se oculta el panel
// entero según el filtro, solo tiene sentido con "Todos los locales" así que cuando no aplica se
// explica por qué en vez de dejar la pestaña en blanco sin motivo aparente.
function renderStoreFocus(rows){
  const isAllLocales=$('localFilter').value==='all';
  if(!isAllLocales){
    $('storeFocusRowsCount').textContent='';
    $('storeFocusTable').innerHTML='<tbody><tr><td class="empty-state">Elegí "Todos los locales" en el filtro de arriba para ver este análisis.</td></tr></tbody>';
    return;
  }
  const focusRows=computeStoreFocusRows(rows);
  $('storeFocusRowsCount').textContent=`${focusRows.length} locales`;
  $('storeFocusTable').innerHTML=focusRows.length?`<thead><tr><th>Local</th><th class="align-right">Conversión</th><th class="align-right">Ticket promedio</th><th class="align-right">Tráfico</th><th>Foco</th></tr></thead><tbody>${focusRows.map(r=>{const tag=focusTag([{label:'Tráfico',gap:r.trafficGapPct},{label:'Conversión',gap:r.convGapPct},{label:'Ticket',gap:r.ticketGapPct}]);return `<tr><td class="seller-name">${escapeHtml(r.local)}</td><td class="num">${percent(r.avgConv*100)}${r.avgConvObj?` · obj. ${percent(r.avgConvObj*100)}`:''}</td><td class="num">${money(r.avgTicket)}${r.avgTicketObj?` · obj. ${money(r.avgTicketObj)}`:''}</td><td class="num">${r.trafficRatio!==null?percent(r.trafficRatio*100):number(r.traffic||0)}</td><td class="${tag.tone}">${tag.label}</td></tr>`}).join('')}</tbody>`:'<tbody><tr><td colspan="5" class="empty-state">Sin datos para estos filtros</td></tr></tbody>';
}
// ── Ventas por sucursal (pestaña propia de Locales) ─────────────────────────────
// Réplica de la planilla "Ventas por sucursal" armada con lo que publica el consolidador. Tres
// cosas que valen para toda la tabla:
//  · Efectivo/Tarjeta/Descuento/PxT llegan como PORCENTAJE mensual repetido en cada fila del día
//    (no como monto, y no por día). Se promedian sobre los días donde vinieron cargados —mismo
//    criterio y mismo motivo que el bloque `monthly` de renderStores— y los pesos se derivan
//    aplicando ese % sobre la venta del período. Con un filtro de fechas de media semana el % sigue
//    siendo el del mes entero: no hay un dato más fino en el endpoint.
//  · "Venta real" es la venta NETA (= Efectivo + Tarjeta). El "Total" de la planilla es el BRUTO,
//    antes del descuento: Total = Venta / (1 − % Descuento) y Descuentos = Total − Venta.
//    Verificado contra la planilla: Unicenter $26.900.101 × 23,69% = $6.372.634 de descuentos.
//  · La cantidad de TICKETS no viene en el endpoint: se deriva como Venta del día ÷ Ticket promedio
//    del día, que da entero exacto en la enorme mayoría de los días cargados. De ahí salen también
//    Cantidad (tickets × PxT), Producto promedio y la conversión de esta tabla.
// OJO con Tráfico/Conversión: acá son los de la planilla (gente que ENTRÓ al local), no los del
// sistema de ventas (clientes ATENDIDOS). Son dos métricas distintas y esta da más baja: un reporte
// de caja divide por los clientes atendidos, este por todos los que cruzaron la puerta. Se aclara
// en la nota al pie del panel para que nadie lo lea como un error de cálculo. Usa el mismo
// criterio ponderado y el mismo TICKET_MIN_VALIDO que el resto (ver sumarPonderado, arriba).

// Precio de accesorios y objetivo de participación. Desde la v12 del consolidador los tres
// llegan POR LOCAL en LOCAL_DIARIO ('Precio perfume', 'Precio boxer', 'Factor accesorios'),
// leídos del bloque CONFIGURACIÓN de su planilla, así que pueden ser distintos en cada local y
// se actualizan solos cuando cambia el precio. Estos valores quedan como RESPALDO para cuando
// el endpoint todavía no los manda (consolidador viejo) o el bloque no se pudo leer — sin esto
// la tabla mostraría $0 en toda la columna de pesos. Los pesos son unidades × precio de lista:
// con descuentos o promos, lo facturado es menor.
const PRECIO_PERFUME=23999,PRECIO_BOXER=18999,ACCESORIO_OBJETIVO_PCT=0.02;

// Perfumes/Boxers vienen por VENDEDOR y por SEMANA (VENDEDOR_SEMANAL), no por día ni por local: se
// suman los vendedores de cada local en las semanas que toca el período filtrado. Si el filtro de
// fechas corta una semana por la mitad entra la semana entera — es la única granularidad publicada.
function accessoryUnitsByStore(weekKeys){
  const out={};
  (state.tables.VENDEDOR_SEMANAL||[]).forEach(row=>{
    if(!weekKeys.has(`${row.Mes}|${row.Semana}`))return;
    const local=row.Local||'Sin local';
    const entry=out[local]||(out[local]={perfumes:0,boxer:0});
    entry.perfumes+=num(row,'Perfumes real');
    entry.boxer+=num(row,'Boxer real');
  });
  return out;
}

function computeStoreBreakdownRows(rows){
  const groups={},weekKeys=new Set();
  rows.forEach(row=>{
    const local=row.Local||'Sin local';
    const g=groups[local]||(groups[local]={local,venta:0,traffic:0,tickets:0,prendas:0,diasRaros:0,
      cash:0,cashCount:0,card:0,cardCount:0,discount:0,discountCount:0,pxt:0,pxtCount:0,
      convObj:0,convObjCount:0,ticketObj:0,ticketObjCount:0,pxtObj:0,pxtObjCount:0,
      precioPerf:0,precioPerfCount:0,precioBox:0,precioBoxCount:0,factorAcc:0,factorAccCount:0});
    const venta=num(row,'Venta real'),ticketProm=num(row,'Ticket prom.'),pxt=num(row,'PxT real');
    g.venta+=venta;
    g.traffic+=num(row,'Tráfico real');
    // Piso de sanidad: hay días con el Ticket promedio cargado en miles en vez de en pesos (49 en
    // vez de ~49.000). Sin este filtro, un solo día así mete 16.000 tickets y deja la Cantidad, la
    // Conversión y el Producto promedio de todo el local sin sentido. Se cuentan aparte para poder
    // avisarlo en el panel, en vez de mostrar el número roto o de esconder el problema.
    if(venta){
      if(ticketProm>=TICKET_MIN_VALIDO){const tickets=venta/ticketProm;g.tickets+=tickets;g.prendas+=tickets*pxt}
      else g.diasRaros++;
    }
    const cash=num(row,'Efectivo'),card=num(row,'Tarjeta'),discount=num(row,'Descuento');
    const convObj=convRate(row,'Conversión obj'),ticketObj=num(row,'Ticket obj'),pxtObj=num(row,'PxT obj');
    if(cash){g.cash+=cash;g.cashCount++}
    if(card){g.card+=card;g.cardCount++}
    if(discount){g.discount+=discount;g.discountCount++}
    if(pxt){g.pxt+=pxt;g.pxtCount++}
    if(convObj){g.convObj+=convObj;g.convObjCount++}
    if(ticketObj){g.ticketObj+=ticketObj;g.ticketObjCount++}
    if(pxtObj){g.pxtObj+=pxtObj;g.pxtObjCount++}
    const precioPerf=num(row,'Precio perfume'),precioBox=num(row,'Precio boxer'),factorAcc=num(row,'Factor accesorios');
    if(precioPerf){g.precioPerf+=precioPerf;g.precioPerfCount++}
    if(precioBox){g.precioBox+=precioBox;g.precioBoxCount++}
    if(factorAcc){g.factorAcc+=factorAcc;g.factorAccCount++}
    if(row.Mes!==undefined&&row.Semana!==undefined)weekKeys.add(`${row.Mes}|${row.Semana}`);
  });
  const accesorios=accessoryUnitsByStore(weekKeys);
  return Object.values(groups).map(g=>{
    const avg=(sum,count)=>count?sum/count:0;
    const pctCash=avg(g.cash,g.cashCount),pctCard=avg(g.card,g.cardCount),pctDiscount=avg(g.discount,g.discountCount);
    const bruto=pctDiscount>0&&pctDiscount<1?g.venta/(1-pctDiscount):g.venta;
    const acc=accesorios[g.local]||{perfumes:0,boxer:0};
    // El ||  cubre los dos casos de "no vino": que el endpoint no mande la columna todavía y que
    // la mande en 0 porque no se pudo leer el bloque CONFIGURACIÓN de esa planilla.
    const precioPerfume=avg(g.precioPerf,g.precioPerfCount)||PRECIO_PERFUME;
    const precioBoxer=avg(g.precioBox,g.precioBoxCount)||PRECIO_BOXER;
    const factorAcc=avg(g.factorAcc,g.factorAccCount)||ACCESORIO_OBJETIVO_PCT;
    const perfumesMonto=acc.perfumes*precioPerfume,boxerMonto=acc.boxer*precioBoxer;
    const objetivoAcc=g.venta*factorAcc;
    return{
      local:g.local,venta:g.venta,bruto,descuentos:bruto-g.venta,pctDiscount,
      efectivo:g.venta*pctCash,tarjeta:g.venta*pctCard,pctCash,pctCard,
      tickets:g.tickets,prendas:g.prendas,traffic:g.traffic,
      vtaFallida:Math.max(0,g.traffic-g.tickets),
      conversion:g.traffic?g.tickets/g.traffic:null,
      ticketProm:g.tickets?g.venta/g.tickets:0,
      productoProm:g.prendas?g.venta/g.prendas:0,
      pxt:avg(g.pxt,g.pxtCount),
      convObj:avg(g.convObj,g.convObjCount),ticketObj:avg(g.ticketObj,g.ticketObjCount),pxtObj:avg(g.pxtObj,g.pxtObjCount),
      precioPerfume,precioBoxer,factorAcc,
      perfumes:acc.perfumes,perfumesMonto,perfumesPct:g.venta?perfumesMonto/g.venta:0,perfumesFalta:objetivoAcc-perfumesMonto,
      boxer:acc.boxer,boxerMonto,boxerPct:g.venta?boxerMonto/g.venta:0,boxerFalta:objetivoAcc-boxerMonto,
      diasRaros:g.diasRaros
    };
  });
}

const STORE_BREAKDOWN_SORT={
  local:r=>r.local,bruto:r=>r.bruto,descuentos:r=>r.descuentos,pctDiscount:r=>r.pctDiscount,
  efectivo:r=>r.efectivo,tarjeta:r=>r.tarjeta,pctCash:r=>r.pctCash,pctCard:r=>r.pctCard,
  prendas:r=>r.prendas,tickets:r=>r.tickets,vtaFallida:r=>r.vtaFallida,traffic:r=>r.traffic,
  conversion:r=>r.conversion??-1,ticketProm:r=>r.ticketProm,productoProm:r=>r.productoProm,pxt:r=>r.pxt
};
const STORE_ACCESSORY_SORT={
  local:r=>r.local,perfumes:r=>r.perfumes,perfumesMonto:r=>r.perfumesMonto,perfumesPct:r=>r.perfumesPct,
  perfumesFalta:r=>r.perfumesFalta,boxer:r=>r.boxer,boxerMonto:r=>r.boxerMonto,boxerPct:r=>r.boxerPct,boxerFalta:r=>r.boxerFalta
};

// Ordena `list` in-place según la columna elegida en esa tabla; sin columna elegida, el que más
// vendió arriba. Lo comparten las dos tablas del panel, que tienen su propio state.sort.table.
function sortBreakdownList(list,tableId,sortMap){
  const active=state.sort.table===tableId?sortMap[state.sort.key]:null;
  list.sort((a,b)=>{
    if(!active)return b.venta-a.venta;
    const av=active(a),bv=active(b);
    if(typeof av==='string')return av.localeCompare(bv,'es')*state.sort.direction;
    return (av<bv?-1:av>bv?1:0)*state.sort.direction;
  });
}
function breakdownHeader(cols,tableId){
  return `<thead><tr>${cols.map(([label,key])=>{
    const isActive=state.sort.table===tableId&&state.sort.key===key;
    const sortAttr=isActive?(state.sort.direction>0?'ascending':'descending'):'none';
    return `<th data-sort="${key}" tabindex="0" aria-sort="${sortAttr}"${key==='local'?'':' class="align-right"'}>${label}${isActive?' '+(state.sort.direction>0?'↑':'↓'):''}</th>`;
  }).join('')}</tr></thead>`;
}
const pxtTexto=(value,decimales=2)=>Number(value||0).toFixed(decimales).replace('.',',');

function renderStoreBreakdown(rows){
  const base=computeStoreBreakdownRows(rows);
  const vacio=id=>{$(`${id}RowsCount`).textContent='';$(`${id}Table`).innerHTML='<tbody><tr><td class="empty-state">Sin datos para estos filtros</td></tr></tbody>'};
  if(!base.length){vacio('storeBreakdown');vacio('storeAccessory');$('storeBreakdownNote').textContent='';return}

  // Totales: los montos y las unidades se suman; los porcentajes se RECALCULAN sobre esos totales
  // (o sea, ponderados por venta), nunca se promedian los promedios de cada local.
  const t=base.reduce((acc,r)=>{['venta','bruto','descuentos','efectivo','tarjeta','tickets','prendas','traffic','vtaFallida','perfumes','perfumesMonto','boxer','boxerMonto'].forEach(k=>acc[k]+=r[k]);return acc},
    {venta:0,bruto:0,descuentos:0,efectivo:0,tarjeta:0,tickets:0,prendas:0,traffic:0,vtaFallida:0,perfumes:0,perfumesMonto:0,boxer:0,boxerMonto:0});
  const cobrado=t.efectivo+t.tarjeta,objetivoAcc=t.venta*ACCESORIO_OBJETIVO_PCT;
  const tot={...t,pctDiscount:t.bruto?t.descuentos/t.bruto:0,pctCash:cobrado?t.efectivo/cobrado:0,pctCard:cobrado?t.tarjeta/cobrado:0,
    conversion:t.traffic?t.tickets/t.traffic:null,ticketProm:t.tickets?t.venta/t.tickets:0,productoProm:t.prendas?t.venta/t.prendas:0,
    pxt:t.tickets?t.prendas/t.tickets:0,
    perfumesPct:t.venta?t.perfumesMonto/t.venta:0,perfumesFalta:objetivoAcc-t.perfumesMonto,
    boxerPct:t.venta?t.boxerMonto/t.venta:0,boxerFalta:objetivoAcc-t.boxerMonto};

  // Semáforo solo donde hay un objetivo REAL cargado en la planilla (Conversión obj, Ticket obj,
  // PxT obj). Para % Descuento no existe objetivo: se muestra neutro y el promedio de la red queda
  // en la fila de Total, que es contra lo que se compara para ver quién se va de escala.
  const tone=(actual,target)=>!target?'':cumplClase(actual/target);

  const cols=[['Local','local'],['Total','bruto'],['Descuentos','descuentos'],['% Desc.','pctDiscount'],
    ['Efectivo','efectivo'],['Tarjeta','tarjeta'],['% Efec.','pctCash'],['% Tarj.','pctCard'],
    // "Q" adelante en las dos columnas que son un CONTEO y no pesos (pedido 2026-10-01): en una
    // tabla donde Total/Efectivo/Tarjeta están en $, una columna "Ventas" con 433 se lee como plata.
    // Misma convención que ya usa "Q ventas" en la tabla de e-commerce. Y "Q tickets" en vez de
    // "Q ventas" porque es lo que mide: operaciones cerradas, el denominador del ticket promedio.
    ['Q cantidad','prendas'],['Q tickets','tickets'],['Vta. fallida','vtaFallida'],['Tráfico','traffic'],
    ['Conversión','conversion'],['Ticket prom.','ticketProm'],['Producto prom.','productoProm'],['PxT','pxt']];
  const celdas=(r,conSemaforo)=>`<td class="num">${money(r.bruto)}</td><td class="num">${money(r.descuentos)}</td><td class="num">${percent(r.pctDiscount*100)}</td>`+
    `<td class="num">${money(r.efectivo)}</td><td class="num">${money(r.tarjeta)}</td>`+
    `<td class="num">${percent(r.pctCash*100)}</td><td class="num">${percent(r.pctCard*100)}</td>`+
    `<td class="num">${number(r.prendas)}</td><td class="num">${number(r.tickets)}</td>`+
    `<td class="num">${number(r.vtaFallida)}</td><td class="num">${number(r.traffic)}</td>`+
    `<td class="num ${conSemaforo?tone(r.conversion||0,r.convObj):''}">${r.conversion===null?'—':percent(r.conversion*100)}</td>`+
    `<td class="num ${conSemaforo?tone(r.ticketProm,r.ticketObj):''}">${money(r.ticketProm)}</td>`+
    `<td class="num">${money(r.productoProm)}</td>`+
    `<td class="num ${conSemaforo?tone(r.pxt,r.pxtObj):''}">${pxtTexto(r.pxt)}</td>`;
  const lista=[...base];sortBreakdownList(lista,'storeBreakdownTable',STORE_BREAKDOWN_SORT);
  $('storeBreakdownTable').innerHTML=breakdownHeader(cols,'storeBreakdownTable')+
    `<tbody>${lista.map(r=>`<tr><td class="seller-name">${escapeHtml(r.local)}</td>${celdas(r,true)}</tr>`).join('')}`+
    `<tr class="breakdown-total"><td class="seller-name">Total</td>${celdas(tot,false)}</tr></tbody>`;
  $('storeBreakdownRowsCount').textContent=`${lista.length} ${lista.length===1?'local':'locales'}`;

  // Accesorios en tabla aparte (como las dos planillas de Perfumes y Boxer): el consolidador manda
  // solo unidades, los pesos son unidades × precio de lista (ver PRECIO_PERFUME/PRECIO_BOXER).
  // "Falta 2%" es cuánto más habría que vender de esa categoría para llegar al 2% de la venta del
  // local; en negativo significa que ya lo superó.
  const accCols=[['Local','local'],['Perfumes u.','perfumes'],['Perfumes $','perfumesMonto'],['% s/venta','perfumesPct'],['Falta 2%','perfumesFalta'],
    ['Boxers u.','boxer'],['Boxers $','boxerMonto'],['% s/venta','boxerPct'],['Falta 2%','boxerFalta']];
  const accCeldas=r=>`<td class="num">${number(r.perfumes)}</td><td class="num">${money(r.perfumesMonto)}</td>`+
    `<td class="num ${cumplClase(r.perfumesPct/(r.factorAcc||ACCESORIO_OBJETIVO_PCT))}">${percent(r.perfumesPct*100)}</td>`+
    `<td class="num">${r.perfumesFalta<=0?'✓':money(r.perfumesFalta)}</td>`+
    `<td class="num">${number(r.boxer)}</td><td class="num">${money(r.boxerMonto)}</td>`+
    `<td class="num ${cumplClase(r.boxerPct/(r.factorAcc||ACCESORIO_OBJETIVO_PCT))}">${percent(r.boxerPct*100)}</td>`+
    `<td class="num">${r.boxerFalta<=0?'✓':money(r.boxerFalta)}</td>`;
  const accLista=[...base];sortBreakdownList(accLista,'storeAccessoryTable',STORE_ACCESSORY_SORT);
  $('storeAccessoryTable').innerHTML=breakdownHeader(accCols,'storeAccessoryTable')+
    `<tbody>${accLista.map(r=>`<tr><td class="seller-name">${escapeHtml(r.local)}</td>${accCeldas(r)}</tr>`).join('')}`+
    `<tr class="breakdown-total"><td class="seller-name">Total</td>${accCeldas(tot)}</tr></tbody>`;
  $('storeAccessoryRowsCount').textContent=`${money(tot.perfumesMonto+tot.boxerMonto)} en accesorios`;

  // Los avisos aparecen solo cuando corresponde, en vez de un texto fijo que nadie lee: la plata
  // que se fue sin comprar (lo más accionable de la tabla) y los días con el Ticket promedio mal
  // cargado en la planilla, que quedaron fuera del cálculo de unidades.
  const raros=base.filter(r=>r.diasRaros>0);
  $('storeBreakdownNote').innerHTML=[
    'Tráfico y Conversión salen de la planilla: cuentan la gente que ENTRÓ al local, no los clientes atendidos en el sistema de ventas. Por eso la conversión da más baja que la de un reporte de caja.',
    tot.vtaFallida>0?`Las <strong>${number(tot.vtaFallida)}</strong> personas que entraron y no compraron equivalen a <strong>${money(tot.vtaFallida*tot.ticketProm)}</strong> al ticket promedio de la red.`:'',
    raros.length?`<span class="negative">Revisar la planilla:</span> ${raros.map(r=>`${escapeHtml(r.local)} (${r.diasRaros} ${r.diasRaros===1?'día':'días'})`).join(', ')} tienen el Ticket promedio cargado en miles en vez de en pesos. Esos días quedaron fuera de Cantidad, Ventas y Conversión.`:'',
    (()=>{
      const perf=[...new Set(base.map(r=>r.precioPerfume))],box=[...new Set(base.map(r=>r.precioBoxer))];
      const detalle=perf.length===1&&box.length===1?` (perfume ${money(perf[0])}, boxer ${money(box[0])})`:' al precio cargado en la planilla de cada local';
      return `Los pesos de accesorios son unidades × precio de lista${detalle}: con descuentos, lo facturado es menor.`;
    })()
  ].filter(Boolean).join(' ');
  attachSortHeaders('storeBreakdownTable');
  attachSortHeaders('storeAccessoryTable');
}
// Conversión/Ticket objetivo son un valor mensual del LOCAL (no por vendedor, ver mapa de celdas del
// Sheet), así que el objetivo de cada vendedor para el diagnóstico es el de SU local — se cruza contra
// LOCAL_DIARIO filtrado por Local+Mes (no por Semana: es una constante mensual repetida por día).
function localObjetivoFor(local,month){
  const refRows=(state.tables.LOCAL_DIARIO||[]).filter(row=>String(row.Local??'')===String(local??'')&&(month==='all'||String(row.Mes??'')===month));
  // Se divide por la cantidad de días donde el objetivo realmente vino cargado, no por refRows.count
  // (todos los días del mes) — si algún día quedó sin esa columna cargada, dividir por el total de
  // días diluía el promedio por debajo del valor mensual real (bug real, auditoría 2026-09-05).
  const totals=refRows.reduce((acc,row)=>{
    const convObj=convRate(row,'Conversión obj'),ticketObj=num(row,'Ticket obj');
    if(convObj){acc.convObj+=convObj;acc.convObjCount++}
    if(ticketObj){acc.ticketObj+=ticketObj;acc.ticketObjCount++}
    return acc;
  },{convObj:0,convObjCount:0,ticketObj:0,ticketObjCount:0});
  return{convObj:totals.convObjCount?totals.convObj/totals.convObjCount:0,ticketObj:totals.ticketObjCount?totals.ticketObj/totals.ticketObjCount:0};
}
function computeSellerFocusRows(list,month){
  const cache={};
  return list.map(row=>{
    const avgConv=row.conversionAvg,avgTicket=row.ticketAvg;   // ya vienen ponderados
    if(!cache[row.local])cache[row.local]=localObjetivoFor(row.local,month);
    const obj=cache[row.local];
    return{
      local:row.local,name:row.name,traffic:row.traffic,avgConv,avgTicket,
      avgConvObj:obj.convObj,avgTicketObj:obj.ticketObj,
      convGapPct:obj.convObj?(avgConv-obj.convObj)/obj.convObj*100:null,
      ticketGapPct:obj.ticketObj?(avgTicket-obj.ticketObj)/obj.ticketObj*100:null
    };
  });
}
// Vive en su propia pestaña "Foco" (ver sellerViewTabs/applySellerTab). Comparar vendedores tiene
// sentido adentro de un mismo local (no mezclados de toda la red), así que solo aplica con un local
// puntual filtrado — si no, se explica por qué en vez de dejar la pestaña en blanco.
function renderSellerFocus(list,month){
  const showFocus=$('localFilter').value!=='all';
  if(!showFocus){
    $('sellerFocusRowsCount').textContent='';
    $('sellerFocusTable').innerHTML='<tbody><tr><td class="empty-state">Elegí un local específico en el filtro de arriba para ver este análisis.</td></tr></tbody>';
    return;
  }
  const focusRows=computeSellerFocusRows(list,month);
  $('sellerFocusRowsCount').textContent=`${focusRows.length} vendedores`;
  $('sellerFocusTable').innerHTML=focusRows.length?`<thead><tr><th>Vendedor</th><th>Local</th><th class="align-right">Conversión</th><th class="align-right">Ticket promedio</th><th>Foco</th></tr></thead><tbody>${focusRows.map(r=>{const tag=focusTag([{label:'Conversión',gap:r.convGapPct},{label:'Ticket',gap:r.ticketGapPct}]);return `<tr><td class="seller-name">${escapeHtml(r.name)}</td><td class="seller-location">${escapeHtml(r.local)}</td><td class="num">${percent(r.avgConv*100)}${r.avgConvObj?` · obj. ${percent(r.avgConvObj*100)}`:''}</td><td class="num">${money(r.avgTicket)}${r.avgTicketObj?` · obj. ${money(r.avgTicketObj)}`:''}</td><td class="${tag.tone}">${tag.label}</td></tr>`}).join('')}</tbody>`:'<tbody><tr><td colspan="5" class="empty-state">Sin datos para estos filtros</td></tr></tbody>';
}
// Pestañas "Resumen"/"Foco" de Locales y Métricas vendedores — mismo patrón que rankScopeTabs de
// Ranking (tabs con data-tab + toggle de "active" y de paneles hidden), sin acoplarlas entre sí:
// cada sección tiene su propio estado, se puede estar en "Foco" de Locales y "Resumen" de vendedores.
function applyStoreTab(){
  qa('#storeViewTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===state.storeTab));
  $('storeResumenPanel').hidden=state.storeTab!=='resumen';
  $('storeFocusPanel').hidden=state.storeTab!=='foco';
  $('storeBreakdownPanel').hidden=state.storeTab!=='sucursales';
}
function applySellerTab(){
  qa('#sellerViewTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===state.sellerTab));
  $('sellerResumenPanel').hidden=state.sellerTab!=='resumen';
  $('sellerFocusPanel').hidden=state.sellerTab!=='foco';
}
function render(){updatePeriod();renderOverview();renderStores();renderEcommerce();renderSellerMetrics();renderAccessories();renderSeason();renderRanking();renderRentabilidad();updatePeriodRangeBadge()}
// Normaliza Mes/Semana antes de armar la clave de semana: un espacio de más en la celda del
// Sheet (ej. "Septiembre " en vez de "Septiembre") rompía la comparación por igualdad estricta
// de strings y hacía que esa semana quedara silenciosamente afuera de "el mes actual" del GP VDH
// — no tiraba error, simplemente sumaba de menos sin que se notara.
function weekKeyOf(row){return `${String(row?.Mes??'').trim()}|${String(row?.Semana??'').trim()}`}
function weekKeyOrder(key){const [mes,semana]=key.split('|');return MONTH_ORDER.indexOf(mes)*10+Number(semana)}
function medalFor(i){if(i>2)return'';const tier=i===0?'gold':i===1?'silver':'bronze';return icon('medal',`medal-${tier}`)}
function rankPos(i){const m=medalFor(i);return `<span class="rank-pos">${m?`<span class="rank-medal">${m}</span>`:''}${i+1}</span>`}
// ── Vendedores que cubren más de un local (cobertura) ─────────────────────────────────────────
// El consolidador NO funde estas filas: cada local sigue viendo su propia venta real completa esa
// semana (así todo lo que rankea LOCALES —renderRankStores, mejoraLeaderStore, storeHealth, etc.—
// sigue viendo el total correcto de cada sucursal, sin perder nada). Acá SÍ se funden, pero solo
// para lo que rankea PERSONAS (Liga VDH, Sprints, GP VDH, Mayor Mejora, Métricas por vendedor,
// Accesorios, Temporada y Evolución): si el mismo nombre aparece en más de un Local dentro de la
// MISMA semana (Mes+Semana), se asume que es la misma persona cubriendo y se funden esas filas en
// una sola — bug real reportado el 2026-09-05 (una persona con dos locales aparecía partida en dos
// filas, cada una con la mitad de su venta y objetivo). Mismo criterio ya aplicado en el repo
// hermano ranking-vdh (ver fusionarCompartidos allá). Automático por nombre+apellido, sin lista
// manual a mantener: el equipo ya carga nombre+apellido en VENDEDOR_SEMANAL específicamente para
// que el nombre alcance como identidad única. Único riesgo real: si dos personas DISTINTAS
// compartieran nombre y apellido exacto en dos locales sin relación, se fundirían por error —
// poco probable con nombre+apellido siempre cargado, pero si pasa hay que volver a algo explícito.
function fusionarVendedoresCompartidos(rows){
  const grupos={},resto=[];
  rows.forEach(row=>{
    const key=`${row.Vendedor}|${weekKeyOf(row)}`;
    if(!grupos[key])grupos[key]=[];
    grupos[key].push(row);
  });
  Object.values(grupos).forEach(partes=>{
    const localesDistintos=[...new Set(partes.map(r=>r.Local))];
    if(localesDistintos.length===1){partes.forEach(p=>resto.push(p));return} // un solo local esa semana: nada que fundir
    const sumaCol=campo=>partes.reduce((s,r)=>s+num(r,campo),0);
    // TP/PxT/Conv son promedios, no cantidades — sumarlos infla el número. Se recalculan
    // ponderados por su propio peso natural: Conversión por Tráfico real, TP y PxT por Venta
    // (real u obj según corresponda) — mismo criterio que ranking-vdh.
    const promedioCol=(campo,pesoCampo)=>{const peso=sumaCol(pesoCampo);return peso?partes.reduce((s,r)=>s+num(r,campo)*num(r,pesoCampo),0)/peso:0};
    // Conv real pasa por convRate (no num) antes de ponderar — si una de las filas a fundir viene
    // con el problema de tipeo "58" en vez de "0.58" (ver convRate), promediarla cruda inflaba el
    // resultado igual que en el resto de los usos de este campo.
    const promedioColConv=pesoCampo=>{const peso=sumaCol(pesoCampo);return peso?partes.reduce((s,r)=>s+convRate(r,'Conv real')*num(r,pesoCampo),0)/peso:0};
    const base={...partes[0]};
    base.Local=localesDistintos.sort().join(' + ');
    ['Venta obj','Venta real','Tráfico real','Perfumes obj','Perfumes real','Boxer obj','Boxer real'].forEach(c=>{base[c]=sumaCol(c)});
    base['Conv real']=promedioColConv('Tráfico real');
    base['TP obj']=promedioCol('TP obj','Venta obj');
    base['TP real']=promedioCol('TP real','Venta real');
    base['PxT obj']=promedioCol('PxT obj','Venta obj');
    base['PxT real']=promedioCol('PxT real','Venta real');
    resto.push(base);
  });
  return resto;
}
function currentWeekRows(){
  const local=$('localFilter').value,seller=$('sellerFilter').value;
  const rows=(state.tables.VENDEDOR_SEMANAL||[]).filter(row=>(local==='all'||String(row.Local??'')===local)&&(seller==='all'||String(row.Vendedor??'')===seller));
  const weekKeys=[...new Set(rows.map(weekKeyOf))].sort((a,b)=>weekKeyOrder(a)-weekKeyOrder(b));
  return {rows,weekKeys};
}
// Misma base que currentWeekRows(), pero con las filas ya fundidas por vendedor compartido — usarla
// en TODO lo que rankee PERSONAS (Liga, Sprints, Mejora). Lo que rankea LOCALES sigue usando
// currentWeekRows() crudo a propósito (ver comentario de fusionarVendedoresCompartidos arriba).
function currentWeekRowsPersonas(){
  const {rows,weekKeys}=currentWeekRows();
  // Con el ajuste manual de la app de Ranking (Sole Lescano, sept S3-S4) aplicado semana por semana.
  return {rows:fusionarVendedoresCompartidos(rows).map(r=>aplicarAjustesManuales([r],weekKeyOf(r))[0]),weekKeys};
}
function showRankingEmpty(){
  $('rankingPeriodBadge').textContent='Sin semana';
  $('rankingMetrics').innerHTML='';
  $('rankingTable').innerHTML='';
  $('rankingRowsCount').textContent='';
  $('rankingFootnote').hidden=true;
}
const RANK_CATEGORIES={
  liga:{label:'Liga VDH',field:null,mode:'ratio',fmt:money,valueLabel:'Venta real',totalLabel:'Promedio de venta / vendedor',kicker:'OBJETIVO SEMANAL',heading:'Ranking general por % de cumplimiento de objetivo'},
  mejora:{label:'Mejora',kicker:'VS. SEMANA ANTERIOR',heading:'Todos los vendedores'},
  ticket:{label:'Ticket',field:'TP',mode:'ratio',fmt:money,valueLabel:'Ticket promedio',totalLabel:'Ticket promedio equipo',kicker:'SPRINT VDH · TICKET PROMEDIO',heading:'Calidad de venta, no volumen'},
  perfumes:{label:'Perfumes',field:'Perfumes',mode:'units',sortable:true,fmt:number,valueLabel:'Perfumes',totalLabel:'Perfumes vendidos',kicker:'SPRINT VDH · PERFUMES',heading:'Unidades vendidas en la semana'},
  boxer:{label:'Boxer',field:'Boxer',mode:'units',sortable:true,fmt:number,valueLabel:'Boxers',totalLabel:'Boxers vendidos',kicker:'SPRINT VDH · BOXER',heading:'Unidades vendidas en la semana'},
  pxt:{label:'PxT',field:'PxT',mode:'ratio',fmt:number,valueLabel:'PxT',totalLabel:'PxT promedio equipo',kicker:'SPRINT VDH · PRENDAS POR TICKET',heading:'Cross-sell de la semana'}
};
// ── GRAN PREMIO VDH (puntos estilo F1: Carrera Principal + Sprints) ──
// Los puntos siempre se calculan sobre TODO VENDEDOR_SEMANAL (sin aplicar los filtros de
// Local/Vendedor de arriba): el puesto que da los puntos es el ranking real de la empresa,
// no el de un local filtrado. Los filtros solo acotan qué filas se MUESTRAN en la tabla.
// 15 puestos que puntúan en la carrera principal de VENDEDORES (25…1 de F1 y después 1 pt parejo
// hasta el 15º); los locales reparten solo al top 10 (STORE_MAIN_TOP). Igual que la app de Ranking
// (Ranking VDH/app.js, MAIN_POINTS): el dashboard y la app tienen que dar EXACTAMENTE el mismo
// campeonato (pedido 2026-10-02). Si cambia una regla, cambiarla en los dos lados.
const F1_MAIN_POINTS=[25,18,15,12,10,8,6,4,2,1,1,1,1,1,1];
const STORE_MAIN_TOP=10;
// Bajado de [8,7,6,5,4,3,2,1] el 2026-09-06, portado desde el repo hermano ranking-vdh (que ya
// había hecho este cambio el 2026-09-04): con la escala vieja, barrer los 4 sprints (Ticket,
// Perfumes, Bóxer, PxT) daba hasta 32 pts, más que ganar la Venta de la semana (25 pts la carrera
// principal) — le podía ganar el puesto a quien más vendió. Con techo de 4 por sprint, barrer los
// 4 da como máximo 16 pts, bien por debajo de ganar Venta — los sprints siguen sumando y
// desempatando, pero ya no le ganan el puesto al que más vendió. Se mantienen los mismos 8 puestos
// que puntúan (solo baja el valor). La usan tanto GP VDH de vendedores como Copa Constructores de
// locales (ver buildStoreChampionship) — misma escala en las dos, para no puntuar distinto según
// si el que suma es una persona o un local.
const F1_SPRINT_POINTS=[4,3,2,1,1,1,1,1];
const F1_SPRINT_FIELDS={ticket:'TP',perfumes:'Perfumes',boxer:'Boxer',pxt:'PxT'};
function f1AllWeekKeys(){const rows=state.tables.VENDEDOR_SEMANAL||[];return[...new Set(rows.map(weekKeyOf))].sort((a,b)=>weekKeyOrder(a)-weekKeyOrder(b))}
// Fundida: f1WeekRows se usa para puntajes de PERSONAS (Liga/Sprints/GP VDH). Copa Constructores
// (locales) necesita la variante SIN fundir — ver f1WeekRowsCrudo más abajo — porque cada local
// tiene que ver su propia venta real completa, no la mitad de un vendedor que cubrió dos locales
// esa semana (mismo criterio que currentWeekRows/currentWeekRowsPersonas, ver esa nota más arriba).
function f1WeekRows(weekKey){return aplicarAjustesManuales(fusionarVendedoresCompartidos((state.tables.VENDEDOR_SEMANAL||[]).filter(r=>weekKeyOf(r)===weekKey)),weekKey)}
function f1WeekRowsCrudo(weekKey){return(state.tables.VENDEDOR_SEMANAL||[]).filter(r=>weekKeyOf(r)===weekKey)}
// Empates: si dos personas quedan exactamente igual en % de cumplimiento, la posición (y los
// puntos F1/Sprint que reparte esa posición) se define por mayor venta/unidad absoluta real y,
// si también empatan ahí, alfabético — determinístico siempre, nunca "quien cargó primero en la
// planilla" (Array.sort es estable, pero el orden de origen no tiene ningún criterio de negocio).
// ── Reglas de clasificación, portadas de la app de Ranking el 2026-10-02 ─────────────────────
// Hasta acá el dashboard rankeaba sin ninguna de estas reglas y su GP podía dar un campeón distinto
// del que mostraba la app. Están explicadas en detalle en Ranking VDH/app.js; acá, en corto:
//
// MIN_DIAS_CLASIFICA: 3 días con venta en la semana para entrar a puntos. Caso que la originó: una
//   vendedora trabajó solo un domingo, arrastró un objetivo chico y quedó 1ª con 216%. Rampa a mitad
//   de semana: se pide la mitad de los días que lleva abierto el local, con techo 3.
// MIN_TICKETS: 8 tickets en la semana para Ticket y PxT, que son promedios por operación: con
//   pocas, una venta grande los dispara. Misma rampa, sobre una semana tipo de 6 días.
// objetivoEfectivo: en Perfumes y Bóxer un objetivo 0 cuenta como 1 unidad; si no, el % no existe
//   y quien vendió quedaba afuera del ranking.
// Los que no clasifican NO desaparecen: van al final con su %, sin medalla y sin puntos.
const MIN_DIAS_CLASIFICA=3;
const MIN_TICKETS=8;
const SPRINT_PROMEDIO=['TP','PxT'];
const SPRINT_UNIDADES=['Perfumes','Boxer'];
const objetivoEfectivo=(field,obj)=>SPRINT_UNIDADES.includes(field)&&!(obj>0)?1:obj;
const estaClasificado=p=>p.clasifica!==false;
// Excepción puntual de la app: semanas 3 y 4 de septiembre, Sole Lescano cubrió domingos en un local
// sin lugar en la planilla y esa venta quedó a nombre de otra persona. Solo toca lo que rankea
// PERSONAS (el local ya tiene su venta bien contada). No es un mecanismo para seguir usando.
const AJUSTES_MANUALES_VENDEDOR=[
  {weekKey:'Septiembre|4',vendedor:'Sole Lescano',ventaReal:1203999,ventaObj:369685},
  {weekKey:'Septiembre|3',vendedor:'Sole Lescano',ventaReal:1193500,ventaObj:422497},
];
function aplicarAjustesManuales(rows,weekKey){
  const ajustes=AJUSTES_MANUALES_VENDEDOR.filter(a=>a.weekKey===weekKey);
  if(!ajustes.length)return rows;
  return rows.map(row=>{
    const ajuste=ajustes.find(a=>a.vendedor===row.Vendedor);
    if(!ajuste)return row;
    return{...row,'Venta real':num(row,'Venta real')+ajuste.ventaReal,'Venta obj':num(row,'Venta obj')+ajuste.ventaObj};
  });
}
// Días trabajados por persona: días con venta > 0 en VENDEDOR_DIARIO (el consolidador no trae
// asistencia; el objetivo diario se imputa trabaje o no). Por persona y no por local: quien cubre
// dos locales el mismo día suma uno. El cache se tira cuando llegan tablas nuevas.
let diasCache={tablas:null,porSemana:{}};
function diasTrabajadosDeLaSemana(weekKey){
  if(diasCache.tablas!==state.tables)diasCache={tablas:state.tables,porSemana:{}};
  if(diasCache.porSemana[weekKey])return diasCache.porSemana[weekKey];
  const diasLocal={};
  (state.tables.LOCAL_DIARIO||[]).filter(r=>weekKeyOf(r)===weekKey).forEach(row=>{
    if(num(row,'Venta real')<=0)return;
    const local=row.Local||'';
    (diasLocal[local]||(diasLocal[local]=new Set())).add(String(row.Fecha??'').slice(0,10));
  });
  const porPersona={};
  (state.tables.VENDEDOR_DIARIO||[]).filter(row=>weekKeyOf(row)===weekKey).forEach(row=>{
    const nombre=row.Vendedor;
    if(!nombre)return;
    const p=porPersona[nombre]||(porPersona[nombre]={dias:new Set(),locales:new Set()});
    p.locales.add(row.Local||'');
    if(num(row,'Venta real')>0)p.dias.add(String(row.Fecha??'').slice(0,10));
  });
  const resultado={};
  Object.entries(porPersona).forEach(([nombre,p])=>{
    const abiertos=Math.max(0,...[...p.locales].map(local=>diasLocal[local]?diasLocal[local].size:0));
    const minimo=abiertos?Math.min(MIN_DIAS_CLASIFICA,Math.max(1,Math.ceil(abiertos/2))):MIN_DIAS_CLASIFICA;
    resultado[nombre]={dias:p.dias.size,abiertos,minimo,clasifica:p.dias.size>=minimo};
  });
  diasCache.porSemana[weekKey]=resultado;
  return resultado;
}
// Sin fila diaria se clasifica igual: la regla nunca saca a nadie por FALTA de datos.
function infoDiasDe(weekKey,nombre){return diasTrabajadosDeLaSemana(weekKey)[nombre]||{dias:null,abiertos:0,minimo:MIN_DIAS_CLASIFICA,clasifica:true}}
function ticketsDe(row){const tp=num(row,'TP real');return tp>0?Math.round(num(row,'Venta real')/tp):null}
function umbralTicketsDe(abiertos){return abiertos?Math.max(1,Math.ceil(MIN_TICKETS*Math.min(abiertos,6)/6)):MIN_TICKETS}
function f1RatioStandings(weekKey,field){
  const realKey=field?`${field} real`:'Venta real',objKey=field?`${field} obj`:'Venta obj';
  const list=f1WeekRows(weekKey).map(row=>{
    const real=num(row,realKey),obj=objetivoEfectivo(field,num(row,objKey)),info=infoDiasDe(weekKey,row.Vendedor);
    const esPromedio=SPRINT_PROMEDIO.includes(field);
    const tickets=esPromedio?ticketsDe(row):null,minTickets=esPromedio?umbralTicketsDe(info.abiertos):null;
    const faltanTickets=tickets!==null&&tickets<minTickets;
    // Sin venta en la semana no hay nada inflado que corregir: no se lo etiqueta.
    const clasifica=(info.clasifica&&!faltanTickets)||real<=0;
    const motivoNC=clasifica?null:(info.clasifica?'tickets':'dias');
    return{local:row.Local,name:row.Vendedor,real,obj,ratio:obj?real/obj*100:null,
      dias:info.dias,diasAbiertos:info.abiertos,minDias:info.minimo,tickets,minTickets,motivoNC,clasifica};
  }).filter(p=>p.ratio!==null);
  list.sort((a,b)=>(estaClasificado(b)-estaClasificado(a))||(b.ratio-a.ratio)||(b.real-a.real)||String(a.name).localeCompare(String(b.name),'es'));
  return list;
}
// Etiqueta de la fila: por qué no clasifica, o "3 de 6 días" si clasificó sin la semana completa.
function ncTagHtml(p){
  if(p.motivoNC==='tickets')return`<span class="rank-days nc">${p.tickets} ticket${p.tickets===1?'':'s'} · mínimo ${p.minTickets}</span>`;
  if(!p.dias||!p.diasAbiertos)return'';
  if(estaClasificado(p)&&p.dias>=p.diasAbiertos)return'';
  return`<span class="rank-days${estaClasificado(p)?'':' nc'}">${p.dias} de ${p.diasAbiertos} día${p.diasAbiertos===1?'':'s'}${estaClasificado(p)?'':` · mínimo ${p.minDias}`}</span>`;
}
const rankPosNC='<span class="rank-pos rank-pos-nc">NC</span>';
// ── Período del Ranking: mes y fecha elegidos (pedido 2026-10-02) ──
// El historial ya llega entero en VENDEDOR_SEMANAL; hasta acá cada pestaña quedaba fija en la última
// semana o en el mes en curso. Ahora se elige: las pestañas semanales usan la fecha, GP VDH y Copa
// Constructores el mes. Sin elección (o si la elegida ya no existe en los datos) va lo más reciente.
const MESES_NOMBRE=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function rankMeses(){return[...new Set(f1AllWeekKeys().map(k=>k.split('|')[0]))]}
function rankMesElegido(){const m=rankMeses();return m.includes(state.rankMonth)?state.rankMonth:(m[m.length-1]||null)}
function rankSemanasDelMes(mes){return f1AllWeekKeys().filter(k=>k.split('|')[0]===mes)}
function rankSemanaElegida(){const ws=rankSemanasDelMes(rankMesElegido());return ws.includes(state.rankWeek)?state.rankWeek:(ws[ws.length-1]||null)}
// La semana anterior puede ser del mes anterior (Mayor Mejora de la Fecha 1 compara con la última
// del mes pasado), igual que la app de Ranking.
function rankSemanaAnterior(weekKey){const ws=f1AllWeekKeys(),i=ws.indexOf(weekKey);return i>0?ws[i-1]:null}
// "Campeón" solo cuando el mes terminó; mientras corre es "Líder parcial".
function mesEnCurso(mes){return MESES_NOMBRE[new Date(`${todayKey()}T00:00:00`).getMonth()]===mes}
const fechaN=weekKey=>`F${String(weekKey).split('|')[1]}`;
const puntosVacios=()=>({main:0,ticket:0,perfumes:0,boxer:0,pxt:0});
const totalSemana=s=>s?s.main+s.ticket+s.perfumes+s.boxer+s.pxt:0;

function buildGrandPrixStandings(mesPedido){
  const meses=rankMeses();
  const month=mesPedido&&meses.includes(mesPedido)?mesPedido:(meses[meses.length-1]||null);
  if(!month)return{list:[],month:null,weeks:[]};
  const monthWeeks=rankSemanasDelMes(month);
  const totals={};
  // Se acumula por NOMBRE solo, no por Local+Nombre: si una persona cubrió dos locales una semana
  // del mes y solo uno otra semana, su etiqueta de Local fundida (ver fusionarVendedoresCompartidos)
  // puede variar semana a semana — con la clave vieja `${local}|${name}` eso partía sus puntos del
  // mes en dos "pilotos" distintos. `locales` junta la unión de todos los locales que pisó en el
  // mes para mostrarla en la tabla (bug real, auditoría 2026-09-05).
  // perWeek guarda los puntos de cada fecha por categoría: es lo que muestran las columnas F1…F5 y
  // el detalle desplegable.
  const ensure=name=>{if(!totals[name])totals[name]={name,locales:new Set(),main:0,sprint:0,breakdown:{ticket:0,perfumes:0,boxer:0,pxt:0},perWeek:{}};return totals[name]};
  const semana=(e,w)=>e.perWeek[w]||(e.perWeek[w]=puntosVacios());
  monthWeeks.forEach(weekKey=>{
    f1RatioStandings(weekKey,null).filter(estaClasificado).slice(0,F1_MAIN_POINTS.length).forEach((p,i)=>{const e=ensure(p.name);e.main+=F1_MAIN_POINTS[i];semana(e,weekKey).main+=F1_MAIN_POINTS[i];p.local.split(' + ').forEach(l=>e.locales.add(l))});
    Object.entries(F1_SPRINT_FIELDS).forEach(([cat,field])=>{
      f1RatioStandings(weekKey,field).filter(estaClasificado).slice(0,F1_SPRINT_POINTS.length).forEach((p,i)=>{const e=ensure(p.name);e.sprint+=F1_SPRINT_POINTS[i];e.breakdown[cat]+=F1_SPRINT_POINTS[i];semana(e,weekKey)[cat]+=F1_SPRINT_POINTS[i];p.local.split(' + ').forEach(l=>e.locales.add(l))});
    });
  });
  const list=Object.values(totals).map(e=>({...e,local:[...e.locales].sort().join(' + '),total:e.main+e.sprint}));
  list.sort((a,b)=>(b.total-a.total)||(b.main-a.main)||String(a.name).localeCompare(String(b.name),'es'));
  return{list,month,weeks:monthWeeks};
}
// ── COPA CONSTRUCTORES (mismo campeonato de puntos que GP VDH, pero agregado por LOCAL en vez de
// por vendedor) — portado del repo hermano ranking-vdh (auditoría 2026-09-06), donde ya reemplazó
// a un ranking de "mejora semanal por local" que se sacó por redundante con esto.
function localDiarioWeekRows(weekKey){return(state.tables.LOCAL_DIARIO||[]).filter(r=>weekKeyOf(r)===weekKey)}
// Venta/Ticket/PxT salen de LOCAL_DIARIO (el Objetivo/Venta real del LOCAL día a día, tal cual los
// carga Ventas), NO de sumar el objetivo semanal de cada vendedor en VENDEDOR_SEMANAL — ese
// objetivo sale de prorratear el % de objetivo MENSUAL de cada persona, y esos porcentajes entre
// los vendedores de un local pueden sumar más del 100% del objetivo mensual real del local (pasa
// en Rivadavia), inflando el objetivo semanal agregado. Perfumes/Bóxer sí siguen sumando de
// VENDEDOR_SEMANAL (crudo, sin fundir vendedores compartidos — ver f1WeekRowsCrudo): son
// cantidades reales sin un equivalente propio en LOCAL_DIARIO. Ticket usa el promedio simple de
// "Ticket prom." diario del local (días con dato, sin ponderar por venta del día) — mismo criterio
// que ya usa Tráfico para su propio total semanal.
function aggregateStoreMetricForWeek(weekKey,field){
  if(!field){
    const groups={};
    localDiarioWeekRows(weekKey).forEach(row=>{
      const local=row.Local||'Sin local';
      if(!groups[local])groups[local]={real:0,obj:0};
      groups[local].real+=num(row,'Venta real');
      groups[local].obj+=num(row,'Objetivo');
    });
    return groups;
  }
  if(field==='TP'||field==='PxT'){
    const realKey=field==='TP'?'Ticket prom.':'PxT real',objKey=field==='TP'?'Ticket obj':'PxT obj';
    const groups={};
    localDiarioWeekRows(weekKey).forEach(row=>{
      const local=row.Local||'Sin local';
      if(!groups[local])groups[local]={sumReal:0,countReal:0,sumObj:0,countObj:0};
      const g=groups[local],valReal=num(row,realKey),valObj=num(row,objKey);
      if(valReal){g.sumReal+=valReal;g.countReal++}
      if(valObj){g.sumObj+=valObj;g.countObj++}
    });
    return Object.fromEntries(Object.entries(groups).map(([local,g])=>[local,{real:g.countReal?g.sumReal/g.countReal:0,obj:g.countObj?g.sumObj/g.countObj:0}]));
  }
  // Solo llega acá Perfumes/Bóxer — cantidades reales, sumarlas por vendedor sigue siendo correcto.
  const realKey=`${field} real`,objKey=`${field} obj`;
  const groups={};
  f1WeekRowsCrudo(weekKey).forEach(row=>{
    const local=row.Local||'Sin local';
    if(!groups[local])groups[local]={real:0,obj:0};
    groups[local].real+=num(row,realKey);
    groups[local].obj+=num(row,objKey);
  });
  return groups;
}
// Análogo a f1RatioStandings() pero agregado por LOCAL — mismo criterio de empates (mayor
// venta/unidad real y, si también empata, alfabético).
function storeRatioStandings(weekKey,field){
  const agg=aggregateStoreMetricForWeek(weekKey,field);
  const list=Object.entries(agg).map(([local,g])=>{const obj=objetivoEfectivo(field,g.obj);return{local,real:g.real,obj,ratio:obj?g.real/obj*100:null}}).filter(p=>p.ratio!==null);
  list.sort((a,b)=>(b.ratio-a.ratio)||(b.real-a.real)||String(a.local).localeCompare(String(b.local),'es'));
  return list;
}
function buildStoreChampionship(mesPedido){
  const meses=rankMeses();
  const month=mesPedido&&meses.includes(mesPedido)?mesPedido:(meses[meses.length-1]||null);
  if(!month)return{list:[],month:null,weeks:[]};
  const monthWeeks=rankSemanasDelMes(month);
  const totals={};
  const ensure=local=>{if(!totals[local])totals[local]={local,main:0,sprint:0,breakdown:{ticket:0,perfumes:0,boxer:0,pxt:0},perWeek:{}};return totals[local]};
  const semana=(e,w)=>e.perWeek[w]||(e.perWeek[w]=puntosVacios());
  monthWeeks.forEach(weekKey=>{
    storeRatioStandings(weekKey,null).slice(0,STORE_MAIN_TOP).forEach((p,i)=>{const e=ensure(p.local);e.main+=F1_MAIN_POINTS[i];semana(e,weekKey).main+=F1_MAIN_POINTS[i]});
    Object.entries(F1_SPRINT_FIELDS).forEach(([cat,field])=>{
      storeRatioStandings(weekKey,field).slice(0,8).forEach((p,i)=>{const e=ensure(p.local);e.sprint+=F1_SPRINT_POINTS[i];e.breakdown[cat]+=F1_SPRINT_POINTS[i];semana(e,weekKey)[cat]+=F1_SPRINT_POINTS[i]});
    });
  });
  const list=Object.values(totals).map(e=>({...e,total:e.main+e.sprint}));
  list.sort((a,b)=>(b.total-a.total)||(b.main-a.main)||String(a.local).localeCompare(String(b.local),'es'));
  return{list,month,weeks:monthWeeks};
}
function showRankGrandPrixEmpty(){
  $('rankingPeriodBadge').textContent='Sin fecha';
  $('gpChampion').hidden=true;
  $('gpMetrics').innerHTML='';
  $('gpTable').innerHTML='';
  $('gpWinners').innerHTML='';
  $('gpRowsCount').textContent='';
}
// Cartel de arriba: campeón del mes, o líder parcial si el mes todavía corre.
function campeonHtml(mes,nombre,sub){
  const enCurso=mesEnCurso(mes);
  return`<span class="rank-champion-icon">${icon('trophy','trophy-icon')}</span><div class="rank-champion-text"><span class="rank-champion-kicker">${enCurso?'Líder parcial':'Campeón'} de ${escapeHtml(mes)}</span><strong>${escapeHtml(nombre)}</strong><span class="rank-champion-sub">${sub}</span></div>`;
}
// Tabla del campeonato del mes (GP VDH y Copa Constructores): una columna por fecha con los puntos de
// esa fecha (principal + sprints) y el total. Tocando la fila se despliega el detalle por categoría.
// `localDe` solo lo pasa el GP (la Copa ya es por local).
function campeonatoTablaHtml(list,filtered,weeks,nombreDe,localDe){
  const nCols=3+(localDe?1:0)+weeks.length;
  const head=`<thead><tr><th class="align-right">#</th><th>${localDe?'Vendedor':'Local'}</th>${localDe?'<th>Local</th>':''}${weeks.map(w=>`<th class="align-right">${fechaN(w)}</th>`).join('')}<th class="align-right">Total</th></tr></thead>`;
  if(!filtered.length)return`${head}<tbody><tr><td colspan="${nCols}" class="empty-state">Sin puntos para estos filtros</td></tr></tbody>`;
  const body=filtered.map(p=>{
    const i=list.indexOf(p),trophy=i===0?` ${icon('trophy','trophy-icon')}`:'';
    const celdas=weeks.map(w=>{const t=totalSemana(p.perWeek[w]);return`<td class="num">${t?number(t):'<span class="missing-value">—</span>'}</td>`}).join('');
    const filaDet=(etq,s,cls)=>`<tr${cls?` class="${cls}"`:''}><td>${etq}</td><td class="num">${s.main}</td><td class="num">${s.ticket}</td><td class="num">${s.perfumes}</td><td class="num">${s.boxer}</td><td class="num">${s.pxt}</td><td class="num"><strong>${totalSemana(s)}</strong></td></tr>`;
    const detalle=weeks.map(w=>filaDet(`Fecha ${w.split('|')[1]}`,p.perWeek[w]||puntosVacios())).join('')+
      filaDet('Total del mes',{main:p.main,...p.breakdown},'gp-detail-total');
    return`<tr class="gp-row" tabindex="0" aria-expanded="false"><td class="num">${rankPos(i)}${trophy}</td><td class="seller-name"><span class="gp-caret" aria-hidden="true">▸</span>${escapeHtml(nombreDe(p))}</td>${localDe?`<td class="seller-location">${escapeHtml(localDe(p))}</td>`:''}${celdas}<td class="num"><strong>${number(p.total)}</strong></td></tr>`+
      `<tr class="gp-detail" hidden><td colspan="${nCols}"><table class="gp-detail-table"><thead><tr><th>Fecha</th><th class="align-right">Principal</th><th class="align-right">Ticket</th><th class="align-right">Perfumes</th><th class="align-right">Bóxer</th><th class="align-right">PxT</th><th class="align-right">Total</th></tr></thead><tbody>${detalle}</tbody></table></td></tr>`;
  }).join('');
  return`${head}<tbody>${body}</tbody>`;
}
// Despliegue del detalle: delegado en la tabla y enganchado una sola vez (la tabla se re-renderiza
// en cada refresh, pero el elemento <table> es siempre el mismo).
function engancharDespliegue(tabla){
  if(!tabla||tabla.dataset.despliegue)return;
  tabla.dataset.despliegue='1';
  const alternar=tr=>{const d=tr.nextElementSibling;if(!d||!d.classList.contains('gp-detail'))return;d.hidden=!d.hidden;tr.setAttribute('aria-expanded',String(!d.hidden));tr.classList.toggle('open',!d.hidden)};
  tabla.addEventListener('click',e=>{const tr=e.target.closest&&e.target.closest('tr.gp-row');if(tr)alternar(tr)});
  tabla.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const tr=e.target.closest&&e.target.closest('tr.gp-row');if(tr){e.preventDefault();alternar(tr)}});
}
function renderRankGrandPrix(){
  const{list,month,weeks}=buildGrandPrixStandings(rankMesElegido());
  if(!month){showRankGrandPrixEmpty();return}
  $('rankingPeriodBadge').textContent=`${month} · ${weeks.length} fecha${weeks.length===1?'':'s'} corrida${weeks.length===1?'':'s'}`;
  if(!list.length){showRankGrandPrixEmpty();return}

  const local=$('localFilter').value,seller=$('sellerFilter').value;
  // p.local puede ser "San Justo 1 + Flores" para alguien que cubrió los dos ese mes — comparar con
  // === contra el Local elegido lo hubiera dejado afuera del filtro aunque sí sumó puntos ahí ese
  // mes. p.locales (el Set sin unir) permite ver si el local elegido es UNO de los suyos.
  const filtered=list.filter(p=>(local==='all'||p.locales.has(local))&&(seller==='all'||String(p.name??'')===seller));
  const leader=list[0];
  const totalPts=list.reduce((sum,p)=>sum+p.total,0);

  $('gpChampion').hidden=false;
  $('gpChampion').innerHTML=campeonHtml(month,leader.name,`${number(leader.total)} pts · ${escapeHtml(leader.local)}`);
  $('gpMetrics').innerHTML=
    metricsCard('Pilotos puntuando',number(list.length),'con al menos 1 punto este mes')+
    metricsCard('Fechas corridas',number(weeks.length),month)+
    metricsCard('Puntos repartidos',number(totalPts),'Carrera Principal + Sprints VDH')+
    metricsCard('Ventaja del líder',list[1]?`${number(leader.total-list[1].total)} pts`:'—',list[1]?`sobre ${escapeHtml(list[1].name)}`:'');

  $('gpTable').innerHTML=campeonatoTablaHtml(list,filtered,weeks,p=>p.name,p=>p.local);
  engancharDespliegue($('gpTable'));
  // Ganador de la carrera principal de cada fecha (el que se llevó los 25 pts), entre los clasificados.
  $('gpWinners').innerHTML=weeks.length?`<span class="rank-winners-label">Ganador de cada fecha</span>`+weeks.map(w=>{
    const g=f1RatioStandings(w,null).find(estaClasificado);
    return`<span class="rank-winner"><b>${fechaN(w)}</b>${g?`${escapeHtml(g.name)} <em>${percent(g.ratio)}</em>`:'—'}</span>`;
  }).join(''):'';
  $('gpRowsCount').textContent=filtered.length?`${filtered.length} de ${list.length} pilotos · tocá una fila para ver cada fecha`:'';
}
// Insignias quedó sin botón en el menú (pedido explícito de limpieza) pero el código de
// renderRankBadges() sigue acá sin usarse — reactivarla es agregar de vuelta su botón a
// #rankScopeTabs, nada de esto se borró.
// Ranking (07) tiene dos niveles de pestaña, igual que el repo hermano ranking-vdh (auditoría
// 2026-09-06): arriba el GRUPO (Vendedores/Locales/Evolución, #rankScopeTabs) y, debajo, la
// CATEGORÍA dentro de ese grupo (#sellerCatTabs o #storeCatTabs, según el grupo activo) — antes
// "Ticket/Perfumes/Boxer/PxT" de vendedores vivían escondidos atrás de un <select> ("Sprints VDH"),
// y Locales no tenía categorías propias (una sola vista, Copa Constructores). Liga/GP/Mejora eran
// además pestañas de PRIMER nivel sueltas, mezcladas con Locales/Evolución en la misma barra.
// Llena los selectores de mes y fecha (lo más nuevo arriba) y muestra solo los que usa la pestaña:
// GP VDH y Copa Constructores son del mes, el resto de la fecha, y Evolución no usa ninguno.
function renderRankPeriodSelectors(){
  const mes=rankMesElegido(),semana=rankSemanaElegida();
  $('rankMonthSelect').innerHTML=rankMeses().slice().reverse().map(m=>`<option value="${escapeHtml(m)}"${m===mes?' selected':''}>${escapeHtml(m)}${mesEnCurso(m)?' (en curso)':''}</option>`).join('');
  $('rankWeekSelect').innerHTML=rankSemanasDelMes(mes).slice().reverse().map(w=>`<option value="${escapeHtml(w)}"${w===semana?' selected':''}>Fecha ${w.split('|')[1]}</option>`).join('');
  const mensual=(state.rankScope==='sellers'&&state.sellerCategory==='campeonato')||(state.rankScope==='stores'&&state.storeCategory==='constructores');
  $('rankWeekField').hidden=mensual||state.rankScope==='evolution';
  $('rankMonthField').hidden=state.rankScope==='evolution';
}
function renderRanking(){
  renderRankPeriodSelectors();
  qa('#rankScopeTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.scope===state.rankScope));
  $('sellerCatTabs').hidden=state.rankScope!=='sellers';
  $('storeCatTabs').hidden=state.rankScope!=='stores';
  $('rankEvolutionPanel').hidden=state.rankScope!=='evolution';
  if(state.rankScope==='evolution'){$('rankStoresPanel').hidden=true;$('rankSellersPanel').hidden=true;$('rankGpPanel').hidden=true;renderRankEvolution();return}

  if(state.rankScope==='stores'){
    $('rankSellersPanel').hidden=true;
    $('rankGpPanel').hidden=true;
    $('rankStoresPanel').hidden=false;
    qa('#storeCatTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.storeCategory===state.storeCategory));
    if(state.storeCategory==='constructores')renderRankStores();
    else renderRankStoreCategory(state.storeCategory);
    return;
  }

  // state.rankScope==='sellers'
  $('rankStoresPanel').hidden=true;
  qa('#sellerCatTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.category===state.sellerCategory));
  const category=state.sellerCategory;
  $('rankGpPanel').hidden=category!=='campeonato';
  $('rankSellersPanel').hidden=category==='campeonato';
  if(category==='campeonato'){renderRankGrandPrix();return}
  const cfg=RANK_CATEGORIES[category];
  $('rankingKicker').textContent=cfg.kicker;
  $('rankingHeading').textContent=cfg.heading;
  const toggle=$('rankSortToggle');
  toggle.hidden=!cfg.sortable;
  if(cfg.sortable)qa('#rankSortToggle .rank-tab-sm').forEach(btn=>btn.classList.toggle('active',btn.dataset.sort===state.rankSortMode));
  if(category==='mejora')renderRankMejora();
  else renderRankCategory(category);
}
function showStoreRankEmpty(){
  $('rankingPeriodBadge').textContent='Sin fecha';
  $('storeChampion').hidden=true;
  $('storeRankMetrics').innerHTML='';
  $('storeRankTable').innerHTML='';
  $('storeRankRowsCount').textContent='';
}
// Copa Constructores: mismo campeonato de puntos que GP VDH (arriba), agregado por local — quién
// es el mejor LOCAL en todas las métricas (Venta + los 4 sprints), no solo quién vendió más esta
// semana puntual. Reemplaza a la "mejora semanal por local" que había acá antes (sacada por
// redundante, mismo criterio que ya se aplicó en ranking-vdh el 2026-09-04).
function renderRankStores(){
  $('storeRankKicker').textContent='ACUMULADO DEL MES';
  $('storeRankHeading').textContent='Copa Constructores · Carrera Principal + Sprints VDH';
  const{list,month,weeks}=buildStoreChampionship(rankMesElegido());
  if(!month){showStoreRankEmpty();return}
  $('rankingPeriodBadge').textContent=`${month} · ${weeks.length} fecha${weeks.length===1?'':'s'} corrida${weeks.length===1?'':'s'}`;
  if(!list.length){showStoreRankEmpty();return}

  const local=$('localFilter').value;
  const filtered=local==='all'?list:list.filter(p=>p.local===local);
  const leader=list[0];
  const totalPts=list.reduce((sum,p)=>sum+p.total,0);

  $('storeChampion').hidden=false;
  $('storeChampion').innerHTML=campeonHtml(month,leader.local,`${number(leader.total)} pts`);
  $('storeRankMetrics').innerHTML=
    metricsCard('Locales puntuando',number(list.length),'con al menos 1 punto este mes')+
    metricsCard('Fechas corridas',number(weeks.length),month)+
    metricsCard('Puntos repartidos',number(totalPts),'Carrera Principal + Sprints VDH')+
    metricsCard('Ventaja del líder',list[1]?`${number(leader.total-list[1].total)} pts`:'—',list[1]?`sobre ${escapeHtml(list[1].local)}`:'');
  $('storeRankTable').innerHTML=campeonatoTablaHtml(list,filtered,weeks,p=>p.local,null);
  engancharDespliegue($('storeRankTable'));
  $('storeRankRowsCount').textContent=filtered.length?`${filtered.length} de ${list.length} locales · tocá una fila para ver cada fecha`:'';
}
// Resto de categorías de Locales — mismo criterio que RANK_CATEGORIES de vendedores, pero sobre
// storeRatioStandings(): ranking de UNA sola semana (la última cargada) por % de cumplimiento,
// sin acumular puntos en el mes (eso es lo que hace Copa Constructores, arriba). Sprint Semanal
// (field null → Venta) es la misma carrera principal que ya puntúa en Copa Constructores; las
// otras 4 usan la escala de Sprint. Portado de STORE_CATEGORIES en ranking-vdh (auditoría
// 2026-09-06), con los formatos (money/number) que ya usa el resto de este dashboard.
const STORE_CATEGORIES={
  sprint:{label:'Sprint Semanal',field:null,fmt:money,kicker:'RANKING SEMANAL',heading:'Venta de la semana, % de cumplimiento'},
  ticket:{label:'Ticket Promedio',field:'TP',fmt:money,kicker:'SPRINT VDH · TICKET PROMEDIO',heading:'Promedio por venta, no volumen'},
  pxt:{label:'PxT',field:'PxT',fmt:number,kicker:'SPRINT VDH · PRENDAS POR TICKET',heading:'Cross-sell de la semana'},
  perfumes:{label:'Perfumes',field:'Perfumes',fmt:number,kicker:'SPRINT VDH · PERFUMES',heading:'Unidades vendidas en la semana'},
  boxer:{label:'Bóxer',field:'Boxer',fmt:number,kicker:'SPRINT VDH · BOXER',heading:'Unidades vendidas en la semana'}
};
function renderRankStoreCategory(storeCategory){
  const cfg=STORE_CATEGORIES[storeCategory];
  $('storeRankKicker').textContent=cfg.kicker;
  $('storeRankHeading').textContent=cfg.heading;
  $('storeChampion').hidden=true;
  const currentKey=rankSemanaElegida();
  if(!currentKey){showStoreRankEmpty();return}
  const[mes,semana]=currentKey.split('|');
  $('rankingPeriodBadge').textContent=`Semana ${semana} de ${mes}`;
  const list=storeRatioStandings(currentKey,cfg.field);
  if(!list.length){showStoreRankEmpty();return}

  const local=$('localFilter').value;
  const filtered=local==='all'?list:list.filter(p=>p.local===local);
  const leader=list[0];
  const avgRatio=list.reduce((sum,p)=>sum+p.ratio,0)/list.length;
  const totalReal=list.reduce((sum,p)=>sum+p.real,0);
  const pointsTable=cfg.field?F1_SPRINT_POINTS:F1_MAIN_POINTS.slice(0,STORE_MAIN_TOP);

  $('storeRankMetrics').innerHTML=
    metricsCard('Locales rankeados',number(list.length),'con objetivo cargado esta semana')+
    metricsCard(cfg.label,cfg.fmt(totalReal),'total de la semana')+
    (leader?metricsCard('Líder',escapeHtml(leader.local),percent(leader.ratio),'good'):metricsCard('Líder','—',''))+
    metricsCard('Cumplimiento promedio',percent(avgRatio),'entre los locales con objetivo cargado');

  const body=filtered.map(p=>{
    const i=list.indexOf(p),trophy=i===0?` ${icon('trophy','trophy-icon')}`:'';
    const badge=i<pointsTable.length?`+${pointsTable[i]} pts`:'—';
    return `<tr><td class="num">${rankPos(i)}${trophy}</td><td class="seller-name">${escapeHtml(p.local)}</td><td class="num">${cfg.fmt(p.real)}</td><td class="num">${cfg.fmt(p.obj)}</td><td class="num">${percent(p.ratio)}</td><td class="num">${badge}</td></tr>`;
  }).join('');
  const head=`<thead><tr><th class="align-right">#</th><th>Local</th><th class="align-right">${cfg.label}</th><th class="align-right">Objetivo</th><th class="align-right">% cumplimiento</th><th class="align-right">Puntos</th></tr></thead>`;
  $('storeRankTable').innerHTML=filtered.length?`${head}<tbody>${body}</tbody>`:`${head}<tbody><tr><td colspan="6" class="empty-state">Sin locales para este filtro</td></tr></tbody>`;
  $('storeRankRowsCount').textContent=filtered.length?`${filtered.length} de ${list.length} locales`:'';
}
function vendorHistory(){
  const local=$('localFilter').value,seller=$('sellerFilter').value;
  const rawRows=(state.tables.VENDEDOR_SEMANAL||[]).filter(row=>(local==='all'||String(row.Local??'')===local)&&(seller==='all'||String(row.Vendedor??'')===seller));
  // Fundida por vendedor compartido (ver fusionarVendedoresCompartidos) y agrupada por nombre solo:
  // antes, alguien que cubrió 2 locales en alguna semana quedaba con DOS historiales separados
  // ("Juan Perez" en San Justo 1 y "Juan Perez" en Flores), lo que además disparaba el aviso
  // "vendedores ambiguos, elegí un Local" de renderEvolutionSeller para una persona real (bug real,
  // auditoría 2026-09-05). `locales` junta la unión de todos los locales vistos en el período para
  // mostrarla en el encabezado de Evolución.
  const rows=fusionarVendedoresCompartidos(rawRows);
  const groups={};
  rows.forEach(row=>{
    const key=row.Vendedor,obj=num(row,'Venta obj');
    if(!groups[key])groups[key]={name:row.Vendedor,locales:new Set(),weeks:[]};
    row.Local.split(' + ').forEach(l=>groups[key].locales.add(l));
    groups[key].weeks.push({weekKey:weekKeyOf(row),ratio:obj?num(row,'Venta real')/obj*100:null,tp:num(row,'TP real'),conv:convRate(row,'Conv real'),pxt:num(row,'PxT real')});
  });
  return Object.values(groups).map(g=>{
    g.weeks.sort((a,b)=>weekKeyOrder(a.weekKey)-weekKeyOrder(b.weekKey));
    return{local:[...g.locales].sort().join(' + '),name:g.name,weeks:g.weeks};
  });
}
function localHistory(){
  const local=$('localFilter').value,seller=$('sellerFilter').value;
  const rows=(state.tables.VENDEDOR_SEMANAL||[]).filter(row=>(local==='all'||String(row.Local??'')===local)&&(seller==='all'||String(row.Vendedor??'')===seller));
  const groups={};
  rows.forEach(row=>{
    const loc=row.Local||'Sin local',weekKey=weekKeyOf(row);
    if(!groups[loc])groups[loc]={};
    if(!groups[loc][weekKey])groups[loc][weekKey]={actual:0,target:0,tpSum:0,tpCount:0,convSum:0,convCount:0,pxtSum:0,pxtCount:0};
    const w=groups[loc][weekKey];
    w.actual+=num(row,'Venta real');
    w.target+=num(row,'Venta obj');
    const tp=num(row,'TP real');if(tp){w.tpSum+=tp;w.tpCount++}
    const conv=convRate(row,'Conv real');if(conv){w.convSum+=conv;w.convCount++}
    const pxt=num(row,'PxT real');if(pxt){w.pxtSum+=pxt;w.pxtCount++}
  });
  return Object.keys(groups).map(loc=>{
    const weeks=Object.keys(groups[loc]).sort((a,b)=>weekKeyOrder(a)-weekKeyOrder(b)).map(wk=>{
      const w=groups[loc][wk];
      return{weekKey:wk,ratio:w.target?w.actual/w.target*100:null,tp:w.tpCount?w.tpSum/w.tpCount:0,conv:w.convCount?w.convSum/w.convCount:0,pxt:w.pxtCount?w.pxtSum/w.pxtCount:0};
    });
    return{local:loc,weeks};
  });
}
function streakInfo(weeks){
  let streak=0;
  for(let i=weeks.length-1;i>=0;i--){
    if(weeks[i].ratio!==null&&weeks[i].ratio>=100)streak++;
    else break;
  }
  return streak;
}
function personalRecords(weeks){
  const result={};
  ['tp','conv','pxt'].forEach(m=>{
    let max=-Infinity,maxIdx=-1;
    weeks.forEach((w,i)=>{if(w[m]>0&&w[m]>max){max=w[m];maxIdx=i}});
    const lastIdx=weeks.length-1;
    result[m]={isRecord:maxIdx===lastIdx&&weeks[lastIdx][m]>0&&maxIdx>0,value:weeks[lastIdx][m]};
  });
  return result;
}
function categoryWinnersThisWeek(){
  const {rows,weekKeys}=currentWeekRowsPersonas();
  if(!weekKeys.length)return{winners:[]};
  const currentKey=weekKeys[weekKeys.length-1];
  const weekRows=rows.filter(row=>weekKeyOf(row)===currentKey);
  const winners=[];
  ['ticket','perfumes','boxer','pxt'].forEach(catKey=>{
    const cfg=RANK_CATEGORIES[catKey];
    const mode=cfg.sortable?'units':cfg.mode;
    const realKey=cfg.field?`${cfg.field} real`:'Venta real',objKey=cfg.field?`${cfg.field} obj`:'Venta obj';
    let list=weekRows.map(row=>{const real=num(row,realKey),obj=num(row,objKey);return{local:row.Local,name:row.Vendedor,real,obj,ratio:obj?real/obj*100:null}});
    if(mode==='ratio'){list=list.filter(p=>p.ratio!==null);list.sort((a,b)=>b.ratio-a.ratio)}
    else list.sort((a,b)=>b.real-a.real);
    if(list.length&&list[0].real>0)winners.push({category:cfg.label,name:list[0].name,local:list[0].local,value:mode==='ratio'?percent(list[0].ratio):cfg.fmt(list[0].real)});
  });
  return{winners};
}
function mejoraLeaderSeller(){
  const {rows,weekKeys}=currentWeekRowsPersonas();
  if(weekKeys.length<2)return null;
  const currentKey=weekKeys[weekKeys.length-1],prevKey=weekKeys[weekKeys.length-2];
  const byPerson={};
  rows.forEach(row=>{
    const key=row.Vendedor,weekKey=weekKeyOf(row);
    if(!byPerson[key])byPerson[key]={name:row.Vendedor};
    if(weekKey===currentKey)byPerson[key].actual=row;
    if(weekKey===prevKey)byPerson[key].previo=row;
  });
  const ratioOf=row=>{if(!row)return null;const target=num(row,'Venta obj');return target?num(row,'Venta real')/target*100:null};
  const list=Object.values(byPerson).filter(p=>p.actual&&p.previo).map(p=>({...p,local:p.actual.Local,mejora:ratioOf(p.actual)-ratioOf(p.previo)})).filter(p=>p.mejora!==null&&!Number.isNaN(p.mejora));
  list.sort((a,b)=>b.mejora-a.mejora);
  return list[0]||null;
}
// mejoraLeaderStore sigue con currentWeekRows() crudo a propósito (rankea LOCALES, no personas —
// ver comentario de fusionarVendedoresCompartidos más arriba).
function mejoraLeaderStore(){
  const {rows,weekKeys}=currentWeekRows();
  if(weekKeys.length<2)return null;
  const currentKey=weekKeys[weekKeys.length-1],prevKey=weekKeys[weekKeys.length-2];
  const aggregateByLocal=weekKey=>{
    const groups={};
    rows.filter(row=>weekKeyOf(row)===weekKey).forEach(row=>{
      const key=row.Local||'Sin local';
      if(!groups[key])groups[key]={actual:0,target:0};
      groups[key].actual+=num(row,'Venta real');
      groups[key].target+=num(row,'Venta obj');
    });
    return groups;
  };
  const cur=aggregateByLocal(currentKey),prev=aggregateByLocal(prevKey);
  const list=Object.keys(cur).filter(local=>prev[local]).map(local=>{
    const curRatio=cur[local].target?cur[local].actual/cur[local].target*100:null;
    const prevRatio=prev[local].target?prev[local].actual/prev[local].target*100:null;
    return{local,mejora:(curRatio!==null&&prevRatio!==null)?curRatio-prevRatio:null};
  }).filter(p=>p.mejora!==null);
  list.sort((a,b)=>b.mejora-a.mejora);
  return list[0]||null;
}
function showRankBadgesEmpty(){
  $('rankingPeriodBadge').textContent='Sin semana';
  $('badgesMetrics').innerHTML='';
  $('badgesWinners').innerHTML='<div class="empty-state">Sin datos para estos filtros</div>';
  $('badgesStreaks').innerHTML='<div class="empty-state">Sin datos para estos filtros</div>';
  $('badgesRecords').innerHTML='<div class="empty-state">Sin datos para estos filtros</div>';
}
function renderRankBadges(){
  const {weekKeys}=currentWeekRows();
  if(!weekKeys.length){showRankBadgesEmpty();return}
  const currentKey=weekKeys[weekKeys.length-1];
  const [currentMes,currentSemana]=currentKey.split('|');
  $('rankingPeriodBadge').textContent=`Semana ${currentSemana} de ${currentMes}`;

  const {winners}=categoryWinnersThisWeek();
  const mejoraSeller=mejoraLeaderSeller(),mejoraStore=mejoraLeaderStore();
  const winnerRows=[];
  if(mejoraSeller)winnerRows.push({icon:'trendingUp',category:'Mejora semanal · Vendedor',name:mejoraSeller.name,sub:mejoraSeller.local,value:`${mejoraSeller.mejora>=0?'+':''}${mejoraSeller.mejora.toFixed(1)} pts`});
  if(mejoraStore)winnerRows.push({icon:'trophy',category:'Mejora semanal · Local',name:mejoraStore.local,sub:'',value:`${mejoraStore.mejora>=0?'+':''}${mejoraStore.mejora.toFixed(1)} pts`});
  winners.forEach(w=>winnerRows.push({icon:'medal',category:w.category,name:w.name,sub:w.local,value:w.value}));

  const histories=vendorHistory(),storeHist=localHistory();
  const streakSellers=histories.map(h=>({local:h.local,name:h.name,streak:streakInfo(h.weeks)})).filter(h=>h.streak>=2).sort((a,b)=>b.streak-a.streak);
  const streakStores=storeHist.map(h=>({local:h.local,streak:streakInfo(h.weeks)})).filter(h=>h.streak>=2).sort((a,b)=>b.streak-a.streak);

  // fmt de conv multiplica por 100: el valor llega como fracción (convRate en vendorHistory/
  // localHistory), igual que en cualquier otro lado del dashboard que muestra un % (auditoría
  // 2026-09-06).
  const metricMeta={tp:{label:'Ticket promedio',icon:'tag',fmt:money},conv:{label:'Conversión',icon:'target',fmt:v=>percent(v*100)},pxt:{label:'PxT',icon:'shirt',fmt:v=>pxtTexto(v,1)}};
  const records=[];
  histories.forEach(h=>{
    if(h.weeks.length<2)return;
    const rec=personalRecords(h.weeks);
    Object.keys(rec).forEach(m=>{if(rec[m].isRecord)records.push({local:h.local,name:h.name,metric:m,value:rec[m].value})});
  });

  const rachaFuerte=streakSellers.filter(s=>s.streak>=3).length+streakStores.filter(s=>s.streak>=3).length;

  $('badgesMetrics').innerHTML=
    metricsCard('Insignias de la semana',number(winnerRows.length),'ganadores por categoría')+
    metricsCard('Rachas de 3+ semanas',number(rachaFuerte),'vendedores + locales en objetivo consecutivo')+
    metricsCard('Récords nuevos',number(records.length),'ticket, conversión o PxT esta semana')+
    metricsCard('En racha (2+)',number(streakSellers.length+streakStores.length),'cumpliendo objetivo semana tras semana');

  $('badgesWinners').innerHTML=winnerRows.length?winnerRows.map(w=>`<div class="badge-row"><span class="badge-icon">${icon(w.icon)}</span><div class="badge-info"><strong>${escapeHtml(w.name)}</strong><span>${escapeHtml(w.category)}${w.sub?` · ${escapeHtml(w.sub)}`:''}</span></div><span class="badge-value">${w.value}</span></div>`).join(''):'<div class="empty-state">Todavía no hay ganadores esta semana</div>';

  const streakRows=[
    ...streakSellers.map(s=>({name:s.name,sub:s.local,streak:s.streak})),
    ...streakStores.map(s=>({name:s.local,sub:'Local',streak:s.streak}))
  ].sort((a,b)=>b.streak-a.streak);
  $('badgesStreaks').innerHTML=streakRows.length?streakRows.map(s=>`<div class="badge-row"><span class="badge-icon">${icon('flame')}</span><div class="badge-info"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.sub)}</span></div><span class="badge-value">${s.streak} semanas</span></div>`).join(''):'<div class="empty-state">Nadie lleva 2 semanas seguidas en objetivo todavía</div>';

  $('badgesRecords').innerHTML=records.length?records.map(r=>{const meta=metricMeta[r.metric];return `<div class="badge-row"><span class="badge-icon">${icon(meta.icon)}</span><div class="badge-info"><strong>${escapeHtml(r.name)}</strong><span>${escapeHtml(r.local)} · nuevo récord de ${meta.label}</span></div><span class="badge-value">${meta.fmt(r.value)}</span></div>`}).join(''):'<div class="empty-state">Todavía no hay récords personales — hace falta más de una semana cargada</div>';
}
function evolutionChartSvg(weeks){
  const points=weeks.map((w,i)=>({...w,i}));
  const withRatio=points.filter(p=>p.ratio!==null);
  if(!withRatio.length)return '<div class="empty-state">Sin objetivo cargado para graficar</div>';
  const w=760,h=190;
  const maxVal=Math.max(...withRatio.map(p=>p.ratio),110);
  const x=i=>points.length>1?(i/(points.length-1))*w:w/2;
  const y=v=>h-(v/maxVal)*(h-6)-3;
  const path=withRatio.length>1?withRatio.map((p,idx)=>`${idx===0?'M':'L'}${x(p.i).toFixed(1)},${y(p.ratio).toFixed(1)}`).join(' '):'';
  const dots=withRatio.map(p=>{const [mes,sem]=p.weekKey.split('|');return `<circle class="line-dot" cx="${x(p.i).toFixed(1)}" cy="${y(p.ratio).toFixed(1)}" r="4"><title>${percent(p.ratio)} · Semana ${sem} de ${mes}</title></circle>`}).join('');
  const targetY=y(100).toFixed(1);
  const first=points[0],last=points[points.length-1];
  const [firstMes,firstSem]=first.weekKey.split('|'),[lastMes,lastSem]=last.weekKey.split('|');
  const lastRatioLabel=last.ratio!==null?`${percent(last.ratio)} última semana`:'sin objetivo la última semana';
  return `<div class="chart-legend"><span><i class="legend-swatch" style="background:#52657d"></i>Objetivo (100%)</span><span><i class="legend-swatch" style="background:#F97316"></i>% cumplimiento</span></div><svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line x1="0" y1="${targetY}" x2="${w}" y2="${targetY}" stroke="#52657d" stroke-dasharray="6 5" stroke-width="2"></line>${path?`<path class="line-actual" d="${path}"></path>`:''}${dots}</svg><div class="line-axis"><span>S${firstSem} ${firstMes}</span><span>${lastRatioLabel}</span><span>S${lastSem} ${lastMes}</span></div>`;
}
function showEvolutionEmpty(badgeText,message){
  $('rankingPeriodBadge').textContent=badgeText;
  $('evolutionEmpty').hidden=false;
  $('evolutionEmpty').innerHTML=message;
  $('evolutionContent').hidden=true;
}
function renderRankEvolution(){
  qa('#evolutionScopeToggle .rank-tab-sm').forEach(btn=>btn.classList.toggle('active',btn.dataset.evoscope===state.evoScope));
  if(state.evoScope==='local')renderEvolutionLocal();
  else renderEvolutionSeller();
}
function renderEvolutionSeller(){
  const seller=$('sellerFilter').value;
  if(seller==='all'){showEvolutionEmpty('Elegí un vendedor','Elegí un vendedor en el filtro "Vendedor" de arriba para ver su evolución semanal.');return}
  // vendorHistory() ya filtra por este mismo nombre exacto ANTES de agrupar (y agrupa por nombre
  // solo, ver fusionarVendedoresCompartidos) — no puede devolver más de un historial acá, así que ya
  // no hace falta el aviso de "vendedores ambiguos, elegí un Local" que existía antes: esa
  // ambigüedad era justamente el síntoma del bug de agrupar por Local+Vendedor (auditoría
  // 2026-09-05), no un caso real de dos personas distintas.
  const histories=vendorHistory();
  const person=histories[0];
  if(!person||!person.weeks.length){showEvolutionEmpty('Sin semanas','Sin datos de VENDEDOR_SEMANAL para este vendedor todavía.');return}
  renderEvolutionWeeks(person.weeks,`${person.name} · ${person.local}`);
}
function renderEvolutionLocal(){
  const local=$('localFilter').value;
  if(local==='all'){showEvolutionEmpty('Elegí un local','Elegí un local en el filtro "Local" de arriba para ver su evolución semanal.');return}
  const store=localHistory()[0];
  if(!store||!store.weeks.length){showEvolutionEmpty('Sin semanas','Sin datos de VENDEDOR_SEMANAL para este local todavía.');return}
  renderEvolutionWeeks(store.weeks,store.local);
}
function renderEvolutionWeeks(weeks,heading){
  $('evolutionEmpty').hidden=true;
  $('evolutionContent').hidden=false;
  $('evolutionHeading').textContent=heading;
  const [lastMes,lastSemana]=weeks[weeks.length-1].weekKey.split('|');
  $('rankingPeriodBadge').textContent=`${weeks.length} semana(s) registrada(s) · última: Semana ${lastSemana} de ${lastMes}`;

  const streak=streakInfo(weeks);
  const withRatio=weeks.filter(w=>w.ratio!==null);
  const best=withRatio.length?withRatio.reduce((a,b)=>b.ratio>a.ratio?b:a):null;
  const mejoras=[];
  for(let i=1;i<weeks.length;i++){if(weeks[i].ratio!==null&&weeks[i-1].ratio!==null)mejoras.push(weeks[i].ratio-weeks[i-1].ratio)}
  const avgMejora=mejoras.length?mejoras.reduce((sum,v)=>sum+v,0)/mejoras.length:null;
  const rec=weeks.length>1?personalRecords(weeks):null;
  const recordBadges=rec?Object.keys(rec).filter(m=>rec[m].isRecord):[];

  $('evolutionMetrics').innerHTML=
    metricsCard('Semanas registradas',number(weeks.length),'en VENDEDOR_SEMANAL')+
    metricsCard('Racha actual',streak>0?`${streak} semana(s)`:'—',streak>0?'en objetivo consecutivo':'sin racha activa',streak>=3?'good':'')+
    (best?metricsCard('Mejor semana',percent(best.ratio),best.weekKey.replace('|',' · Semana '),best.ratio>=100?'good':''):metricsCard('Mejor semana','—',''))+
    metricsCard('Mejora promedio',avgMejora!==null?`${avgMejora>=0?'+':''}${avgMejora.toFixed(1)} pts`:'—',avgMejora!==null?'entre semanas consecutivas':'esperando 2ª semana',avgMejora!==null?(avgMejora>=0?'good':'bad'):'');

  $('evolutionChart').innerHTML=evolutionChartSvg(weeks);

  const rows=weeks.map((w,i)=>{
    const prev=i>0?weeks[i-1]:null;
    const mejora=(prev&&w.ratio!==null&&prev.ratio!==null)?w.ratio-prev.ratio:null;
    const [mes,semana]=w.weekKey.split('|');
    // w.conv ya viene como fracción (convRate en vendorHistory) — hay que *100 para mostrarlo como
    // el resto del dashboard; antes se mostraba crudo (bug real, auditoría 2026-09-06).
    return `<tr><td class="seller-name">Semana ${semana} de ${mes}</td><td class="num">${w.ratio!==null?percent(w.ratio):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${mejora!==null?`<span class="${mejora>=0?'positive':'negative'}">${mejora>=0?'+':''}${mejora.toFixed(1)} pts</span>`:'—'}</td><td class="num">${w.tp?money(w.tp):'—'}</td><td class="num">${w.conv?percent(w.conv*100):'—'}</td><td class="num">${w.pxt?number(w.pxt):'—'}</td></tr>`;
  }).join('');
  $('evolutionTable').innerHTML=`<thead><tr><th>Semana</th><th class="align-right">% cumplimiento</th><th class="align-right">Mejora</th><th class="align-right">Ticket prom.</th><th class="align-right">Conversión</th><th class="align-right">PxT</th></tr></thead><tbody>${rows}</tbody>`;

  // fmt de conv multiplica por 100 — mismo motivo que metricMeta más arriba (auditoría 2026-09-06).
  const badgeMeta={tp:{label:'Ticket promedio',icon:'tag',fmt:money},conv:{label:'Conversión',icon:'target',fmt:v=>percent(v*100)},pxt:{label:'PxT',icon:'shirt',fmt:v=>pxtTexto(v,1)}};
  $('evolutionBadges').innerHTML=recordBadges.length?recordBadges.map(m=>{const meta=badgeMeta[m];return `<div class="badge-row"><span class="badge-icon">${icon(meta.icon)}</span><div class="badge-info"><strong>Récord de ${meta.label}</strong><span>esta semana</span></div><span class="badge-value">${meta.fmt(rec[m].value)}</span></div>`}).join(''):'<div class="empty-state">Sin récords nuevos esta semana</div>';
}
function renderRankMejora(){
  const {rows}=currentWeekRowsPersonas();
  const currentKey=rankSemanaElegida(),prevKey=currentKey?rankSemanaAnterior(currentKey):null;
  if(!currentKey){showRankingEmpty();return}
  const [currentMes,currentSemana]=currentKey.split('|');
  $('rankingPeriodBadge').textContent=prevKey?`Fecha ${currentSemana} de ${currentMes} vs. fecha anterior`:`Fecha ${currentSemana} de ${currentMes} · primera fecha registrada`;

  // Por nombre solo: si el combo de locales de la persona cambió entre la semana actual y la
  // anterior (ej. cubrió 2 locales esta semana y solo 1 la pasada), la clave `${Local}|${Vendedor}`
  // los trataba como DOS personas distintas y "Mejora" nunca podía calcularse para esa persona
  // (bug real, auditoría 2026-09-05).
  const byPerson={};
  rows.forEach(row=>{
    const key=row.Vendedor,weekKey=weekKeyOf(row);
    if(!byPerson[key])byPerson[key]={name:row.Vendedor};
    if(weekKey===currentKey)byPerson[key].actual=row;
    if(prevKey&&weekKey===prevKey)byPerson[key].previo=row;
  });

  const ratioOf=row=>{if(!row)return null;const target=num(row,'Venta obj');return target?num(row,'Venta real')/target*100:null};

  const list=Object.values(byPerson).filter(p=>p.actual).map(p=>{
    const actualRatio=ratioOf(p.actual),prevRatio=p.previo?ratioOf(p.previo):null;
    const info=infoDiasDe(currentKey,p.name);
    // Igual que la app: la mejora necesita DOS semanas válidas. Contra una semana que no clasificó
    // (1 día y 216%) el delta no mide nada, y la semana siguiente regalaría una "mejora" enorme.
    const baseValida=!p.previo||infoDiasDe(prevKey,p.name).clasifica;
    const mejora=(actualRatio!==null&&prevRatio!==null&&baseValida)?actualRatio-prevRatio:null;
    return{...p,local:p.actual.Local,actualRatio,prevRatio,mejora,baseValida,
      dias:info.dias,diasAbiertos:info.abiertos,minDias:info.minimo,clasifica:info.clasifica||!(actualRatio>0)};
  });

  list.sort((a,b)=>{
    if(estaClasificado(a)!==estaClasificado(b))return estaClasificado(b)-estaClasificado(a);
    if(a.mejora!==null&&b.mejora!==null){if(b.mejora!==a.mejora)return b.mejora-a.mejora}
    else if(a.mejora!==null)return -1;
    else if(b.mejora!==null)return 1;
    const ar=a.actualRatio??-Infinity,br=b.actualRatio??-Infinity;
    if(br!==ar)return br-ar;
    return String(a.name).localeCompare(String(b.name),'es');
  });

  const withMejora=list.filter(p=>p.mejora!==null&&estaClasificado(p));
  const enMejora=withMejora.filter(p=>p.mejora>0).length;
  const avgMejora=withMejora.length?withMejora.reduce((sum,p)=>sum+p.mejora,0)/withMejora.length:0;
  const top=withMejora[0];

  $('rankingMetrics').innerHTML=list.length?
    metricsCard('Vendedores rankeados',number(list.length),'según filtros')+
    metricsCard('En mejora',number(enMejora),withMejora.length?`de ${withMejora.length} con semana anterior`:'sin semana anterior para comparar')+
    (top?metricsCard('Mayor mejora',escapeHtml(top.name),`${top.mejora>=0?'+':''}${top.mejora.toFixed(1)} pts`,top.mejora>=0?'good':'bad'):metricsCard('Mayor mejora','—','esperando 2ª semana'))+
    // El tono (verde/rojo) también tiene que depender de si hay datos — antes se pintaba "good" en
    // verde igual (avgMejora quedaba en 0 por default) aunque el texto dijera "esperando 2ª semana"
    // (bug real, auditoría 2026-09-05).
    metricsCard('Mejora promedio',withMejora.length?`${avgMejora>=0?'+':''}${avgMejora.toFixed(1)} pts`:'—',withMejora.length?'entre los que tienen 2 semanas':'esperando 2ª semana',withMejora.length?(avgMejora>=0?'good':'bad'):'')
    :'';

  const body=list.map((p,i)=>{
    const mejoraCell=p.mejora!==null?`<span class="${p.mejora>=0?'positive':'negative'}">${p.mejora>=0?'+':''}${p.mejora.toFixed(1)} pts</span>`:`<span class="missing-value">${p.previo&&!p.baseValida?'Semana anterior no clasificó':'Primera semana'}</span>`;
    const trend=p.mejora===null?'—':p.mejora>0?'<span class="trend-up">▲</span>':p.mejora<0?'<span class="trend-down">▼</span>':'<span class="trend-flat">■</span>';
    return `<tr${estaClasificado(p)?'':' class="rank-row-nc"'}><td class="num">${estaClasificado(p)?rankPos(i):rankPosNC}</td><td class="seller-name">${escapeHtml(p.name)}${ncTagHtml(p)}</td><td class="seller-location">${escapeHtml(p.local)}</td><td class="num">${p.actualRatio!==null?percent(p.actualRatio):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${p.prevRatio!==null?percent(p.prevRatio):'—'}</td><td class="num">${mejoraCell}</td><td class="num">${trend}</td></tr>`;
  }).join('');

  $('rankingTable').innerHTML=list.length?
    `<thead><tr><th class="align-right">#</th><th>Vendedor</th><th>Local</th><th class="align-right">% semana actual</th><th class="align-right">% semana anterior</th><th class="align-right">Mejora</th><th class="align-right">Tendencia</th></tr></thead><tbody>${body}</tbody>`
    :`<thead><tr><th class="align-right">#</th><th>Vendedor</th><th>Local</th><th class="align-right">% semana actual</th><th class="align-right">% semana anterior</th><th class="align-right">Mejora</th><th class="align-right">Tendencia</th></tr></thead><tbody><tr><td colspan="7" class="empty-state">Sin datos para estos filtros</td></tr></tbody>`;
  $('rankingRowsCount').textContent=list.length?`${list.length} vendedores`:'';
}
function renderRankCategory(category){
  const cfg=RANK_CATEGORIES[category];
  const mode=cfg.sortable?state.rankSortMode:cfg.mode;
  const currentKey=rankSemanaElegida();
  if(!currentKey){showRankingEmpty();return}
  const [currentMes,currentSemana]=currentKey.split('|');
  $('rankingPeriodBadge').textContent=`Fecha ${currentSemana} de ${currentMes}`;

  // Sale de f1RatioStandings, igual que la app de Ranking: mismas reglas de clasificación, y los que
  // no clasifican al final. Después se aplica el filtro de Local/Vendedor (la persona puede tener un
  // Local fundido "A + B": alcanza con que uno de los dos sea el elegido).
  const local=$('localFilter').value,seller=$('sellerFilter').value;
  const visible=p=>(local==='all'||String(p.local).split(' + ').includes(local))&&(seller==='all'||String(p.name)===seller);
  let list=f1RatioStandings(currentKey,cfg.field).filter(visible);
  if(mode!=='ratio')list.sort((a,b)=>(estaClasificado(b)-estaClasificado(a))||(b.real-a.real)||((b.ratio??-Infinity)-(a.ratio??-Infinity))||String(a.name).localeCompare(String(b.name),'es'));

  const withRatio=list.filter(p=>p.ratio!==null);
  const avgRatio=withRatio.length?withRatio.reduce((sum,p)=>sum+p.ratio,0)/withRatio.length:null;
  const aggregateReal=mode==='ratio'?(list.length?list.reduce((sum,p)=>sum+p.real,0)/list.length:0):list.reduce((sum,p)=>sum+p.real,0);
  const leader=list.find(estaClasificado);

  $('rankingMetrics').innerHTML=list.length?
    metricsCard('Vendedores rankeados',number(list.length),'según filtros')+
    metricsCard(cfg.totalLabel,cfg.fmt(aggregateReal),mode==='ratio'?'entre los rankeados, esta fecha':'total de la semana')+
    (leader?metricsCard('Líder',escapeHtml(leader.name),leader.ratio!==null?percent(leader.ratio):cfg.fmt(leader.real),'good'):metricsCard('Líder','—',''))+
    (avgRatio!==null?metricsCard('Cumplimiento promedio',percent(avgRatio),'entre los que tienen objetivo cargado'):metricsCard('Cumplimiento promedio','—','sin objetivo cargado'))
    :'';

  // "Puntos GP" en Liga VDH: siempre el puesto REAL contra toda la empresa esa fecha (no el
  // índice dentro de la lista ya filtrada por Local/Vendedor) — mismo criterio que GP VDH,
  // para que un supervisor filtrando por un local no vea puntos inflados/falsos.
  // Por nombre solo (no `${local}|${name}`): f1RatioStandings siempre corre sobre TODA la empresa
  // sin filtro de Local, así que a alguien que cubre 2 locales le puede quedar acá un Local fundido
  // ("San Justo 1 + Flores") distinto al `p.local` de ESTA lista (que si hay un filtro de Local
  // activo puede venir de un solo local) — comparar por el string compuesto los desencontraba y
  // "Puntos GP" quedaba en "—" para esa persona pese a haber puntuado (bug real, auditoría
  // 2026-09-05).
  const gpPoints=category==='liga'?(()=>{const map={};f1RatioStandings(currentKey,null).filter(estaClasificado).slice(0,F1_MAIN_POINTS.length).forEach((p,i)=>{map[p.name]=F1_MAIN_POINTS[i]});return map})():null;
  const gpCol=p=>gpPoints[p.name]??'—';

  const body=list.map((p,i)=>`<tr${estaClasificado(p)?'':' class="rank-row-nc"'}><td class="num">${estaClasificado(p)?rankPos(i):rankPosNC}</td><td class="seller-name">${escapeHtml(p.name)}${ncTagHtml(p)}</td><td class="seller-location">${escapeHtml(p.local)}</td><td class="num">${cfg.fmt(p.real)}</td><td class="num">${p.obj?cfg.fmt(p.obj):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${p.ratio!==null?percent(p.ratio):'—'}</td>${gpPoints?`<td class="num">${gpCol(p)}</td>`:''}</tr>`).join('');

  const gpHeadCell=gpPoints?'<th class="align-right">Puntos GP</th>':'';
  $('rankingTable').innerHTML=list.length?
    `<thead><tr><th class="align-right">#</th><th>Vendedor</th><th>Local</th><th class="align-right">${cfg.valueLabel}</th><th class="align-right">Objetivo</th><th class="align-right">% cumplimiento</th>${gpHeadCell}</tr></thead><tbody>${body}</tbody>`
    :`<thead><tr><th class="align-right">#</th><th>Vendedor</th><th>Local</th><th class="align-right">${cfg.valueLabel}</th><th class="align-right">Objetivo</th><th class="align-right">% cumplimiento</th>${gpHeadCell}</tr></thead><tbody><tr><td colspan="${gpPoints?7:6}" class="empty-state">Sin datos para estos filtros</td></tr></tbody>`;
  $('rankingRowsCount').textContent=list.length?`${list.length} vendedores`:'';

  // Con un filtro de Local/Vendedor activo, el "#" de esta tabla es la posición DENTRO del
  // filtro, pero "Puntos GP" siempre es el puesto real a nivel empresa (ver nota de arriba) —
  // sin esta aclaración un supervisor podía leer eso como una inconsistencia/bug.
  const footnote=$('rankingFootnote');
  const filterActive=$('localFilter').value!=='all'||$('sellerFilter').value!=='all';
  if(gpPoints&&filterActive){
    footnote.textContent='El "#" es la posición dentro del filtro actual. "Puntos GP" siempre refleja el puesto real a nivel empresa, sin importar el filtro.';
    footnote.hidden=false;
  }else{
    footnote.hidden=true;
  }
}
function seasonLocalRows(){const local=$('localFilter').value;return (state.tables.LOCAL_DIARIO||[]).filter(row=>local==='all'||String(row.Local??'')===local)}
function seasonSellerRows(){const local=$('localFilter').value,seller=$('sellerFilter').value;return (state.tables.VENDEDOR_SEMANAL||[]).filter(row=>(local==='all'||String(row.Local??'')===local)&&(seller==='all'||String(row.Vendedor??'')===seller))}
function renderSeason(){
  const localRows=seasonLocalRows();
  const monthsPresent=[...new Set(localRows.map(row=>row.Mes).filter(Boolean))].sort((a,b)=>MONTH_ORDER.indexOf(a)-MONTH_ORDER.indexOf(b));
  if(!monthsPresent.length){
    $('seasonMetrics').innerHTML='';$('seasonMonthTable').innerHTML='';$('seasonTrafficTable').innerHTML='';$('seasonRankingTable').innerHTML='';
    const focus=$('seasonFocus');focus.classList.add('empty-state');focus.innerHTML='Sin datos';
    const trend=$('seasonTrendChart');trend.classList.add('empty-state');trend.innerHTML='Sin datos';
    return;
  }
  const perMonth=monthsPresent.map(mes=>{
    const rows=localRows.filter(row=>row.Mes===mes);
    const target=rows.reduce((sum,row)=>sum+num(row,'Objetivo'),0);
    const actual=rows.reduce((sum,row)=>sum+num(row,'Venta real'),0);
    const traffic=rows.reduce((sum,row)=>sum+num(row,'Tráfico real'),0);
    const pondMes=rows.reduce((acc,row)=>sumarPonderado(acc,num(row,'Venta real'),num(row,'Ticket prom.'),num(row,'PxT real'),num(row,'Tráfico real')),nuevoPonderado());
    const cerradoMes=cerrarPonderado(pondMes);
    const conv=cerradoMes.conversion,ticket=cerradoMes.ticket;
    const convObjs=rows.map(row=>convRate(row,'Conversión obj')).filter(v=>v>0);
    const convObj=convObjs.length?convObjs.reduce((sum,v)=>sum+v,0)/convObjs.length:0;
    const loaded=rows.some(row=>num(row,'Venta real')||num(row,'Tráfico real'));
    // `pond` tiene que viajar en la fila: más abajo se unen los de todos los meses para sacar el
    // ticket y la conversión del semestre entero. Olvidarlo acá dejaba m.pond en undefined,
    // unirPonderados() explotaba con "Cannot read properties of undefined (reading 'venta')" y,
    // como el error sube hasta loadData(), se caía el dashboard COMPLETO — no solo esta vista.
    return{mes,target,actual,traffic,conv,ticket,convObj,loaded,pond:pondMes,ratio:target?actual/target:0};
  });
  let accActual=0,accTarget=0;
  const monthRows=perMonth.map(m=>{accActual+=m.actual;accTarget+=m.target;return{...m,accActual,accTarget,accDelta:accActual-accTarget}});
  const totalActual=perMonth.reduce((sum,m)=>sum+m.actual,0),totalTarget=perMonth.reduce((sum,m)=>sum+m.target,0),totalTraffic=perMonth.reduce((sum,m)=>sum+m.traffic,0);
  const globalRatio=totalTarget?totalActual/totalTarget:0;
  const withData=perMonth.filter(m=>m.loaded);
  // Ponderado sobre el semestre entero, no promedio de los promedios de cada mes.
  const pondSemestre=cerrarPonderado(unirPonderados(withData.map(m=>m.pond)));
  const avgConv=pondSemestre.conversion,avgTicket=pondSemestre.ticket;
  $('seasonMetrics').innerHTML=metricsCard('Venta total semestre',money(totalActual),`${monthsPresent.length} mes(es) con pestaña cargada`)+metricsCard('Cumplimiento objetivo',percent(globalRatio*100),`${money(totalActual-totalTarget)} vs. objetivo`,statusTone(globalRatio))+metricsCard('Tráfico total',number(totalTraffic),`${percent(avgConv*100)} conversión promedio`)+metricsCard('Ticket promedio',money(avgTicket),'venta del semestre ÷ tickets');

  const estadoFor=m=>{if(!m.loaded)return{label:'Sin datos',cls:''};if(m.ratio>=1)return{label:'En objetivo',cls:'positive'};if(m.ratio>=UMBRAL_AMARILLO)return{label:'Alerta',cls:'warning'};return{label:'Atención',cls:'negative'}};
  $('seasonMonthTable').innerHTML=`<thead><tr><th>Mes</th><th class="align-right">Objetivo</th><th class="align-right">Venta real</th><th class="align-right">Avance</th><th class="align-right">Acum. real</th><th class="align-right">Desv. acum.</th><th>Estado</th></tr></thead><tbody>${monthRows.map(m=>{const estado=estadoFor(m);return `<tr><td class="seller-name">${escapeHtml(m.mes)}</td><td class="num">${money(m.target)}</td><td class="num">${money(m.actual)}</td><td class="num">${percent(m.ratio*100)}</td><td class="num">${money(m.accActual)}</td><td class="num ${m.accDelta>=0?'positive':'negative'}">${money(m.accDelta)}</td><td class="${estado.cls}">${estado.label}</td></tr>`}).join('')}<tr class="season-total"><td class="seller-name">Total</td><td class="num">${money(totalTarget)}</td><td class="num">${money(totalActual)}</td><td class="num">${percent(globalRatio*100)}</td><td class="num">${money(totalActual)}</td><td class="num ${totalActual-totalTarget>=0?'positive':'negative'}">${money(totalActual-totalTarget)}</td><td></td></tr></tbody>`;

  $('seasonTrafficTable').innerHTML=`<thead><tr><th>Mes</th><th class="align-right">Tráfico</th><th class="align-right">Conversión</th><th class="align-right">Ticket prom.</th></tr></thead><tbody>${perMonth.map(m=>`<tr><td class="seller-name">${escapeHtml(m.mes)}</td><td class="num">${number(m.traffic)}</td><td class="num">${percent(m.conv*100)}</td><td class="num">${money(m.ticket)}</td></tr>`).join('')}</tbody>`;

  renderSeasonTrend(perMonth);

  const sellerRows=seasonSellerRows();
  const groups={};
  // Por nombre solo (no Local+Vendedor): alguien que vendió en dos locales durante el semestre
  // sumaba su venta acumulada partida en dos filas separadas, en vez de en una sola por persona
  // (bug real, auditoría 2026-09-05). `locales` junta todos los locales donde vendió para mostrarla.
  sellerRows.forEach(row=>{const key=row.Vendedor;if(!groups[key])groups[key]={name:row.Vendedor,locales:new Set(),actual:0,pxtSum:0,pxtCount:0};groups[key].locales.add(row.Local);groups[key].actual+=num(row,'Venta real');const pxt=num(row,'PxT real');if(pxt){groups[key].pxtSum+=pxt;groups[key].pxtCount++}});
  const rankList=Object.values(groups).map(g=>({...g,local:[...g.locales].sort().join(' + '),pxt:g.pxtCount?g.pxtSum/g.pxtCount:0})).sort((a,b)=>b.actual-a.actual);
  const teamTotal=rankList.reduce((sum,g)=>sum+g.actual,0)||1;
  $('seasonRankingTable').innerHTML=`<thead><tr><th class="align-right">#</th><th>Vendedor</th><th>Local</th><th class="align-right">Venta acum.</th><th class="align-right">Part.</th><th class="align-right">PxT</th></tr></thead><tbody>${rankList.length?rankList.slice(0,10).map((g,i)=>`<tr><td class="num">${i+1}</td><td class="seller-name">${escapeHtml(g.name)}</td><td class="seller-location">${escapeHtml(g.local)}</td><td class="num">${money(g.actual)}</td><td class="num">${percent(g.actual/teamTotal*100)}</td><td class="num">${number(g.pxt)}</td></tr>`).join(''):'<tr><td colspan="6" class="empty-state">Sin datos</td></tr>'}</tbody>`;

  const best=withData.length?withData.reduce((a,b)=>b.ratio>a.ratio?b:a):null;
  const worst=withData.length?withData.reduce((a,b)=>b.ratio<a.ratio?b:a):null;
  const monthsOverTarget=withData.filter(m=>m.ratio>=1).length;
  const withConvObj=withData.filter(m=>m.convObj>0);
  const avgConvObjSeason=withConvObj.length?withConvObj.reduce((sum,m)=>sum+m.convObj,0)/withConvObj.length:0;
  const brechaConv=avgConv-avgConvObjSeason;
  const accTotals=sellerRows.reduce((acc,row)=>{acc.perfumesTarget+=num(row,'Perfumes obj');acc.perfumesActual+=num(row,'Perfumes real');acc.boxerTarget+=num(row,'Boxer obj');acc.boxerActual+=num(row,'Boxer real');return acc},{perfumesTarget:0,perfumesActual:0,boxerTarget:0,boxerActual:0});
  const focus=$('seasonFocus');focus.classList.remove('empty-state');
  const focusRow=(label,value,tone='')=>`<div class="focus-row"><span class="focus-label">${label}</span><span class="focus-value ${tone}">${value}</span></div>`;
  focus.innerHTML=(best?focusRow('Mejor mes',best.mes,'positive'):'')+(worst&&worst.mes!==(best&&best.mes)?focusRow('Peor mes',worst.mes,'negative'):'')+focusRow('Meses sobre objetivo',`${monthsOverTarget} de ${monthsPresent.length}`)+(withConvObj.length?focusRow('Brecha conversión',`${brechaConv>=0?'+':''}${percent(brechaConv*100)}`,brechaConv>=0?'positive':'negative'):'')+focusRow('Perfumes',`${number(accTotals.perfumesActual)} vs ${number(accTotals.perfumesTarget)} obj`,accTotals.perfumesActual>=accTotals.perfumesTarget?'positive':'negative')+focusRow('Boxer',`${number(accTotals.boxerActual)} vs ${number(accTotals.boxerTarget)} obj`,accTotals.boxerActual>=accTotals.boxerTarget?'positive':'negative');
}
function periodRows(table,monthId,weekId,fromId=null,toId=null){const month=$(monthId).value,week=$(weekId).value,from=fromId?$(fromId).value:'',to=toId?$(toId).value:'';return (state.tables[table]||[]).filter(row=>(month==='all'||String(row.Mes??'')===month)&&(week==='all'||String(row.Semana??'')===week)&&( $('localFilter').value==='all'||String(row.Local??'')===$('localFilter').value)&&( $('sellerFilter').value==='all'||String(row.Vendedor??'')===$('sellerFilter').value)&&(!from||normalizeDate(row.Fecha||row['Fecha foto'])>=from)&&(!to||normalizeDate(row.Fecha||row['Fecha foto'])<=to))}
function fillPeriodFilters(monthId,weekId){const months=[...new Set(allRows('VENDEDOR_SEMANAL').map(row=>row.Mes).filter(Boolean))];const option=(value,label)=>`<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;const previousMonth=$(monthId).value;$(monthId).innerHTML=option('all','Todos los meses')+months.map(x=>option(x,x)).join('');$(monthId).value=months.includes(previousMonth)?previousMonth:'all';const month=$(monthId).value;const weeks=[...new Set(allRows('VENDEDOR_SEMANAL').filter(row=>month==='all'||String(row.Mes??'')===month).map(row=>row.Semana).filter(v=>v!==undefined&&v!==null))].sort((a,b)=>Number(a)-Number(b));const previousWeek=$(weekId).value;$(weekId).innerHTML=option('all','Todas las semanas')+weeks.map(x=>option(x,`Semana ${x}`)).join('');$(weekId).value=weeks.map(String).includes(previousWeek)?previousWeek:'all'}
// Detalle individual (Métricas vendedores): mismo mecanismo de header clickeable que ya usan las
// tablas de Locales/E-commerce (state.sort + renderTable), portado a mano acá porque esta tabla no
// sale de filas crudas del Sheet sino de `list` ya agregado por vendedor (Venta/Tráfico/Conversión
// son sumas y promedios propios, no una columna de una fila — renderTable() no aplica). Por
// defecto (sin click todavía, o con otra tabla como último click) ordena por % objetivo
// descendente, mismo criterio que ya usa el resto del dashboard — Liga VDH, GP VDH, etc. — con
// venta real y nombre como desempate; un click en cualquier header pasa a ordenar por esa columna
// (asc. la primera vez, desc. la segunda, mismo toggle que ya usan Locales/E-commerce).
const SELLER_DETAIL_SORT={
  name:p=>p.name,local:p=>p.local,sale:p=>p.sale,target:p=>p.target,traffic:p=>p.traffic,
  conversionAvg:p=>p.conversionAvg,ticketAvg:p=>p.ticketAvg,garmentsAvg:p=>p.garmentsAvg,ratio:p=>p.ratio,
  weeksRatio:p=>p.weeksTotal?p.weeksMet/p.weeksTotal:-1
};
function sortSellerDetail(list){
  const active=state.sort.table==='sellerDetailTable'?SELLER_DETAIL_SORT[state.sort.key]:null;
  list.sort((a,b)=>{
    if(!active)return (b.ratio-a.ratio)||(b.sale-a.sale)||String(a.name).localeCompare(String(b.name),'es');
    const av=active(a),bv=active(b);
    if(typeof av==='string')return av.localeCompare(bv,'es')*state.sort.direction;
    return (av<bv?-1:av>bv?1:0)*state.sort.direction;
  });
}
// "Semanas en objetivo": para cada vendedor, cuántas semanas del MES cumplió su objetivo semanal
// (Venta real ≥ Venta obj) sobre las semanas que YA tienen objetivo cargado — el denominador crece
// solo a medida que se cargan más semanas del mes, no arranca fijo en "de 4/5" (mismo patrón que
// "Meses sobre obj." de Informe de Temporada, pedido explícito 2026-09-08). Fundida por vendedor
// compartido (fusionarVendedoresCompartidos) ANTES de contar semanas — sin fundir, alguien que
// cubrió 2 locales en la misma semana quedaba con 2 filas separadas esa semana, cada una con una
// porción de su venta/objetivo, y el conteo de semanas se inflaba de más (bug real: contaba semana
// doble en vez de una sola vez evaluada contra su objetivo semanal completo).
function weeklyComplianceByVendedor(month){
  const local=$('localFilter').value;
  const rawRows=(state.tables.VENDEDOR_SEMANAL||[]).filter(row=>String(row.Mes??'')===month&&(local==='all'||String(row.Local??'')===local));
  const groups={};
  fusionarVendedoresCompartidos(rawRows).forEach(row=>{
    const key=row.Vendedor,obj=num(row,'Venta obj');
    if(!obj)return; // semana sin objetivo cargado no cuenta ni a favor ni en contra
    if(!groups[key])groups[key]={met:0,total:0};
    groups[key].total++;
    if(num(row,'Venta real')>=obj)groups[key].met++;
  });
  return groups;
}
function renderSellerMetrics(){const rows=periodRows('VENDEDOR_SEMANAL','metricsMonthFilter','metricsWeekFilter'),groups={};
  // Por nombre solo (no Local+Vendedor): alguien que vende en dos locales quedaba partido en dos
  // filas de esta tabla, cada una con la mitad de su venta y objetivo, como si fueran dos personas
  // distintas — el nombre+apellido ya alcanza como identidad única (bug real reportado el
  // 2026-09-05). `locales` guarda los locales reales por separado (sin combinar todavía) para no
  // romper localObjetivoFor() más abajo, que necesita el nombre exacto de un local de LOCAL_DIARIO.
  rows.forEach(row=>{
    const key=row.Vendedor;
    if(!groups[key])groups[key]={name:row.Vendedor,locales:new Set(),sale:0,target:0,traffic:0,pond:nuevoPonderado(),count:0};
    const group=groups[key];
    group.locales.add(row.Local);
    group.sale+=num(row,'Venta real');group.target+=num(row,'Venta obj');group.traffic+=num(row,'Tráfico real');
    sumarPonderado(group.pond,num(row,'Venta real'),num(row,'TP real'),num(row,'PxT real'),num(row,'Tráfico real'));
    // Conversión/TP/PxT se promedian SOLO sobre las semanas que tienen el dato cargado, no sobre
    // todas las filas del vendedor. VENDEDOR_SEMANAL trae una fila por CADA semana del semestre y
    // las que todavía no se trabajaron llegan en cero (en la planilla esas celdas están vacías, el
    // consolidador las publica como 0). Dividir por todas hundía el promedio: Sebas Ramon daba 28%
    // de conversión y $33.614 de ticket contra el 70% y $84.035 de su planilla, porque tres de sus
    // cinco semanas estaban vacías (bug real reportado el 2026-09-30, verificado contra la planilla
    // de Rivadavia y contra el sistema de ventas). Mismo criterio que el bloque `monthly` de
    // renderStores y que la propia planilla, que promedia con PROMEDIO() sobre las celdas cargadas.
    group.count++;
  });
  const metricsMonth=$('metricsMonthFilter').value,metricsWeek=$('metricsWeekFilter').value;
  // "Semanas en objetivo" ignora el filtro de Semana a propósito (mismo criterio que "Cierre
  // Estimado" de Resumen General, que tampoco se achica con el filtro de fecha): la pregunta es
  // "cómo viene en el mes", no "cómo vino esa semana puntual" — si Mes==='all' toma el mes vigente.
  const complianceMonth=metricsMonth==='all'?currentMonthOf('VENDEDOR_SEMANAL'):metricsMonth;
  const compliance=weeklyComplianceByVendedor(complianceMonth);
  // Campos derivados calculados una sola vez acá (no en cada celda ni en el comparador) para poder
  // ordenar por lo que el usuario realmente VE — el promedio de Conversión/Ticket/Prendas, no el
  // acumulador crudo que suman más arriba (sumar esos acumuladores entre vendedores con distinta
  // cantidad de semanas cargadas no da un promedio válido para ordenar).
  const list=Object.values(groups).map(g=>{
    const local=[...g.locales].sort().join(' + ');
    const p=cerrarPonderado(g.pond);
    const conversionAvg=p.conversion,ticketAvg=p.ticket,garmentsAvg=p.pxt;
    const ratio=g.target?g.sale/g.target:0;
    const comp=compliance[g.name]||{met:0,total:0};
    return{...g,local,conversionAvg,ticketAvg,garmentsAvg,ratio,weeksMet:comp.met,weeksTotal:comp.total};
  });
  sortSellerDetail(list);
  const daily=(state.tables.VENDEDOR_DIARIO||[]).filter(row=>rowMatchesFilters(row)&&(metricsMonth==='all'||String(row.Mes??'')===metricsMonth)&&(metricsWeek==='all'||String(row.Semana??'')===metricsWeek));
  // VENDEDOR_DIARIO no trae una columna de objetivo diario propia (buscaba 'Objetivo del día', que
  // no existe en ninguna alias — daba siempre 0 y la card "Venta" de acá abajo nunca mostraba el %,
  // bug real de la auditoría 2026-09-05). El objetivo diario de CADA vendedor se deriva igual que en
  // sellerTargetForDay: su objetivo SEMANAL (VENDEDOR_SEMANAL) repartido entre los días de esa semana.
  const dailyTotals=daily.reduce((acc,row)=>{
    const weekLength=weekDates(row).length;
    acc.actual+=num(row,'Venta real');
    acc.target+=weekLength?sellerWeeklyTarget(row.Local,row.Mes,row.Semana,row.Vendedor)/weekLength:0;
    return acc;
  },{actual:0,target:0});
  const totalTraffic=list.reduce((sum,row)=>sum+row.traffic,0);
  // Las tarjetas de arriba también ponderan: se juntan los totales de TODOS los vendedores
  // visibles y recién ahí se divide, en vez de promediar el promedio de cada persona.
  const totalPond=cerrarPonderado(unirPonderados(list.map(row=>row.pond)));
  const avgConv=totalPond.conversion,avgTicket=totalPond.ticket,avgGarments=totalPond.pxt;
  // Conversión/Ticket objetivo son del LOCAL, no por vendedor (ver localObjetivoFor) — se promedia el
  // objetivo de los locales presentes en la vista actual para el diagnóstico y la card de referencia.
  // Se arma desde row.locales (los locales reales, sin combinar) y no desde row.local (que puede ser
  // "San Justo 1 + Flores" para alguien que cubre dos) — localObjetivoFor necesita el nombre EXACTO
  // de un local de LOCAL_DIARIO, un string combinado no matchea ninguno (bug real, auditoría
  // 2026-09-05).
  const localsPresent=[...new Set(list.flatMap(row=>[...row.locales]))];
  const localObjs=localsPresent.map(local=>localObjetivoFor(local,metricsMonth));
  const avgConvObj=localObjs.length?localObjs.reduce((sum,o)=>sum+o.convObj,0)/localObjs.length:0;
  const avgTicketObj=localObjs.length?localObjs.reduce((sum,o)=>sum+o.ticketObj,0)/localObjs.length:0;
  const hasConvObj=avgConvObj>0,hasTicketObj=avgTicketObj>0;
  $('sellerDetailMetrics').innerHTML=metricsCard('Vendedores visibles',number(list.length),'según filtros')+progressCard('Venta',money,dailyTotals.actual,dailyTotals.target,'según registros diarios')+metricsCard('Tráfico real',number(totalTraffic),'personas registradas')+metricsCard('Conversión media',percent(avgConv*100),hasConvObj?`${avgConv>=avgConvObj?'+':''}${percent((avgConv-avgConvObj)*100)} vs. objetivo (${percent(avgConvObj*100)})`:'conversión del período',hasConvObj?(avgConv>=avgConvObj?'good':'bad'):'')+metricsCard('Ticket promedio',money(avgTicket),hasTicketObj?`objetivo ${money(avgTicketObj)}`:'promedio entre vendedores',hasTicketObj?(avgTicket>=avgTicketObj?'good':'bad'):'')+metricsCard('Prendas por ticket',pxtTexto(avgGarments,1),'promedio entre vendedores');
  renderTrafficFunnel('sellerFunnel',list.length>0,totalTraffic,avgConv);
  renderDiagnosisPanel('sellerDiagnosis',avgConv,avgConvObj,hasConvObj,avgTicket,avgTicketObj,hasTicketObj);
  renderSellerFocus(list,metricsMonth);
  // row.conversionAvg ya viene como fracción (convRate al sumar más arriba, promediada en el .map
  // de más arriba) — hay que *100 para mostrarlo como el resto del dashboard; antes se mostraba
  // crudo, mismo bug que dejaba "Conversión media" en 354% en la tarjeta de arriba (auditoría
  // 2026-09-06).
  const headerCell=(label,key,numeric)=>{
    const active=state.sort.table==='sellerDetailTable'&&state.sort.key===key;
    const sortAttr=active?(state.sort.direction>0?'ascending':'descending'):'none';
    return `<th data-sort="${key}" tabindex="0" aria-sort="${sortAttr}"${numeric?' class="align-right"':''}>${label}${active?' '+(state.sort.direction>0?'↑':'↓'):''}</th>`;
  };
  const body=list.map(row=>{
    const weeksRatio=row.weeksTotal?row.weeksMet/row.weeksTotal:null;
    const weeksCell=weeksRatio!==null
      ?`<td class="num ${cumplClase(weeksRatio)}">${row.weeksMet} de ${row.weeksTotal}</td>`
      :'<td class="num"><span class="missing-value">Sin datos</span></td>';
    return `<tr><td class="seller-name">${escapeHtml(row.name)}</td><td class="seller-location">${escapeHtml(row.local)}</td><td class="num">${money(row.sale)}</td><td class="num">${money(row.target)}</td><td class="num">${number(row.traffic)}</td><td class="num">${percent(row.conversionAvg*100)}</td><td class="num">${money(row.ticketAvg)}</td><td class="num">${pxtTexto(row.garmentsAvg,1)}</td><td class="num ${cumplClase(row.ratio)}">${percent(row.ratio*100)}</td>${weeksCell}</tr>`;
  }).join('');
  $('sellerDetailTable').innerHTML=`<thead><tr>${headerCell('Vendedor','name')}${headerCell('Local','local')}${headerCell('Venta','sale',true)}${headerCell('Objetivo','target',true)}${headerCell('Tráfico','traffic',true)}${headerCell('Conversión','conversionAvg',true)}${headerCell('Ticket promedio','ticketAvg',true)}${headerCell('Prendas por ticket','garmentsAvg',true)}${headerCell('% objetivo','ratio',true)}${headerCell('Semanas en objetivo','weeksRatio',true)}</tr></thead><tbody>${body||'<tr><td colspan="10" class="empty-state">Sin datos para estos filtros</td></tr>'}</tbody>`;
  $('sellerDetailRowsCount').textContent=`${list.length} vendedores`;
  attachSortHeaders('sellerDetailTable');
}
// Accesorios: mismo mecanismo de header clickeable que sellerDetailTable (SELLER_DETAIL_SORT +
// attachSortHeaders) — pedido explícito 2026-09-13: el orden por defecto (% cumplimiento
// combinado perfumes+boxer) sirve para el ranking, pero también hace falta poder ordenar por
// CANTIDAD vendida de cada producto (quién vendió más perfumes / más boxers en crudo, sin mirar
// el objetivo). Un click en "Perfumes" o "Boxers" pasa a ordenar por esa cantidad real; sin click
// (o con otra tabla como último click) cae al criterio combinado de siempre.
const ACCESSORY_SORT={
  name:p=>p.name,local:p=>p.local,perfumesActual:p=>p.perfumesActual,boxerActual:p=>p.boxerActual
};
function sortAccessories(list){
  const active=state.sort.table==='accessoryTable'?ACCESSORY_SORT[state.sort.key]:null;
  list.sort((a,b)=>{
    if(!active){
      const ar=(a.perfumesTarget+a.boxerTarget)?(a.perfumesActual+a.boxerActual)/(a.perfumesTarget+a.boxerTarget):0;
      const br=(b.perfumesTarget+b.boxerTarget)?(b.perfumesActual+b.boxerActual)/(b.perfumesTarget+b.boxerTarget):0;
      return (br-ar)||String(a.name).localeCompare(String(b.name),'es');
    }
    const av=active(a),bv=active(b);
    if(typeof av==='string')return av.localeCompare(bv,'es')*state.sort.direction;
    return (av<bv?-1:av>bv?1:0)*state.sort.direction;
  });
}
function renderAccessories(){const rows=periodRows('VENDEDOR_SEMANAL','accessoryMonthFilter','accessoryWeekFilter'),groups={};
  // Por nombre solo (no Local+Vendedor): alguien que vende en dos locales quedaba con su venta de
  // perfumes/boxers y su objetivo partidos en dos filas, como si fueran dos vendedores distintos
  // (bug real, auditoría 2026-09-05).
  rows.forEach(row=>{
    const key=row.Vendedor;
    if(!groups[key])groups[key]={name:row.Vendedor,locales:new Set(),perfumesTarget:0,perfumesActual:0,boxerTarget:0,boxerActual:0};
    groups[key].locales.add(row.Local);
    groups[key].perfumesTarget+=num(row,'Perfumes obj');groups[key].perfumesActual+=num(row,'Perfumes real');groups[key].boxerTarget+=num(row,'Boxer obj');groups[key].boxerActual+=num(row,'Boxer real');
  });
  // CRITERIO GENERAL DE ORDENAMIENTO: por defecto ordena por el mismo % de cumplimiento COMBINADO
  // (perfumes+boxer) que esta función ya usa para su propia card "Cumplimiento global" más abajo —
  // se reusa la fórmula existente, no se inventa una nueva. Un click en un header pasa a ordenar
  // por esa columna (ver sortAccessories/ACCESSORY_SORT), incluida la cantidad real vendida de
  // Perfumes/Boxers.
  const list=Object.values(groups).map(g=>({...g,local:[...g.locales].sort().join(' + ')})).filter(row=>row.perfumesTarget||row.perfumesActual||row.boxerTarget||row.boxerActual);
  sortAccessories(list);
  const status=(actual,target)=>target?cumplClase(actual/target):'warning';const cell=(actual,target)=>`<div class="accessory-cell"><strong>${number(actual)}</strong><span>obj. ${number(target)}</span><em class="${status(actual,target)}">${target?percent(actual/target*100):'Sin objetivo'}</em><small>desvío ${number(actual-target)}</small></div>`;const totals=list.reduce((acc,row)=>{acc.perfumesTarget+=row.perfumesTarget;acc.perfumesActual+=row.perfumesActual;acc.boxerTarget+=row.boxerTarget;acc.boxerActual+=row.boxerActual;return acc},{perfumesTarget:0,perfumesActual:0,boxerTarget:0,boxerActual:0});const totalRatio=(totals.perfumesTarget+totals.boxerTarget)?(totals.perfumesActual+totals.boxerActual)/(totals.perfumesTarget+totals.boxerTarget):0;$('accessoryMetrics').innerHTML=metricsCard('Vendedores con datos',number(list.length),'según filtros')+metricsCard('Perfumes',number(totals.perfumesActual),`obj. ${number(totals.perfumesTarget)} · ${totals.perfumesTarget?percent(totals.perfumesActual/totals.perfumesTarget*100):'sin objetivo'}`,status(totals.perfumesActual,totals.perfumesTarget))+metricsCard('Boxers',number(totals.boxerActual),`obj. ${number(totals.boxerTarget)} · ${totals.boxerTarget?percent(totals.boxerActual/totals.boxerTarget*100):'sin objetivo'}`,status(totals.boxerActual,totals.boxerTarget))+metricsCard('Cumplimiento global',percent(totalRatio*100),'perfumes + boxers',status(totals.perfumesActual+totals.boxerActual,totals.perfumesTarget+totals.boxerTarget));const headerCell=(label,key)=>{const active=state.sort.table==='accessoryTable'&&state.sort.key===key;const sortAttr=active?(state.sort.direction>0?'ascending':'descending'):'none';return `<th data-sort="${key}" tabindex="0" aria-sort="${sortAttr}">${label}${active?' '+(state.sort.direction>0?'↑':'↓'):''}</th>`};$('accessoryTable').innerHTML=list.length?`<thead><tr>${headerCell('Vendedor','name')}${headerCell('Local','local')}${headerCell('Perfumes','perfumesActual')}${headerCell('Boxers','boxerActual')}</tr></thead><tbody>${list.map(row=>`<tr><td class="seller-name">${escapeHtml(row.name)}</td><td class="seller-location">${escapeHtml(row.local)}</td><td>${cell(row.perfumesActual,row.perfumesTarget)}</td><td>${cell(row.boxerActual,row.boxerTarget)}</td></tr>`).join('')}</tbody>`:'<tbody><tr><td colspan="4" class="empty-state">Sin datos de accesorios para estos filtros.</td></tr></tbody>';$('accessoryRowsCount').textContent=list.length?`${list.length} vendedores`:'Sin datos';attachSortHeaders('accessoryTable')}
function renderOverview(){
  const localRows=rowsThroughToday(overviewRows('LOCAL_DIARIO')),ecomRows=rowsThroughToday(overviewRows('ECOM_DIARIO')),rows=[...localRows,...ecomRows];
  const a=aggregate(rows);
  // Split Locales/Online para "Resumen ejecutivo" — a nivel de canal, prorrateado a la fecha igual
  // que `a` (mismo criterio que el resto de esta función, no el objetivo de MES completo).
  const aLocalCh=aggregate(localRows),aEcomCh=aggregate(ecomRows);

  const daily=dailySeries(rows),cumulative=cumulativeSeries(daily);
  const lastIdx=daily.length-1,prevIdx=lastIdx-1;
  const yesterdayCum=prevIdx>=0?cumulative[prevIdx]:null;

  // Ritmo Necesario y Cierre Estimado se miden contra el objetivo del MES completo — monthContext()
  // lo arma una sola vez para no repetir la misma lógica en cada tarjeta.
  const{localMonth,monthRows,monthTarget}=monthContext();

  // Lo que se mide "del mes" necesita numerador Y denominador del MISMO mes.
  //
  // Hasta el 30/09 el numerador era `a.actual` —la venta de TODO el período que muestre el filtro—
  // contra monthTarget, que es el objetivo de un mes solo. Mientras el semestre tuvo un único mes
  // cargado los dos coincidían y nadie lo notó. El 01/10, con septiembre y octubre cargados, pasó a
  // dividir $272.986.289 (sept + 1 día de oct) por el objetivo de octubre ($245.891.998): 111% de
  // avance, "faltan $0", "Ritmo necesario $0/día" y el cartel verde de "el ritmo ya cubre lo
  // necesario" — cuando octubre llevaba $119.000 vendidos y le faltaban $245,8 millones.
  //
  // Estas series salen SOLO del mes en curso, sin importar qué período muestre el filtro de arriba.
  const monthDaily=dailySeries(rowsThroughToday(monthRows)),monthCum=cumulativeSeries(monthDaily);
  const monthLastIdx=monthDaily.length-1,monthPrevIdx=monthLastIdx-1;
  const monthActual=monthLastIdx>=0?monthCum[monthLastIdx].actual:0;
  const monthDias=monthDaily.length;

  // Ritmo necesario: cuánto hace falta vender por día, en lo que resta del MES calendario, para
  // alcanzar el objetivo total del mes — (Objetivo Mes - Venta Real) / Días Restantes. Antes se
  // calculaba contra el objetivo prorrateado a la fecha con "30 días" fijo como aproximación; ahora
  // usa la misma base (monthTarget) y el largo real del mes que Cierre Estimado, así las dos
  // tarjetas no pueden dar mensajes contradictorios entre sí.
  const diasEnMes=daysInCalendarMonth(objectiveCutoff());
  const ritmoAt=cutIdx=>{
    if(cutIdx<0||!monthTarget)return null;
    const c=monthCum[cutIdx],transcurridos=cutIdx+1,restantes=Math.max(1,diasEnMes-transcurridos);
    return Math.max(0,monthTarget-c.actual)/restantes;
  };
  const ritmoHoy=ritmoAt(monthLastIdx),ritmoAyer=ritmoAt(monthPrevIdx);
  const ritmoDelta=(ritmoHoy!==null&&ritmoAyer!==null)?ritmoHoy-ritmoAyer:null;
  // La flecha usa invert=true (menos ritmo necesario = mejora), pero el signo +/- del texto tiene
  // que acompañar a ESA flecha ya invertida, no al signo crudo de ritmoDelta — antes podía mostrar
  // "▼ +$X" (flecha de "peor" junto a un signo de "más"), una combinación contradictoria. displaySign
  // es el mismo valor que trendMeta ya usa puertas adentro para decidir la flecha.
  const ritmoDisplaySign=ritmoDelta!==null?-ritmoDelta:null;
  const ritmoTrend=kpiTrendRow(ritmoDelta,ritmoDisplaySign!==null?`${ritmoDisplaySign>=0?'+':''}${money(ritmoDisplaySign)} vs. ritmo de ayer`:'sin cierre de ayer para comparar',true);
  const diasRestantes=Math.max(1,diasEnMes-monthDias);
  const restanteMes=monthTarget?Math.max(0,monthTarget-monthActual):null;
  const ritmoNecesario=restanteMes!==null?restanteMes/diasRestantes:null;

  // Cierre estimado: suma la proyección ponderada propia de cada local + la de e-commerce (ver
  // sumEntityProjections) — antes mezclaba la Venta real/Objetivo de TODOS los locales y
  // e-commerce en una sola bolsa por fecha y sacaba un único ratio sobre ese total, lo que pesaba
  // de más al local/canal con más Objetivo acumulado y no cerraba contra "Todos los locales" +
  // "E-commerce" sumados por separado (hasta 3,2% de diferencia, auditoría 2026-09-06). "Cargado" =
  // Venta real > 0, mismo criterio que usa el SUMPRODUCTO de la planilla de cada local — antes
  // contaba un día como cargado con solo tráfico/visitas sin venta, que la planilla no cuenta para
  // su propia ponderación.
  const proj=sumEntityProjections(monthRows,row=>row.Local||row.Canal);
  const desvioProy=proj?proj.ponderada-monthTarget:null;
  const cierreTrend=proj?kpiTrendRow(desvioProy,`${desvioProy>=0?'+':''}${money(desvioProy)} vs. objetivo del mes`):null;

  // Desvío a la fecha: objetivo prorrateado hasta hoy (a.target), no el objetivo del MES completo
  // (monthTarget) que usan las otras 3 tarjetas — Card 2 responde "¿cómo vengo respecto de lo que
  // se esperaba HOY?", una pregunta distinta a "¿cómo vengo respecto del mes?".
  const ratioHoy=a.target?a.actual/a.target:0,deltaHoy=a.actual-a.target;
  const desvioBadge=kpiTrendRow(deltaHoy,deltaHoy>=0?'Por encima del esperado':'Por debajo del esperado');

  // Card 1 lee el objetivo primero y la venta debajo: la pregunta es "cuánto hay que hacer" y recién
  // después "cuánto llevo". Habla del PERÍODO que se está mirando —igual que el gráfico, Card 2 y el
  // Resumen ejecutivo—, no del mes calendario, que ya tienen Ritmo necesario y Cierre estimado.
  const cumplAyer=(yesterdayCum&&yesterdayCum.ratio!==null)?yesterdayCum.ratio:null;
  const cumplDelta=(a.target&&cumplAyer!==null)?ratioHoy*100-cumplAyer:null;
  const cumplTrend=kpiTrendRow(cumplDelta,cumplDelta!==null?`${cumplDelta>=0?'+':''}${cumplDelta.toFixed(1).replace('.',',')} pts vs. cierre de ayer`:'sin cierre de ayer para comparar');
  const desvioPct=a.target?(ratioHoy-1)*100:null;
  const cumplDetalle=a.target?`Venta real ${money(a.actual)}`:'Sin objetivo cargado para este período';
  const conSigno=v=>`${v>=0?'+':''}${percent(v)}`;
  const pctDesvioHoy=a.target?{valor:conSigno(desvioPct),tono:statusTone(ratioHoy),etiqueta:'desvío contra lo esperado a hoy'}:null;
  const pctCumplHoy=a.target?{valor:percent(ratioHoy*100),tono:statusTone(ratioHoy),etiqueta:'de cumplimiento a la fecha'}:null;
  const pctCierre=proj&&monthTarget?{valor:conSigno(desvioProy/monthTarget*100),tono:statusTone(proj.ponderada/monthTarget),etiqueta:`proyectado contra el objetivo del mes (${new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(monthTarget/1e6)}M)`}:null;

  // Las 4 tarjetas: una sola métrica grande por tarjeta, sin pisarse entre sí — cada una responde
  // una pregunta distinta (venta hoy / desvío a la fecha / ritmo necesario / cierre proyectado).
  // Cierre estimado va PRIMERO (pedido 2026-10-07): es la respuesta a "¿cómo terminamos el mes?",
  // y las otras tres explican el cómo. El resto mantiene su orden.
  $('overviewMetrics').innerHTML=
    kpiCard(`Cierre estimado${localMonth?` · ${localMonth}`:''}`,proj?money(proj.ponderada):'—',proj?`Lineal: ${money(proj.lineal)} · ${proj.diasRestantes} días restantes`:'Sin días cargados todavía','',cierreTrend,null,pctCierre)+
    kpiCard('Objetivo a la fecha',money(a.target),cumplDetalle,'',cumplTrend,null,pctDesvioHoy)+
    // El monto esperado ya lo encabeza Card 1, así que acá no se repite: esta tarjeta aporta la
    // brecha en pesos, que es lo único que no se lee en ninguna otra.
    kpiCard('Desvío a la fecha',`<span class="${a.target?statusTone(ratioHoy):''}">${deltaHoy>=0?'+':''}${money(deltaHoy)}</span>`,a.target?'brecha en pesos contra lo esperado a hoy':'Sin objetivo cargado para este período','',desvioBadge,null,pctCumplHoy)+
    // "/día" más chico: con montos de 8 cifras no entraba y la tarjeta mostraba "$ 11.683.330 …".
    kpiCard('Ritmo necesario',ritmoNecesario!==null?`${money(ritmoNecesario)}<small class="kpi-unidad">/día</small>`:'—',restanteMes!==null?`${diasRestantes} día${diasRestantes===1?'':'s'} restantes para cubrir ${money(restanteMes)}`:`${diasRestantes} día${diasRestantes===1?'':'s'} restantes del mes`,'',ritmoTrend,null);

  // Aislado con try/catch por tarjeta: un error en una de estas (como el ReferenceError de
  // monthRows que colgó Lectura Rápida + las dos de Salud en "Sin datos" hasta que se detectó)
  // ya no debe frenar a sus hermanas — cada una se re-renderiza sola en cada refresh de todos modos.
  const safeRender=(fn,...args)=>{try{fn(...args)}catch(err){console.error(`renderOverview: ${fn.name} falló —`,err)}};
  // Contexto del mes para el módulo "Avance del mes" debajo del gráfico — independiente del rango
  // que esté graficando el chart en sí (que puede ser el semestre completo): esto siempre habla del
  // mes calendario en curso. avgDailyProy sale del mismo cálculo ponderado que ya arma "Cierre
  // estimado" (reversión de ponderada=actual+ritmo*diasRestantes), no un promedio nuevo por su cuenta.
  const monthProgressCtx={monthTarget,diasEnMes,diasTranscurridos:monthDias,avgDailyReal:monthDias?monthActual/monthDias:null,avgDailyProy:proj?(proj.ponderada-proj.actual)/Math.max(1,proj.diasRestantes):null};
  safeRender(renderBars,rows,monthProgressCtx);
  safeRender(renderDailyComparison,daily);
  // "Resumen Ejecutivo" ya no repite Faltante/Ritmo necesario (idénticos a las Cards 2/3 de arriba,
  // ver charla del 2026-08-24) — ahora muestra el único cruce que esta pantalla combinada puede dar
  // y ningún otro panel muestra: Locales vs. Online, prorrateado a la fecha (aLocalCh/aEcomCh).
  safeRender(renderDeviation,aLocalCh,aEcomCh,monthProgressCtx.avgDailyReal,ritmoNecesario);
  safeRender(renderStoreHealth,localRows);
  safeRender(renderTeamHealth);
}
function renderStoreHealth(localRows){const container=$('storeHealth');const groups={};localRows.forEach(row=>{const key=row.Local||'Sin local';if(!groups[key])groups[key]={local:key,actual:0,target:0};groups[key].actual+=num(row,'Venta real');groups[key].target+=num(row,'Objetivo')});const list=Object.values(groups).map(x=>({...x,ratio:x.target?x.actual/x.target:0}));if(!list.length){container.classList.add('empty-state');container.innerHTML='Sin datos';return}container.classList.remove('empty-state');const buckets={ok:0,warn:0,danger:0};list.forEach(x=>buckets[x.ratio>=UMBRAL_VERDE?'ok':x.ratio>=UMBRAL_AMARILLO?'warn':'danger']++);const atRisk=list.filter(x=>x.ratio<UMBRAL_AMARILLO).sort((a,b)=>a.ratio-b.ratio).slice(0,5);container.innerHTML=`<div class="health-summary"><div class="health-chip ok"><strong>${buckets.ok}</strong><span>en objetivo</span></div><div class="health-chip warn"><strong>${buckets.warn}</strong><span>alerta</span></div><div class="health-chip danger"><strong>${buckets.danger}</strong><span>en rojo</span></div></div>${atRisk.length?`<div class="health-list">${atRisk.map(x=>`<div class="health-row"><span class="dot danger"></span><span class="health-name">${escapeHtml(x.local)}</span><span class="health-local">${percent(x.ratio*100)} del objetivo</span><span class="health-ratio negative">${money(x.actual-x.target)}</span></div>`).join('')}</div>`:`<div class="health-empty">${icon('sparkles','health-empty-icon')}Todos los locales en objetivo</div>`}`}
function renderTeamHealth(){const container=$('teamHealth');
  // Fundida por vendedor compartido y por nombre solo: alguien que cubre 2 locales quedaba con DOS
  // entradas de "salud del equipo" (una por local, cada una con la mitad de su venta y objetivo),
  // pudiendo aparecer "en rojo" en las dos aunque su total combinado estuviera bien — bug real,
  // auditoría 2026-09-05.
  const rows=fusionarVendedoresCompartidos(state.tables.VENDEDOR_SEMANAL||[]);
  const latest={};
  rows.forEach(row=>{const key=row.Vendedor,semana=Number(row.Semana)||0;if(!latest[key]||semana>=latest[key].semana)latest[key]={semana,local:row.Local,name:row.Vendedor,actual:num(row,'Venta real'),target:num(row,'Venta obj')}});const list=Object.values(latest).map(x=>({...x,ratio:x.target?x.actual/x.target:0}));if(!list.length){container.classList.add('empty-state');container.innerHTML='Sin datos';return}container.classList.remove('empty-state');const buckets={ok:0,warn:0,danger:0};list.forEach(x=>buckets[x.ratio>=UMBRAL_VERDE?'ok':x.ratio>=UMBRAL_AMARILLO?'warn':'danger']++);const atRisk=list.filter(x=>x.ratio<UMBRAL_AMARILLO).sort((a,b)=>a.ratio-b.ratio).slice(0,5);container.innerHTML=`<div class="health-summary"><div class="health-chip ok"><strong>${buckets.ok}</strong><span>en objetivo</span></div><div class="health-chip warn"><strong>${buckets.warn}</strong><span>alerta</span></div><div class="health-chip danger"><strong>${buckets.danger}</strong><span>en rojo</span></div></div>${atRisk.length?`<div class="health-list">${atRisk.map(x=>`<div class="health-row"><span class="dot danger"></span><span class="health-name">${escapeHtml(x.name)}</span><span class="health-local">${escapeHtml(x.local)}</span><span class="health-ratio negative">${percent(x.ratio*100)}</span></div>`).join('')}</div>`:`<div class="health-empty">${icon('sparkles','health-empty-icon')}Nadie en rojo esta semana</div>`}`}
function renderBars(rows,monthCtx){
  const container=$('salesBars');
  const byDate={};
  rows.forEach(row=>{const date=normalizeDate(row.Fecha);if(!date)return;if(!byDate[date])byDate[date]={target:0,actual:0};byDate[date].target+=num(row,'Objetivo');byDate[date].actual+=num(row,'Venta real')});
  const dates=Object.keys(byDate).sort();
  if(!dates.length){container.classList.add('empty-state');container.innerHTML='Conectá la fuente para ver el ritmo.';return}
  container.classList.remove('empty-state');

  // El eje X arranca siempre en el rango real de fechas con datos cargados (firstDate), nunca en el
  // mes calendario completo ni en el filtro elegido: si solo hay 2 días cargados, esos 2 días no
  // quedan como un garabato perdido en una esquina. El final del eje sí se estira más allá de
  // lastDate cuando hay proyección o semestre anterior que dibujar (ver más abajo) — ahí ya no es
  // "espacio vacío estirado", es contenido real (punteado/comparación) llenando ese tramo.
  const noDateFilter=!$('fromDate').value&&!$('toDate').value;
  const firstDate=dates[0],lastDate=dates[dates.length-1];
  const daySpanLoaded=Math.round((new Date(`${lastDate}T00:00:00`)-new Date(`${firstDate}T00:00:00`))/86400000)+1;
  const monthLen=daysInCalendarMonth(lastDate);
  const partialLoad=noDateFilter&&daySpanLoaded<monthLen;
  const domainStart=firstDate;

  // Proyección: mismo cálculo ponderado que ya se muestra en "Cierre estimado" (weightedDailyRate),
  // solo que acá se lleva a graficar en vez de quedar solo como texto. Corre hasta el "Hasta" del
  // filtro de fecha activo si hay uno elegido, o hasta fin de semestre si no ("Semestre completo").
  const periodEnd=$('toDate').value||semesterBounds(lastDate).end;
  const perDateActual={};dates.forEach(d=>perDateActual[d]=byDate[d].actual);
  const projection=projectToDate(perDateActual,lastDate,periodEnd);

  // Semestre anterior: null hoy (primer semestre trackeado, sin tabla LOCAL_DIARIO_ANTERIOR todavía) —
  // se arma la lógica igual para que la línea aparezca sola apenas exista el primer dato.
  const priorSeries=priorSemesterSeries(domainStart);

  const domainEnd=[lastDate,projection?.endDate,priorSeries?.length?priorSeries[priorSeries.length-1].date:null].filter(Boolean).sort().pop();
  const dayOffset=d=>Math.round((new Date(`${d}T00:00:00`)-new Date(`${domainStart}T00:00:00`))/86400000);
  const domainSpan=Math.max(1,dayOffset(domainEnd));

  let cumActual=0,cumTarget=0;
  const points=dates.map(date=>{cumActual+=byDate[date].actual;cumTarget+=byDate[date].target;return{date,cumActual,cumTarget}});
  const valuesForMax=points.map(p=>Math.max(p.cumActual,p.cumTarget));
  if(projection)valuesForMax.push(projection.endValue,projection.endValueLineal);
  if(priorSeries)valuesForMax.push(...priorSeries.map(p=>p.cumActual));
  const maxVal=Math.max(...valuesForMax,1);
  const w=760,h=190;
  const x=date=>(dayOffset(date)/domainSpan)*w;
  const y=v=>h-(v/maxVal)*(h-6)-3;
  const path=key=>points.map((p,i)=>`${i===0?'M':'L'}${x(p.date).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const area=`${path('cumActual')} L${x(points[points.length-1].date).toFixed(1)},${h} L${x(points[0].date).toFixed(1)},${h} Z`;
  const last=points[points.length-1];
  const projectionPath=projection?`M${x(lastDate).toFixed(1)},${y(last.cumActual).toFixed(1)} L${x(projection.endDate).toFixed(1)},${y(projection.endValue).toFixed(1)}`:'';
  // Banda de confianza: no es un margen estadístico inventado — es el triángulo entre "hoy" y los
  // DOS escenarios que ya calcula projectToDate (ritmo ponderado a los últimos días vs. ritmo lineal
  // simple). El trazo punteado visible (projectionPath) sigue siendo solo el ponderado; la banda es
  // el fondo translúcido que muestra cuánto se abre el rango entre ambos supuestos hacia fin de período.
  const bandPath=projection?`M${x(lastDate).toFixed(1)},${y(last.cumActual).toFixed(1)} L${x(projection.endDate).toFixed(1)},${y(projection.endValue).toFixed(1)} L${x(projection.endDate).toFixed(1)},${y(projection.endValueLineal).toFixed(1)} Z`:'';
  const priorPath=priorSeries?.length?priorSeries.map((p,i)=>`${i===0?'M':'L'}${x(p.date).toFixed(1)},${y(p.cumActual).toFixed(1)}`).join(' '):'';
  const note=partialLoad?`<div class="chart-note">Mostrando datos disponibles (${dates.length} día${dates.length===1?'':'s'}) — el semestre completo se irá completando a medida que se cargue.</div>`:'';
  // Leyenda ABAJO del gráfico (no flotando encima de las líneas): con 4-5 items y labels largos como
  // "Proyección (FCDP)"/"Banda de confianza" quedaba pisando el trazado en la esquina superior
  // derecha. chart-legend-bottom la saca del position:absolute compartido con el resto de los charts
  // del dashboard (esos siguen arriba, tienen 2-3 items cortos y no tienen este problema) y la pone
  // en flujo normal después del eje, con wrap habilitado por si el panel se angosta.
  const legend=`<div class="chart-legend chart-legend-bottom"><span><i class="legend-swatch" style="background:#52657d"></i>Ritmo objetivo</span><span><i class="legend-swatch" style="background:#F97316"></i>Ventas reales</span>${projection?`<span><i class="legend-swatch legend-swatch-dashed"></i>Proyección (FCDP)</span>`:''}${bandPath?`<span><i class="legend-swatch" style="background:rgba(249,115,22,.25)"></i>Banda de confianza</span>`:''}${priorPath?`<span><i class="legend-swatch" style="background:var(--muted)"></i>Historial</span>`:''}</div>`;
  // Puntos visibles en Objetivo/Real: con 1-2 días cargados el tramo real puede quedar apenas unos
  // píxeles de ancho junto a una proyección de meses — sin estos "nodos" esa línea corta se ve
  // directamente invisible al lado de la proyección. Con 1 solo día, el path ni siquiera dibuja
  // trazo (un solo "M" no pinta nada) — el nodo es lo único que lo hace visible en ese caso.
  const nodesFor=(key,cls)=>points.map(p=>`<circle class="line-node ${cls}" cx="${x(p.date).toFixed(1)}" cy="${y(p[key]).toFixed(1)}" r="3"></circle>`).join('');
  // Elementos de hover (guía + un punto por serie), ocultos hasta que el mouse pase por el gráfico.
  const hoverDots=[['target','line-node-target'],['actual','line-node-actual'],projection?['projection','line-node-actual']:null,priorPath?['prior','line-node-prior']:null].filter(Boolean)
    .map(([key,cls])=>`<circle class="hover-dot hover-dot-${key} ${cls}" r="4" style="display:none"></circle>`).join('');
  // Línea "HOY": ancla en el último día con datos cargados — mismo criterio que ya usa el resto del
  // dashboard para "hoy" (objectiveCutoff/rowsThroughToday), no una fecha de calendario aparte. El
  // anchor del texto cambia cerca de los bordes para que la etiqueta no quede cortada: con solo 1-2
  // días cargados, "hoy" cae a pocos px del arranque del eje.
  const hoyX=x(lastDate);
  const hoyAnchor=hoyX<40?'start':hoyX>w-40?'end':'middle';
  const hoyLabelX=hoyAnchor==='start'?hoyX+4:hoyAnchor==='end'?hoyX-4:hoyX;
  // "Avance del mes": franja al pie del mismo panel, independiente del rango que esté graficando el
  // chart (que puede ser el semestre completo) — siempre habla del mes calendario en curso.
  const monthProgress=monthCtx&&monthCtx.diasEnMes?(()=>{
    const{diasEnMes,diasTranscurridos,avgDailyReal,avgDailyProy}=monthCtx;
    const pct=Math.max(0,Math.min(100,Math.round(diasTranscurridos/diasEnMes*100)));
    const diasRestantesMes=Math.max(0,diasEnMes-diasTranscurridos);
    return`<div class="month-progress"><div class="month-progress-head"><span class="section-kicker">AVANCE DEL MES</span><span class="month-progress-stat">${diasTranscurridos} / ${diasEnMes} días · ${pct}%</span></div><div class="month-progress-track"><div class="month-progress-fill" style="width:${pct}%"></div></div><div class="month-progress-foot"><span>Quedan ${diasRestantesMes} día${diasRestantesMes===1?'':'s'}</span><span>${avgDailyReal!==null?money(avgDailyReal):'—'}/día real · ${avgDailyProy!==null?money(avgDailyProy):'—'}/día proy.</span></div></div>`;
  })():'';
  container.innerHTML=`<svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGlowMain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF6B00" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#FF6B00" stop-opacity="0"></stop></linearGradient></defs>${bandPath?`<path class="line-band" d="${bandPath}"></path>`:''}<path class="line-area" d="${area}" style="fill:url(#areaGlowMain)"></path>${priorPath?`<path class="line-prior" d="${priorPath}"></path>`:''}<path class="line-target" d="${path('cumTarget')}"></path>${projectionPath?`<path class="line-projection" d="${projectionPath}"></path>`:''}<path class="line-actual" d="${path('cumActual')}"></path>${nodesFor('cumTarget','line-node-target')}${nodesFor('cumActual','line-node-actual')}<circle class="line-dot" cx="${x(last.date).toFixed(1)}" cy="${y(last.cumActual).toFixed(1)}" r="4"><title>${money(last.cumActual)} al ${formatDateAR(last.date)}</title></circle><line class="hoy-line" x1="${hoyX.toFixed(1)}" y1="0" x2="${hoyX.toFixed(1)}" y2="${h}"></line><text class="hoy-label" x="${hoyLabelX.toFixed(1)}" y="10" text-anchor="${hoyAnchor}">HOY</text><line class="hover-line" x1="0" y1="0" x2="0" y2="${h}" style="display:none"></line>${hoverDots}</svg><div class="chart-tooltip" hidden></div><div class="line-axis"><span>${formatDateShortAR(domainStart)}</span><span>${money(last.cumActual)} vs ${money(last.cumTarget)}</span><span>${formatDateShortAR(domainEnd)}</span></div>${legend}${note}${monthProgress}`;
  attachChartHover(container,{w,domainStart,domainSpan,x,y,points,lastDate,last,projection,priorSeries});
}
// Tooltip al pasar el mouse (o el dedo) sobre el gráfico: convierte la posición X en una fecha del
// período mostrado y arma una fila por serie con su valor en ese punto — así se entiende de un
// vistazo qué es cada línea sin tener que adivinar por el color solo.
function valueAtStep(pointsArr,key,dateStr){
  if(!pointsArr||!pointsArr.length||dateStr<pointsArr[0].date)return null;
  let result=null;
  for(const p of pointsArr){if(p.date>dateStr)break;result=p[key]}
  return result;
}
function addDaysToDate(dateStr,days){const d=new Date(`${dateStr}T00:00:00`);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)}
function attachChartHover(container,cfg){
  const svgEl=container.querySelector('.line-chart'),tooltipEl=container.querySelector('.chart-tooltip'),guide=container.querySelector('.hover-line');
  const dotTarget=container.querySelector('.hover-dot-target'),dotActual=container.querySelector('.hover-dot-actual'),dotProjection=container.querySelector('.hover-dot-projection'),dotPrior=container.querySelector('.hover-dot-prior');
  if(!svgEl||!tooltipEl)return;
  const projectionValueAt=dateStr=>{
    if(!cfg.projection||dateStr<cfg.lastDate)return null;
    if(dateStr>=cfg.projection.endDate)return cfg.projection.endValue;
    const totalDays=cfg.x(cfg.projection.endDate)-cfg.x(cfg.lastDate);
    const elapsed=cfg.x(dateStr)-cfg.x(cfg.lastDate);
    return cfg.last.cumActual+(cfg.projection.endValue-cfg.last.cumActual)*(totalDays?elapsed/totalDays:1);
  };
  const hide=()=>{tooltipEl.hidden=true;guide.style.display='none';[dotTarget,dotActual,dotProjection,dotPrior].forEach(d=>{if(d)d.style.display='none'})};
  const move=evt=>{
    const rect=svgEl.getBoundingClientRect(),point=evt.touches?evt.touches[0]:evt;
    const clientX=point.clientX-rect.left;
    if(clientX<0||clientX>rect.width||!rect.width)return hide();
    const svgX=clientX/rect.width*cfg.w;
    const offsetDays=Math.max(0,Math.min(cfg.domainSpan,Math.round(svgX/cfg.w*cfg.domainSpan)));
    const hoverDate=addDaysToDate(cfg.domainStart,offsetDays);
    const px=cfg.x(hoverDate);
    guide.setAttribute('x1',px.toFixed(1));guide.setAttribute('x2',px.toFixed(1));guide.style.display='block';
    const rows=[];
    const place=(dot,value,label,color)=>{if(value===null||value===undefined){if(dot)dot.style.display='none';return}rows.push({label,color,value});if(dot){dot.setAttribute('cx',px.toFixed(1));dot.setAttribute('cy',cfg.y(value).toFixed(1));dot.style.display='block'}};
    place(dotTarget,hoverDate<=cfg.lastDate?valueAtStep(cfg.points,'cumTarget',hoverDate):null,'Ritmo objetivo','#52657d');
    place(dotActual,hoverDate<=cfg.lastDate?valueAtStep(cfg.points,'cumActual',hoverDate):null,'Ventas reales','#F97316');
    place(dotProjection,cfg.projection?projectionValueAt(hoverDate):null,'Proyección (FCDP)','#F97316');
    const priorInRange=cfg.priorSeries?.length&&hoverDate<=cfg.priorSeries[cfg.priorSeries.length-1].date;
    place(dotPrior,priorInRange?valueAtStep(cfg.priorSeries,'cumActual',hoverDate):null,'Historial','var(--muted)');
    if(!rows.length)return hide();
    tooltipEl.innerHTML=`<div class="chart-tooltip-date">${formatDateAR(hoverDate)}</div>${rows.map(r=>`<div class="chart-tooltip-row"><i style="background:${r.color}"></i><span>${r.label}</span><strong>${money(r.value)}</strong></div>`).join('')}`;
    tooltipEl.hidden=false;
    tooltipEl.style.left=`${Math.min(92,Math.max(8,clientX/rect.width*100))}%`;
  };
  svgEl.addEventListener('mousemove',move);
  svgEl.addEventListener('mouseleave',hide);
  svgEl.addEventListener('touchmove',move,{passive:true});
  svgEl.addEventListener('touchend',hide);
}
// Dibuja un rectángulo con solo las dos esquinas superiores redondeadas (4px) y la base cuadrada
// apoyada en la línea base — el spec de barra del sistema de diseño (nunca las 4 esquinas parejas).
function roundedTopBarPath(x,yTop,width,height,r){
  const rr=Math.min(r,width/2,Math.max(height,0));
  const yBottom=yTop+height;
  if(height<=0)return'';
  if(rr<=0)return`M${x},${yBottom} L${x},${yTop} L${x+width},${yTop} L${x+width},${yBottom} Z`;
  return`M${x},${yBottom} L${x},${yTop+rr} Q${x},${yTop} ${x+rr},${yTop} L${x+width-rr},${yTop} Q${x+width},${yTop} ${x+width},${yTop+rr} L${x+width},${yBottom} Z`;
}
// Barras agrupadas por día: Venta real (verde si iguala/supera el objetivo, rojo si queda debajo) +
// Objetivo del día (gris neutro), lado a lado. `daily` ya viene agregado por fecha sola (dailySeries
// suma TODAS las filas de esa fecha sin separar por Local) — con "Todos los locales" no hay riesgo
// de barras duplicadas por sucursal, ya está resuelto río arriba, no hace falta tocar nada acá.
function renderDailyComparison(daily){
  const container=$('dailyComparisonChart');
  if(!daily.length){container.classList.add('empty-state');container.innerHTML='Conectá la fuente para ver el detalle diario.';return}
  container.classList.remove('empty-state');
  const w=760,h=190,baseline=h-4;
  const maxVal=Math.max(...daily.map(d=>Math.max(d.actual,d.target)),1);
  const n=daily.length,band=w/n;
  // Equivalente sin Chart.js a categoryPercentage/barPercentage: el grupo del día ocupa el 70% de
  // su banda (deja 30% de aire ÚNICAMENTE entre días distintos, "barCategoryGap: 30%") y cada barra
  // ocupa el 90% de su mitad del grupo (Real y Objetivo casi pegados dentro del mismo día, "barGap"
  // mínimo — antes con .6 quedaban con más aire del que pedía la comparativa). Tope de 20px
  // ("maxBarThickness: 20") evita que con pocos días cargados las barras se vean desmedidas.
  const categoryPercentage=.7,barPercentage=.9;
  const groupWidth=band*categoryPercentage,slot=groupWidth/2;
  const barWidth=Math.min(20,slot*barPercentage);
  const y=v=>baseline-(v/maxVal)*(h-10);
  const groupCenter=i=>band*i+band/2;
  const groupLeft=i=>groupCenter(i)-groupWidth/2;
  const xActual=i=>groupLeft(i)+(slot-barWidth)/2;
  const xTarget=i=>groupLeft(i)+slot+(slot-barWidth)/2;
  const statusOf=d=>!d.target?'none':statusTone(d.actual/d.target);

  const bars=daily.map((d,i)=>{
    const status=statusOf(d);
    const actualCls=status==='good'?'daily-bar-good':status==='warning'?'daily-bar-warn':status==='bad'?'daily-bar-bad':'daily-bar-none';
    const actualTop=y(d.actual),actualH=Math.max(0,baseline-actualTop);
    const targetTop=y(d.target),targetH=Math.max(0,baseline-targetTop);
    const actualPath=d.actual>0?`<path class="daily-bar daily-bar-actual ${actualCls}" data-day="${i}" d="${roundedTopBarPath(xActual(i),actualTop,barWidth,actualH,4)}"><title>${formatDateAR(d.date)} · Venta real: ${money(d.actual)}</title></path>`:'';
    const targetPath=d.target>0?`<path class="daily-bar daily-bar-target" data-day="${i}" d="${roundedTopBarPath(xTarget(i),targetTop,barWidth,targetH,4)}"><title>${formatDateAR(d.date)} · Objetivo: ${money(d.target)}</title></path>`:'';
    return actualPath+targetPath;
  }).join('');

  const legend=`<div class="chart-legend"><span><i class="legend-swatch" style="background:var(--mint)"></i>Día en objetivo</span><span><i class="legend-swatch" style="background:var(--amber)"></i>85% a 99%</span><span><i class="legend-swatch" style="background:var(--red)"></i>Menos de 85%</span><span><i class="legend-swatch" style="background:var(--muted)"></i>Objetivo del día</span></div>`;
  const first=daily[0],last=daily[daily.length-1];
  container.innerHTML=`${legend}<svg class="daily-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg><div class="chart-tooltip" hidden></div><div class="line-axis"><span>${formatDateShortAR(first.date)}</span><span>${daily.length} día${daily.length===1?'':'s'} cargado${daily.length===1?'':'s'}</span><span>${formatDateShortAR(last.date)}</span></div>`;
  attachDailyHover(container,daily,groupCenter);
}
// Hover sobre CUALQUIER punto del grupo del día (no solo encima de una barra puntual): resalta las
// dos barras de ese día juntas y arma la tarjeta con Fecha/Venta real/Objetivo/Desvío.
function attachDailyHover(container,daily,groupCenter){
  const svgEl=container.querySelector('.daily-chart'),tooltipEl=container.querySelector('.chart-tooltip');
  if(!svgEl||!tooltipEl)return;
  let hoveredIdx=-1;
  const setHighlight=idx=>{
    if(hoveredIdx===idx)return;
    svgEl.querySelectorAll('.daily-bar-hover').forEach(el=>el.classList.remove('daily-bar-hover'));
    if(idx!==-1)svgEl.querySelectorAll(`[data-day="${idx}"]`).forEach(el=>el.classList.add('daily-bar-hover'));
    hoveredIdx=idx;
  };
  const hide=()=>{tooltipEl.hidden=true;setHighlight(-1)};
  const move=evt=>{
    const rect=svgEl.getBoundingClientRect(),point=evt.touches?evt.touches[0]:evt;
    const clientX=point.clientX-rect.left;
    if(clientX<0||clientX>rect.width||!rect.width)return hide();
    const svgX=clientX/rect.width*760;
    let idx=0,best=Infinity;
    daily.forEach((d,i)=>{const dist=Math.abs(groupCenter(i)-svgX);if(dist<best){best=dist;idx=i}});
    setHighlight(idx);
    const d=daily[idx],delta=d.actual-d.target,deltaPct=d.target?delta/d.target*100:null,realColor=!d.target?'var(--muted)':{good:'var(--mint)',warning:'var(--amber)',bad:'var(--red)'}[statusTone(d.actual/d.target)];
    tooltipEl.innerHTML=`<div class="chart-tooltip-date">${formatDateAR(d.date)}</div><div class="chart-tooltip-row"><i style="background:${realColor}"></i><span>Venta real</span><strong>${money(d.actual)}</strong></div><div class="chart-tooltip-row"><i style="background:var(--muted)"></i><span>Objetivo del día</span><strong>${d.target?money(d.target):'sin cargar'}</strong></div>${d.target?`<div class="chart-tooltip-row"><i style="background:${delta>=0?'var(--mint)':'var(--red)'}"></i><span>Desvío</span><strong>${delta>=0?'+':''}${money(delta)} (${deltaPct>=0?'+':''}${percent(deltaPct)})</strong></div>`:''}`;
    tooltipEl.hidden=false;
    tooltipEl.style.left=`${Math.min(92,Math.max(8,clientX/rect.width*100))}%`;
  };
  svgEl.addEventListener('mousemove',move);
  svgEl.addEventListener('mouseleave',hide);
  svgEl.addEventListener('touchmove',move,{passive:true});
  svgEl.addEventListener('touchend',hide);
}
// Barras agrupadas por mes: Real (coral) vs. Objetivo esperado (acero) — mismo par de color que el
// resto del dashboard usa para "real vs. objetivo" en todos lados, no uno nuevo.
function renderSeasonTrend(perMonth){
  const container=$('seasonTrendChart');
  if(!perMonth.length){container.classList.add('empty-state');container.innerHTML='Sin datos';return}
  container.classList.remove('empty-state');
  const w=760,h=190,baseline=h-4;
  const maxVal=Math.max(...perMonth.map(m=>Math.max(m.actual,m.target)),1);
  const n=perMonth.length,bandWidth=w/n,gap=3;
  const barWidth=Math.min(26,(bandWidth-gap-16)/2);
  const y=v=>baseline-(v/maxVal)*(h-10);
  const xPair=i=>{const cx=bandWidth*i+bandWidth/2;return{xActual:cx-gap/2-barWidth,xTarget:cx+gap/2,cx}};

  const bars=perMonth.map((m,i)=>{
    const{xActual,xTarget}=xPair(i);
    const actualTop=y(m.actual),actualH=Math.max(0,baseline-actualTop);
    const targetTop=y(m.target),targetH=Math.max(0,baseline-targetTop);
    return`<path class="season-bar season-bar-actual" d="${roundedTopBarPath(xActual,actualTop,barWidth,actualH,4)}"><title>${m.mes} · Venta real: ${money(m.actual)}</title></path><path class="season-bar season-bar-target" d="${roundedTopBarPath(xTarget,targetTop,barWidth,targetH,4)}"><title>${m.mes} · Objetivo: ${money(m.target)}</title></path>`;
  }).join('');

  const legend=`<div class="chart-legend"><span><i class="legend-swatch" style="background:var(--coral)"></i>Venta real</span><span><i class="legend-swatch" style="background:#52657d"></i>Objetivo esperado</span></div>`;
  const axis=`<div class="season-chart-axis">${perMonth.map((m,i)=>`<span style="left:${(xPair(i).cx/w*100).toFixed(2)}%">${escapeHtml(m.mes)}</span>`).join('')}</div>`;
  container.innerHTML=`${legend}<svg class="season-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}<line class="hover-line" x1="0" y1="0" x2="0" y2="${h}" style="display:none"></line></svg>${axis}<div class="chart-tooltip" hidden></div>`;
  attachSeasonHover(container,perMonth,xPair,y);
}
function attachSeasonHover(container,perMonth,xPair,y){
  const svgEl=container.querySelector('.season-chart'),tooltipEl=container.querySelector('.chart-tooltip'),guide=container.querySelector('.hover-line');
  if(!svgEl||!tooltipEl)return;
  const hide=()=>{tooltipEl.hidden=true;guide.style.display='none'};
  const move=evt=>{
    const rect=svgEl.getBoundingClientRect(),point=evt.touches?evt.touches[0]:evt;
    const clientX=point.clientX-rect.left;
    if(clientX<0||clientX>rect.width||!rect.width)return hide();
    const svgX=clientX/rect.width*760;
    let idx=0,best=Infinity;
    perMonth.forEach((m,i)=>{const dist=Math.abs(xPair(i).cx-svgX);if(dist<best){best=dist;idx=i}});
    const m=perMonth[idx],px=xPair(idx).cx,delta=m.actual-m.target;
    guide.setAttribute('x1',px.toFixed(1));guide.setAttribute('x2',px.toFixed(1));guide.style.display='block';
    tooltipEl.innerHTML=`<div class="chart-tooltip-date">${escapeHtml(m.mes)}</div><div class="chart-tooltip-row"><i style="background:var(--coral)"></i><span>Venta real</span><strong>${money(m.actual)}</strong></div><div class="chart-tooltip-row"><i style="background:#52657d"></i><span>Objetivo</span><strong>${money(m.target)}</strong></div><div class="chart-tooltip-row"><i style="background:${delta>=0?'var(--mint)':'var(--red)'}"></i><span>Desvío</span><strong>${delta>=0?'+':''}${money(delta)}</strong></div>`;
    tooltipEl.hidden=false;
    tooltipEl.style.left=`${Math.min(92,Math.max(8,clientX/rect.width*100))}%`;
  };
  svgEl.addEventListener('mousemove',move);
  svgEl.addEventListener('mouseleave',hide);
  svgEl.addEventListener('touchmove',move,{passive:true});
  svgEl.addEventListener('touchend',hide);
}
// Pondera cada día cargado según su antigüedad (el más reciente pesa más) para estimar el ritmo
// diario — usado SOLO por la línea de proyección del gráfico de Resumen General (projectToDate),
// que corre más allá del mes calendario (fin de semestre, o el "Hasta" elegido arriba) y no tiene
// equivalente en las planillas de cada local (esas proyectan nada más que el mes en curso). También
// es el fallback de projectMonth() cuando no se le pasa objetivo diario para ponderar.
function weightedDailyRate(perDateActual){
  const dates=Object.keys(perDateActual).sort();
  let weightSum=0,weightedActual=0,actual=0;
  dates.forEach((d,i)=>{const w=i+1;weightSum+=w;weightedActual+=perDateActual[d]*w;actual+=perDateActual[d]});
  return{dates,actual,ritmoPonderado:weightSum?weightedActual/weightSum:0,ritmoLineal:dates.length?actual/dates.length:0};
}
// "Proyección de Cierre"/"Cierre estimado": réplica exacta de la fórmula "Proyección Ponderada" de
// las planillas de cada local (verificada contra la planilla real de Rivadavia, auditoría
// 2026-09-06: con los mismos datos dio $20.194.930 contra los $20.122.489 de la planilla — 0,4% de
// diferencia, redondeo de datos en vivo entre una lectura y otra). La planilla NO pondera por
// antigüedad del día — pondera por el patrón real de día-de-semana + semana-del-mes de ese local, ya
// codificado en el Objetivo diario que carga el equipo (Objetivo del día = objetivo del mes × % de
// esa semana × % de ese día de semana, ver fórmula de la celda C13 en la planilla). Si lo vendido
// hasta ahora representa X% del objetivo esperado para esos mismos días, se asume que el resto del
// mes rinde igual al mismo ritmo: ventaAcumulada × objetivoDelMes ÷ objetivoAcumuladoDeLosDíasConVenta.
// perDateTarget/monthTarget son opcionales: sin ellos (o sin objetivo cargado esos días) cae al
// viejo ritmo por antigüedad de weightedDailyRate — así projectToDate() (que no tiene objetivo diario
// "de planilla" con el que comparar, corre a fechas arbitrarias) sigue funcionando sin cambios.
function projectMonth(perDateActual,diasEnMes,perDateTarget,monthTarget){
  const{dates,actual,ritmoPonderado,ritmoLineal}=weightedDailyRate(perDateActual);
  if(!dates.length)return null;
  const diasRestantes=Math.max(0,diasEnMes-dates.length);
  const lineal=actual+ritmoLineal*diasRestantes;
  let ponderada=actual+ritmoPonderado*diasRestantes;
  if(perDateTarget&&monthTarget){
    const objAcum=dates.reduce((sum,d)=>sum+(perDateTarget[d]||0),0);
    if(objAcum)ponderada=actual*monthTarget/objAcum;
  }
  return{dias:dates.length,diasRestantes,actual,ponderada,lineal};
}
// Mismo cálculo que projectMonth (ritmo ponderado a los últimos días cargados), pero proyectado hasta
// una fecha de fin arbitraria en vez de "fin del mes calendario". La usa la línea de proyección del
// gráfico, que corre hasta el fin del período activo (fin de semestre, o el "Hasta" del filtro).
function projectToDate(perDateActual,lastDate,endDate){
  const{dates,actual,ritmoPonderado,ritmoLineal}=weightedDailyRate(perDateActual);
  if(!dates.length||!endDate||endDate<=lastDate)return null;
  const diasRestantes=Math.round((new Date(`${endDate}T00:00:00`)-new Date(`${lastDate}T00:00:00`))/86400000);
  // endValueLineal (ritmo simple, sin ponderar días recientes) sirve de segundo escenario junto al
  // ponderado — la banda de confianza del gráfico se dibuja entre estos dos puntos, no un margen
  // estadístico inventado: son dos proyecciones reales con supuestos distintos.
  return{lastDate,endDate,endValue:actual+ritmoPonderado*diasRestantes,endValueLineal:actual+ritmoLineal*diasRestantes};
}
// Serie de venta acumulada del semestre anterior, alineada por "día N del semestre" (no por fecha
// calendario) contra el semestre actual, para que las dos curvas se puedan comparar en el mismo eje.
// Depende de una tabla LOCAL_DIARIO_ANTERIOR que el consolidador todavía no manda (este es el primer
// semestre trackeado) — mientras no exista o esté vacía, devuelve null y la línea simplemente no se
// dibuja. El día que el equipo cargue la planilla del semestre anterior y el endpoint la incluya,
// esto empieza a devolver datos solo, sin tocar este código ni el del gráfico.
function priorSemesterSeries(thisSemesterStartRef){
  const raw=state.tables.LOCAL_DIARIO_ANTERIOR;
  if(!raw||!raw.length)return null;
  const byDate={};
  raw.forEach(row=>{const date=normalizeDate(row.Fecha);if(!date)return;byDate[date]=(byDate[date]||0)+num(row,'Venta real')});
  const dates=Object.keys(byDate).sort();
  if(!dates.length)return null;
  const priorStart=new Date(`${semesterBounds(dates[0]).start}T00:00:00`);
  const thisStart=new Date(`${semesterBounds(thisSemesterStartRef).start}T00:00:00`);
  let cum=0;
  return dates.map(date=>{
    cum+=byDate[date];
    const offsetDays=Math.round((new Date(`${date}T00:00:00`)-priorStart)/86400000);
    const equiv=new Date(thisStart);equiv.setDate(equiv.getDate()+offsetDays);
    return{date:equiv.toISOString().slice(0,10),cumActual:cum};
  });
}
// Datos del MES completo (no prorrateados a la fecha, a diferencia de a.target/a.actual en
// renderOverview que solo suman los días ya transcurridos) — los usan tanto "% Avance del mes"
// como el bloque de Cierre estimado de Lectura Rápida, antes cada uno los recalculaba por su lado
// (y la extracción a este helper se había hecho a medias, dejando `monthRows`/`localMonth` sueltos
// sin declarar en renderDeviation() — ese era el ReferenceError que rompía toda la carga).
// Mes "actual" para todo lo que necesita el objetivo/proyección del MES COMPLETO — el más reciente
// de MONTH_ORDER entre los meses presentes en la tabla, NO el de su primera fila: LOCAL_DIARIO
// acumula todo el semestre (Informe de Temporada la recorre entera), así que [0].Mes se quedaría
// pegado en el primer mes cargado (Septiembre) para siempre. Usado por monthContext() (Resumen
// General) y renderStores() (Proyección de Cierre de Locales) — mismo criterio que ya usa
// renderSeason() para `monthsPresent` (bug real, auditoría 2026-09-05).
// "Presente en la tabla" se filtra primero a filas con datos REALES cargados (Venta real/Tráfico
// real), no a cualquier fila con Mes: ECOM_DIARIO viene con el esqueleto de los 6 meses del
// semestre precargado desde el arranque (Objetivo diario ya calculado por fórmula para Septiembre→
// Febrero aunque todavía no se haya vendido nada), así que sin este filtro el "mes vigente" daba
// Febrero en vez de Septiembre y la Proyección Ponderada de E-commerce quedaba vacía ("Sin días
// cargados todavía este mes", aunque sí había 5 días cargados) — bug real, auditoría 2026-09-06.
// Si ninguna fila tiene datos reales todavía (canal recién armado, nada cargado) cae al set
// completo de meses presentes como antes, para no devolver '' de entrada.
function currentMonthOf(tableName){
  const rows=state.tables[tableName]||[];
  const loadedRows=rows.filter(row=>num(row,'Venta real')||num(row,'Tráfico real'));
  const source=loadedRows.length?loadedRows:rows;
  const monthsPresent=[...new Set(source.map(row=>row.Mes).filter(Boolean))];
  return monthsPresent.sort((a,b)=>MONTH_ORDER.indexOf(a)-MONTH_ORDER.indexOf(b)).pop()||'';
}
function monthContext(){
  const localMonth=currentMonthOf('LOCAL_DIARIO');
  // No usar overviewRows() acá: aplica el filtro de fecha del "Período" de arriba, y este objetivo
  // tiene que ser el del MES COMPLETO sin importar qué rango de fechas esté seleccionado (mismo
  // criterio que ecomRows, una línea abajo) — si no, elegir un solo día encoge el objetivo del mes
  // a ese único día (bug real detectado en conversación del 2026-09-02: "objetivo total" mostraba
  // $14,9M en vez de ~$200M+ al filtrar por 01/09 nada más).
  const localRows=(state.tables.LOCAL_DIARIO||[]).filter(row=>!localMonth||String(row.Mes??'')===localMonth);
  const ecomRows=(state.tables.ECOM_DIARIO||[]).filter(row=>!localMonth||String(row.Mes??'')===localMonth);
  const monthRows=[...localRows,...ecomRows];
  return{localMonth,monthRows,monthTarget:aggregate(monthRows).target};
}
function monthTargetTotal(){return monthContext().monthTarget}
// Resumen ejecutivo: las 4 Cards de arriba (Venta real/Desvío/Ritmo necesario/Cierre estimado) ya
// cubren la lectura "todo junto" del negocio — este panel en cambio es el único lugar del dashboard
// que separa Locales de Online (Locales tab y E-commerce tab solo miran su propio canal), así que
// muestra ESE cruce en vez de repetir Faltante/Ritmo necesario como hacía antes (charla 2026-08-24).
// 4 filas apiladas a todo el ancho (ver CSS #deviationCard/.resumen-row), cada una flex:1 salvo el
// banner final, para llenar la altura completa del panel sin huecos.
function renderDeviation(aLocalCh,aEcomCh,avgDailyReal,ritmoNecesario){
  // Montos cortos con coma decimal ($64,9M): moneyShort usa punto, que en este panel se leía como miles.
  const corto=v=>`$${new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(v/1e6)}M`;
  const channelRow=(label,a)=>{
    const hasTarget=a.target>0,ratio=hasTarget?a.actual/a.target:0;
    const tone=hasTarget?statusTone(ratio):'';
    const detalle=hasTarget?`${percent(ratio*100)} de su objetivo (${corto(a.target)})`:'Sin objetivo cargado';
    return `<div class="resumen-row"><div class="resumen-row-head"><span class="section-kicker">${label}</span></div><div class="deviation-number ${tone}">${money(a.actual)}</div><div class="deviation-copy">${detalle}</div></div>`;
  };
  const rowLocales=channelRow('LOCALES',aLocalCh);
  const rowOnline=channelRow('ONLINE',aEcomCh);

  // Peso del online: cuánto representa su venta sobre la de los locales. Reemplaza a "Canal a empujar"
  // (pedido 2026-10-07), que decía con palabras lo que las dos filas de arriba ya muestran en colores.
  // Al lado, cuánto pesaba en el OBJETIVO (objetivo online ÷ objetivo locales): el % de arriba se lee
  // contra eso, y el color sale del semáforo general comparando los dos (0,7% contra 2,5% planeado
  // es un 28% de lo esperado → rojo).
  const peso=aLocalCh.actual>0?aEcomCh.actual/aLocalCh.actual:null;
  const pesoPlan=aLocalCh.target>0&&aEcomCh.target>0?aEcomCh.target/aLocalCh.target:null;
  const tonoPeso=peso!==null&&pesoPlan?statusTone(peso/pesoPlan):'';
  const rowPeso=`<div class="resumen-row"><div class="resumen-row-head"><span class="section-kicker">PESO DEL ONLINE</span>${pesoPlan?`<span class="resumen-share">planeado: ${percent(pesoPlan*100)}</span>`:''}</div><div class="deviation-number ${tonoPeso}">${peso!==null?percent(peso*100):'—'}</div><div class="deviation-copy">${peso!==null?'de la venta de los locales':'sin venta de locales en el período'}</div></div>`;

  const aceleracion=(avgDailyReal!==null&&ritmoNecesario!==null)?ritmoNecesario-avgDailyReal:null;
  const bannerTone=aceleracion===null?'':aceleracion>0?'bad':'good';
  const bannerText=aceleracion===null
    ?'Todavía no hay datos suficientes para comparar el ritmo.'
    :aceleracion>0
      ?`Aceleración requerida: +${money(aceleracion)} /día`
      :`Ritmo actual ya cubre lo necesario (${money(Math.abs(aceleracion))}/día de margen)`;
  const rowBanner=`<div class="resumen-row resumen-row-banner ${bannerTone}"><span class="resumen-banner-text">${bannerText}</span></div>`;

  $('deviationCard').innerHTML=rowLocales+rowOnline+rowPeso+rowBanner;
}
function renderStores(){const rows=rowsThroughToday(activeRows('LOCAL_DIARIO')),a=aggregate(rows),ratio=a.target?a.actual/a.target:0;
  // Ponderados sobre todo el período, no promedio de los valores diarios (ver sumarPonderado).
  const pondLocal=cerrarPonderado(rows.reduce((acc,row)=>sumarPonderado(acc,num(row,'Venta real'),num(row,'Ticket prom.'),num(row,'PxT real'),num(row,'Tráfico real')),nuevoPonderado()));
  const avgConv=pondLocal.conversion,avgTicket=pondLocal.ticket;
  // Efectivo/Tarjeta/Descuento/objetivos son valores mensuales repetidos en cada día del mes: se
  // promedian, no se suman. Se divide por la cantidad de días donde cada campo realmente vino
  // cargado (no por monthly.count = todos los días del período) — si esa columna se agregó a mitad
  // de mes o falta en algún día, dividir por el total diluía el % por debajo del valor real
  // (bug real, auditoría 2026-09-05).
  const monthly=rows.reduce((acc,row)=>{
    const cash=num(row,'Efectivo'),card=num(row,'Tarjeta'),discount=num(row,'Descuento'),convObj=convRate(row,'Conversión obj'),ticketObj=num(row,'Ticket obj');
    if(cash){acc.cash+=cash;acc.cashCount++}
    if(card){acc.card+=card;acc.cardCount++}
    if(discount){acc.discount+=discount;acc.discountCount++}
    if(convObj){acc.convObj+=convObj;acc.convObjCount++}
    if(ticketObj){acc.ticketObj+=ticketObj;acc.ticketObjCount++}
    acc.count++;
    return acc;
  },{cash:0,cashCount:0,card:0,cardCount:0,discount:0,discountCount:0,convObj:0,convObjCount:0,ticketObj:0,ticketObjCount:0,count:0});
  const hasPayment=monthly.count>0&&(monthly.cash||monthly.card||monthly.discount);
  const avgCash=monthly.cashCount?monthly.cash/monthly.cashCount:0,avgCard=monthly.cardCount?monthly.card/monthly.cardCount:0,avgDiscount=monthly.discountCount?monthly.discount/monthly.discountCount:0;
  const avgConvObj=monthly.convObjCount?monthly.convObj/monthly.convObjCount:0,avgTicketObj=monthly.ticketObjCount?monthly.ticketObj/monthly.ticketObjCount:0;
  const hasConvObj=avgConvObj>0,hasTicketObj=avgTicketObj>0;
  const brechaConv=avgConv-avgConvObj;

  // allMonthRows tiene que ser TODO el mes vigente, sin importar qué rango de fechas esté elegido
  // en "Período" arriba — mismo criterio que monthContext() en Resumen General. Antes reusaba
  // activeRows('LOCAL_DIARIO'), que SÍ respeta el filtro de fecha: filtrando por ej. "01/09 al
  // 05/09" el objetivo del mes usado por "Proyección de Cierre" se encogía a esos 5 días en vez de
  // sumar el mes completo, mientras la proyección de venta seguía extrapolando correctamente a los
  // 30 días — comparaba un cierre proyectado a TODO el mes contra un objetivo de solo 5 días, un
  // desvío inflado sin sentido (bug real, auditoría 2026-09-06). El filtro de Vendedor no aplica
  // acá: está oculto en esta vista (ver switchView), así que no hace falta replicar la
  // redistribución por vendedor que sí hace activeRows().
  const local=$('localFilter').value,currentMonth=currentMonthOf('LOCAL_DIARIO');
  const allMonthRows=(state.tables.LOCAL_DIARIO||[]).filter(row=>(local==='all'||String(row.Local??'')===local)&&(!currentMonth||String(row.Mes??'')===currentMonth));
  const monthTarget=aggregate(allMonthRows).target;
  // Agrupado por Local (aunque el filtro esté en un solo local, ahí da 1 solo grupo y el mismo
  // resultado de antes): con "Todos los locales" seleccionado, suma la proyección propia de cada
  // local en vez de mezclar la Venta real/Objetivo de los 13 en una sola bolsa (ver
  // sumEntityProjections, auditoría 2026-09-06).
  const projection=sumEntityProjections(allMonthRows,row=>row.Local);
  const daily=storeDailySeries(rows);
  const kpiCtx={a,ratio,avgConv,avgConvObj,hasConvObj,brechaConv,avgTicket,avgTicketObj,hasTicketObj,avgCash,avgCard,avgDiscount,hasPayment,monthTarget,projection};
  renderStoreKpiGrid(kpiCtx,daily);
  renderStoreChart(daily,kpiCtx);

  renderTrafficFunnel('storeFunnel',rows.length>0,a.traffic,avgConv);
  renderDiagnosisPanel('storeDiagnosis',avgConv,avgConvObj,hasConvObj,avgTicket,avgTicketObj,hasTicketObj);
  renderStoreFocus(rows);
  renderStoreBreakdown(rows);
  // __deltaPct queda en null cuando la fila no tiene objetivo cargado: dividir por cero daría
  // Infinity y un día sin objetivo no tiene desvío porcentual que mostrar (sale como "—").
  const columns=[['Fecha','Fecha'],['Local','Local'],['Día','Día'],['Objetivo','Objetivo'],['Venta real','Venta real'],['Desvío','__delta'],['Desvío %','__deltaPct'],['Tráfico','Tráfico real'],['Conversión','Conversión'],['Ticket','Ticket prom.']];renderTable('storeTable',rows,columns,row=>{const obj=num(row,'Objetivo'),delta=num(row,'Venta real')-obj;return{...row,__delta:delta,__deltaPct:obj?delta/obj*100:null}},4);$('storeRowsCount').textContent=`${rows.length} días`}

// ── Cabecera de "Locales": 6 tarjetas selectoras + gráfico dinámico ──────────
// Proyección de cierre de UNA sola entidad (un local, o un canal) — monthRows tiene que venir ya
// filtrado a esa entidad. "Cargado" = Venta real > 0 (no "hay tráfico pero sin venta cargada" como
// antes): mismo criterio exacto que usa el SUMPRODUCTO de la planilla de cada local, para que el
// día a día que entra en la ponderación sea idéntico al de la planilla (auditoría 2026-09-06).
function storeProjection(monthRows){
  const perDate={};
  monthRows.forEach(row=>{
    const date=normalizeDate(row.Fecha);
    if(!date)return;
    if(!perDate[date])perDate[date]={actual:0,target:0};
    perDate[date].actual+=num(row,'Venta real');
    perDate[date].target+=num(row,'Objetivo');
  });
  const loadedActual={},loadedTarget={};
  let monthTarget=0;
  Object.keys(perDate).forEach(d=>{
    monthTarget+=perDate[d].target;
    if(perDate[d].actual>0){loadedActual[d]=perDate[d].actual;loadedTarget[d]=perDate[d].target}
  });
  const dates=Object.keys(loadedActual);
  if(!dates.length)return null;
  return projectMonth(loadedActual,daysInCalendarMonth(dates.sort().pop()),loadedTarget,monthTarget);
}
// Suma la proyección de VARIAS entidades (cada local, o Locales+E-commerce) para un total agregado
// — a diferencia de tirar la Venta real/Objetivo de todas las entidades juntas en una sola bolsa y
// recién ahí sacar un único ratio ponderado (lo que hacían antes tanto "Todos los locales" como el
// "Cierre estimado" combinado de Resumen General, pasándole storeProjection() directo a un
// monthRows con varios locales/canales adentro). Mezclar primero pesa de más a la entidad con más
// Objetivo acumulado o más días cargados en vez de respetar la trayectoria propia de cada una, así
// que "Todos los locales" no cerraba contra la suma de la proyección de cada local en su propia
// pestaña, ni el Cierre Estimado de arriba contra "Locales + E-commerce" por separado — hasta 3,2%
// de diferencia detectados en auditoría 2026-09-06. groupKey identifica la entidad de cada fila
// (row.Local para locales, row.Canal para e-commerce); cada grupo corre storeProjection() —la MISMA
// fórmula ya verificada contra la planilla real— por separado y se suman los $ resultantes.
// dias/diasRestantes no se suman entre entidades (no tiene sentido "15 días restantes" x 13
// locales): se muestran una sola vez, calculados sobre el pool completo sin agrupar, mismo criterio
// de "días cargados" que ya usan Ritmo necesario/Avance del mes en Resumen General.
function sumEntityProjections(monthRows,groupKey){
  const groups={};
  monthRows.forEach(row=>{const key=groupKey(row)||'—';(groups[key]=groups[key]||[]).push(row)});
  const entries=Object.values(groups).map(storeProjection).filter(Boolean);
  if(!entries.length)return null;
  const overall=storeProjection(monthRows);
  return{
    dias:overall?overall.dias:entries[0].dias,
    diasRestantes:overall?overall.diasRestantes:entries[0].diasRestantes,
    actual:entries.reduce((sum,p)=>sum+p.actual,0),
    ponderada:entries.reduce((sum,p)=>sum+p.ponderada,0),
    lineal:entries.reduce((sum,p)=>sum+p.lineal,0)
  };
}
function storeDailySeries(rows){
  const byDate={};
  rows.forEach(row=>{
    const date=normalizeDate(row.Fecha);
    if(!date)return;
    if(!byDate[date])byDate[date]={actual:0,target:0,traffic:0,trafficTarget:0,trafficTargetConDato:0,esperados:0,conTrafico:0,conVenta:0,conConversion:0,convPorTrafico:0,traficoConConversion:0,pond:nuevoPonderado(),cash:0,card:0,discount:0,payCount:0};
    const d=byDate[date];
    const venta=num(row,'Venta real'),objetivo=num(row,'Objetivo'),trafico=num(row,'Tráfico real'),traficoObj=num(row,'Tráfico nec.')||num(row,'Tráfico obj');
    d.actual+=venta;
    d.target+=objetivo;
    d.traffic+=trafico;
    d.trafficTarget+=traficoObj;
    // Cuántos locales se esperaban ese día (los que tienen objetivo) y cuántos cargaron cada dato.
    // Con eso los gráficos distinguen un día cerrado, uno sin cargar y uno a medio cargar de una
    // caída real — ver estadoDelDia(). Van por separado porque el tráfico se carga aparte de la
    // venta: el 30/09 Rivadavia y Villa del Parque cargaron una y no el otro.
    // La conversión de cada día es la que CARGÓ el local, tal cual (pedido 2026-10-01). Hasta acá se
    // calculaba como venta ÷ ticket ÷ tráfico, y cuando esos tres datos no cerraban entre sí el
    // gráfico contradecía a la planilla: Rivadavia 17/09 salía 105% con 63% cargado, por un ticket
    // promedio mal tipeado. Si un dato está mal se ve en la auditoría de carga, no tapado ni
    // corregido por una cuenta del dashboard.
    // Con varios locales el día combina sus conversiones cargadas pesadas por su tráfico; con uno
    // solo da exactamente lo cargado. conConversion = locales que cargaron conversión Y tráfico.
    const conv=convRate(row,'Conversión');
    if(conv>0&&trafico>0){d.convPorTrafico+=conv*trafico;d.traficoConConversion+=trafico}
    if(objetivo>0){d.esperados++;if(trafico>0)d.conTrafico++;if(venta>0)d.conVenta++;if(conv>0&&trafico>0)d.conConversion++}
    // El objetivo de tráfico SOLO de los locales que cargaron tráfico: comparar la gente que vino
    // contra lo que se necesitaba en un local que no informó cuenta su faltante de carga como si
    // hubiera ido menos gente.
    if(trafico>0)d.trafficTargetConDato+=traficoObj;
    sumarPonderado(d.pond,num(row,'Venta real'),num(row,'Ticket prom.'),num(row,'PxT real'),trafico);
    d.cash+=num(row,'Efectivo');d.card+=num(row,'Tarjeta');d.discount+=num(row,'Descuento');d.payCount++;
  });
  return Object.keys(byDate).sort().map(date=>{
    const d=byDate[date];
    return{
      date,actual:d.actual,target:d.target,traffic:d.traffic,trafficTarget:d.trafficTarget,
      trafficTargetConDato:d.trafficTargetConDato,esperados:d.esperados,conTrafico:d.conTrafico,conVenta:d.conVenta,conConversion:d.conConversion,
      // Tickets del día y la venta que los respalda (la de filas con ticket válido, ver
      // sumarPonderado): sumados sobre el período reproducen exactamente la conversión y el ticket
      // ponderados de las tarjetas 03 y 04.
      ticketsConv:d.pond.ticketsConv,traficoConv:d.pond.traficoConv,
      tickets:cerrarPonderado(d.pond).tickets,ventaConTicket:cerrarPonderado(d.pond).ticket*cerrarPonderado(d.pond).tickets,
      // La cargada (ver arriba), en % 0-100.
      conversion:d.traficoConConversion?d.convPorTrafico/d.traficoConConversion*100:null,
      // El ticket ya sale del cargado: venta ÷ (venta ÷ ticket) es el ticket mismo para un local, y
      // con varios es su promedio pesado por cantidad de tickets.
      ticket:cerrarPonderado(d.pond).ticket||null,
      cash:d.payCount?d.cash/d.payCount:0,card:d.payCount?d.card/d.payCount:0,discount:d.payCount?d.discount/d.payCount:0
    };
  });
}
const STORE_KPI_META={
  venta:{kicker:'VENTA VS. OBJETIVO',heading:'Venta real vs. objetivo, por día'},
  proyeccion:{kicker:'PROYECCIÓN DE CIERRE',heading:'Curva proyectada vs. meta mensual'},
  conversion:{kicker:'CONVERSIÓN %',heading:'Conversión diaria'},
  ticket:{kicker:'TICKET PROMEDIO $',heading:'Ticket promedio diario'},
  trafico:{kicker:'TRÁFICO',heading:'Flujo diario de personas'},
  pagos:{kicker:'MEDIOS DE PAGO',heading:'Desglose financiero'}
};
// Mini gráfico dentro de la propia tarjeta: la tendencia se ve sin tener que clickear para abrir el
// gráfico grande. Sale de la MISMA serie diaria que alimenta ese gráfico (storeDailySeries), así que
// no hay forma de que digan cosas distintas.
//
// No lleva color propio: pinta con currentColor y lo decide el CSS (apagado en reposo, naranja en la
// tarjeta activa). Hardcodear un color por métrica obligaría a repetir los seis en el tema claro,
// que es justo donde ya se habían vuelto ilegibles el índice y el label de la tarjeta activa.
//
// preserveAspectRatio="none" estira el viewBox a lo ancho de la tarjeta; la línea lleva
// vector-effect="non-scaling-stroke" para no engordar con ese estirón. Por eso tampoco hay punto
// final: un círculo en un SVG estirado sale ovalado.
function sparklineSvg(valores){
  const pts=valores.filter(v=>v!==null&&v!==undefined&&!Number.isNaN(v)&&Number.isFinite(v));
  if(pts.length<2)return'';
  const w=100,h=28,min=Math.min(...pts),max=Math.max(...pts),span=(max-min)||1;
  // Métrica que no se movió en todo el período: la línea va al medio. Con la fórmula de abajo
  // quedaría apoyada contra el piso del recuadro, que se lee como "cayó a cero" y no como "plana".
  const plana=max===min;
  const x=i=>i/(pts.length-1)*w,y=v=>plana?h/2:h-2-((v-min)/span)*(h-5);
  const linea=pts.map((v,i)=>`${i?'L':'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">`+
    `<path class="spark-area" d="${linea} L${w} ${h} L0 ${h} Z"></path>`+
    `<path class="spark-line" d="${linea}"></path></svg>`;
}
// "Medios de pago" no es una serie en el tiempo sino un reparto, así que en vez de una curva va una
// barra apilada: de un vistazo se ve cuánto pesa el efectivo contra la tarjeta.
function sparkStackSvg(partes){
  const total=partes.reduce((s,p)=>s+Math.max(0,p.valor),0);
  if(!total)return'';
  let x=0;
  const segmentos=partes.map(p=>{
    const ancho=Math.max(0,p.valor)/total*100;
    const rect=`<rect class="${p.cls}" x="${x.toFixed(2)}" y="9" width="${ancho.toFixed(2)}" height="10"></rect>`;
    x+=ancho;return rect;
  }).join('');
  return `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">${segmentos}</svg>`;
}
function renderStoreKpiGrid(ctx,daily){
  const{a,ratio,avgConv,hasConvObj,brechaConv,avgTicket,avgTicketObj,hasTicketObj,avgCash,avgCard,avgDiscount,hasPayment,monthTarget,projection}=ctx;
  qa('#storeKpiGrid .store-kpi-card').forEach(btn=>btn.classList.toggle('active',btn.dataset.storeMetric===state.storeMetric));

  // La proyección no tiene serie propia: lo que se grafica es la venta ACUMULADA, que es la curva
  // que después se extiende hasta el cierre del mes en el gráfico grande.
  const serie=daily||[];
  let acum=0;
  const acumulado=serie.map(d=>(acum+=d.actual));
  const spark=(metrica,html)=>{const el=$(`storeKpiSpark-${metrica}`);if(el)el.innerHTML=html||''};
  spark('venta',sparklineSvg(serie.map(d=>d.actual)));
  spark('proyeccion',sparklineSvg(acumulado));
  spark('conversion',sparklineSvg(serie.map(d=>d.conversion)));
  spark('ticket',sparklineSvg(serie.map(d=>d.ticket)));
  spark('trafico',sparklineSvg(serie.map(d=>d.traffic)));
  spark('pagos',hasPayment?sparkStackSvg([{valor:avgCash,cls:'spark-seg-a'},{valor:avgCard,cls:'spark-seg-b'}]):'');

  $('storeKpiValue-venta').textContent=money(a.actual);
  // "X% del objetivo a la fecha" (no "X% de avance del mes"): esto compara contra lo esperado A LA
  // FECHA (prorrateado a los días ya transcurridos/filtrados), no contra el objetivo del MES
  // completo — son dos preguntas distintas ("¿voy al ritmo esperado hoy?" vs "¿cuánto del mes ya
  // cerré?"). La planilla de cada local usa esa segunda definición para su "Avance del mes" — el
  // texto viejo ("X% de avance") se prestaba a confundir los dos (auditoría 2026-09-06).
  $('storeKpiSub-venta').textContent=`${percent(ratio*100)} del objetivo a la fecha`;

  if(projection){
    const desvio=projection.ponderada-monthTarget,desvioPct=monthTarget?desvio/monthTarget*100:null;
    $('storeKpiValue-proyeccion').textContent=money(projection.ponderada);
    $('storeKpiSub-proyeccion').textContent=`${desvio>=0?'+':''}${money(desvio)}${desvioPct!==null?` (${desvioPct>=0?'+':''}${percent(desvioPct)})`:''} vs. objetivo del mes`;
  }else{
    $('storeKpiValue-proyeccion').textContent='—';
    $('storeKpiSub-proyeccion').textContent='Sin días cargados todavía';
  }

  $('storeKpiValue-conversion').textContent=percent(avgConv*100);
  // brechaConv es una resta de dos tasas, así que son PUNTOS: decía "+10,8% vs. objetivo", que se
  // lee como un 10,8% relativo. El módulo de abajo dice "pts" y tienen que decir lo mismo.
  $('storeKpiSub-conversion').textContent=hasConvObj?`${brechaConv>=0?'+':''}${(brechaConv*100).toFixed(1).replace('.',',')} pts vs. objetivo`:'promedio del período';

  $('storeKpiValue-ticket').textContent=money(avgTicket);
  $('storeKpiSub-ticket').textContent=hasTicketObj?`objetivo ${money(avgTicketObj)}`:'venta promedio por compra';

  $('storeKpiValue-trafico').textContent=number(a.traffic);
  // Contra el objetivo SOLO de los locales que cargaron tráfico, igual que la tarjeta "Vs. objetivo"
  // del módulo de abajo. Antes dividía por el objetivo de TODOS (a.targetTraffic): un local que no
  // informó tráfico sumaba su objetivo y nada de gente, y el cumplimiento bajaba por un faltante de
  // carga. Las dos tarjetas tienen que decir el mismo número.
  const objTrafConDato=serie.reduce((s,d)=>s+(d.trafficTargetConDato||0),0);
  $('storeKpiSub-trafico').textContent=objTrafConDato?`${percent(a.traffic/objTrafConDato*100)} del objetivo`:'personas registradas';

  $('storeKpiValue-pagos').textContent=hasPayment?percent(avgCash*100):'—';
  $('storeKpiSub-pagos').textContent=hasPayment?`Efvo. · Tarjeta ${percent(avgCard*100)} · Desc. ${percent(avgDiscount*100)}`:'Agregar columna en el Sheet';
}
// ── Panel de detalle de Locales: módulos de análisis ─────────────────────────────
// Cada métrica del panel de abajo pasa a ser una franja de tarjetas con las cifras del período más
// un gráfico con escala, fechas repartidas y los días raros marcados, en vez de una línea sola sobre
// fondo oscuro (pedido 2026-10-01). Arranca por Tráfico como plantilla; las otras métricas siguen
// con su gráfico anterior hasta pasarlas a este mismo formato.

const DIA_CORTO=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const diaCortoDe=fecha=>DIA_CORTO[new Date(`${fecha}T00:00:00`).getDay()];

// Un día puede venir vacío o bajo por tres motivos, y ninguno es una caída real del indicador:
//   cerrado   — ningún local tenía objetivo: no se esperaba vender (feriado, o domingo si el filtro
//               es un local de calle). Es la misma regla del recordatorio de cierre de las 20:00.
//   sinCargar — había locales con objetivo y ninguno cargó el dato (típicamente: hoy).
//   parcial   — cargaron algunos y otros no. El 30/09 Rivadavia y Villa del Parque vendieron sin
//               cargar tráfico: la barra de ese día sale baja por un faltante, no por menos gente.
// `cargados` es cuántos locales con objetivo tienen el dato de ESTA métrica, y `valor` el dato en
// sí: un día sin objetivo pero con datos (un local abierto fuera de plan) cuenta como normal.
//
// Límite conocido: si una planilla no cargó el objetivo de un día que sí trabajó, ese local cuenta
// como cerrado. Con los datos que llegan no hay forma de distinguirlo — el 01/10 seis locales
// tienen objetivo $0 en un jueves común.
function estadoDelDia(d,cargados,valor){
  if(!d.esperados)return valor>0?'ok':'cerrado';
  if(!cargados)return'sinCargar';
  if(cargados<d.esperados)return'parcial';
  return'ok';
}

// Cortes "redondos" para el eje Y (0, 100, 200… en vez de 0, 96, 192). El tope deja aire sobre el
// máximo para que el rótulo del pico no choque contra el borde de arriba.
function escalaRedonda(maximo,cortes=4){
  if(!(maximo>0))return{ticks:[0,1],tope:1};
  const crudo=maximo/cortes,mag=Math.pow(10,Math.floor(Math.log10(crudo))),norm=crudo/mag;
  const paso=(norm<=1?1:norm<=2?2:norm<=2.5?2.5:norm<=5?5:10)*mag;
  const tope=Math.ceil(maximo*1.12/paso)*paso;
  const ticks=[];
  for(let v=0;v<=tope+paso/2;v+=paso)ticks.push(Math.round(v*1e6)/1e6);
  return{ticks,tope};
}

// Franja de tarjetas + cuerpo (el gráfico) + pie (leyenda y qué días están marcados).
function moduloAnalisisHtml(stats,cuerpo,pie){
  const tarjetas=stats.map(s=>`<div class="cm-stat"><span class="cm-stat-label">${s.label}</span><strong class="cm-stat-value${s.tone?` ${s.tone}`:''}">${s.value}</strong><span class="cm-stat-sub">${s.sub||''}</span></div>`).join('');
  return`<div class="cm"><div class="cm-stats">${tarjetas}</div>${cuerpo}${pie?`<div class="cm-foot">${pie}</div>`:''}</div>`;
}

// Barras diarias con escala, el objetivo de cada día como una marca sobre su barra, el promedio
// punteado, el pico / el mínimo / el último día rotulados y los días raros señalados.
//
// El SVG se estira a lo ancho (preserveAspectRatio="none", coordenadas en milésimas) y TODO el texto
// va en HTML encima, posicionado en %: queda nítido y del mismo tamaño en cualquier pantalla sin
// medir nada ni redibujar al cambiar el ancho de la ventana (el dashboard no tiene listener de
// resize). Por eso en el SVG no hay círculos ni texto, que saldrían deformados, y las líneas llevan
// vector-effect="non-scaling-stroke".
//
// `datos` llega como [{d,v,obj,estado}]: quién llama sabe qué es cada número y arma las tarjetas.
function barrasDiariasHtml({datos,fmt,fmtEje,promedio,etiquetaProm}){
  const n=datos.length;
  const maximo=Math.max(1,...datos.map(x=>Math.max(x.v,x.estado==='cerrado'?0:x.obj)));
  const{ticks,tope}=escalaRedonda(maximo);
  const Y=v=>1000-(v/tope)*1000;
  const banda=1000/n,ancho=Math.min(banda*.62,48);
  const X=i=>i*banda+(banda-ancho)/2,centro=i=>(i+.5)*banda;
  const posX=i=>(centro(i)/10).toFixed(2),posY=v=>(Y(v)/10).toFixed(2);   // milésimas del SVG → %

  const barras=datos.map((x,i)=>{
    if(x.estado==='cerrado')return'';
    // Lo que falta cargar va como silueta punteada hasta el objetivo del día: se lee "acá había que
    // llegar y no hay dato", no "acá vino cero".
    if(x.estado==='sinCargar')return x.obj?`<rect class="cm-bar-fantasma" data-i="${i}" x="${X(i).toFixed(1)}" y="${Y(x.obj).toFixed(1)}" width="${ancho.toFixed(1)}" height="${(1000-Y(x.obj)).toFixed(1)}"></rect>`:'';
    return`<rect class="cm-bar${x.estado==='parcial'?' cm-bar-parcial':''}" data-i="${i}" x="${X(i).toFixed(1)}" y="${Y(x.v).toFixed(1)}" width="${ancho.toFixed(1)}" height="${(1000-Y(x.v)).toFixed(1)}"></rect>`;
  }).join('');
  const marcasObj=datos.map((x,i)=>(x.obj>0&&(x.estado==='ok'||x.estado==='parcial'))?`<line class="cm-obj" x1="${(X(i)-banda*.08).toFixed(1)}" x2="${(X(i)+ancho+banda*.08).toFixed(1)}" y1="${Y(x.obj).toFixed(1)}" y2="${Y(x.obj).toFixed(1)}"></line>`:'').join('');

  const rotulos=rotulosDelModulo(datos);
  const{ejeY,ejeX}=ejesHtml(ticks,fmtEje,datos,posX,posY);
  const promTxt=promedio>0?`<div class="cm-prom-label" style="top:${posY(promedio)}%">${etiquetaProm}</div>`:'';
  return`<div class="cm-chart"><div class="cm-yaxis">${ejeY}</div><div class="cm-plot"><svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">${grillaSvg(ticks,Y)}${promedio>0?lineaHorizontalSvg('cm-prom',Y(promedio)):''}${barras}${marcasObj}</svg>${promTxt}${marcasDiaHtml(datos,rotulos,posX,posY)}${calloutsHtml(rotulos,fmt,posX,posY)}<div class="chart-tooltip cm-tooltip" hidden></div></div><div class="cm-xaxis">${ejeX}</div></div>`;
}

// Línea diaria para los indicadores que son una TASA (conversión, ticket): sumar días no tiene
// sentido, así que en vez de barras va una línea. Mismas piezas que las barras —escala, fechas,
// rótulos, días raros—, con tres diferencias:
//   · La línea une solo días completos y se corta en los demás. Un día parcial queda como anillo
//     suelto, porque su valor está sesgado (la conversión del 30/09 cuenta tickets de locales que
//     no cargaron su gente y gente de uno que no cargó sus ventas), y uno cerrado o sin cargar deja
//     el hueco.
//   · Dos referencias horizontales: el objetivo (blanco punteado, rótulo a la derecha) y el valor
//     del período (gris, rótulo a la izquierda). Son los dos números de las tarjetas, así que
//     "venimos arriba / abajo del objetivo" sale del gráfico sin hacer cuentas.
//   · Sin puntos permanentes en cada día: solo los rotulados, los parciales y los días sueltos; el
//     del día bajo el cursor aparece al pasar. Son HTML porque un círculo en el SVG estirado sale
//     ovalado.
// Devuelve {html,posY}: posY lo usa el tooltip para ubicar el punto del día bajo el cursor.
function lineaDiariaHtml({datos,fmt,fmtEje,objetivo,etiquetaObj,referencia,etiquetaRef,color,gradId}){
  const n=datos.length;
  const visibles=datos.filter(x=>x.v>0&&(x.estado==='ok'||x.estado==='parcial')).map(x=>x.v);
  const{ticks,tope}=escalaRedonda(Math.max(1,...visibles,objetivo||0,referencia||0));
  const Y=v=>1000-(v/tope)*1000,banda=1000/n,centro=i=>(i+.5)*banda;
  const posX=i=>(centro(i)/10).toFixed(2),posY=v=>(Y(v)/10).toFixed(2);

  const tramos=[];let tramo=[];
  datos.forEach((x,i)=>{if(x.estado==='ok'&&x.v>0)tramo.push(i);else if(tramo.length){tramos.push(tramo);tramo=[]}});
  if(tramo.length)tramos.push(tramo);
  const trazo=t=>t.map((i,k)=>`${k?'L':'M'}${centro(i).toFixed(1)} ${Y(datos[i].v).toFixed(1)}`).join(' ');
  const largos=tramos.filter(t=>t.length>1);
  const areas=largos.map(t=>`<path class="cm-area" fill="url(#${gradId})" d="${trazo(t)} L${centro(t[t.length-1]).toFixed(1)} 1000 L${centro(t[0]).toFixed(1)} 1000 Z"></path>`).join('');
  const lineas=largos.map(t=>`<path class="cm-linea" d="${trazo(t)}"></path>`).join('');

  const rotulos=rotulosDelModulo(datos);
  const conPunto=new Set([
    ...Object.keys(rotulos).map(Number),
    ...tramos.filter(t=>t.length===1).map(t=>t[0]),
    ...datos.map((x,i)=>x.estado==='parcial'&&x.v>0?i:-1).filter(i=>i>=0)
  ]);
  const puntos=[...conPunto].map(i=>`<div class="cm-punto${datos[i].estado==='parcial'?' cm-punto-parcial':''}" style="left:${posX(i)}%;top:${posY(datos[i].v)}%"></div>`).join('');

  const refs=(objetivo>0?lineaHorizontalSvg('cm-obj-linea',Y(objetivo)):'')+(referencia>0?lineaHorizontalSvg('cm-prom',Y(referencia)):'');
  const refsTxt=(objetivo>0?`<div class="cm-ref-label cm-ref-der" style="top:${posY(objetivo)}%">${etiquetaObj}</div>`:'')+
    (referencia>0?`<div class="cm-ref-label cm-ref-izq" style="top:${posY(referencia)}%">${etiquetaRef}</div>`:'');
  const{ejeY,ejeX}=ejesHtml(ticks,fmtEje,datos,posX,posY);
  const defs=`<defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="currentColor" stop-opacity=".28"></stop><stop offset="100%" stop-color="currentColor" stop-opacity="0"></stop></linearGradient></defs>`;
  const html=`<div class="cm-chart"><div class="cm-yaxis">${ejeY}</div><div class="cm-plot" style="color:${color}"><svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">${defs}${grillaSvg(ticks,Y)}${refs}${areas}${lineas}</svg>${refsTxt}${marcasDiaHtml(datos,rotulos,posX,posY)}<div class="cm-guia" hidden></div>${puntos}<div class="cm-punto cm-punto-hover" hidden></div>${calloutsHtml(rotulos,fmt,posX,posY)}<div class="chart-tooltip cm-tooltip" hidden></div></div><div class="cm-xaxis">${ejeX}</div></div>`;
  return{html,posY:x=>(x.v>0&&(x.estado==='ok'||x.estado==='parcial'))?`${posY(x.v)}%`:null};
}

// ── Piezas que comparten las barras y las líneas ──
// Trabajan sobre `datos` = [{d,v,obj,estado}] y dos funciones que devuelven la posición en %:
// posX por índice de día y posY por valor.

// Pico y mínimo entre los días completos, más el último día con dato. Si dos caen en el mismo día
// se dicen juntos en un solo rótulo, y si ese día es parcial el rótulo lo avisa en vez de poner
// una segunda etiqueta encima del mismo punto.
function rotulosDelModulo(datos){
  const conIndice=datos.map((x,i)=>({...x,i}));
  const completos=conIndice.filter(x=>x.estado==='ok'&&x.v>0);
  const rotulos={};
  const rotular=(x,motivo)=>{if(x)(rotulos[x.i]=rotulos[x.i]||{x,motivos:[]}).motivos.push(motivo)};
  if(completos.length){
    rotular(completos.reduce((a,b)=>b.v>a.v?b:a),'pico');
    if(completos.length>2)rotular(completos.reduce((a,b)=>b.v<a.v?b:a),'mín.');
  }
  const conDato=conIndice.filter(x=>x.v>0);
  if(conDato.length)rotular(conDato[conDato.length-1],'último');
  Object.values(rotulos).forEach(r=>{if(r.x.estado==='parcial')r.motivos.push('parcial')});
  return rotulos;
}
function calloutsHtml(rotulos,fmt,posX,posY){
  return Object.values(rotulos).map(({x,motivos})=>{
    const cls=motivos.includes('pico')?' cm-callout-pico':motivos.includes('mín.')?' cm-callout-min':'';
    return`<div class="cm-callout${cls}" style="left:${posX(x.i)}%;top:${posY(x.v)}%"><span>${motivos.join(' · ')}</span>${fmt(x.v)}</div>`;
  }).join('');
}
// Días raros: rótulo vertical dentro del hueco del día (cerrado / sin cargar) o arriba del dato
// (parcial). Vertical porque con un mes entero cada día tiene ~40px de ancho y "Sin cargar" en
// horizontal pisaría a los vecinos — el 30/09 parcial y el 01/10 sin cargar son contiguos.
function marcasDiaHtml(datos,rotulos,posX,posY){
  return datos.map((x,i)=>{
    if(x.estado==='cerrado')return`<div class="cm-dia-raro" style="left:${posX(i)}%">Cerrado</div>`;
    if(x.estado==='sinCargar')return`<div class="cm-dia-raro" style="left:${posX(i)}%">Sin cargar</div>`;
    if(x.estado==='parcial'&&x.v>0&&!rotulos[i])return`<div class="cm-dia-parcial" style="left:${posX(i)}%;top:${posY(x.v)}%">parcial</div>`;
    return'';
  }).join('');
}
// Eje Y con los cortes de la escala, eje X con ~10 fechas repartidas (siempre la última).
function ejesHtml(ticks,fmtEje,datos,posX,posY){
  const n=datos.length,cada=Math.max(1,Math.ceil(n/10));
  return{
    ejeY:ticks.map(t=>`<span style="top:${posY(t)}%">${fmtEje(t)}</span>`).join(''),
    ejeX:datos.map((x,i)=>(i%cada===0||i===n-1)?`<span style="left:${posX(i)}%">${formatDateShortAR(x.d.date)}</span>`:'').join('')
  };
}
const grillaSvg=(ticks,Y)=>ticks.map(t=>lineaHorizontalSvg('cm-grid',Y(t))).join('');
const lineaHorizontalSvg=(cls,y)=>`<line class="${cls}" x1="0" x2="1000" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;

// Tooltip del módulo: el día bajo el cursor según la posición horizontal — sirve cualquier punto de
// la franja de ese día, no hace falta apuntarle a la barra (un día sin cargar no tiene barra). En
// los gráficos de línea además corre una guía vertical y el punto del día; `posY` dice dónde va el
// punto, o null si ese día no tiene valor que marcar.
function engancharTooltipModulo(container,datos,contenido,posY){
  const plot=container.querySelector('.cm-plot'),tip=container.querySelector('.cm-tooltip');
  if(!plot||!tip)return;
  const guia=plot.querySelector('.cm-guia'),punto=plot.querySelector('.cm-punto-hover');
  const n=datos.length;let actual=-1;
  const marcar=i=>{
    if(i===actual)return;
    plot.querySelectorAll('.cm-hover').forEach(el=>el.classList.remove('cm-hover'));
    if(i>=0)plot.querySelectorAll(`[data-i="${i}"]`).forEach(el=>el.classList.add('cm-hover'));
    actual=i;
  };
  const ocultar=()=>{tip.hidden=true;marcar(-1);if(guia)guia.hidden=true;if(punto)punto.hidden=true};
  const mover=evt=>{
    const r=plot.getBoundingClientRect(),p=evt.touches?evt.touches[0]:evt;
    if(!r.width)return ocultar();
    const xr=(p.clientX-r.left)/r.width;
    if(xr<0||xr>1)return ocultar();
    const i=Math.min(n-1,Math.floor(xr*n));
    marcar(i);
    const izq=`${((i+.5)/n*100).toFixed(2)}%`;
    if(guia){guia.style.left=izq;guia.hidden=false}
    if(punto){const top=posY?posY(datos[i]):null;punto.hidden=top===null;if(top!==null){punto.style.left=izq;punto.style.top=top}}
    tip.innerHTML=contenido(datos[i]);
    tip.hidden=false;
    tip.style.left=`${Math.min(88,Math.max(12,(i+.5)/n*100))}%`;
  };
  plot.addEventListener('mousemove',mover);
  plot.addEventListener('mouseleave',ocultar);
  plot.addEventListener('touchmove',mover,{passive:true});
  plot.addEventListener('touchend',ocultar);
}

// Leyenda + qué días están marcados y por qué. Los días raros se nombran acá con fecha: el gráfico
// los señala, pero la explicación tiene que poder leerse sin pasar el cursor. Cada clave es
// [clase, texto, estilo opcional] — el estilo es para el color de la línea de cada métrica.
function pieModulo(claves,datos,cargadosDe,queCargaron='locales'){
  const leyenda=claves.map(([cls,txt,estilo])=>`<span class="cm-key"><i class="${cls}"${estilo?` style="${estilo}"`:''}></i>${txt}</span>`).join('');
  const raros=datos.filter(x=>x.estado!=='ok').map(x=>{
    const f=formatDateShortAR(x.d.date);
    if(x.estado==='cerrado')return`${f} cerrado`;
    if(x.estado==='sinCargar')return`${f} sin cargar`;
    return`${f} parcial (${cargadosDe(x.d)} de ${x.d.esperados} ${queCargaron})`;
  });
  return leyenda+(raros.length?`<span class="cm-foot-raros">${raros.join(' · ')}</span>`:'');
}
const tipFecha=d=>`<div class="chart-tooltip-date">${diaCortoDe(d.date)} ${formatDateAR(d.date)}</div>`;
const tipFila=(color,txt,val)=>`<div class="chart-tooltip-row">${color?`<i style="background:${color}"></i>`:''}<span>${txt}</span>${val!==undefined?`<strong>${val}</strong>`:''}</div>`;
const fechaCorta=x=>`${diaCortoDe(x.d.date)} ${formatDateShortAR(x.d.date)}`;

// ── 03 · Conversión ──
function renderStoreConversionModule(container,daily,ctx){
  // v en % (0-100), como storeDailySeries.conversion; un día sin tráfico no tiene conversión. El
  // "cargado" es conConversion: el local tiene que haber cargado conversión y tráfico.
  const datos=daily.map(d=>({d,v:d.conversion,obj:0,estado:estadoDelDia(d,d.conConversion,d.traffic)}));
  if(!datos.some(x=>x.v>0)){container.className='empty-state';container.innerHTML='No hay conversión para estos filtros: hace falta venta y tráfico cargados el mismo día.';return}
  const completos=datos.filter(x=>x.estado==='ok'&&x.v>0);

  // Tickets ÷ personas de todo el período: el mismo ponderado de la tarjeta 03 (pondLocal en
  // renderStores), así que los dos números coinciden.
  // Solo locales-día con tickets Y tráfico (ticketsConv/traficoConv), igual que cerrarPonderado.
  const tickets=daily.reduce((s,d)=>s+(d.ticketsConv||0),0),personas=daily.reduce((s,d)=>s+(d.traficoConv||0),0);
  const conv=personas?tickets/personas*100:0;
  const obj=ctx.hasConvObj?ctx.avgConvObj*100:0;
  const brecha=obj?conv-obj:null;
  const mejor=completos.length?completos.reduce((a,b)=>b.v>a.v?b:a):null;
  const peor=completos.length>1?completos.reduce((a,b)=>b.v<a.v?b:a):null;
  // Diferencia en PUNTOS, no en %: de 52% a 63% son 11 puntos, que sería un 21% relativo.
  const pts=v=>`${v>=0?'+':''}${v.toFixed(1).replace('.',',')} pts`;

  const stats=[
    {label:'Conversión del período',value:percent(conv),sub:`${number(Math.round(tickets))} tickets de ${number(personas)} personas`},
    {label:'Vs. objetivo',value:brecha!==null?pts(brecha):'—',tone:brecha===null?'':statusTone(conv/obj),
      sub:obj?`objetivo ${percent(obj)}`:'sin objetivo de conversión cargado'},
    {label:'Mejor día',value:mejor?percent(mejor.v):'—',tone:mejor&&obj?statusTone(mejor.v/obj):'',sub:mejor?fechaCorta(mejor):''},
    {label:'Peor día',value:peor?percent(peor.v):'—',tone:peor&&obj?statusTone(peor.v/obj):'',sub:peor?fechaCorta(peor):''}
  ];
  const g=lineaDiariaHtml({datos,fmt:v=>percent(v),fmtEje:v=>`${number(v)}%`,objetivo:obj,etiquetaObj:`objetivo ${percent(obj)}`,
    referencia:conv,etiquetaRef:`período ${percent(conv)}`,color:'var(--mint)',gradId:'cmGradConversion'});
  const pie=pieModulo([['cm-key-linea','Conversión del día','background:var(--mint)'],['cm-key-objlinea','Objetivo'],['cm-key-prom','Conversión del período']],
    datos,d=>d.conConversion,'locales con conversión y tráfico');
  container.className='';
  container.innerHTML=moduloAnalisisHtml(stats,g.html,pie);
  engancharTooltipModulo(container,datos,x=>{
    if(x.estado==='cerrado')return tipFecha(x.d)+tipFila('','Cerrado — sin objetivo ese día');
    if(x.estado==='sinCargar')return tipFecha(x.d)+tipFila('','Sin venta y tráfico cargados');
    return tipFecha(x.d)+tipFila('var(--mint)','Conversión',percent(x.v))+
      tipFila('','Personas',number(x.d.traffic))+
      (obj?tipFila('','Vs. objetivo',`<span class="${statusTone(x.v/obj)}">${pts(x.v-obj)}</span>`):'')+
      (x.estado==='parcial'?tipFila('',`Parcial: ${x.d.conConversion} de ${x.d.esperados} locales cargaron conversión y tráfico`):'');
  },g.posY);
}

// ── 04 · Ticket promedio ──
function renderStoreTicketModule(container,daily,ctx){
  const datos=daily.map(d=>({d,v:d.ticket,obj:0,estado:estadoDelDia(d,d.conVenta,d.actual)}));
  if(!datos.some(x=>x.v>0)){container.className='empty-state';container.innerHTML='No hay ticket promedio para estos filtros.';return}
  const completos=datos.filter(x=>x.estado==='ok'&&x.v>0);

  // Venta ÷ tickets de todo el período: el mismo ponderado de la tarjeta 04.
  const tickets=daily.reduce((s,d)=>s+(d.tickets||0),0),ventaT=daily.reduce((s,d)=>s+(d.ventaConTicket||0),0);
  const ticket=tickets?ventaT/tickets:0;
  const obj=ctx.hasTicketObj?ctx.avgTicketObj:0;
  const brecha=obj?(ticket/obj-1)*100:null;
  // Tendencia: los últimos N días completos contra los N anteriores, ponderado (venta ÷ tickets de
  // esos días, no el promedio de los tickets diarios). N=7 si alcanza: una semana entera contra
  // otra, así no se compara una tanda con sábados contra una sin. Con menos de 3 días por lado, no
  // se compara.
  const N=Math.min(7,Math.floor(completos.length/2));
  const pond=xs=>{const t=xs.reduce((s,x)=>s+(x.d.tickets||0),0);return t?xs.reduce((s,x)=>s+(x.d.ventaConTicket||0),0)/t:0};
  const reciente=N>=3?pond(completos.slice(-N)):0,anterior=N>=3?pond(completos.slice(-2*N,-N)):0;
  const tendencia=anterior?(reciente/anterior-1)*100:null;
  const mejor=completos.length?completos.reduce((a,b)=>b.v>a.v?b:a):null;
  const peor=completos.length>1?completos.reduce((a,b)=>b.v<a.v?b:a):null;
  const signo=v=>`${v>=0?'+':''}${percent(v)}`;

  const stats=[
    {label:'Ticket promedio',value:money(ticket),sub:`${money(ventaT)} en ${number(Math.round(tickets))} tickets`},
    {label:'Vs. objetivo',value:brecha!==null?signo(brecha):'—',tone:brecha===null?'':statusTone(ticket/obj),
      sub:obj?`objetivo ${money(obj)}`:'sin objetivo de ticket cargado'},
    {label:'Tendencia reciente',value:tendencia!==null?signo(tendencia):'—',tone:tendencia===null?'':tendencia>=0?'good':'bad',
      sub:tendencia!==null?`últimos ${N} días ${money(reciente)} vs. ${money(anterior)}`:'faltan días completos para comparar'},
    {label:'Mejor día',value:mejor?money(mejor.v):'—',
      sub:mejor?`${fechaCorta(mejor)}${peor?` · peor ${money(peor.v)} (${fechaCorta(peor)})`:''}`:''}
  ];
  const g=lineaDiariaHtml({datos,fmt:v=>money(v),fmtEje:v=>moneyShort(v),objetivo:obj,etiquetaObj:`objetivo ${money(obj)}`,
    referencia:ticket,etiquetaRef:`período ${money(ticket)}`,color:'var(--coral)',gradId:'cmGradTicket'});
  const pie=pieModulo([['cm-key-linea','Ticket del día','background:var(--coral)'],['cm-key-objlinea','Objetivo'],['cm-key-prom','Ticket del período']],
    datos,d=>d.conVenta,'locales con venta');
  container.className='';
  container.innerHTML=moduloAnalisisHtml(stats,g.html,pie);
  engancharTooltipModulo(container,datos,x=>{
    if(x.estado==='cerrado')return tipFecha(x.d)+tipFila('','Cerrado — sin objetivo ese día');
    if(x.estado==='sinCargar')return tipFecha(x.d)+tipFila('','Sin venta cargada');
    return tipFecha(x.d)+tipFila('var(--coral)','Ticket',money(x.v))+
      tipFila('','Venta',money(x.d.actual))+
      (obj?tipFila('','Vs. objetivo',`<span class="${statusTone(x.v/obj)}">${signo((x.v/obj-1)*100)}</span>`):'')+
      (x.estado==='parcial'?tipFila('',`Parcial: ${x.d.conVenta} de ${x.d.esperados} locales cargaron venta`):'');
  },g.posY);
}

// ── 05 · Tráfico ──
function renderStoreTrafficModule(container,daily){
  const datos=daily.map(d=>({d,v:d.traffic,obj:d.trafficTarget,estado:estadoDelDia(d,d.conTrafico,d.traffic)}));
  if(!datos.some(x=>x.v>0)){container.className='empty-state';container.innerHTML='No hay tráfico cargado para estos filtros.';return}
  const completos=datos.filter(x=>x.estado==='ok'&&x.v>0);

  const total=datos.reduce((s,x)=>s+x.v,0);
  const diasConDato=datos.filter(x=>x.v>0).length;
  // Promedio y objetivo diario SOLO sobre días completos: un día parcial o sin cargar bajaría el
  // promedio por un faltante de carga, no porque haya venido menos gente.
  const promedio=completos.length?completos.reduce((s,x)=>s+x.v,0)/completos.length:0;
  const conObj=completos.filter(x=>x.obj>0);
  const promObj=conObj.length?conObj.reduce((s,x)=>s+x.obj,0)/conObj.length:0;
  const desvioProm=promObj?(promedio/promObj-1)*100:null;
  const pico=completos.length?completos.reduce((a,b)=>b.v>a.v?b:a):null;
  // Contra el objetivo SOLO de los locales que cargaron tráfico (trafficTargetConDato). Es el mismo
  // número que la tarjeta 05 de arriba, que se calcula igual — ver renderStoreKpiGrid.
  const objConDato=daily.reduce((s,d)=>s+(d.trafficTargetConDato||0),0);
  const cumpl=objConDato?total/objConDato:null;
  const tono=r=>r===null?'':statusTone(r);

  const stats=[
    {label:'Personas en el período',value:number(total),
      sub:`${diasConDato} día${diasConDato===1?'':'s'} con tráfico cargado`},
    {label:'Promedio por día',value:`${number(Math.round(promedio))}<small>pers./día</small>`,
      sub:promObj?`objetivo ${number(Math.round(promObj))}/día · <b class="${statusTone(promedio/promObj)}">${desvioProm>=0?'+':''}${percent(desvioProm)}</b>`:'sin objetivo de tráfico cargado'},
    {label:'Día de mayor tráfico',value:pico?`${number(pico.v)}<small>pers.</small>`:'—',
      sub:pico?`${diaCortoDe(pico.d.date)} ${formatDateShortAR(pico.d.date)}`:''},
    {label:'Vs. objetivo de tráfico',value:cumpl!==null?percent(cumpl*100):'—',tone:tono(cumpl),
      sub:cumpl!==null?`${number(total)} de ${number(Math.round(objConDato))} personas necesarias`:'sin objetivo de tráfico cargado'}
  ];

  const grafico=barrasDiariasHtml({datos,fmt:v=>number(v),fmtEje:v=>number(v),promedio,etiquetaProm:`promedio ${number(Math.round(promedio))}/día`});
  const pie=pieModulo([['cm-key-bar','Personas por día'],['cm-key-obj','Objetivo del día'],['cm-key-prom','Promedio de los días completos']],datos,d=>d.conTrafico);
  container.className='';
  container.innerHTML=moduloAnalisisHtml(stats,grafico,pie);
  engancharTooltipModulo(container,datos,x=>{
    const f=`<div class="chart-tooltip-date">${diaCortoDe(x.d.date)} ${formatDateAR(x.d.date)}</div>`;
    const fila=(color,txt,val)=>`<div class="chart-tooltip-row">${color?`<i style="background:${color}"></i>`:''}<span>${txt}</span>${val!==undefined?`<strong>${val}</strong>`:''}</div>`;
    if(x.estado==='cerrado')return f+fila('','Cerrado — sin objetivo ese día');
    if(x.estado==='sinCargar')return f+fila('','Todavía sin cargar')+(x.obj?fila('var(--white)','Objetivo',`${number(x.obj)} pers.`):'');
    const r=x.obj?x.v/x.obj:null;
    return f+fila('var(--amber)','Personas',number(x.v))+
      (x.obj?fila('var(--white)','Objetivo',number(x.obj))+fila('','Cumplimiento',`<span class="${statusTone(r)}">${percent(r*100)}</span>`):'')+
      (x.estado==='parcial'?fila('',`Parcial: cargaron ${x.d.conTrafico} de ${x.d.esperados} locales`):'');
  });
}

function renderStoreChart(daily,ctx){
  const meta=STORE_KPI_META[state.storeMetric];
  $('storeChartKicker').textContent=meta.kicker;
  $('storeChartHeading').textContent=meta.heading;
  const area=$('storeChartArea');
  if(state.storeMetric==='pagos'){area.className='';renderStorePaymentBreakdown(area,daily,ctx);return}
  if(!daily.length){area.className='bar-chart empty-state';area.innerHTML='Conectá la fuente para ver la evolución.';return}
  area.className='bar-chart';
  if(state.storeMetric==='venta')return renderStoreVentaChart(area,daily);
  if(state.storeMetric==='proyeccion')return renderStoreProjectionChart(area,daily,ctx);
  if(state.storeMetric==='conversion')return renderStoreConversionModule(area,daily,ctx);
  if(state.storeMetric==='ticket')return renderStoreTicketModule(area,daily,ctx);
  if(state.storeMetric==='trafico')return renderStoreTrafficModule(area,daily);
}
// Card 01 — mismo lenguaje visual que "Día a día" del Resumen General (barras agrupadas
// semáforo + roundedTopBarPath), reusado tal cual acá para no duplicar el estilo.
function renderStoreVentaChart(container,daily){
  const w=760,h=190,baseline=h-4;
  const maxVal=Math.max(...daily.map(d=>Math.max(d.actual,d.target)),1);
  const n=daily.length,band=w/n;
  // Mismos valores que "Día a día" del Resumen General (ver ese comentario) — quedaron desfasados
  // en la vuelta anterior porque el replace_all de ese momento no alcanzó a esta segunda copia.
  const categoryPercentage=.7,barPercentage=.9;
  const groupWidth=band*categoryPercentage,slot=groupWidth/2;
  const barWidth=Math.min(20,slot*barPercentage);
  const y=v=>baseline-(v/maxVal)*(h-10);
  const groupCenter=i=>band*i+band/2;
  const groupLeft=i=>groupCenter(i)-groupWidth/2;
  const xActual=i=>groupLeft(i)+(slot-barWidth)/2;
  const xTarget=i=>groupLeft(i)+slot+(slot-barWidth)/2;
  const statusOf=d=>!d.target?'none':statusTone(d.actual/d.target);
  const bars=daily.map((d,i)=>{
    const status=statusOf(d);
    const actualCls=status==='good'?'daily-bar-good':status==='warning'?'daily-bar-warn':status==='bad'?'daily-bar-bad':'daily-bar-none';
    const actualTop=y(d.actual),actualH=Math.max(0,baseline-actualTop);
    const targetTop=y(d.target),targetH=Math.max(0,baseline-targetTop);
    const actualPath=d.actual>0?`<path class="daily-bar daily-bar-actual ${actualCls}" data-day="${i}" d="${roundedTopBarPath(xActual(i),actualTop,barWidth,actualH,4)}"><title>${formatDateAR(d.date)} · Venta real: ${money(d.actual)}</title></path>`:'';
    const targetPath=d.target>0?`<path class="daily-bar daily-bar-target" data-day="${i}" d="${roundedTopBarPath(xTarget(i),targetTop,barWidth,targetH,4)}"><title>${formatDateAR(d.date)} · Objetivo: ${money(d.target)}</title></path>`:'';
    return actualPath+targetPath;
  }).join('');
  const legend=`<div class="chart-legend"><span><i class="legend-swatch" style="background:var(--mint)"></i>Día en objetivo</span><span><i class="legend-swatch" style="background:var(--amber)"></i>85% a 99%</span><span><i class="legend-swatch" style="background:var(--red)"></i>Menos de 85%</span><span><i class="legend-swatch" style="background:var(--muted)"></i>Objetivo del día</span></div>`;
  const first=daily[0],last=daily[daily.length-1];
  container.innerHTML=`${legend}<svg class="daily-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg><div class="chart-tooltip" hidden></div><div class="line-axis"><span>${formatDateShortAR(first.date)}</span><span>${daily.length} día${daily.length===1?'':'s'}</span><span>${formatDateShortAR(last.date)}</span></div>`;
  attachDailyHover(container,daily,groupCenter);
}
// Card 02 — cumulado real + objetivo del mes (línea fija) + proyección punteada hasta fin de mes.
function renderStoreProjectionChart(container,daily,ctx){
  const{monthTarget,projection}=ctx;
  if(!projection||!daily.length){container.classList.add('empty-state');container.innerHTML='Todavía no hay días cargados para proyectar.';return}
  container.classList.remove('empty-state');
  let cum=0;
  const points=daily.map(d=>{cum+=d.actual;return{date:d.date,cum}});
  const firstDate=points[0].date,lastDate=points[points.length-1].date;
  const[y0,m0]=lastDate.split('-');
  const endDate=`${y0}-${m0}-${String(daysInCalendarMonth(lastDate)).padStart(2,'0')}`;
  const w=760,h=190;
  const dayOffset=d=>Math.round((new Date(`${d}T00:00:00`)-new Date(`${firstDate}T00:00:00`))/86400000);
  const domainSpan=Math.max(1,dayOffset(endDate));
  const x=d=>(dayOffset(d)/domainSpan)*w;
  // Techo del eje Y con 15% de aire arriba del objetivo del mes — antes era Math.max(monthTarget,...)
  // a secas, así que cuando el objetivo era el valor más alto (el caso normal, negocio en ritmo) la
  // línea punteada quedaba pegada al borde superior del SVG (targetY≈6px de un h=190). El *1.15 es un
  // PISO, no un techo fijo: si la venta real o la proyección superan igual ese piso (local por encima
  // del objetivo), el eje sigue creciendo para no cortar esas líneas — nunca recorta datos reales.
  const maxVal=Math.max(monthTarget*1.15,projection.ponderada,...points.map(p=>p.cum),1);
  const y=v=>h-(v/maxVal)*(h-10)-4;
  const linePath=points.map((p,i)=>`${i===0?'M':'L'}${x(p.date).toFixed(1)},${y(p.cum).toFixed(1)}`).join(' ');
  const areaPath=`${linePath} L${x(lastDate).toFixed(1)},${h} L${x(firstDate).toFixed(1)},${h} Z`;
  const last=points[points.length-1];
  const projPath=`M${x(lastDate).toFixed(1)},${y(last.cum).toFixed(1)} L${x(endDate).toFixed(1)},${y(projection.ponderada).toFixed(1)}`;
  const targetY=y(monthTarget).toFixed(1);
  const targetLabelY=(y(monthTarget)-5).toFixed(1);
  const desvio=projection.ponderada-monthTarget,desvioPct=monthTarget?desvio/monthTarget*100:null;
  // Leyenda ABAJO del gráfico, no flotando encima (mismo fix ya aplicado en renderBars): con el
  // objetivo ahora más cerca del borde superior recién liberado, una leyenda position:absolute en esa
  // misma esquina volvía a pisar justo la línea punteada y su etiqueta nueva.
  const legend=`<div class="chart-legend chart-legend-bottom"><span><i class="legend-swatch" style="background:#64748b"></i>Objetivo del mes</span><span><i class="legend-swatch" style="background:var(--coral)"></i>Real acumulado</span><span><i class="legend-swatch legend-swatch-dashed"></i>Proyección</span></div>`;
  // Línea de objetivo: reusa la clase .line-target (color #64748b / #9CB3C9 en modo claro, ya
  // definida y usada por el gráfico acumulado de Resumen General) en vez de un stroke hardcodeado —
  // de paso corrige que el color fijo anterior no cambiaba en modo claro. dasharray 6 6 pedido puntual
  // para esta tarjeta se aplica encima vía style inline (gana sobre el 4 4 de la clase).
  container.innerHTML=`<svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGlowStore" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF6B00" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#FF6B00" stop-opacity="0"></stop></linearGradient></defs><path class="line-area" d="${areaPath}" style="fill:url(#areaGlowStore)"></path><line class="line-target" x1="0" y1="${targetY}" x2="${w}" y2="${targetY}" style="stroke-dasharray:6 6"></line><text class="target-label" x="${w-4}" y="${targetLabelY}" text-anchor="end">Meta ${money(monthTarget)}</text><path class="line-actual" d="${linePath}"></path><path class="line-projection" d="${projPath}"></path><circle class="line-dot" cx="${x(lastDate).toFixed(1)}" cy="${y(last.cum).toFixed(1)}" r="4"><title>${money(last.cum)} al ${formatDateAR(lastDate)}</title></circle></svg><div class="line-axis"><span>${formatDateShortAR(firstDate)}</span><span>${desvio>=0?'+':''}${money(desvio)}${desvioPct!==null?` (${desvioPct>=0?'+':''}${percent(desvioPct)})`:''} proyectado vs. objetivo</span><span>${formatDateShortAR(endDate)}</span></div>${legend}`;
}
// Card 06 — layout master-detail (dona con el total adentro a la izquierda, tarjetas KPI + barra
// de distribución ocupando todo el resto a la derecha). Efectivo/Tarjeta/Descuento son valores
// MENSUALES (una sola mezcla para todo el mes, no varían día a día) — por eso ya no hay un
// gráfico "por día" acá, esta vista muestra la mezcla del mes de una sola vez, fiel al dato real.
function renderStorePaymentBreakdown(container,daily,ctx){
  const{a,avgCash,avgCard,avgDiscount,hasPayment}=ctx;
  if(!hasPayment){container.classList.add('empty-state');container.innerHTML='Agregá la columna de medios de pago en el Sheet para ver el desglose.';return}
  const total=a.actual;
  const segments=[
    {key:'cash',label:'Efectivo',value:avgCash,monto:avgCash*total,color:'var(--coral)'},
    {key:'card',label:'Tarjeta',value:avgCard,monto:avgCard*total,color:'var(--soft)'},
    {key:'discount',label:'Descuento',value:avgDiscount,monto:avgDiscount*total,color:'var(--muted)'}
  ];
  const donutTotal=`<div class="donut-total"><span class="donut-total-value">${money(total)}</span><span class="donut-total-label">Venta total</span></div>`;
  const cards=segments.map(s=>`<div class="payment-kpi-card"><span class="payment-kpi-dot" style="background:${s.color}"></span><span class="payment-kpi-label">${s.label}</span><span class="payment-kpi-value">${money(s.monto)}</span><span class="payment-kpi-sub">${percent(s.value*100)} de la venta</span></div>`).join('');
  const flowBar=segments.map(s=>`<div class="payment-flow-seg" style="width:${Math.max(0,s.value*100).toFixed(1)}%;background:${s.color}"><title>${s.label}: ${percent(s.value*100)}</title></div>`).join('');
  container.innerHTML=`<div class="payment-breakdown"><div class="payment-breakdown-donut"><div class="donut-chart donut-chart-large donut-chart-center">${donutSvg(segments)}${donutTotal}</div></div><div class="payment-breakdown-right"><div class="payment-kpi-grid">${cards}</div><div class="payment-flow-bar">${flowBar}</div></div></div>`;
}
// E-commerce (03) no tiene Local/Vendedor en su barra de filtros ni un "Mes" propio (ver
// switchView e index.html) — es un canal único, siempre consolidado, que responde solo al rango
// Desde/Hasta de la cabecera. weekly (ECOM_SEMANAL, sin fecha propia) se acota a los meses que
// efectivamente aparecen en dailyAll ya filtrado por fecha, en vez de a un dropdown de mes aparte.
// Ticket objetivo y conversión objetivo del canal: dos constantes que viven en el bloque
// CONFIGURACIÓN de la planilla de E-commerce. Las manda el consolidador (Apps Script v11) como
// 'Ticket obj' y 'Conversión obj' en ECOM_SEMANAL — mismos nombres que ya usa LOCAL_DIARIO, y la
// conversión como fracción (0,01 = 1%). Se buscan también en ECOM_DIARIO y con un par de alias por
// si en algún momento se escriben distinto. Devuelve 0 si todavía no llegan, y ahí la tabla muestra
// "—" en vez de inventar un objetivo.
// Se queda con el primer valor > 0: son constantes del mes repetidas fila a fila, y las semanas
// todavía sin cargar vienen en 0.
function ecomTargetSetting(...args){
  const keys=args.pop();
  for(const rows of args)for(const row of rows||[])for(const key of keys){
    if(row[key]===undefined||row[key]===null||row[key]==='')continue;
    const value=parseNumber(row[key]);
    if(value>0)return value;
  }
  return 0;
}
function renderEcommerce(){
  const from=$('fromDate').value,to=$('toDate').value;
  const dailyAll=(state.tables.ECOM_DIARIO||[]).filter(row=>!from||normalizeDate(row.Fecha)>=from);
  const monthsPresent=[...new Set(dailyAll.map(row=>row.Mes).filter(Boolean))];
  const weekly=(state.tables.ECOM_SEMANAL||[]).filter(row=>!monthsPresent.length||monthsPresent.includes(row.Mes));
  const loadedDates=dailyAll.filter(row=>num(row,'Venta real')||num(row,'Visitas')).map(row=>normalizeDate(row.Fecha)).filter(Boolean).sort();
  // El corte NO puede pasarse del último día con datos cargados: si el día en curso ya existe como
  // fila de ECOM_DIARIO (con su Objetivo) pero todavía no tiene ventas, sumar su objetivo infla el
  // desvío acumulado contra un día que nadie cargó. Con el filtro "Hasta" en 17/09 y 16 días
  // cargados daba -$933.835 contra los -$757.914 de la planilla (exactamente los $175.921 de
  // objetivo del jueves 17) y bajaba el cumplimiento de 77,3% a 73,5% — y encima la misma tarjeta
  // decía "16 días cargados" (bug real reportado 2026-09-17 con captura de la planilla). Si el
  // usuario pone un "Hasta" ANTERIOR al último día cargado, ese filtro sigue mandando.
  const lastLoaded=loadedDates.length?loadedDates[loadedDates.length-1]:'';
  const cutoff=(to&&(!lastLoaded||to<lastLoaded))?to:(lastLoaded||to||todayKey());
  const daily=dailyAll.filter(row=>normalizeDate(row.Fecha)<=cutoff);
  const a=aggregate(daily),ratio=a.target?a.actual/a.target:0,delta=a.actual-a.target;
  // Antes usaba dailyAll[0]?.Fecha (primera fila de TODO el historial de ECOM_DIARIO, que arrastra
  // meses viejos) para decidir cuántos días tiene "el mes" — con más de un mes cargado, tomaba el
  // largo del primer mes (ej. Septiembre, 30 días) en vez del mes vigente (bug real, auditoría
  // 2026-09-05). `cutoff` ya es la fecha vigente (filtro "Hasta" o el último día cargado).
  const diasEnMes=daysInCalendarMonth(cutoff);
  // loadedDates sale de dailyAll (que solo respeta "Desde"), así que se reacota a `cutoff` para que
  // un "Hasta" anterior al último día cargado no siga contando días que la tabla ya no muestra.
  const diasTranscurridos=loadedDates.filter(date=>date<=cutoff).length,diasRestantes=Math.max(0,diasEnMes-diasTranscurridos);
  // allMonthRows/perDateMonth/ecomMonthTarget: TODO el mes vigente de ECOM_DIARIO, ignorando el
  // filtro de fecha de "Período" de arriba — mismo criterio que ya usa Proyección Ponderada más
  // abajo (auditoría 2026-09-06), adelantado acá para que "Ritmo necesario" salga igual que la
  // planilla: (Objetivo MENSUAL completo - Venta acumulada) / Días restantes. Antes usaba el desvío
  // YA acumulado (a.target prorrateado a los días cargados) sobre días restantes, que ignora lo que
  // todavía falta vender en lo que resta del mes para el objetivo completo — daba $39.723 contra los
  // $251.879 reales de la planilla (bug real reportado 2026-09-13 con captura de la planilla).
  const currentMonth=currentMonthOf('ECOM_DIARIO');
  const allMonthRows=(state.tables.ECOM_DIARIO||[]).filter(row=>!currentMonth||String(row.Mes??'')===currentMonth);
  const perDateMonth={};
  allMonthRows.forEach(row=>{const date=normalizeDate(row.Fecha);if(!date)return;if(!perDateMonth[date])perDateMonth[date]={actual:0,target:0};perDateMonth[date].actual+=num(row,'Venta real');perDateMonth[date].target+=num(row,'Objetivo')});
  const loadedActual={},loadedTarget={};
  let ecomMonthTarget=0;
  Object.keys(perDateMonth).forEach(d=>{
    ecomMonthTarget+=perDateMonth[d].target;
    if(perDateMonth[d].actual>0){loadedActual[d]=perDateMonth[d].actual;loadedTarget[d]=perDateMonth[d].target}
  });
  const ritmoNecesario=diasRestantes?Math.max(0,ecomMonthTarget-a.actual)/diasRestantes:0;
  // "Cumplimiento a la fecha", no "Avance del mes": ratio compara contra a.target, que es el
  // objetivo PRORRATEADO a los días ya cargados/filtrados, no el objetivo del MES completo — el
  // nombre viejo prometía "avance del mes" (como el de las planillas de cada local, venta acumulada
  // sobre objetivo TOTAL del mes) pero calculaba otra cosa (mismo tipo de confusión ya corregida en
  // Locales, auditoría 2026-09-06).
  $('ecomMetrics').innerHTML=metricsCard('Cumplimiento a la fecha',percent(ratio*100),'% del objetivo esperado',statusTone(ratio))+metricsCard('Venta acumulada',money(a.actual),`${diasTranscurridos} días cargados`)+metricsCard('Desvío acumulado',money(delta),delta>=0?'por encima de lo esperado':diasTranscurridos?'por debajo de lo esperado':'aún sin días cargados',delta>=0?'good':'bad')+metricsCard('Ritmo necesario',money(ritmoNecesario),`${diasRestantes} días restantes`);

  const totals=weekly.reduce((acc,row)=>{acc.visitas+=num(row,'Visitas');acc.carritos+=num(row,'Carritos');acc.compras+=num(row,'Compras');acc.facturacion+=num(row,'Facturación');acc.visitasMeta+=num(row,'Visitas Meta');acc.ventasMeta+=num(row,'Ventas Meta');acc.facturacionMeta+=num(row,'Facturación Meta');acc.inversion+=num(row,'Inversión sin imp.');return acc},{visitas:0,carritos:0,compras:0,facturacion:0,visitasMeta:0,ventasMeta:0,facturacionMeta:0,inversion:0});
  const carVis=totals.visitas?totals.carritos/totals.visitas*100:0,comCar=totals.carritos?totals.compras/totals.carritos*100:0;
  const funnelSteps=[['Visitas',totals.visitas,null],['Carritos',totals.carritos,carVis],['Compras',totals.compras,comCar]];
  const funnelTop=Math.max(totals.visitas,1);
  $('funnel').innerHTML=funnelSteps.map(([label,value,step])=>`${step!==null?`<div class="funnel-step">↓ ${percent(step)}</div>`:''}<div class="funnel-row"><span class="funnel-label">${label}</span><div class="funnel-track"><div class="funnel-fill" style="width:${Math.max(2,value/funnelTop*100)}%"></div></div><span class="funnel-value">${number(value)}</span></div>`).join('');

  // "Meta" en los nombres de columna de ECOM_SEMANAL es Meta Ads (Facebook), NO "meta"=objetivo.
  // ROAS y costo por compra van contra lo ATRIBUIDO a la pauta (Facturación Meta / Ventas Meta), no
  // contra el total del canal: con totals.facturacion/totals.compras daba ROAS 3.44 y CPA $25.029
  // (750.882/30) contra los 2,48 y $39.520 (750.882/19) de la planilla — y de paso pintaba en verde
  // una pauta que la planilla marca "fuera de umbral" por estar debajo del BE ROAS de 2,80 (bug real
  // reportado 2026-09-17 con captura de la planilla).
  const roas=totals.inversion?totals.facturacionMeta/totals.inversion:0,cpa=totals.ventasMeta?totals.inversion/totals.ventasMeta:0;
  $('adsSummary').innerHTML=`<div class="ads-line"><span>Inversión sin impuestos</span><strong>${money(totals.inversion)}</strong></div><div class="ads-line"><span>Facturación atribuida</span><strong>${money(totals.facturacionMeta)}</strong></div><div class="ads-line"><span>Costo por compra</span><strong>${totals.ventasMeta?money(cpa):'—'}</strong></div><div class="ads-line"><span>ROAS / BE ROAS</span><strong class="${roas>=2.8?'good':'bad'}">${roas.toFixed(2)} / 2.80</strong></div>`;

  // Objetivos del mes: el mensual sale de la suma de `Objetivo` de ECOM_DIARIO (ecomMonthTarget, ya
  // calculado arriba — coincide exacto con el "Objetivo Mensual" del bloque CONFIGURACIÓN). Ticket
  // objetivo y conversión objetivo son las DOS constantes que faltan: viven solo en ese bloque de la
  // planilla, así que las lee del endpoint apenas aparezcan (ver ecomTargetSetting). Mientras no
  // vengan, las filas que dependen de ellas muestran "—" en vez de inventar un número: antes esta
  // tabla usaba las columnas de Meta Ads como si fueran el objetivo y mostraba "objetivo" 3.545
  // visitas / 19 ventas (lo que trajo la pauta) contra las 7.845 / 78 reales de la planilla.
  const ticketObj=ecomTargetSetting(weekly,daily,['Ticket obj','Ticket obj.','Ticket objetivo']);
  const convObj=ecomTargetSetting(weekly,daily,['Conversión obj','Conversión obj.','Conversión objetivo']);
  const ventasObj=ticketObj?ecomMonthTarget/ticketObj:null;
  const visitasObj=ventasObj!==null&&convObj?ventasObj/convObj:null;
  const faltante=Math.max(0,ecomMonthTarget-a.actual);
  const traficoRestante=ticketObj&&convObj?faltante/ticketObj/convObj:null;
  const monthRows=[
    ['Visitas',totals.visitas,visitasObj,number],
    ['Q Ventas',totals.compras,ventasObj,number],
    ['Conversión',totals.visitas?totals.compras/totals.visitas*100:0,convObj?convObj*100:null,percent],
    ['Ticket prom.',totals.compras?totals.facturacion/totals.compras:0,ticketObj||null,money],
    ['Venta / día',diasTranscurridos?a.actual/diasTranscurridos:0,diasEnMes?ecomMonthTarget/diasEnMes:null,money],
    ['Tráfico restante',traficoRestante,visitasObj,number]
  ];
  $('ecomMonthTable').innerHTML=`<thead><tr><th>Métrica</th><th class="align-right">Total</th><th class="align-right">Objetivo</th></tr></thead><tbody>${monthRows.map(([label,tot,obj,fmt])=>`<tr><td class="seller-name">${label}</td><td class="num">${tot===null?'—':fmt(tot)}</td><td class="num">${obj===null?'—':fmt(obj)}</td></tr>`).join('')}</tbody>`;

  const projection=$('ecomProjection');
  // Proyección Ponderada replica la fórmula real de la planilla de E-commerce (SUMPRODUCTO de la
  // celda C13, verificada contra la planilla real: con los mismos datos dio $3.690.489 contra los
  // $3.690.489 de la planilla — match exacto, auditoría 2026-09-06. Ver projectMonth() y
  // storeProjection(), mismo criterio ya portado ahí). loadedActual/loadedTarget/ecomMonthTarget ya
  // se calcularon arriba (los reusa también "Ritmo necesario") a partir de allMonthRows, TODO el mes
  // vigente de ECOM_DIARIO ignorando el filtro de fecha de "Período" — igual que allMonthRows en
  // renderStores(): antes esto usaba `daily` (que sí respeta ese filtro) tanto para el objetivo
  // del mes como para el ritmo, así que filtrar por un rango corto encogía el objetivo del mes
  // igual que el bug ya resuelto en Locales.
  const proj=Object.keys(loadedActual).length?projectMonth(loadedActual,daysInCalendarMonth(Object.keys(loadedActual).sort().pop()),loadedTarget,ecomMonthTarget):null;
  if(!proj){projection.classList.add('empty-state');projection.innerHTML='Sin días cargados todavía este mes.'}
  else{projection.classList.remove('empty-state');const desvioProy=proj.ponderada-ecomMonthTarget;projection.innerHTML=`<span class="section-kicker">CIERRE ESTIMADO</span><div class="deviation-number ${desvioProy>=0?'good':'bad'}">${money(proj.ponderada)}</div><div class="deviation-copy">${desvioProy>=0?'+':''}${money(desvioProy)} vs. objetivo del mes · ponderada al patrón real de días de la semana (${proj.dias}/${daysInCalendarMonth(Object.keys(loadedActual).sort().pop())} días)</div><div class="projection-alt">Lineal: ${money(proj.lineal)}</div>`}

  const columns=[['Fecha','Fecha'],['Día','Día'],['Objetivo','Objetivo'],['Venta real','Venta real'],['Visitas','Visitas'],['Q ventas','Q Ventas'],['Conversión','Conversión'],['Ticket','Ticket prom.']];
  renderTable('ecomTable',daily,columns,null,3)
}
// Orden real de la tabla: por defecto Fecha descendente (más reciente arriba). Si el usuario
// clickeó un header de ESTA MISMA tabla, se ordena por esa columna — antes state.sort solo pintaba
// la flechita ↑/↓ en el header pero el .sort() de los datos estaba fijo a Fecha sin importar el
// click (bug real, auditoría 2026-09-05): la tabla parecía ordenarse y en realidad no se movía nada.
// state.sort guarda también `table` para que ordenar storeTable por "Conversión" no reordene en
// silencio a ecomTable la próxima vez que se renderice (comparten nombre de columna).
function tableSortValue(row,key){return ['Fecha','Día','Local'].includes(key)?String(row[key]??''):parseNumber(row[key])}
// Engancha click Y teclado (Enter/Espacio) a los headers ordenables de una tabla — antes un
// th[data-sort] solo respondía al mouse: un <th> no es focuseable ni "activable" con teclado por
// default, así que alguien navegando sin mouse no podía cambiar el orden de ninguna tabla del
// dashboard (auditoría 2026-09-06). tabindex="0"/aria-sort van en el <th> generado por cada
// llamante (ver renderTable() y headerCell() en renderSellerMetrics) — acá solo se engancha el
// comportamiento, una sola vez, para las dos tablas que lo usan.
function attachSortHeaders(tableId){
  qa(`#${tableId} th[data-sort]`).forEach(th=>{
    const activate=()=>{
      const key=th.dataset.sort;
      const same=state.sort.table===tableId&&state.sort.key===key;
      state.sort={key,direction:same?-state.sort.direction:1,table:tableId};
      render();
    };
    th.addEventListener('click',activate);
    th.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}});
  });
}
function renderTable(id,rows,columns,transform){
  const table=$(id);
  const data=(transform?rows.map(transform):rows).slice();
  const sortActive=state.sort.table===id&&columns.some(([,key])=>key===state.sort.key);
  data.sort((a,b)=>{
    if(!sortActive)return String(b.Fecha||'').localeCompare(String(a.Fecha||''));
    const av=tableSortValue(a,state.sort.key),bv=tableSortValue(b,state.sort.key);
    return av<bv?-state.sort.direction:av>bv?state.sort.direction:0;
  });
  // Columnas realmente numéricas (Objetivo/Venta real/Ticket/Desvío/Conversión/Tráfico/Visitas/Q
  // ventas) — todo lo demás (Fecha/Local/Día/etc.) es texto. Antes esta función le daba class="num"
  // a TODO menos "Desvío" por default, así que Fecha/Local/Día salían con el mismo blanco+Space
  // Grotesk que un número — y de paso, al alinear los números a la derecha (pedido 2026-09-08), esas
  // columnas de texto se hubieran ido a la derecha también si no se corregía este default acá.
  const isNumericLabel=label=>['Objetivo','Venta real','Ticket','Desvío','Desvío %','Conversión','Tráfico','Visitas','Q ventas'].includes(label);
  table.innerHTML=`<thead><tr>${columns.map(([label,key])=>{const active=sortActive&&state.sort.key===key;return `<th data-sort="${key}" data-table="${id}" tabindex="0" aria-sort="${active?(state.sort.direction>0?'ascending':'descending'):'none'}"${isNumericLabel(label)?' class="align-right"':''}>${label}${active?' '+(state.sort.direction>0?'↑':'↓'):''}</th>`}).join('')}</tr></thead><tbody>${data.slice(0,120).map(row=>`<tr>${columns.map(([label,key])=>{
    const value=row[key];
    const isMoney=['Objetivo','Venta real','Ticket','Desvío'].includes(label);
    const isPct=['Conversión'].includes(label);
    // Tráfico/Visitas/Q ventas caían al else de abajo sin pasar por number() — se veían sin
    // separador de miles (ej. "1842") a diferencia de todo el resto del dashboard (bug real,
    // auditoría 2026-09-05).
    const isCount=['Tráfico','Visitas','Q ventas'].includes(label);
    // Fecha siempre en formato argentino día/mes/año (formatDateAR) — el valor crudo que llega del
    // Sheet ya es ISO (ver normalizeDate), nunca se muestra así directo (pedido 2026-09-13).
    const isDate=label==='Fecha';
    // El desvío en % va en su PROPIA columna, no entre paréntesis dentro de la de pesos (pedido
    // 2026-10-01): metidos en la misma celda, el monto y el porcentaje no se podían ordenar por
    // separado ni leer en vertical. Llega ya en puntos de porcentaje —no en fracción como
    // Conversión— y puede venir null cuando la fila no tiene objetivo: ahí no hay porcentaje posible.
    const isDeltaPct=label==='Desvío %';
    const sinValor=value===null||value===undefined;
    // "num" va SIEMPRE junto al tono en las dos columnas de desvío (no uno u otro) — mismo patrón
    // que ya usan seasonMonthTable/renderStoreProjectionChart para las suyas; sin las dos clases
    // juntas se quedaban sin el blanco+alineación a la derecha del resto de números.
    // Las dos columnas de desvío se pintan por el % cumplido del día (regla general, ver statusTone):
    // una fila a -5% es amarilla, no roja. Sin objetivo (sin __deltaPct) queda el signo.
    const pctDia=row.__deltaPct;
    const toneDesvio=pctDia!==null&&pctDia!==undefined?cumplClase(1+pctDia/100):(value>=0?'positive':'negative');
    const cls=(label==='Desvío'||isDeltaPct)?(sinValor?'num':`num ${toneDesvio}`):isNumericLabel(label)?'num':'';
    return `<td class="${cls}">${isDeltaPct?(sinValor?'—':`${value>=0?'+':''}${percent(value)}`):isMoney?money(value):isPct?percent(value*100):isCount?number(value):isDate?formatDateAR(value):escapeHtml(value??'—')}</td>`;
  }).join('')}</tr>`).join('')||`<tr><td colspan="${columns.length}" class="empty-state">Sin datos para estos filtros</td></tr>`}</tbody>`;
  attachSortHeaders(id);
}
// 04 y 05 consolidan por SEMANA (Mes/Semana), no por rango de fechas suelto — Desde/Hasta se
// ocultan ahí para no dar a entender que se puede recortar una semana a la mitad, cosa que el
// consolidador no soporta. Los pares Mes/Semana de cada una viven siempre en la barra de arriba
// (movidos ahí desde debajo del título) y se muestran/ocultan según la pestaña activa.
function switchView(view){
  state.view=view;
  qa('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
  // Bottom-nav mobile: solo Inicio/Locales/Vendedores tienen botón propio — el resto de las vistas
  // (E-commerce, Accesorios, Temporada, Ranking) se llega por el drawer, así que ninguno de los 3
  // queda marcado activo ahí (mismo criterio que ya se usó en equipo/).
  qa('.bottom-nav-item[data-view]').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
  qa('.view').forEach(x=>x.classList.toggle('active-view',x.id===`${view}View`));
  const hideLocalSeller=view==='overview'||view==='ecommerce';
  $('localFilterLabel').hidden=hideLocalSeller;
  // Vendedor además se oculta en Locales (02): esa vista responde "¿cómo viene el LOCAL?", filtrar
  // por vendedor ahí mezcla esa pregunta con la de "Métricas vendedores" (04), que ya es la vista
  // dedicada a mirar por persona — un campo menos también le da más aire a la fila de filtros.
  const hideSeller=hideLocalSeller||view==='stores'||view==='rentabilidad';
  $('sellerFilterLabel').hidden=hideSeller;
  // Reset, no solo ocultar: activeRows('LOCAL_DIARIO') SÍ lee sellerFilter aunque el <select> esté
  // oculto — sin este reset, un vendedor elegido en Métricas quedaba filtrando en silencio a
  // Locales (mostrando solo la venta de esa persona) sin ningún control visible que lo explique.
  if(hideSeller&&$('sellerFilter').value!=='all'){$('sellerFilter').value='all'}
  const isSellerMetrics=view==='sellerMetrics',isAccessories=view==='accessories';
  // Ranking (07) corre en semanas cerradas (Liga VDH/GP VDH reparten puntos por fecha/semana) y
  // Temporada (06) es un consolidado mensual — ninguna de las dos lee fromDate/toDate para nada,
  // así que el selector de período libre no tiene sentido ahí y queda oculto (mismo criterio que
  // ya se aplicaba a Métricas/Accesorios, que usan su propio Mes/Semana).
  const hideDates=isSellerMetrics||isAccessories||view==='ranking'||view==='season'||view==='rentabilidad';
  // Período/Período seleccionado son grid-items sueltos de .filters (no un wrapper con
  // grid-column:1/-1) — ocultar cada uno alcanza, no cortan la fila de Local/Vendedor/Mes/Semana
  // en las vistas donde no aplican (regla del usuario: todo en una sola fila — ver
  // [[vdh-filters-layout-rule]]).
  $('periodPickerField').hidden=hideDates;
  $('periodCustomField').hidden=hideDates;
  if(hideDates){closePeriodDropdown();closeCalendarDropdown()}
  $('metricsMonthLabel').hidden=!isSellerMetrics;
  $('metricsWeekLabel').hidden=!isSellerMetrics;
  $('accessoryMonthLabel').hidden=!isAccessories;
  $('accessoryWeekLabel').hidden=!isAccessories;
  updatePeriodRangeBadge();
  window.scrollTo({top:0,behavior:'smooth'});
}
// Rango de fechas real de un Mes/Semana según lo que YA cargaron LOCAL_DIARIO/VENDEDOR_DIARIO
// para esa combinación (no un cálculo de calendario a ciegas: si la semana empezó un día distinto
// al esperado, esto lo refleja tal cual está en la planilla). "Todas las semanas" sí usa el mes
// calendario completo (día 1 al último), como pidió el usuario explícitamente.
function weekDateRange(month,week){
  if(month==='all')return null;
  const rows=[...(state.tables.LOCAL_DIARIO||[]),...(state.tables.VENDEDOR_DIARIO||[])].filter(row=>String(row.Mes??'')===month&&(week==='all'||String(row.Semana??'')===week));
  const dates=[...new Set(rows.map(row=>normalizeDate(row.Fecha)).filter(Boolean))].sort();
  if(!dates.length)return null;
  if(week==='all'){
    const[y,m]=dates[0].split('-');
    return{start:`${y}-${m}-01`,end:`${y}-${m}-${String(daysInCalendarMonth(dates[0])).padStart(2,'0')}`};
  }
  return{start:dates[0],end:dates[dates.length-1]};
}
function updatePeriodRangeBadge(){
  const badge=$('periodRangeBadge');
  let monthId,weekId;
  if(state.view==='sellerMetrics'){monthId='metricsMonthFilter';weekId='metricsWeekFilter'}
  else if(state.view==='accessories'){monthId='accessoryMonthFilter';weekId='accessoryWeekFilter'}
  else{badge.hidden=true;return}
  const month=$(monthId).value,week=$(weekId).value;
  const range=weekDateRange(month,week);
  if(!range){badge.hidden=true;return}
  badge.hidden=false;
  badge.innerHTML=`${icon('calendar','badge-icon')}Del ${formatDateAR(range.start)} al ${formatDateAR(range.end)}`;
}
/* ── SELECTOR DE PERÍODO (presets + calendario de rango, estilo Tiendanube) ───────────────────
   Reemplaza los <input type="date"> sueltos de Desde/Hasta por un único selector con accesos
   rápidos + calendario de rango (Flatpickr, cargado por CDN en index.html). Los inputs #fromDate/
   #toDate se mantienen en el DOM (ocultos): TODO el resto del dashboard (rowMatchesFilters,
   overviewRows, objectiveCutoff, renderEcommerce, etc.) ya lee su .value directamente — este
   picker solo escribe ahí y dispara 'change', no duplica esa lógica en ningún lado.
   Alcance: solo vive en Resumen/Locales/E-commerce — switchView() lo oculta en Ranking y
   Temporada, que corren en semana/mes cerrado y no lo usan (ver comentario ahí). */
const periodPicker={fp:null,preset:'all'};
function addDaysKey(dateKey,days){const[y,m,d]=dateKey.split('-').map(Number);const dt=new Date(y,m-1,d+days);return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`}
function mondayOfWeek(dateKey){const[y,m,d]=dateKey.split('-').map(Number);const dow=(new Date(y,m-1,d).getDay()+6)%7;return addDaysKey(dateKey,-dow)}
function firstOfMonthKey(dateKey){const[y,m]=dateKey.split('-');return `${y}-${m}-01`}
function firstOfQuarterKey(dateKey){const[y,m]=dateKey.split('-').map(Number);const qStart=Math.floor((m-1)/3)*3+1;return `${y}-${String(qStart).padStart(2,'0')}-01`}
function setPeriodInputs(from,to){$('fromDate').value=from||'';$('toDate').value=to||'';$('fromDate').dispatchEvent(new Event('change'))}
function periodPresetLabel(preset){
  if(preset==='hoy')return'Hoy';
  if(preset==='ayer')return'Ayer';
  if(preset==='semana')return'Semana actual';
  if(preset==='mes')return'Mes actual';
  if(preset==='trimestre')return'Trimestre actual';
  if(preset==='semestre')return'Semestre completo';
  // 'custom': el rango elegido a mano en "Período seleccionado".
  return'Personalizado';
}
// El período con el que arranca el dashboard y al que vuelve "Limpiar todo" (pedido 2026-10-01).
// Antes arrancaba sin filtro —el semestre entero— y eso mezclaba meses: es lo que hizo que el
// Resumen general mostrara 111% de un objetivo de octubre con la venta de septiembre adentro. El
// semestre sigue a un click, como preset propio ("Semestre completo").
const PERIODO_POR_DEFECTO='mes';
function openPeriodDropdown(){$('periodDropdown').hidden=false}
function closePeriodDropdown(){$('periodDropdown').hidden=true}
function openCalendarDropdown(){$('periodCalendarDropdown').hidden=false;if(!periodPicker.fp)initFlatpickr()}
function closeCalendarDropdown(){$('periodCalendarDropdown').hidden=true}
function markActivePreset(preset){qa('.period-preset').forEach(btn=>btn.classList.toggle('active',btn.dataset.preset===preset))}
// Presets "actuales" son a la fecha (desde el inicio de la semana/mes/trimestre HASTA hoy, no el
// período completo) — mismo criterio que "Semana actual"/"Mes actual"/"Trimestre actual" de
// Tiendanube, que muestran lo acumulado corrido, no un período futuro vacío.
// "semestre" (y cualquier otro valor) deja las dos fechas vacías: sin filtro de fecha, que es como
// el resto del dashboard entiende "semestre completo".
//
// `disparar` en false escribe las fechas SIN el evento 'change': al arrancar los datos todavía no
// llegaron, y ese evento llama a render() con las tablas vacías. loadData() renderiza después.
function applyPeriodPreset(preset,disparar=true){
  const today=todayKey();
  let from='',to='';
  if(preset==='hoy'){from=to=today}
  else if(preset==='ayer'){from=to=addDaysKey(today,-1)}
  else if(preset==='semana'){from=mondayOfWeek(today);to=today}
  else if(preset==='mes'){from=firstOfMonthKey(today);to=today}
  else if(preset==='trimestre'){from=firstOfQuarterKey(today);to=today}
  periodPicker.preset=preset;
  if(disparar)setPeriodInputs(from,to);
  // Sin el 'change' tampoco corre render(), que es quien actualiza el cartel del período: se hace a
  // mano para que mientras cargan los datos no diga "Semestre completo" con el mes ya elegido.
  else{$('fromDate').value=from;$('toDate').value=to;updatePeriod()}
  $('periodPickerBtnText').textContent=periodPresetLabel(preset);
  markActivePreset(preset);
  closeCalendarDropdown();
  closePeriodDropdown();
}
// "Limpiar todo" vuelve al período por defecto (el mes actual), no a "sin filtro": limpiar es volver
// a como arranca el dashboard. Para ver el semestre está su preset.
function resetPeriodPicker(){
  $('periodCustomBtnText').textContent='Elegí un rango';
  if(periodPicker.fp)periodPicker.fp.clear();
  refreshCustomSelectedLabel([]);
  applyPeriodPreset(PERIODO_POR_DEFECTO);
}
// "Período seleccionado" (campo 2) muestra el rango elegido a medida que se clickea el calendario,
// ANTES de confirmar con "Aplicar" — separado del botón del campo, que solo se actualiza al aplicar
// (ver periodApplyBtn), para no filtrar datos hasta que el usuario confirma la selección.
function refreshCustomSelectedLabel(dates){
  const applyBtn=$('periodApplyBtn');
  if(!dates||!dates.length){applyBtn.disabled=true;return}
  applyBtn.disabled=false;
}
function initFlatpickr(){
  if(window.flatpickr&&flatpickr.l10ns&&flatpickr.l10ns.es)flatpickr.localize(flatpickr.l10ns.es);
  periodPicker.fp=flatpickr($('periodCalendar'),{
    inline:true,mode:'range',dateFormat:'Y-m-d',
    // 'static' en vez del dropdown de mes que trae Flatpickr por defecto: acá el mes solo se
    // mueve de a uno con las flechas prev/next, nunca saltando directo a otro mes de una lista.
    monthSelectorType:'static',
    onChange:selectedDates=>refreshCustomSelectedLabel(selectedDates),
    // Doble clic sobre el mismo día = consultar un único día. Flatpickr en modo rango no distingue
    // el dblclick nativo del navegador (son 2 "click" sueltos): el 2º click sobre la MISMA fecha
    // que ya es el inicio simplemente reinicia la selección a un solo punto, no arma [fecha,fecha].
    // dayElem.dateObj es la fecha que Flatpickr ya guarda en cada celda — se fuerza el rango de
    // un solo día explícitamente acá en vez de depender de ese comportamiento por defecto.
    onDayCreate:(dObj,dStr,fp,dayElem)=>{
      dayElem.addEventListener('dblclick',()=>{if(dayElem.dateObj)fp.setDate([dayElem.dateObj,dayElem.dateObj],true)});
    }
  });
  refreshCustomSelectedLabel([]);
}
function initPeriodPicker(){
  $('periodPickerBtn').addEventListener('click',e=>{
    e.stopPropagation();
    closeCalendarDropdown();
    $('periodDropdown').hidden?openPeriodDropdown():closePeriodDropdown();
  });
  $('periodCustomBtn').addEventListener('click',e=>{
    e.stopPropagation();
    closePeriodDropdown();
    $('periodCalendarDropdown').hidden?openCalendarDropdown():closeCalendarDropdown();
  });
  document.addEventListener('click',e=>{
    if(!$('periodPickerField').contains(e.target))closePeriodDropdown();
    if(!$('periodCustomField').contains(e.target))closeCalendarDropdown();
  });
  qa('.period-preset').forEach(btn=>btn.addEventListener('click',()=>applyPeriodPreset(btn.dataset.preset)));
  $('periodCancelBtn').addEventListener('click',()=>closeCalendarDropdown());
  $('periodApplyBtn').addEventListener('click',()=>{
    const sel=periodPicker.fp?periodPicker.fp.selectedDates:[];
    if(!sel.length)return;
    const from=normalizeDate(sel[0]),to=sel[1]?normalizeDate(sel[1]):from;
    setPeriodInputs(from,to);
    $('periodCustomBtnText').textContent=from===to?formatDateAR(from):`${formatDateAR(from)} → ${formatDateAR(to)}`;
    // Aplicar un rango acá también deja "Período" mostrando "Personalizado" — los dos campos
    // quedan sincronizados sin importar por cuál de los dos entró el usuario.
    periodPicker.preset='custom';
    $('periodPickerBtnText').textContent=periodPresetLabel('custom');
    markActivePreset('custom');
    closeCalendarDropdown();
  });
}

// ── 08 · RENTABILIDAD ─────────────────────────────────────────────────────────────
// Lo que dice la planilla HVL06, TAL CUAL: sin calcular nada por fila, porque la planilla es la
// fuente (pedido 2026-10-04). Se lee directo desde el navegador (ver cargarRentabilidad), la pestaña
// de la temporada en curso —hoy Verano 2027, sep 2026 a feb 2027— y los montos son el ACUMULADO de la
// temporada, no un mes.
// Lo único que se suma acá son los totales de los locales que se muestran: la planilla tiene locales
// que el dashboard no (MDQ San Martín, Quilmes, San Justo 2) y no tiene DOT todavía, así que su fila
// "Total" no corresponde a lo que se ve. Se muestran solo los que están en los dos lados.
const RENT_CAMPOS_PLATA=['Venta Total','Facturado','No facturado','Cantidad','Tickets','Tráfico','Ventas Fallidas','Gastos Total','Gastos Plan de cuentas','Empleados','Tarjeta','Iva','CMV','Rentabilidad'];
// Código de la planilla (entre paréntesis después del nombre) → local del dashboard, normalizado.
// Para los que no están acá se compara por nombre (ver rentLocalDelDashboard): así cuando agreguen
// DOT se engancha solo aunque usen un código nuevo.
const RENT_CODIGOS={CAB:'CASEROS',ITB:'ITUZAINGO',MD2:'RIVADAVIA',MOR:'MORON',PCH:'PACHECO',SJU:'SANJUSTO1',FLO:'FLORES',SJB:'SANJUSTOSHOPPING',LZB:'LOMASDEZAMORA',SUN:'UNICENTER',SPB:'PARQUEBROWN',VPA:'VILLADELPARQUE',GRB:'GRANDBOURG'};
const rentNorm=t=>String(t??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/\bI\b/g,'1').replace(/[^A-Z0-9]/g,'');
// Monto corto en millones con coma decimal ($548,5M); moneyShort usa punto, que acá se lee como miles.
const rentCorto=v=>{const a=Math.abs(v);return a>=1e6?`$${new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(a/1e6)}M`:money(a)};
const rentNombre=t=>String(t??'').toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase());
const RENT_ICONO_INFO='<svg class="icon-svg rent-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
function rentLocalDelDashboard(fila,localesDash){
  const porNorm=Object.fromEntries(localesDash.map(l=>[rentNorm(l),l]));
  const porCodigo=RENT_CODIGOS[String(fila['Código']||'').toUpperCase()];
  if(porCodigo&&porNorm[porCodigo])return porNorm[porCodigo];
  const n=rentNorm(fila.Local);
  if(porNorm[n])return porNorm[n];
  // "MDQ Rivadavia" → RIVADAVIA, "Shopping Dot" → DOT: el nombre de la planilla TERMINA con el del
  // dashboard. No se busca "contiene" a secas para que "MDQ San Martin" no se pegue a nada.
  return localesDash.find(l=>{const d=rentNorm(l);return d.length>=3&&n.endsWith(d)})||null;
}
const rentVal=(f,k)=>{const v=f?.[k];return v===null||v===undefined||v===''||!Number.isFinite(Number(v))?null:Number(v)};
const rentGuion='<span class="missing-value">—</span>';
const rentPlata=v=>v===null?rentGuion:money(v);
const rentPct=v=>v===null||!Number.isFinite(v)?rentGuion:percent(v*100);
const rentNum=v=>v===null?rentGuion:number(v);

// ── Lectura DIRECTA de la planilla, sin pasar por el consolidador (pedido 2026-10-04) ──
// Google deja leer una planilla compartida "con cualquiera que tenga el enlace" desde el navegador
// (endpoint gviz, con CORS). Ventajas contra el consolidador: no hay que deployar nada y lo que
// cambien en la planilla se ve al refrescar, sin esperar la corrida de cada hora. Depende de que la
// planilla SIGA compartida por enlace: si alguien la cierra, la sección lo avisa.
//
// Qué pestaña: la de la temporada en curso según la fecha (sep-feb → "Verano <año de febrero>",
// mar-ago → "Invierno <año>"); si todavía no la crearon, la anterior, con aviso. gviz no lista las
// pestañas, por eso se la busca por nombre.
//
// TRAMPA de gviz: si la pestaña pedida no existe NO da error, devuelve la primera del archivo (hoy
// Verano 2020) como si nada. Por eso también se pide una pestaña que seguro no existe y se compara:
// si la respuesta es la misma, la buscada no existe.
const RENT_PLANILLA_ID='1P7v6GkKT11nidz098o_gF57Uen5jk0UbP05ExFcFCF8';
const RENT_URL=nombre=>`https://docs.google.com/spreadsheets/d/${RENT_PLANILLA_ID}/gviz/tq?tqx=out:csv&headers=0&range=A1:T120&sheet=${encodeURIComponent(nombre)}`;
function rentTemporadas(fecha=new Date()){
  const y=fecha.getFullYear(),m=fecha.getMonth();   // 0 = enero
  const actual=m>=8?`Verano ${y+1}`:m<=1?`Verano ${y}`:`Invierno ${y}`;
  const anterior=m>=8?`Invierno ${y}`:m<=1?`Invierno ${y-1}`:`Verano ${y}`;
  return[actual,anterior];
}
function rentCsv(texto){
  const filas=[];let fila=[],c='',q=false;
  for(let i=0;i<texto.length;i++){const ch=texto[i];
    if(q){if(ch==='"'&&texto[i+1]==='"'){c+='"';i++}else if(ch==='"')q=false;else c+=ch}
    else if(ch==='"')q=true;else if(ch===','){fila.push(c);c=''}
    else if(ch==='\n'){fila.push(c.replace(/\r$/,''));filas.push(fila);fila=[];c=''}else c+=ch}
  if(c||fila.length){fila.push(c);filas.push(fila)}
  return filas;
}
// Celda de la planilla → número o null. Llega con el formato de la planilla ("$21.608.901",
// "-$20.936.600", "60,00%", "21.608.901"); los errores de fórmula (#DIV/0!) quedan en null.
function rentCelda(t){
  t=String(t??'').trim();
  if(!t||t.startsWith('#'))return null;
  const pct=t.includes('%'),neg=/^-|^\(/.test(t);
  let s=t.replace(/[^0-9.,]/g,'');
  if(!s)return null;
  if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');
  else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
  let n=parseFloat(s);
  if(!Number.isFinite(n))return null;
  if(neg)n=-n;
  return pct?n/100:n;
}
// Misma lectura que hacía el consolidador: cada local ocupa dos filas (montos arriba, % abajo).
// Columnas: B Local · C Venta Total · D Facturado · E No facturado · F Cantidad · G Precio Unitario
// · H Tickets · I Ticket Promedio · J Tráfico · K Ventas Fallidas · L Gastos Total · M Gastos Plan
// de cuentas · N Empleados · O Tarjeta · P Iva · Q CMV · R Rentabilidad · S % Sobre la venta.
// gviz se saltea las filas vacías, así que todo se ubica por contenido y no por número de fila.
const RENT_COLUMNAS=['Venta Total','Facturado','No facturado','Cantidad','Precio Unitario','Tickets','Ticket Promedio','Tráfico','Ventas Fallidas','Gastos Total','Gastos Plan de cuentas','Empleados','Tarjeta','Iva','CMV','Rentabilidad','% Sobre la venta'];
function rentParsear(grilla,pestana){
  if(!grilla.some(f=>/RENTABILIDAD/i.test(f[1]||'')))return null;   // no es una pestaña de rentabilidad
  const fCab=grilla.findIndex(f=>String(f[1]||'').trim()==='Local');
  if(fCab<0)return null;
  const filas=[];
  for(let r=fCab+1;r<grilla.length;r++){
    const g=grilla[r],nombre=String(g[1]||'').trim();
    if(!nombre)continue;
    // La fila de % es la siguiente solo si tiene la B vacía (si viniera vacía entera, gviz la salta
    // y la siguiente ya sería otro local).
    const sig=grilla[r+1]||[],sub=String(sig[1]||'').trim()?[]:sig;
    const tipo=/^total$/i.test(nombre)?'total':/e-?commerce/i.test(nombre)?'ecommerce':'local';
    const cod=nombre.match(/\(([A-Z0-9]+)\)\s*$/);
    const o={Temporada:pestana,Local:nombre.replace(/\s*\([A-Z0-9]+\)\s*$/,''),'Código':cod?cod[1]:'',Tipo:tipo};
    RENT_COLUMNAS.forEach((k,i)=>{o[k]=rentCelda(g[2+i])});
    Object.assign(o,{'% Facturado':rentCelda(sub[3]),'% No facturado':rentCelda(sub[4]),'Conversión':rentCelda(sub[9]),'% Fallidas':rentCelda(sub[10]),
      '% Gastos plan':rentCelda(sub[12]),'% Tarjeta':rentCelda(sub[14]),'% Iva':rentCelda(sub[15]),'% CMV':rentCelda(sub[16])});
    filas.push(o);
    if(tipo==='ecommerce')break;   // debajo hay cuentas sueltas de trabajo ("Ejemplo", etc.)
  }
  return filas.length?filas:null;
}
async function cargarRentabilidad(){
  const[actual,anterior]=rentTemporadas();
  state.rent={estado:'cargando'};
  renderRentabilidad();
  try{
    const bajar=async nombre=>{const r=await fetch(RENT_URL(nombre),{cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text()};
    const[control,tActual,tAnterior]=await Promise.all([bajar('__no_existe__'),bajar(actual),bajar(anterior)]);
    for(const[pestana,texto]of[[actual,tActual],[anterior,tAnterior]]){
      if(texto===control)continue;   // la pestaña no existe: gviz devolvió la primera del archivo
      const filas=rentParsear(rentCsv(texto),pestana);
      if(filas){
        state.rent={estado:'ok',filas,pestana,aviso:pestana===actual?'':`Todavía no está la pestaña "${actual}" en la planilla: se muestra "${anterior}".`};
        renderRentabilidad();
        return;
      }
    }
    state.rent={estado:'sinPestana',buscada:actual};
  }catch(err){
    console.error('cargarRentabilidad:',err);
    state.rent={estado:'error',detalle:err.message};
  }
  renderRentabilidad();
}

function renderRentabilidad(){
  if(!$('rentabilidadView'))return;
  const rs=state.rent||{estado:'cargando'};
  const vacio=(msg,tono)=>{
    $('rentStatus').hidden=false;$('rentStatus').className=`rent-status${tono?` ${tono}`:''}`;$('rentStatus').innerHTML=RENT_ICONO_INFO+`<div>${msg}</div>`;
    ['rentKpis','rentWaterfall','rentBars','rentabilidadTable'].forEach(id=>$(id).innerHTML='');
    ['rentabilidadRowsCount','rentFoot','rentWaterfallNote','rentBarsNote'].forEach(id=>$(id).textContent='');
    $('rentSeasonBadge').textContent='—';
  };
  if(rs.estado==='cargando'){vacio('Leyendo la planilla de rentabilidad…');return}
  if(rs.estado==='error'){vacio(`<strong>No se pudo leer la planilla de rentabilidad.</strong> Revisá que siga compartida como "Cualquier persona con el enlace puede ver". <span class="rent-status-detalle">(${escapeHtml(rs.detalle||'')})</span>`,'warning');return}
  if(rs.estado==='sinPestana'){vacio(`<strong>No está la pestaña "${escapeHtml(rs.buscada)}" en la planilla de rentabilidad</strong>, ni la de la temporada anterior. La sección busca la pestaña por su nombre: tiene que llamarse exactamente así.`,'warning');return}
  const tabla=rs.filas||[];

  const temporada=String(tabla[0].Temporada||'').trim();
  const localesDash=[...new Set((state.tables.LOCAL_DIARIO||[]).map(r=>r.Local).filter(Boolean))];
  const filasLocal=tabla.filter(f=>f.Tipo==='local');
  const filtro=$('localFilter').value;
  const usados=new Set(),locales=[];
  filasLocal.forEach(f=>{const dash=rentLocalDelDashboard(f,localesDash);if(dash&&!usados.has(dash)){usados.add(dash);locales.push({...f,dash})}});
  const soloPlanilla=filasLocal.filter(f=>!locales.some(l=>l.Local===f.Local)).map(f=>f.Local);
  const soloDashboard=localesDash.filter(l=>!usados.has(l));
  const visibles=filtro==='all'?locales:locales.filter(l=>l.dash===filtro);
  const ecommerce=filtro==='all'?tabla.find(f=>f.Tipo==='ecommerce'):null;

  // Totales de lo que se ve (ver nota de arriba: no es la fila "Total" de la planilla).
  const tot=Object.fromEntries(RENT_CAMPOS_PLATA.map(k=>[k,visibles.reduce((sum,f)=>sum+(rentVal(f,k)||0),0)]));
  const venta=tot['Venta Total'],rent=tot.Rentabilidad,margen=venta?rent/venta:null;
  const conVenta=visibles.filter(f=>(rentVal(f,'Venta Total')||0)>0);
  const positivos=visibles.filter(f=>(rentVal(f,'Rentabilidad')||0)>0).length;

  $('rentSeasonBadge').textContent=temporada?`${temporada} · acumulado de la temporada`:'Acumulado de la temporada';
  const sinVentas=visibles.length>0&&!conVenta.length;
  const avisos=[];
  if(rs.aviso)avisos.push(escapeHtml(rs.aviso));
  if(sinVentas)avisos.push(`<strong>La planilla todavía no tiene cargadas las ventas de ${escapeHtml(temporada||'la temporada')}.</strong> Por ahora el resultado de cada local es solo su gasto acumulado. Se completa solo cuando carguen las ventas y el CMV en la planilla.`);
  $('rentStatus').hidden=!avisos.length;
  if(avisos.length){$('rentStatus').className=`rent-status${rs.aviso?' warning':''}`;$('rentStatus').innerHTML=`${RENT_ICONO_INFO}<div>${avisos.join('<br>')}</div>`}

  // ── Tarjetas ──
  const kpi=(label,valor,sub,tono,extra)=>`<div class="rent-kpi${tono?` ${tono}`:''}"><span class="rent-kpi-label">${label}</span><strong class="rent-kpi-value">${valor}</strong><span class="rent-kpi-sub">${sub||''}</span>${extra||''}</div>`;
  const pctDe=v=>venta?`${percent(v/venta*100)} de la venta`:'sin venta cargada';
  const partes=[['Plan de cuentas',tot['Gastos Plan de cuentas']],['Empleados',tot.Empleados],['Tarjeta',tot.Tarjeta],['IVA',tot.Iva]].filter(([,v])=>v);
  const barraGastos=tot['Gastos Total']&&partes.length>1?`<div class="rent-kpi-split">${partes.map(([n,v],i)=>`<i class="rent-split-${i}" style="width:${(v/tot['Gastos Total']*100).toFixed(2)}%" title="${n}: ${money(v)}"></i>`).join('')}</div>`:'';
  $('rentKpis').innerHTML=
    kpi('Venta total',money(venta),venta?`${number(conVenta.length)} de ${number(visibles.length)} locales con venta cargada`:'todavía sin cargar en la planilla')+
    kpi('CMV',money(tot.CMV),pctDe(tot.CMV))+
    kpi('Gastos',money(tot['Gastos Total']),partes.length?partes.map(([n,v])=>`${n} ${rentCorto(v)}`).join(' · '):'sin gastos cargados','',barraGastos)+
    kpi('Rentabilidad',money(rent),margen!==null?`${percent(margen*100)} sobre la venta`:'sin venta para calcular el margen',rent>=0?'good':'bad')+
    kpi('Locales en positivo',`${number(positivos)}<small> de ${number(visibles.length)}</small>`,positivos?'con rentabilidad mayor a $0':'ninguno por ahora',visibles.length&&positivos===visibles.length?'good':'');

  // ── Cascada: Venta → −CMV → −cada gasto → Rentabilidad ──
  const pasos=[{n:'Venta',v:venta,tipo:'suma'},{n:'CMV',v:-tot.CMV},{n:'Plan de cuentas',v:-tot['Gastos Plan de cuentas']},{n:'Empleados',v:-tot.Empleados},{n:'Tarjeta',v:-tot.Tarjeta},{n:'IVA',v:-tot.Iva}]
    .filter(p=>p.tipo==='suma'||p.v);
  let acum=0;
  const barras=pasos.map(p=>{const ini=acum;acum+=p.v;return{...p,tipo:p.tipo||'resta',ini,fin:acum}});
  barras.push({n:'Rentabilidad',v:acum,ini:0,fin:acum,tipo:'resultado'});
  const extremos=barras.flatMap(x=>[x.ini,x.fin]).concat(0);
  const lo=Math.min(...extremos),hi=Math.max(...extremos),rango=(hi-lo)||1;
  const Y=v=>(hi-v)/rango*100;
  $('rentWaterfall').innerHTML=`<div class="rent-wf-plot"><div class="rent-wf-cero" style="top:${Y(0).toFixed(2)}%"><span>$0</span></div>${barras.map(x=>{
    const top=Y(Math.max(x.ini,x.fin)),alto=Math.max(.6,Math.abs(Y(x.ini)-Y(x.fin)));
    const cls=x.tipo==='suma'?'suma':x.tipo==='resultado'?(x.v>=0?'resultado-pos':'resultado-neg'):'resta';
    // El valor va arriba de la barra si la barra sube y abajo si baja, para no taparla.
    const abajo=x.tipo==='resta'||(x.tipo==='resultado'&&x.v<0);
    return`<div class="rent-wf-col"><div class="rent-wf-bar ${cls}" style="top:${top.toFixed(2)}%;height:${alto.toFixed(2)}%" title="${escapeHtml(x.n)}: ${money(x.v)}"><span class="rent-wf-val${abajo?' abajo':''}">${x.v<0?'−':''}${rentCorto(x.v)}</span></div></div>`;
  }).join('')}</div><div class="rent-wf-labels">${barras.map(x=>`<span>${escapeHtml(x.n)}${venta&&x.tipo!=='suma'?`<em>${x.tipo==='resultado'?percent(x.v/venta*100):percent(Math.abs(x.v)/venta*100)}</em>`:''}</span>`).join('')}</div>`;
  $('rentWaterfallNote').textContent=filtro==='all'?`${visibles.length} locales · sin eCommerce`:rentNombre(filtro);

  // ── Resultado de cada local: barras divergentes desde $0 ──
  const orden=[...visibles].sort((x,y)=>(rentVal(y,'Rentabilidad')||0)-(rentVal(x,'Rentabilidad')||0));
  const maxAbs=Math.max(1,...orden.map(f=>Math.abs(rentVal(f,'Rentabilidad')||0)));
  const hayNeg=orden.some(f=>(rentVal(f,'Rentabilidad')||0)<0),hayPos=orden.some(f=>(rentVal(f,'Rentabilidad')||0)>0);
  const cero=hayNeg&&hayPos?50:hayNeg?100:0,mitad=hayNeg&&hayPos?50:100;   // dónde cae el $0 en la pista
  $('rentBars').innerHTML=orden.map(f=>{
    const r=rentVal(f,'Rentabilidad')||0,v=rentVal(f,'Venta Total')||0,ancho=Math.abs(r)/maxAbs*mitad,izq=r>=0?cero:cero-ancho;
    return`<div class="rent-bar-row"><span class="rent-bar-name">${escapeHtml(rentNombre(f.dash))}</span><div class="rent-bar-track"><div class="rent-bar-zero" style="left:${cero}%"></div><div class="rent-bar ${r>=0?'pos':'neg'}" style="left:${izq.toFixed(2)}%;width:${ancho.toFixed(2)}%"></div></div><span class="rent-bar-val ${r>=0?'good':'bad'}">${money(r)}<em>${v?`${percent(r/v*100)} de la venta`:'sin venta'}</em></span></div>`;
  }).join('')||'<div class="empty-state">Sin locales para este filtro</div>';
  $('rentBarsNote').textContent=sinVentas?'hoy: solo el gasto acumulado':'de mayor a menor';

  // ── Tabla como en la planilla: dos niveles de títulos y, debajo de cada monto, el % de la
  //    segunda fila del local (% facturado, conversión, % tarjeta, % CMV…) ──
  // La segunda línea (el % de abajo) solo se escribe si hay dato: donde la planilla tiene #DIV/0!, una
  // celda vacía se lee mejor que una columna llena de guiones repetidos.
  const celda=(valor,sub,cls='')=>`<td class="num${cls?` ${cls}`:''}">${valor}${sub!==undefined&&sub!==rentGuion?`<small>${sub}</small>`:''}</td>`;
  const fila=(f,nombre,clase)=>{
    const r=rentVal(f,'Rentabilidad'),pv=rentVal(f,'% Sobre la venta');
    return`<tr${clase?` class="${clase}"`:''}><td class="rent-local">${nombre}</td>`+
      celda(rentPlata(rentVal(f,'Venta Total')),undefined,'rent-col-venta')+
      celda(rentPlata(rentVal(f,'Facturado')),rentPct(rentVal(f,'% Facturado')))+
      celda(rentPlata(rentVal(f,'No facturado')),rentPct(rentVal(f,'% No facturado')))+
      celda(rentNum(rentVal(f,'Cantidad')))+
      celda(rentPlata(rentVal(f,'Precio Unitario')))+
      celda(rentNum(rentVal(f,'Tickets')))+
      celda(rentPlata(rentVal(f,'Ticket Promedio')))+
      celda(rentNum(rentVal(f,'Tráfico')),rentPct(rentVal(f,'Conversión')))+
      celda(rentNum(rentVal(f,'Ventas Fallidas')),rentPct(rentVal(f,'% Fallidas')))+
      celda(rentPlata(rentVal(f,'Gastos Total')),undefined,'rent-col-gastos')+
      celda(rentPlata(rentVal(f,'Gastos Plan de cuentas')),rentPct(rentVal(f,'% Gastos plan')))+
      celda(rentPlata(rentVal(f,'Empleados')))+
      celda(rentPlata(rentVal(f,'Tarjeta')),rentPct(rentVal(f,'% Tarjeta')))+
      celda(rentPlata(rentVal(f,'Iva')),rentPct(rentVal(f,'% Iva')))+
      celda(rentPlata(rentVal(f,'CMV')),rentPct(rentVal(f,'% CMV')),'rent-col-cmv')+
      celda(rentPlata(r),undefined,`rent-col-resultado${r===null?'':r>=0?' positive':' negative'}`)+
      celda(rentPct(pv),undefined,`rent-col-resultado${pv===null?'':pv>=0?' positive':' negative'}`)+'</tr>';
  };
  // Fila de total: sumas de lo que se ve; los % se recalculan sobre esas sumas solo si hay venta.
  const filaTotal={...tot,'% Sobre la venta':margen,
    '% Facturado':venta?tot.Facturado/venta:null,'% No facturado':venta?tot['No facturado']/venta:null,
    'Precio Unitario':tot.Cantidad?venta/tot.Cantidad:null,'Ticket Promedio':tot.Tickets?venta/tot.Tickets:null,
    'Conversión':tot['Tráfico']?tot.Tickets/tot['Tráfico']:null,'% Fallidas':null,
    '% Gastos plan':venta?tot['Gastos Plan de cuentas']/venta:null,'% CMV':venta?tot.CMV/venta:null,'% Tarjeta':null,'% Iva':null};
  ['Facturado','No facturado','Cantidad','Tickets','Tráfico','Ventas Fallidas','Empleados','Tarjeta','Iva'].forEach(k=>{if(!filaTotal[k])filaTotal[k]=null});
  const head=`<thead><tr class="rent-grupos"><th rowspan="2" class="rent-local">Local</th><th colspan="9" class="rent-g rent-g-ventas">Ventas</th><th colspan="5" class="rent-g rent-g-gastos">Gastos</th><th rowspan="2" class="rent-g rent-g-cmv">CMV</th><th rowspan="2" class="rent-g rent-g-resultado">Rentabilidad</th><th rowspan="2" class="rent-g rent-g-resultado">% sobre<br>la venta</th></tr><tr>${['Venta total','Facturado','No facturado','Cantidad','Precio unitario','Tickets','Ticket prom.','Tráfico','Ventas fallidas','Total','Plan de cuentas','Empleados','Tarjeta','IVA'].map(t=>`<th class="align-right">${t}</th>`).join('')}</tr></thead>`;
  const cuerpo=orden.map(f=>fila(f,`${escapeHtml(rentNombre(f.dash))}<small>${escapeHtml(f.Local)}${f['Código']?` · ${escapeHtml(f['Código'])}`:''}</small>`)).join('');
  const pie=(visibles.length>1?fila(filaTotal,`Total<small>${number(visibles.length)} locales</small>`,'rent-total'):'')+
    (ecommerce?`<tr class="rent-sep"><td colspan="18"></td></tr>`+fila(ecommerce,'eCommerce<small>no entra en el total</small>','rent-ecom'):'');
  $('rentabilidadTable').innerHTML=`${head}<tbody>${cuerpo}</tbody><tfoot>${pie}</tfoot>`;
  $('rentabilidadRowsCount').textContent=`${visibles.length} local${visibles.length===1?'':'es'}${temporada?` · ${temporada}`:''}`;
  const notas=[];
  if(filtro==='all'&&soloPlanilla.length)notas.push(`En la planilla pero no en el dashboard: ${soloPlanilla.join(', ')}.`);
  if(filtro==='all'&&soloDashboard.length)notas.push(`En el dashboard pero todavía no en la planilla: ${soloDashboard.map(rentNombre).join(', ')}.`);
  notas.push('Los totales suman solo los locales de esta tabla y, como en la planilla, no incluyen eCommerce.');
  $('rentFoot').textContent=notas.join(' ');
}

function scheduleRefresh(){clearInterval(state.timer);state.timer=null}
$('overviewGreeting').textContent=pickGreeting();
applyTheme(localStorage.getItem('vdh-theme')||'dark');qa('.theme-btn').forEach(btn=>btn.addEventListener('click',()=>applyTheme(btn.dataset.themeChoice)));$('refreshButton').addEventListener('click',loadData);$('clearFilters').addEventListener('click',()=>{['localFilter','sellerFilter'].forEach(id=>$(id).value='all');fillSellerFilter();['metricsMonthFilter','accessoryMonthFilter'].forEach(id=>$(id).value='all');fillPeriodFilters('metricsMonthFilter','metricsWeekFilter');fillPeriodFilters('accessoryMonthFilter','accessoryWeekFilter');['metricsWeekFilter','accessoryWeekFilter'].forEach(id=>$(id).value='all');resetPeriodPicker();render()});$('localFilter').addEventListener('change',()=>{fillSellerFilter();render()});$('sellerFilter').addEventListener('change',render);[['metricsMonthFilter','metricsWeekFilter'],['accessoryMonthFilter','accessoryWeekFilter']].forEach(([month,week])=>{$(month).addEventListener('change',()=>{fillPeriodFilters(month,week);render()});$(week).addEventListener('change',render)});qa('.nav-item,.jump-view').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));qa('#storeViewTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.storeTab=button.dataset.tab;applyStoreTab()}));qa('#storeKpiGrid .store-kpi-card').forEach(button=>button.addEventListener('click',()=>{state.storeMetric=button.dataset.storeMetric;renderStores()}));qa('#sellerViewTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.sellerTab=button.dataset.tab;applySellerTab()}));qa('#rankScopeTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.rankScope=button.dataset.scope;renderRanking()}));qa('#sellerCatTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.sellerCategory=button.dataset.category;renderRanking()}));qa('#storeCatTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.storeCategory=button.dataset.storeCategory;renderRanking()}));qa('#rankSortToggle .rank-tab-sm').forEach(button=>button.addEventListener('click',()=>{state.rankSortMode=button.dataset.sort;renderRanking()}));qa('#evolutionScopeToggle .rank-tab-sm').forEach(button=>button.addEventListener('click',()=>{state.evoScope=button.dataset.evoscope;renderRanking()}));qa('.filters input,.seller-period-filters input').forEach(control=>control.addEventListener('change',render));
// ── BOTTOM NAV + DRAWER (mobile) ──────────────────────────────
qa('.bottom-nav-item[data-view]').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view)));
function openMainDrawer(){$('mainDrawerBackdrop').hidden=false;$('mainDrawerPanel').hidden=false;$('mainDrawerToggle').setAttribute('aria-expanded','true')}
function closeMainDrawer(){$('mainDrawerBackdrop').hidden=true;$('mainDrawerPanel').hidden=true;$('mainDrawerToggle').setAttribute('aria-expanded','false')}
$('mainDrawerToggle').addEventListener('click',openMainDrawer);
$('mainDrawerClose').addEventListener('click',closeMainDrawer);
$('mainDrawerBackdrop').addEventListener('click',closeMainDrawer);
qa('.drawer-item[data-drawer-view]').forEach(btn=>btn.addEventListener('click',()=>{switchView(btn.dataset.drawerView);closeMainDrawer()}));
initPeriodPicker();
applyPeriodPreset(PERIODO_POR_DEFECTO,false);
// Cambiar de mes vuelve a la última fecha de ese mes.
$('rankMonthSelect').addEventListener('change',e=>{state.rankMonth=e.target.value;state.rankWeek=null;renderRanking()});
$('rankWeekSelect').addEventListener('change',e=>{state.rankWeek=e.target.value;renderRanking()});
scheduleRefresh();loadData();

// Detecta cuando hay una versión nueva del sitio ya publicada (el SW la baja solo en segundo
// plano) y muestra el cartel de "Actualizar" en vez de dejar la actualización pasar calladita.
// Escucha 'controllerchange' en vez de 'updatefound'/'statechange' del worker instalando (como se
// hacía antes): sw.js llama a skipWaiting()+clients.claim() apenas se instala, sin esperar a que
// se cierren las pestañas viejas, y esa transición puede pasar tan rápido que el estado
// "installed" nunca llega a engancharse a tiempo — carrera de tiempos real, confirmada en uso
// (el cartel no aparecía pese a que la versión sí se actualizaba, gracias a que sw.js ya pide todo
// a la red primero). 'controllerchange' en cambio se dispara siempre que el control efectivamente
// cambia de manos, sin importar cuán rápido haya sido skipWaiting — mismo arreglo aplicado en el
// Ranking VDH (repo hermano), donde se confirmó el mismo bug.
// hadController se guarda ANTES de registrar nada: si ya es true, esta pestaña venía controlada
// por un SW previo y cualquier controllerchange posterior es una actualización real. Si es false,
// es la primera visita (no hay "versión anterior" de la que avisar) y no se engancha el listener.
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    const hadController=!!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(()=>{
      if(hadController){
        navigator.serviceWorker.addEventListener('controllerchange',()=>{
          $('updateBanner').hidden=false;
        });
      }
    }).catch(()=>{});
  });
  $('updateBannerBtn').addEventListener('click',()=>location.reload());
}
// El cartel de arriba solo salta cuando cambia sw.js, y casi todos los deploys tocan app.js o
// styles.css, no sw.js: una pestaña abierta antes de publicar seguía corriendo el código viejo, y el
// botón ↻ solo vuelve a pedir los DATOS, no recarga el código. Pasó el 2026-10-04: Rentabilidad
// seguía mostrando la maqueta con la versión nueva ya publicada. Ahora se anota la versión de app.js
// al abrir (ETag de GitHub Pages) y se compara cada vez que se toca ↻ o se vuelve a la pestaña; si
// cambió, aparece el mismo cartel de "Actualizar".
//
// OJO: loadData() se llama al arrancar, ANTES de que la ejecución llegue a estas líneas. Por eso
// esto va con `var` y `function` (se pueden usar desde antes de su línea) y nunca con let/const:
// con `let`, loadData tiraba "Cannot access 'versionAlAbrir' before initialization" y el dashboard
// no cargaba NADA (2026-10-04). Y todo va adentro de try/catch: avisar de una versión nueva es un
// extra, jamás puede frenar la carga de datos.
var versionAlAbrir=null;
function versionPublicada(){return fetch('app.js',{method:'HEAD',cache:'no-store'}).then(r=>r.headers.get('etag')||r.headers.get('last-modified')).catch(()=>null)}
function chequearVersionNueva(){
  try{
    if(!versionAlAbrir)return;
    versionPublicada().then(v=>{if(v&&v!==versionAlAbrir)$('updateBanner').hidden=false}).catch(()=>{});
  }catch(e){}
}
try{versionPublicada().then(v=>{versionAlAbrir=v}).catch(()=>{})}catch(e){}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')chequearVersionNueva()});


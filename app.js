const DATA_ENDPOINT='https://script.google.com/macros/s/AKfycbyuS6K8oq2KWJ6BMSayHXHHSf0v2jr70OoSD4UfwX77cD3OobN1OrzFsTTXC6JI9Yo/exec';
const state={endpoint:DATA_ENDPOINT||localStorage.getItem('vdh-endpoint')||'',tables:{},view:'overview',timer:null,sort:{key:null,direction:1,table:null},rankCategory:'ticket',rankSortMode:'units',rankScope:'liga',evoScope:'seller',storeTab:'resumen',sellerTab:'resumen',storeMetric:'venta'};
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
const tableNames=['LOCAL_DIARIO','VENDEDOR_DIARIO','VENDEDOR_SEMANAL','VENDEDOR_FOTOS','ECOM_DIARIO','ECOM_SEMANAL'];
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
function normalizeDate(value){if(value instanceof Date&&!Number.isNaN(value.getTime()))return value.toISOString().slice(0,10);const text=String(value??'').trim();if(!text)return '';const iso=text.match(/^(\d{4})-(\d{2})-(\d{2})/);if(iso)return iso.slice(1).join('-');const dmy=text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);if(dmy)return `${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`;const parsed=new Date(text);return Number.isNaN(parsed.getTime())?'':parsed.toISOString().slice(0,10)}
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function normalizeLocalName(value){const text=String(value??'').trim();return text?text.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()):text}
function normalizeLocalNames(tables){Object.keys(tables).forEach(name=>{(tables[name]||[]).forEach(row=>{if(row&&typeof row==='object'&&'Local'in row)row.Local=normalizeLocalName(row.Local)})})}
function setStatus(text,online=false){$('connectionLabel').textContent=text;$('dataStatus').textContent=text;q('.pulse').classList.toggle('online',online)}
function showError(text){$('errorBanner').textContent=text;$('errorBanner').hidden=!text}
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
function updatePeriod(){$('periodBadge').textContent=$('fromDate').value||$('toDate').value?`${$('fromDate').value||'inicio'} → ${$('toDate').value||'hoy'}`:'Semestre completo'}
function todayKey(){const today=new Date();return `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`}
function lastLoadedDate(name){const rows=state.tables[name]||[];const dates=rows.filter(row=>num(row,'Venta real')||num(row,'Tráfico real')||num(row,'Ticket prom.')).map(row=>normalizeDate(row.Fecha)).filter(Boolean).sort();return dates.length?dates[dates.length-1]:''}
function objectiveCutoff(){return $('toDate').value||lastLoadedDate('LOCAL_DIARIO')||todayKey()}
function rowsThroughToday(rows){const cutoff=objectiveCutoff();return rows.filter(row=>{const date=normalizeDate(row.Fecha||row['Fecha foto']);return date&&date<=cutoff})}
async function loadData(){if(!state.endpoint){setStatus('Sin configurar');showError('No hay una fuente de datos configurada en este navegador.');return}setStatus('Conectando...');showError('');const controller=new AbortController();const timeoutId=setTimeout(()=>controller.abort(),20000);try{const response=await fetch(state.endpoint,{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();state.tables=Array.isArray(data)?{LOCAL_DIARIO:data}:{...data};normalizeLocalNames(state.tables);fillFilters();render();const now=new Date();const stamp=now.toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'});$('lastRefresh').textContent=`actualizado ${stamp}`;$('footerUpdated').textContent=`Última actualización: ${stamp}`;$('overviewUpdated').textContent=`Datos actualizados ${stamp}`;setStatus('Conectado',true)}catch(error){const timedOut=error.name==='AbortError';setStatus('Error de conexión');showError(timedOut?'El consolidador tardó demasiado en responder (más de 20s). Probá actualizar de nuevo.':`No se pudieron cargar los datos del consolidado. Detalle: ${error.message}`)}finally{clearTimeout(timeoutId)}}
function metricsCard(label,value,detail='',tone=''){return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-detail ${tone}">${detail}</div></div>`}
function aggregate(rows){return rows.reduce((acc,row)=>{acc.target+=num(row,'Objetivo')||num(row,'Venta obj');acc.actual+=num(row,'Venta real')||num(row,'Facturación');acc.traffic+=num(row,'Tráfico real')||num(row,'Visitas');acc.targetTraffic+=num(row,'Tráfico nec.')||num(row,'Tráfico obj');acc.orders+=num(row,'Q Ventas')||num(row,'Compras');return acc},{target:0,actual:0,traffic:0,targetTraffic:0,orders:0})}
function statusTone(value){return value>=1?'good':value>=.9?'warning':'bad'}
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
function kpiCard(label,value,detailText,detailTone,trendHtml,subText){
  return `<div class="metric-card${trendHtml?' kpi-card':''}"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-detail ${detailTone}">${detailText}</div>${trendHtml||''}${subText?`<div class="kpi-subtrend">${subText}</div>`:''}</div>`;
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
    if(!groups[key])groups[key]={local:key,traffic:0,targetTraffic:0,convSum:0,convCount:0,convObjSum:0,convObjCount:0,ticketSum:0,ticketCount:0,ticketObjSum:0,ticketObjCount:0,count:0};
    const g=groups[key];
    g.traffic+=num(row,'Tráfico real');g.targetTraffic+=num(row,'Tráfico nec.')||num(row,'Tráfico obj');
    const conv=num(row,'Conversión'),convObj=num(row,'Conversión obj');
    if(conv||conv===0){g.convSum+=conv;g.convCount++}
    if(convObj){g.convObjSum+=convObj;g.convObjCount++}
    const ticket=num(row,'Ticket prom.'),ticketObj=num(row,'Ticket obj');
    if(ticket||ticket===0){g.ticketSum+=ticket;g.ticketCount++}
    if(ticketObj){g.ticketObjSum+=ticketObj;g.ticketObjCount++}
    g.count++;
  });
  return Object.values(groups).map(g=>{
    // Conversión/Ticket obj son un valor mensual constante repetido por día — promediar dividiendo
    // por g.count (TODOS los días del período) diluía el % apenas faltara un solo día con esa
    // columna sin cargar (ej. columna agregada a mitad de mes). Ahora se divide por la cantidad de
    // días donde el objetivo realmente vino cargado, igual que ya hacía avgConv/avgTicket con los
    // valores reales (bug real, auditoría 2026-09-05).
    const avgConv=g.convCount?g.convSum/g.convCount:0,avgConvObj=g.convObjCount?g.convObjSum/g.convObjCount:0;
    const avgTicket=g.ticketCount?g.ticketSum/g.ticketCount:0,avgTicketObj=g.ticketObjCount?g.ticketObjSum/g.ticketObjCount:0;
    const trafficRatio=g.targetTraffic?g.traffic/g.targetTraffic:null;
    return{
      local:g.local,traffic:g.traffic,avgConv,avgConvObj,avgTicket,avgTicketObj,trafficRatio,
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
  $('storeFocusTable').innerHTML=focusRows.length?`<thead><tr><th>Local</th><th>Conversión</th><th>Ticket promedio</th><th>Tráfico</th><th>Foco</th></tr></thead><tbody>${focusRows.map(r=>{const tag=focusTag([{label:'Tráfico',gap:r.trafficGapPct},{label:'Conversión',gap:r.convGapPct},{label:'Ticket',gap:r.ticketGapPct}]);return `<tr><td class="seller-name">${escapeHtml(r.local)}</td><td class="num">${percent(r.avgConv*100)}${r.avgConvObj?` · obj. ${percent(r.avgConvObj*100)}`:''}</td><td class="num">${money(r.avgTicket)}${r.avgTicketObj?` · obj. ${money(r.avgTicketObj)}`:''}</td><td class="num">${r.trafficRatio!==null?percent(r.trafficRatio*100):number(r.traffic||0)}</td><td class="num ${tag.tone}">${tag.label}</td></tr>`}).join('')}</tbody>`:'<tbody><tr><td colspan="5" class="empty-state">Sin datos para estos filtros</td></tr></tbody>';
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
    const convObj=num(row,'Conversión obj'),ticketObj=num(row,'Ticket obj');
    if(convObj){acc.convObj+=convObj;acc.convObjCount++}
    if(ticketObj){acc.ticketObj+=ticketObj;acc.ticketObjCount++}
    return acc;
  },{convObj:0,convObjCount:0,ticketObj:0,ticketObjCount:0});
  return{convObj:totals.convObjCount?totals.convObj/totals.convObjCount:0,ticketObj:totals.ticketObjCount?totals.ticketObj/totals.ticketObjCount:0};
}
function computeSellerFocusRows(list,month){
  const cache={};
  return list.map(row=>{
    const avgConv=row.count?row.conversion/row.count:0,avgTicket=row.count?row.ticket/row.count:0;
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
  $('sellerFocusTable').innerHTML=focusRows.length?`<thead><tr><th>Vendedor</th><th>Local</th><th>Conversión</th><th>Ticket promedio</th><th>Foco</th></tr></thead><tbody>${focusRows.map(r=>{const tag=focusTag([{label:'Conversión',gap:r.convGapPct},{label:'Ticket',gap:r.ticketGapPct}]);return `<tr><td class="seller-name">${escapeHtml(r.name)}</td><td class="seller-location">${escapeHtml(r.local)}</td><td class="num">${percent(r.avgConv*100)}${r.avgConvObj?` · obj. ${percent(r.avgConvObj*100)}`:''}</td><td class="num">${money(r.avgTicket)}${r.avgTicketObj?` · obj. ${money(r.avgTicketObj)}`:''}</td><td class="num ${tag.tone}">${tag.label}</td></tr>`}).join('')}</tbody>`:'<tbody><tr><td colspan="5" class="empty-state">Sin datos para estos filtros</td></tr></tbody>';
}
// Pestañas "Resumen"/"Foco" de Locales y Métricas vendedores — mismo patrón que rankScopeTabs de
// Ranking (tabs con data-tab + toggle de "active" y de paneles hidden), sin acoplarlas entre sí:
// cada sección tiene su propio estado, se puede estar en "Foco" de Locales y "Resumen" de vendedores.
function applyStoreTab(){
  qa('#storeViewTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===state.storeTab));
  $('storeResumenPanel').hidden=state.storeTab!=='resumen';
  $('storeFocusPanel').hidden=state.storeTab!=='foco';
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
    const base={...partes[0]};
    base.Local=localesDistintos.sort().join(' + ');
    ['Venta obj','Venta real','Tráfico real','Perfumes obj','Perfumes real','Boxer obj','Boxer real'].forEach(c=>{base[c]=sumaCol(c)});
    base['Conv real']=promedioCol('Conv real','Tráfico real');
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
  return {rows:fusionarVendedoresCompartidos(rows),weekKeys};
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
const F1_MAIN_POINTS=[25,18,15,12,10,8,6,4,2,1];
const F1_SPRINT_POINTS=[8,7,6,5,4,3,2,1];
const F1_SPRINT_FIELDS={ticket:'TP',perfumes:'Perfumes',boxer:'Boxer',pxt:'PxT'};
function f1AllWeekKeys(){const rows=state.tables.VENDEDOR_SEMANAL||[];return[...new Set(rows.map(weekKeyOf))].sort((a,b)=>weekKeyOrder(a)-weekKeyOrder(b))}
// Fundida siempre: f1WeekRows solo se usa para puntajes de PERSONAS (Liga/Sprints/GP VDH), nunca
// para rankear locales, así que no hace falta una variante "cruda" acá como currentWeekRows/
// currentWeekRowsPersonas.
function f1WeekRows(weekKey){return fusionarVendedoresCompartidos((state.tables.VENDEDOR_SEMANAL||[]).filter(r=>weekKeyOf(r)===weekKey))}
// Empates: si dos personas quedan exactamente igual en % de cumplimiento, la posición (y los
// puntos F1/Sprint que reparte esa posición) se define por mayor venta/unidad absoluta real y,
// si también empatan ahí, alfabético — determinístico siempre, nunca "quien cargó primero en la
// planilla" (Array.sort es estable, pero el orden de origen no tiene ningún criterio de negocio).
function f1RatioStandings(weekKey,field){
  const realKey=field?`${field} real`:'Venta real',objKey=field?`${field} obj`:'Venta obj';
  const list=f1WeekRows(weekKey).map(row=>{const real=num(row,realKey),obj=num(row,objKey);return{local:row.Local,name:row.Vendedor,real,obj,ratio:obj?real/obj*100:null}}).filter(p=>p.ratio!==null);
  list.sort((a,b)=>(b.ratio-a.ratio)||(b.real-a.real)||String(a.name).localeCompare(String(b.name),'es'));
  return list;
}
function buildGrandPrixStandings(){
  const weeks=f1AllWeekKeys();
  if(!weeks.length)return{list:[],month:null,weeks:[]};
  const month=weeks[weeks.length-1].split('|')[0];
  const monthWeeks=weeks.filter(k=>k.split('|')[0]===month);
  const totals={};
  // Se acumula por NOMBRE solo, no por Local+Nombre: si una persona cubrió dos locales una semana
  // del mes y solo uno otra semana, su etiqueta de Local fundida (ver fusionarVendedoresCompartidos)
  // puede variar semana a semana — con la clave vieja `${local}|${name}` eso partía sus puntos del
  // mes en dos "pilotos" distintos. `locales` junta la unión de todos los locales que pisó en el
  // mes para mostrarla en la tabla (bug real, auditoría 2026-09-05).
  const ensure=name=>{if(!totals[name])totals[name]={name,locales:new Set(),main:0,sprint:0,breakdown:{ticket:0,perfumes:0,boxer:0,pxt:0}};return totals[name]};
  monthWeeks.forEach(weekKey=>{
    f1RatioStandings(weekKey,null).slice(0,10).forEach((p,i)=>{const e=ensure(p.name);e.main+=F1_MAIN_POINTS[i];p.local.split(' + ').forEach(l=>e.locales.add(l))});
    Object.entries(F1_SPRINT_FIELDS).forEach(([cat,field])=>{
      f1RatioStandings(weekKey,field).slice(0,8).forEach((p,i)=>{const e=ensure(p.name);e.sprint+=F1_SPRINT_POINTS[i];e.breakdown[cat]+=F1_SPRINT_POINTS[i];p.local.split(' + ').forEach(l=>e.locales.add(l))});
    });
  });
  const list=Object.values(totals).map(e=>({...e,local:[...e.locales].sort().join(' + '),total:e.main+e.sprint}));
  list.sort((a,b)=>(b.total-a.total)||(b.main-a.main)||String(a.name).localeCompare(String(b.name),'es'));
  return{list,month,weeks:monthWeeks};
}
function showRankGrandPrixEmpty(){
  $('rankingPeriodBadge').textContent='Sin fecha';
  $('gpMetrics').innerHTML='';
  $('gpTable').innerHTML='';
  $('gpRowsCount').textContent='';
}
function renderRankGrandPrix(){
  const{list,month,weeks}=buildGrandPrixStandings();
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

  $('gpMetrics').innerHTML=
    metricsCard('Pilotos puntuando',number(list.length),'con al menos 1 punto este mes')+
    (leader?metricsCard('Líder',escapeHtml(leader.name),`${number(leader.total)} pts · ${escapeHtml(leader.local)}`,'good'):metricsCard('Líder','—',''))+
    metricsCard('Fechas corridas',number(weeks.length),month)+
    metricsCard('Puntos repartidos',number(totalPts),'Carrera Principal + Sprints VDH');

  const body=filtered.map(p=>{
    const i=list.indexOf(p),b=p.breakdown;
    return `<tr><td class="num">${rankPos(i)}</td><td class="seller-name">${escapeHtml(p.name)}</td><td class="seller-location">${escapeHtml(p.local)}</td><td class="num">${number(p.main)}</td><td class="num">${number(b.ticket)}</td><td class="num">${number(b.perfumes)}</td><td class="num">${number(b.boxer)}</td><td class="num">${number(b.pxt)}</td><td class="num"><strong>${number(p.total)}</strong></td></tr>`;
  }).join('');
  const head=`<thead><tr><th>#</th><th>Vendedor</th><th>Local</th><th>Principal</th><th>Sprint Ticket</th><th>Sprint Perfumes</th><th>Sprint Boxer</th><th>Sprint PxT</th><th>Total</th></tr></thead>`;
  $('gpTable').innerHTML=filtered.length?`${head}<tbody>${body}</tbody>`:`${head}<tbody><tr><td colspan="9" class="empty-state">Sin puntos para estos filtros</td></tr></tbody>`;
  $('gpRowsCount').textContent=filtered.length?`${filtered.length} de ${list.length} pilotos`:'';
}
// Insignias quedó sin botón en el menú (pedido explícito de limpieza) pero el código de
// renderRankBadges() sigue acá sin usarse — reactivarla es agregar de vuelta su botón a
// #rankScopeTabs, nada de esto se borró.
const RANK_SHARED_SCOPES=['liga','mejora','sprints'];
const SPRINT_CATEGORIES=['ticket','perfumes','boxer','pxt'];
function renderRanking(){
  qa('#rankScopeTabs .rank-tab').forEach(btn=>btn.classList.toggle('active',btn.dataset.scope===state.rankScope));
  $('rankSellersPanel').hidden=!RANK_SHARED_SCOPES.includes(state.rankScope);
  $('rankStoresPanel').hidden=state.rankScope!=='stores';
  $('rankGpPanel').hidden=state.rankScope!=='campeonato';
  $('rankReglasPanel').hidden=state.rankScope!=='reglas';
  $('rankEvolutionPanel').hidden=state.rankScope!=='evolution';
  $('sprintPicker').hidden=state.rankScope!=='sprints';
  if(state.rankScope==='stores'){renderRankStores();return}
  if(state.rankScope==='campeonato'){renderRankGrandPrix();return}
  if(state.rankScope==='evolution'){renderRankEvolution();return}
  if(state.rankScope==='reglas'){$('rankingPeriodBadge').textContent='Reglamento';return}

  let category;
  if(state.rankScope==='sprints'){
    if(!SPRINT_CATEGORIES.includes(state.rankCategory))state.rankCategory='ticket';
    category=state.rankCategory;
    $('sprintCategorySelect').value=category;
  }else{
    category=state.rankScope; // 'liga' o 'mejora'
  }
  const cfg=RANK_CATEGORIES[category];
  $('rankingKicker').textContent=cfg.kicker;
  $('rankingHeading').textContent=cfg.heading;
  const toggle=$('rankSortToggle');
  toggle.hidden=!cfg.sortable;
  if(cfg.sortable)qa('#rankSortToggle .rank-tab-sm').forEach(btn=>btn.classList.toggle('active',btn.dataset.sort===state.rankSortMode));
  if(category==='mejora')renderRankMejora();
  else renderRankCategory(category);
}
function renderRankStores(){
  const {rows,weekKeys}=currentWeekRows();
  if(!weekKeys.length){
    $('rankingPeriodBadge').textContent='Sin semana';
    $('storeRankMetrics').innerHTML='';
    $('storeRankTable').innerHTML='';
    $('storeRankRowsCount').textContent='';
    return;
  }
  const currentKey=weekKeys[weekKeys.length-1],prevKey=weekKeys.length>1?weekKeys[weekKeys.length-2]:null;
  const [currentMes,currentSemana]=currentKey.split('|');
  $('rankingPeriodBadge').textContent=prevKey?`Semana ${currentSemana} de ${currentMes} vs. semana anterior`:`Semana ${currentSemana} de ${currentMes} · primera semana registrada`;

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
  const currentAgg=aggregateByLocal(currentKey),prevAgg=prevKey?aggregateByLocal(prevKey):{};

  const rachaByLocal={};
  rows.filter(row=>weekKeyOf(row)===currentKey).forEach(row=>{
    const key=row.Local||'Sin local',target=num(row,'Venta obj'),ratio=target?num(row,'Venta real')/target*100:0;
    if(!rachaByLocal[key])rachaByLocal[key]=0;
    if(ratio>=100)rachaByLocal[key]++;
  });

  const list=Object.keys(currentAgg).map(local=>{
    const cur=currentAgg[local],actualRatio=cur.target?cur.actual/cur.target*100:null;
    const prev=prevAgg[local],prevRatio=prev&&prev.target?prev.actual/prev.target*100:null;
    const mejora=(actualRatio!==null&&prevRatio!==null)?actualRatio-prevRatio:null;
    return{local,actual:cur.actual,target:cur.target,actualRatio,prevRatio,mejora,enRacha:rachaByLocal[local]||0};
  });

  list.sort((a,b)=>{
    if(a.mejora!==null&&b.mejora!==null){if(b.mejora!==a.mejora)return b.mejora-a.mejora}
    else if(a.mejora!==null)return -1;
    else if(b.mejora!==null)return 1;
    const ar=a.actualRatio??-Infinity,br=b.actualRatio??-Infinity;
    if(br!==ar)return br-ar;
    return String(a.local).localeCompare(String(b.local),'es');
  });

  const withMejora=list.filter(p=>p.mejora!==null);
  const enMejora=withMejora.filter(p=>p.mejora>0).length;
  const avgMejora=withMejora.length?withMejora.reduce((sum,p)=>sum+p.mejora,0)/withMejora.length:0;
  const top=withMejora[0];
  const parejo=list.length?list.reduce((a,b)=>b.enRacha>a.enRacha?b:a):null;

  $('storeRankMetrics').innerHTML=list.length?
    metricsCard('Locales rankeados',number(list.length),'según filtros')+
    metricsCard('En mejora',number(enMejora),withMejora.length?`de ${withMejora.length} con semana anterior`:'sin semana anterior para comparar')+
    (top?metricsCard('Mayor mejora',escapeHtml(top.local),`${top.mejora>=0?'+':''}${top.mejora.toFixed(1)} pts`,top.mejora>=0?'good':'bad'):metricsCard('Mayor mejora','—','esperando 2ª semana'))+
    (parejo&&parejo.enRacha>0?metricsCard('Equipo más parejo',escapeHtml(parejo.local),`${parejo.enRacha} vendedor(es) en objetivo`,'good'):metricsCard('Equipo más parejo','—','nadie en objetivo esta semana'))
    :'';

  const body=list.map((p,i)=>{
    const trophy=i===0?` ${icon('trophy','trophy-icon')}`:'';
    const mejoraCell=p.mejora!==null?`<span class="${p.mejora>=0?'positive':'negative'}">${p.mejora>=0?'+':''}${p.mejora.toFixed(1)} pts</span>`:'<span class="missing-value">Primera semana</span>';
    const trend=p.mejora===null?'—':p.mejora>0?'<span class="trend-up">▲</span>':p.mejora<0?'<span class="trend-down">▼</span>':'<span class="trend-flat">■</span>';
    return `<tr><td class="num">${rankPos(i)}${trophy}</td><td class="seller-name">${escapeHtml(p.local)}</td><td class="num">${money(p.actual)}</td><td class="num">${p.actualRatio!==null?percent(p.actualRatio):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${p.prevRatio!==null?percent(p.prevRatio):'—'}</td><td class="num">${mejoraCell}</td><td class="num">${trend}</td><td class="num">${p.enRacha}</td></tr>`;
  }).join('');

  $('storeRankTable').innerHTML=list.length?
    `<thead><tr><th>#</th><th>Local</th><th>Venta real</th><th>% semana actual</th><th>% semana anterior</th><th>Mejora</th><th>Tendencia</th><th>En objetivo</th></tr></thead><tbody>${body}</tbody>`
    :`<thead><tr><th>#</th><th>Local</th><th>Venta real</th><th>% semana actual</th><th>% semana anterior</th><th>Mejora</th><th>Tendencia</th><th>En objetivo</th></tr></thead><tbody><tr><td colspan="8" class="empty-state">Sin datos para estos filtros</td></tr></tbody>`;
  $('storeRankRowsCount').textContent=list.length?`${list.length} locales`:'';
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
    groups[key].weeks.push({weekKey:weekKeyOf(row),ratio:obj?num(row,'Venta real')/obj*100:null,tp:num(row,'TP real'),conv:num(row,'Conv real'),pxt:num(row,'PxT real')});
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
    const conv=num(row,'Conv real');if(conv){w.convSum+=conv;w.convCount++}
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

  const metricMeta={tp:{label:'Ticket promedio',icon:'tag',fmt:money},conv:{label:'Conversión',icon:'target',fmt:percent},pxt:{label:'PxT',icon:'shirt',fmt:number}};
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
    return `<tr><td class="seller-name">Semana ${semana} de ${mes}</td><td class="num">${w.ratio!==null?percent(w.ratio):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${mejora!==null?`<span class="${mejora>=0?'positive':'negative'}">${mejora>=0?'+':''}${mejora.toFixed(1)} pts</span>`:'—'}</td><td class="num">${w.tp?money(w.tp):'—'}</td><td class="num">${w.conv?percent(w.conv):'—'}</td><td class="num">${w.pxt?number(w.pxt):'—'}</td></tr>`;
  }).join('');
  $('evolutionTable').innerHTML=`<thead><tr><th>Semana</th><th>% cumplimiento</th><th>Mejora</th><th>Ticket prom.</th><th>Conversión</th><th>PxT</th></tr></thead><tbody>${rows}</tbody>`;

  const badgeMeta={tp:{label:'Ticket promedio',icon:'tag',fmt:money},conv:{label:'Conversión',icon:'target',fmt:percent},pxt:{label:'PxT',icon:'shirt',fmt:number}};
  $('evolutionBadges').innerHTML=recordBadges.length?recordBadges.map(m=>{const meta=badgeMeta[m];return `<div class="badge-row"><span class="badge-icon">${icon(meta.icon)}</span><div class="badge-info"><strong>Récord de ${meta.label}</strong><span>esta semana</span></div><span class="badge-value">${meta.fmt(rec[m].value)}</span></div>`}).join(''):'<div class="empty-state">Sin récords nuevos esta semana</div>';
}
function renderRankMejora(){
  const {rows,weekKeys}=currentWeekRowsPersonas();
  if(!weekKeys.length){showRankingEmpty();return}
  const currentKey=weekKeys[weekKeys.length-1],prevKey=weekKeys.length>1?weekKeys[weekKeys.length-2]:null;
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
    const mejora=(actualRatio!==null&&prevRatio!==null)?actualRatio-prevRatio:null;
    return{...p,local:p.actual.Local,actualRatio,prevRatio,mejora};
  });

  list.sort((a,b)=>{
    if(a.mejora!==null&&b.mejora!==null){if(b.mejora!==a.mejora)return b.mejora-a.mejora}
    else if(a.mejora!==null)return -1;
    else if(b.mejora!==null)return 1;
    const ar=a.actualRatio??-Infinity,br=b.actualRatio??-Infinity;
    if(br!==ar)return br-ar;
    return String(a.name).localeCompare(String(b.name),'es');
  });

  const withMejora=list.filter(p=>p.mejora!==null);
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
    const mejoraCell=p.mejora!==null?`<span class="${p.mejora>=0?'positive':'negative'}">${p.mejora>=0?'+':''}${p.mejora.toFixed(1)} pts</span>`:'<span class="missing-value">Primera semana</span>';
    const trend=p.mejora===null?'—':p.mejora>0?'<span class="trend-up">▲</span>':p.mejora<0?'<span class="trend-down">▼</span>':'<span class="trend-flat">■</span>';
    return `<tr><td class="num">${rankPos(i)}</td><td class="seller-name">${escapeHtml(p.name)}</td><td class="seller-location">${escapeHtml(p.local)}</td><td class="num">${p.actualRatio!==null?percent(p.actualRatio):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${p.prevRatio!==null?percent(p.prevRatio):'—'}</td><td class="num">${mejoraCell}</td><td class="num">${trend}</td></tr>`;
  }).join('');

  $('rankingTable').innerHTML=list.length?
    `<thead><tr><th>#</th><th>Vendedor</th><th>Local</th><th>% semana actual</th><th>% semana anterior</th><th>Mejora</th><th>Tendencia</th></tr></thead><tbody>${body}</tbody>`
    :`<thead><tr><th>#</th><th>Vendedor</th><th>Local</th><th>% semana actual</th><th>% semana anterior</th><th>Mejora</th><th>Tendencia</th></tr></thead><tbody><tr><td colspan="7" class="empty-state">Sin datos para estos filtros</td></tr></tbody>`;
  $('rankingRowsCount').textContent=list.length?`${list.length} vendedores`:'';
}
function renderRankCategory(category){
  const cfg=RANK_CATEGORIES[category];
  const mode=cfg.sortable?state.rankSortMode:cfg.mode;
  const {rows,weekKeys}=currentWeekRowsPersonas();
  if(!weekKeys.length){showRankingEmpty();return}
  const currentKey=weekKeys[weekKeys.length-1];
  const [currentMes,currentSemana]=currentKey.split('|');
  $('rankingPeriodBadge').textContent=`Fecha ${currentSemana} de ${currentMes}`;

  const realKey=cfg.field?`${cfg.field} real`:'Venta real',objKey=cfg.field?`${cfg.field} obj`:'Venta obj';
  let list=rows.filter(row=>weekKeyOf(row)===currentKey).map(row=>{
    const real=num(row,realKey),obj=num(row,objKey);
    return{local:row.Local,name:row.Vendedor,real,obj,ratio:obj?real/obj*100:null};
  });
  if(mode==='ratio'){list=list.filter(p=>p.ratio!==null);list.sort((a,b)=>(b.ratio-a.ratio)||(b.real-a.real)||String(a.name).localeCompare(String(b.name),'es'))}
  else list.sort((a,b)=>(b.real-a.real)||((b.ratio??-Infinity)-(a.ratio??-Infinity))||String(a.name).localeCompare(String(b.name),'es'));

  const withRatio=list.filter(p=>p.ratio!==null);
  const avgRatio=withRatio.length?withRatio.reduce((sum,p)=>sum+p.ratio,0)/withRatio.length:null;
  const aggregateReal=mode==='ratio'?(list.length?list.reduce((sum,p)=>sum+p.real,0)/list.length:0):list.reduce((sum,p)=>sum+p.real,0);
  const leader=list[0];

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
  const gpPoints=category==='liga'?(()=>{const map={};f1RatioStandings(currentKey,null).slice(0,10).forEach((p,i)=>{map[p.name]=F1_MAIN_POINTS[i]});return map})():null;
  const gpCol=p=>gpPoints[p.name]??'—';

  const body=list.map((p,i)=>`<tr><td class="num">${rankPos(i)}</td><td class="seller-name">${escapeHtml(p.name)}</td><td class="seller-location">${escapeHtml(p.local)}</td><td class="num">${cfg.fmt(p.real)}</td><td class="num">${p.obj?cfg.fmt(p.obj):'<span class="missing-value">Sin objetivo</span>'}</td><td class="num">${p.ratio!==null?percent(p.ratio):'—'}</td>${gpPoints?`<td class="num">${gpCol(p)}</td>`:''}</tr>`).join('');

  const gpHeadCell=gpPoints?'<th>Puntos GP</th>':'';
  $('rankingTable').innerHTML=list.length?
    `<thead><tr><th>#</th><th>Vendedor</th><th>Local</th><th>${cfg.valueLabel}</th><th>Objetivo</th><th>% cumplimiento</th>${gpHeadCell}</tr></thead><tbody>${body}</tbody>`
    :`<thead><tr><th>#</th><th>Vendedor</th><th>Local</th><th>${cfg.valueLabel}</th><th>Objetivo</th><th>% cumplimiento</th>${gpHeadCell}</tr></thead><tbody><tr><td colspan="${gpPoints?7:6}" class="empty-state">Sin datos para estos filtros</td></tr></tbody>`;
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
    const convs=rows.map(row=>num(row,'Conversión')).filter(v=>v||v===0);
    const conv=convs.length?convs.reduce((sum,v)=>sum+v,0)/convs.length:0;
    const tickets=rows.map(row=>num(row,'Ticket prom.')).filter(v=>v||v===0);
    const ticket=tickets.length?tickets.reduce((sum,v)=>sum+v,0)/tickets.length:0;
    const convObjs=rows.map(row=>num(row,'Conversión obj')).filter(v=>v>0);
    const convObj=convObjs.length?convObjs.reduce((sum,v)=>sum+v,0)/convObjs.length:0;
    const loaded=rows.some(row=>num(row,'Venta real')||num(row,'Tráfico real'));
    return{mes,target,actual,traffic,conv,ticket,convObj,loaded,ratio:target?actual/target:0};
  });
  let accActual=0,accTarget=0;
  const monthRows=perMonth.map(m=>{accActual+=m.actual;accTarget+=m.target;return{...m,accActual,accTarget,accDelta:accActual-accTarget}});
  const totalActual=perMonth.reduce((sum,m)=>sum+m.actual,0),totalTarget=perMonth.reduce((sum,m)=>sum+m.target,0),totalTraffic=perMonth.reduce((sum,m)=>sum+m.traffic,0);
  const globalRatio=totalTarget?totalActual/totalTarget:0;
  const withData=perMonth.filter(m=>m.loaded);
  const avgConv=withData.length?withData.reduce((sum,m)=>sum+m.conv,0)/withData.length:0;
  const avgTicket=withData.length?withData.reduce((sum,m)=>sum+m.ticket,0)/withData.length:0;
  $('seasonMetrics').innerHTML=metricsCard('Venta total semestre',money(totalActual),`${monthsPresent.length} mes(es) con pestaña cargada`)+metricsCard('Cumplimiento objetivo',percent(globalRatio*100),`${money(totalActual-totalTarget)} vs. objetivo`,statusTone(globalRatio))+metricsCard('Tráfico total',number(totalTraffic),`${percent(avgConv*100)} conversión promedio`)+metricsCard('Ticket promedio',money(avgTicket),'promedio simple de los meses con datos');

  const estadoFor=m=>{if(!m.loaded)return{label:'Sin datos',cls:''};if(m.ratio>=1)return{label:'En objetivo',cls:'positive'};if(m.ratio>=.9)return{label:'Alerta',cls:'warning'};return{label:'Atención',cls:'negative'}};
  $('seasonMonthTable').innerHTML=`<thead><tr><th>Mes</th><th>Objetivo</th><th>Venta real</th><th>Avance</th><th>Acum. real</th><th>Desv. acum.</th><th>Estado</th></tr></thead><tbody>${monthRows.map(m=>{const estado=estadoFor(m);return `<tr><td class="seller-name">${escapeHtml(m.mes)}</td><td class="num">${money(m.target)}</td><td class="num">${money(m.actual)}</td><td class="num">${percent(m.ratio*100)}</td><td class="num">${money(m.accActual)}</td><td class="num ${m.accDelta>=0?'positive':'negative'}">${money(m.accDelta)}</td><td class="num ${estado.cls}">${estado.label}</td></tr>`}).join('')}<tr class="season-total"><td class="seller-name">Total</td><td class="num">${money(totalTarget)}</td><td class="num">${money(totalActual)}</td><td class="num">${percent(globalRatio*100)}</td><td class="num">${money(totalActual)}</td><td class="num ${totalActual-totalTarget>=0?'positive':'negative'}">${money(totalActual-totalTarget)}</td><td></td></tr></tbody>`;

  $('seasonTrafficTable').innerHTML=`<thead><tr><th>Mes</th><th>Tráfico</th><th>Conversión</th><th>Ticket prom.</th></tr></thead><tbody>${perMonth.map(m=>`<tr><td class="seller-name">${escapeHtml(m.mes)}</td><td class="num">${number(m.traffic)}</td><td class="num">${percent(m.conv*100)}</td><td class="num">${money(m.ticket)}</td></tr>`).join('')}</tbody>`;

  renderSeasonTrend(perMonth);

  const sellerRows=seasonSellerRows();
  const groups={};
  // Por nombre solo (no Local+Vendedor): alguien que vendió en dos locales durante el semestre
  // sumaba su venta acumulada partida en dos filas separadas, en vez de en una sola por persona
  // (bug real, auditoría 2026-09-05). `locales` junta todos los locales donde vendió para mostrarla.
  sellerRows.forEach(row=>{const key=row.Vendedor;if(!groups[key])groups[key]={name:row.Vendedor,locales:new Set(),actual:0,pxtSum:0,pxtCount:0};groups[key].locales.add(row.Local);groups[key].actual+=num(row,'Venta real');const pxt=num(row,'PxT real');if(pxt){groups[key].pxtSum+=pxt;groups[key].pxtCount++}});
  const rankList=Object.values(groups).map(g=>({...g,local:[...g.locales].sort().join(' + '),pxt:g.pxtCount?g.pxtSum/g.pxtCount:0})).sort((a,b)=>b.actual-a.actual);
  const teamTotal=rankList.reduce((sum,g)=>sum+g.actual,0)||1;
  $('seasonRankingTable').innerHTML=`<thead><tr><th>#</th><th>Vendedor</th><th>Local</th><th>Venta acum.</th><th>Part.</th><th>PxT</th></tr></thead><tbody>${rankList.length?rankList.slice(0,10).map((g,i)=>`<tr><td class="num">${i+1}</td><td class="seller-name">${escapeHtml(g.name)}</td><td class="seller-location">${escapeHtml(g.local)}</td><td class="num">${money(g.actual)}</td><td class="num">${percent(g.actual/teamTotal*100)}</td><td class="num">${number(g.pxt)}</td></tr>`).join(''):'<tr><td colspan="6" class="empty-state">Sin datos</td></tr>'}</tbody>`;

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
function renderSellerMetrics(){const rows=periodRows('VENDEDOR_SEMANAL','metricsMonthFilter','metricsWeekFilter'),groups={};
  // Por nombre solo (no Local+Vendedor): alguien que vende en dos locales quedaba partido en dos
  // filas de esta tabla, cada una con la mitad de su venta y objetivo, como si fueran dos personas
  // distintas — el nombre+apellido ya alcanza como identidad única (bug real reportado el
  // 2026-09-05). `locales` guarda los locales reales por separado (sin combinar todavía) para no
  // romper localObjetivoFor() más abajo, que necesita el nombre exacto de un local de LOCAL_DIARIO.
  rows.forEach(row=>{
    const key=row.Vendedor;
    if(!groups[key])groups[key]={name:row.Vendedor,locales:new Set(),sale:0,target:0,traffic:0,conversion:0,ticket:0,garments:0,count:0};
    const group=groups[key];
    group.locales.add(row.Local);
    group.sale+=num(row,'Venta real');group.target+=num(row,'Venta obj');group.traffic+=num(row,'Tráfico real');group.conversion+=num(row,'Conv real');group.ticket+=num(row,'TP real');group.garments+=num(row,'PxT real');group.count++;
  });
  // CRITERIO GENERAL DE ORDENAMIENTO: esta tabla (Detalle Individual, sección 04 Vendedores) no
  // tenía NINGÚN sort — mostraba a cada vendedor en el orden crudo en que aparecía en la planilla,
  // no por rendimiento. Ordena de mayor a menor por % de cumplimiento de objetivo (mismo criterio
  // que usa el resto del dashboard — Liga VDH, GP VDH, etc. — para no premiar volumen bruto de un
  // local grande sobre el cumplimiento real de uno chico), con venta real y nombre como desempate.
  const list=Object.values(groups).map(g=>({...g,local:[...g.locales].sort().join(' + ')})).sort((a,b)=>{
    const ar=a.target?a.sale/a.target:0,br=b.target?b.sale/b.target:0;
    return (br-ar)||(b.sale-a.sale)||String(a.name).localeCompare(String(b.name),'es');
  });
  const metricsMonth=$('metricsMonthFilter').value,metricsWeek=$('metricsWeekFilter').value;const daily=(state.tables.VENDEDOR_DIARIO||[]).filter(row=>rowMatchesFilters(row)&&(metricsMonth==='all'||String(row.Mes??'')===metricsMonth)&&(metricsWeek==='all'||String(row.Semana??'')===metricsWeek));
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
  const avgConv=list.length?list.reduce((sum,row)=>sum+row.conversion/Math.max(1,row.count),0)/list.length:0;
  const avgTicket=list.length?list.reduce((sum,row)=>sum+row.ticket/Math.max(1,row.count),0)/list.length:0;
  const avgGarments=list.length?list.reduce((sum,row)=>sum+row.garments/Math.max(1,row.count),0)/list.length:0;
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
  $('sellerDetailMetrics').innerHTML=metricsCard('Vendedores visibles',number(list.length),'según filtros')+progressCard('Venta',money,dailyTotals.actual,dailyTotals.target,'según registros diarios')+metricsCard('Tráfico real',number(totalTraffic),'personas registradas')+metricsCard('Conversión media',percent(avgConv*100),hasConvObj?`${avgConv>=avgConvObj?'+':''}${percent((avgConv-avgConvObj)*100)} vs. objetivo (${percent(avgConvObj*100)})`:'conversión del período',hasConvObj?(avgConv>=avgConvObj?'good':'bad'):'')+metricsCard('Ticket promedio',money(avgTicket),hasTicketObj?`objetivo ${money(avgTicketObj)}`:'promedio entre vendedores',hasTicketObj?(avgTicket>=avgTicketObj?'good':'bad'):'')+metricsCard('Prendas por ticket',number(avgGarments),'promedio entre vendedores');
  renderTrafficFunnel('sellerFunnel',list.length>0,totalTraffic,avgConv);
  renderDiagnosisPanel('sellerDiagnosis',avgConv,avgConvObj,hasConvObj,avgTicket,avgTicketObj,hasTicketObj);
  renderSellerFocus(list,metricsMonth);
  const body=list.map(row=>{const ratio=row.target?row.sale/row.target:0;return `<tr><td class="seller-name">${escapeHtml(row.name)}</td><td class="seller-location">${escapeHtml(row.local)}</td><td class="num">${money(row.sale)}</td><td class="num">${money(row.target)}</td><td class="num">${number(row.traffic)}</td><td class="num">${percent(row.count?row.conversion/row.count:0)}</td><td class="num">${money(row.count?row.ticket/row.count:0)}</td><td class="num">${number(row.count?row.garments/row.count:0)}</td><td class="num ${ratio>=1?'positive':ratio<.9?'negative':'warning'}">${percent(ratio*100)}</td></tr>`}).join('');$('sellerDetailTable').innerHTML=`<thead><tr><th>Vendedor</th><th>Local</th><th>Venta</th><th>Objetivo</th><th>Tráfico</th><th>Conversión</th><th>Ticket promedio</th><th>Prendas por ticket</th><th>% objetivo</th></tr></thead><tbody>${body||'<tr><td colspan="9" class="empty-state">Sin datos para estos filtros</td></tr>'}</tbody>`;$('sellerDetailRowsCount').textContent=`${list.length} vendedores`}
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
  // CRITERIO GENERAL DE ORDENAMIENTO: tampoco tenía sort — orden crudo de planilla. No hay una
  // columna $ ni un único % acá (son 2 productos en paralelo), así que se ordena por el mismo
  // % de cumplimiento COMBINADO (perfumes+boxer) que esta función ya usa para su propia card
  // "Cumplimiento global" más abajo — se reusa la fórmula existente, no se inventa una nueva.
  const list=Object.values(groups).map(g=>({...g,local:[...g.locales].sort().join(' + ')})).filter(row=>row.perfumesTarget||row.perfumesActual||row.boxerTarget||row.boxerActual).sort((a,b)=>{
    const ar=(a.perfumesTarget+a.boxerTarget)?(a.perfumesActual+a.boxerActual)/(a.perfumesTarget+a.boxerTarget):0;
    const br=(b.perfumesTarget+b.boxerTarget)?(b.perfumesActual+b.boxerActual)/(b.perfumesTarget+b.boxerTarget):0;
    return (br-ar)||String(a.name).localeCompare(String(b.name),'es');
  });
  const status=(actual,target)=>target?(actual/target>=1?'positive':actual/target<.9?'negative':'warning'):'warning';const cell=(actual,target)=>`<div class="accessory-cell"><strong>${number(actual)}</strong><span>obj. ${number(target)}</span><em class="${status(actual,target)}">${target?percent(actual/target*100):'Sin objetivo'}</em><small>desvío ${number(actual-target)}</small></div>`;const totals=list.reduce((acc,row)=>{acc.perfumesTarget+=row.perfumesTarget;acc.perfumesActual+=row.perfumesActual;acc.boxerTarget+=row.boxerTarget;acc.boxerActual+=row.boxerActual;return acc},{perfumesTarget:0,perfumesActual:0,boxerTarget:0,boxerActual:0});const totalRatio=(totals.perfumesTarget+totals.boxerTarget)?(totals.perfumesActual+totals.boxerActual)/(totals.perfumesTarget+totals.boxerTarget):0;$('accessoryMetrics').innerHTML=metricsCard('Vendedores con datos',number(list.length),'según filtros')+metricsCard('Perfumes',number(totals.perfumesActual),`obj. ${number(totals.perfumesTarget)} · ${totals.perfumesTarget?percent(totals.perfumesActual/totals.perfumesTarget*100):'sin objetivo'}`,status(totals.perfumesActual,totals.perfumesTarget))+metricsCard('Boxers',number(totals.boxerActual),`obj. ${number(totals.boxerTarget)} · ${totals.boxerTarget?percent(totals.boxerActual/totals.boxerTarget*100):'sin objetivo'}`,status(totals.boxerActual,totals.boxerTarget))+metricsCard('Cumplimiento global',percent(totalRatio*100),'perfumes + boxers',status(totals.perfumesActual+totals.boxerActual,totals.perfumesTarget+totals.boxerTarget));$('accessoryTable').innerHTML=list.length?`<thead><tr><th>Vendedor</th><th>Local</th><th>Perfumes</th><th>Boxers</th></tr></thead><tbody>${list.map(row=>`<tr><td class="seller-name">${escapeHtml(row.name)}</td><td class="seller-location">${escapeHtml(row.local)}</td><td>${cell(row.perfumesActual,row.perfumesTarget)}</td><td>${cell(row.boxerActual,row.boxerTarget)}</td></tr>`).join('')}</tbody>`:'<tbody><tr><td colspan="4" class="empty-state">Sin datos de accesorios para estos filtros.</td></tr></tbody>';$('accessoryRowsCount').textContent=list.length?`${list.length} vendedores`:'Sin datos'}
function renderOverview(){
  const localRows=rowsThroughToday(overviewRows('LOCAL_DIARIO')),ecomRows=rowsThroughToday(overviewRows('ECOM_DIARIO')),rows=[...localRows,...ecomRows];
  const a=aggregate(rows);
  // Split Locales/Online para "Resumen ejecutivo" — a nivel de canal, prorrateado a la fecha igual
  // que `a` (mismo criterio que el resto de esta función, no el objetivo de MES completo).
  const aLocalCh=aggregate(localRows),aEcomCh=aggregate(ecomRows);
  const days=[...new Set(rows.map(r=>normalizeDate(r.Fecha)).filter(Boolean))].sort();

  const daily=dailySeries(rows),cumulative=cumulativeSeries(daily);
  const lastIdx=daily.length-1,prevIdx=lastIdx-1;
  const yesterdayCum=prevIdx>=0?cumulative[prevIdx]:null;

  // % Avance del mes / Ritmo Necesario / Cierre Estimado comparten una misma base: el objetivo del
  // MES completo (no el prorrateado a la fecha que muestra "Objetivo a la fecha") — monthContext()
  // ya arma esto una sola vez para no recalcularlo 3 veces con la misma lógica.
  const{localMonth,monthRows,monthTarget}=monthContext();
  const avanceMesRatio=monthTarget?a.actual/monthTarget*100:null;
  const avanceMesAyer=(monthTarget&&yesterdayCum&&yesterdayCum.ratio!==null)?yesterdayCum.actual/monthTarget*100:null;
  const avanceMesDelta=(avanceMesRatio!==null&&avanceMesAyer!==null)?avanceMesRatio-avanceMesAyer:null;
  const avanceMesTrend=kpiTrendRow(avanceMesDelta,avanceMesDelta!==null?`${avanceMesDelta>=0?'+':''}${avanceMesDelta.toFixed(1)} pts vs. cierre de ayer`:'sin cierre de ayer para comparar');

  // Ritmo necesario: cuánto hace falta vender por día, en lo que resta del MES calendario, para
  // alcanzar el objetivo total del mes — (Objetivo Mes - Venta Real) / Días Restantes. Antes se
  // calculaba contra el objetivo prorrateado a la fecha con "30 días" fijo como aproximación; ahora
  // usa la misma base (monthTarget) y el largo real del mes que Cierre Estimado, así las dos
  // tarjetas no pueden dar mensajes contradictorios entre sí.
  const diasEnMes=daysInCalendarMonth(objectiveCutoff());
  const ritmoAt=cutIdx=>{
    if(cutIdx<0||!monthTarget)return null;
    const c=cumulative[cutIdx],transcurridos=cutIdx+1,restantes=Math.max(1,diasEnMes-transcurridos);
    return Math.max(0,monthTarget-c.actual)/restantes;
  };
  const ritmoHoy=ritmoAt(lastIdx),ritmoAyer=ritmoAt(prevIdx);
  const ritmoDelta=(ritmoHoy!==null&&ritmoAyer!==null)?ritmoHoy-ritmoAyer:null;
  // La flecha usa invert=true (menos ritmo necesario = mejora), pero el signo +/- del texto tiene
  // que acompañar a ESA flecha ya invertida, no al signo crudo de ritmoDelta — antes podía mostrar
  // "▼ +$X" (flecha de "peor" junto a un signo de "más"), una combinación contradictoria. displaySign
  // es el mismo valor que trendMeta ya usa puertas adentro para decidir la flecha.
  const ritmoDisplaySign=ritmoDelta!==null?-ritmoDelta:null;
  const ritmoTrend=kpiTrendRow(ritmoDelta,ritmoDisplaySign!==null?`${ritmoDisplaySign>=0?'+':''}${money(ritmoDisplaySign)} vs. ritmo de ayer`:'sin cierre de ayer para comparar',true);
  const diasRestantes=Math.max(1,diasEnMes-days.length);
  const restanteMes=monthTarget?Math.max(0,monthTarget-a.actual):null;
  const ritmoNecesario=restanteMes!==null?restanteMes/diasRestantes:null;

  // Cierre estimado: mismo cálculo ponderado a los últimos días cargados que antes vivía como
  // bloque secundario de "Lectura rápida" — ahora es su propia tarjeta arriba; Lectura Rápida
  // (renderDeviation) quedó enfocada solo en diagnosticar la brecha actual, no en proyectarla.
  const perDateMonth={};
  monthRows.forEach(row=>{const date=normalizeDate(row.Fecha);if(!date)return;if(!perDateMonth[date])perDateMonth[date]={actual:0,signal:0};perDateMonth[date].actual+=num(row,'Venta real');perDateMonth[date].signal+=num(row,'Venta real')+num(row,'Tráfico real')+num(row,'Visitas')});
  const loadedActual={};
  Object.keys(perDateMonth).forEach(d=>{if(perDateMonth[d].signal>0)loadedActual[d]=perDateMonth[d].actual});
  const proj=Object.keys(loadedActual).length?projectMonth(loadedActual,daysInCalendarMonth(Object.keys(loadedActual).sort().pop())):null;
  const desvioProy=proj?proj.ponderada-monthTarget:null;
  const cierreTrend=proj?kpiTrendRow(desvioProy,`${desvioProy>=0?'+':''}${money(desvioProy)} vs. objetivo del mes`):null;

  // Desvío a la fecha: objetivo prorrateado hasta hoy (a.target), no el objetivo del MES completo
  // (monthTarget) que usan las otras 3 tarjetas — Card 2 responde "¿cómo vengo respecto de lo que
  // se esperaba HOY?", una pregunta distinta a "¿cómo vengo respecto del mes?".
  const ratioHoy=a.target?a.actual/a.target:0,deltaHoy=a.actual-a.target;
  const desvioBadge=kpiTrendRow(deltaHoy,deltaHoy>=0?'Por encima del esperado':'Por debajo del esperado');

  // Las 4 tarjetas: una sola métrica grande por tarjeta, sin pisarse entre sí — cada una responde
  // una pregunta distinta (venta hoy / desvío a la fecha / ritmo necesario / cierre proyectado).
  $('overviewMetrics').innerHTML=
    kpiCard('Venta real',money(a.actual),monthTarget?`${percent(avanceMesRatio)} del objetivo total (${money(monthTarget)})`:'Sin objetivo mensual cargado','',avanceMesTrend,null)+
    kpiCard('Desvío a la fecha',`<span class="${deltaHoy>=0?'good':'bad'}">${deltaHoy>=0?'+':''}${money(deltaHoy)}</span>`,`Esperado a hoy: ${money(a.target)} (${percent(ratioHoy*100)} de cumplimiento)`,'',desvioBadge,null)+
    kpiCard('Ritmo necesario',ritmoNecesario!==null?`${money(ritmoNecesario)} /día`:'—',restanteMes!==null?`${diasRestantes} día${diasRestantes===1?'':'s'} restantes para cubrir ${money(restanteMes)}`:`${diasRestantes} día${diasRestantes===1?'':'s'} restantes del mes`,'',ritmoTrend,null)+
    kpiCard(`Cierre estimado${localMonth?` · ${localMonth}`:''}`,proj?money(proj.ponderada):'—',proj?`Lineal: ${money(proj.lineal)} · ${proj.diasRestantes} días restantes`:'Sin días cargados todavía','',cierreTrend,null);

  // Aislado con try/catch por tarjeta: un error en una de estas (como el ReferenceError de
  // monthRows que colgó Lectura Rápida + las dos de Salud en "Sin datos" hasta que se detectó)
  // ya no debe frenar a sus hermanas — cada una se re-renderiza sola en cada refresh de todos modos.
  const safeRender=(fn,...args)=>{try{fn(...args)}catch(err){console.error(`renderOverview: ${fn.name} falló —`,err)}};
  // Contexto del mes para el módulo "Avance del mes" debajo del gráfico — independiente del rango
  // que esté graficando el chart en sí (que puede ser el semestre completo): esto siempre habla del
  // mes calendario en curso. avgDailyProy sale del mismo cálculo ponderado que ya arma "Cierre
  // estimado" (reversión de ponderada=actual+ritmo*diasRestantes), no un promedio nuevo por su cuenta.
  const monthProgressCtx={monthTarget,diasEnMes,diasTranscurridos:days.length,avgDailyReal:days.length?a.actual/days.length:null,avgDailyProy:proj?(proj.ponderada-proj.actual)/Math.max(1,proj.diasRestantes):null};
  safeRender(renderBars,rows,monthProgressCtx);
  safeRender(renderDailyComparison,daily);
  // "Resumen Ejecutivo" ya no repite Faltante/Ritmo necesario (idénticos a las Cards 2/3 de arriba,
  // ver charla del 2026-08-24) — ahora muestra el único cruce que esta pantalla combinada puede dar
  // y ningún otro panel muestra: Locales vs. Online, prorrateado a la fecha (aLocalCh/aEcomCh).
  safeRender(renderDeviation,aLocalCh,aEcomCh,monthProgressCtx.avgDailyReal,ritmoNecesario);
  safeRender(renderStoreHealth,localRows);
  safeRender(renderTeamHealth);
}
function renderStoreHealth(localRows){const container=$('storeHealth');const groups={};localRows.forEach(row=>{const key=row.Local||'Sin local';if(!groups[key])groups[key]={local:key,actual:0,target:0};groups[key].actual+=num(row,'Venta real');groups[key].target+=num(row,'Objetivo')});const list=Object.values(groups).map(x=>({...x,ratio:x.target?x.actual/x.target:0}));if(!list.length){container.classList.add('empty-state');container.innerHTML='Sin datos';return}container.classList.remove('empty-state');const buckets={ok:0,warn:0,danger:0};list.forEach(x=>buckets[x.ratio>=1?'ok':x.ratio>=.9?'warn':'danger']++);const atRisk=list.filter(x=>x.ratio<.9).sort((a,b)=>a.ratio-b.ratio).slice(0,5);container.innerHTML=`<div class="health-summary"><div class="health-chip ok"><strong>${buckets.ok}</strong><span>en objetivo</span></div><div class="health-chip warn"><strong>${buckets.warn}</strong><span>alerta</span></div><div class="health-chip danger"><strong>${buckets.danger}</strong><span>en rojo</span></div></div>${atRisk.length?`<div class="health-list">${atRisk.map(x=>`<div class="health-row"><span class="dot danger"></span><span class="health-name">${escapeHtml(x.local)}</span><span class="health-local">${percent(x.ratio*100)} del objetivo</span><span class="health-ratio negative">${money(x.actual-x.target)}</span></div>`).join('')}</div>`:`<div class="health-empty">${icon('sparkles','health-empty-icon')}Todos los locales en objetivo</div>`}`}
function renderTeamHealth(){const container=$('teamHealth');
  // Fundida por vendedor compartido y por nombre solo: alguien que cubre 2 locales quedaba con DOS
  // entradas de "salud del equipo" (una por local, cada una con la mitad de su venta y objetivo),
  // pudiendo aparecer "en rojo" en las dos aunque su total combinado estuviera bien — bug real,
  // auditoría 2026-09-05.
  const rows=fusionarVendedoresCompartidos(state.tables.VENDEDOR_SEMANAL||[]);
  const latest={};
  rows.forEach(row=>{const key=row.Vendedor,semana=Number(row.Semana)||0;if(!latest[key]||semana>=latest[key].semana)latest[key]={semana,local:row.Local,name:row.Vendedor,actual:num(row,'Venta real'),target:num(row,'Venta obj')}});const list=Object.values(latest).map(x=>({...x,ratio:x.target?x.actual/x.target:0}));if(!list.length){container.classList.add('empty-state');container.innerHTML='Sin datos';return}container.classList.remove('empty-state');const buckets={ok:0,warn:0,danger:0};list.forEach(x=>buckets[x.ratio>=1?'ok':x.ratio>=.9?'warn':'danger']++);const atRisk=list.filter(x=>x.ratio<.9).sort((a,b)=>a.ratio-b.ratio).slice(0,5);container.innerHTML=`<div class="health-summary"><div class="health-chip ok"><strong>${buckets.ok}</strong><span>en objetivo</span></div><div class="health-chip warn"><strong>${buckets.warn}</strong><span>alerta</span></div><div class="health-chip danger"><strong>${buckets.danger}</strong><span>en rojo</span></div></div>${atRisk.length?`<div class="health-list">${atRisk.map(x=>`<div class="health-row"><span class="dot danger"></span><span class="health-name">${escapeHtml(x.name)}</span><span class="health-local">${escapeHtml(x.local)}</span><span class="health-ratio negative">${percent(x.ratio*100)}</span></div>`).join('')}</div>`:`<div class="health-empty">${icon('sparkles','health-empty-icon')}Nadie en rojo esta semana</div>`}`}
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
  container.innerHTML=`<svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGlowMain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF6B00" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#FF6B00" stop-opacity="0"></stop></linearGradient></defs>${bandPath?`<path class="line-band" d="${bandPath}"></path>`:''}<path class="line-area" d="${area}" style="fill:url(#areaGlowMain)"></path>${priorPath?`<path class="line-prior" d="${priorPath}"></path>`:''}<path class="line-target" d="${path('cumTarget')}"></path>${projectionPath?`<path class="line-projection" d="${projectionPath}"></path>`:''}<path class="line-actual" d="${path('cumActual')}"></path>${nodesFor('cumTarget','line-node-target')}${nodesFor('cumActual','line-node-actual')}<circle class="line-dot" cx="${x(last.date).toFixed(1)}" cy="${y(last.cumActual).toFixed(1)}" r="4"><title>${money(last.cumActual)} al ${last.date}</title></circle><line class="hoy-line" x1="${hoyX.toFixed(1)}" y1="0" x2="${hoyX.toFixed(1)}" y2="${h}"></line><text class="hoy-label" x="${hoyLabelX.toFixed(1)}" y="10" text-anchor="${hoyAnchor}">HOY</text><line class="hover-line" x1="0" y1="0" x2="0" y2="${h}" style="display:none"></line>${hoverDots}</svg><div class="chart-tooltip" hidden></div><div class="line-axis"><span>${domainStart.slice(5)}</span><span>${money(last.cumActual)} vs ${money(last.cumTarget)}</span><span>${domainEnd.slice(5)}</span></div>${legend}${note}${monthProgress}`;
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
    tooltipEl.innerHTML=`<div class="chart-tooltip-date">${hoverDate}</div>${rows.map(r=>`<div class="chart-tooltip-row"><i style="background:${r.color}"></i><span>${r.label}</span><strong>${money(r.value)}</strong></div>`).join('')}`;
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
  const statusOf=d=>!d.target?'none':d.actual>=d.target?'good':'bad';

  const bars=daily.map((d,i)=>{
    const status=statusOf(d);
    const actualCls=status==='good'?'daily-bar-good':status==='bad'?'daily-bar-bad':'daily-bar-none';
    const actualTop=y(d.actual),actualH=Math.max(0,baseline-actualTop);
    const targetTop=y(d.target),targetH=Math.max(0,baseline-targetTop);
    const actualPath=d.actual>0?`<path class="daily-bar daily-bar-actual ${actualCls}" data-day="${i}" d="${roundedTopBarPath(xActual(i),actualTop,barWidth,actualH,4)}"><title>${d.date} · Venta real: ${money(d.actual)}</title></path>`:'';
    const targetPath=d.target>0?`<path class="daily-bar daily-bar-target" data-day="${i}" d="${roundedTopBarPath(xTarget(i),targetTop,barWidth,targetH,4)}"><title>${d.date} · Objetivo: ${money(d.target)}</title></path>`:'';
    return actualPath+targetPath;
  }).join('');

  const legend=`<div class="chart-legend"><span><i class="legend-swatch" style="background:var(--mint)"></i>Día en objetivo</span><span><i class="legend-swatch" style="background:var(--red)"></i>Día bajo objetivo</span><span><i class="legend-swatch" style="background:var(--muted)"></i>Objetivo del día</span></div>`;
  const first=daily[0],last=daily[daily.length-1];
  container.innerHTML=`${legend}<svg class="daily-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg><div class="chart-tooltip" hidden></div><div class="line-axis"><span>${first.date.slice(5)}</span><span>${daily.length} día${daily.length===1?'':'s'} cargado${daily.length===1?'':'s'}</span><span>${last.date.slice(5)}</span></div>`;
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
    const d=daily[idx],delta=d.actual-d.target,realColor=!d.target?'var(--muted)':delta>=0?'var(--mint)':'var(--red)';
    tooltipEl.innerHTML=`<div class="chart-tooltip-date">${d.date}</div><div class="chart-tooltip-row"><i style="background:${realColor}"></i><span>Venta real</span><strong>${money(d.actual)}</strong></div><div class="chart-tooltip-row"><i style="background:var(--muted)"></i><span>Objetivo del día</span><strong>${d.target?money(d.target):'sin cargar'}</strong></div>${d.target?`<div class="chart-tooltip-row"><i style="background:${delta>=0?'var(--mint)':'var(--red)'}"></i><span>Desvío</span><strong>${delta>=0?'+':''}${money(delta)}</strong></div>`:''}`;
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
// Pondera cada día cargado según su antigüedad (el más reciente pesa más) para estimar el ritmo diario.
// Es el cálculo de fondo detrás de "Cierre estimado" y de la línea de proyección del gráfico — ambos
// comparten esta misma función en vez de duplicar la ponderación cada uno por su lado.
function weightedDailyRate(perDateActual){
  const dates=Object.keys(perDateActual).sort();
  let weightSum=0,weightedActual=0,actual=0;
  dates.forEach((d,i)=>{const w=i+1;weightSum+=w;weightedActual+=perDateActual[d]*w;actual+=perDateActual[d]});
  return{dates,actual,ritmoPonderado:weightSum?weightedActual/weightSum:0,ritmoLineal:dates.length?actual/dates.length:0};
}
function projectMonth(perDateActual,diasEnMes){
  const{dates,actual,ritmoPonderado,ritmoLineal}=weightedDailyRate(perDateActual);
  if(!dates.length)return null;
  const diasRestantes=Math.max(0,diasEnMes-dates.length);
  return{dias:dates.length,diasRestantes,actual,ponderada:actual+ritmoPonderado*diasRestantes,lineal:actual+ritmoLineal*diasRestantes};
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
function monthContext(){
  // El mes "actual" NO es el de la primera fila de LOCAL_DIARIO: esa tabla acumula todo el
  // semestre (Informe de Temporada la recorre entera), así que [0].Mes se queda pegado en el
  // primer mes cargado (Septiembre) para siempre — apenas entra Octubre, estas 3 tarjetas seguían
  // calculando el objetivo del mes solo con filas de Septiembre (bug real, detectado en la
  // auditoría del 2026-09-05). Se toma el más reciente de MONTH_ORDER entre los meses presentes,
  // mismo criterio que ya usa renderSeason() para `monthsPresent`.
  const monthsPresent=[...new Set((state.tables.LOCAL_DIARIO||[]).map(row=>row.Mes).filter(Boolean))];
  const localMonth=monthsPresent.sort((a,b)=>MONTH_ORDER.indexOf(a)-MONTH_ORDER.indexOf(b)).pop()||'';
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
  const channelRow=(label,a)=>{
    const hasTarget=a.target>0,ratio=hasTarget?a.actual/a.target:0;
    const tone=hasTarget?statusTone(ratio):'';
    const detail=hasTarget?`${percent(ratio*100)} de su objetivo (${moneyShort(a.target)})`:'Sin objetivo cargado';
    return `<div class="resumen-row"><span class="section-kicker">${label}</span><div class="deviation-number ${tone}">${money(a.actual)}</div><div class="deviation-copy">${detail}</div></div>`;
  };
  const rowLocales=channelRow('LOCALES',aLocalCh);
  const rowOnline=channelRow('ONLINE',aEcomCh);

  // Canal a empujar: el que tenga mayor brecha de puntos vs. su propio objetivo (no en $, para poder
  // comparar dos objetivos de tamaño distinto). Si a alguno le falta objetivo cargado, no hay foco
  // posible a mostrar todavía.
  const localHasT=aLocalCh.target>0,ecomHasT=aEcomCh.target>0;
  let focoText='Cargá el objetivo de ambos canales para ver cuál necesita empuje.';
  if(localHasT&&ecomHasT){
    const localGap=(aLocalCh.actual-aLocalCh.target)/aLocalCh.target*100,ecomGap=(aEcomCh.actual-aEcomCh.target)/aEcomCh.target*100;
    focoText=localGap<=ecomGap
      ?`Locales necesita más empuje (${localGap>=0?'+':''}${localGap.toFixed(1)} pts vs. Online ${ecomGap>=0?'+':''}${ecomGap.toFixed(1)} pts)`
      :`Online necesita más empuje (${ecomGap>=0?'+':''}${ecomGap.toFixed(1)} pts vs. Locales ${localGap>=0?'+':''}${localGap.toFixed(1)} pts)`;
  }
  const rowFoco=`<div class="resumen-row"><span class="section-kicker">CANAL A EMPUJAR</span><div class="resumen-banner-text">${focoText}</div></div>`;

  const aceleracion=(avgDailyReal!==null&&ritmoNecesario!==null)?ritmoNecesario-avgDailyReal:null;
  const bannerTone=aceleracion===null?'':aceleracion>0?'bad':'good';
  const bannerText=aceleracion===null
    ?'Todavía no hay datos suficientes para comparar el ritmo.'
    :aceleracion>0
      ?`Aceleración requerida: +${money(aceleracion)} /día`
      :`Ritmo actual ya cubre lo necesario (${money(Math.abs(aceleracion))}/día de margen)`;
  const rowBanner=`<div class="resumen-row resumen-row-banner ${bannerTone}"><span class="resumen-banner-text">${bannerText}</span></div>`;

  $('deviationCard').innerHTML=rowLocales+rowOnline+rowFoco+rowBanner;
}
function renderStores(){const rows=rowsThroughToday(activeRows('LOCAL_DIARIO')),a=aggregate(rows),ratio=a.target?a.actual/a.target:0;const conversions=rows.map(row=>num(row,'Conversión')).filter(value=>value||value===0),avgConv=conversions.length?conversions.reduce((sum,value)=>sum+value,0)/conversions.length:0;const tickets=rows.map(row=>num(row,'Ticket prom.')).filter(value=>value||value===0),avgTicket=tickets.length?tickets.reduce((sum,value)=>sum+value,0)/tickets.length:0;
  // Efectivo/Tarjeta/Descuento/objetivos son valores mensuales repetidos en cada día del mes: se
  // promedian, no se suman. Se divide por la cantidad de días donde cada campo realmente vino
  // cargado (no por monthly.count = todos los días del período) — si esa columna se agregó a mitad
  // de mes o falta en algún día, dividir por el total diluía el % por debajo del valor real
  // (bug real, auditoría 2026-09-05).
  const monthly=rows.reduce((acc,row)=>{
    const cash=num(row,'Efectivo'),card=num(row,'Tarjeta'),discount=num(row,'Descuento'),convObj=num(row,'Conversión obj'),ticketObj=num(row,'Ticket obj');
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

  const allMonthRows=activeRows('LOCAL_DIARIO');
  const monthTarget=aggregate(allMonthRows).target;
  const projection=storeProjection(allMonthRows);
  const daily=storeDailySeries(rows);
  const kpiCtx={a,ratio,avgConv,avgConvObj,hasConvObj,brechaConv,avgTicket,avgTicketObj,hasTicketObj,avgCash,avgCard,avgDiscount,hasPayment,monthTarget,projection};
  renderStoreKpiGrid(kpiCtx);
  renderStoreChart(daily,kpiCtx);

  renderTrafficFunnel('storeFunnel',rows.length>0,a.traffic,avgConv);
  renderDiagnosisPanel('storeDiagnosis',avgConv,avgConvObj,hasConvObj,avgTicket,avgTicketObj,hasTicketObj);
  renderStoreFocus(rows);
  const columns=[['Fecha','Fecha'],['Local','Local'],['Día','Día'],['Objetivo','Objetivo'],['Venta real','Venta real'],['Desvío','__delta'],['Tráfico','Tráfico real'],['Conversión','Conversión'],['Ticket','Ticket prom.']];renderTable('storeTable',rows,columns,row=>({...row,__delta:num(row,'Venta real')-num(row,'Objetivo')}),4);$('storeRowsCount').textContent=`${rows.length} días`}

// ── Cabecera de "Locales": 6 tarjetas selectoras + gráfico dinámico ──────────
// Proyección de cierre SOLO con LOCAL_DIARIO (a diferencia del "Cierre estimado" del Resumen
// General, que puede sumar e-commerce) — acá es la red física sola. Mismo cálculo ponderado
// (weightedDailyRate/projectMonth) que ya usa el resto del dashboard, no uno nuevo.
function storeProjection(monthRows){
  const perDate={};
  monthRows.forEach(row=>{
    const date=normalizeDate(row.Fecha);
    if(!date)return;
    if(!perDate[date])perDate[date]={actual:0,signal:0};
    perDate[date].actual+=num(row,'Venta real');
    perDate[date].signal+=num(row,'Venta real')+num(row,'Tráfico real');
  });
  const loadedActual={};
  Object.keys(perDate).forEach(d=>{if(perDate[d].signal>0)loadedActual[d]=perDate[d].actual});
  const dates=Object.keys(loadedActual);
  if(!dates.length)return null;
  return projectMonth(loadedActual,daysInCalendarMonth(dates.sort().pop()));
}
function storeDailySeries(rows){
  const byDate={};
  rows.forEach(row=>{
    const date=normalizeDate(row.Fecha);
    if(!date)return;
    if(!byDate[date])byDate[date]={actual:0,target:0,traffic:0,trafficTarget:0,convSum:0,convCount:0,ticketSum:0,ticketCount:0,cash:0,card:0,discount:0,payCount:0};
    const d=byDate[date];
    d.actual+=num(row,'Venta real');
    d.target+=num(row,'Objetivo');
    d.traffic+=num(row,'Tráfico real');
    d.trafficTarget+=num(row,'Tráfico nec.')||num(row,'Tráfico obj');
    const conv=num(row,'Conversión');if(conv||conv===0){d.convSum+=conv;d.convCount++}
    const ticket=num(row,'Ticket prom.');if(ticket){d.ticketSum+=ticket;d.ticketCount++}
    d.cash+=num(row,'Efectivo');d.card+=num(row,'Tarjeta');d.discount+=num(row,'Descuento');d.payCount++;
  });
  return Object.keys(byDate).sort().map(date=>{
    const d=byDate[date];
    return{
      date,actual:d.actual,target:d.target,traffic:d.traffic,trafficTarget:d.trafficTarget,
      conversion:d.convCount?d.convSum/d.convCount*100:null,
      ticket:d.ticketCount?d.ticketSum/d.ticketCount:null,
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
function renderStoreKpiGrid(ctx){
  const{a,ratio,avgConv,hasConvObj,brechaConv,avgTicket,avgTicketObj,hasTicketObj,avgCash,avgCard,avgDiscount,hasPayment,monthTarget,projection}=ctx;
  qa('#storeKpiGrid .store-kpi-card').forEach(btn=>btn.classList.toggle('active',btn.dataset.storeMetric===state.storeMetric));

  $('storeKpiValue-venta').textContent=money(a.actual);
  $('storeKpiSub-venta').textContent=`${percent(ratio*100)} de avance`;

  if(projection){
    const desvio=projection.ponderada-monthTarget;
    $('storeKpiValue-proyeccion').textContent=money(projection.ponderada);
    $('storeKpiSub-proyeccion').textContent=`${desvio>=0?'+':''}${money(desvio)} vs. objetivo del mes`;
  }else{
    $('storeKpiValue-proyeccion').textContent='—';
    $('storeKpiSub-proyeccion').textContent='Sin días cargados todavía';
  }

  $('storeKpiValue-conversion').textContent=percent(avgConv*100);
  $('storeKpiSub-conversion').textContent=hasConvObj?`${brechaConv>=0?'+':''}${percent(brechaConv*100)} vs. objetivo`:'promedio del período';

  $('storeKpiValue-ticket').textContent=money(avgTicket);
  $('storeKpiSub-ticket').textContent=hasTicketObj?`objetivo ${money(avgTicketObj)}`:'venta promedio por compra';

  $('storeKpiValue-trafico').textContent=number(a.traffic);
  $('storeKpiSub-trafico').textContent=a.targetTraffic?`${percent(a.traffic/a.targetTraffic*100)} del objetivo`:'personas registradas';

  $('storeKpiValue-pagos').textContent=hasPayment?percent(avgCash*100):'—';
  $('storeKpiSub-pagos').textContent=hasPayment?`Efvo. · Tarjeta ${percent(avgCard*100)} · Desc. ${percent(avgDiscount*100)}`:'Agregar columna en el Sheet';
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
  if(state.storeMetric==='conversion')return renderStoreLineChart(area,daily,'conversion',percent,'var(--mint)');
  if(state.storeMetric==='ticket')return renderStoreLineChart(area,daily,'ticket',money,'var(--coral)');
  if(state.storeMetric==='trafico')return renderStoreLineChart(area,daily,'traffic',number,'var(--amber)');
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
  const statusOf=d=>!d.target?'none':d.actual>=d.target?'good':'bad';
  const bars=daily.map((d,i)=>{
    const status=statusOf(d);
    const actualCls=status==='good'?'daily-bar-good':status==='bad'?'daily-bar-bad':'daily-bar-none';
    const actualTop=y(d.actual),actualH=Math.max(0,baseline-actualTop);
    const targetTop=y(d.target),targetH=Math.max(0,baseline-targetTop);
    const actualPath=d.actual>0?`<path class="daily-bar daily-bar-actual ${actualCls}" data-day="${i}" d="${roundedTopBarPath(xActual(i),actualTop,barWidth,actualH,4)}"><title>${d.date} · Venta real: ${money(d.actual)}</title></path>`:'';
    const targetPath=d.target>0?`<path class="daily-bar daily-bar-target" data-day="${i}" d="${roundedTopBarPath(xTarget(i),targetTop,barWidth,targetH,4)}"><title>${d.date} · Objetivo: ${money(d.target)}</title></path>`:'';
    return actualPath+targetPath;
  }).join('');
  const legend=`<div class="chart-legend"><span><i class="legend-swatch" style="background:var(--mint)"></i>Día en objetivo</span><span><i class="legend-swatch" style="background:var(--red)"></i>Día bajo objetivo</span><span><i class="legend-swatch" style="background:var(--muted)"></i>Objetivo del día</span></div>`;
  const first=daily[0],last=daily[daily.length-1];
  container.innerHTML=`${legend}<svg class="daily-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${bars}</svg><div class="chart-tooltip" hidden></div><div class="line-axis"><span>${first.date.slice(5)}</span><span>${daily.length} día${daily.length===1?'':'s'}</span><span>${last.date.slice(5)}</span></div>`;
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
  const desvio=projection.ponderada-monthTarget;
  // Leyenda ABAJO del gráfico, no flotando encima (mismo fix ya aplicado en renderBars): con el
  // objetivo ahora más cerca del borde superior recién liberado, una leyenda position:absolute en esa
  // misma esquina volvía a pisar justo la línea punteada y su etiqueta nueva.
  const legend=`<div class="chart-legend chart-legend-bottom"><span><i class="legend-swatch" style="background:#64748b"></i>Objetivo del mes</span><span><i class="legend-swatch" style="background:var(--coral)"></i>Real acumulado</span><span><i class="legend-swatch legend-swatch-dashed"></i>Proyección</span></div>`;
  // Línea de objetivo: reusa la clase .line-target (color #64748b / #9CB3C9 en modo claro, ya
  // definida y usada por el gráfico acumulado de Resumen General) en vez de un stroke hardcodeado —
  // de paso corrige que el color fijo anterior no cambiaba en modo claro. dasharray 6 6 pedido puntual
  // para esta tarjeta se aplica encima vía style inline (gana sobre el 4 4 de la clase).
  container.innerHTML=`<svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="areaGlowStore" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF6B00" stop-opacity="0.25"></stop><stop offset="100%" stop-color="#FF6B00" stop-opacity="0"></stop></linearGradient></defs><path class="line-area" d="${areaPath}" style="fill:url(#areaGlowStore)"></path><line class="line-target" x1="0" y1="${targetY}" x2="${w}" y2="${targetY}" style="stroke-dasharray:6 6"></line><text class="target-label" x="${w-4}" y="${targetLabelY}" text-anchor="end">Meta ${money(monthTarget)}</text><path class="line-actual" d="${linePath}"></path><path class="line-projection" d="${projPath}"></path><circle class="line-dot" cx="${x(lastDate).toFixed(1)}" cy="${y(last.cum).toFixed(1)}" r="4"><title>${money(last.cum)} al ${lastDate}</title></circle></svg><div class="line-axis"><span>${firstDate.slice(5)}</span><span>${desvio>=0?'+':''}${money(desvio)} proyectado vs. objetivo</span><span>${endDate.slice(5)}</span></div>${legend}`;
}
// Cards 03/04/05 — línea de evolución diaria de una sola métrica, mismas clases .line-* que ya
// usa el gráfico del Resumen General (nada nuevo que mantener aparte).
function renderStoreLineChart(container,daily,key,fmt,color){
  const points=daily.filter(d=>d[key]!==null&&d[key]!==undefined);
  if(!points.length){container.classList.add('empty-state');container.innerHTML='No hay valores cargados para esta métrica todavía.';return}
  container.classList.remove('empty-state');
  const w=760,h=190;
  const maxVal=Math.max(...points.map(p=>p[key]),1);
  const x=i=>points.length>1?(i/(points.length-1))*w:w/2;
  const y=v=>h-(v/maxVal)*(h-10)-4;
  const linePath=points.map((p,i)=>`${i===0?'M':'L'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const areaPath=`${linePath} L${x(points.length-1).toFixed(1)},${h} L${x(0).toFixed(1)},${h} Z`;
  const gradId=`areaGlow-${key}`;
  const dots=points.map((p,i)=>`<circle class="line-dot" cx="${x(i).toFixed(1)}" cy="${y(p[key]).toFixed(1)}" r="3.5" style="fill:${color}"><title>${p.date}: ${fmt(p[key])}</title></circle>`).join('');
  const first=points[0],last=points[points.length-1];
  container.innerHTML=`<svg class="line-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" style="stop-color:${color};stop-opacity:.25"></stop><stop offset="100%" style="stop-color:${color};stop-opacity:0"></stop></linearGradient></defs><path class="line-area" d="${areaPath}" style="fill:url(#${gradId})"></path><path class="line-actual" d="${linePath}" style="stroke:${color}"></path>${dots}</svg><div class="line-axis"><span>${first.date.slice(5)}</span><span>${fmt(last[key])} · último dato</span><span>${last.date.slice(5)}</span></div>`;
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
function renderEcommerce(){
  const from=$('fromDate').value,to=$('toDate').value;
  const dailyAll=(state.tables.ECOM_DIARIO||[]).filter(row=>!from||normalizeDate(row.Fecha)>=from);
  const monthsPresent=[...new Set(dailyAll.map(row=>row.Mes).filter(Boolean))];
  const weekly=(state.tables.ECOM_SEMANAL||[]).filter(row=>!monthsPresent.length||monthsPresent.includes(row.Mes));
  const loadedDates=dailyAll.filter(row=>num(row,'Venta real')||num(row,'Visitas')).map(row=>normalizeDate(row.Fecha)).filter(Boolean).sort();
  const cutoff=to||(loadedDates.length?loadedDates[loadedDates.length-1]:'')||todayKey();
  const daily=dailyAll.filter(row=>normalizeDate(row.Fecha)<=cutoff);
  const a=aggregate(daily),ratio=a.target?a.actual/a.target:0,delta=a.actual-a.target;
  // Antes usaba dailyAll[0]?.Fecha (primera fila de TODO el historial de ECOM_DIARIO, que arrastra
  // meses viejos) para decidir cuántos días tiene "el mes" — con más de un mes cargado, tomaba el
  // largo del primer mes (ej. Septiembre, 30 días) en vez del mes vigente (bug real, auditoría
  // 2026-09-05). `cutoff` ya es la fecha vigente (filtro "Hasta" o el último día cargado).
  const diasEnMes=daysInCalendarMonth(cutoff);
  const diasTranscurridos=loadedDates.length,diasRestantes=Math.max(0,diasEnMes-diasTranscurridos);
  const ritmoNecesario=diasRestantes?Math.max(0,-delta)/diasRestantes:0;
  $('ecomMetrics').innerHTML=metricsCard('Avance del mes',percent(ratio*100),'% del objetivo',statusTone(ratio))+metricsCard('Venta acumulada',money(a.actual),`${diasTranscurridos} días cargados`)+metricsCard('Desvío acumulado',money(delta),delta>=0?'por encima de lo esperado':diasTranscurridos?'por debajo de lo esperado':'aún sin días cargados',delta>=0?'good':'bad')+metricsCard('Ritmo necesario',money(ritmoNecesario),`${diasRestantes} días restantes`);

  const totals=weekly.reduce((acc,row)=>{acc.visitas+=num(row,'Visitas');acc.carritos+=num(row,'Carritos');acc.compras+=num(row,'Compras');acc.facturacion+=num(row,'Facturación');acc.visitasMeta+=num(row,'Visitas Meta');acc.ventasMeta+=num(row,'Ventas Meta');acc.facturacionMeta+=num(row,'Facturación Meta');acc.inversion+=num(row,'Inversión sin imp.');return acc},{visitas:0,carritos:0,compras:0,facturacion:0,visitasMeta:0,ventasMeta:0,facturacionMeta:0,inversion:0});
  const carVis=totals.visitas?totals.carritos/totals.visitas*100:0,comCar=totals.carritos?totals.compras/totals.carritos*100:0;
  const funnelSteps=[['Visitas',totals.visitas,null],['Carritos',totals.carritos,carVis],['Compras',totals.compras,comCar]];
  const funnelTop=Math.max(totals.visitas,1);
  $('funnel').innerHTML=funnelSteps.map(([label,value,step])=>`${step!==null?`<div class="funnel-step">↓ ${percent(step)}</div>`:''}<div class="funnel-row"><span class="funnel-label">${label}</span><div class="funnel-track"><div class="funnel-fill" style="width:${Math.max(2,value/funnelTop*100)}%"></div></div><span class="funnel-value">${number(value)}</span></div>`).join('');

  const roas=totals.inversion?totals.facturacion/totals.inversion:0,cpa=totals.compras?totals.inversion/totals.compras:0;
  $('adsSummary').innerHTML=`<div class="ads-line"><span>Inversión sin impuestos</span><strong>${money(totals.inversion)}</strong></div><div class="ads-line"><span>Facturación atribuida</span><strong>${money(totals.facturacion)}</strong></div><div class="ads-line"><span>Costo por compra</span><strong>${totals.compras?money(cpa):'—'}</strong></div><div class="ads-line"><span>ROAS / BE ROAS</span><strong class="${roas>=2.8?'good':'bad'}">${roas.toFixed(2)} / 2.80</strong></div>`;

  const monthRows=[
    ['Visitas',totals.visitas,totals.visitasMeta,number],
    ['Q Ventas',totals.compras,totals.ventasMeta,number],
    ['Conversión',totals.visitas?totals.compras/totals.visitas*100:0,totals.visitasMeta?totals.ventasMeta/totals.visitasMeta*100:0,percent],
    ['Ticket prom.',totals.compras?totals.facturacion/totals.compras:0,totals.ventasMeta?totals.facturacionMeta/totals.ventasMeta:0,money],
    ['Venta / día',diasTranscurridos?a.actual/diasTranscurridos:0,diasEnMes?a.target/diasEnMes:0,money],
    ['Tráfico restante',Math.max(0,totals.visitasMeta-totals.visitas),totals.visitasMeta,number]
  ];
  $('ecomMonthTable').innerHTML=`<thead><tr><th>Métrica</th><th>Total</th><th>Objetivo</th></tr></thead><tbody>${monthRows.map(([label,tot,obj,fmt])=>`<tr><td class="seller-name">${label}</td><td class="num">${fmt(tot)}</td><td class="num">${fmt(obj)}</td></tr>`).join('')}</tbody>`;

  const projection=$('ecomProjection');
  const perDateActual={};
  daily.forEach(row=>{const date=normalizeDate(row.Fecha);if(!date)return;perDateActual[date]=(perDateActual[date]||0)+num(row,'Venta real')});
  const proj=diasTranscurridos?projectMonth(perDateActual,diasEnMes):null;
  if(!proj){projection.classList.add('empty-state');projection.innerHTML='Sin días cargados todavía este mes.'}
  else{projection.classList.remove('empty-state');const desvioProy=proj.ponderada-a.target;projection.innerHTML=`<span class="section-kicker">CIERRE ESTIMADO</span><div class="deviation-number ${desvioProy>=0?'good':'bad'}">${money(proj.ponderada)}</div><div class="deviation-copy">${desvioProy>=0?'+':''}${money(desvioProy)} vs. objetivo del mes · ponderada a los últimos días (${proj.dias}/${diasEnMes} días)</div><div class="projection-alt">Lineal: ${money(proj.lineal)}</div>`}

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
function renderTable(id,rows,columns,transform){
  const table=$(id);
  const data=(transform?rows.map(transform):rows).slice();
  const sortActive=state.sort.table===id&&columns.some(([,key])=>key===state.sort.key);
  data.sort((a,b)=>{
    if(!sortActive)return String(b.Fecha||'').localeCompare(String(a.Fecha||''));
    const av=tableSortValue(a,state.sort.key),bv=tableSortValue(b,state.sort.key);
    return av<bv?-state.sort.direction:av>bv?state.sort.direction:0;
  });
  table.innerHTML=`<thead><tr>${columns.map(([label,key])=>`<th data-sort="${key}" data-table="${id}">${label}${sortActive&&state.sort.key===key?' '+(state.sort.direction>0?'↑':'↓'):''}</th>`).join('')}</tr></thead><tbody>${data.slice(0,120).map(row=>`<tr>${columns.map(([label,key])=>{
    const value=row[key];
    const isMoney=['Objetivo','Venta real','Ticket','Desvío'].includes(label);
    const isPct=['Conversión'].includes(label);
    // Tráfico/Visitas/Q ventas caían al else de abajo sin pasar por number() — se veían sin
    // separador de miles (ej. "1842") a diferencia de todo el resto del dashboard (bug real,
    // auditoría 2026-09-05).
    const isCount=['Tráfico','Visitas','Q ventas'].includes(label);
    const cls=label==='Desvío'?(value>=0?'positive':'negative'):'num';
    return `<td class="${cls}">${isMoney?money(value):isPct?percent(value*100):isCount?number(value):escapeHtml(value??'—')}</td>`;
  }).join('')}</tr>`).join('')||`<tr><td colspan="${columns.length}" class="empty-state">Sin datos para estos filtros</td></tr>`}</tbody>`;
  qa(`#${id} th[data-sort]`).forEach(th=>th.addEventListener('click',()=>{
    const key=th.dataset.sort;
    const same=state.sort.table===id&&state.sort.key===key;
    state.sort={key,direction:same?-state.sort.direction:1,table:id};
    render();
  }));
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
function formatDateAR(dateStr){const[y,m,d]=dateStr.split('-');return`${d}/${m}/${y}`}
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
  // 'custom' (elegido a mano en "Período seleccionado") y 'all' (estado inicial, sin filtro) se
  // muestran igual acá — "Personalizado" pasó a ser el estado implícito de "Período" cada vez que
  // NO hay un preset fijo activo, en vez del texto aparte "Semestre completo" que tenía antes.
  return'Personalizado';
}
function openPeriodDropdown(){$('periodDropdown').hidden=false}
function closePeriodDropdown(){$('periodDropdown').hidden=true}
function openCalendarDropdown(){$('periodCalendarDropdown').hidden=false;if(!periodPicker.fp)initFlatpickr()}
function closeCalendarDropdown(){$('periodCalendarDropdown').hidden=true}
function markActivePreset(preset){qa('.period-preset').forEach(btn=>btn.classList.toggle('active',btn.dataset.preset===preset))}
// Presets "actuales" son a la fecha (desde el inicio de la semana/mes/trimestre HASTA hoy, no el
// período completo) — mismo criterio que "Semana actual"/"Mes actual"/"Trimestre actual" de
// Tiendanube, que muestran lo acumulado corrido, no un período futuro vacío.
function applyPeriodPreset(preset){
  const today=todayKey();
  let from='',to='';
  if(preset==='hoy'){from=to=today}
  else if(preset==='ayer'){from=to=addDaysKey(today,-1)}
  else if(preset==='semana'){from=mondayOfWeek(today);to=today}
  else if(preset==='mes'){from=firstOfMonthKey(today);to=today}
  else if(preset==='trimestre'){from=firstOfQuarterKey(today);to=today}
  periodPicker.preset=preset;
  setPeriodInputs(from,to);
  $('periodPickerBtnText').textContent=periodPresetLabel(preset);
  markActivePreset(preset);
  closeCalendarDropdown();
  closePeriodDropdown();
}
function resetPeriodPicker(){
  periodPicker.preset='all';
  setPeriodInputs('','');
  $('periodPickerBtnText').textContent=periodPresetLabel('all');
  $('periodCustomBtnText').textContent='Elegí un rango';
  markActivePreset('');
  if(periodPicker.fp)periodPicker.fp.clear();
  refreshCustomSelectedLabel([]);
  closePeriodDropdown();
  closeCalendarDropdown();
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

// ── 08 · RENTABILIDAD (DATOS DE EJEMPLO) ──────────────────────────────────────────────────────
// Pospuesto hasta que el equipo cree la pestaña "Verano 2027" en la planilla de referencia que ya
// usan con datos de Power BI (ver memoria vdh-dashboard-roadmap). Mientras tanto, esta vista arma
// la MAQUETA con datos de EJEMPLO derivados de la Venta real ya cargada (LOCAL_DIARIO): a cada
// local se le calcula un % de CMV/Gastos simulado de forma DETERMINÍSTICA (el mismo local siempre
// da el mismo % simulado en cada render, no cambia solo al recargar) para que se pueda validar el
// layout antes de conectar el dato real. Cuando la pestaña exista: agregar la lectura real al Apps
// Script consolidador (nueva tabla, ej. RENTABILIDAD_LOCAL, en el endpoint) y reemplazar
// mockProfitability() por esos valores — el resto de esta función (agregación, tabla, tarjetas) no
// debería necesitar cambios.
function seedFromString(str){let h=0;for(let i=0;i<str.length;i++){h=(h<<5)-h+str.charCodeAt(i);h|=0}return Math.abs(h)}
function mockRatio(seed,base,spread){const n=(seed%1000)/1000;return base+(n-0.5)*2*spread}
function mockProfitability(local,venta){
  const seed=seedFromString(local);
  const cmvRatio=Math.min(.72,Math.max(.38,mockRatio(seed,.55,.09)));
  const alquilerRatio=Math.min(.14,Math.max(.02,mockRatio(seed+1,.07,.04)));
  const empleadosRatio=Math.min(.16,Math.max(.03,mockRatio(seed+2,.09,.04)));
  const tarjetaRatio=Math.min(.10,Math.max(.03,mockRatio(seed+3,.06,.02)));
  const otrosRatio=Math.min(.06,Math.max(.01,mockRatio(seed+4,.02,.015)));
  const cmv=venta*cmvRatio,alquiler=venta*alquilerRatio,empleados=venta*empleadosRatio,tarjeta=venta*tarjetaRatio,otros=venta*otrosRatio;
  const gastos=alquiler+empleados+tarjeta+otros,rentabilidad=venta-cmv-gastos;
  return{venta,cmv,alquiler,empleados,tarjeta,otros,gastos,rentabilidad,pct:venta?rentabilidad/venta*100:0};
}
// Agrupa por Local (respeta el filtro de Local activo, igual que seasonLocalRows) sumando toda la
// Venta real ya cargada — no depende de Desde/Hasta porque esta vista mira el semestre completo.
function rentabilidadRows(){
  const local=$('localFilter').value;
  const rows=(state.tables.LOCAL_DIARIO||[]).filter(row=>local==='all'||String(row.Local??'')===local);
  const byLocal={};
  rows.forEach(row=>{const key=row.Local||'Sin local';byLocal[key]=(byLocal[key]||0)+num(row,'Venta real')});
  return Object.entries(byLocal).filter(([,venta])=>venta>0).map(([nombre,venta])=>({nombre,...mockProfitability(nombre,venta)})).sort((a,b)=>b.rentabilidad-a.rentabilidad);
}
function renderRentabilidad(){
  if(!$('rentabilidadView'))return;
  const list=rentabilidadRows();
  if(!list.length){
    $('rentabilidadMetrics').innerHTML='';
    $('rentabilidadTable').innerHTML='';
    $('rentabilidadRowsCount').textContent='';
    return;
  }
  const totals=list.reduce((acc,r)=>({venta:acc.venta+r.venta,gastos:acc.gastos+r.gastos,cmv:acc.cmv+r.cmv,rentabilidad:acc.rentabilidad+r.rentabilidad}),{venta:0,gastos:0,cmv:0,rentabilidad:0});
  const pctTotal=totals.venta?totals.rentabilidad/totals.venta*100:0,toneTotal=pctTotal>=0?'good':'bad';
  $('rentabilidadMetrics').innerHTML=
    metricsCard('Venta Total',money(totals.venta))+
    metricsCard('Gastos Total',money(totals.gastos))+
    metricsCard('CMV Total',money(totals.cmv))+
    metricsCard('Rentabilidad Total',money(totals.rentabilidad),'',toneTotal)+
    metricsCard('% Sobre la Venta',percent(pctTotal),'',toneTotal);
  $('rentabilidadRowsCount').textContent=`${list.length} local${list.length===1?'':'es'}`;
  const rowsHtml=list.map(r=>{const tone=r.pct>=0?'positive':'negative';return`<tr><td>${escapeHtml(r.nombre)}</td><td>${money(r.venta)}</td><td>${money(r.gastos)}</td><td>${money(r.alquiler)}</td><td>${money(r.empleados)}</td><td>${money(r.tarjeta)}</td><td>${money(r.otros)}</td><td>${money(r.cmv)}</td><td class="${tone}">${money(r.rentabilidad)}</td><td class="${tone}">${percent(r.pct)}</td></tr>`}).join('');
  $('rentabilidadTable').innerHTML=`<thead><tr><th>Local</th><th>Venta Total</th><th>Gastos Total</th><th>Alquiler</th><th>Empleados</th><th>Tarjeta</th><th>Otros</th><th>CMV</th><th>Rentabilidad</th><th>% s/ Venta</th></tr></thead><tbody>${rowsHtml}</tbody>`;
}

function scheduleRefresh(){clearInterval(state.timer);state.timer=null}
$('overviewGreeting').textContent=pickGreeting();
applyTheme(localStorage.getItem('vdh-theme')||'dark');qa('.theme-btn').forEach(btn=>btn.addEventListener('click',()=>applyTheme(btn.dataset.themeChoice)));$('refreshButton').addEventListener('click',loadData);$('clearFilters').addEventListener('click',()=>{['localFilter','sellerFilter'].forEach(id=>$(id).value='all');fillSellerFilter();['metricsMonthFilter','accessoryMonthFilter'].forEach(id=>$(id).value='all');fillPeriodFilters('metricsMonthFilter','metricsWeekFilter');fillPeriodFilters('accessoryMonthFilter','accessoryWeekFilter');['metricsWeekFilter','accessoryWeekFilter'].forEach(id=>$(id).value='all');resetPeriodPicker();render()});$('localFilter').addEventListener('change',()=>{fillSellerFilter();render()});$('sellerFilter').addEventListener('change',render);[['metricsMonthFilter','metricsWeekFilter'],['accessoryMonthFilter','accessoryWeekFilter']].forEach(([month,week])=>{$(month).addEventListener('change',()=>{fillPeriodFilters(month,week);render()});$(week).addEventListener('change',render)});qa('.nav-item,.jump-view').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));qa('#storeViewTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.storeTab=button.dataset.tab;applyStoreTab()}));qa('#storeKpiGrid .store-kpi-card').forEach(button=>button.addEventListener('click',()=>{state.storeMetric=button.dataset.storeMetric;renderStores()}));qa('#sellerViewTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.sellerTab=button.dataset.tab;applySellerTab()}));qa('#rankScopeTabs .rank-tab').forEach(button=>button.addEventListener('click',()=>{state.rankScope=button.dataset.scope;renderRanking()}));$('sprintCategorySelect').addEventListener('change',()=>{state.rankCategory=$('sprintCategorySelect').value;renderRanking()});qa('#rankSortToggle .rank-tab-sm').forEach(button=>button.addEventListener('click',()=>{state.rankSortMode=button.dataset.sort;renderRanking()}));qa('#evolutionScopeToggle .rank-tab-sm').forEach(button=>button.addEventListener('click',()=>{state.evoScope=button.dataset.evoscope;renderRanking()}));qa('.filters input,.seller-period-filters input').forEach(control=>control.addEventListener('change',render));
// ── BOTTOM NAV + DRAWER (mobile) ──────────────────────────────
qa('.bottom-nav-item[data-view]').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.view)));
function openMainDrawer(){$('mainDrawerBackdrop').hidden=false;$('mainDrawerPanel').hidden=false;$('mainDrawerToggle').setAttribute('aria-expanded','true')}
function closeMainDrawer(){$('mainDrawerBackdrop').hidden=true;$('mainDrawerPanel').hidden=true;$('mainDrawerToggle').setAttribute('aria-expanded','false')}
$('mainDrawerToggle').addEventListener('click',openMainDrawer);
$('mainDrawerClose').addEventListener('click',closeMainDrawer);
$('mainDrawerBackdrop').addEventListener('click',closeMainDrawer);
qa('.drawer-item[data-drawer-view]').forEach(btn=>btn.addEventListener('click',()=>{switchView(btn.dataset.drawerView);closeMainDrawer()}));
initPeriodPicker();
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


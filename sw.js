const CACHE = 'vdh-dashboard-v2';
const SHELL = ['./', './index.html', './app.js', './styles.css', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Los datos del dashboard siempre van a la red — nunca se cachean, tienen que ser en vivo.
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  // El shell de la app: red primero (para traer actualizaciones), cache como respaldo offline.
  if (event.request.method === 'GET' && url.origin === self.location.origin) {
    // "Red primero" no alcanzaba: GitHub Pages manda Cache-Control: max-age=600, así que esta
    // llamada la contestaba el cache del navegador sin salir a la red y un deploy recién publicado
    // tardaba hasta 10 minutos en verse. Pasó el 01/10: el arreglo estaba online y en pantalla
    // seguía lo viejo.
    //
    // 'no-cache' NO quiere decir "no cachear": manda la consulta condicional con el ETag y el
    // servidor responde 304 si el archivo no cambió, así que no cuesta ancho de banda.
    //
    // Las navegaciones quedan afuera porque un Request de tipo 'navigate' no se puede reconstruir
    // sin perder ese modo; el HTML igual lo revalida el navegador en cada carga.
    const pedido = event.request.mode === 'navigate'
      ? event.request
      : new Request(event.request, { cache: 'no-cache' });
    event.respondWith(
      fetch(pedido)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

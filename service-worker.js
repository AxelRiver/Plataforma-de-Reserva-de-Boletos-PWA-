const CACHE_NAME = 'graduacion-2025-v1.2';
const urlsToCache = [
  '/',
  'index.html',
  'index2.html',
  'verificar.html',
  'manifest.json',
  '1.png',
  '1.png',
  '1.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Bebas+Neue&display=swap',
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js',
  'https://html2canvas.hertzen.com/dist/html2canvas.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en caché, devuelve eso
        if (response) {
          return response;
        }
        // Si no, intenta desde la red
        return fetch(event.request).catch(() => {
          // Si falla la red y es HTML, devuelve offline fallback
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
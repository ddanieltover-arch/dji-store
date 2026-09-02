/* DJI Store EU Wave 11 service worker — prototype. Never cache sensitive checkout/payment/order APIs. */
const VERSION = 'w11.1.0';
const PRECACHE = `precache-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;
const PRECACHE_URLS = ['/', '/offline.html', '/manifest.webmanifest', '/favicon.png'];
const NEVER = ['/checkout', '/api/payments', '/api/orders', '/account/orders'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== PRECACHE && k !== RUNTIME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isNeverCache(url) {
  try {
    const u = new URL(url);
    return NEVER.some((p) => u.pathname.startsWith(p) || u.pathname.includes(p));
  } catch {
    return true;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || isNeverCache(request.url)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match('/offline.html'));
      return cached || network;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

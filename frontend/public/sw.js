// network-first cache-fallback Service Worker for telangana.live
const CACHE_NAME = 'tg-live-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (url.pathname.includes('/ws') || url.pathname.includes('hot-update')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && (response.status === 200 || response.type === 'opaque')) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    const acceptHeader = event.request.headers.get('accept') || '';
                    if (acceptHeader.includes('text/html')) {
                        return caches.match('/index.html').then(res => res || new Response('Not Found', { status: 404, statusText: 'Not Found' }));
                    }
                    return new Response('Not Found', { status: 404, statusText: 'Not Found' });
                });
            })
    );
});

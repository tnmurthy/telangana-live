// Simple Service Worker for telangana.live
const CACHE_NAME = 'tg-live-v1';

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Simple pass-through for now, can be expanded for offline support
    event.respondWith(fetch(event.request));
});

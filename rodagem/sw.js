// Necessário para o Chrome do Android oferecer "Instalar app".
const CACHE = 'rodagem-v1';
const FILES = ['./', './index.html', './manifest.json', './icone-192.png', './icone-512.png', './icone-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Só cuida das páginas deste atalho; o app do Claude abre normalmente.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request, {ignoreSearch: true})));
});

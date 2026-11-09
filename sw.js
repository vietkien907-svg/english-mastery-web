const CACHE_NAME = 'english-mastery-v48';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './listening_data.js',
  './vietnam_today_data.js',
  './international_news_videos.js',
  './bilingual_cinema_data.js',
  './bilingual_news_data.js',
  './reading_lexicon.js',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First with Cache Fallback for dynamic updates
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip external APIs or chrome extensions from strict caching
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Handle local app files
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

const CACHE_NAME = "saini-trading-cache-v3";   // हर update में बस v3 → v4 कर देना

const urlsToCache = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// INSTALL EVENT (CACHE NEW FILES)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );

  // NEW SERVICE WORKER तुरंत activate हो
  self.skipWaiting();
});

// FETCH EVENT (USE CACHE FIRST THEN NETWORK)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// ACTIVATE EVENT (DELETE OLD CACHES)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);   // PURANA CACHE DELETE
          }
        })
      );
    })
  );

  // NEW VERSION सभी open clients में लागू
  clients.claim();
});
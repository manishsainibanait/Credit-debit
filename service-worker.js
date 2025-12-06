const CACHE_NAME = "saini-static-cache";  

const urlsToCache = [
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// INSTALL EVENT
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// FETCH EVENT
self.addEventListener("fetch", event => {
  const req = event.request;

  // ⭐ index.html हमेशा network से (LATEST UI)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("index.html"))
    );
    return;
  }

  // बाकी files cache से
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req);
    })
  );
});

// ACTIVATE EVENT
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(n => {
          if (n !== CACHE_NAME) return caches.delete(n);
        })
      );
    })
  );
  clients.claim();
});
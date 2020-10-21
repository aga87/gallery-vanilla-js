const CACHE_NAME = 'v1';

// Install

self.addEventListener('install', () => {
  console.log('Service Worker: Installed');
});

// Activate and remove old caches

self.addEventListener('activate', function (event) {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys
          .filter((cacheKey) => cacheKey !== CACHE_NAME)
          .map((cacheKey) => caches.delete(cacheKey))
      );
    })
  );
});

// Cache on network response:
// If a request doesn't match anything in the cache, get it from the network,
// send it to the page, and add it to the cache at the same time.

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then(
        (response) =>
          response ||
          fetch(e.request).then((response) => {
            cache.put(e.request, response.clone());
            return response;
          })
      );
    })
  );
});

const CACHE_NAME = 'chess-trainer-v2';
const urlsToCache = [
  './index.html',
  './styles.css',
  './js/app.js',
  './js/puzzle.js',
  './js/analysis.js',
  './js/hallOfFame.js',
  './js/importer.js',
  './js/engine.js',
  './js/storage.js',
  './data/puzzles.js',
  './data/games.js',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        // Cache files one by one to avoid failures
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url)
            .then(() => {
              console.log('[Service Worker] Cached:', url);
            })
            .catch(err => {
              console.warn('[Service Worker] Failed to cache:', url, err.message);
              // Don't fail the whole installation if one file fails
            });
        });

        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('[Service Worker] Install complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[Service Worker] Install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200) {
            return response;
          }

          // Only cache same-origin requests or successful CORS requests
          if (response.type === 'basic' || response.type === 'cors') {
            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('[Service Worker] Cached:', event.request.url);
              });
          }

          return response;
        }).catch(error => {
          console.log('[Service Worker] Fetch failed:', event.request.url, error);
          // Network failed, return offline page if available
          return caches.match('./index.html');
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});


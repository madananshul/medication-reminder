const CACHE_NAME = 'medreminder-v1';
const STATIC_ASSETS = [
  '/',
  '/medications',
  '/add',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate for navigation, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls: network only
  if (url.pathname.startsWith('/api/')) return;

  // Navigation and assets: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// Push notification handler
self.addEventListener('push', (event) => {
  let data = { title: 'MedReminder', body: 'Time to take your medication!' };
  try {
    data = event.data?.json() ?? data;
  } catch {
    // Use defaults
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      vibrate: [200, 100, 200],
      tag: 'medication-reminder',
      renotify: true,
      actions: [{ action: 'open', title: 'Open App' }],
    })
  );
});

// Notification click: open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      const existing = clients.find((c) => c.url.includes('/'));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow('/');
    })
  );
});

// Message handler for client-triggered notifications
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      vibrate: [200, 100, 200],
      tag: 'medication-reminder',
      renotify: true,
    });
  }
});

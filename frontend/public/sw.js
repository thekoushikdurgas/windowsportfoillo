const CACHE_NAME = 'durgasos-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
  // Icons
  '/icons/assistant.svg',
  '/icons/explorer.svg',
  '/icons/notepad.svg',
  '/icons/settings.svg',
  '/icons/badge.svg',
  '/icons/avatar-alex.svg',
  '/icons/avatar-mike.svg',
  '/icons/avatar-sarah.svg',
  '/icons/avatar-placeholder.svg',
  '/icons/image-placeholder.svg',
  // App Icons
  '/icon-72x72.png',
  '/icon-96x96.png',
  '/icon-128x128.png',
  '/icon-144x144.png',
  '/icon-152x152.png',
  '/icon-192x192.png',
  '/icon-384x384.png',
  '/icon-512x512.png',
  '/icon.png',
  // Screenshots
  '/screenshot-desktop.png',
  '/screenshot-mobile.png',
  // Profile Images
  '/images/koushik-profile.jpg',
  '/images/koushik-profile.png',
  // Wallpapers (all 18)
  '/wallpapers/wallpaper (1).jpg',
  '/wallpapers/wallpaper (2).jpg',
  '/wallpapers/wallpaper (3).jpg',
  '/wallpapers/wallpaper (4).jpg',
  '/wallpapers/wallpaper (5).jpg',
  '/wallpapers/wallpaper (6).jpg',
  '/wallpapers/wallpaper (7).jpg',
  '/wallpapers/wallpaper (8).jpg',
  '/wallpapers/wallpaper (9).jpg',
  '/wallpapers/wallpaper (10).jpg',
  '/wallpapers/wallpaper (11).jpg',
  '/wallpapers/wallpaper (12).jpg',
  '/wallpapers/wallpaper (13).jpg',
  '/wallpapers/wallpaper (14).jpg',
  '/wallpapers/wallpaper (15).jpg',
  '/wallpapers/wallpaper (16).jpg',
  '/wallpapers/wallpaper (17).jpg',
  '/wallpapers/wallpaper (18).jpg',
  // Lottie Animations - App Icons
  '/animations/app-icon-1.json',
  '/animations/app-icon-2.json',
  '/animations/app-icon-3.json',
  '/animations/app-icon-4.json',
  // Lottie Animations - Projects
  '/projects/Email.json',
  '/projects/Creative 3D Visual Animation - Website Development.json',
  '/projects/Task Loader.json',
  '/projects/Maths formula.json',
  '/projects/LOCK WITH GREEN TICK.json',
  '/projects/Finding documents.json',
  '/projects/Wonder Things.json',
  '/projects/code dark.json',
  '/projects/Tic Tac Toe.json',
  '/projects/red and green ludo dice.json',
  '/projects/Music Loader.json',
  '/projects/Music Loader (1).json',
  '/projects/Word puzzle.json',
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).then(fetchResponse => {
          // Cache successful responses for static assets
          if (fetchResponse && fetchResponse.status === 200) {
            const url = new URL(event.request.url);
            // Cache static assets (images, icons, animations, etc.)
            if (
              url.pathname.startsWith('/icons/') ||
              url.pathname.startsWith('/wallpapers/') ||
              url.pathname.startsWith('/images/') ||
              url.pathname.startsWith('/animations/') ||
              url.pathname.startsWith('/projects/') ||
              url.pathname.startsWith('/icon-') ||
              url.pathname === '/icon.png' ||
              url.pathname.startsWith('/screenshot-')
            ) {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        // Return cached asset if available
        return caches.match(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    console.log('Background sync triggered');
    // Implement your sync logic here
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from DurgasOS',
    icon: '/icon-192x192.png',
    badge: '/icons/badge.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('DurgasOS', options));
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

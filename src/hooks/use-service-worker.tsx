'use client';

import { useEffect, useState } from 'react';
import { logger } from '../lib/logger';

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(true);
  const [isServiceWorkerSupported, setIsServiceWorkerSupported] = useState(false);

  useEffect(() => {
    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      setIsServiceWorkerSupported(true);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          logger.info('Service Worker registered successfully:', registration as unknown as Record<string, unknown>);
        })
        .catch((error) => {
          logger.error('Service Worker registration failed:', error);
        });
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = async () => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register('background-sync');
        logger.info('Background sync registered');
      } catch (error) {
        logger.error('Background sync registration failed:', error as unknown as Record<string, unknown>);
      }
    }
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, options);
      }
    }
  };

  return {
    isOnline,
    isServiceWorkerSupported,
    syncData,
    showNotification,
  };
}

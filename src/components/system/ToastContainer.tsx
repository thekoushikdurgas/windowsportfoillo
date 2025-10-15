'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useNotificationStore from '@/store/notificationStore';
import ToastNotification from './ToastNotification';

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();
  const [toastNotifications, setToastNotifications] = useState<typeof notifications>([]);

  useEffect(() => {
    // Show only the most recent non-persistent notifications as toasts
    const recentToasts = notifications
      .filter(n => !n.persistent)
      .slice(0, 3); // Show max 3 toasts at once

    setToastNotifications(recentToasts);
  }, [notifications]);

  const handleDismiss = (id: string) => {
    removeNotification(id);
  };

  const handleAction = (_action: () => void) => {
    // Action is already handled in ToastNotification
  };

  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-3 pointer-events-none">
      <AnimatePresence>
        {toastNotifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <ToastNotification
              notification={notification}
              onDismiss={handleDismiss}
              onAction={handleAction}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

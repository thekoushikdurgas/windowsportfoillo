'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { NotificationItem } from '@/types';

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (data: Omit<NotificationItem, 'id' | 'timestamp'> & { duration?: number }) => void;
  removeNotification: (id: string) => void;
  snoozeNotification: (id: string, duration: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((data: Omit<NotificationItem, 'id' | 'timestamp'> & { duration?: number }) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    const newNotification: NotificationItem = {
      id,
      timestamp: Date.now(),
      title: data.title,
      message: data.message,
      appName: data.appName,
      icon: data.icon
    };

    setNotifications(prev => [newNotification, ...prev]);

    if (data.duration !== 0) {
      const timeout = data.duration || 5000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, timeout);
    }
  }, []);

  const snoozeNotification = useCallback((id: string, duration: number) => {
    const item = notificationsRef.current.find(n => n.id === id);
    if (item) {
        removeNotification(id);
        setTimeout(() => {
            addNotification({
                title: item.title,
                message: item.message,
                appName: item.appName,
                icon: item.icon,
                duration: 5000
            });
        }, duration);
    }
  }, [addNotification, removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, snoozeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};


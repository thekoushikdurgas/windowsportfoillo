import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  appName: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
  icon?: string;
  image?: string;
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  sound?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isNotificationCenterOpen: boolean;
  focusAssist: 'off' | 'priority' | 'alarms' | 'off';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  setNotificationCenterOpen: (open: boolean) => void;
  setFocusAssist: (mode: 'off' | 'priority' | 'alarms' | 'off') => void;
  setQuietHours: (quietHours: { enabled: boolean; start: string; end: string }) => void;
  showToast: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  showSystemNotification: (title: string, message: string, type?: Notification['type']) => string;
  showAppNotification: (appName: string, title: string, message: string, type?: Notification['type']) => string;
}

const useNotificationStore = create<NotificationState & NotificationActions>()(
  subscribeWithSelector((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isNotificationCenterOpen: false,
    focusAssist: 'off',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },

    addNotification: (notificationData) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const notification: Notification = {
        ...notificationData,
        id,
        timestamp: new Date(),
        read: false,
      };

      set((state) => {
        const newNotifications = [notification, ...state.notifications.slice(0, 99)]; // Keep last 100
        const unreadCount = newNotifications.filter(n => !n.read).length;
        return {
          notifications: newNotifications,
          unreadCount,
        };
      });

      // Show toast notification
      if (!get().focusAssist || get().focusAssist === 'off') {
        // This will be handled by the toast system
      }

      return id;
    },

    removeNotification: (id) => {
      set((state) => {
        const newNotifications = state.notifications.filter(n => n.id !== id);
        const unreadCount = newNotifications.filter(n => !n.read).length;
        return {
          notifications: newNotifications,
          unreadCount,
        };
      });
    },

    markAsRead: (id) => {
      set((state) => {
        const newNotifications = state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        );
        const unreadCount = newNotifications.filter(n => !n.read).length;
        return {
          notifications: newNotifications,
          unreadCount,
        };
      });
    },

    markAllAsRead: () => {
      set((state) => {
        const newNotifications = state.notifications.map(n => ({ ...n, read: true }));
        return {
          notifications: newNotifications,
          unreadCount: 0,
        };
      });
    },

    clearAll: () => {
      set({
        notifications: [],
        unreadCount: 0,
      });
    },

    updateNotification: (id, updates) => {
      set((state) => {
        const newNotifications = state.notifications.map(n =>
          n.id === id ? { ...n, ...updates } : n
        );
        const unreadCount = newNotifications.filter(n => !n.read).length;
        return {
          notifications: newNotifications,
          unreadCount,
        };
      });
    },

    setNotificationCenterOpen: (open) => {
      set({ isNotificationCenterOpen: open });
    },

    setFocusAssist: (mode) => {
      set({ focusAssist: mode });
    },

    setQuietHours: (quietHours) => {
      set({ quietHours });
    },

    showToast: (notificationData) => {
      return get().addNotification({
        ...notificationData,
        persistent: false,
      });
    },

    showSystemNotification: (title, message, type = 'info') => {
      return get().addNotification({
        title,
        message,
        type,
        appName: 'System',
        icon: '⚙️',
        priority: 'normal',
      });
    },

    showAppNotification: (appName, title, message, type = 'info') => {
      return get().addNotification({
        title,
        message,
        type,
        appName,
        priority: 'normal',
      });
    },
  }))
);

// Notification templates for common scenarios
export const notificationTemplates = {
  system: {
    bootComplete: () => ({
      title: 'System Ready',
      message: 'Windows 11 has started successfully',
      type: 'success' as const,
      appName: 'System',
      icon: '🪟',
    }),
    lowBattery: () => ({
      title: 'Low Battery',
      message: 'Your battery is running low. Consider plugging in your charger.',
      type: 'warning' as const,
      appName: 'System',
      icon: '🔋',
      persistent: true,
    }),
    wifiConnected: (networkName: string) => ({
      title: 'Wi-Fi Connected',
      message: `Connected to "${networkName}"`,
      type: 'info' as const,
      appName: 'Network',
      icon: '📶',
    }),
    updateAvailable: () => ({
      title: 'Update Available',
      message: 'Windows 11 update is ready to install',
      type: 'info' as const,
      appName: 'Windows Update',
      icon: '🔄',
      actions: [
        {
          label: 'Install Now',
          action: () => {
            // TODO: Implement update installation
          },
        },
        {
          label: 'Schedule',
          action: () => {
            // TODO: Implement update scheduling
          },
        },
      ],
    }),
  },
  apps: {
    calculator: {
      error: () => ({
        title: 'Calculation Error',
        message: 'Cannot divide by zero',
        type: 'error' as const,
        appName: 'Calculator',
        icon: '🧮',
      }),
    },
    fileExplorer: {
      copyComplete: (fileName: string) => ({
        title: 'Copy Complete',
        message: `"${fileName}" has been copied successfully`,
        type: 'success' as const,
        appName: 'File Explorer',
        icon: '📁',
      }),
      deleteConfirm: (fileName: string) => ({
        title: 'Delete File',
        message: `Are you sure you want to delete "${fileName}"?`,
        type: 'warning' as const,
        appName: 'File Explorer',
        icon: '🗑️',
        persistent: true,
        actions: [
          {
            label: 'Delete',
            action: () => {
              // TODO: Implement file deletion
            },
          },
          {
            label: 'Cancel',
            action: () => {
              // TODO: Implement delete cancellation
            },
          },
        ],
      }),
    },
    settings: {
      settingChanged: (settingName: string) => ({
        title: 'Setting Updated',
        message: `${settingName} has been updated`,
        type: 'info' as const,
        appName: 'Settings',
        icon: '⚙️',
      }),
    },
  },
};

export default useNotificationStore;

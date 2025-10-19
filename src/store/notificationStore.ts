import { create } from 'zustand'
import { Notification, NotificationSettings } from '@/types/notifications'

interface NotificationStoreState {
  notifications: Notification[]
  settings: NotificationSettings
  isCenterOpen: boolean
  unreadCount: number
  
  actions: {
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'isDismissed'>) => string
    removeNotification: (id: string) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    dismissNotification: (id: string) => void
    dismissAllNotifications: () => void
    clearAllNotifications: () => void
    updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
    openNotificationCenter: () => void
    closeNotificationCenter: () => void
    toggleNotificationCenter: () => void
    executeNotificationAction: (notificationId: string, actionId: string) => void
  }
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  showInSystemTray: true,
  showBanners: true,
  showSounds: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  doNotDisturb: false,
  maxNotifications: 50,
  autoDismissDelay: 5000,
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  settings: defaultNotificationSettings,
  isCenterOpen: false,
  unreadCount: 0,
  
  actions: {
    addNotification: (notificationData) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const notification: Notification = {
        ...notificationData,
        id,
        timestamp: new Date(),
        isRead: false,
        isDismissed: false,
      }
      
      set((state) => {
        const newNotifications = [notification, ...state.notifications]
        const limitedNotifications = newNotifications.slice(0, state.settings.maxNotifications)
        
        return {
          notifications: limitedNotifications,
          unreadCount: state.unreadCount + 1,
        }
      })
      
      // Auto-dismiss if duration is set
      if (notification.duration) {
        setTimeout(() => {
          get().actions.dismissNotification(id)
        }, notification.duration)
      }
      
      return id
    },
    
    removeNotification: (id) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === id)
        const wasUnread = notification && !notification.isRead
        
        return {
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
        }
      })
    },
    
    markAsRead: (id) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === id)
        if (notification && !notification.isRead) {
          return {
            notifications: state.notifications.map(n =>
              n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: state.unreadCount - 1,
          }
        }
        return state
      })
    },
    
    markAllAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      }))
    },
    
    dismissNotification: (id) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === id)
        const wasUnread = notification && !notification.isRead
        
        return {
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isDismissed: true } : n
          ),
          unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
        }
      })
    },
    
    dismissAllNotifications: () => {
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isDismissed: true })),
        unreadCount: 0,
      }))
    },
    
    clearAllNotifications: () => {
      set({
        notifications: [],
        unreadCount: 0,
      })
    },
    
    updateNotificationSettings: (newSettings) => {
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
      }))
    },
    
    openNotificationCenter: () => {
      set({ isCenterOpen: true })
    },
    
    closeNotificationCenter: () => {
      set({ isCenterOpen: false })
    },
    
    toggleNotificationCenter: () => {
      set((state) => ({ isCenterOpen: !state.isCenterOpen }))
    },
    
    executeNotificationAction: (notificationId, actionId) => {
      const state = get()
      const notification = state.notifications.find(n => n.id === notificationId)
      
      if (notification && notification.actions) {
        const action = notification.actions.find(a => a.id === actionId)
        if (action) {
          action.action()
          // Mark notification as read when action is executed
          state.actions.markAsRead(notificationId)
        }
      }
    },
  },
}))

export const useNotifications = () => useNotificationStore((state) => state.notifications)
export const useNotificationSettings = () => useNotificationStore((state) => state.settings)
export const useNotificationCenter = () => useNotificationStore((state) => ({
  isOpen: state.isCenterOpen,
  unreadCount: state.unreadCount,
}))
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  timestamp: Date
  isRead: boolean
  isDismissed: boolean
  actions?: NotificationAction[]
  icon?: string
  image?: string
  sound?: string
  duration?: number
  persistent?: boolean
  source?: string
  metadata?: Record<string, any>
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'
  | 'app'

export type NotificationPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent'

export interface NotificationAction {
  id: string
  label: string
  action: () => void
  style?: 'default' | 'primary' | 'secondary' | 'danger'
}

export interface NotificationSettings {
  enabled: boolean
  showInSystemTray: boolean
  showBanners: boolean
  showSounds: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  doNotDisturb: boolean
  maxNotifications: number
  autoDismissDelay: number
}

export interface NotificationCenter {
  notifications: Notification[]
  unreadCount: number
  isOpen: boolean
  settings: NotificationSettings
}

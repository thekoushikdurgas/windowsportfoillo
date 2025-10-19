'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications, useNotificationCenter, useNotificationActions } from '@/store/notificationStore'
import { Notification } from '@/types/notifications'
import { X, Bell, Settings, Check, CheckCheck } from 'lucide-react'

export default function NotificationCenter() {
  const notifications = useNotifications()
  const { isOpen, unreadCount } = useNotificationCenter()
  const { 
    markAsRead, 
    markAllAsRead, 
    dismissNotification, 
    dismissAllNotifications,
    closeNotificationCenter 
  } = useNotificationActions()

  const unreadNotifications = notifications.filter(n => !n.isRead && !n.isDismissed)
  const recentNotifications = notifications
    .filter(n => !n.isDismissed)
    .slice(0, 10)

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      case 'info':
        return 'ℹ️'
      case 'system':
        return '🔧'
      case 'app':
        return '📱'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20'
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'system':
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
      case 'app':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
      default:
        return 'border-gray-300 bg-white dark:bg-gray-800'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={dismissAllNotifications}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Dismiss all"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={closeNotificationCenter}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Mark all as read
          </button>
          <button
            onClick={dismissAllNotifications}
            className="flex-1 px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Dismiss all
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {recentNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-lg flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex space-x-2 mt-2">
                        {notification.actions.map((action) => (
                          <button
                            key={action.id}
                            onClick={action.action}
                            className={`px-2 py-1 text-xs rounded ${
                              action.style === 'primary'
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : action.style === 'danger'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            // TODO: Open notification settings
            console.log('Open notification settings')
          }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Notification settings</span>
        </button>
      </div>
    </motion.div>
  )
}

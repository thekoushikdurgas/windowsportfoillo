'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellOff, 
  Settings, 
  X, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  Volume2,
  Shield,
  User
} from 'lucide-react';
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';
import useNotificationStore from '@/store/notificationStore';
import { Notification } from '@/store/notificationStore';

interface NotificationCenterProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isVisible, onClose }: NotificationCenterProps) {
  const { 
    notifications, 
    unreadCount, 
    focusAssist, 
    setFocusAssist, 
    removeNotification, 
    markAsRead, 
    clearAll,
    markAllAsRead 
  } = useNotificationStore();
  
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, onClose]);


  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) {
      return <span className="text-lg">{notification.icon}</span>;
    }

    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-4 right-4 w-80 max-h-[600px] z-[10000] pointer-events-auto"
        style={getMicaStyles(MICA_VARIANTS.panel)}
      >
        <div className="rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFocusAssist(focusAssist === 'off' ? 'priority' : 'off')}
                className={`p-2 rounded-lg transition-colors ${
                  focusAssist !== 'off'
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={focusAssist !== 'off' ? 'Focus assist is on' : 'Turn on focus assist'}
              >
                {focusAssist !== 'off' ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                aria-label="Close notification center"
                title="Close notification center"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Notifications List */}
                <div className="space-y-2">
                  {displayedNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        relative p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${notification.read 
                          ? 'bg-gray-50 hover:bg-gray-100' 
                          : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                        }
                      `}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              notification.read ? 'text-gray-800' : 'text-blue-800'
                            }`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all duration-200"
                              title="Remove notification"
                              aria-label="Remove notification"
                            >
                              <X className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          
                          <p className={`text-sm leading-relaxed mb-2 ${
                            notification.read ? 'text-gray-600' : 'text-blue-600'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {notification.appName}
                              </span>
                            </div>
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2">
                                {notification.actions.map((action, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.action();
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    title={action.label}
                                    aria-label={action.label}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Show More/Less */}
                {notifications.length > 5 && (
                  <div className="p-2">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {showAll ? 'Show less' : `Show all (${notifications.length - 5} more)`}
                    </button>
                  </div>
                )}

                {/* Clear All */}
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-gray-200/50 space-y-2">
                    <button
                      onClick={markAllAsRead}
                      className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={clearAll}
                      className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Sound</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Settings</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Account</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Security</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

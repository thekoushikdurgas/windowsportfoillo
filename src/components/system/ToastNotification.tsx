'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { Notification } from '@/store/notificationStore';
import { VISUAL_EFFECTS, getAnimation } from '@/utils/visualEffects';
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';

interface ToastNotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onAction?: (action: () => void) => void;
}

export default function ToastNotification({ 
  notification, 
  onDismiss, 
  onAction 
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  }, [onDismiss, notification.id]);

  useEffect(() => {
    // Auto-dismiss after 5 seconds unless persistent or hovered
    if (!notification.persistent && !isHovered) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.persistent, isHovered, handleDismiss]);

  const handleAction = (action: () => void) => {
    action();
    handleDismiss();
    onAction?.(action);
  };

  const getNotificationIcon = () => {
    if (notification.icon) {
      return <span className="text-2xl">{notification.icon}</span>;
    }

    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          border: 'border-green-200',
          background: 'bg-green-50',
          accent: 'bg-green-500',
        };
      case 'warning':
        return {
          border: 'border-yellow-200',
          background: 'bg-yellow-50',
          accent: 'bg-yellow-500',
        };
      case 'error':
        return {
          border: 'border-red-200',
          background: 'bg-red-50',
          accent: 'bg-red-500',
        };
      default:
        return {
          border: 'border-blue-200',
          background: 'bg-blue-50',
          accent: 'bg-blue-500',
        };
    }
  };

  const styles = getTypeStyles();

  // Enhanced visual effects
  const notificationEffects = VISUAL_EFFECTS.notification('light');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.95 }}
          transition={getAnimation('spring-normal')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
          style={{
            ...getMicaStyles(MICA_VARIANTS.notification),
            ...notificationEffects,
          }}
        >
          <div className={`
            w-80 rounded-xl border shadow-lg overflow-hidden
            ${styles.border} ${styles.background}
            backdrop-blur-md
          `}>
            {/* Progress bar for timed notifications */}
            {!notification.persistent && !isHovered && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                <motion.div
                  className={`h-full ${styles.accent}`}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
            )}

            <div className="p-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
                      title="Dismiss notification"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {/* App name and timestamp */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {notification.appName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {notification.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Progress indicator */}
                  {notification.progress && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{notification.progress.label || 'Progress'}</span>
                        <span>
                          {notification.progress.current} / {notification.progress.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${styles.accent}`}
                          initial={{ width: '0%' }}
                          animate={{ 
                            width: `${(notification.progress.current / notification.progress.total) * 100}%` 
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleAction(action.action)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-white ${
                            notification.type === 'error' ? 'bg-red-500 hover:bg-red-600' : 
                            notification.type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            notification.type === 'success' ? 'bg-green-500 hover:bg-green-600' : 
                            'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sound indicator */}
            {notification.sound && (
              <div className="absolute top-2 right-2">
                <Volume2 className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

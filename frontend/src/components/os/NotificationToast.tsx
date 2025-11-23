'use client';

import React, { useEffect, useState } from 'react';
import { NotificationItem } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { X, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
  notification: NotificationItem;
  onClose: (id: string) => void;
  onSnooze: (id: string, duration: number) => void;
}

const NotificationToast: React.FC<Props> = ({ notification, onClose, onSnooze }) => {
  const { isDarkMode, accentColor } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSnoozeMenu(true);
  };

  const handleSnooze = (duration: number) => {
      onSnooze(notification.id, duration);
      setShowSnoozeMenu(false);
  };


  return (
    <div 
      className={cn(
        'notification-toast',
        isVisible && 'notification-toast-visible'
      )}
      data-theme={isDarkMode ? 'dark' : 'light'}
      onClick={() => onClose(notification.id)}
      onContextMenu={handleContextMenu}
      onMouseLeave={() => setShowSnoozeMenu(false)}
    >
        {showSnoozeMenu ? (
            <div className="notification-toast-snooze-menu" data-theme={isDarkMode ? 'dark' : 'light'} onClick={(e) => e.stopPropagation()}>
                <div className="notification-toast-snooze-title">
                    <Clock size={12} /> Snooze notification
                </div>
                <div className="notification-toast-snooze-options">
                    <button 
                        onClick={() => handleSnooze(60 * 1000)}
                        className="notification-toast-snooze-button"
                    >
                        <span>For 1 minute (Demo)</span>
                    </button>
                    <button 
                        onClick={() => handleSnooze(60 * 60 * 1000)}
                        className="notification-toast-snooze-button"
                    >
                        <span>For 1 hour</span>
                    </button>
                    <button 
                        onClick={() => handleSnooze(24 * 60 * 60 * 1000)}
                        className="notification-toast-snooze-button"
                    >
                        <span>Until tomorrow</span>
                    </button>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowSnoozeMenu(false); }}
                    className="notification-toast-snooze-cancel"
                    style={{ color: accentColor.hex }}
                >
                    Cancel
                </button>
            </div>
        ) : (
            <div className="notification-toast-content">
                <div className="notification-toast-accent" style={{ backgroundColor: accentColor.hex }}></div>

                <div className="notification-toast-header">
                    <div className="notification-toast-header-left">
                        <div className="notification-toast-icon">
                            {notification.icon || <Bell size={14} />}
                        </div>
                        <span className="notification-toast-app-name">{notification.appName || 'System'}</span>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(notification.id); }}
                        className="notification-toast-close"
                    >
                        <X size={14} />
                    </button>
                </div>
                
                <div className="notification-toast-body">
                    <h4 className="notification-toast-title">{notification.title}</h4>
                    <p className="notification-toast-message">{notification.message}</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default NotificationToast;


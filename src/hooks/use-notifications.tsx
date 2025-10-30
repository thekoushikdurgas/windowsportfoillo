'use client';

import { useState, useCallback, useMemo } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type NotificationType = 'system' | 'app' | 'alert' | 'info' | 'warning' | 'success' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type NotificationState = 'new' | 'read' | 'actioned' | 'dismissed' | 'archived' | 'expired';

export interface NotificationAction {
  id: string;
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
  action: () => void;
  disabled?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  category?: string;
  title: string;
  message: string;
  icon?: string;
  timestamp: Date;
  priority?: NotificationPriority;
  state?: NotificationState;
  duration?: number; // Auto-dismiss after this many milliseconds
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

interface NotificationPanelState {
  notifications: Notification[];
  history: Notification[];
  isOpen: boolean;
  filter?: {
    type?: NotificationType[];
    priority?: NotificationPriority[];
    state?: NotificationState[];
    searchQuery?: string;
  };
}

export function useNotifications() {
  const [state, setState] = useState<NotificationPanelState>({
    notifications: [],
    history: [],
    isOpen: false,
  });

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      priority: notification.priority || 'medium',
      state: notification.state || 'new',
      category: notification.category || 'general',
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications].slice(0, 50), // Keep last 50
    }));

    // Auto-dismiss if duration is specified
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, [removeNotification]);

  const clearAllNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      notifications: [],
    }));
  }, []);

  const toggleNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }, []);

  const closeNotifications = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  // Helper functions for different notification types
  const notifySuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 5000,
      ...options,
    });
  }, [addNotification]);

  const notifyError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: 8000,
      ...options,
    });
  }, [addNotification]);

  const notifyWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000,
      ...options,
    });
  }, [addNotification]);

  const notifyInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 4000,
      ...options,
    });
  }, [addNotification]);

  const markAsRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, state: 'read' as NotificationState } : n
      ),
    }));
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, state: 'new' as NotificationState } : n
      ),
    }));
  }, []);

  const archiveNotification = useCallback((id: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      if (!notification) return prev;
      
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        history: [{ ...notification, state: 'archived' as NotificationState }, ...prev.history].slice(0, 100),
      };
    });
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setState(prev => {
      const notification = prev.notifications.find(n => n.id === id);
      if (!notification) return prev;
      
      return {
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        history: [{ ...notification, state: 'dismissed' as NotificationState }, ...prev.history].slice(0, 100),
      };
    });
  }, []);

  const setFilter = useCallback((filter: NotificationPanelState['filter']) => {
    setState(prev => ({ ...prev, filter }));
  }, []);

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...state.notifications];

    // Apply filters
    if (state.filter) {
      if (state.filter.type && state.filter.type.length > 0) {
        filtered = filtered.filter(n => state.filter!.type!.includes(n.type));
      }
      if (state.filter.priority && state.filter.priority.length > 0) {
        filtered = filtered.filter(n => n.priority && state.filter!.priority!.includes(n.priority));
      }
      if (state.filter.state && state.filter.state.length > 0) {
        filtered = filtered.filter(n => n.state && state.filter!.state!.includes(n.state));
      }
      if (state.filter.searchQuery) {
        const query = state.filter.searchQuery.toLowerCase();
        filtered = filtered.filter(n => 
          n.title.toLowerCase().includes(query) || 
          n.message.toLowerCase().includes(query)
        );
      }
    }

    // Sort by priority then timestamp
    return filtered.sort((a, b) => {
      const priorityOrder: Record<NotificationPriority, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      const aPriority = priorityOrder[a.priority || 'medium'];
      const bPriority = priorityOrder[b.priority || 'medium'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [state.notifications, state.filter]);

  const unreadCount = useMemo(() => {
    return state.notifications.filter(n => n.state === 'new' || !n.state).length;
  }, [state.notifications]);

  return {
    notifications: filteredNotifications,
    allNotifications: state.notifications,
    history: state.history,
    isOpen: state.isOpen,
    filter: state.filter,
    unreadCount,
    addNotification,
    removeNotification,
    clearAllNotifications,
    toggleNotifications,
    closeNotifications,
    markAsRead,
    markAsUnread,
    archiveNotification,
    dismissNotification,
    setFilter,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
}

// Notification component
export function NotificationItem({ 
  notification, 
  onRemove,
  onMarkAsRead,
  onMarkAsUnread,
  onArchive,
  onDismiss,
}: { 
  notification: Notification; 
  onRemove: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDismiss?: (id: string) => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      case 'system':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'app':
        return <Bell className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
      case 'alert':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
      case 'system':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'app':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const isUnread = notification.state === 'new' || !notification.state;
  const priority = notification.priority || 'medium';

  return (
    <div 
      className={cn(
        'p-4 rounded-lg border shadow-sm transition-all hover:shadow-md',
        getBgColor(),
        isUnread && 'ring-2 ring-blue-500/50',
        !isUnread && 'opacity-75'
      )}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {notification.title}
                </h4>
                {notification.category && (
                  <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    {notification.category}
                  </span>
                )}
              </div>
              {priority !== 'medium' && (
                <div className="flex items-center gap-1 mt-1">
                  <div className={cn('w-2 h-2 rounded-full', getPriorityColor())} />
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {priority}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(notification.id)}
              className="p-1 h-auto shrink-0"
              aria-label="Remove notification"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getRelativeTime(notification.timestamp)}
            </p>
            
            <div className="flex items-center gap-1">
              {isUnread && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-6 px-2 text-xs"
                >
                  Mark read
                </Button>
              )}
              {!isUnread && onMarkAsUnread && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsUnread(notification.id)}
                  className="h-6 px-2 text-xs"
                >
                  Mark unread
                </Button>
              )}
            </div>
          </div>

          {notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {notification.actions.map((action) => (
                <Button
                  key={action.id || `${notification.id}-action-${action.label}`}
                  size="sm"
                  variant={action.type === 'primary' ? 'default' : action.type === 'danger' ? 'destructive' : 'outline'}
                  onClick={action.action}
                  disabled={action.disabled}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

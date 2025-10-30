'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Settings, History, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, NotificationItem, Notification } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    history,
    unreadCount,
    clearAllNotifications,
    closeNotifications,
    removeNotification,
    markAsRead,
    markAsUnread,
    archiveNotification,
    dismissNotification,
  } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [groupBy, setGroupBy] = useState<'none' | 'type' | 'category' | 'priority'>('none');
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Group notifications
  const groupedNotifications = useMemo(() => {
    if (groupBy === 'none') {
      return { 'all': notifications };
    }

    const groups: Record<string, Notification[]> = {};
    notifications.forEach(notification => {
      let key = 'all';
      
      switch (groupBy) {
        case 'type':
          key = notification.type;
          break;
        case 'category':
          key = notification.category || 'uncategorized';
          break;
        case 'priority':
          key = notification.priority || 'medium';
          break;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(notification);
    });

    return groups;
  }, [notifications, groupBy]);

  // Handle ESC key and body overflow
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      // Only close if panel is open and fully visible
      if (e.key === 'Escape' && isOpen && isAnimating && shouldRender) {
        e.preventDefault();
        closeNotifications();
        onClose();
      }
    };

    if (isOpen && shouldRender) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      if (isAnimating) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll when panel closes or unmounts
      if (!isOpen || !shouldRender) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, isAnimating, shouldRender, closeNotifications, onClose]);

  // Reset overlay states when panel closes
  useEffect(() => {
    if (!isOpen && !shouldRender) {
      setShowSettings(false);
      setShowHistory(false);
    }
  }, [isOpen, shouldRender]);

  // Animation state management
  useEffect(() => {
    // Clear any pending timers when dependency changes
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    if (isOpen) {
      // Opening: Mount first, then animate in
      setShouldRender(true);
      // Use double requestAnimationFrame to ensure DOM is ready and browser has painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else if (shouldRender) {
      // Closing: Animate out, then unmount
      setIsAnimating(false);
      // Wait for animation to complete before unmounting
      animationTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        setShowSettings(false); // Close any open overlays
        setShowHistory(false);
        animationTimerRef.current = null;
      }, 300); // Match animation duration (300ms)
    }

    return () => {
      // Cleanup: clear timer if component unmounts or state changes
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [isOpen, shouldRender]);

  // Handle click outside (only when panel is fully open)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only handle clicks when panel is fully open and not currently animating out
      if (
        panelRef.current && 
        isOpen && 
        isAnimating && 
        shouldRender && 
        !panelRef.current.contains(e.target as Node)
      ) {
        closeNotifications();
        onClose();
      }
    };

    // Only attach listener when panel is fully open and stable
    if (isOpen && isAnimating && shouldRender) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 300); // Wait for opening animation to complete

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isAnimating, shouldRender, closeNotifications, onClose]);

  // Don't render if shouldRender is false
  if (!shouldRender) return null;

  const panelContent = (
    <>
      {/* Backdrop Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]',
          'transition-opacity duration-300 ease-out',
          isAnimating && shouldRender ? 'opacity-100' : 'opacity-0',
          !shouldRender && 'pointer-events-none'
        )}
        onClick={() => {
          if (isAnimating && shouldRender) {
            closeNotifications();
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* Notification Panel */}
      <div
        ref={panelRef}
        className={cn(
          'fixed right-0 top-0 bottom-0 w-96 max-w-full',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
          'border-l border-gray-200 dark:border-gray-700',
          'shadow-2xl z-[9999]',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          isAnimating && shouldRender ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          willChange: shouldRender ? 'transform' : 'auto',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Notification Panel"
        aria-describedby="notification-panel-description"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              <p id="notification-panel-description" className="sr-only">
                Notification panel with {notifications.length} notifications, {unreadCount} unread
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
              aria-label="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="h-8 w-8 p-0"
                aria-label="Clear All Notifications"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                closeNotifications();
                onClose();
              }}
              className="h-8 w-8 p-0"
              aria-label="Close Notification Panel"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search notifications"
            />
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4 opacity-50" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {Object.entries(groupedNotifications).map(([groupKey, groupNotifications]) => {
                const filtered = groupNotifications.filter(notification => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    notification.title.toLowerCase().includes(query) ||
                    notification.message.toLowerCase().includes(query)
                  );
                });

                if (filtered.length === 0) return null;

                return (
                  <div key={groupKey} className="space-y-3">
                    {groupBy !== 'none' && (
                      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {groupKey} ({filtered.length})
                        </h3>
                      </div>
                    )}
                    {filtered.map((notification, index) => (
                      <div
                        key={notification.id}
                        className="group animate-in fade-in slide-in-from-right"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <NotificationItem
                          notification={notification}
                          onRemove={removeNotification}
                          onMarkAsRead={markAsRead}
                          onMarkAsUnread={markAsUnread}
                          onArchive={archiveNotification}
                          onDismiss={dismissNotification}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings Panel Overlay */}
        {showSettings && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-[10000] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Group By
                </label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="type">Type</option>
                  <option value="category">Category</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* History Panel Overlay */}
        {showHistory && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-[10000] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((notification, index) => (
                    <div
                      key={notification.id}
                      className="opacity-60"
                    >
                      <NotificationItem
                        notification={notification}
                        onRemove={removeNotification}
                        onMarkAsRead={markAsRead}
                        onMarkAsUnread={markAsUnread}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        {!showSettings && !showHistory && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="flex-1"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );

  // Render using portal to ensure proper z-index stacking
  return typeof document !== 'undefined' 
    ? createPortal(panelContent, document.body)
    : null;
}

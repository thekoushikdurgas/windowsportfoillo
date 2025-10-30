'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { X, Square, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { App } from '@/lib/apps.config';
import { LazyApp } from './LazyApp';
import { Button } from '@/components/ui/button';
import { useMobileWindowGestures } from '@/hooks/use-touch-gestures';
import { usePerformance } from '@/hooks/use-performance';

interface MobileAppWindowProps {
  id: string;
  app: App;
  data?: unknown;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

const MobileAppWindowComponent = ({ id, app, data, isMinimized, isMaximized }: MobileAppWindowProps) => {
  const { closeApp, toggleMinimize, toggleMaximize } = useDesktop();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Performance monitoring
  usePerformance(`MobileAppWindow-${app.id}`, {
    threshold: 16,
    logToConsole: process.env['NODE_ENV'] === 'development'
  });

  // Touch gestures for mobile window management
  const {
    touchHandlers,
    isFullscreen: gestureFullscreen,
    isMinimized: gestureMinimized,
    setIsFullscreen: setGestureFullscreen,
    setIsMinimized: setGestureMinimized
  } = useMobileWindowGestures();

  useEffect(() => {
    if (isMaximized) {
      setIsFullscreen(true);
    }
  }, [isMaximized]);

  useEffect(() => {
    if (gestureMinimized) {
      toggleMinimize(id);
      setGestureMinimized(false);
    }
  }, [gestureMinimized, id, toggleMinimize, setGestureMinimized]);

  useEffect(() => {
    if (gestureFullscreen !== isFullscreen) {
      setIsFullscreen(gestureFullscreen);
      toggleMaximize(id);
    }
  }, [gestureFullscreen, isFullscreen, id, toggleMaximize]);

  const handleBack = useCallback(() => {
    if (isFullscreen) {
      setIsFullscreen(false);
      setGestureFullscreen(false);
      toggleMaximize(id);
    }
  }, [isFullscreen, id, toggleMaximize, setGestureFullscreen]);

  const handleMinimize = useCallback(() => {
    toggleMinimize(id);
  }, [id, toggleMinimize]);

  const handleMaximize = useCallback(() => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    setGestureFullscreen(newFullscreen);
    toggleMaximize(id);
  }, [isFullscreen, id, toggleMaximize, setGestureFullscreen]);

  const handleClose = useCallback(() => {
    closeApp(id);
  }, [id, closeApp]);

  if (isMinimized) {
    return null;
  }

  return (
    <div
      {...touchHandlers}
      className={cn(
        'fixed inset-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300',
        isFullscreen ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      {/* Mobile Header */}
      <div className="flex items-center justify-between h-12 px-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {isFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <app.Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white truncate">
            {app.title}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="p-2"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            className="p-2"
          >
            {isFullscreen ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2 text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* App Content */}
      <div className="h-[calc(100vh-3rem)] overflow-hidden">
        <LazyApp appId={app.id} data={data as Record<string, unknown>} />
      </div>
    </div>
  );
};

// Memoized component for better performance
export const MobileAppWindow = memo(MobileAppWindowComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.zIndex === nextProps.zIndex &&
    prevProps.isMinimized === nextProps.isMinimized &&
    prevProps.isMaximized === nextProps.isMaximized &&
    prevProps.app.id === nextProps.app.id &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});

MobileAppWindow.displayName = 'MobileAppWindow';

'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDesktop } from '@/context/DesktopContext';
import { X, Square, Minus, RotateCcw, Pin, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { App } from '@/lib/apps.config';
import { LazyApp } from './LazyApp';
import { usePerformance } from '@/hooks/use-performance';
import { useWindowSnapping } from '@/hooks/use-window-snapping';

interface AppWindowProps {
  id: string;
  app: App;
  data?: Record<string, unknown>;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

const AppWindowComponent = ({ id, app, data, zIndex, isMinimized, isMaximized, position, size }: AppWindowProps) => {
  const { closeApp, focusApp, toggleMinimize, toggleMaximize, updateWindow, toggleAlwaysOnTop, setWindowTransparency, restoreWindow, saveWindowState } = useDesktop();
  const { snappingState, handleDragStart, handleDrag, handleDragStop } = useWindowSnapping();
  const [isDragging, setIsDragging] = useState(false);
  
  // Performance monitoring
  usePerformance(`AppWindow-${app.id}`, {
    threshold: 16, // 60fps
    logToConsole: process.env['NODE_ENV'] === 'development'
  });

  // Memoized callbacks to prevent unnecessary re-renders
  const handleRndDragStop = useCallback((_e: unknown, d: { x: number; y: number; }) => {
    const snapResult = handleDragStop();
    if (snapResult) {
      updateWindow(id, {
        position: snapResult.position,
        size: snapResult.size,
      });
    } else {
      updateWindow(id, { position: { x: d.x, y: d.y } });
    }
    setIsDragging(false);
  }, [id, updateWindow, handleDragStop]);

  const handleResizeStop = useCallback((_e: unknown, _dir: unknown, ref: { style: { width: string; height: string; }; }, _delta: unknown, position: { x: number; y: number }) => {
    updateWindow(id, {
      size: { width: ref.style.width, height: ref.style.height },
      position,
    });
  }, [id, updateWindow]);

  const handleFocus = useCallback(() => {
    focusApp(id);
  }, [id, focusApp]);

  const handleMinimize = useCallback(() => {
    toggleMinimize(id);
  }, [id, toggleMinimize]);

  const handleMaximize = useCallback(() => {
    // Save current state before maximizing
    saveWindowState(id);
    toggleMaximize(id);
  }, [id, toggleMaximize, saveWindowState]);

  const handleRestore = useCallback(() => {
    restoreWindow(id);
  }, [id, restoreWindow]);

  const handleClose = useCallback(() => {
    closeApp(id);
  }, [id, closeApp]);

  const handleRndDragStart = useCallback(() => {
    handleDragStart();
    setIsDragging(true);
  }, [handleDragStart]);

  const handleRndDrag = useCallback((_e: unknown, d: { x: number; y: number; }) => {
    if (isDragging) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const windowWidth = typeof size.width === 'number' ? size.width : parseInt(size.width as string);
      const windowHeight = typeof size.height === 'number' ? size.height : parseInt(size.height as string);
      
      handleDrag(d.x, d.y, windowWidth, windowHeight, viewportWidth, viewportHeight);
    }
  }, [isDragging, size, handleDrag]);

  // Memoized computed values
  const rndSize = useMemo(() => 
    isMaximized ? { width: '100%', height: 'calc(100% - 48px)' } : size,
    [isMaximized, size]
  );

  const rndPosition = useMemo(() => 
    isMaximized ? { x: 0, y: 0 } : position,
    [isMaximized, position]
  );

  const windowClassName = useMemo(() => 
    cn(
      'w-full h-full flex flex-col bg-background border border-white/20 shadow-2xl',
      isMaximized ? '' : 'rounded-lg'
    ),
    [isMaximized]
  );

  const rndClassName = useMemo(() => 
    cn('transition-all duration-200 ease-in-out', isMaximized ? '' : 'rounded-lg overflow-hidden'),
    [isMaximized]
  );

  if (isMinimized) {
    return null;
  }

  return (
    <Rnd
      size={rndSize}
      position={rndPosition}
      onDragStart={handleRndDragStart}
      onDrag={handleRndDrag}
      onDragStop={handleRndDragStop}
      onResizeStart={handleFocus}
      onResizeStop={handleResizeStop}
      minWidth={300}
      minHeight={200}
      dragHandleClassName="handle"
      className={cn(rndClassName, snappingState.isSnapping && 'ring-2 ring-blue-500 ring-opacity-50')}
      style={{ zIndex }}
      bounds="parent"
      enableResizing={!isMaximized}
    >
      <div
        onMouseDown={handleFocus}
        className={windowClassName}
        data-testid="app-window"
        data-app-id={app.id}
      >
        <header className="handle h-8 flex items-center justify-between pl-2 bg-secondary/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <app.Icon className="w-4 h-4 text-foreground" />
            <span className="text-xs window-title">{app.title}</span>
          </div>
          <div className="flex items-center h-full">
            <button 
              onClick={handleMinimize} 
              className="h-full px-3 text-foreground hover:bg-white/10 transition-colors minimize-button"
              data-testid="minimize-button"
              title="Minimize window"
            >
              <Minus size={16} />
            </button>
            <button 
              onClick={isMaximized ? handleRestore : handleMaximize} 
              className="h-full px-3 text-foreground hover:bg-white/10 transition-colors maximize-button"
              data-testid="maximize-button"
              title={isMaximized ? "Restore window" : "Maximize window"}
            >
              {isMaximized ? <RotateCcw size={14} /> : <Square size={14} />}
            </button>
            <button 
              onClick={() => toggleAlwaysOnTop(id)} 
              className="h-full px-3 text-foreground hover:bg-white/10 transition-colors"
              title="Toggle always on top"
            >
              <Pin size={14} />
            </button>
            <button 
              onClick={() => setWindowTransparency(id, 0.7)} 
              className="h-full px-3 text-foreground hover:bg-white/10 transition-colors"
              title="Set transparency"
            >
              <Eye size={14} />
            </button>
            <button 
              onClick={handleClose} 
              className="h-full px-3 text-foreground hover:bg-red-500 transition-colors close-button"
              data-testid="close-button"
              title="Close window"
            >
              <X size={16} />
            </button>
          </div>
        </header>
        <main className="flex-grow overflow-auto">
          <LazyApp appId={app.id} data={data || {}} />
        </main>
      </div>
    </Rnd>
  );
};

// Memoized component to prevent unnecessary re-renders
export const AppWindow = memo(AppWindowComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.id === nextProps.id &&
    prevProps.zIndex === nextProps.zIndex &&
    prevProps.isMinimized === nextProps.isMinimized &&
    prevProps.isMaximized === nextProps.isMaximized &&
    prevProps.position.x === nextProps.position.x &&
    prevProps.position.y === nextProps.position.y &&
    prevProps.size.width === nextProps.size.width &&
    prevProps.size.height === nextProps.size.height &&
    prevProps.app.id === nextProps.app.id &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});

AppWindow.displayName = 'AppWindow';

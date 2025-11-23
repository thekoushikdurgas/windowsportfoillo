'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { X, Minus, Square, Copy } from 'lucide-react';
import SnapLayouts, { SnapZone } from './SnapLayouts';
import { BORDER_RADIUS, SHADOWS, WINDOW_CONFIG } from '@/lib/windows11';
import { cn } from '@/lib/utils/cn';

interface WindowComponentProps {
  state: WindowState;
  isActive: boolean;
  icon: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (pos: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  onSnap?: (zone: SnapZone) => void;
  onUnsnap?: () => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowComponentProps> = ({ 
  state, isActive, icon, 
  onFocus, onClose, onMinimize, onMaximize, onMove, onResize,
  onSnap, onUnsnap,
  children 
}) => {
  const { isDarkMode, transparencyEffect } = useTheme();
  
  const [position, setPosition] = useState(state.position);
  const [size, setSize] = useState(state.size);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const windowRef = useRef<HTMLDivElement>(null);

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPosition(state.position);
    setSize(state.size);
  }, [state.position, state.size]);

  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { sizeRef.current = size; }, [size]);

  // Windows 11 rounded corners
  const borderRadius = state.isMaximized ? BORDER_RADIUS.windowMaximized : BORDER_RADIUS.window;
  
  // Windows 11 shadow based on active state
  const shadow = isActive ? SHADOWS.windowActive : SHADOWS.window;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isMaximized) return;
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
  };

  const handleSnap = (zone: SnapZone) => {
    if (onSnap) {
      // Calculate snapped position and size
      const snappedPosition = { x: zone.x, y: zone.y };
      const snappedSize = { width: zone.width, height: zone.height };
      
      setPosition(snappedPosition);
      setSize(snappedSize);
      onMove(snappedPosition);
      onResize(snappedSize);
      onSnap(zone);
    }
  };

  const handleUnsnap = () => {
    if (onUnsnap) {
      onUnsnap();
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport boundaries
      const constrainedX = Math.max(0, Math.min(newX, viewportSize.width - sizeRef.current.width));
      const constrainedY = Math.max(0, Math.min(newY, viewportSize.height - sizeRef.current.height - 48)); // Account for taskbar
      
      const newPos = {
        x: constrainedX,
        y: constrainedY
      };
      setPosition(newPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onMove(positionRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove, viewportSize]);

  if (state.isMinimized || !state.isOpen) return null;

  // Handle snapped state
  const isSnapped = state.isSnapped || false;
  const snappedPosition = state.snapState ? {
    x: state.snapState.layout === 'left' || state.snapState.layout === 'top-left' || state.snapState.layout === 'bottom-left' ? 0 :
       state.snapState.layout === 'right' || state.snapState.layout === 'top-right' || state.snapState.layout === 'bottom-right' ? viewportSize.width / 2 :
       state.snapState.layout === 'top' ? 0 : 0,
    y: state.snapState.layout === 'top' || state.snapState.layout === 'top-left' || state.snapState.layout === 'top-right' ? 0 :
       state.snapState.layout === 'bottom' || state.snapState.layout === 'bottom-left' || state.snapState.layout === 'bottom-right' ? viewportSize.height / 2 :
       0,
  } : null;

  // Constrain position to viewport
  const constrainedPosition = {
    x: Math.max(0, Math.min(position.x, viewportSize.width - size.width)),
    y: Math.max(0, Math.min(position.y, viewportSize.height - size.height - 48)) // Account for taskbar
  };
  
  // Constrain size to viewport
  const constrainedSize = {
    width: Math.min(size.width, viewportSize.width - constrainedPosition.x),
    height: Math.min(size.height, viewportSize.height - constrainedPosition.y - 48) // Account for taskbar
  };

  const layoutStyle: React.CSSProperties = state.isMaximized ? {
    left: 0,
    top: 0,
    width: '100%',
    height: 'calc(100% - var(--taskbar-height, 48px))',
    maxWidth: '100%',
    maxHeight: 'calc(100% - var(--taskbar-height, 48px))',
    borderRadius: BORDER_RADIUS.windowMaximized,
  } : isSnapped && snappedPosition ? {
    left: snappedPosition.x,
    top: snappedPosition.y,
    width: viewportSize.width / 2,
    maxWidth: viewportSize.width / 2,
    height: state.snapState?.layout === 'top' || state.snapState?.layout === 'bottom' 
      ? viewportSize.height / 2 
      : viewportSize.height - 48,
    maxHeight: state.snapState?.layout === 'top' || state.snapState?.layout === 'bottom' 
      ? viewportSize.height / 2 
      : viewportSize.height - 48,
    borderRadius: borderRadius,
  } : {
    left: constrainedPosition.x,
    top: constrainedPosition.y,
    width: constrainedSize.width,
    height: constrainedSize.height,
    maxWidth: viewportSize.width - constrainedPosition.x,
    maxHeight: viewportSize.height - constrainedPosition.y - 48,
    borderRadius: borderRadius,
  };

  return (
    <>
      {/* Snap Layouts Overlay */}
      {isDragging && onSnap && (
        <SnapLayouts
          windowId={state.id}
          windowPosition={position}
          windowSize={size}
          onSnap={handleSnap}
          onUnsnap={handleUnsnap}
          isDragging={isDragging}
          viewportWidth={viewportSize.width}
          viewportHeight={viewportSize.height}
        />
      )}

      <div
        ref={windowRef}
        className={cn(
          'window-container',
          'win11-window win11-transition',
          isActive ? 'win11-window-active' : 'win11-window-inactive',
          state.isMaximized && 'win11-window-maximized'
        )}
        data-active={isActive}
        data-maximized={state.isMaximized}
        data-theme={isDarkMode ? 'dark' : 'light'}
        style={{
          ...layoutStyle,
          zIndex: state.zIndex,
          boxShadow: shadow,
          animation: state.animationState === 'opening' ? 'win11-window-open 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' :
                     state.animationState === 'closing' ? 'win11-window-close 150ms cubic-bezier(0.1, 0.9, 0.2, 1)' :
                     state.animationState === 'minimizing' ? 'win11-window-minimize 150ms cubic-bezier(0.1, 0.9, 0.2, 1)' :
                     state.animationState === 'maximizing' ? 'win11-window-maximize 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' :
                     state.animationState === 'restoring' ? 'win11-window-restore 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
        }}
        onMouseDown={onFocus}
      >
        {/* Acrylic Title Bar */}
        <div 
          className={cn(
            'window-titlebar',
            state.isMaximized ? '' : 'cursor-default'
          )}
          data-transparency={transparencyEffect}
          data-theme={isDarkMode ? 'dark' : 'light'}
          onMouseDown={handleMouseDown}
          onDoubleClick={onMaximize}
        >
        <div className="window-titlebar-content">
          {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 16 })}
          <span className="window-titlebar-title">{state.title}</span>
        </div>
        <div className="window-titlebar-controls">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="window-titlebar-button"><Minus size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="window-titlebar-button">
            {state.isMaximized ? <Copy size={12} className="rotate-180" /> : <Square size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="window-titlebar-button window-titlebar-button-close"><X size={14} /></button>
        </div>
      </div>

      <div className="window-content">
        {children}
      </div>
      
      {!state.isMaximized && !isSnapped && (
        <div 
            className="window-resize-handle"
            onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const startW = size.width;
                const startH = size.height;
                
                const handleResize = (ev: MouseEvent) => {
                    const newWidth = startW + (ev.clientX - startX);
                    const newHeight = startH + (ev.clientY - startY);
                    
                    // Constrain to viewport boundaries
                    const maxWidth = viewportSize.width - positionRef.current.x;
                    const maxHeight = viewportSize.height - positionRef.current.y - 48; // Account for taskbar
                    
                    setSize({
                        width: Math.max(WINDOW_CONFIG.minWidth, Math.min(newWidth, maxWidth)),
                        height: Math.max(WINDOW_CONFIG.minHeight, Math.min(newHeight, maxHeight))
                    });
                };
                const stopResize = () => {
                    window.removeEventListener('mousemove', handleResize);
                    window.removeEventListener('mouseup', stopResize);
                    onResize(sizeRef.current);
                };
                window.addEventListener('mousemove', handleResize);
                window.addEventListener('mouseup', stopResize);
            }}
        />
      )}
    </div>
    </>
  );
};

export default Window;


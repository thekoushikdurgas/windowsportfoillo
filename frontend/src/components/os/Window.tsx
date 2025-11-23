'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { X, Minus, Square, Copy } from 'lucide-react';
import { Acrylic } from '@/components/ui/Acrylic';
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
  const { isDarkMode, accentColor, transparencyEffect } = useTheme();
  
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

  const bg = isDarkMode ? 'bg-[#202020]' : 'bg-[#f3f3f3]';
  const titleBarBg = transparencyEffect 
    ? (isDarkMode ? 'bg-[#2d2d2d]/85 backdrop-blur-xl' : 'bg-[#e5e5e5]/85 backdrop-blur-xl')
    : (isDarkMode ? 'bg-[#2d2d2d]' : 'bg-[#e5e5e5]');
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  
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
      const newPos = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
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
  }, [isDragging, dragOffset, onMove]);

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

  const layoutStyle: React.CSSProperties = state.isMaximized ? {
    left: 0,
    top: 0,
    width: '100%',
    height: 'calc(100% - 48px)',
    borderRadius: BORDER_RADIUS.windowMaximized,
  } : isSnapped && snappedPosition ? {
    left: snappedPosition.x,
    top: snappedPosition.y,
    width: viewportSize.width / 2,
    height: state.snapState?.layout === 'top' || state.snapState?.layout === 'bottom' 
      ? viewportSize.height / 2 
      : viewportSize.height - 48,
    borderRadius: borderRadius,
  } : {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
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
          'absolute flex flex-col overflow-hidden border',
          'win11-window win11-transition',
          borderColor,
          bg,
          isActive ? 'win11-window-active' : 'opacity-95',
          state.isMaximized && 'win11-window-maximized'
        )}
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
            'h-10 flex items-center justify-between select-none shrink-0',
            titleBarBg,
            state.isMaximized ? '' : 'cursor-default'
          )}
          onMouseDown={handleMouseDown}
          onDoubleClick={onMaximize}
        >
        <div className="flex items-center gap-3 px-4 pointer-events-none">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
          <span className={`text-xs font-medium ${textColor}`}>{state.title}</span>
        </div>
        <div className="flex h-full">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className={`px-4 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} ${textColor} flex items-center justify-center`}><Minus size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className={`px-4 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'} ${textColor} flex items-center justify-center`}>
            {state.isMaximized ? <Copy size={12} className="rotate-180" /> : <Square size={12} />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={`px-4 hover:bg-red-500 hover:text-white ${textColor} flex items-center justify-center`}><X size={14} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      
      {!state.isMaximized && !isSnapped && (
        <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50"
            onMouseDown={(e) => {
                e.stopPropagation();
                const startX = e.clientX;
                const startY = e.clientY;
                const startW = size.width;
                const startH = size.height;
                
                const handleResize = (ev: MouseEvent) => {
                    setSize({
                        width: Math.max(WINDOW_CONFIG.minWidth, startW + (ev.clientX - startX)),
                        height: Math.max(WINDOW_CONFIG.minHeight, startH + (ev.clientY - startY))
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


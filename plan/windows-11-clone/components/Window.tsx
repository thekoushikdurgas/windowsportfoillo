import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { WindowState } from '../types';
import { APPS } from '../constants';
import { MinimizeIcon, MaximizeIcon, RestoreIcon, CloseIcon } from './icons';
import { useWindowSize } from '../hooks/useWindowSize';
import { useDraggable } from '../hooks/useDraggable';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onDestroy: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onDrag: (id: string, newPosition: { x: number; y: number }) => void;
  onResize: (id: string, newSize: { width: number; height: number }, newPosition: { x: number; y: number }) => void;
  isFocused: boolean;
  desktopSize: { width: number; height: number };
}

const WindowComponent: React.FC<WindowProps> = ({
  windowState, onClose, onDestroy, onMinimize, onMaximize, onFocus, onDrag, onResize, isFocused, desktopSize
}) => {
  const { id, appId, position, size, isMinimized, isMaximized, title, icon, zIndex, isClosing } = windowState;
  const { width: screenWidth } = useWindowSize();
  const isMobile = screenWidth < 768; // Tailwind's md breakpoint
  
  const app = APPS.find(a => a.id === appId);
  const AppComponent = app?.component;

  const resizeRef = useRef({ width: 0, height: 0, x: 0, y: 0, mouseX: 0, mouseY: 0, direction: '' });
  const windowRef = useRef<HTMLDivElement>(null);

  const { handleDragStart: triggerDragStart } = useDraggable({
    onDrag: (newPos) => onDrag(id, newPos),
    initialPosition: position,
    windowSize: size,
    bounds: {
        top: 0,
        left: 0,
        right: desktopSize.width,
        bottom: desktopSize.height,
    },
    disabled: isMaximized || isMobile,
  });

  const handleDragStart = (e: React.MouseEvent) => {
    onFocus(id);
    triggerDragStart(e);
  };
  
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    onFocus(id);
    resizeRef.current = {
      width: size.width,
      height: size.height,
      x: position.x,
      y: position.y,
      mouseX: e.clientX,
      mouseY: e.clientY,
      direction,
    };
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    const dx = e.clientX - resizeRef.current.mouseX;
    const dy = e.clientY - resizeRef.current.mouseY;
    let newWidth = resizeRef.current.width;
    let newHeight = resizeRef.current.height;
    let newX = resizeRef.current.x;
    let newY = resizeRef.current.y;

    if (resizeRef.current.direction.includes('right')) newWidth = Math.max(300, resizeRef.current.width + dx);
    if (resizeRef.current.direction.includes('bottom')) newHeight = Math.max(200, resizeRef.current.height + dy);
    if (resizeRef.current.direction.includes('left')) {
      newWidth = Math.max(300, resizeRef.current.width - dx);
      newX = resizeRef.current.x + dx;
    }
    if (resizeRef.current.direction.includes('top')) {
      newHeight = Math.max(200, resizeRef.current.height - dy);
      newY = resizeRef.current.y + dy;
    }

    onResize(id, { width: newWidth, height: newHeight }, { x: newX, y: newY });
  }, [id, onResize]);

  const handleResizeEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);


  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  const handleAnimationEnd = () => {
    if (isClosing) {
      onDestroy(id);
    }
  };


  if (isMinimized) return null;

  const windowStyle: React.CSSProperties = (isMaximized || isMobile) ? {
    top: 0,
    left: 0,
    width: desktopSize.width,
    height: desktopSize.height,
    zIndex,
  } : {
    top: position.y,
    left: position.x,
    width: size.width,
    height: size.height,
    zIndex,
  };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-slate-200/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-lg window-shadow overflow-hidden
        ${isMaximized || isMobile ? 'rounded-none duration-200' : 'duration-100'}
        ${isClosing ? 'window-closing' : 'window-opening'}
      `}
      style={windowStyle}
      onMouseDown={() => onFocus(id)}
      onAnimationEnd={handleAnimationEnd}
    >
        {!isMaximized && !isMobile && (
            <>
                <div className="resize-handle resize-handle-top" onMouseDown={(e) => handleResizeStart(e, 'top')}></div>
                <div className="resize-handle resize-handle-bottom" onMouseDown={(e) => handleResizeStart(e, 'bottom')}></div>
                <div className="resize-handle resize-handle-left" onMouseDown={(e) => handleResizeStart(e, 'left')}></div>
                <div className="resize-handle resize-handle-right" onMouseDown={(e) => handleResizeStart(e, 'right')}></div>
                <div className="resize-handle resize-handle-top-left" onMouseDown={(e) => handleResizeStart(e, 'top-left')}></div>
                <div className="resize-handle resize-handle-top-right" onMouseDown={(e) => handleResizeStart(e, 'top-right')}></div>
                <div className="resize-handle resize-handle-bottom-left" onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}></div>
                <div className="resize-handle resize-handle-bottom-right" onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}></div>
            </>
        )}
      <header
        onMouseDown={handleDragStart}
        onDoubleClick={() => !isMobile && onMaximize(id)}
        className={`flex items-center justify-between h-8 px-2 text-sm select-none text-gray-900 dark:text-gray-100 ${isMobile ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} border-b border-black/10 dark:border-white/10`}
      >
        <div className="flex items-center gap-2">
            {/* FIX: Removed redundant type cast. The 'icon' prop is now correctly typed as React.ReactElement. */}
            {React.cloneElement(icon, { className: 'w-4 h-4' })}
            <span>{title}</span>
        </div>
        <div className="flex items-center text-gray-900 dark:text-gray-100">
          <button onClick={() => onMinimize(id)} className="w-8 h-8 hidden md:flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"><MinimizeIcon /></button>
          <button onClick={() => onMaximize(id)} className="w-8 h-8 hidden md:flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
          </button>
          <button onClick={() => onClose(id)} className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><CloseIcon /></button>
        </div>
      </header>
      <main className="flex-grow overflow-auto">
        {AppComponent && <AppComponent onClose={() => onClose(id)} />}
      </main>
    </div>
  );
};

export default WindowComponent;

import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Minus, Square, Copy } from 'lucide-react';

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
  children: React.ReactNode;
}

const Window: React.FC<WindowComponentProps> = ({ 
  state, isActive, icon, 
  onFocus, onClose, onMinimize, onMaximize, onMove, onResize,
  children 
}) => {
  const { isDarkMode, accentColor } = useTheme();
  
  // Local state for smooth dragging/resizing
  const [position, setPosition] = useState(state.position);
  const [size, setSize] = useState(state.size);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Sync with global state (e.g. when restoring from maximized)
  useEffect(() => {
    setPosition(state.position);
    setSize(state.size);
  }, [state.position, state.size]);

  // Use refs for drag handlers to avoid stale closures
  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { sizeRef.current = size; }, [size]);

  // Styles
  const bg = isDarkMode ? 'bg-[#202020]' : 'bg-[#f3f3f3]';
  const titleBarBg = isDarkMode ? 'bg-[#2d2d2d]' : 'bg-[#e5e5e5]';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const activeBorder = isActive && !state.isMaximized ? (isDarkMode ? `ring-1 ring-${accentColor.tailwind}/50` : `ring-1 ring-${accentColor.tailwind}/50`) : '';

  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isMaximized) return; // Disable drag if maximized
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
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
      // Sync final position with parent
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

  // Determine layout style based on maximization state
  const layoutStyle: React.CSSProperties = state.isMaximized ? {
    left: 0,
    top: 0,
    width: '100%',
    height: 'calc(100% - 48px)', // Leave room for taskbar
    borderRadius: 0,
  } : {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
  };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col rounded-lg overflow-hidden shadow-2xl border ${borderColor} ${bg} transition-all duration-200 ${activeBorder} ${isActive ? '' : 'opacity-95'}`}
      style={{
        ...layoutStyle,
        zIndex: state.zIndex,
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div 
        className={`h-10 ${titleBarBg} flex items-center justify-between select-none shrink-0 ${state.isMaximized ? '' : 'cursor-default'}`}
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

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      
      {/* Resize Handle (Bottom Right) */}
      {!state.isMaximized && (
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
                        width: Math.max(300, startW + (ev.clientX - startX)),
                        height: Math.max(200, startH + (ev.clientY - startY))
                    });
                };
                const stopResize = () => {
                    window.removeEventListener('mousemove', handleResize);
                    window.removeEventListener('mouseup', stopResize);
                    // Sync final size with parent
                    onResize(sizeRef.current);
                };
                window.addEventListener('mousemove', handleResize);
                window.addEventListener('mouseup', stopResize);
            }}
        />
      )}
    </div>
  );
};

export default Window;
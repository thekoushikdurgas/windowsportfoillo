'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '@/store/windowStore';
import { useLearn } from '@/contexts/LearnContext';
import SnapLayouts from './SnapLayouts';
import CropOverlay from './CropOverlay';
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';
import { useAccessibility } from '@/hooks/useAccessibility';
import { VISUAL_EFFECTS, getShadow, getAnimation } from '@/utils/visualEffects';
import { useWindowSounds } from '@/hooks/useAudio';

interface WindowProps {
  id: string;
  title: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  children: React.ReactNode;
}

const Window = memo(function Window({
  id,
  title,
  appId,
  position,
  size,
  isMinimized,
  isMaximized,
  isFocused,
  zIndex,
  children,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSnapLayouts, setShowSnapLayouts] = useState(false);
  const [snapMousePosition, setSnapMousePosition] = useState({ x: 0, y: 0 });
  const [hoverMaximizeTimeout, setHoverMaximizeTimeout] = useState<NodeJS.Timeout | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  
  const { 
    focusWindow, 
    moveWindow, 
    resizeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    closeWindow,
    setCrop
  } = useWindowStore();

  // Accessibility
  const { announceChange } = useAccessibility({
    announceOnMount: `Window opened: ${title}`,
  });

  // Enhanced visual effects (memoized)
  const windowEffects = useMemo(() => VISUAL_EFFECTS.window('light'), []);

  // Audio effects
  const { playClose, playMinimize, playMaximize, playRestore, playFocus } = useWindowSounds();

  const { startTutorial } = useLearn();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        moveWindow(id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, id, moveWindow]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverMaximizeTimeout) {
        clearTimeout(hoverMaximizeTimeout);
      }
    };
  }, [hoverMaximizeTimeout]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      focusWindow(id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleClose = useCallback(() => {
    playClose();
    closeWindow(id);
    announceChange(`Window closed: ${title}`);
  }, [playClose, closeWindow, id, title, announceChange]);

  const handleMinimize = useCallback(() => {
    playMinimize();
    minimizeWindow(id);
    announceChange(`Window minimized: ${title}`);
  }, [playMinimize, minimizeWindow, id, title, announceChange]);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      playRestore();
      maximizeWindow(id);
      announceChange(`Window restored: ${title}`);
    } else {
      playMaximize();
      maximizeWindow(id);
      announceChange(`Window maximized: ${title}`);
    }
  }, [isMaximized, playRestore, playMaximize, maximizeWindow, id, title, announceChange]);

  const handleMaximizeMouseEnter = (e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setSnapMousePosition({ x: e.clientX, y: e.clientY });
    
    const timeout = setTimeout(() => {
      setShowSnapLayouts(true);
    }, 500); // Show after 500ms hover
    
    setHoverMaximizeTimeout(timeout);
  };

  const handleMaximizeMouseLeave = () => {
    if (hoverMaximizeTimeout) {
      clearTimeout(hoverMaximizeTimeout);
      setHoverMaximizeTimeout(null);
    }
    setShowSnapLayouts(false);
  };

  const handleSnapLayout = (layoutId: string, _slotId: string) => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPosition = { x: 0, y: 0 };
    let newSize = { width: viewport.width, height: viewport.height };

    switch (layoutId) {
      case 'half-left':
        newSize = { width: viewport.width / 2, height: viewport.height };
        newPosition = { x: 0, y: 0 };
        break;
      case 'half-right':
        newSize = { width: viewport.width / 2, height: viewport.height };
        newPosition = { x: viewport.width / 2, y: 0 };
        break;
      case 'quarter-top-left':
        newSize = { width: viewport.width / 2, height: viewport.height / 2 };
        newPosition = { x: 0, y: 0 };
        break;
      case 'quarter-top-right':
        newSize = { width: viewport.width / 2, height: viewport.height / 2 };
        newPosition = { x: viewport.width / 2, y: 0 };
        break;
      case 'quarter-bottom-left':
        newSize = { width: viewport.width / 2, height: viewport.height / 2 };
        newPosition = { x: 0, y: viewport.height / 2 };
        break;
      case 'quarter-bottom-right':
        newSize = { width: viewport.width / 2, height: viewport.height / 2 };
        newPosition = { x: viewport.width / 2, y: viewport.height / 2 };
        break;
      case 'three-column-left':
        newSize = { width: viewport.width / 3, height: viewport.height };
        newPosition = { x: 0, y: 0 };
        break;
      case 'three-column-center':
        newSize = { width: viewport.width / 3, height: viewport.height };
        newPosition = { x: viewport.width / 3, y: 0 };
        break;
      case 'three-column-right':
        newSize = { width: viewport.width / 3, height: viewport.height };
        newPosition = { x: (viewport.width / 3) * 2, y: 0 };
        break;
      case 'maximize':
        newSize = { width: viewport.width, height: viewport.height };
        newPosition = { x: 0, y: 0 };
        break;
      default:
        return;
    }

    moveWindow(id, newPosition);
    resizeWindow(id, newSize);
    setShowSnapLayouts(false);
  };

  const handleSnapLayoutsClose = () => {
    setShowSnapLayouts(false);
    if (hoverMaximizeTimeout) {
      clearTimeout(hoverMaximizeTimeout);
      setHoverMaximizeTimeout(null);
    }
  };

  const [isCropMode, setIsCropMode] = useState(false);

  const handleCrop = () => {
    setIsCropMode(true);
  };

  const handleCropConfirm = (cropRect: { x: number; y: number; width: number; height: number } | null) => {
    setCrop(id, cropRect);
    setIsCropMode(false);
  };

  const handleCropCancel = () => {
    setIsCropMode(false);
  };

  const handleLearn = () => {
    startTutorial(appId);
  };

  if (isMinimized) {
    return null;
  }

  const windowStyle = isMaximized ? {
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    zIndex,
  } : {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    zIndex,
  };

  // Get current crop from window store
  const currentWindow = useWindowStore.getState().windows.find(w => w.id === id);
  const currentCrop = currentWindow?.crop;
  
  const clipPathStyle = currentCrop
    ? { clipPath: `inset(${currentCrop.y}px ${Math.max(0, (size.width - currentCrop.x - currentCrop.width))}px ${Math.max(0, (size.height - currentCrop.y - currentCrop.height))}px ${currentCrop.x}px round 8px)` }
    : {} as React.CSSProperties;

  return (
      <motion.div
      ref={windowRef}
      className="windows-window absolute"
      style={{
        ...windowStyle,
        ...getMicaStyles(MICA_VARIANTS.window),
        ...windowEffects,
      }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: getAnimation('spring-normal')
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.95, 
        y: 20,
        transition: getAnimation('ease-subtle')
      }}
      whileHover={{ 
        scale: isFocused ? 1 : 1.005,
        boxShadow: getShadow('elevation-3', { theme: 'light', intensity: 'normal' }),
        transition: getAnimation('spring-subtle')
      }}
      transition={getAnimation('spring-normal')}
      onClick={() => {
        playFocus();
        focusWindow(id);
      }}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`window-title-${id}`}
      aria-describedby={`window-content-${id}`}
      tabIndex={isFocused ? 0 : -1}
    >
      {/* Title Bar */}
      <div
        className={`windows-titlebar cursor-move ${isFocused ? 'bg-windows-gray' : 'bg-windows-gray-dark'}`}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🪟</span>
          <span id={`window-title-${id}`} className="font-medium text-windows-text">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <motion.button
            className="windows-titlebar-button learn hover:bg-blue-500 hover:text-white"
            onClick={handleLearn}
            title="Learn how to use this app"
            aria-label={`Learn how to use ${title}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={getAnimation('spring-subtle')}
          >
            <span className="text-xs font-bold">?</span>
          </motion.button>
          <motion.button
            className="windows-titlebar-button hover:bg-gray-300"
            onClick={handleMinimize}
            title="Minimize"
            aria-label={`Minimize ${title}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={getAnimation('spring-subtle')}
          >
            <span className="text-xs">−</span>
          </motion.button>
          <motion.button
            className="windows-titlebar-button hover:bg-gray-300"
            onClick={handleMaximize}
            onMouseEnter={handleMaximizeMouseEnter}
            onMouseLeave={handleMaximizeMouseLeave}
            title={isMaximized ? 'Restore' : 'Maximize'}
            aria-label={`${isMaximized ? 'Restore' : 'Maximize'} ${title}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={getAnimation('spring-subtle')}
          >
            <span className="text-xs">{isMaximized ? '❐' : '□'}</span>
          </motion.button>
          <motion.button
            className="windows-titlebar-button crop hover:bg-orange-500 hover:text-white"
            onClick={handleCrop}
            title="Crop Window"
            aria-label={`Crop ${title} window`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={getAnimation('spring-subtle')}
          >
            <span className="text-xs">✂</span>
          </motion.button>
          <motion.button
            className="windows-titlebar-button close hover:bg-red-500 hover:text-white"
            onClick={handleClose}
            title="Close"
            aria-label={`Close ${title}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={getAnimation('spring-subtle')}
          >
            <span className="text-xs">×</span>
          </motion.button>
        </div>
      </div>

      {/* Window Content */}
      <div 
        id={`window-content-${id}`}
        className="flex-1 overflow-auto bg-windows-surface relative"
        style={clipPathStyle}
      >
        {children}
      </div>

      {/* Crop Overlay */}
      <CropOverlay
        isVisible={isCropMode}
        windowSize={size}
        initialCrop={currentCrop}
        onCropChange={() => {}} // Handled internally by CropOverlay
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />

      {/* Snap Layouts */}
      <SnapLayouts
        isVisible={showSnapLayouts}
        onSnap={handleSnapLayout}
        onClose={handleSnapLayoutsClose}
        mousePosition={snapMousePosition}
      />
    </motion.div>
  );
});

export default Window;

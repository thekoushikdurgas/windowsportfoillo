'use client';

import { useCallback, useRef, useState } from 'react';
import { logger } from '../lib/logger';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onRotate?: (angle: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onTripleTap?: () => void;
  onLongPress?: () => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onPanStart?: () => void;
  onPanEnd?: () => void;
  onFlick?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onTwoFingerTap?: () => void;
  onTwoFingerSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
  flickThreshold?: number;
  rotationThreshold?: number;
  enableHapticFeedback?: boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  lastTapTime: number;
  tapCount: number;
  isLongPress: boolean;
  longPressTimer: NodeJS.Timeout | null;
  initialDistance: number;
  initialAngle: number;
  lastPanX: number;
  lastPanY: number;
  isPanning: boolean;
  velocity: { x: number; y: number };
  lastMoveTime: number;
  lastMoveX: number;
  lastMoveY: number;
}

export function useTouchGestures(options: TouchGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onRotate,
    onTap,
    onDoubleTap,
    onTripleTap,
    onLongPress,
    onPan,
    onPanStart,
    onPanEnd,
    onFlick,
    onTwoFingerTap,
    onTwoFingerSwipe,
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    longPressDelay = 500,
    flickThreshold = 0.5,
    rotationThreshold = 0.1,
    enableHapticFeedback = true
  } = options;

  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    isLongPress: false,
    longPressTimer: null,
    initialDistance: 0,
    initialAngle: 0,
    lastPanX: 0,
    lastPanY: 0,
    isPanning: false,
    velocity: { x: 0, y: 0 },
    lastMoveTime: 0,
    lastMoveX: 0,
    lastMoveY: 0
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Haptic feedback function
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (enableHapticFeedback && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [enableHapticFeedback]);

  // Calculate distance between two points
  const getDistance = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);

  // Calculate angle between two points
  const getAngle = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  }, []);

  // Calculate velocity
  const calculateVelocity = useCallback((currentX: number, currentY: number, currentTime: number) => {
    const deltaTime = currentTime - touchState.current.lastMoveTime;
    if (deltaTime > 0) {
      const deltaX = currentX - touchState.current.lastMoveX;
      const deltaY = currentY - touchState.current.lastMoveY;
      return {
        x: deltaX / deltaTime,
        y: deltaY / deltaTime
      };
    }
    return { x: 0, y: 0 };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    const now = Date.now();

    touchState.current = {
      ...touchState.current,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: now,
      lastPanX: touch.clientX,
      lastPanY: touch.clientY,
      isPanning: false,
      velocity: { x: 0, y: 0 },
      lastMoveTime: now,
      lastMoveX: touch.clientX,
      lastMoveY: touch.clientY,
      isLongPress: false,
      longPressTimer: null
    };

    // Set up long press timer
    if (onLongPress) {
      touchState.current.longPressTimer = setTimeout(() => {
        touchState.current.isLongPress = true;
        triggerHaptic('medium');
        onLongPress();
      }, longPressDelay);
    }

    // Handle multi-touch gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      if (touch1 && touch2) {
        touchState.current.initialDistance = getDistance(
          touch1.clientX, touch1.clientY,
          touch2.clientX, touch2.clientY
        );
        
        touchState.current.initialAngle = getAngle(
          touch1.clientX, touch1.clientY,
          touch2.clientX, touch2.clientY
        );
      }

      if (onPinch) {
        setIsPinching(true);
      }
      if (onRotate) {
        setIsRotating(true);
      }
    }
  }, [onLongPress, longPressDelay, onPinch, onRotate, triggerHaptic, getDistance, getAngle]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    
    // Clear long press timer if user moves
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (!touch) return;
      
      const deltaX = touch.clientX - touchState.current.startX;
      const deltaY = touch.clientY - touchState.current.startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Calculate velocity
      touchState.current.velocity = calculateVelocity(touch.clientX, touch.clientY, now);
      touchState.current.lastMoveTime = now;
      touchState.current.lastMoveX = touch.clientX;
      touchState.current.lastMoveY = touch.clientY;

      if (distance > 10) {
        setIsDragging(true);
        touchState.current.isLongPress = false;
        
        // Handle pan gesture
        if (onPan && !touchState.current.isPanning) {
          touchState.current.isPanning = true;
          onPanStart?.();
          triggerHaptic('light');
        }
        
        if (onPan && touchState.current.isPanning) {
          const panDeltaX = touch.clientX - touchState.current.lastPanX;
          const panDeltaY = touch.clientY - touchState.current.lastPanY;
          onPan(panDeltaX, panDeltaY);
          touchState.current.lastPanX = touch.clientX;
          touchState.current.lastPanY = touch.clientY;
        }
      }
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        const currentDistance = getDistance(
          touch1.clientX, touch1.clientY,
          touch2.clientX, touch2.clientY
        );
        const currentAngle = getAngle(
          touch1.clientX, touch1.clientY,
          touch2.clientX, touch2.clientY
        );

      // Handle pinch gesture
      if (onPinch && isPinching) {
        const scale = currentDistance / touchState.current.initialDistance;
        if (Math.abs(scale - 1) > pinchThreshold) {
          onPinch(scale);
        }
      }

        // Handle rotation gesture
        if (onRotate && isRotating) {
          const angleDelta = currentAngle - touchState.current.initialAngle;
          if (Math.abs(angleDelta) > rotationThreshold) {
            onRotate(angleDelta);
          }
        }
      }
    }
  }, [onPinch, onRotate, onPan, onPanStart, isPinching, isRotating, pinchThreshold, rotationThreshold, triggerHaptic, getDistance, getAngle, calculateVelocity]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Clear long press timer
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }

    if (e.touches.length === 0 && e.changedTouches[0]) {
      const now = Date.now();
      const deltaX = e.changedTouches[0].clientX - touchState.current.startX;
      const deltaY = e.changedTouches[0].clientY - touchState.current.startY;
      const deltaTime = now - touchState.current.startTime;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = Math.sqrt(touchState.current.velocity.x ** 2 + touchState.current.velocity.y ** 2);

      // Handle pan end
      if (touchState.current.isPanning) {
        onPanEnd?.();
        touchState.current.isPanning = false;
      }

      // Handle flick gestures (fast swipes)
      if (velocity > flickThreshold && deltaTime < 200 && !touchState.current.isLongPress) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const direction = absDeltaX > absDeltaY ? 
          (deltaX > 0 ? 'right' : 'left') : 
          (deltaY > 0 ? 'down' : 'up');
        
        onFlick?.(direction, velocity);
        triggerHaptic('heavy');
      }
      // Handle swipe gestures
      else if (distance > swipeThreshold && deltaTime < 300 && !touchState.current.isLongPress) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
        triggerHaptic('medium');
      } 
      // Handle tap gestures
      else if (distance < 10 && deltaTime < 300 && !touchState.current.isLongPress) {
        const timeSinceLastTap = now - touchState.current.lastTapTime;
        
        if (timeSinceLastTap < 300) {
          touchState.current.tapCount++;
          
          if (touchState.current.tapCount === 2) {
            // Double tap
            onDoubleTap?.();
            triggerHaptic('light');
          } else if (touchState.current.tapCount === 3) {
            // Triple tap
            onTripleTap?.();
            triggerHaptic('medium');
            touchState.current.tapCount = 0;
          }
        } else {
          // Single tap
          touchState.current.tapCount = 1;
          onTap?.();
          triggerHaptic('light');
        }
        
        touchState.current.lastTapTime = now;
      }

      setIsDragging(false);
      setIsPinching(false);
      setIsRotating(false);
    } else if (e.touches.length === 1 && e.changedTouches.length === 1) {
      // Handle two-finger gestures when one finger is lifted
      const remainingTouch = e.touches[0];
      if (remainingTouch) {
        const deltaX = remainingTouch.clientX - touchState.current.startX;
        const deltaY = remainingTouch.clientY - touchState.current.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const now = Date.now();
        const deltaTime = now - touchState.current.startTime;

        if (distance > swipeThreshold && deltaTime < 300) {
          const absDeltaX = Math.abs(deltaX);
          const absDeltaY = Math.abs(deltaY);
          const direction = absDeltaX > absDeltaY ? 
            (deltaX > 0 ? 'right' : 'left') : 
            (deltaY > 0 ? 'down' : 'up');
          
          onTwoFingerSwipe?.(direction);
          triggerHaptic('medium');
        } else if (distance < 10 && deltaTime < 300) {
          onTwoFingerTap?.();
          triggerHaptic('light');
        }
      }
    }
  }, [
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onTripleTap,
    onPanEnd,
    onFlick,
    onTwoFingerTap,
    onTwoFingerSwipe,
    swipeThreshold,
    flickThreshold,
    triggerHaptic
  ]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    isDragging,
    isPinching,
    isRotating,
    isPanning: touchState.current.isPanning,
    velocity: touchState.current.velocity
  };
}

// Hook for mobile-specific window management
export function useMobileWindowGestures() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const gestures = useTouchGestures({
    onSwipeDown: () => {
      // Swipe down to minimize
      setIsMinimized(true);
      setIsFullscreen(false);
      setIsMaximized(false);
    },
    onSwipeUp: () => {
      // Swipe up to maximize
      setIsMaximized(true);
      setIsFullscreen(false);
      setIsMinimized(false);
    },
    onSwipeLeft: () => {
      // Swipe left to snap to left half
      setWindowPosition({ x: 0, y: 0 });
      setWindowSize({ width: window.innerWidth / 2, height: window.innerHeight });
    },
    onSwipeRight: () => {
      // Swipe right to snap to right half
      setWindowPosition({ x: window.innerWidth / 2, y: 0 });
      setWindowSize({ width: window.innerWidth / 2, height: window.innerHeight });
    },
    onDoubleTap: () => {
      // Double tap to toggle fullscreen
      setIsFullscreen(prev => !prev);
      setIsMaximized(false);
      setIsMinimized(false);
    },
    onTripleTap: () => {
      // Triple tap to close window
      logger.debug('Triple tap detected - close window');
    },
    onLongPress: () => {
      // Long press for context menu or window options
      logger.debug('Long press detected - show window options');
    },
    onPinch: (scale: number) => {
      // Pinch to zoom/scale window
      if (scale > 1.2) {
        setIsMaximized(true);
      } else if (scale < 0.8) {
        setIsMinimized(true);
      }
    },
    onRotate: (angle: number) => {
      // Rotate to change window orientation
      logger.debug('Rotation detected:', { angle });
    },
    onFlick: (direction: 'left' | 'right' | 'up' | 'down') => {
      // Fast flick gestures for quick actions
      switch (direction) {
        case 'up':
          setIsMaximized(true);
          break;
        case 'down':
          setIsMinimized(true);
          break;
        case 'left':
          setWindowPosition({ x: 0, y: 0 });
          setWindowSize({ width: window.innerWidth / 2, height: window.innerHeight });
          break;
        case 'right':
          setWindowPosition({ x: window.innerWidth / 2, y: 0 });
          setWindowSize({ width: window.innerWidth / 2, height: window.innerHeight });
          break;
      }
    },
    onTwoFingerTap: () => {
      // Two finger tap for special actions
      logger.debug('Two finger tap detected - show window menu');
    },
    onTwoFingerSwipe: (direction: 'left' | 'right' | 'up' | 'down') => {
      // Two finger swipe for advanced window management
      switch (direction) {
        case 'up':
          // Switch to next window
          logger.debug('Switch to next window');
          break;
        case 'down':
          // Switch to previous window
          logger.debug('Switch to previous window');
          break;
        case 'left':
          // Move window to left desktop
          logger.debug('Move to left desktop');
          break;
        case 'right':
          // Move window to right desktop
          logger.debug('Move to right desktop');
          break;
      }
    },
    onPan: (deltaX: number, deltaY: number) => {
      // Pan to move window
      setWindowPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - windowSize.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - windowSize.height, prev.y + deltaY))
      }));
    },
    enableHapticFeedback: true,
    swipeThreshold: 30,
    flickThreshold: 0.8,
    longPressDelay: 400
  });

  return {
    ...gestures,
    isFullscreen,
    isMinimized,
    isMaximized,
    windowPosition,
    windowSize,
    setIsFullscreen,
    setIsMinimized,
    setIsMaximized,
    setWindowPosition,
    setWindowSize
  };
}

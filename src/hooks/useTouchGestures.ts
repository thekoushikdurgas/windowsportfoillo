import { useState, useRef, useCallback, useEffect } from 'react'
import { useDesktopActions } from '@/store/desktopStore'
import { useWindowActions } from '@/store/windowStore'

export interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'pan'
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  velocity?: number
  scale?: number
  center?: { x: number; y: number }
}

export interface TouchPoint {
  id: number
  x: number
  y: number
  timestamp: number
}

interface TouchGestureConfig {
  tapThreshold: number
  doubleTapDelay: number
  longPressDelay: number
  swipeThreshold: number
  pinchThreshold: number
  panThreshold: number
}

const defaultConfig: TouchGestureConfig = {
  tapThreshold: 10,
  doubleTapDelay: 300,
  longPressDelay: 500,
  swipeThreshold: 50,
  pinchThreshold: 0.1,
  panThreshold: 10
}

export const useTouchGestures = (
  onGesture: (gesture: TouchGesture) => void,
  config: Partial<TouchGestureConfig> = {}
) => {
  const mergedConfig = { ...defaultConfig, ...config }
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [lastTap, setLastTap] = useState<{ time: number; x: number; y: number } | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const startPoints = useRef<TouchPoint[]>([])
  const startDistance = useRef<number>(0)
  const startCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const { switchDesktop } = useDesktopActions()
  const { minimizeAllWindows, restoreAllWindows } = useWindowActions()

  const getDistance = (p1: TouchPoint, p2: TouchPoint): number => {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getCenter = (points: TouchPoint[]): { x: number; y: number } => {
    const sum = points.reduce((acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y
    }), { x: 0, y: 0 })
    
    return {
      x: sum.x / points.length,
      y: sum.y / points.length
    }
  }

  const getDirection = (start: TouchPoint, end: TouchPoint): 'up' | 'down' | 'left' | 'right' => {
    const dx = end.x - start.x
    const dy = end.y - start.y
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left'
    } else {
      return dy > 0 ? 'down' : 'up'
    }
  }

  const getVelocity = (start: TouchPoint, end: TouchPoint): number => {
    const distance = getDistance(start, end)
    const time = end.timestamp - start.timestamp
    return time > 0 ? distance / time : 0
  }

  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault()
    
    const touches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }))

    setTouchPoints(touches)
    startPoints.current = touches

    if (touches.length === 1) {
      // Single touch - check for long press
      longPressTimer.current = setTimeout(() => {
        onGesture({
          type: 'long-press',
          center: { x: touches[0].x, y: touches[0].y }
        })
      }, mergedConfig.longPressDelay)
    } else if (touches.length === 2) {
      // Two touches - prepare for pinch
      const distance = getDistance(touches[0], touches[1])
      startDistance.current = distance
      startCenter.current = getCenter(touches)
    }
  }, [mergedConfig.longPressDelay, onGesture])

  const handleTouchMove = useCallback((event: TouchEvent) => {
    event.preventDefault()
    
    const touches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }))

    setTouchPoints(touches)

    // Clear long press timer on movement
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (touches.length === 1 && startPoints.current.length === 1) {
      // Single touch pan
      const start = startPoints.current[0]
      const current = touches[0]
      const distance = getDistance(start, current)
      
      if (distance > mergedConfig.panThreshold) {
        const direction = getDirection(start, current)
        onGesture({
          type: 'pan',
          direction,
          distance,
          center: { x: current.x, y: current.y }
        })
      }
    } else if (touches.length === 2 && startPoints.current.length === 2) {
      // Two touch pinch
      const distance = getDistance(touches[0], touches[1])
      const scale = distance / startDistance.current
      const center = getCenter(touches)
      
      if (Math.abs(scale - 1) > mergedConfig.pinchThreshold) {
        onGesture({
          type: 'pinch',
          scale,
          center
        })
      }
    }
  }, [mergedConfig.panThreshold, mergedConfig.pinchThreshold, onGesture])

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    event.preventDefault()
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    const touches = Array.from(event.touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }))

    if (touches.length === 0 && startPoints.current.length === 1) {
      // Single touch end - check for tap or swipe
      const start = startPoints.current[0]
      const end = touchPoints[0]
      
      if (end) {
        const distance = getDistance(start, end)
        const velocity = getVelocity(start, end)
        
        if (distance < mergedConfig.tapThreshold) {
          // Tap gesture
          const now = Date.now()
          
          if (lastTap && 
              now - lastTap.time < mergedConfig.doubleTapDelay &&
              Math.abs(end.x - lastTap.x) < mergedConfig.tapThreshold &&
              Math.abs(end.y - lastTap.y) < mergedConfig.tapThreshold) {
            // Double tap
            onGesture({
              type: 'double-tap',
              center: { x: end.x, y: end.y }
            })
            setLastTap(null)
          } else {
            // Single tap
            onGesture({
              type: 'tap',
              center: { x: end.x, y: end.y }
            })
            setLastTap({ time: now, x: end.x, y: end.y })
          }
        } else if (distance > mergedConfig.swipeThreshold) {
          // Swipe gesture
          const direction = getDirection(start, end)
          onGesture({
            type: 'swipe',
            direction,
            distance,
            velocity,
            center: { x: end.x, y: end.y }
          })
        }
      }
    }

    setTouchPoints(touches)
    startPoints.current = touches
  }, [touchPoints, lastTap, mergedConfig, onGesture])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    touchPoints,
    isTouching: touchPoints.length > 0
  }
}

// Mobile-specific gesture handlers
export const useMobileGestures = () => {
  const { switchDesktop } = useDesktopActions()
  const { minimizeAllWindows, restoreAllWindows } = useWindowActions()

  const handleGesture = useCallback((gesture: TouchGesture) => {
    switch (gesture.type) {
      case 'swipe':
        if (gesture.direction === 'up') {
          // Swipe up - show all windows
          restoreAllWindows()
        } else if (gesture.direction === 'down') {
          // Swipe down - minimize all windows
          minimizeAllWindows()
        } else if (gesture.direction === 'left') {
          // Swipe left - next desktop
          // Implementation depends on desktop switching logic
        } else if (gesture.direction === 'right') {
          // Swipe right - previous desktop
          // Implementation depends on desktop switching logic
        }
        break
      
      case 'pinch':
        if (gesture.scale && gesture.scale > 1.2) {
          // Pinch out - show all windows
          restoreAllWindows()
        } else if (gesture.scale && gesture.scale < 0.8) {
          // Pinch in - minimize all windows
          minimizeAllWindows()
        }
        break
      
      case 'long-press':
        // Long press - show context menu or start selection
        // Implementation depends on context menu logic
        break
      
      case 'double-tap':
        // Double tap - maximize/restore window
        // Implementation depends on window management logic
        break
    }
  }, [switchDesktop, minimizeAllWindows, restoreAllWindows])

  return useTouchGestures(handleGesture)
}

// Mobile viewport detection
export const useMobileViewport = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(height > width ? 'portrait' : 'landscape')
    }

    checkViewport()
    window.addEventListener('resize', checkViewport)
    window.addEventListener('orientationchange', checkViewport)

    return () => {
      window.removeEventListener('resize', checkViewport)
      window.removeEventListener('orientationchange', checkViewport)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  }
}

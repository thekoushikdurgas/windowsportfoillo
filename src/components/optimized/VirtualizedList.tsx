'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface VirtualizedItem {
  id: string
  height: number
  data: any
}

interface VirtualizedListProps<T extends VirtualizedItem> {
  items: T[]
  itemHeight?: number
  containerHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
  onScroll?: (scrollTop: number) => void
  className?: string
  itemClassName?: string
}

export default function VirtualizedList<T extends VirtualizedItem>({
  items,
  itemHeight = 50,
  containerHeight,
  overscan = 5,
  renderItem,
  onScroll,
  className = '',
  itemClassName = ''
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length - 1
    )

    return {
      start: Math.max(0, startIndex - overscan),
      end: endIndex
    }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.height || itemHeight), 0)
  }, [items, itemHeight])

  // Calculate offset for visible items
  const offsetY = useMemo(() => {
    return items
      .slice(0, visibleRange.start)
      .reduce((sum, item) => sum + (item.height || itemHeight), 0)
  }, [items, visibleRange.start, itemHeight])

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop
    setScrollTop(newScrollTop)
    
    if (onScroll) {
      onScroll(newScrollTop)
    }
  }, [onScroll])

  // Handle resize
  const handleResize = useCallback(() => {
    if (scrollRef.current) {
      setContainerWidth(scrollRef.current.clientWidth)
    }
  }, [])

  // Setup resize observer
  useEffect(() => {
    if (scrollRef.current) {
      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(scrollRef.current)
      
      // Initial width
      setContainerWidth(scrollRef.current.clientWidth)
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [handleResize])

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      ...item,
      index: visibleRange.start + index
    }))
  }, [items, visibleRange])

  return (
    <div
      ref={scrollRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={itemClassName}
              style={{
                height: item.height || itemHeight,
                width: '100%'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              {renderItem(item, item.index)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook for virtualized list management
export const useVirtualizedList = <T extends VirtualizedItem>(
  items: T[],
  itemHeight: number = 50,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    )

    return {
      start: Math.max(0, startIndex),
      end: endIndex
    }
  }, [scrollTop, itemHeight, containerHeight, items.length])

  const totalHeight = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.height || itemHeight), 0)
  }, [items, itemHeight])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1)
  }, [items, visibleRange])

  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = index * itemHeight
    setScrollTop(targetScrollTop)
  }, [itemHeight])

  const scrollToItem = useCallback((itemId: string) => {
    const index = items.findIndex(item => item.id === itemId)
    if (index !== -1) {
      scrollToIndex(index)
    }
  }, [items, scrollToIndex])

  return {
    scrollTop,
    setScrollTop,
    containerWidth,
    setContainerWidth,
    visibleRange,
    totalHeight,
    visibleItems,
    scrollToIndex,
    scrollToItem
  }
}

// Lazy loading component
export const LazyComponent = ({ 
  children, 
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px'
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    frameRate: 0
  })

  const measureRender = useCallback((fn: () => void) => {
    const start = performance.now()
    fn()
    const end = performance.now()
    
    setMetrics(prev => ({
      ...prev,
      renderTime: end - start
    }))
  }, [])

  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
      }))
    }
  }, [])

  const measureFrameRate = useCallback(() => {
    let frames = 0
    let lastTime = performance.now()

    const countFrames = () => {
      frames++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          frameRate: frames
        }))
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(countFrames)
    }

    requestAnimationFrame(countFrames)
  }, [])

  useEffect(() => {
    measureMemory()
    measureFrameRate()
    
    const interval = setInterval(measureMemory, 1000)
    return () => clearInterval(interval)
  }, [measureMemory, measureFrameRate])

  return {
    metrics,
    measureRender,
    measureMemory,
    measureFrameRate
  }
}

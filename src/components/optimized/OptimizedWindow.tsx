'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { WindowState } from '@/types/window'
import { useWindowActions } from '@/store/windowStore'
import WindowControls from '../windows/WindowControls'
import WindowResizer from '../windows/WindowResizer'

interface WindowProps {
  window: WindowState
  isFocused: boolean
}

// Memoized window controls to prevent unnecessary re-renders
const MemoizedWindowControls = React.memo(WindowControls)
const MemoizedWindowResizer = React.memo(WindowResizer)

export default React.memo(function OptimizedWindow({ window, isFocused }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })
  
  const { 
    updateWindowPosition, 
    updateWindowSize, 
    focusWindow, 
    setWindowDragging,
    setWindowResizing 
  } = useWindowActions()

  // Memoize window style to prevent recalculation
  const windowStyle = useMemo(() => ({
    position: 'absolute' as const,
    left: window.position.x,
    top: window.position.y,
    width: window.size.width,
    height: window.size.height,
    zIndex: window.zIndex,
  }), [window.position.x, window.position.y, window.size.width, window.size.height, window.zIndex])

  // Memoize window classes
  const windowClasses = useMemo(() => 
    `window ${isFocused ? 'ring-2 ring-windows-blue ring-opacity-50' : ''} min-w-[320px] min-h-[200px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)]`,
    [isFocused]
  )

  // Optimized focus handler
  const handleWindowClick = useCallback(() => {
    if (!isFocused) {
      focusWindow(window.id)
    }
  }, [isFocused, focusWindow, window.id])

  // Optimized drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === windowRef.current || (e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialPosition(window.position)
      setWindowDragging(window.id, true)
      e.preventDefault()
    }
  }, [window.position, window.id, setWindowDragging])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !window.isMaximized) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      
      const newPosition = {
        x: Math.max(0, initialPosition.x + deltaX),
        y: Math.max(0, initialPosition.y + deltaY),
      }
      
      updateWindowPosition(window.id, newPosition)
    }
  }, [isDragging, window.isMaximized, dragStart, initialPosition, window.id, updateWindowPosition])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setWindowDragging(window.id, false)
    }
  }, [isDragging, window.id, setWindowDragging])

  // Optimized effect with proper dependencies
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Don't render if minimized
  if (window.isMinimized) {
    return null
  }

  return (
    <motion.div
      ref={windowRef}
      className={windowClasses}
      style={windowStyle}
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.2 }}
      onClick={handleWindowClick}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {/* App Icon */}
          <div className="w-4 h-4 bg-windows-blue rounded-sm flex-shrink-0" />
          
          {/* Window Title */}
          <span className="window-title">{window.title}</span>
        </div>

        {/* Window Controls */}
        <MemoizedWindowControls window={window} />
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        {/* Placeholder content - will be replaced with actual app components */}
        <div className="p-4 h-full bg-white dark:bg-gray-800">
          <div className="text-center text-gray-500">
            <h3 className="text-lg font-semibold mb-2">{window.title}</h3>
            <p>Application content will be rendered here</p>
            <p className="text-sm mt-2">App ID: {window.appId}</p>
          </div>
        </div>
      </div>

      {/* Window Resizer */}
      <MemoizedWindowResizer window={window} />
    </motion.div>
  )
})

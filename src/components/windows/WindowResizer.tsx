'use client'

import { useState, useRef, useEffect } from 'react'
import { WindowState } from '@/types/window'
import { useWindowActions } from '@/store/windowStore'

interface WindowResizerProps {
  window: WindowState
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'

export default function WindowResizer({ window }: WindowResizerProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  
  const { updateWindowSize, setWindowResizing } = useWindowActions()

  const handleMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeHandle(handle)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
    })
    setWindowResizing(window.id, true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      let newWidth = resizeStart.width
      let newHeight = resizeStart.height
      
      // Apply minimum size constraints
      const minWidth = window.minSize?.width || 300
      const minHeight = window.minSize?.height || 200
      
      switch (resizeHandle) {
        case 'se':
          newWidth = Math.max(minWidth, resizeStart.width + deltaX)
          newHeight = Math.max(minHeight, resizeStart.height + deltaY)
          break
        case 'sw':
          newWidth = Math.max(minWidth, resizeStart.width - deltaX)
          newHeight = Math.max(minHeight, resizeStart.height + deltaY)
          break
        case 'ne':
          newWidth = Math.max(minWidth, resizeStart.width + deltaX)
          newHeight = Math.max(minHeight, resizeStart.height - deltaY)
          break
        case 'nw':
          newWidth = Math.max(minWidth, resizeStart.width - deltaX)
          newHeight = Math.max(minHeight, resizeStart.height - deltaY)
          break
        case 'e':
          newWidth = Math.max(minWidth, resizeStart.width + deltaX)
          break
        case 'w':
          newWidth = Math.max(minWidth, resizeStart.width - deltaX)
          break
        case 's':
          newHeight = Math.max(minHeight, resizeStart.height + deltaY)
          break
        case 'n':
          newHeight = Math.max(minHeight, resizeStart.height - deltaY)
          break
      }
      
      updateWindowSize(window.id, { width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false)
      setResizeHandle(null)
      setWindowResizing(window.id, false)
    }
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, resizeHandle, resizeStart, window.id])

  if (window.isMaximized) {
    return null
  }

  return (
    <>
      {/* Corner handles */}
      <div
        className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />

      {/* Edge handles */}
      <div
        className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
        onMouseDown={(e) => handleMouseDown(e, 'n')}
      />
      <div
        className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
        onMouseDown={(e) => handleMouseDown(e, 's')}
      />
      <div
        className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
        onMouseDown={(e) => handleMouseDown(e, 'w')}
      />
      <div
        className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
        onMouseDown={(e) => handleMouseDown(e, 'e')}
      />
    </>
  )
}

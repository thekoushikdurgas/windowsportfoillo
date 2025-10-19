'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopActions } from '@/store/desktopStore'
import { useAppActions } from '@/store/appStore'
import { useNotificationActions } from '@/store/notificationStore'

export interface DragItem {
  id: string
  type: 'desktop-icon' | 'window' | 'file' | 'app'
  data: any
  position: { x: number; y: number }
  size?: { width: number; height: number }
}

export interface DropZone {
  id: string
  type: 'desktop' | 'folder' | 'app' | 'trash' | 'taskbar'
  position: { x: number; y: number; width: number; height: number }
  accepts: string[]
  onDrop: (item: DragItem) => void
  onHover?: (item: DragItem) => void
  onLeave?: () => void
}

interface DragDropSystemProps {
  children: React.ReactNode
  onDragStart?: (item: DragItem) => void
  onDragEnd?: (item: DragItem) => void
  onDrop?: (item: DragItem, dropZone: DropZone) => void
}

export default function DragDropSystem({ 
  children, 
  onDragStart, 
  onDragEnd, 
  onDrop 
}: DragDropSystemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragItem, setDragItem] = useState<DragItem | null>(null)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [activeDropZone, setActiveDropZone] = useState<DropZone | null>(null)
  const [dropZones, setDropZones] = useState<DropZone[]>([])
  
  const dragRef = useRef<HTMLDivElement>(null)
  const { addNotification } = useNotificationActions()

  // Register drop zone
  const registerDropZone = useCallback((zone: DropZone) => {
    setDropZones(prev => [...prev.filter(z => z.id !== zone.id), zone])
  }, [])

  // Unregister drop zone
  const unregisterDropZone = useCallback((zoneId: string) => {
    setDropZones(prev => prev.filter(z => z.id !== zoneId))
  }, [])

  // Start drag operation
  const startDrag = useCallback((item: DragItem, event: React.MouseEvent) => {
    setIsDragging(true)
    setDragItem(item)
    setDragPosition({ x: event.clientX, y: event.clientY })
    
    if (onDragStart) {
      onDragStart(item)
    }

    addNotification({
      title: 'Drag Started',
      message: `Dragging ${item.type}: ${item.data.name || item.id}`,
      type: 'info',
      priority: 'low',
      source: 'system'
    })
  }, [onDragStart, addNotification])

  // Update drag position
  const updateDragPosition = useCallback((event: MouseEvent) => {
    if (!isDragging) return

    setDragPosition({ x: event.clientX, y: event.clientY })

    // Check for active drop zone
    const mouseX = event.clientX
    const mouseY = event.clientY

    const zone = dropZones.find(zone => {
      const { x, y, width, height } = zone.position
      return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height &&
        zone.accepts.includes(dragItem?.type || '')
      )
    })

    if (zone && zone !== activeDropZone) {
      setActiveDropZone(zone)
      if (zone.onHover && dragItem) {
        zone.onHover(dragItem)
      }
    } else if (!zone && activeDropZone) {
      if (activeDropZone.onLeave) {
        activeDropZone.onLeave()
      }
      setActiveDropZone(null)
    }
  }, [isDragging, dragItem, dropZones, activeDropZone])

  // End drag operation
  const endDrag = useCallback((event: MouseEvent) => {
    if (!isDragging || !dragItem) return

    const mouseX = event.clientX
    const mouseY = event.clientY

    // Find drop zone
    const zone = dropZones.find(zone => {
      const { x, y, width, height } = zone.position
      return (
        mouseX >= x &&
        mouseX <= x + width &&
        mouseY >= y &&
        mouseY <= y + height &&
        zone.accepts.includes(dragItem.type)
      )
    })

    if (zone) {
      // Valid drop
      zone.onDrop(dragItem)
      
      if (onDrop) {
        onDrop(dragItem, zone)
      }

      addNotification({
        title: 'Item Dropped',
        message: `${dragItem.type} dropped on ${zone.type}`,
        type: 'success',
        priority: 'low',
        source: 'system'
      })
    } else {
      // Invalid drop - return to original position
      addNotification({
        title: 'Drop Cancelled',
        message: 'Item returned to original position',
        type: 'warning',
        priority: 'low',
        source: 'system'
      })
    }

    // Reset drag state
    setIsDragging(false)
    setDragItem(null)
    setActiveDropZone(null)

    if (onDragEnd) {
      onDragEnd(dragItem)
    }
  }, [isDragging, dragItem, dropZones, onDrop, onDragEnd, addNotification])

  // Mouse event handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', updateDragPosition)
      document.addEventListener('mouseup', endDrag)
      
      return () => {
        document.removeEventListener('mousemove', updateDragPosition)
        document.removeEventListener('mouseup', endDrag)
      }
    }
  }, [isDragging, updateDragPosition, endDrag])

  // Prevent default drag behavior
  useEffect(() => {
    const preventDefault = (e: DragEvent) => {
      e.preventDefault()
    }

    document.addEventListener('dragover', preventDefault)
    document.addEventListener('drop', preventDefault)

    return () => {
      document.removeEventListener('dragover', preventDefault)
      document.removeEventListener('drop', preventDefault)
    }
  }, [])

  return (
    <div ref={dragRef} className="relative w-full h-full">
      {children}
      
      {/* Drag Preview */}
      <AnimatePresence>
        {isDragging && dragItem && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: dragPosition.x - 25,
              top: dragPosition.y - 25,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-blue-500 bg-opacity-20 border-2 border-blue-400 border-dashed rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {dragItem.data.icon || dragItem.type.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {dragItem.data.name || dragItem.id}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {dragItem.type}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop Zone Indicators */}
      <AnimatePresence>
        {activeDropZone && (
          <motion.div
            className="fixed z-40 pointer-events-none"
            style={{
              left: activeDropZone.position.x,
              top: activeDropZone.position.y,
              width: activeDropZone.position.width,
              height: activeDropZone.position.height,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-full h-full bg-green-500 bg-opacity-20 border-2 border-green-400 border-dashed rounded-lg flex items-center justify-center">
              <div className="text-green-400 text-sm font-medium">
                Drop here
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for drag and drop functionality
export const useDragDrop = () => {
  const { addNotification } = useNotificationActions()

  const createDragItem = useCallback((
    id: string,
    type: DragItem['type'],
    data: any,
    position: { x: number; y: number },
    size?: { width: number; height: number }
  ): DragItem => {
    return {
      id,
      type,
      data,
      position,
      size
    }
  }, [])

  const createDropZone = useCallback((
    id: string,
    type: DropZone['type'],
    position: { x: number; y: number; width: number; height: number },
    accepts: string[],
    onDrop: (item: DragItem) => void,
    onHover?: (item: DragItem) => void,
    onLeave?: () => void
  ): DropZone => {
    return {
      id,
      type,
      position,
      accepts,
      onDrop,
      onHover,
      onLeave
    }
  }, [])

  return {
    createDragItem,
    createDropZone
  }
}

// Higher-order component for draggable items
export const withDragDrop = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P & { 
    dragItem?: DragItem
    onDragStart?: (item: DragItem) => void
  }>((props, ref) => {
    const { dragItem, onDragStart, ...rest } = props

    const handleMouseDown = (event: React.MouseEvent) => {
      if (dragItem && onDragStart) {
        onDragStart(dragItem)
      }
    }

    return (
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        className="cursor-move"
      >
        <Component {...(rest as P)} />
      </div>
    )
  })
}

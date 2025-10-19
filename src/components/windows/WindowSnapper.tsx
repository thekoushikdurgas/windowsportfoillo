'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowActions, useWindows } from '@/store/windowStore'
import { useDesktopState } from '@/store/desktopStore'
import { getWindowSnapPosition, constrainToBounds, Position, Size } from '@/utils/common'
import { WINDOW_CONSTANTS } from '@/constants'

interface SnapZone {
  id: string
  bounds: { x: number; y: number; width: number; height: number }
  snapPosition: Position
  snapSize: Size
  label: string
}

interface WindowSnapperProps {
  windowId: string
  isDragging: boolean
  position: Position
  size: Size
  onSnap: (snapZone: SnapZone) => void
  onUnsnap: () => void
}

export default function WindowSnapper({
  windowId,
  isDragging,
  position,
  size,
  onSnap,
  onUnsnap
}: WindowSnapperProps) {
  const [snapZones, setSnapZones] = useState<SnapZone[]>([])
  const [activeSnapZone, setActiveSnapZone] = useState<SnapZone | null>(null)
  const [isSnapping, setIsSnapping] = useState(false)
  const snapTimeoutRef = useRef<NodeJS.Timeout>()
  
  const { updateWindow } = useWindowActions()
  const { screenSize } = useDesktopState()

  // Generate snap zones based on screen size
  useEffect(() => {
    if (!screenSize) return

    const zones: SnapZone[] = [
      // Left half
      {
        id: 'left-half',
        bounds: { x: 0, y: 0, width: screenSize.width / 2, height: screenSize.height },
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: screenSize.width / 2, height: screenSize.height },
        label: 'Left Half'
      },
      // Right half
      {
        id: 'right-half',
        bounds: { x: screenSize.width / 2, y: 0, width: screenSize.width / 2, height: screenSize.height },
        snapPosition: { x: screenSize.width / 2, y: 0 },
        snapSize: { width: screenSize.width / 2, height: screenSize.height },
        label: 'Right Half'
      },
      // Left quarter
      {
        id: 'left-quarter',
        bounds: { x: 0, y: 0, width: screenSize.width / 4, height: screenSize.height },
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: screenSize.width / 4, height: screenSize.height },
        label: 'Left Quarter'
      },
      // Right quarter
      {
        id: 'right-quarter',
        bounds: { x: (screenSize.width * 3) / 4, y: 0, width: screenSize.width / 4, height: screenSize.height },
        snapPosition: { x: (screenSize.width * 3) / 4, y: 0 },
        snapSize: { width: screenSize.width / 4, height: screenSize.height },
        label: 'Right Quarter'
      },
      // Top half
      {
        id: 'top-half',
        bounds: { x: 0, y: 0, width: screenSize.width, height: screenSize.height / 2 },
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: screenSize.width, height: screenSize.height / 2 },
        label: 'Top Half'
      },
      // Bottom half
      {
        id: 'bottom-half',
        bounds: { x: 0, y: screenSize.height / 2, width: screenSize.width, height: screenSize.height / 2 },
        snapPosition: { x: 0, y: screenSize.height / 2 },
        snapSize: { width: screenSize.width, height: screenSize.height / 2 },
        label: 'Bottom Half'
      },
      // Top left quarter
      {
        id: 'top-left-quarter',
        bounds: { x: 0, y: 0, width: screenSize.width / 2, height: screenSize.height / 2 },
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: screenSize.width / 2, height: screenSize.height / 2 },
        label: 'Top Left'
      },
      // Top right quarter
      {
        id: 'top-right-quarter',
        bounds: { x: screenSize.width / 2, y: 0, width: screenSize.width / 2, height: screenSize.height / 2 },
        snapPosition: { x: screenSize.width / 2, y: 0 },
        snapSize: { width: screenSize.width / 2, height: screenSize.height / 2 },
        label: 'Top Right'
      },
      // Bottom left quarter
      {
        id: 'bottom-left-quarter',
        bounds: { x: 0, y: screenSize.height / 2, width: screenSize.width / 2, height: screenSize.height / 2 },
        snapPosition: { x: 0, y: screenSize.height / 2 },
        snapSize: { width: screenSize.width / 2, height: screenSize.height / 2 },
        label: 'Bottom Left'
      },
      // Bottom right quarter
      {
        id: 'bottom-right-quarter',
        bounds: { x: screenSize.width / 2, y: screenSize.height / 2, width: screenSize.width / 2, height: screenSize.height / 2 },
        snapPosition: { x: screenSize.width / 2, y: screenSize.height / 2 },
        snapSize: { width: screenSize.width / 2, height: screenSize.height / 2 },
        label: 'Bottom Right'
      }
    ]

    setSnapZones(zones)
  }, [screenSize])

  // Check for snap zones when dragging
  useEffect(() => {
    if (!isDragging || !snapZones.length) return

    const checkSnapZones = () => {
      const centerX = position.x + size.width / 2
      const centerY = position.y + size.height / 2

      const snapZone = snapZones.find(zone => {
        const { bounds } = zone
        return (
          centerX >= bounds.x &&
          centerX <= bounds.x + bounds.width &&
          centerY >= bounds.y &&
          centerY <= bounds.y + bounds.height
        )
      })

      if (snapZone && snapZone.id !== activeSnapZone?.id) {
        setActiveSnapZone(snapZone)
        setIsSnapping(true)
        
        // Clear existing timeout
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current)
        }

        // Set timeout for snap preview
        snapTimeoutRef.current = setTimeout(() => {
          if (activeSnapZone) {
            onSnap(activeSnapZone)
          }
        }, 150)
      } else if (!snapZone && activeSnapZone) {
        setActiveSnapZone(null)
        setIsSnapping(false)
        
        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current)
        }
      }
    }

    checkSnapZones()
  }, [isDragging, position, size, snapZones, activeSnapZone, onSnap])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current)
      }
    }
  }, [])

  if (!isDragging || !activeSnapZone) return null

  return (
    <AnimatePresence>
      {isSnapping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          {/* Snap zone highlight */}
          <motion.div
            className="absolute bg-blue-500 bg-opacity-20 border-2 border-blue-400 border-dashed"
            style={{
              left: activeSnapZone.bounds.x,
              top: activeSnapZone.bounds.y,
              width: activeSnapZone.bounds.width,
              height: activeSnapZone.bounds.height
            }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Snap zone label */}
          <motion.div
            className="absolute bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg"
            style={{
              left: activeSnapZone.bounds.x + activeSnapZone.bounds.width / 2,
              top: activeSnapZone.bounds.y + activeSnapZone.bounds.height / 2,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {activeSnapZone.label}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for window snapping
export const useWindowSnapping = (windowId: string) => {
  const { updateWindow } = useWindowActions()
  const windows = useWindows()
  const window = windows[windowId]

  const handleSnap = (snapZone: SnapZone) => {
    if (!window) return

    updateWindow(windowId, {
      position: snapZone.snapPosition,
      size: snapZone.snapSize,
      isSnapped: true,
      snapLayout: snapZone.id as any
    })
  }

  const handleUnsnap = () => {
    if (!window) return

    updateWindow(windowId, {
      isSnapped: false,
      snapLayout: undefined
    })
  }

  return {
    handleSnap,
    handleUnsnap,
    isSnapped: window?.isSnapped || false
  }
}

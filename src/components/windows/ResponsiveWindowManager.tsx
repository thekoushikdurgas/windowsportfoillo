'use client'

import React, { useEffect } from 'react'
import { useWindowConstraints } from '@/hooks/useResponsive'
import { useWindowActions } from '@/store/windowStore'

interface ResponsiveWindowManagerProps {
  children: React.ReactNode
}

export default function ResponsiveWindowManager({ children }: ResponsiveWindowManagerProps) {
  const { maxWidth, maxHeight, minWidth, minHeight } = useWindowConstraints()
  const { updateWindowSize, updateWindowPosition } = useWindowActions()

  useEffect(() => {
    // This effect can be used to automatically adjust window sizes
    // when the screen size changes, but for now we'll let the CSS handle it
    // through the max-w and max-h classes
  }, [maxWidth, maxHeight])

  return <>{children}</>
}

// Utility function to constrain window dimensions
export function constrainWindowDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number = 320,
  minHeight: number = 200
) {
  return {
    width: Math.max(minWidth, Math.min(width, maxWidth)),
    height: Math.max(minHeight, Math.min(height, maxHeight))
  }
}

// Utility function to constrain window position
export function constrainWindowPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
) {
  return {
    x: Math.max(0, Math.min(x, maxWidth - width)),
    y: Math.max(0, Math.min(y, maxHeight - height))
  }
}

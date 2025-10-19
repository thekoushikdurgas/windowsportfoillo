'use client'

import { useState, useEffect } from 'react'

interface BreakpointConfig {
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < breakpoints.sm
  const isTablet = windowSize.width >= breakpoints.sm && windowSize.width < breakpoints.lg
  const isDesktop = windowSize.width >= breakpoints.lg
  const isLargeDesktop = windowSize.width >= breakpoints.xl

  const getResponsiveValue = <T>(values: {
    mobile?: T
    tablet?: T
    desktop?: T
    large?: T
  }): T | undefined => {
    if (isLargeDesktop && values.large !== undefined) return values.large
    if (isDesktop && values.desktop !== undefined) return values.desktop
    if (isTablet && values.tablet !== undefined) return values.tablet
    if (isMobile && values.mobile !== undefined) return values.mobile
    return values.desktop || values.tablet || values.mobile
  }

  const getWindowConstraints = () => ({
    maxWidth: windowSize.width - 32,
    maxHeight: windowSize.height - 96,
    minWidth: 320,
    minHeight: 200
  })

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    getResponsiveValue,
    getWindowConstraints
  }
}

export function useWindowConstraints() {
  const { windowSize } = useResponsive()
  
  return {
    maxWidth: Math.max(320, windowSize.width - 32),
    maxHeight: Math.max(200, windowSize.height - 96),
    minWidth: 320,
    minHeight: 200,
    availableWidth: windowSize.width,
    availableHeight: windowSize.height
  }
}

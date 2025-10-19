'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Desktop from '@/components/desktop/Desktop'
import LoadingScreen from '@/components/LoadingScreen'
import { useAppActions } from '@/store/appStore'

// Move default icons outside component to prevent recreation
const defaultIcons = [
  {
    id: 'about-me-icon',
    appId: 'about-me',
    position: { x: 50, y: 50 },
    name: 'About Me',
    icon: '👤',
    isSelected: false,
  },
  {
    id: 'file-explorer-icon',
    appId: 'file-explorer',
    position: { x: 150, y: 50 },
    name: 'File Explorer',
    icon: '📁',
    isSelected: false,
  },
  {
    id: 'calculator-icon',
    appId: 'calculator',
    position: { x: 250, y: 50 },
    name: 'Calculator',
    icon: '🧮',
    isSelected: false,
  },
  {
    id: 'notepad-icon',
    appId: 'notepad',
    position: { x: 350, y: 50 },
    name: 'Notepad',
    icon: '📝',
    isSelected: false,
  },
]

function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const { addDesktopIcon } = useAppActions()

  // Memoize the icon addition function
  const addDefaultIcons = useCallback(() => {
    defaultIcons.forEach(icon => {
      addDesktopIcon(icon)
    })
  }, [addDesktopIcon])

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      addDefaultIcons()
    }
  }, [isLoading, addDefaultIcons])

  return (
    <div className="w-full h-screen overflow-hidden">
      <AnimatePresence>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Desktop />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home

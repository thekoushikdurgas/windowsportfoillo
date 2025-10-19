'use client'

import { motion } from 'framer-motion'
import { WindowState } from '@/types/window'
import { useWindowActions } from '@/store/windowStore'
import { useApps } from '@/store/appStore'

interface TaskbarIconsProps {
  windows: WindowState[]
}

export default function TaskbarIcons({ windows }: TaskbarIconsProps) {
  const { restoreWindow, focusWindow, minimizeWindow } = useWindowActions()
  const apps = useApps()

  const handleIconClick = (window: WindowState) => {
    if (window.isMinimized) {
      restoreWindow(window.id)
    } else {
      // If window is already focused, minimize it
      // Otherwise, focus it
      focusWindow(window.id)
    }
  }

  const getAppIcon = (appId: string) => {
    const app = apps[appId]
    return app ? app.icon : '📱'
  }

  return (
    <div className="flex items-center space-x-1">
      {windows.map((window) => (
        <motion.button
          key={window.id}
          className={`
            taskbar-icon relative
            ${window.isMinimized ? 'opacity-70' : 'opacity-100'}
          `}
          onClick={() => handleIconClick(window)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={window.title}
        >
          {/* App Icon */}
          <div className="w-8 h-8 bg-windows-blue rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">
              {getAppIcon(window.appId)}
            </span>
          </div>

          {/* Active indicator */}
          {!window.isMinimized && (
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 16 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Minimized indicator */}
          {window.isMinimized && (
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useWindowActions } from '@/store/windowStore'
import { useApps, useAppActions } from '@/store/appStore'
import { useNotificationActions } from '@/store/notificationStore'

export default function StartMenuGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const { openWindow } = useWindowActions()
  const apps = useApps()
  const { launchApp } = useAppActions()
  const { addNotification } = useNotificationActions()

  const appsList = Object.values(apps)
  const filteredApps = appsList.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAppClick = (app: typeof appsList[0]) => {
    try {
      const instanceId = launchApp(app.id)
      if (instanceId) {
        // Create a window for the app instance
        const windowId = `window-${instanceId}`
        const window = {
          id: windowId,
          title: app.name,
          appId: app.id,
          position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
          size: app.defaultSize || { width: 800, height: 600 },
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          zIndex: 1,
          isDragging: false,
          isResizing: false,
        }

        openWindow(window)
      } else {
        addNotification({
          title: 'App Launch Failed',
          message: `Could not launch ${app.name}. The app may not be available.`,
          type: 'error',
          priority: 'normal',
          source: 'system',
        })
      }
    } catch (error) {
      console.error('Error launching app:', error)
      addNotification({
        title: 'App Launch Error',
        message: `An error occurred while launching ${app.name}.`,
        type: 'error',
        priority: 'high',
        source: 'system',
      })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-3 gap-3">
        {filteredApps.map((app, index) => (
          <motion.button
            key={app.id}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            onClick={() => handleAppClick(app)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={app.description || app.name}
          >
            <div className="w-12 h-12 bg-windows-blue rounded-lg flex items-center justify-center mb-2 text-2xl">
              {app.icon}
            </div>
            <span className="text-white text-sm text-center leading-tight">
              {app.name}
            </span>
            {app.isSystemApp && (
              <span className="text-xs text-gray-400 mt-1">System</span>
            )}
          </motion.button>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>No apps found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  )
}

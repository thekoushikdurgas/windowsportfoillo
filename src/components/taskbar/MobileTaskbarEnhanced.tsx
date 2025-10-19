'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindows, useWindowActions } from '@/store/windowStore'
import { useDesktopActions } from '@/store/desktopStore'
import { useAppActions } from '@/store/appStore'
import { useNotificationActions } from '@/store/notificationStore'
import { useMobileViewport, useMobileGestures } from '@/hooks/useTouchGestures'
import { 
  Home, 
  Search, 
  Grid3X3, 
  Bell, 
  Settings, 
  ChevronUp, 
  ChevronDown,
  X,
  Minimize2,
  Maximize2,
  Square
} from 'lucide-react'

export default function MobileTaskbarEnhanced() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'apps' | 'notifications'>('home')
  const [showAllWindows, setShowAllWindows] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  
  const taskbarRef = useRef<HTMLDivElement>(null)
  const { isMobile, isTablet } = useMobileViewport()
  const { isTouching } = useMobileGestures()
  
  const windows = useWindows()
  const { minimizeWindow, maximizeWindow, restoreWindow, focusWindow } = useWindowActions()
  const { toggleStartMenu } = useDesktopActions()
  const { getInstalledApps } = useAppActions()
  const { addNotification } = useNotificationActions()

  const installedApps = getInstalledApps()
  const openWindows = Object.values(windows).filter(w => !w.isMinimized)

  // Handle drag gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStartY(e.touches[0].clientY)
    setDragCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentY = e.touches[0].clientY
    setDragCurrentY(currentY)
    
    const deltaY = currentY - dragStartY
    
    if (deltaY < -50 && !isExpanded) {
      // Swipe up - expand taskbar
      setIsExpanded(true)
      setShowAllWindows(true)
    } else if (deltaY > 50 && isExpanded) {
      // Swipe down - collapse taskbar
      setIsExpanded(false)
      setShowAllWindows(false)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Handle window actions
  const handleWindowAction = (windowId: string, action: 'minimize' | 'maximize' | 'restore' | 'focus') => {
    switch (action) {
      case 'minimize':
        minimizeWindow(windowId)
        break
      case 'maximize':
        maximizeWindow(windowId)
        break
      case 'restore':
        restoreWindow(windowId)
        break
      case 'focus':
        focusWindow(windowId)
        break
    }
  }

  const handleAppLaunch = (appId: string) => {
    // Implementation depends on app launching logic
    addNotification({
      title: 'App Launch',
      message: `Launching ${appId}`,
      type: 'info',
      priority: 'low',
      source: 'system'
    })
  }

  if (!isMobile && !isTablet) {
    return null
  }

  return (
    <>
      {/* Main Taskbar */}
      <motion.div
        ref={taskbarRef}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 ${
          isExpanded ? 'h-96' : 'h-16'
        }`}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-around px-4 py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'search', icon: Search, label: 'Search' },
            { id: 'apps', icon: Grid3X3, label: 'Apps' },
            { id: 'notifications', icon: Bell, label: 'Notifications' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-4 h-full"
              >
                {/* Recent Windows */}
                <div className="mb-4">
                  <h3 className="text-white text-sm font-medium mb-2">Recent Windows</h3>
                  <div className="space-y-2">
                    {openWindows.slice(0, 3).map(window => (
                      <div
                        key={window.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {window.title.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm">{window.title}</p>
                            <p className="text-gray-400 text-xs">
                              {window.isMaximized ? 'Maximized' : 'Normal'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleWindowAction(window.id, 'minimize')}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Minimize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleWindowAction(window.id, 'maximize')}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowAllWindows(!showAllWindows)}
                      className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                    >
                      <Grid3X3 className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">All Windows</span>
                    </button>
                    <button
                      onClick={() => toggleStartMenu()}
                      className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">Settings</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-4 h-full"
              >
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search apps, files, and settings..."
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <h3 className="text-white text-sm font-medium mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {['Calculator', 'Notepad', 'File Explorer'].map(item => (
                      <button
                        key={item}
                        className="w-full text-left p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'apps' && (
              <motion.div
                key="apps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-4 h-full overflow-y-auto"
              >
                <div className="grid grid-cols-4 gap-4">
                  {installedApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => handleAppLaunch(app.id)}
                      className="flex flex-col items-center space-y-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      <span className="text-white text-xs text-center">{app.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-4 h-full overflow-y-auto"
              >
                <div className="space-y-2">
                  {[
                    { title: 'System Update', message: 'Windows 11 update available', time: '2 min ago' },
                    { title: 'Battery Low', message: 'Battery is at 15%', time: '5 min ago' },
                    { title: 'New App', message: 'Calculator has been updated', time: '1 hour ago' }
                  ].map((notification, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-800 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                          <p className="text-gray-400 text-xs">{notification.message}</p>
                        </div>
                        <span className="text-gray-500 text-xs">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* All Windows Overlay */}
      <AnimatePresence>
        {showAllWindows && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAllWindows(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
              className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-xl p-4 max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">All Windows</h3>
                <button
                  onClick={() => setShowAllWindows(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {Object.values(windows).map(window => (
                  <div
                    key={window.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {window.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{window.title}</p>
                        <p className="text-gray-400 text-xs">
                          {window.isMinimized ? 'Minimized' : 
                           window.isMaximized ? 'Maximized' : 'Normal'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleWindowAction(window.id, 'focus')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWindowAction(window.id, 'minimize')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWindowAction(window.id, 'maximize')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

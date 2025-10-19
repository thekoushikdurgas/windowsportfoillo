'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopState, useDesktopActions } from '@/store/desktopStore'
import { useWindows, useWindowActions } from '@/store/windowStore'
import { useAppActions } from '@/store/appStore'
import { useNotificationActions } from '@/store/notificationStore'
import { 
  Monitor, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Grid3X3,
  Eye,
  EyeOff
} from 'lucide-react'

interface VirtualDesktop {
  id: string
  name: string
  wallpaper: string
  isActive: boolean
  windowCount: number
  preview?: string
}

export default function VirtualDesktop() {
  const [isOpen, setIsOpen] = useState(false)
  const [desktops, setDesktops] = useState<VirtualDesktop[]>([])
  const [activeDesktopId, setActiveDesktopId] = useState('desktop-1')
  
  const { currentDesktop, desktops: storeDesktops } = useDesktopState()
  const { switchDesktop, createDesktop, deleteDesktop, renameDesktop } = useDesktopActions()
  const windows = useWindows()
  const { moveWindowToDesktop } = useWindowActions()
  const { addNotification } = useNotificationActions()

  // Initialize desktops
  useEffect(() => {
    const initialDesktops: VirtualDesktop[] = [
      {
        id: 'desktop-1',
        name: 'Desktop 1',
        wallpaper: 'windows-11-default.svg',
        isActive: true,
        windowCount: 0
      }
    ]
    setDesktops(initialDesktops)
  }, [])

  // Update window counts
  useEffect(() => {
    setDesktops(prev => prev.map(desktop => ({
      ...desktop,
      windowCount: Object.values(windows).filter(w => w.desktopId === desktop.id).length
    })))
  }, [windows])

  const handleCreateDesktop = () => {
    const newId = `desktop-${Date.now()}`
    const newDesktop: VirtualDesktop = {
      id: newId,
      name: `Desktop ${desktops.length + 1}`,
      wallpaper: 'windows-11-default.svg',
      isActive: false,
      windowCount: 0
    }
    
    setDesktops(prev => [...prev, newDesktop])
    createDesktop(newId, newDesktop.name)
    
    addNotification({
      title: 'New Desktop Created',
      message: `Desktop ${desktops.length + 1} has been created`,
      type: 'success',
      priority: 'low',
      source: 'system'
    })
  }

  const handleDeleteDesktop = (desktopId: string) => {
    if (desktops.length <= 1) {
      addNotification({
        title: 'Cannot Delete Desktop',
        message: 'At least one desktop must remain',
        type: 'warning',
        priority: 'normal',
        source: 'system'
      })
      return
    }

    setDesktops(prev => prev.filter(d => d.id !== desktopId))
    deleteDesktop(desktopId)
    
    // Move windows from deleted desktop to active desktop
    const windowsToMove = Object.values(windows).filter(w => w.desktopId === desktopId)
    windowsToMove.forEach(window => {
      moveWindowToDesktop(window.id, activeDesktopId)
    })

    addNotification({
      title: 'Desktop Deleted',
      message: 'Windows have been moved to the active desktop',
      type: 'info',
      priority: 'normal',
      source: 'system'
    })
  }

  const handleSwitchDesktop = (desktopId: string) => {
    setActiveDesktopId(desktopId)
    switchDesktop(desktopId)
    
    addNotification({
      title: 'Desktop Switched',
      message: `Switched to ${desktops.find(d => d.id === desktopId)?.name}`,
      type: 'info',
      priority: 'low',
      source: 'system'
    })
  }

  const handleRenameDesktop = (desktopId: string, newName: string) => {
    setDesktops(prev => prev.map(d => 
      d.id === desktopId ? { ...d, name: newName } : d
    ))
    renameDesktop(desktopId, newName)
  }

  const handleMoveWindow = (windowId: string, targetDesktopId: string) => {
    moveWindowToDesktop(windowId, targetDesktopId)
    
    const window = windows[windowId]
    const targetDesktop = desktops.find(d => d.id === targetDesktopId)
    
    if (window && targetDesktop) {
      addNotification({
        title: 'Window Moved',
        message: `${window.title} moved to ${targetDesktop.name}`,
        type: 'info',
        priority: 'low',
        source: 'system'
      })
    }
  }

  return (
    <>
      {/* Desktop Switcher Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        title="Virtual Desktops"
      >
        <Grid3X3 className="w-4 h-4" />
        <span className="text-sm font-medium">
          {desktops.find(d => d.id === activeDesktopId)?.name || 'Desktop 1'}
        </span>
        <span className="text-xs text-gray-400">
          {desktops.find(d => d.id === activeDesktopId)?.windowCount || 0}
        </span>
      </button>

      {/* Desktop Manager Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Virtual Desktops</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {desktops.map((desktop) => (
                  <motion.div
                    key={desktop.id}
                    className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      desktop.id === activeDesktopId
                        ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleSwitchDesktop(desktop.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Desktop Preview */}
                    <div className="aspect-video bg-gray-600 rounded-lg mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-white opacity-70" />
                      </div>
                      
                      {/* Window indicators */}
                      {Array.from({ length: Math.min(desktop.windowCount, 6) }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-sm opacity-60"
                          style={{
                            top: 20 + (i % 3) * 8,
                            left: 20 + Math.floor(i / 3) * 12
                          }}
                        />
                      ))}
                    </div>

                    {/* Desktop Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{desktop.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {desktop.windowCount} window{desktop.windowCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      
                      {desktop.id !== activeDesktopId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteDesktop(desktop.id)
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Active indicator */}
                    {desktop.id === activeDesktopId && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Add Desktop Button */}
                <motion.button
                  onClick={handleCreateDesktop}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-400 text-sm">Add Desktop</span>
                </motion.button>
              </div>

              {/* Window Management */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Move Windows</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.values(windows).map((window) => (
                    <div key={window.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {window.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm">{window.title}</p>
                          <p className="text-gray-400 text-xs">
                            Current: {desktops.find(d => d.id === window.desktopId)?.name || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      
                      <select
                        value={window.desktopId || activeDesktopId}
                        onChange={(e) => handleMoveWindow(window.id, e.target.value)}
                        className="bg-gray-600 text-white text-sm rounded px-2 py-1"
                      >
                        {desktops.map(desktop => (
                          <option key={desktop.id} value={desktop.id}>
                            {desktop.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  
                  {Object.values(windows).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No windows to move</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

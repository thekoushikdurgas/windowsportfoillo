'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindows, useWindowActions } from '@/store/windowStore'
import { useAppActions } from '@/store/appStore'
import { useNotificationActions } from '@/store/notificationStore'
import { 
  Layers, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Square
} from 'lucide-react'

interface WindowGroup {
  id: string
  name: string
  windows: string[]
  isMinimized: boolean
  isMaximized: boolean
  color: string
  createdAt: Date
}

interface WindowGroupProps {
  group: WindowGroup
  onUpdateGroup: (groupId: string, updates: Partial<WindowGroup>) => void
  onRemoveGroup: (groupId: string) => void
}

const GROUP_COLORS = [
  '#0078d4', // Blue
  '#107c10', // Green
  '#d83b01', // Red
  '#ff8c00', // Orange
  '#e3008c', // Pink
  '#8764b8', // Purple
  '#00bcf2', // Cyan
  '#ffb900'  // Yellow
]

export default function WindowGroup({ group, onUpdateGroup, onRemoveGroup }: WindowGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const windows = useWindows()
  const { focusWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowActions()
  const { getAppById } = useAppActions()
  const { addNotification } = useNotificationActions()

  const groupWindows = group.windows.map(id => windows[id]).filter(Boolean)

  const handleWindowClick = (windowId: string) => {
    const window = windows[windowId]
    if (!window) return

    if (window.isMinimized) {
      restoreWindow(windowId)
    } else {
      focusWindow(windowId)
    }
  }

  const handleMinimizeAll = () => {
    groupWindows.forEach(window => {
      if (!window.isMinimized) {
        minimizeWindow(window.id)
      }
    })
    onUpdateGroup(group.id, { isMinimized: true })
  }

  const handleMaximizeAll = () => {
    groupWindows.forEach(window => {
      if (!window.isMaximized) {
        maximizeWindow(window.id)
      }
    })
    onUpdateGroup(group.id, { isMaximized: true })
  }

  const handleRestoreAll = () => {
    groupWindows.forEach(window => {
      if (window.isMinimized) {
        restoreWindow(window.id)
      }
      if (window.isMaximized) {
        restoreWindow(window.id)
      }
    })
    onUpdateGroup(group.id, { isMinimized: false, isMaximized: false })
  }

  const handleRemoveWindow = (windowId: string) => {
    const newWindows = group.windows.filter(id => id !== windowId)
    if (newWindows.length === 0) {
      onRemoveGroup(group.id)
    } else {
      onUpdateGroup(group.id, { windows: newWindows })
    }
  }

  const handleChangeColor = (color: string) => {
    onUpdateGroup(group.id, { color })
  }

  const getGroupStatus = () => {
    const minimizedCount = groupWindows.filter(w => w.isMinimized).length
    const maximizedCount = groupWindows.filter(w => w.isMaximized).length
    
    if (minimizedCount === groupWindows.length) return 'All minimized'
    if (maximizedCount === groupWindows.length) return 'All maximized'
    if (minimizedCount > 0) return `${minimizedCount} minimized`
    return 'Active'
  }

  return (
    <motion.div
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
      style={{ borderLeftColor: group.color, borderLeftWidth: 4 }}
      layout
    >
      {/* Group Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </motion.div>
          
          <Layers className="w-4 h-4" style={{ color: group.color }} />
          
          <div>
            <h3 className="text-white font-medium">{group.name}</h3>
            <p className="text-gray-400 text-xs">{getGroupStatus()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Color Picker */}
          <div className="flex space-x-1">
            {GROUP_COLORS.map(color => (
              <button
                key={color}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChangeColor(color)
                }}
                className={`w-3 h-3 rounded-full border-2 ${
                  group.color === color ? 'border-white' : 'border-gray-500'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Group Actions */}
          <div className="flex items-center space-x-1">
            {group.isMinimized ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRestoreAll()
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Restore all"
              >
                <Square className="w-3 h-3" />
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMinimizeAll()
                  }}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Minimize all"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMaximizeAll()
                  }}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Maximize all"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemoveGroup(group.id)
              }}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Remove group"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Group Windows */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {groupWindows.map((window) => {
                const app = getAppById(window.appId)
                return (
                  <motion.div
                    key={window.id}
                    className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => handleWindowClick(window.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: group.color }}
                      >
                        {app?.icon || window.title.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <p className="text-white text-sm">{window.title}</p>
                        <p className="text-gray-400 text-xs">
                          {window.isMinimized ? 'Minimized' : 
                           window.isMaximized ? 'Maximized' : 'Active'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveWindow(window.id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Window Group Manager Component
export function WindowGroupManager() {
  const [groups, setGroups] = useState<WindowGroup[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const windows = useWindows()
  const { addNotification } = useNotificationActions()

  const handleCreateGroup = () => {
    const newGroup: WindowGroup = {
      id: `group-${Date.now()}`,
      name: `Group ${groups.length + 1}`,
      windows: [],
      isMinimized: false,
      isMaximized: false,
      color: GROUP_COLORS[groups.length % GROUP_COLORS.length],
      createdAt: new Date()
    }
    
    setGroups(prev => [...prev, newGroup])
    
    addNotification({
      title: 'Window Group Created',
      message: `New group "${newGroup.name}" has been created`,
      type: 'success',
      priority: 'low',
      source: 'system'
    })
  }

  const handleUpdateGroup = (groupId: string, updates: Partial<WindowGroup>) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ))
  }

  const handleRemoveGroup = (groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId))
    
    addNotification({
      title: 'Window Group Removed',
      message: 'Window group has been removed',
      type: 'info',
      priority: 'low',
      source: 'system'
    })
  }

  const handleAddWindowToGroup = (groupId: string, windowId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          windows: [...group.windows, windowId]
        }
      }
      return group
    }))
  }

  const handleRemoveWindowFromGroup = (groupId: string, windowId: string) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          windows: group.windows.filter(id => id !== windowId)
        }
      }
      return group
    }))
  }

  return (
    <>
      {/* Group Manager Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        title="Window Groups"
      >
        <Layers className="w-4 h-4" />
        <span className="text-sm font-medium">Groups</span>
        <span className="text-xs text-gray-400">{groups.length}</span>
      </button>

      {/* Group Manager Modal */}
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
                  <Layers className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Window Groups</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCreateGroup}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Group</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Groups List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {groups.map(group => (
                  <WindowGroup
                    key={group.id}
                    group={group}
                    onUpdateGroup={handleUpdateGroup}
                    onRemoveGroup={handleRemoveGroup}
                  />
                ))}
                
                {groups.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No window groups created yet</p>
                    <p className="text-sm">Create a group to organize your windows</p>
                  </div>
                )}
              </div>

              {/* Available Windows */}
              <div className="border-t border-gray-700 pt-4 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Available Windows</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.values(windows).map(window => (
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
                            {window.isMinimized ? 'Minimized' : 'Active'}
                          </p>
                        </div>
                      </div>
                      
                      <select
                        onChange={(e) => {
                          const groupId = e.target.value
                          if (groupId) {
                            handleAddWindowToGroup(groupId, window.id)
                          }
                        }}
                        className="bg-gray-600 text-white text-sm rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Add to group...</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  
                  {Object.values(windows).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No windows available</p>
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

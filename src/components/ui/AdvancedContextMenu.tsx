'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, 
  Copy, 
  Cut, 
  Paste, 
  Delete, 
  Rename, 
  Properties, 
  Open, 
  Pin, 
  Unpin,
  Refresh,
  View,
  Sort,
  New,
  Settings,
  Help
} from 'lucide-react'

export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  hidden?: boolean
  separator?: boolean
  submenu?: ContextMenuItem[]
  action?: () => void
  variant?: 'default' | 'danger' | 'primary'
}

interface AdvancedContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  items: ContextMenuItem[]
  onClose: () => void
  onItemClick?: (item: ContextMenuItem) => void
  className?: string
}

export default function AdvancedContextMenu({
  isOpen,
  position,
  items,
  onClose,
  onItemClick,
  className = ''
}: AdvancedContextMenuProps) {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [submenuPosition, setSubmenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Position menu within viewport
  const getMenuPosition = useCallback(() => {
    if (!menuRef.current) return position

    const menuRect = menuRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = position.x
    let y = position.y

    // Adjust horizontal position if menu would overflow
    if (x + menuRect.width > viewportWidth) {
      x = viewportWidth - menuRect.width - 10
    }

    // Adjust vertical position if menu would overflow
    if (y + menuRect.height > viewportHeight) {
      y = viewportHeight - menuRect.height - 10
    }

    // Ensure menu is not positioned off-screen
    x = Math.max(10, x)
    y = Math.max(10, y)

    return { x, y }
  }, [position])

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.hidden) return

    if (item.action) {
      item.action()
    }

    if (onItemClick) {
      onItemClick(item)
    }

    if (!item.submenu) {
      onClose()
    }
  }

  const handleItemHover = (item: ContextMenuItem, event: React.MouseEvent) => {
    if (item.submenu && !item.disabled) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set submenu position
      const rect = event.currentTarget.getBoundingClientRect()
      setSubmenuPosition({
        x: rect.right + 5,
        y: rect.top
      })

      // Show submenu after short delay
      timeoutRef.current = setTimeout(() => {
        setActiveSubmenu(item.id)
      }, 150)
    } else {
      // Hide submenu if no submenu items
      setActiveSubmenu(null)
    }
  }

  const handleItemLeave = () => {
    // Hide submenu after delay
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null)
    }, 200)
  }

  const handleSubmenuHover = () => {
    // Clear timeout when hovering over submenu
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const getItemIcon = (item: ContextMenuItem) => {
    if (item.icon) return item.icon

    // Default icons based on common actions
    const iconMap: Record<string, React.ReactNode> = {
      'copy': <Copy className="w-4 h-4" />,
      'cut': <Cut className="w-4 h-4" />,
      'paste': <Paste className="w-4 h-4" />,
      'delete': <Delete className="w-4 h-4" />,
      'rename': <Rename className="w-4 h-4" />,
      'properties': <Properties className="w-4 h-4" />,
      'open': <Open className="w-4 h-4" />,
      'pin': <Pin className="w-4 h-4" />,
      'unpin': <Unpin className="w-4 h-4" />,
      'refresh': <Refresh className="w-4 h-4" />,
      'view': <View className="w-4 h-4" />,
      'sort': <Sort className="w-4 h-4" />,
      'new': <New className="w-4 h-4" />,
      'settings': <Settings className="w-4 h-4" />,
      'help': <Help className="w-4 h-4" />
    }

    return iconMap[item.id] || null
  }

  const getItemVariantClasses = (item: ContextMenuItem) => {
    const baseClasses = "flex items-center justify-between w-full px-3 py-2 text-sm transition-colors"
    
    if (item.disabled) {
      return `${baseClasses} text-gray-500 cursor-not-allowed`
    }

    switch (item.variant) {
      case 'danger':
        return `${baseClasses} text-red-400 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-300`
      case 'primary':
        return `${baseClasses} text-blue-400 hover:bg-blue-500 hover:bg-opacity-10 hover:text-blue-300`
      default:
        return `${baseClasses} text-gray-200 hover:bg-white hover:bg-opacity-10 hover:text-white`
    }
  }

  const visibleItems = items.filter(item => !item.hidden)

  if (!isOpen || visibleItems.length === 0) return null

  return (
    <>
      <motion.div
        ref={menuRef}
        className={`fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-48 ${className}`}
        style={getMenuPosition()}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: [0.1, 0.9, 0.2, 1] }}
      >
        {visibleItems.map((item, index) => {
          if (item.separator) {
            return (
              <div
                key={`separator-${index}`}
                className="my-1 border-t border-gray-600"
              />
            )
          }

          return (
            <div key={item.id}>
              <button
                className={getItemVariantClasses(item)}
                onClick={() => handleItemClick(item)}
                onMouseEnter={(e) => handleItemHover(item, e)}
                onMouseLeave={handleItemLeave}
                disabled={item.disabled}
              >
                <div className="flex items-center space-x-3">
                  {getItemIcon(item) && (
                    <span className="flex-shrink-0">
                      {getItemIcon(item)}
                    </span>
                  )}
                  <span className="flex-1 text-left">{item.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.shortcut && (
                    <span className="text-xs text-gray-500 font-mono">
                      {item.shortcut}
                    </span>
                  )}
                  {item.submenu && (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </motion.div>

      {/* Submenu */}
      <AnimatePresence>
        {activeSubmenu && (
          <motion.div
            ref={submenuRef}
            className="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 min-w-48"
            style={submenuPosition}
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -10 }}
            transition={{ duration: 0.15, ease: [0.1, 0.9, 0.2, 1] }}
            onMouseEnter={handleSubmenuHover}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            {(() => {
              const parentItem = items.find(item => item.id === activeSubmenu)
              if (!parentItem?.submenu) return null

              return parentItem.submenu.map((subItem, index) => {
                if (subItem.separator) {
                  return (
                    <div
                      key={`sub-separator-${index}`}
                      className="my-1 border-t border-gray-600"
                    />
                  )
                }

                return (
                  <button
                    key={subItem.id}
                    className={getItemVariantClasses(subItem)}
                    onClick={() => handleItemClick(subItem)}
                    disabled={subItem.disabled}
                  >
                    <div className="flex items-center space-x-3">
                      {getItemIcon(subItem) && (
                        <span className="flex-shrink-0">
                          {getItemIcon(subItem)}
                        </span>
                      )}
                      <span className="flex-1 text-left">{subItem.label}</span>
                    </div>
                    
                    {subItem.shortcut && (
                      <span className="text-xs text-gray-500 font-mono">
                        {subItem.shortcut}
                      </span>
                    )}
                  </button>
                )
              })
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hook for context menu management
export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    items: ContextMenuItem[]
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    items: []
  })

  const showContextMenu = (event: React.MouseEvent, items: ContextMenuItem[]) => {
    event.preventDefault()
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      items
    })
  }

  const hideContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }))
  }

  const updateContextMenuItems = (items: ContextMenuItem[]) => {
    setContextMenu(prev => ({ ...prev, items }))
  }

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    updateContextMenuItems
  }
}

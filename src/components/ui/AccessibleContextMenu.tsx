'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { a11yPatterns, keyboardNavigation, focusManagement, generateId } from '@/utils/accessibility'

interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  onClick?: () => void
  children?: ContextMenuItem[]
}

interface ContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  items: ContextMenuItem[]
  onClose: () => void
}

export default function AccessibleContextMenu({ isOpen, position, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null)
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 })
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [submenuFocusedIndex, setSubmenuFocusedIndex] = useState(0)
  
  const menuId = generateId('context-menu')
  const submenuId = generateId('submenu')

  // Focus management
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const cleanup = focusManagement.trapFocus(menuRef.current)
      return cleanup
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const visibleItems = items.filter(item => item.label !== 'separator')
    
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, visibleItems.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        const currentItem = visibleItems[focusedIndex]
        if (currentItem && !currentItem.disabled) {
          handleItemClick(currentItem)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        const item = visibleItems[focusedIndex]
        if (item?.children && item.children.length > 0) {
          handleItemClick(item)
        }
        break
    }
  }, [items, focusedIndex, onClose])

  const handleItemClick = useCallback((item: ContextMenuItem) => {
    if (item.disabled) return

    if (item.children && item.children.length > 0) {
      // Show submenu
      const rect = menuRef.current?.getBoundingClientRect()
      if (rect) {
        setSubmenuPosition({
          x: rect.right + 4,
          y: rect.top
        })
        setSubmenuOpen(item.id)
        setSubmenuFocusedIndex(0)
      }
    } else {
      // Execute action
      item.onClick?.()
      onClose()
    }
  }, [onClose])

  const handleMouseEnter = useCallback((item: ContextMenuItem) => {
    if (item.children && item.children.length > 0) {
      const rect = menuRef.current?.getBoundingClientRect()
      if (rect) {
        setSubmenuPosition({
          x: rect.right + 4,
          y: rect.top
        })
        setSubmenuOpen(item.id)
        setSubmenuFocusedIndex(0)
      }
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setSubmenuOpen(null)
  }, [])

  // Reset focus when menu opens
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0)
      setSubmenuOpen(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const visibleItems = items.filter(item => item.label !== 'separator')

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        className="fixed z-50 bg-windows-surface dark:bg-windows-surface-dark border border-windows-border dark:border-windows-border-dark rounded-windows shadow-windows-lg py-1 min-w-48"
        style={{
          left: position.x,
          top: position.y,
        }}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        {...a11yPatterns.menu({ id: menuId })}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const visibleIndex = visibleItems.findIndex(visibleItem => visibleItem.id === item.id)
          const isFocused = visibleIndex === focusedIndex
          
          if (item.label === 'separator') {
            return (
              <div 
                key={`separator-${index}`}
                className="h-px bg-windows-border dark:bg-windows-border-dark my-1"
                role="separator"
              />
            )
          }

          return (
            <button
              key={item.id}
              className={`w-full text-left px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark transition-colors flex items-center gap-3 ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } ${isFocused ? 'bg-windows-accent-light dark:bg-windows-gray-dark' : ''}`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
              disabled={item.disabled}
              {...a11yPatterns.menuItem({
                'aria-disabled': item.disabled,
                'aria-expanded': item.children ? submenuOpen === item.id : undefined,
                'aria-haspopup': item.children ? 'menu' : undefined
              })}
            >
              {item.icon && <span className="text-base" aria-hidden="true">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {item.children && item.children.length > 0 && (
                <span className="text-xs" aria-hidden="true">▶</span>
              )}
            </button>
          )
        })}

        {/* Submenu */}
        <AnimatePresence>
          {submenuOpen && (
            <motion.div
              className="fixed z-50 bg-windows-surface dark:bg-windows-surface-dark border border-windows-border dark:border-windows-border-dark rounded-windows shadow-windows-lg py-1 min-w-48"
              style={{
                left: submenuPosition.x,
                top: submenuPosition.y,
              }}
              initial={{ opacity: 0, scale: 0.95, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -10 }}
              transition={{ duration: 0.15 }}
              {...a11yPatterns.menu({ id: submenuId })}
            >
              {items
                .find(item => item.id === submenuOpen)
                ?.children?.map((subItem, index) => {
                  const isFocused = index === submenuFocusedIndex
                  
                  return (
                    <button
                      key={subItem.id}
                      className={`w-full text-left px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark transition-colors flex items-center gap-3 ${
                        subItem.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${isFocused ? 'bg-windows-accent-light dark:bg-windows-gray-dark' : ''}`}
                      onClick={() => handleItemClick(subItem)}
                      disabled={subItem.disabled}
                      {...a11yPatterns.menuItem({
                        'aria-disabled': subItem.disabled
                      })}
                    >
                      {subItem.icon && <span className="text-base" aria-hidden="true">{subItem.icon}</span>}
                      <span className="flex-1">{subItem.label}</span>
                    </button>
                  )
                })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

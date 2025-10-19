'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function ContextMenu({ isOpen, position, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null)
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleItemClick = (item: ContextMenuItem) => {
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
      }
    } else {
      // Execute action
      item.onClick?.()
      onClose()
    }
  }

  const handleMouseEnter = (item: ContextMenuItem) => {
    if (item.children && item.children.length > 0) {
      const rect = menuRef.current?.getBoundingClientRect()
      if (rect) {
        setSubmenuPosition({
          x: rect.right + 4,
          y: rect.top
        })
        setSubmenuOpen(item.id)
      }
    }
  }

  const handleMouseLeave = () => {
    setSubmenuOpen(null)
  }

  if (!isOpen) return null

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
      >
        {items.map((item, index) => (
          <div key={item.id}>
            {item.label === 'separator' ? (
              <div className="h-px bg-windows-border dark:bg-windows-border-dark my-1" />
            ) : (
              <button
                className={`w-full text-left px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark transition-colors flex items-center gap-3 ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
                disabled={item.disabled}
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.children && item.children.length > 0 && (
                  <span className="text-xs">▶</span>
                )}
              </button>
            )}
          </div>
        ))}

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
            >
              {items
                .find(item => item.id === submenuOpen)
                ?.children?.map((subItem) => (
                  <button
                    key={subItem.id}
                    className={`w-full text-left px-3 py-2 text-sm text-text-primary dark:text-text-primary-dark hover:bg-windows-accent-light dark:hover:bg-windows-gray-dark transition-colors flex items-center gap-3 ${
                      subItem.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => handleItemClick(subItem)}
                    disabled={subItem.disabled}
                  >
                    {subItem.icon && <span className="text-base">{subItem.icon}</span>}
                    <span className="flex-1">{subItem.label}</span>
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

// Desktop context menu items
export const desktopContextMenuItems: ContextMenuItem[] = [
  {
    id: 'view',
    label: 'View',
    icon: '👁️',
    children: [
      { id: 'large-icons', label: 'Large icons', onClick: () => console.log('Large icons') },
      { id: 'medium-icons', label: 'Medium icons', onClick: () => console.log('Medium icons') },
      { id: 'small-icons', label: 'Small icons', onClick: () => console.log('Small icons') },
      { id: 'list', label: 'List', onClick: () => console.log('List') },
      { id: 'details', label: 'Details', onClick: () => console.log('Details') },
    ]
  },
  {
    id: 'sort',
    label: 'Sort by',
    icon: '🔀',
    children: [
      { id: 'name', label: 'Name', onClick: () => console.log('Sort by name') },
      { id: 'size', label: 'Size', onClick: () => console.log('Sort by size') },
      { id: 'type', label: 'Type', onClick: () => console.log('Sort by type') },
      { id: 'modified', label: 'Date modified', onClick: () => console.log('Sort by date') },
    ]
  },
  { id: 'separator', label: 'separator' },
  {
    id: 'refresh',
    label: 'Refresh',
    icon: '🔄',
    onClick: () => console.log('Refresh desktop')
  },
  { id: 'separator', label: 'separator' },
  {
    id: 'paste',
    label: 'Paste',
    icon: '📋',
    disabled: true,
    onClick: () => console.log('Paste')
  },
  {
    id: 'separator', label: 'separator'
  },
  {
    id: 'new',
    label: 'New',
    icon: '➕',
    children: [
      { id: 'folder', label: 'Folder', onClick: () => console.log('New folder') },
      { id: 'shortcut', label: 'Shortcut', onClick: () => console.log('New shortcut') },
      { id: 'document', label: 'Text Document', onClick: () => console.log('New document') },
    ]
  },
  { id: 'separator', label: 'separator' },
  {
    id: 'properties',
    label: 'Properties',
    icon: '⚙️',
    onClick: () => console.log('Properties')
  }
]

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktopState, useDesktopActions } from '@/store/desktopStore'
import { useWindowActions } from '@/store/windowStore'
import { useAppActions, useDesktopIcons } from '@/store/appStore'
import { useNotificationActions } from '@/store/notificationStore'
import DesktopWallpaper from './DesktopWallpaper'
import DesktopIcon from './DesktopIcon'
import Taskbar from '../taskbar/Taskbar'
import WindowManager from '../windows/WindowManager'
import StartMenu from '../startmenu/StartMenu'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import ContextMenu, { desktopContextMenuItems } from '../ui/ContextMenu'

export default function Desktop() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const { wallpaper, theme, startMenuOpen } = useDesktopState()
  const { closeStartMenu } = useDesktopActions()
  const { openWindow } = useWindowActions()
  const { launchApp, deselectAllDesktopIcons } = useAppActions()
  const { addNotification } = useNotificationActions()
  const desktopIcons = useDesktopIcons()
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
  }>({
    isOpen: false,
    position: { x: 0, y: 0 }
  })

  // Handle keyboard shortcuts
  useKeyboardShortcuts()

  // Handle desktop clicks
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      closeStartMenu()
      deselectAllDesktopIcons()
    }
  }

  // Handle desktop context menu
  const handleDesktopRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY }
    })
  }

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }))
  }

  // Handle app launching
  const handleAppLaunch = (appId: string) => {
    try {
      const instanceId = launchApp(appId)
      if (instanceId) {
        // Create a window for the app instance
        const app = desktopIcons.find(icon => icon.appId === appId)
        if (app) {
          openWindow({
            id: `window-${instanceId}`,
            title: app.name,
            appId: appId,
            position: { x: 100, y: 100 },
            size: { width: 800, height: 600 },
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
            zIndex: 1,
            isDragging: false,
            isResizing: false,
          })
        }
      } else {
        addNotification({
          title: 'App Launch Failed',
          message: `Could not launch ${appId}. The app may not be available.`,
          type: 'error',
          priority: 'normal',
          source: 'system',
        })
      }
    } catch (error) {
      console.error('Error launching app:', error)
      addNotification({
        title: 'App Launch Error',
        message: `An error occurred while launching ${appId}.`,
        type: 'error',
        priority: 'high',
        source: 'system',
      })
    }
  }

  return (
    <div 
      ref={desktopRef}
      className="relative w-full h-screen overflow-hidden bg-black"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopRightClick}
    >
      {/* Desktop Wallpaper */}
      <DesktopWallpaper wallpaper={wallpaper} />

      {/* Desktop Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          {desktopIcons.map((icon) => (
            <div
              key={icon.id}
              className="desktop-icon-container"
              style={{
                '--icon-x': `${icon.position.x}px`,
                '--icon-y': `${icon.position.y}px`,
                left: 'var(--icon-x)',
                top: 'var(--icon-y)',
              } as React.CSSProperties}
            >
              <DesktopIcon
                icon={icon}
                onClick={() => {
                  // Select the icon
                  deselectAllDesktopIcons()
                  // Note: Desktop icon selection is handled by the DesktopIcon component
                }}
                onDoubleClick={() => {
                  // Launch the application
                  handleAppLaunch(icon.appId)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Window Manager */}
      <WindowManager />

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && <StartMenu />}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />

      {/* Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={desktopContextMenuItems}
        onClose={closeContextMenu}
      />
    </div>
  )
}

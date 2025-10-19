'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useDesktopActions } from '@/store/desktopStore'
import { useWindowActions, useWindows } from '@/store/windowStore'
import { useSettings } from '@/store/settingsStore'
import { useNotificationActions } from '@/store/notificationStore'
import { KeyboardShortcut, KeyboardModifier } from '@/types/keyboard'

export function useKeyboardShortcuts() {
  const { toggleStartMenu, closeStartMenu, setFocusedWindow } = useDesktopActions()
  const { focusWindow, minimizeWindow, maximizeWindow, closeWindow } = useWindowActions()
  const { openSettings } = useSettings()
  const { addNotification } = useNotificationActions()
  const windows = useWindows()
  
  const altTabPressed = useRef(false)
  const altTabIndex = useRef(0)

  // Get all open windows sorted by z-index
  const getSortedWindows = useCallback(() => {
    return Object.values(windows)
      .filter(w => !w.isMinimized)
      .sort((a, b) => b.zIndex - a.zIndex)
  }, [windows])

  // Show desktop (minimize all windows)
  const showDesktop = useCallback(() => {
    const sortedWindows = getSortedWindows()
    sortedWindows.forEach(window => {
      minimizeWindow(window.id)
    })
  }, [getSortedWindows, minimizeWindow])

  // Alt+Tab functionality
  const handleAltTab = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    const sortedWindows = getSortedWindows()
    
    if (sortedWindows.length === 0) return
    
    if (!altTabPressed.current) {
      altTabPressed.current = true
      altTabIndex.current = 0
    } else {
      altTabIndex.current = (altTabIndex.current + 1) % sortedWindows.length
    }
    
    const targetWindow = sortedWindows[altTabIndex.current]
    if (targetWindow) {
      focusWindow(targetWindow.id)
    }
  }, [getSortedWindows, focusWindow])

  // End Alt+Tab
  const endAltTab = useCallback(() => {
    altTabPressed.current = false
    altTabIndex.current = 0
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default browser shortcuts
      if (e.key === 'F12') {
        e.preventDefault()
        return
      }

      // Windows key - Toggle Start Menu
      if (e.key === 'Meta' || e.key === 'Super') {
        e.preventDefault()
        toggleStartMenu()
        return
      }

      // Escape - Close Start Menu and end Alt+Tab
      if (e.key === 'Escape') {
        closeStartMenu()
        endAltTab()
        return
      }

      // Alt + Tab - Switch between windows
      if (e.altKey && e.key === 'Tab') {
        handleAltTab(e)
        return
      }

      // End Alt+Tab when Alt is released
      if (e.key === 'Alt') {
        endAltTab()
        return
      }

      // Ctrl + Alt + Del - Task Manager
      if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        e.preventDefault()
        addNotification({
          title: 'Task Manager',
          message: 'Task Manager functionality coming soon!',
          type: 'info',
          priority: 'normal',
          source: 'system',
        })
        return
      }

      // F5 - Refresh desktop
      if (e.key === 'F5') {
        e.preventDefault()
        window.location.reload()
        return
      }

      // Windows key + D - Show desktop
      if ((e.key === 'Meta' || e.key === 'Super') && e.key === 'd') {
        e.preventDefault()
        showDesktop()
        return
      }

      // Windows key + R - Run dialog
      if ((e.key === 'Meta' || e.key === 'Super') && e.key === 'r') {
        e.preventDefault()
        addNotification({
          title: 'Run Dialog',
          message: 'Run dialog functionality coming soon!',
          type: 'info',
          priority: 'normal',
          source: 'system',
        })
        return
      }

      // Windows key + I - Open Settings
      if ((e.key === 'Meta' || e.key === 'Super') && e.key === 'i') {
        e.preventDefault()
        openSettings('appearance')
        return
      }

      // Windows key + L - Lock screen
      if ((e.key === 'Meta' || e.key === 'Super') && e.key === 'l') {
        e.preventDefault()
        addNotification({
          title: 'Lock Screen',
          message: 'Lock screen functionality coming soon!',
          type: 'info',
          priority: 'normal',
          source: 'system',
        })
        return
      }

      // Windows key + Tab - Task View
      if ((e.key === 'Meta' || e.key === 'Super') && e.key === 'Tab') {
        e.preventDefault()
        addNotification({
          title: 'Task View',
          message: 'Task View functionality coming soon!',
          type: 'info',
          priority: 'normal',
          source: 'system',
        })
        return
      }

      // Ctrl + Shift + Esc - Task Manager
      if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
        e.preventDefault()
        addNotification({
          title: 'Task Manager',
          message: 'Task Manager functionality coming soon!',
          type: 'info',
          priority: 'normal',
          source: 'system',
        })
        return
      }

      // Alt + F4 - Close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault()
        const sortedWindows = getSortedWindows()
        if (sortedWindows.length > 0) {
          closeWindow(sortedWindows[0].id)
        }
        return
      }

      // F11 - Toggle fullscreen
      if (e.key === 'F11') {
        e.preventDefault()
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        return
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // End Alt+Tab when Alt is released
      if (e.key === 'Alt') {
        endAltTab()
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    toggleStartMenu, 
    closeStartMenu, 
    handleAltTab, 
    endAltTab, 
    showDesktop, 
    openSettings, 
    addNotification, 
    getSortedWindows, 
    closeWindow
  ])
}

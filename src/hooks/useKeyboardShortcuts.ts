'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { useSystemStore } from '@/store/systemStore';
import { useAppStore } from '@/store/appStore';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsOptions {
  onShowKeyboardHelp?: () => void;
}

export function useKeyboardShortcuts(options?: KeyboardShortcutsOptions) {
  const { 
    windows, 
    activeWindowId, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow,
    moveWindow,
    resizeWindow
  } = useWindowStore();
  
  const systemStore = useSystemStore();
  const { 
    toggleStartMenu, 
    setStartMenuOpen,
    setQuickSettingsOpen,
    setNotificationCenterOpen,
    volume,
    setVolume,
    brightness,
    setBrightness
  } = systemStore;
  
  const { openApp } = useAppStore();

  const getActiveWindow = useCallback(() => {
    return windows.find(w => w.id === activeWindowId);
  }, [windows, activeWindowId]);

  const handleWindowSnap = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    const activeWindow = getActiveWindow();
    if (!activeWindow) return;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPosition = { x: 0, y: 0 };
    let newSize = { width: viewport.width, height: viewport.height };

    switch (direction) {
      case 'left':
        newSize = { width: viewport.width / 2, height: viewport.height };
        newPosition = { x: 0, y: 0 };
        break;
      case 'right':
        newSize = { width: viewport.width / 2, height: viewport.height };
        newPosition = { x: viewport.width / 2, y: 0 };
        break;
      case 'up':
        newSize = { width: viewport.width, height: viewport.height / 2 };
        newPosition = { x: 0, y: 0 };
        break;
      case 'down':
        newSize = { width: viewport.width, height: viewport.height / 2 };
        newPosition = { x: 0, y: viewport.height / 2 };
        break;
    }

    moveWindow(activeWindow.id, newPosition);
    resizeWindow(activeWindow.id, newSize);
  }, [getActiveWindow, moveWindow, resizeWindow]);

  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    // Window Management
    {
      key: 'Tab',
      alt: true,
      description: 'Switch between windows',
      action: () => {
        if (windows.length === 0) return;
        const currentIndex = windows.findIndex(w => w.id === activeWindowId);
        const nextIndex = (currentIndex + 1) % windows.length;
        focusWindow(windows[nextIndex].id);
      }
    },
    {
      key: 'Tab',
      alt: true,
      shift: true,
      description: 'Switch between windows (reverse)',
      action: () => {
        if (windows.length === 0) return;
        const currentIndex = windows.findIndex(w => w.id === activeWindowId);
        const prevIndex = currentIndex === 0 ? windows.length - 1 : currentIndex - 1;
        focusWindow(windows[prevIndex].id);
      }
    },
    {
      key: 'F4',
      alt: true,
      description: 'Close active window',
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId);
        }
      }
    },
    {
      key: 'Space',
      meta: true,
      description: 'Maximize/restore active window',
      action: () => {
        if (activeWindowId) {
          maximizeWindow(activeWindowId);
        }
      }
    },
    {
      key: 'M',
      meta: true,
      description: 'Minimize active window',
      action: () => {
        if (activeWindowId) {
          minimizeWindow(activeWindowId);
        }
      }
    },
    {
      key: 'D',
      meta: true,
      description: 'Show/hide desktop (minimize all)',
      action: () => {
        windows.forEach(window => {
          if (!window.isMinimized) {
            minimizeWindow(window.id);
          }
        });
      }
    },
    {
      key: 'Left',
      meta: true,
      description: 'Snap window to left half',
      action: () => handleWindowSnap('left')
    },
    {
      key: 'Right',
      meta: true,
      description: 'Snap window to right half',
      action: () => handleWindowSnap('right')
    },
    {
      key: 'Up',
      meta: true,
      description: 'Snap window to top half',
      action: () => handleWindowSnap('up')
    },
    {
      key: 'Down',
      meta: true,
      description: 'Snap window to bottom half',
      action: () => handleWindowSnap('down')
    },

    // System Shortcuts
    {
      key: 'Escape',
      description: 'Close Start Menu / Cancel operations',
      action: () => {
        setStartMenuOpen(false);
        setQuickSettingsOpen(false);
        setNotificationCenterOpen(false);
      }
    },
    {
      key: ' ',
      meta: true,
      description: 'Open Start Menu',
      action: () => toggleStartMenu()
    },
    {
      key: 'A',
      meta: true,
      description: 'Open Quick Settings',
      action: () => setQuickSettingsOpen(true)
    },
    {
      key: 'N',
      meta: true,
      description: 'Open Notification Center',
      action: () => setNotificationCenterOpen(true)
    },

    // Application Shortcuts
    {
      key: '1',
      meta: true,
      description: 'Open Calculator',
      action: () => openApp('calculator')
    },
    {
      key: '2',
      meta: true,
      description: 'Open File Explorer',
      action: () => openApp('file-explorer')
    },
    {
      key: '3',
      meta: true,
      description: 'Open Settings',
      action: () => openApp('settings')
    },
    {
      key: '4',
      meta: true,
      description: 'Open Notepad',
      action: () => openApp('notepad')
    },
    {
      key: '5',
      meta: true,
      description: 'Open About Me',
      action: () => openApp('about-me')
    },

    // Media Controls
    {
      key: ' ',
      description: 'Play/Pause media',
      action: () => {
        // Toggle media playback
        // TODO: Implement media play/pause functionality
      }
    },
    {
      key: 'ArrowUp',
      description: 'Increase volume',
      action: () => setVolume(Math.min(100, volume + 5))
    },
    {
      key: 'ArrowDown',
      description: 'Decrease volume',
      action: () => setVolume(Math.max(0, volume - 5))
    },
    {
      key: 'M',
      description: 'Mute volume',
      action: () => setVolume(volume > 0 ? 0 : 50)
    },

    // Brightness Controls
    {
      key: 'ArrowUp',
      ctrl: true,
      description: 'Increase brightness',
      action: () => setBrightness(Math.min(100, brightness + 5))
    },
    {
      key: 'ArrowDown',
      ctrl: true,
      description: 'Decrease brightness',
      action: () => setBrightness(Math.max(0, brightness - 5))
    },

    // Theme Toggle
    {
      key: 'T',
      meta: true,
      description: 'Toggle theme',
      action: () => systemStore.toggleTheme()
    },

    // Help
    {
      key: 'Slash',
      meta: true,
      shift: true,
      description: 'Show keyboard shortcuts help',
      action: () => {
        options?.onShowKeyboardHelp?.();
      }
    },

    // Development/Debug
    {
      key: 'F12',
      description: 'Toggle developer tools',
      action: () => {
        // TODO: Implement developer tools toggle
        // In a real app, this would open dev tools
      }
    },
    {
      key: 'F5',
      description: 'Refresh/Reload',
      action: () => {
        window.location.reload();
      }
    },
    {
      key: 'I',
      meta: true,
      shift: true,
      description: 'Toggle developer tools',
      action: () => {
        // TODO: Implement developer tools toggle (Cmd+Shift+I)
      }
    }
  ], [
    windows,
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    handleWindowSnap,
    toggleStartMenu,
    setStartMenuOpen,
    setQuickSettingsOpen,
    setNotificationCenterOpen,
    volume,
    setVolume,
    brightness,
    setBrightness,
    openApp,
    options,
    systemStore
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.contentEditable === 'true'
      ) {
        // Only allow certain shortcuts in input fields
        const allowedInInputs = ['Escape', 'Tab'];
        if (!allowedInInputs.includes(e.key)) {
          return;
        }
      }

      const pressedKey = e.key.toLowerCase();
      const isCtrl = e.ctrlKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;
      const isMeta = e.metaKey;

      // Find matching shortcut
      const shortcut = shortcuts.find(s => {
        const keyMatch = s.key.toLowerCase() === pressedKey;
        const ctrlMatch = (s.ctrl || false) === isCtrl;
        const altMatch = (s.alt || false) === isAlt;
        const shiftMatch = (s.shift || false) === isShift;
        const metaMatch = (s.meta || false) === isMeta;

        return keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch;
      });

      if (shortcut) {
        e.preventDefault();
        e.stopPropagation();
        shortcut.action();
        
        // Visual feedback for shortcuts
        showShortcutFeedback(shortcut.description);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return shortcuts;
}

function showShortcutFeedback(description: string) {
  // Create a temporary toast notification for shortcut feedback
  const toast = document.createElement('div');
  toast.className = `
    fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000]
    bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg
    text-sm font-medium pointer-events-none
    animate-pulse
  `;
  toast.textContent = description;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 1500);
}

// Hook for getting available shortcuts (for help/settings)
export function useAvailableShortcuts() {
  const shortcuts = useKeyboardShortcuts();
  
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const category = getShortcutCategory(shortcut);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(shortcut);
    return groups;
  }, {} as Record<string, KeyboardShortcut[]>);

  return groupedShortcuts;
}

function getShortcutCategory(shortcut: KeyboardShortcut): string {
  const description = shortcut.description.toLowerCase();
  
  if (description.includes('window') || description.includes('snap')) {
    return 'Window Management';
  }
  if (description.includes('volume') || description.includes('brightness') || description.includes('media')) {
    return 'Media & System';
  }
  if (description.includes('open') || description.includes('calculator') || description.includes('explorer')) {
    return 'Applications';
  }
  if (description.includes('start menu') || description.includes('settings') || description.includes('notification')) {
    return 'System';
  }
  if (description.includes('theme') || description.includes('developer')) {
    return 'Advanced';
  }
  
  return 'General';
}

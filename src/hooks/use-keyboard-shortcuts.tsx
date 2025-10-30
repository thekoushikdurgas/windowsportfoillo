'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { useDurgasAssistant } from '@/hooks/use-durgas-assistant';
import type { WindowInstance } from '@/store/windowStore';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const { 
    openApp, 
    isStartMenuOpen, 
    setStartMenuOpen, 
    windows, 
    focusApp, 
    closeApp,
    cascadeWindows,
    tileWindowsHorizontal,
    tileWindowsVertical
  } = useDesktop();
  const { toggleAssistant } = useDurgasAssistant();

  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    {
      key: 'Escape',
      action: () => {
        if (isStartMenuOpen) {
          setStartMenuOpen(false);
        }
      },
      description: 'Close Start Menu',
    },
    {
      key: 'Meta',
      action: () => setStartMenuOpen(!isStartMenuOpen),
      description: 'Toggle Start Menu',
    },
    {
      key: 'a',
      ctrlKey: true,
      action: () => toggleAssistant(),
      description: 'Open Durgas Assistant',
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => openApp('explorer'),
      description: 'Open File Explorer',
    },
    {
      key: 'b',
      ctrlKey: true,
      action: () => openApp('browser'),
      description: 'Open Browser',
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => openApp('settings'),
      description: 'Open Settings',
    },
    {
      key: 't',
      ctrlKey: true,
      action: () => openApp('terminal'),
      description: 'Open Terminal',
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => openApp('notepad'),
      description: 'Open Notepad',
    },
    {
      key: 'Tab',
      action: () => {
        // Cycle through open windows
        if (windows.length > 0) {
          const currentFocused = windows.find((w: WindowInstance) => w.zIndex === Math.max(...windows.map((w: WindowInstance) => w.zIndex)));
          if (currentFocused) {
            const currentIndex = windows.findIndex((w: WindowInstance) => w.id === currentFocused.id);
            const nextIndex = (currentIndex + 1) % windows.length;
            const nextWindow = windows[nextIndex];
            if (nextWindow) {
              focusApp(nextWindow.id);
            }
          }
        }
      },
      description: 'Cycle through windows',
    },
    {
      key: 'F4',
      altKey: true,
      action: () => {
        // Close current window
        const currentFocused = windows.find((w: WindowInstance) => w.zIndex === Math.max(...windows.map((w: WindowInstance) => w.zIndex)));
        if (currentFocused) {
          closeApp(currentFocused.id);
        }
      },
      description: 'Close current window',
    },
    {
      key: 'F11',
      action: () => {
        // Toggle fullscreen
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      },
      description: 'Toggle fullscreen',
    },
    {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      action: () => cascadeWindows(),
      description: 'Cascade windows',
    },
    {
      key: 'h',
      ctrlKey: true,
      shiftKey: true,
      action: () => tileWindowsHorizontal(),
      description: 'Tile windows horizontally',
    },
    {
      key: 'v',
      ctrlKey: true,
      shiftKey: true,
      action: () => tileWindowsVertical(),
      description: 'Tile windows vertically',
    },
  ], [isStartMenuOpen, setStartMenuOpen, toggleAssistant, openApp, windows, focusApp, closeApp, cascadeWindows, tileWindowsHorizontal, tileWindowsVertical]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      return (
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        !!shortcut.ctrlKey === event.ctrlKey &&
        !!shortcut.altKey === event.altKey &&
        !!shortcut.shiftKey === event.shiftKey &&
        !!shortcut.metaKey === event.metaKey
      );
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: shortcuts.map(s => ({
      key: s.key,
      modifiers: [
        s.ctrlKey && 'Ctrl',
        s.altKey && 'Alt',
        s.shiftKey && 'Shift',
        s.metaKey && 'Meta',
      ].filter(Boolean).join(' + '),
      description: s.description,
    })),
  };
}

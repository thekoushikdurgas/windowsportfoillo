'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Windows key
  action: () => void;
  description?: string;
}

/**
 * Windows 11 Keyboard Shortcuts Hook
 * Handles system-wide keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = shortcut.key.toLowerCase() === e.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;
      const metaMatch = shortcut.meta ? (e.metaKey || e.ctrlKey) : (!e.metaKey && !e.ctrlKey);

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        e.preventDefault();
        e.stopPropagation();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Windows 11 System Shortcuts
 * Common Windows 11 keyboard shortcuts
 */
export const WINDOWS_SHORTCUTS = {
  // Window Management
  WIN_TAB: { key: 'Tab', meta: true, description: 'Task View' },
  WIN_D: { key: 'd', meta: true, description: 'Show Desktop' },
  WIN_W: { key: 'w', meta: true, description: 'Widgets' },
  WIN_A: { key: 'a', meta: true, description: 'Action Center' },
  WIN_S: { key: 's', meta: true, description: 'Search' },
  WIN_I: { key: 'i', meta: true, description: 'Settings' },
  WIN_X: { key: 'x', meta: true, description: 'Quick Link Menu' },
  
  // Window Snapping
  WIN_LEFT: { key: 'ArrowLeft', meta: true, description: 'Snap Window Left' },
  WIN_RIGHT: { key: 'ArrowRight', meta: true, description: 'Snap Window Right' },
  WIN_UP: { key: 'ArrowUp', meta: true, description: 'Maximize Window' },
  WIN_DOWN: { key: 'ArrowDown', meta: true, description: 'Restore/Minimize Window' },
  
  // App Switching
  ALT_TAB: { key: 'Tab', alt: true, description: 'Switch Apps' },
  ALT_SHIFT_TAB: { key: 'Tab', alt: true, shift: true, description: 'Switch Apps (Reverse)' },
  
  // Window Controls
  ALT_F4: { key: 'F4', alt: true, description: 'Close Window' },
  WIN_M: { key: 'm', meta: true, description: 'Minimize All' },
  WIN_SHIFT_M: { key: 'm', meta: true, shift: true, description: 'Restore Minimized' },
  
  // Virtual Desktops
  WIN_CTRL_LEFT: { key: 'ArrowLeft', meta: true, ctrl: true, description: 'Switch Desktop Left' },
  WIN_CTRL_RIGHT: { key: 'ArrowRight', meta: true, ctrl: true, description: 'Switch Desktop Right' },
  WIN_CTRL_D: { key: 'd', meta: true, ctrl: true, description: 'New Desktop' },
  WIN_CTRL_F4: { key: 'F4', meta: true, ctrl: true, description: 'Close Desktop' },
} as const;


'use client';

import React, { createContext, useContext, ReactNode } from 'react';
// import type { App } from '@/lib/apps.config';
import { useWindowStore, type WindowInstance } from '@/store/windowStore';

interface DesktopContextType {
  isStartMenuOpen: boolean;
  setStartMenuOpen: (isOpen: boolean) => void;
  openApp: (appId: string, data?: Record<string, unknown>) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  windows: WindowInstance[];
  updateWindow: (id: string, updates: Partial<Omit<WindowInstance, 'id'>>) => void;
  cascadeWindows: () => void;
  tileWindowsHorizontal: () => void;
  tileWindowsVertical: () => void;
  arrangeWindows: (type: 'cascade' | 'tile-horizontal' | 'tile-vertical') => void;
  toggleAlwaysOnTop: (id: string) => void;
  setWindowTransparency: (id: string, transparency: number) => void;
  restoreWindow: (id: string) => void;
  saveWindowState: (id: string) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const {
    windows,
    openApp: openAppFromStore,
    closeApp,
    focusApp,
    toggleMinimize,
    toggleMaximize,
    updateWindow,
    isStartMenuOpen,
    setStartMenuOpen,
    cascadeWindows,
    tileWindowsHorizontal,
    tileWindowsVertical,
    arrangeWindows,
    toggleAlwaysOnTop,
    setWindowTransparency,
    restoreWindow,
    saveWindowState,
  } = useWindowStore();

  const openApp = (appId: string, data?: Record<string, unknown>) => {
    const appWindow = windows.find(w => w.app.id === appId && !w.data); // Only reuse if no new data
    if(appWindow) {
      if(appWindow.isMinimized) {
        toggleMinimize(appWindow.id);
      }
      focusApp(appWindow.id);
    } else {
      openAppFromStore(appId, data);
    }
  }

  return (
    <DesktopContext.Provider
      value={{
        windows,
        openApp,
        closeApp,
        focusApp,
        toggleMinimize,
        toggleMaximize,
        updateWindow,
        isStartMenuOpen,
        setStartMenuOpen,
        cascadeWindows,
        tileWindowsHorizontal,
        tileWindowsVertical,
        arrangeWindows,
        toggleAlwaysOnTop,
        setWindowTransparency,
        restoreWindow,
        saveWindowState,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};

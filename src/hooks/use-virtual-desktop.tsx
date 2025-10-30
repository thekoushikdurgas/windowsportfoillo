'use client';

import { useState, useCallback, useRef } from 'react';

export interface VirtualDesktop {
  id: string;
  name: string;
  wallpaper: string;
  windows: string[];
  settings: DesktopSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface DesktopSettings {
  wallpaper: string;
  wallpaperPosition: 'fill' | 'fit' | 'stretch' | 'center';
  iconSize: number;
  iconSpacing: number;
  snapToGrid: boolean;
  showIcons: boolean;
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  animations: boolean;
  transparency: number;
}

interface VirtualDesktopState {
  desktops: VirtualDesktop[];
  activeDesktopId: string;
  isOverviewMode: boolean;
  isTransitioning: boolean;
}

const defaultDesktopSettings: DesktopSettings = {
  wallpaper: 'default',
  wallpaperPosition: 'fill',
  iconSize: 64,
  iconSpacing: 16,
  snapToGrid: true,
  showIcons: true,
  theme: 'auto',
  accentColor: 'blue',
  animations: true,
  transparency: 0.9,
};

export function useVirtualDesktop() {
  const [state, setState] = useState<VirtualDesktopState>({
    desktops: [
      {
        id: 'desktop-1',
        name: 'Desktop 1',
        wallpaper: 'default',
        windows: [],
        settings: { ...defaultDesktopSettings },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    activeDesktopId: 'desktop-1',
    isOverviewMode: false,
    isTransitioning: false,
  });

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createDesktop = useCallback((name: string, settings?: Partial<DesktopSettings>) => {
    const newDesktop: VirtualDesktop = {
      id: `desktop-${Date.now()}`,
      name,
      wallpaper: 'default',
      windows: [],
      settings: { ...defaultDesktopSettings, ...settings },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      desktops: [...prev.desktops, newDesktop],
    }));

    return newDesktop;
  }, []);

  const deleteDesktop = useCallback((desktopId: string) => {
    if (state.desktops.length <= 1) {
      throw new Error('Cannot delete the last desktop');
    }

    setState(prev => {
      const newDesktops = prev.desktops.filter(d => d.id !== desktopId);
      const newActiveDesktopId = prev.activeDesktopId === desktopId 
        ? (newDesktops[0]?.id ?? '') 
        : prev.activeDesktopId;

      return {
        ...prev,
        desktops: newDesktops,
        activeDesktopId: newActiveDesktopId,
      };
    });
  }, [state.desktops.length]);

  const switchToDesktop = useCallback((desktopId: string) => {
    const desktop = state.desktops.find(d => d.id === desktopId);
    if (!desktop) return;

    setState(prev => ({
      ...prev,
      activeDesktopId: desktopId,
      isTransitioning: true,
    }));

    // Clear any existing transition timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Set transition timeout
    transitionTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false,
      }));
    }, 300);
  }, [state.desktops]);

  const moveWindowToDesktop = useCallback((windowId: string, desktopId: string) => {
    setState(prev => ({
      ...prev,
      desktops: prev.desktops.map(desktop => ({
        ...desktop,
        windows: desktop.id === desktopId
          ? [...desktop.windows, windowId]
          : desktop.windows.filter(id => id !== windowId),
        updatedAt: new Date(),
      })),
    }));
  }, []);

  const addWindowToDesktop = useCallback((windowId: string, desktopId?: string) => {
    const targetDesktopId = desktopId || state.activeDesktopId;
    
    setState(prev => ({
      ...prev,
      desktops: prev.desktops.map(desktop => 
        desktop.id === targetDesktopId
          ? {
              ...desktop,
              windows: [...desktop.windows, windowId],
              updatedAt: new Date(),
            }
          : desktop
      ),
    }));
  }, [state.activeDesktopId]);

  const removeWindowFromDesktop = useCallback((windowId: string, desktopId?: string) => {
    const targetDesktopId = desktopId || state.activeDesktopId;
    
    setState(prev => ({
      ...prev,
      desktops: prev.desktops.map(desktop => 
        desktop.id === targetDesktopId
          ? {
              ...desktop,
              windows: desktop.windows.filter(id => id !== windowId),
              updatedAt: new Date(),
            }
          : desktop
      ),
    }));
  }, [state.activeDesktopId]);

  const updateDesktopSettings = useCallback((desktopId: string, settings: Partial<DesktopSettings>) => {
    setState(prev => ({
      ...prev,
      desktops: prev.desktops.map(desktop =>
        desktop.id === desktopId
          ? {
              ...desktop,
              settings: { ...desktop.settings, ...settings },
              updatedAt: new Date(),
            }
          : desktop
      ),
    }));
  }, []);

  const renameDesktop = useCallback((desktopId: string, name: string) => {
    setState(prev => ({
      ...prev,
      desktops: prev.desktops.map(desktop =>
        desktop.id === desktopId
          ? {
              ...desktop,
              name,
              updatedAt: new Date(),
            }
          : desktop
      ),
    }));
  }, []);

  const toggleOverviewMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOverviewMode: !prev.isOverviewMode,
    }));
  }, []);

  const getActiveDesktop = useCallback(() => {
    return state.desktops.find(d => d.id === state.activeDesktopId);
  }, [state.desktops, state.activeDesktopId]);

  const getDesktopWindows = useCallback((desktopId: string) => {
    const desktop = state.desktops.find(d => d.id === desktopId);
    return desktop?.windows || [];
  }, [state.desktops]);

  const getWindowDesktop = useCallback((windowId: string) => {
    return state.desktops.find(desktop => desktop.windows.includes(windowId));
  }, [state.desktops]);

  const duplicateDesktop = useCallback((desktopId: string, name?: string) => {
    const desktop = state.desktops.find(d => d.id === desktopId);
    if (!desktop) return;

    const newDesktop: VirtualDesktop = {
      id: `desktop-${Date.now()}`,
      name: name || `${desktop.name} Copy`,
      wallpaper: desktop.wallpaper,
      windows: [], // Don't duplicate windows
      settings: { ...desktop.settings },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      desktops: [...prev.desktops, newDesktop],
    }));

    return newDesktop;
  }, [state.desktops]);

  return {
    // State
    desktops: state.desktops,
    activeDesktopId: state.activeDesktopId,
    isOverviewMode: state.isOverviewMode,
    isTransitioning: state.isTransitioning,
    
    // Actions
    createDesktop,
    deleteDesktop,
    switchToDesktop,
    moveWindowToDesktop,
    addWindowToDesktop,
    removeWindowFromDesktop,
    updateDesktopSettings,
    renameDesktop,
    toggleOverviewMode,
    
    // Getters
    getActiveDesktop,
    getDesktopWindows,
    getWindowDesktop,
    duplicateDesktop,
  };
}

'use client';

import { useEffect } from 'react';
import { persistence } from '@/utils/persistence';
import { useSystemStore } from '@/store/systemStore';
import { useWindowStore } from '@/store/windowStore';
import { DesktopIcon } from '@/types/system';

export function usePersistence() {
  const systemStore = useSystemStore();

  // Load settings on mount
  useEffect(() => {
    const settings = persistence.getSettings();
    
    // Apply theme
    if (settings.theme) {
      systemStore.setTheme(settings.theme);
    }
    
    // Apply wallpaper
    if (settings.wallpaper) {
      systemStore.setWallpaper(settings.wallpaper);
    }
    
    // Apply volume and brightness
    if (settings.volume !== undefined) {
      systemStore.setVolume(settings.volume);
    }
    
    if (settings.brightness !== undefined) {
      systemStore.setBrightness(settings.brightness);
    }
    
    // Apply desktop icons
    if (settings.desktopIcons.length > 0) {
      settings.desktopIcons.forEach(icon => {
        // Ensure the icon has the required isSelected property
        const iconWithSelection: DesktopIcon = {
          ...icon,
          isSelected: false // Default to not selected when loading from persistence
        };
        systemStore.addDesktopIcon(iconWithSelection);
      });
    }
    
    // Apply recent apps
    if (settings.recentApps.length > 0) {
      settings.recentApps.forEach(appId => {
        systemStore.addToRecent(appId);
      });
    }
  }, [systemStore]);

  // Save theme changes
  useEffect(() => {
    const unsubscribe = useSystemStore.subscribe(
      (state) => {
        persistence.setTheme(state.theme);
      }
    );
    
    return unsubscribe;
  }, []);

  // Save wallpaper changes
  useEffect(() => {
    const unsubscribe = useSystemStore.subscribe(
      (state) => {
        persistence.setWallpaper(state.wallpaper);
      }
    );
    
    return unsubscribe;
  }, []);

  // Save volume changes
  useEffect(() => {
    const unsubscribe = useSystemStore.subscribe(
      (state) => {
        persistence.setVolume(state.volume);
      }
    );
    
    return unsubscribe;
  }, []);

  // Save brightness changes
  useEffect(() => {
    const unsubscribe = useSystemStore.subscribe(
      (state) => {
        persistence.setBrightness(state.brightness);
      }
    );
    
    return unsubscribe;
  }, []);

  // Save window positions when they change
  useEffect(() => {
    const unsubscribe = useWindowStore.subscribe(
      (state) => {
        state.windows.forEach(window => {
          persistence.setWindowPosition(window.id, {
            x: window.position.x,
            y: window.position.y,
            width: window.size.width,
            height: window.size.height,
            isMaximized: window.isMaximized,
            crop: window.crop,
          });
        });
      }
    );
    
    return unsubscribe;
  }, []);

  // Save desktop icons when they change
  useEffect(() => {
    const unsubscribe = useSystemStore.subscribe(
      (state) => {
        persistence.setDesktopIcons(state.desktopIcons);
      }
    );
    
    return unsubscribe;
  }, []);

  // Save recent apps when they change
  useEffect(() => {
    const unsubscribe = useSystemStore.subscribe(
      (state) => {
        state.recentApps.forEach(appId => {
          persistence.addRecentApp(appId);
        });
      }
    );
    
    return unsubscribe;
  }, []);

  return {
    persistence,
    // Helper functions for manual saves
    saveWindowPosition: (windowId: string, position: {
      x: number;
      y: number;
      width: number;
      height: number;
      isMaximized: boolean;
      crop?: { x: number; y: number; width: number; height: number } | null;
    }) => {
      persistence.setWindowPosition(windowId, position);
    },
    saveCalculatorState: (history: string[], memory: number) => {
      persistence.setCalculatorHistory(history);
      persistence.setCalculatorMemory(memory);
    },
    exportSettings: () => persistence.exportSettings(),
    importSettings: (jsonData: string) => persistence.importSettings(jsonData),
    resetSettings: () => persistence.resetSettings(),
  };
}

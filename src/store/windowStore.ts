import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { apps, type App } from '@/lib/apps.config';

export interface WindowInstance {
  id: string;
  app: App;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  data?: Record<string, unknown>; // To pass props to app components
  isAlwaysOnTop?: boolean;
  transparency?: number;
  isResizable?: boolean;
  isMovable?: boolean;
  isMinimizable?: boolean;
  isMaximizable?: boolean;
  isClosable?: boolean;
  previousState?: {
    position: { x: number; y: number };
    size: { width: number | string; height: number | string };
  };
}

interface WindowState {
  windows: WindowInstance[];
  nextZIndex: number;
  isStartMenuOpen: boolean;
  openApp: (appId: string, data?: Record<string, unknown>) => void;
  closeApp: (id: string) => void;
  focusApp: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  updateWindow: (id: string, updates: Partial<Omit<WindowInstance, 'id'>>) => void;
  setStartMenuOpen: (isOpen: boolean) => void;
  cascadeWindows: () => void;
  tileWindowsHorizontal: () => void;
  tileWindowsVertical: () => void;
  arrangeWindows: (type: 'cascade' | 'tile-horizontal' | 'tile-vertical') => void;
  toggleAlwaysOnTop: (id: string) => void;
  setWindowTransparency: (id: string, transparency: number) => void;
  restoreWindow: (id: string) => void;
  saveWindowState: (id: string) => void;
}

const useWindowStore = create<WindowState>()(
  subscribeWithSelector((set, get) => ({
    windows: [],
    nextZIndex: 10,
    isStartMenuOpen: false,
    setStartMenuOpen: (isOpen: boolean) => set({ isStartMenuOpen: isOpen }),
    openApp: (appId: string, data?: Record<string, unknown>) => {
        const appConfig = apps.find((app) => app.id === appId);
        if (!appConfig) return;

        const { windows, nextZIndex } = get();
        
        // If opening with data, always create a new window
        // If not, and a window for that app exists, focus it.
        if (!data) {
            const existingInstance = windows.find((w) => w.app.id === appId);
            if (existingInstance) {
                get().focusApp(existingInstance.id);
                if (existingInstance.isMinimized) {
                    get().toggleMinimize(existingInstance.id);
                }
                return;
            }
        }
        
        const newWindow: WindowInstance = {
            id: `${appId}-${Date.now()}`,
            app: appConfig,
            zIndex: nextZIndex,
            isMinimized: false,
            isMaximized: false,
            position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
            size: appConfig.defaultSize || { width: 640, height: 480 },
            isAlwaysOnTop: false,
            transparency: 1.0,
            isResizable: true,
            isMovable: true,
            isMinimizable: true,
            isMaximizable: true,
            isClosable: true,
            ...(data && { data }),
        };

        set({ windows: [...windows, newWindow], nextZIndex: nextZIndex + 1 });
    },
    closeApp: (id: string) => {
        set((state) => ({
        windows: state.windows.filter((w) => w.id !== id),
        }));
    },
    focusApp: (id: string) => {
        if (get().isStartMenuOpen) set({ isStartMenuOpen: false });
        const { nextZIndex } = get();
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, zIndex: nextZIndex } : w
        ),
        nextZIndex: nextZIndex + 1,
        }));
    },
    toggleMinimize: (id: string) => {
        const { windows, nextZIndex } = get();
        const window = windows.find(w => w.id === id);
        if (!window) return;

        const isNowMinimized = !window.isMinimized;

        set({
        windows: windows.map((w) =>
            w.id === id
            ? { ...w, isMinimized: isNowMinimized, zIndex: isNowMinimized ? w.zIndex : nextZIndex }
            : w
        ),
        nextZIndex: isNowMinimized ? nextZIndex : nextZIndex + 1,
        });
    },
    toggleMaximize: (id: string) => {
        const { nextZIndex } = get();
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: nextZIndex } : w
        ),
        nextZIndex: nextZIndex + 1,
        }));
    },
        updateWindow: (id: string, updates: Partial<WindowInstance>) => {
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, ...updates } : w
        ),
        }));
    },
    cascadeWindows: () => {
        const { windows, nextZIndex } = get();
        const visibleWindows = windows.filter(w => !w.isMinimized && !w.isMaximized);
        const cascadeOffset = 30;
        
        set({
        windows: windows.map((w, index) => {
            if (w.isMinimized || w.isMaximized) return w;
            
            return {
            ...w,
            position: {
                x: 50 + (index * cascadeOffset),
                y: 50 + (index * cascadeOffset),
            },
            zIndex: nextZIndex + index,
            };
        }),
        nextZIndex: nextZIndex + visibleWindows.length,
        });
    },
    tileWindowsHorizontal: () => {
        const { windows, nextZIndex } = get();
        const visibleWindows = windows.filter(w => !w.isMinimized && !w.isMaximized);
        if (visibleWindows.length === 0) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const windowWidth = viewportWidth / visibleWindows.length;
        const windowHeight = viewportHeight - 100; // Account for taskbar
        
        set({
        windows: windows.map((w, index) => {
            if (w.isMinimized || w.isMaximized) return w;
            
            return {
            ...w,
            position: {
                x: index * windowWidth,
                y: 50,
            },
            size: {
                width: windowWidth,
                height: windowHeight,
            },
            zIndex: nextZIndex + index,
            };
        }),
        nextZIndex: nextZIndex + visibleWindows.length,
        });
    },
    tileWindowsVertical: () => {
        const { windows, nextZIndex } = get();
        const visibleWindows = windows.filter(w => !w.isMinimized && !w.isMaximized);
        if (visibleWindows.length === 0) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const windowHeight = (viewportHeight - 100) / visibleWindows.length; // Account for taskbar
        const windowWidth = viewportWidth;
        
        set({
        windows: windows.map((w, index) => {
            if (w.isMinimized || w.isMaximized) return w;
            
            return {
            ...w,
            position: {
                x: 0,
                y: 50 + (index * windowHeight),
            },
            size: {
                width: windowWidth,
                height: windowHeight,
            },
            zIndex: nextZIndex + index,
            };
        }),
        nextZIndex: nextZIndex + visibleWindows.length,
        });
    },
    arrangeWindows: (type: 'cascade' | 'tile-horizontal' | 'tile-vertical') => {
        const { cascadeWindows, tileWindowsHorizontal, tileWindowsVertical } = get();
        
        switch (type) {
        case 'cascade':
            cascadeWindows();
            break;
        case 'tile-horizontal':
            tileWindowsHorizontal();
            break;
        case 'tile-vertical':
            tileWindowsVertical();
            break;
        }
    },
    toggleAlwaysOnTop: (id: string) => {
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, isAlwaysOnTop: !w.isAlwaysOnTop } : w
        ),
        }));
    },
    setWindowTransparency: (id: string, transparency: number) => {
        set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, transparency: Math.max(0.1, Math.min(1.0, transparency)) } : w
        ),
        }));
    },
    restoreWindow: (id: string) => {
        set((state) => ({
        windows: state.windows.map((w) => {
            if (w.id === id && w.previousState) {
            return {
                ...w,
                position: w.previousState.position,
                size: w.previousState.size,
                isMinimized: false,
                isMaximized: false,
            };
            }
            return w;
        }),
        }));
    },
    saveWindowState: (id: string) => {
        set((state) => ({
        windows: state.windows.map((w) => {
            if (w.id === id) {
            return {
                ...w,
                previousState: {
                position: { ...w.position },
                size: { ...w.size },
                },
            };
            }
            return w;
        }),
        }));
    },
  }))
);

// Open Welcome app on initial load, but only on client
if (typeof window !== 'undefined' && useWindowStore.getState().windows.length === 0) {
    useWindowStore.getState().openApp('welcome');
}


export { useWindowStore };

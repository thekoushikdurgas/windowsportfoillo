import { create } from 'zustand';
import { WindowState, WindowManagerState } from '@/types/window';
import { generateId } from '@/utils/helpers';
import { WINDOW_CONSTANTS } from '@/utils/constants';

interface WindowStore extends WindowManagerState {
  openWindow: (props: {
    title: string;
    appId: string;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
  }) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, position: { x: number; y: number }) => void;
  resizeWindow: (id: string, size: { width: number; height: number }) => void;
  bringToFront: (id: string) => void;
  setCrop: (id: string, crop: { x: number; y: number; width: number; height: number } | null) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 1,

  openWindow: (props) => {
    const { windows, nextZIndex } = get();
    const newWindow: WindowState = {
      id: generateId(),
      title: props.title,
      appId: props.appId,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      position: props.initialPosition || { x: 100, y: 100 },
      size: props.initialSize || { 
        width: WINDOW_CONSTANTS.DEFAULT_WIDTH, 
        height: WINDOW_CONSTANTS.DEFAULT_HEIGHT 
      },
      zIndex: nextZIndex,
      crop: null,
    };

    // Unfocus other windows
    const updatedWindows = windows.map(window => ({
      ...window,
      isFocused: false,
    }));

    set({
      windows: [...updatedWindows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1,
    });
  },

  closeWindow: (id) => {
    const { windows, activeWindowId } = get();
    const updatedWindows = windows.filter(window => window.id !== id);
    
    set({
      windows: updatedWindows,
      activeWindowId: activeWindowId === id ? null : activeWindowId,
    });
  },

  minimizeWindow: (id) => {
    const { windows } = get();
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, isMinimized: true, isFocused: false } : window
    );

    set({
      windows: updatedWindows,
      activeWindowId: null,
    });
  },

  maximizeWindow: (id) => {
    const { windows } = get();
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, isMaximized: !window.isMaximized } : window
    );

    set({ windows: updatedWindows });
  },

  focusWindow: (id) => {
    const { windows, nextZIndex } = get();
    const updatedWindows = windows.map(window => ({
      ...window,
      isFocused: window.id === id,
      zIndex: window.id === id ? nextZIndex : window.zIndex,
    }));

    set({
      windows: updatedWindows,
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    });
  },

  moveWindow: (id, position) => {
    const { windows } = get();
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, position } : window
    );

    set({ windows: updatedWindows });
  },

  resizeWindow: (id, size) => {
    const { windows } = get();
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, size } : window
    );

    set({ windows: updatedWindows });
  },

  setCrop: (id, crop) => {
    const { windows } = get();
    const updatedWindows = windows.map(window =>
      window.id === id ? { ...window, crop } : window
    );

    set({ windows: updatedWindows });
  },

  bringToFront: (id) => {
    const { windows, nextZIndex } = get();
    const updatedWindows = windows.map(window => ({
      ...window,
      zIndex: window.id === id ? nextZIndex : window.zIndex,
    }));

    set({
      windows: updatedWindows,
      nextZIndex: nextZIndex + 1,
    });
  },
}));

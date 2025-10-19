import { create } from 'zustand'
import { WindowState, WindowAction } from '@/types/window'

interface WindowStoreState {
  windows: Record<string, WindowState>
  focusedWindow: string | null
  nextZIndex: number
  actions: {
    openWindow: (window: WindowState) => void
    closeWindow: (id: string) => void
    minimizeWindow: (id: string) => void
    maximizeWindow: (id: string) => void
    restoreWindow: (id: string) => void
    focusWindow: (id: string) => void
    updateWindowPosition: (id: string, position: { x: number; y: number }) => void
    updateWindowSize: (id: string, size: { width: number; height: number }) => void
    setWindowDragging: (id: string, isDragging: boolean) => void
    setWindowResizing: (id: string, isResizing: boolean) => void
    bringToFront: (id: string) => void
    moveWindowToDesktop: (windowId: string, desktopId: string) => void
  }
}

export const useWindowStore = create<WindowStoreState>((set, get) => ({
  windows: {},
  focusedWindow: null,
  nextZIndex: 1,

  actions: {
    openWindow: (window) => {
      const newWindow = {
        ...window,
        zIndex: get().nextZIndex,
        isFocused: true,
      }
      
      set((state) => ({
        windows: {
          ...state.windows,
          [window.id]: newWindow,
        },
        focusedWindow: window.id,
        nextZIndex: state.nextZIndex + 1,
      }))
    },

    closeWindow: (id) => {
      set((state) => {
        const { [id]: removed, ...windows } = state.windows
        const newFocusedWindow = state.focusedWindow === id ? null : state.focusedWindow
        
        return {
          windows,
          focusedWindow: newFocusedWindow,
        }
      })
    },

    minimizeWindow: (id) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMinimized: true,
            isFocused: false,
          },
        },
        focusedWindow: state.focusedWindow === id ? null : state.focusedWindow,
      }))
    },

    maximizeWindow: (id) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMaximized: true,
          },
        },
      }))
    },

    restoreWindow: (id) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
          },
        },
        focusedWindow: id,
      }))
    },

    focusWindow: (id) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isFocused: true,
            zIndex: state.nextZIndex,
          },
        },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      }))
    },

    updateWindowPosition: (id, position) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            position,
          },
        },
      }))
    },

    updateWindowSize: (id, size) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            size,
          },
        },
      }))
    },

    setWindowDragging: (id, isDragging) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isDragging,
          },
        },
      }))
    },

    setWindowResizing: (id, isResizing) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isResizing,
          },
        },
      }))
    },

    bringToFront: (id) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            zIndex: state.nextZIndex,
            isFocused: true,
          },
        },
        focusedWindow: id,
        nextZIndex: state.nextZIndex + 1,
      }))
    },

    moveWindowToDesktop: (windowId, desktopId) => {
      set((state) => ({
        windows: {
          ...state.windows,
          [windowId]: {
            ...state.windows[windowId],
            desktopId,
          },
        },
      }))
    },
  },
}))

export const useWindows = () => useWindowStore((state) => state.windows)
export const useFocusedWindow = () => useWindowStore((state) => state.focusedWindow)
export const useWindowActions = () => useWindowStore((state) => state.actions)

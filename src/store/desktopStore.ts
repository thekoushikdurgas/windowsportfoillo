import { create } from 'zustand'
import { DesktopState, DesktopIcon, DesktopSettings, VirtualDesktop } from '@/types/desktop'

interface DesktopStoreState extends DesktopState {
  settings: DesktopSettings
  actions: {
    setWallpaper: (wallpaper: string) => void
    setTheme: (theme: 'light' | 'dark') => void
    toggleStartMenu: () => void
    closeStartMenu: () => void
    toggleSystemTray: () => void
    closeSystemTray: () => void
    setFocusedWindow: (windowId: string | null) => void
    addDesktopIcon: (icon: DesktopIcon) => void
    removeDesktopIcon: (id: string) => void
    updateDesktopIconPosition: (id: string, position: { x: number; y: number }) => void
    selectDesktopIcon: (id: string) => void
    deselectAllDesktopIcons: () => void
    setTaskbarPosition: (position: 'bottom' | 'top' | 'left' | 'right') => void
    updateSettings: (settings: Partial<DesktopSettings>) => void
    createDesktop: (id: string, name: string) => void
    deleteDesktop: (id: string) => void
    renameDesktop: (id: string, name: string) => void
    switchDesktop: (id: string) => void
    setScreenSize: (size: { width: number; height: number }) => void
  }
}

const defaultSettings: DesktopSettings = {
  wallpaper: '/wallpapers/windows-11-default.svg',
  theme: 'dark',
  taskbarPosition: 'bottom',
  showDesktopIcons: true,
  showTaskbar: true,
  showSystemTray: true,
  autoHideTaskbar: false,
  showClock: true,
  showDate: true,
  showSeconds: false,
  timeFormat: '12h',
  dateFormat: 'MM/DD/YYYY',
}

export const useDesktopStore = create<DesktopStoreState>((set, get) => ({
  wallpaper: defaultSettings.wallpaper,
  theme: defaultSettings.theme,
  desktopIcons: [],
  openWindows: [],
  focusedWindow: null,
  startMenuOpen: false,
  systemTrayExpanded: false,
  taskbarPosition: defaultSettings.taskbarPosition,
  showDesktopIcons: defaultSettings.showDesktopIcons,
  showTaskbar: defaultSettings.showTaskbar,
  showSystemTray: defaultSettings.showSystemTray,
  currentDesktop: 'desktop-1',
  desktops: {
    'desktop-1': {
      id: 'desktop-1',
      name: 'Desktop 1',
      wallpaper: defaultSettings.wallpaper,
      isActive: true,
      windowCount: 0,
      createdAt: new Date()
    }
  },
  screenSize: { width: 1920, height: 1080 },
  settings: defaultSettings,

  actions: {
    setWallpaper: (wallpaper) => {
      set({ wallpaper })
    },

    setTheme: (theme) => {
      set({ theme })
      // Update document class for theme switching
      if (typeof window !== 'undefined') {
        document.documentElement.className = theme
      }
    },

    toggleStartMenu: () => {
      set((state) => ({
        startMenuOpen: !state.startMenuOpen,
        systemTrayExpanded: false, // Close system tray when opening start menu
      }))
    },

    closeStartMenu: () => {
      set({ startMenuOpen: false })
    },

    toggleSystemTray: () => {
      set((state) => ({
        systemTrayExpanded: !state.systemTrayExpanded,
        startMenuOpen: false, // Close start menu when opening system tray
      }))
    },

    closeSystemTray: () => {
      set({ systemTrayExpanded: false })
    },

    setFocusedWindow: (windowId) => {
      set({ focusedWindow: windowId })
    },

    addDesktopIcon: (icon) => {
      set((state) => ({
        desktopIcons: [...state.desktopIcons, icon],
      }))
    },

    removeDesktopIcon: (id) => {
      set((state) => ({
        desktopIcons: state.desktopIcons.filter((icon) => icon.id !== id),
      }))
    },

    updateDesktopIconPosition: (id, position) => {
      set((state) => ({
        desktopIcons: state.desktopIcons.map((icon) =>
          icon.id === id ? { ...icon, position } : icon
        ),
      }))
    },

    selectDesktopIcon: (id) => {
      set((state) => ({
        desktopIcons: state.desktopIcons.map((icon) =>
          icon.id === id ? { ...icon, isSelected: true } : { ...icon, isSelected: false }
        ),
      }))
    },

    deselectAllDesktopIcons: () => {
      set((state) => ({
        desktopIcons: state.desktopIcons.map((icon) => ({
          ...icon,
          isSelected: false,
        })),
      }))
    },

    setTaskbarPosition: (position) => {
      set({ taskbarPosition: position })
    },

    updateSettings: (newSettings) => {
      set((state) => ({
        settings: { ...state.settings, ...newSettings },
        wallpaper: newSettings.wallpaper || state.wallpaper,
        theme: newSettings.theme || state.theme,
        taskbarPosition: newSettings.taskbarPosition || state.taskbarPosition,
        showDesktopIcons: newSettings.showDesktopIcons ?? state.showDesktopIcons,
        showTaskbar: newSettings.showTaskbar ?? state.showTaskbar,
        showSystemTray: newSettings.showSystemTray ?? state.showSystemTray,
      }))
    },

    createDesktop: (id, name) => {
      set((state) => {
        const newDesktop: VirtualDesktop = {
          id,
          name,
          wallpaper: state.wallpaper,
          isActive: false,
          windowCount: 0,
          createdAt: new Date()
        }
        
        return {
          desktops: {
            ...state.desktops,
            [id]: newDesktop
          }
        }
      })
    },

    deleteDesktop: (id) => {
      set((state) => {
        if (state.currentDesktop === id) {
          // Switch to first available desktop
          const remainingDesktops = Object.keys(state.desktops).filter(desktopId => desktopId !== id)
          if (remainingDesktops.length > 0) {
            return {
              currentDesktop: remainingDesktops[0],
              desktops: Object.fromEntries(
                Object.entries(state.desktops).filter(([desktopId]) => desktopId !== id)
              )
            }
          }
        }
        
        return {
          desktops: Object.fromEntries(
            Object.entries(state.desktops).filter(([desktopId]) => desktopId !== id)
          )
        }
      })
    },

    renameDesktop: (id, name) => {
      set((state) => ({
        desktops: {
          ...state.desktops,
          [id]: {
            ...state.desktops[id],
            name
          }
        }
      }))
    },

    switchDesktop: (id) => {
      set((state) => ({
        currentDesktop: id,
        desktops: Object.fromEntries(
          Object.entries(state.desktops).map(([desktopId, desktop]) => [
            desktopId,
            { ...desktop, isActive: desktopId === id }
          ])
        )
      }))
    },

    setScreenSize: (size) => {
      set({ screenSize: size })
    },
  },
}))

export const useDesktopState = () => useDesktopStore((state) => ({
  wallpaper: state.wallpaper,
  theme: state.theme,
  desktopIcons: state.desktopIcons,
  startMenuOpen: state.startMenuOpen,
  systemTrayExpanded: state.systemTrayExpanded,
  taskbarPosition: state.taskbarPosition,
  showDesktopIcons: state.showDesktopIcons,
  showTaskbar: state.showTaskbar,
  showSystemTray: state.showSystemTray,
  currentDesktop: state.currentDesktop,
  desktops: state.desktops,
  screenSize: state.screenSize,
}))

export const useDesktopActions = () => useDesktopStore((state) => state.actions)
export const useDesktopSettings = () => useDesktopStore((state) => state.settings)

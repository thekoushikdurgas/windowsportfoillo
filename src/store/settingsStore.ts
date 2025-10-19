import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NotificationSettings } from '@/types/notifications'
import { KeyboardShortcutConfig } from '@/types/keyboard'

export interface SystemSettings {
  // Appearance
  theme: 'light' | 'dark' | 'auto'
  accentColor: string
  wallpaper: string
  wallpaperFit: 'fill' | 'fit' | 'stretch' | 'center' | 'tile'
  
  // Desktop
  showDesktopIcons: boolean
  iconSize: 'small' | 'medium' | 'large'
  desktopIconSpacing: number
  autoArrangeIcons: boolean
  
  // Taskbar
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right'
  taskbarSize: 'small' | 'medium' | 'large'
  autoHideTaskbar: boolean
  showTaskbarLabels: boolean
  showSystemTray: boolean
  showClock: boolean
  showDate: boolean
  timeFormat: '12h' | '24h'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  
  // Windows
  windowAnimations: boolean
  windowShadows: boolean
  windowTransparency: boolean
  snapToGrid: boolean
  snapThreshold: number
  windowBorders: boolean
  
  // Start Menu
  startMenuStyle: 'classic' | 'modern'
  showRecentApps: boolean
  showFrequentApps: boolean
  showRecommended: boolean
  startMenuSize: 'small' | 'medium' | 'large'
  
  // Accessibility
  highContrast: boolean
  reduceMotion: boolean
  screenReader: boolean
  fontSize: 'small' | 'medium' | 'large'
  cursorSize: 'small' | 'medium' | 'large'
  
  // Privacy
  collectUsageData: boolean
  showPersonalizedAds: boolean
  locationServices: boolean
  cameraAccess: boolean
  microphoneAccess: boolean
  
  // Performance
  hardwareAcceleration: boolean
  backgroundApps: boolean
  visualEffects: 'best-appearance' | 'best-performance' | 'custom'
  memoryUsage: 'low' | 'medium' | 'high'
  
  // Notifications
  notifications: NotificationSettings
  
  // Keyboard
  keyboard: KeyboardShortcutConfig
}

const defaultSettings: SystemSettings = {
  // Appearance
  theme: 'dark',
  accentColor: '#0078d4',
  wallpaper: '/wallpapers/windows-11-default.svg',
  wallpaperFit: 'fill',
  
  // Desktop
  showDesktopIcons: true,
  iconSize: 'medium',
  desktopIconSpacing: 4,
  autoArrangeIcons: false,
  
  // Taskbar
  taskbarPosition: 'bottom',
  taskbarSize: 'medium',
  autoHideTaskbar: false,
  showTaskbarLabels: true,
  showSystemTray: true,
  showClock: true,
  showDate: true,
  timeFormat: '12h',
  dateFormat: 'MM/DD/YYYY',
  
  // Windows
  windowAnimations: true,
  windowShadows: true,
  windowTransparency: true,
  snapToGrid: true,
  snapThreshold: 10,
  windowBorders: true,
  
  // Start Menu
  startMenuStyle: 'modern',
  showRecentApps: true,
  showFrequentApps: true,
  showRecommended: true,
  startMenuSize: 'medium',
  
  // Accessibility
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
  fontSize: 'medium',
  cursorSize: 'medium',
  
  // Privacy
  collectUsageData: false,
  showPersonalizedAds: false,
  locationServices: false,
  cameraAccess: false,
  microphoneAccess: false,
  
  // Performance
  hardwareAcceleration: true,
  backgroundApps: true,
  visualEffects: 'best-appearance',
  memoryUsage: 'medium',
  
  // Notifications
  notifications: {
    enabled: true,
    showInSystemTray: true,
    showBanners: true,
    showSounds: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    doNotDisturb: false,
    maxNotifications: 50,
    autoDismissDelay: 5000,
  },
  
  // Keyboard
  keyboard: {
    shortcuts: [],
    enableGlobalShortcuts: true,
    enableContextualShortcuts: true,
    showShortcutHints: true,
  },
}

interface SettingsStoreState {
  settings: SystemSettings
  isOpen: boolean
  currentCategory: string
  actions: {
    updateSetting: <K extends keyof SystemSettings>(
      key: K,
      value: SystemSettings[K]
    ) => void
    updateSettings: (updates: Partial<SystemSettings>) => void
    resetSettings: () => void
    resetCategory: (category: keyof SystemSettings) => void
    openSettings: (category?: string) => void
    closeSettings: () => void
    setCurrentCategory: (category: string) => void
    exportSettings: () => string
    importSettings: (settingsJson: string) => boolean
  }
}

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isOpen: false,
      currentCategory: 'appearance',
      
      actions: {
        updateSetting: (key, value) => {
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: value,
            },
          }))
        },
        
        updateSettings: (updates) => {
          set((state) => ({
            settings: {
              ...state.settings,
              ...updates,
            },
          }))
        },
        
        resetSettings: () => {
          set({ settings: defaultSettings })
        },
        
        resetCategory: (category) => {
          set((state) => ({
            settings: {
              ...state.settings,
              [category]: defaultSettings[category],
            },
          }))
        },
        
        openSettings: (category) => {
          set({ 
            isOpen: true,
            currentCategory: category || 'appearance'
          })
        },
        
        closeSettings: () => {
          set({ isOpen: false })
        },
        
        setCurrentCategory: (category) => {
          set({ currentCategory: category })
        },
        
        exportSettings: () => {
          const { settings } = get()
          return JSON.stringify(settings, null, 2)
        },
        
        importSettings: (settingsJson) => {
          try {
            const importedSettings = JSON.parse(settingsJson)
            set({ settings: { ...defaultSettings, ...importedSettings } })
            return true
          } catch (error) {
            console.error('Failed to import settings:', error)
            return false
          }
        },
      },
    }),
    {
      name: 'durgas-os-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)

export const useSettings = () => useSettingsStore((state) => state.settings)
export const useSettingsActions = () => useSettingsStore((state) => state.actions)
export const useSettingsUI = () => useSettingsStore((state) => ({
  isOpen: state.isOpen,
  currentCategory: state.currentCategory,
}))

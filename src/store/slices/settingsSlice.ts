import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, WallpaperConfig } from '@/types/settings';

const initialState: SettingsState = {
  theme: 'light',
  accent: 'blue',
  wallpaper: {
    id: 'default',
    name: 'Default',
    url: '/wallpapers/wallpaper (1).jpg',
    category: 'minimal'
  },
  audio: {
    enabled: true,
    volume: 0.5,
    systemSounds: true,
    notificationSounds: true,
    mediaSounds: true
  },
  display: {
    resolution: {
      width: 1920,
      height: 1080
    },
    scale: 1,
    refreshRate: 60,
    brightness: 100,
    contrast: 100,
    nightMode: false,
    nightModeStart: '22:00',
    nightModeEnd: '06:00'
  },
  privacy: {
    analytics: false,
    crashReporting: false,
    telemetry: false,
    locationServices: false,
    cameraAccess: false,
    microphoneAccess: false
  },
  performance: {
    animations: true,
    transparency: true,
    blurEffects: true,
    hardwareAcceleration: true,
    memoryLimit: 1024,
    cacheSize: 256
  },
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  autoUpdates: true,
  developerMode: false,
  showFileExplorer: true,
  showBrowser: true,
  showNotepad: true,
  showTerminal: true,
  showVideoPlayer: true,
  showCreatorStudio: true,
  showGeminiChat: true,
  showLiveAssistant: true,
  showAppStore: true,
  showSettings: true,
  showAboutMe: true,
  showPortfolio: true,
  showWelcome: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: (state, action: PayloadAction<{ key: keyof SettingsState; value: unknown }>) => {
      const { key, value } = action.payload;
      (state as Record<string, unknown>)[key] = value;
    },
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.assign(state, action.payload);
    },
    resetSettings: () => initialState,
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setWallpaper: (state, action: PayloadAction<WallpaperConfig>) => {
      state.wallpaper = action.payload;
    },
    toggleSound: (state) => {
      state.audio.enabled = !state.audio.enabled;
    },
    toggleAnimations: () => {
      // Animations are not in the new interface, so we'll skip this for now
    },
    toggleAutoSave: () => {
      // AutoSave is not in the new interface, so we'll skip this for now
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setFontSize: () => {
      // FontSize is not in the new interface, so we'll skip this for now
    },
  },
});

export const {
  updateSetting,
  updateSettings,
  resetSettings,
  setTheme,
  setWallpaper,
  toggleSound,
  toggleAnimations,
  toggleAutoSave,
  setLanguage,
  setFontSize,
} = settingsSlice.actions;

export type Theme = 'light' | 'dark' | 'system';
export type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'yellow' | 'pink' | 'indigo';

export interface WallpaperConfig {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  category: 'nature' | 'abstract' | 'space' | 'minimal' | 'gradient';
}

export interface AudioConfig {
  enabled: boolean;
  volume: number;
  systemSounds: boolean;
  notificationSounds: boolean;
  mediaSounds: boolean;
}

export interface DisplayConfig {
  resolution: {
    width: number;
    height: number;
  };
  scale: number;
  refreshRate: number;
  brightness: number;
  contrast: number;
  nightMode: boolean;
  nightModeStart: string;
  nightModeEnd: string;
}

export interface PrivacyConfig {
  analytics: boolean;
  crashReporting: boolean;
  telemetry: boolean;
  locationServices: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
}

export interface PerformanceConfig {
  animations: boolean;
  transparency: boolean;
  blurEffects: boolean;
  hardwareAcceleration: boolean;
  memoryLimit: number;
  cacheSize: number;
}

export interface SettingsState {
  theme: Theme;
  accent: AccentColor;
  wallpaper: WallpaperConfig;
  audio: AudioConfig;
  display: DisplayConfig;
  privacy: PrivacyConfig;
  performance: PerformanceConfig;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  autoUpdates: boolean;
  developerMode: boolean;
  showFileExplorer: boolean;
  showBrowser: boolean;
  showNotepad: boolean;
  showTerminal: boolean;
  showVideoPlayer: boolean;
  showCreatorStudio: boolean;
  showGeminiChat: boolean;
  showLiveAssistant: boolean;
  showAppStore: boolean;
  showSettings: boolean;
  showAboutMe: boolean;
  showPortfolio: boolean;
  showWelcome: boolean;
}

export interface SettingsActions {
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentColor) => void;
  setWallpaper: (wallpaper: WallpaperConfig) => void;
  updateAudio: (audio: Partial<AudioConfig>) => void;
  updateDisplay: (display: Partial<DisplayConfig>) => void;
  updatePrivacy: (privacy: Partial<PrivacyConfig>) => void;
  updatePerformance: (performance: Partial<PerformanceConfig>) => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
  setDateFormat: (format: string) => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setAutoUpdates: (enabled: boolean) => void;
  setDeveloperMode: (enabled: boolean) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => boolean;
}

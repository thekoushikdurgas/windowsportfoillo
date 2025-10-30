import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'auto';
export type AccentColor = 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'yellow' | 'indigo';
export type FontFamily = 'system' | 'inter' | 'roboto' | 'open-sans' | 'lato' | 'poppins' | 'mono';
export type Density = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type TimeFormat = '12h' | '24h';

export interface WallpaperConfig {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  imageHint?: string;
  category: 'nature' | 'abstract' | 'space' | 'minimal' | 'gradient';
}

export interface AppearanceSettings {
  theme: Theme;
  accentColor: AccentColor;
  wallpaper: string;
  fontFamily: FontFamily;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  density: Density;
  animations: boolean;
  transitions: boolean;
  transparency: boolean;
  blurEffects: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
  systemSounds: boolean;
  notificationSounds: boolean;
  mediaSounds: boolean;
  soundTheme: string;
  doNotDisturb: boolean;
  quietHours: { start: string; end: string };
}

export interface PrivacySettings {
  analytics: boolean;
  crashReporting: boolean;
  telemetry: boolean;
  locationServices: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
  dataCollection: boolean;
  personalizedAds: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  magnification: number;
  reducedMotion: boolean;
  largeText: boolean;
  colorBlindSupport: boolean;
}

export interface PerformanceSettings {
  animations: boolean;
  transparency: boolean;
  blurEffects: boolean;
  hardwareAcceleration: boolean;
  memoryLimit: number;
  cacheSize: number;
  backgroundRefresh: boolean;
  autoOptimization: boolean;
}

export interface NetworkSettings {
  proxyEnabled: boolean;
  proxyHost: string;
  proxyPort: number;
  proxyAuth: boolean;
  proxyUsername: string;
  proxyPassword: string;
  bandwidthLimit: number;
  dataSaver: boolean;
  offlineMode: boolean;
}

export interface AccountSettings {
  profileName: string;
  profilePicture: string;
  email: string;
  syncEnabled: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  autoLogout: boolean;
  dataBackup: boolean;
}

export interface SystemSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: TimeFormat;
  autoUpdates: boolean;
  developerMode: boolean;
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

export interface SettingsState {
  appearance: AppearanceSettings;
  sound: SoundSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  performance: PerformanceSettings;
  network: NetworkSettings;
  account: AccountSettings;
  system: SystemSettings;
  
  // Legacy properties for backward compatibility
  theme: Theme;
  accent: AccentColor;
  wallpaper: string;
}

export interface SettingsActions {
  // Appearance
  setTheme: (theme: Theme) => void;
  setAccentColor: (accent: AccentColor) => void;
  setWallpaper: (wallpaperId: string) => void;
  updateAppearance: (appearance: Partial<AppearanceSettings>) => void;
  
  // Sound
  updateSound: (sound: Partial<SoundSettings>) => void;
  
  // Privacy
  updatePrivacy: (privacy: Partial<PrivacySettings>) => void;
  
  // Accessibility
  updateAccessibility: (accessibility: Partial<AccessibilitySettings>) => void;
  
  // Performance
  updatePerformance: (performance: Partial<PerformanceSettings>) => void;
  
  // Network
  updateNetwork: (network: Partial<NetworkSettings>) => void;
  
  // Account
  updateAccount: (account: Partial<AccountSettings>) => void;
  
  // System
  updateSystem: (system: Partial<SystemSettings>) => void;
  
  // Utility
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => boolean;
  
  // Legacy methods for backward compatibility
  setAccent: (accent: AccentColor) => void;
}

const defaultAppearance: AppearanceSettings = {
  theme: 'dark',
  accentColor: 'blue',
  wallpaper: 'wallpaper-1',
  fontFamily: 'system',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.5,
  density: 'normal',
  animations: true,
  transitions: true,
  transparency: true,
  blurEffects: true,
};

const defaultSound: SoundSettings = {
  enabled: true,
  volume: 70,
  systemSounds: true,
  notificationSounds: true,
  mediaSounds: true,
  soundTheme: 'default',
  doNotDisturb: false,
  quietHours: { start: '22:00', end: '08:00' },
};

const defaultPrivacy: PrivacySettings = {
  analytics: false,
  crashReporting: true,
  telemetry: false,
  locationServices: false,
  cameraAccess: false,
  microphoneAccess: false,
  dataCollection: false,
  personalizedAds: false,
};

const defaultAccessibility: AccessibilitySettings = {
  highContrast: false,
  screenReader: false,
  keyboardNavigation: true,
  voiceControl: false,
  magnification: 100,
  reducedMotion: false,
  largeText: false,
  colorBlindSupport: false,
};

const defaultPerformance: PerformanceSettings = {
  animations: true,
  transparency: true,
  blurEffects: true,
  hardwareAcceleration: true,
  memoryLimit: 1024,
  cacheSize: 256,
  backgroundRefresh: true,
  autoOptimization: true,
};

const defaultNetwork: NetworkSettings = {
  proxyEnabled: false,
  proxyHost: '',
  proxyPort: 8080,
  proxyAuth: false,
  proxyUsername: '',
  proxyPassword: '',
  bandwidthLimit: 0,
  dataSaver: false,
  offlineMode: false,
};

const defaultAccount: AccountSettings = {
  profileName: 'User',
  profilePicture: '',
  email: '',
  syncEnabled: false,
  twoFactorAuth: false,
  sessionTimeout: 30,
  autoLogout: false,
  dataBackup: false,
};

const defaultSystem: SystemSettings = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  autoUpdates: true,
  developerMode: false,
  debugMode: false,
  logLevel: 'warn',
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      // State
      appearance: defaultAppearance,
      sound: defaultSound,
      privacy: defaultPrivacy,
      accessibility: defaultAccessibility,
      performance: defaultPerformance,
      network: defaultNetwork,
      account: defaultAccount,
      system: defaultSystem,
      
      // Legacy properties
      theme: 'dark',
      accent: 'blue',
      wallpaper: 'wallpaper-1',
      
      // Actions
      setTheme: (theme) => set((state) => ({
        theme,
        appearance: { ...state.appearance, theme }
      })),
      
      setAccentColor: (accentColor) => set((state) => ({
        accent: accentColor,
        appearance: { ...state.appearance, accentColor }
      })),
      
      setWallpaper: (wallpaper) => set((state) => ({
        wallpaper,
        appearance: { ...state.appearance, wallpaper }
      })),
      
      updateAppearance: (appearance) => set((state) => ({
        appearance: { ...state.appearance, ...appearance }
      })),
      
      updateSound: (sound) => set((state) => ({
        sound: { ...state.sound, ...sound }
      })),
      
      updatePrivacy: (privacy) => set((state) => ({
        privacy: { ...state.privacy, ...privacy }
      })),
      
      updateAccessibility: (accessibility) => set((state) => ({
        accessibility: { ...state.accessibility, ...accessibility }
      })),
      
      updatePerformance: (performance) => set((state) => ({
        performance: { ...state.performance, ...performance }
      })),
      
      updateNetwork: (network) => set((state) => ({
        network: { ...state.network, ...network }
      })),
      
      updateAccount: (account) => set((state) => ({
        account: { ...state.account, ...account }
      })),
      
      updateSystem: (system) => set((state) => ({
        system: { ...state.system, ...system }
      })),
      
      resetSettings: () => set({
        appearance: defaultAppearance,
        sound: defaultSound,
        privacy: defaultPrivacy,
        accessibility: defaultAccessibility,
        performance: defaultPerformance,
        network: defaultNetwork,
        account: defaultAccount,
        system: defaultSystem,
        theme: 'dark',
        accent: 'blue',
        wallpaper: 'wallpaper-1',
      }),
      
      exportSettings: () => {
        const state = get();
        return JSON.stringify({
          appearance: state.appearance,
          sound: state.sound,
          privacy: state.privacy,
          accessibility: state.accessibility,
          performance: state.performance,
          network: state.network,
          account: state.account,
          system: state.system,
        }, null, 2);
      },
      
      importSettings: (settingsString) => {
        try {
          const settings = JSON.parse(settingsString);
          set(() => ({
            appearance: { ...defaultAppearance, ...settings.appearance },
            sound: { ...defaultSound, ...settings.sound },
            privacy: { ...defaultPrivacy, ...settings.privacy },
            accessibility: { ...defaultAccessibility, ...settings.accessibility },
            performance: { ...defaultPerformance, ...settings.performance },
            network: { ...defaultNetwork, ...settings.network },
            account: { ...defaultAccount, ...settings.account },
            system: { ...defaultSystem, ...settings.system },
          }));
          return true;
        } catch (error) {
          // Silently fail for better UX
          return false;
        }
      },
      
      // Legacy methods
      setAccent: (accent) => set((state) => ({
        accent,
        appearance: { ...state.appearance, accentColor: accent }
      })),
    }),
    {
      name: 'durgasos-settings',
      partialize: (state) => ({
        appearance: state.appearance,
        sound: state.sound,
        privacy: state.privacy,
        accessibility: state.accessibility,
        performance: state.performance,
        network: state.network,
        account: state.account,
        system: state.system,
        theme: state.theme,
        accent: state.accent,
        wallpaper: state.wallpaper,
      }),
    }
  )
);

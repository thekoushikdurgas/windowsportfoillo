import { create } from 'zustand';
import { SystemState, DesktopIcon, TaskbarItem } from '@/types/system';
import { ThemeConfig } from '@/types/theme';

interface SystemStore extends SystemState {
  bootSystem: () => void;
  toggleStartMenu: () => void;
  setStartMenuOpen: (isOpen: boolean) => void;
  setQuickSettingsOpen: (isOpen: boolean) => void;
  setNotificationCenterOpen: (isOpen: boolean) => void;
  addDesktopIcon: (icon: DesktopIcon) => void;
  removeDesktopIcon: (id: string) => void;
  selectDesktopIcon: (id: string) => void;
  deselectAllIcons: () => void;
  addTaskbarItem: (item: TaskbarItem) => void;
  removeTaskbarItem: (id: string) => void;
  setTaskbarItemActive: (id: string, isActive: boolean) => void;
  setWallpaper: (wallpaper: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setThemeConfig: (themeConfig: ThemeConfig) => void;
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  addToRecent: (appId: string) => void;
}

export const useSystemStore = create<SystemStore>((set, get) => ({
  isBooted: false,
  isStartMenuOpen: false,
  isTaskbarVisible: true,
  systemStatus: {
    wifi: true,
    charging: false,
  },
  desktopIcons: [
    {
      id: 'about-me',
      name: 'About Me',
      icon: '👤',
      appId: 'about-me',
      position: { x: 50, y: 50 },
      isSelected: false,
    },
    {
      id: 'file-explorer',
      name: 'File Explorer',
      icon: '📁',
      appId: 'file-explorer',
      position: { x: 50, y: 150 },
      isSelected: false,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      appId: 'settings',
      position: { x: 50, y: 250 },
      isSelected: false,
    },
  ],
  taskbarItems: [
    {
      id: 'start-button',
      appId: 'start-menu',
      icon: '🪟',
      isActive: false,
      isPinned: true,
    },
    {
      id: 'file-explorer-taskbar',
      appId: 'file-explorer',
      icon: '📁',
      isActive: false,
      isPinned: true,
    },
    {
      id: 'settings-taskbar',
      appId: 'settings',
      icon: '⚙️',
      isActive: false,
      isPinned: true,
    },
  ],
  wallpaper: '/images/wallpapers/windows11-default.svg',
  theme: 'light',
  volume: 70,
  brightness: 100,
  recentApps: [],

  bootSystem: () => {
    set({ isBooted: true });
  },

  toggleStartMenu: () => {
    const { isStartMenuOpen } = get();
    set({ isStartMenuOpen: !isStartMenuOpen });
  },

  setStartMenuOpen: (isOpen) => {
    set({ isStartMenuOpen: isOpen });
  },

  setQuickSettingsOpen: (_isOpen) => {
    // This would be used by keyboard shortcuts
    // Quick settings state management would be implemented here
  },

  setNotificationCenterOpen: (_isOpen) => {
    // This would be used by keyboard shortcuts
    // Notification center state management would be implemented here
  },

  addDesktopIcon: (icon) => {
    const { desktopIcons } = get();
    set({ desktopIcons: [...desktopIcons, icon] });
  },

  removeDesktopIcon: (id) => {
    const { desktopIcons } = get();
    set({ desktopIcons: desktopIcons.filter(icon => icon.id !== id) });
  },

  selectDesktopIcon: (id) => {
    const { desktopIcons } = get();
    const updatedIcons = desktopIcons.map(icon => ({
      ...icon,
      isSelected: icon.id === id,
    }));
    set({ desktopIcons: updatedIcons });
  },

  deselectAllIcons: () => {
    const { desktopIcons } = get();
    const updatedIcons = desktopIcons.map(icon => ({
      ...icon,
      isSelected: false,
    }));
    set({ desktopIcons: updatedIcons });
  },

  addTaskbarItem: (item) => {
    const { taskbarItems } = get();
    set({ taskbarItems: [...taskbarItems, item] });
  },

  removeTaskbarItem: (id) => {
    const { taskbarItems } = get();
    set({ taskbarItems: taskbarItems.filter(item => item.id !== id) });
  },

  setTaskbarItemActive: (id, isActive) => {
    const { taskbarItems } = get();
    const updatedItems = taskbarItems.map(item =>
      item.id === id ? { ...item, isActive } : item
    );
    set({ taskbarItems: updatedItems });
  },

  setWallpaper: (wallpaper) => {
    set({ wallpaper });
  },

  setTheme: (theme) => {
    set({ theme });
  },

  toggleTheme: () => {
    const { theme } = get();
    set({ theme: theme === 'light' ? 'dark' : 'light' });
  },

  setThemeConfig: (themeConfig) => {
    // This method is for compatibility with the new theme system
    // The actual theme management is handled by ThemeProvider
    // Convert 'auto' to a default theme or handle it appropriately
    const theme = themeConfig.type === 'auto' ? 'light' : themeConfig.type;
    set({ theme });
  },

  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(100, volume)) });
  },

  setBrightness: (brightness) => {
    set({ brightness: Math.max(0, Math.min(100, brightness)) });
  },

  addToRecent: (appId: string) => {
    const { recentApps } = get();
    const updatedRecent = [appId, ...recentApps.filter(id => id !== appId)].slice(0, 10);
    set({ recentApps: updatedRecent });
  },
}));

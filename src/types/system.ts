export interface DesktopIcon {
  id: string;
  name: string;
  icon: string;
  appId: string;
  position: { x: number; y: number };
  isSelected: boolean;
}

export interface TaskbarItem {
  id: string;
  appId: string;
  icon: string;
  isActive: boolean;
  isPinned: boolean;
  hasNotifications?: boolean;
}

export interface StartMenuState {
  isOpen: boolean;
  searchQuery: string;
  pinnedApps: string[];
  recommendedItems: RecommendedItem[];
}

export interface RecommendedItem {
  id: string;
  name: string;
  type: 'file' | 'app' | 'folder';
  icon: string;
  lastAccessed: Date;
  appId?: string;
}

export interface SystemState {
  isBooted: boolean;
  isStartMenuOpen: boolean;
  isTaskbarVisible: boolean;
  desktopIcons: DesktopIcon[];
  taskbarItems: TaskbarItem[];
  wallpaper: string;
  theme: 'light' | 'dark';
  volume: number;
  brightness: number;
  recentApps: string[];
  systemStatus: {
    wifi: boolean;
    charging: boolean;
  };
}

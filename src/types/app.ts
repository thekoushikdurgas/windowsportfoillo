export interface App {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<Record<string, unknown>>;
  category: AppCategory;
  isSystemApp?: boolean;
  description?: string;
}

export type AppCategory = 'system' | 'productivity' | 'entertainment' | 'utilities' | 'development';

export interface AppWindow {
  appId: string;
  windowId: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppRegistry {
  [appId: string]: App;
}

export interface AppState {
  installedApps: App[];
  openApps: AppWindow[];
  pinnedApps: string[];
  recentApps: string[];
}

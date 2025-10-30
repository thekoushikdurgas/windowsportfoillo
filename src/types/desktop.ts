export interface WindowState {
  id: string;
  title: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  data?: Record<string, unknown>;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<unknown>;
  defaultSize: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  resizable: boolean;
  minimizable: boolean;
  maximizable: boolean;
  closable: boolean;
  category: 'system' | 'productivity' | 'media' | 'development' | 'games' | 'utilities';
  description?: string;
  version?: string;
  author?: string;
}

export interface DesktopIcon {
  id: string;
  appId: string;
  x: number;
  y: number;
  label: string;
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  duration?: number;
  actions?: Array<{
    label: string;
    handler: () => void;
  }>;
}

export interface DesktopContextType {
  windows: WindowState[];
  desktopIcons: DesktopIcon[];
  notifications: NotificationItem[];
  activeWindowId: string | null;
  openApp: (appId: string, data?: Record<string, unknown>) => void;
  closeApp: (windowId: string) => void;
  minimizeApp: (windowId: string) => void;
  maximizeApp: (windowId: string) => void;
  focusApp: (windowId: string) => void;
  updateWindowState: (windowId: string, updates: Partial<WindowState>) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
}

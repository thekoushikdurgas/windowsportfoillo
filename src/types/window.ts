export interface WindowState {
  id: string;
  title: string;
  appId: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  crop?: { x: number; y: number; width: number; height: number } | null;
}

export interface WindowProps {
  id: string;
  title: string;
  appId: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  children: React.ReactNode;
}

export interface WindowManagerState {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
}

export interface WindowAction {
  type: 'OPEN_WINDOW' | 'CLOSE_WINDOW' | 'MINIMIZE_WINDOW' | 'MAXIMIZE_WINDOW' | 'FOCUS_WINDOW' | 'MOVE_WINDOW' | 'RESIZE_WINDOW';
  payload: {
    windowId?: string;
    appId?: string;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    [key: string]: unknown;
  };
}

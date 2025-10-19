export interface VirtualDesktop {
  id: string
  name: string
  wallpaper: string
  isActive: boolean
  windowCount: number
  createdAt: Date
}

export interface DesktopState {
  wallpaper: string
  theme: 'light' | 'dark'
  desktopIcons: DesktopIcon[]
  openWindows: string[]
  focusedWindow: string | null
  startMenuOpen: boolean
  systemTrayExpanded: boolean
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right'
  showDesktopIcons: boolean
  showTaskbar: boolean
  showSystemTray: boolean
  currentDesktop: string
  desktops: Record<string, VirtualDesktop>
  screenSize: { width: number; height: number }
}

export interface DesktopIcon {
  id: string
  appId: string
  position: { x: number; y: number }
  name: string
  icon: string
  isSelected: boolean
}

export interface Wallpaper {
  id: string
  name: string
  url: string
  thumbnail: string
  category: 'nature' | 'abstract' | 'dark' | 'light'
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
  isDark: boolean
}

export interface DesktopSettings {
  wallpaper: string
  theme: string
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right'
  showDesktopIcons: boolean
  showTaskbar: boolean
  showSystemTray: boolean
  autoHideTaskbar: boolean
  showClock: boolean
  showDate: boolean
  showSeconds: boolean
  timeFormat: '12h' | '24h'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
}

export type DesktopAction = 
  | { type: 'SET_WALLPAPER'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_START_MENU' }
  | { type: 'CLOSE_START_MENU' }
  | { type: 'TOGGLE_SYSTEM_TRAY' }
  | { type: 'CLOSE_SYSTEM_TRAY' }
  | { type: 'SET_FOCUSED_WINDOW'; payload: string | null }
  | { type: 'ADD_DESKTOP_ICON'; payload: DesktopIcon }
  | { type: 'REMOVE_DESKTOP_ICON'; payload: string }
  | { type: 'UPDATE_DESKTOP_ICON_POSITION'; payload: { id: string; position: { x: number; y: number } } }
  | { type: 'SELECT_DESKTOP_ICON'; payload: string }
  | { type: 'DESELECT_ALL_DESKTOP_ICONS' }
  | { type: 'SET_TASKBAR_POSITION'; payload: 'bottom' | 'top' | 'left' | 'right' }
  | { type: 'UPDATE_DESKTOP_SETTINGS'; payload: Partial<DesktopSettings> }
  | { type: 'CREATE_DESKTOP'; payload: { id: string; name: string } }
  | { type: 'DELETE_DESKTOP'; payload: string }
  | { type: 'RENAME_DESKTOP'; payload: { id: string; name: string } }
  | { type: 'SWITCH_DESKTOP'; payload: string }
  | { type: 'SET_SCREEN_SIZE'; payload: { width: number; height: number } }

export interface AppDefinition {
  id: string
  name: string
  icon: string
  component: React.ComponentType<any>
  defaultSize: { width: number; height: number }
  defaultPosition: { x: number; y: number }
  category: AppCategory
  description?: string
  version?: string
  isSystemApp?: boolean
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
  resizable?: boolean
  minimizable?: boolean
  maximizable?: boolean
  closable?: boolean
  canSnap?: boolean
  supportsMultipleInstances?: boolean
  launchArgs?: Record<string, any>
  dependencies?: string[]
  permissions?: AppPermission[]
  metadata?: AppMetadata
}

export interface AppMetadata {
  author?: string
  website?: string
  license?: string
  tags?: string[]
  screenshots?: string[]
  changelog?: string
  lastUpdated?: Date
}

export interface AppPermission {
  id: string
  name: string
  description: string
  required: boolean
  granted: boolean
}

export interface AppInstance {
  id: string
  appId: string
  windowId: string
  args?: Record<string, any>
  createdAt: Date
  lastActive: Date
}

export type AppCategory = 
  | 'productivity' 
  | 'entertainment' 
  | 'system' 
  | 'personal' 
  | 'utilities' 
  | 'games'

export interface DesktopIcon {
  id: string
  appId: string
  position: { x: number; y: number }
  name: string
  icon: string
}

export interface AppState {
  id: string
  isRunning: boolean
  windowId?: string
  lastUsed: Date
  usageCount: number
}

export interface AppRegistry {
  [appId: string]: AppDefinition
}

export interface AppStoreState {
  apps: AppRegistry
  runningApps: AppState[]
  desktopIcons: DesktopIcon[]
  pinnedApps: string[]
  recentApps: string[]
}

export type AppAction = 
  | { type: 'REGISTER_APP'; payload: AppDefinition }
  | { type: 'UNREGISTER_APP'; payload: string }
  | { type: 'START_APP'; payload: { appId: string; windowId: string } }
  | { type: 'STOP_APP'; payload: string }
  | { type: 'PIN_APP'; payload: string }
  | { type: 'UNPIN_APP'; payload: string }
  | { type: 'ADD_DESKTOP_ICON'; payload: DesktopIcon }
  | { type: 'REMOVE_DESKTOP_ICON'; payload: string }
  | { type: 'UPDATE_DESKTOP_ICON_POSITION'; payload: { id: string; position: { x: number; y: number } } }
  | { type: 'ADD_RECENT_APP'; payload: string }

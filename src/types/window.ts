export interface WindowPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

export interface WindowState {
  id: string
  title: string
  appId: string
  position: WindowPosition
  size: WindowSize
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  zIndex: number
  isDragging: boolean
  isResizing: boolean
  minSize?: WindowSize
  maxSize?: WindowSize
  isSnapped?: boolean
  snapLayout?: SnapLayout
  isClosing?: boolean
  isRestored?: boolean
  previousPosition?: WindowPosition
  previousSize?: WindowSize
  canResize?: boolean
  canMinimize?: boolean
  canMaximize?: boolean
  canClose?: boolean
  isModal?: boolean
  parentWindowId?: string
  desktopId?: string
}

export interface WindowControls {
  minimize: boolean
  maximize: boolean
  close: boolean
}

export interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  initialPosition?: WindowPosition
  initialSize?: WindowSize
  controls?: WindowControls
  resizable?: boolean
  draggable?: boolean
  minSize?: WindowSize
  maxSize?: WindowSize
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

export type SnapLayout = 
  | 'left-half'
  | 'right-half'
  | 'top-half'
  | 'bottom-half'
  | 'top-left-quarter'
  | 'top-right-quarter'
  | 'bottom-left-quarter'
  | 'bottom-right-quarter'
  | 'full-screen'

export interface VirtualDesktop {
  id: string
  name: string
  windows: string[]
  isActive: boolean
  wallpaper?: string
}

export interface WindowGroup {
  id: string
  name: string
  windows: string[]
  isCollapsed: boolean
}

export type WindowAction = 
  | { type: 'OPEN_WINDOW'; payload: WindowState }
  | { type: 'CLOSE_WINDOW'; payload: string }
  | { type: 'MINIMIZE_WINDOW'; payload: string }
  | { type: 'MAXIMIZE_WINDOW'; payload: string }
  | { type: 'RESTORE_WINDOW'; payload: string }
  | { type: 'FOCUS_WINDOW'; payload: string }
  | { type: 'UPDATE_WINDOW_POSITION'; payload: { id: string; position: WindowPosition } }
  | { type: 'UPDATE_WINDOW_SIZE'; payload: { id: string; size: WindowSize } }
  | { type: 'SET_WINDOW_DRAGGING'; payload: { id: string; isDragging: boolean } }
  | { type: 'SET_WINDOW_RESIZING'; payload: { id: string; isResizing: boolean } }
  | { type: 'BRING_TO_FRONT'; payload: string }
  | { type: 'SNAP_WINDOW'; payload: { id: string; layout: SnapLayout } }
  | { type: 'UNSNAP_WINDOW'; payload: string }
  | { type: 'GROUP_WINDOWS'; payload: { windowIds: string[]; groupId?: string } }
  | { type: 'UNGROUP_WINDOWS'; payload: string[] }
  | { type: 'MOVE_TO_DESKTOP'; payload: { windowId: string; desktopId: string } }

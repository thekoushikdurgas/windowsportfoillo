export interface KeyboardShortcut {
  id: string
  name: string
  description: string
  key: string
  modifiers: KeyboardModifier[]
  action: () => void
  category: ShortcutCategory
  isEnabled: boolean
  isGlobal: boolean
  preventDefault?: boolean
}

export type KeyboardModifier = 'ctrl' | 'alt' | 'shift' | 'meta' | 'super'

export type ShortcutCategory = 
  | 'navigation'
  | 'window-management'
  | 'system'
  | 'applications'
  | 'accessibility'

export interface KeyboardShortcutConfig {
  shortcuts: KeyboardShortcut[]
  enableGlobalShortcuts: boolean
  enableContextualShortcuts: boolean
  showShortcutHints: boolean
}

export interface KeyboardEvent {
  key: string
  code: string
  modifiers: KeyboardModifier[]
  timestamp: number
  target?: HTMLElement
}

// System Constants
export const SYSTEM_INFO = {
  name: 'DurgasOS',
  version: '1.0.0',
  build: '2024.1.0',
  author: 'Durgas',
  description: 'A modern Windows 11 clone built with React and TypeScript'
} as const

// Window Constants
export const WINDOW_CONSTANTS = {
  MIN_WIDTH: 300,
  MIN_HEIGHT: 200,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600,
  TITLE_BAR_HEIGHT: 32,
  BORDER_WIDTH: 1,
  SHADOW_BLUR: 8,
  SHADOW_SPREAD: 2
} as const

// Desktop Constants
export const DESKTOP_CONSTANTS = {
  ICON_SIZE: 64,
  ICON_SPACING: 8,
  ICON_LABEL_HEIGHT: 20,
  ICON_GRID_SIZE: 80,
  WALLPAPER_FADE_DURATION: 300
} as const

// Taskbar Constants
export const TASKBAR_CONSTANTS = {
  HEIGHT: 48,
  MOBILE_HEIGHT: 56,
  ICON_SIZE: 32,
  ICON_SPACING: 4,
  ANIMATION_DURATION: 200
} as const

// Animation Constants
export const ANIMATION_CONSTANTS = {
  DURATION_FAST: 150,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
  EASING_EASE_OUT: [0.1, 0.9, 0.2, 1],
  EASING_EASE_IN_OUT: [0.4, 0, 0.2, 1],
  EASING_BOUNCE: [0.68, -0.55, 0.265, 1.55]
} as const

// Keyboard Shortcut Constants
export const KEYBOARD_CONSTANTS = {
  MODIFIERS: {
    ALT: 'alt',
    CTRL: 'ctrl',
    SHIFT: 'shift',
    META: 'meta',
    SUPER: 'super'
  },
  KEYS: {
    TAB: 'Tab',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    SPACE: ' ',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    F11: 'F11',
    F12: 'F12'
  }
} as const

// Notification Constants
export const NOTIFICATION_CONSTANTS = {
  DEFAULT_DURATION: 5000,
  MAX_NOTIFICATIONS: 50,
  ANIMATION_DURATION: 300,
  STACK_DISTANCE: 8,
  TYPES: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    SYSTEM: 'system'
  },
  PRIORITIES: {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    CRITICAL: 'critical'
  }
} as const

// App Constants
export const APP_CONSTANTS = {
  MAX_INSTANCES: 10,
  DEFAULT_CATEGORIES: [
    'system',
    'utilities',
    'productivity',
    'entertainment',
    'development',
    'personal'
  ],
  SYSTEM_APPS: [
    'settings',
    'file-explorer',
    'calculator',
    'notepad'
  ]
} as const

// Theme Constants
export const THEME_CONSTANTS = {
  COLORS: {
    PRIMARY: '#0078d4',
    SECONDARY: '#106ebe',
    SUCCESS: '#107c10',
    WARNING: '#ff8c00',
    ERROR: '#d83b01',
    INFO: '#0078d4'
  },
  ACCENT_COLORS: [
    '#0078d4', // Blue
    '#107c10', // Green
    '#d83b01', // Red
    '#ff8c00', // Orange
    '#e3008c', // Pink
    '#8764b8'  // Purple
  ],
  WALLPAPERS: [
    'windows-11-default.svg',
    'solid-color',
    'gradient'
  ]
} as const

// Performance Constants
export const PERFORMANCE_CONSTANTS = {
  DEBOUNCE_DELAY: 100,
  THROTTLE_DELAY: 16, // ~60fps
  LAZY_LOAD_THRESHOLD: 100,
  VIRTUAL_SCROLL_THRESHOLD: 1000,
  MEMORY_CLEANUP_INTERVAL: 30000 // 30 seconds
} as const

// Accessibility Constants
export const ACCESSIBILITY_CONSTANTS = {
  FOCUS_RING_WIDTH: 2,
  FOCUS_RING_COLOR: '#0078d4',
  MIN_TOUCH_TARGET: 44,
  HIGH_CONTRAST_RATIO: 4.5,
  SCREEN_READER_ANNOUNCEMENT_DELAY: 100
} as const

// Storage Constants
export const STORAGE_CONSTANTS = {
  PREFIX: 'durgasos_',
  VERSION: '1.0.0',
  COMPRESSION_THRESHOLD: 1024, // 1KB
  CLEANUP_INTERVAL: 86400000 // 24 hours
} as const

// Error Constants
export const ERROR_CONSTANTS = {
  CODES: {
    APP_LAUNCH_FAILED: 'APP_LAUNCH_FAILED',
    WINDOW_CREATE_FAILED: 'WINDOW_CREATE_FAILED',
    STORE_UPDATE_FAILED: 'STORE_UPDATE_FAILED',
    NOTIFICATION_SEND_FAILED: 'NOTIFICATION_SEND_FAILED',
    SETTINGS_SAVE_FAILED: 'SETTINGS_SAVE_FAILED'
  },
  MESSAGES: {
    GENERIC_ERROR: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network connection failed',
    PERMISSION_DENIED: 'Permission denied',
    RESOURCE_NOT_FOUND: 'Resource not found'
  }
} as const

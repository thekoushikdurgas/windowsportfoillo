export const WINDOW_CONSTANTS = {
  MIN_WIDTH: 300,
  MIN_HEIGHT: 200,
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 600,
  TITLE_BAR_HEIGHT: 32,
  BORDER_RADIUS: 8,
  SHADOW: '0 8px 32px rgba(0, 0, 0, 0.12)',
};

export const TASKBAR_CONSTANTS = {
  HEIGHT: 48,
  ICON_SIZE: 24,
  START_BUTTON_SIZE: 40,
};

export const DESKTOP_CONSTANTS = {
  ICON_SIZE: 64,
  ICON_SPACING: 16,
  GRID_SIZE: 80,
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const Z_INDEX = {
  DESKTOP: 0,
  WINDOW: 10,
  TASKBAR: 100,
  START_MENU: 200,
  CONTEXT_MENU: 300,
  MODAL: 400,
};

export const APP_CATEGORIES = {
  SYSTEM: 'system',
  PRODUCTIVITY: 'productivity',
  ENTERTAINMENT: 'entertainment',
  UTILITIES: 'utilities',
  DEVELOPMENT: 'development',
} as const;

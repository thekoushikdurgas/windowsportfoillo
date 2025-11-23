/**
 * Windows 11 Design System
 * Design tokens, utilities, and configurations for Windows 11 UI
 */

// Windows 11 Color Palette
export const WINDOWS11_COLORS = {
  // Light theme
  light: {
    background: '#f3f3f3',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    text: '#000000',
    textSecondary: '#6b6b6b',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: '#ea580c', // DurgasOS brand orange
    accentHover: '#f97316',
    error: '#d13438',
    success: '#107c10',
    warning: '#ffaa44',
  },
  // Dark theme
  dark: {
    background: '#202020',
    surface: '#2d2d2d',
    surfaceElevated: '#383838',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: '#ea580c', // DurgasOS brand orange
    accentHover: '#f97316',
    error: '#d13438',
    success: '#107c10',
    warning: '#ffaa44',
  },
} as const;

// Spacing scale (Windows 11 uses 4px base unit)
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
} as const;

// Typography scale
export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Segoe UI, system-ui, -apple-system, sans-serif',
    mono: 'Cascadia Code, Consolas, monospace',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Border radius (Windows 11 rounded corners)
export const BORDER_RADIUS = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
  // Windows 11 specific
  window: '8px', // Standard window corners
  windowMaximized: '0px', // No corners when maximized
  button: '4px',
  input: '4px',
  card: '8px',
  panel: '12px', // Larger panels like Start Menu
} as const;

// Shadows (Windows 11 depth system)
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  // Windows 11 specific
  window: '0 8px 32px rgba(0, 0, 0, 0.2)',
  windowActive: '0 12px 48px rgba(0, 0, 0, 0.3)',
  menu: '0 8px 16px rgba(0, 0, 0, 0.15)',
  tooltip: '0 4px 12px rgba(0, 0, 0, 0.15)',
} as const;

// Acrylic/Glassmorphism utilities
export interface AcrylicConfig {
  opacity?: number;
  blur?: number;
  saturation?: number;
  brightness?: number;
}

export const ACRYLIC_PRESETS = {
  light: {
    opacity: 0.85,
    blur: 30,
    saturation: 1.2,
    brightness: 1.1,
  },
  dark: {
    opacity: 0.85,
    blur: 30,
    saturation: 1.1,
    brightness: 0.9,
  },
  ultra: {
    opacity: 0.95,
    blur: 40,
    saturation: 1.3,
    brightness: 1.15,
  },
  subtle: {
    opacity: 0.7,
    blur: 20,
    saturation: 1.0,
    brightness: 1.0,
  },
} as const;

/**
 * Generate acrylic CSS properties
 */
export function getAcrylicStyles(
  isDark: boolean,
  preset: keyof typeof ACRYLIC_PRESETS = isDark ? 'dark' : 'light'
): React.CSSProperties {
  const config = ACRYLIC_PRESETS[preset];
  return {
    backgroundColor: isDark
      ? `rgba(32, 32, 32, ${config.opacity})`
      : `rgba(243, 243, 243, ${config.opacity})`,
    backdropFilter: `blur(${config.blur}px) saturate(${config.saturation}) brightness(${config.brightness})`,
    WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturation}) brightness(${config.brightness})`,
  };
}


// Snap Layout Configurations
export interface SnapZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  layout: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export const SNAP_LAYOUTS = {
  // 2-panel layouts
  splitVertical: {
    left: { x: 0, y: 0, width: 0.5, height: 1 },
    right: { x: 0.5, y: 0, width: 0.5, height: 1 },
  },
  splitHorizontal: {
    top: { x: 0, y: 0, width: 1, height: 0.5 },
    bottom: { x: 0, y: 0.5, width: 1, height: 0.5 },
  },
  // 3-panel layouts
  threeColumn: {
    left: { x: 0, y: 0, width: 0.33, height: 1 },
    center: { x: 0.33, y: 0, width: 0.34, height: 1 },
    right: { x: 0.67, y: 0, width: 0.33, height: 1 },
  },
  threeRow: {
    top: { x: 0, y: 0, width: 1, height: 0.33 },
    middle: { x: 0, y: 0.33, width: 1, height: 0.34 },
    bottom: { x: 0, y: 0.67, width: 1, height: 0.33 },
  },
  // 4-panel layouts
  quad: {
    'top-left': { x: 0, y: 0, width: 0.5, height: 0.5 },
    'top-right': { x: 0.5, y: 0, width: 0.5, height: 0.5 },
    'bottom-left': { x: 0, y: 0.5, width: 0.5, height: 0.5 },
    'bottom-right': { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
  },
} as const;

// Animation durations (Windows 11 uses smooth, fast animations)
export const ANIMATION = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    // Windows 11 specific easing
    windows: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  },
} as const;

// Z-index layers (Windows 11 layering system)
export const Z_INDEX = {
  base: 0,
  elevated: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  window: 1000,
  windowActive: 2000,
  system: 3000,
} as const;

// Window configuration
export const WINDOW_CONFIG = {
  minWidth: 300,
  minHeight: 200,
  defaultWidth: 800,
  defaultHeight: 600,
  titleBarHeight: 40,
  borderRadius: BORDER_RADIUS.window,
  borderRadiusMaximized: BORDER_RADIUS.windowMaximized,
  snapThreshold: 50, // pixels from edge to trigger snap
  snapAnimationDuration: ANIMATION.duration.normal,
} as const;

// Export all constants
export const WINDOWS11_DESIGN_SYSTEM = {
  colors: WINDOWS11_COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  acrylic: ACRYLIC_PRESETS,
  snapLayouts: SNAP_LAYOUTS,
  animation: ANIMATION,
  zIndex: Z_INDEX,
  window: WINDOW_CONFIG,
} as const;


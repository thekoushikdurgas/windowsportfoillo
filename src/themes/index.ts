import { ThemeConfig, ColorPalette } from '@/types/theme';

// Base color scales
const blueScale = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

const grayScale = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

const greenScale = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

const redScale = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

const yellowScale = {
  50: '#fefce8',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
};

// Windows 11 specific colors
const windowsBlue = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#0078d4', // Windows 11 primary blue
  600: '#106ebe',
  700: '#005a9e',
  800: '#004578',
  900: '#003052',
};

// Light theme color palette
const lightColors: ColorPalette = {
  primary: windowsBlue,
  secondary: grayScale,
  accent: windowsBlue,
  neutral: grayScale,
  semantic: {
    success: greenScale,
    warning: yellowScale,
    error: redScale,
    info: blueScale,
  },
  surface: {
    50: '#ffffff',
    100: '#f9fafb',
    200: '#f3f4f6',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#9ca3af',
    600: '#6b7280',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  background: {
    50: '#ffffff',
    100: '#f9fafb',
    200: '#f3f4f6',
    300: '#e5e7eb',
    400: '#d1d5db',
    500: '#9ca3af',
    600: '#6b7280',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Dark theme color palette
const darkColors: ColorPalette = {
  primary: windowsBlue,
  secondary: grayScale,
  accent: windowsBlue,
  neutral: grayScale,
  semantic: {
    success: greenScale,
    warning: yellowScale,
    error: redScale,
    info: blueScale,
  },
  surface: {
    50: '#0c0c0c',
    100: '#161616',
    200: '#202020',
    300: '#2a2a2a',
    400: '#343434',
    500: '#3e3e3e',
    600: '#484848',
    700: '#525252',
    800: '#5c5c5c',
    900: '#666666',
  },
  background: {
    50: '#0c0c0c',
    100: '#161616',
    200: '#202020',
    300: '#2a2a2a',
    400: '#343434',
    500: '#3e3e3e',
    600: '#484848',
    700: '#525252',
    800: '#5c5c5c',
    900: '#666666',
  },
};

// High contrast color palette
const highContrastColors: ColorPalette = {
  primary: {
    50: '#ffffff',
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#0078d4',
    600: '#0078d4',
    700: '#0078d4',
    800: '#0078d4',
    900: '#000000',
  },
  secondary: {
    50: '#ffffff',
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#000000',
    800: '#000000',
    900: '#000000',
  },
  accent: windowsBlue,
  neutral: {
    50: '#ffffff',
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#000000',
    800: '#000000',
    900: '#000000',
  },
  semantic: {
    success: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#00ff00',
      600: '#00ff00',
      700: '#00ff00',
      800: '#00ff00',
      900: '#000000',
    },
    warning: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffff00',
      600: '#ffff00',
      700: '#ffff00',
      800: '#ffff00',
      900: '#000000',
    },
    error: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ff0000',
      600: '#ff0000',
      700: '#ff0000',
      800: '#ff0000',
      900: '#000000',
    },
    info: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#0000ff',
      600: '#0000ff',
      700: '#0000ff',
      800: '#0000ff',
      900: '#000000',
    },
  },
  surface: {
    50: '#ffffff',
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#000000',
    800: '#000000',
    900: '#000000',
  },
  background: {
    50: '#ffffff',
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#000000',
    800: '#000000',
    900: '#000000',
  },
};

// Common typography scale
const typography = {
  fontFamily: {
    primary: "'Segoe UI', system-ui, -apple-system, sans-serif",
    mono: "'Cascadia Code', 'Consolas', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Common spacing scale
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
};

// Common shadow scale
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// Common animation config
const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Theme configurations
export const lightTheme: ThemeConfig = {
  name: 'Light',
  type: 'light',
  colors: lightColors,
  typography,
  spacing,
  shadows,
  animations,
};

export const darkTheme: ThemeConfig = {
  name: 'Dark',
  type: 'dark',
  colors: darkColors,
  typography,
  spacing,
  shadows,
  animations,
};

export const highContrastTheme: ThemeConfig = {
  name: 'High Contrast',
  type: 'dark',
  colors: highContrastColors,
  typography,
  spacing,
  shadows,
  animations,
};

export const themes: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  highContrast: highContrastTheme,
};

export const defaultTheme = lightTheme;

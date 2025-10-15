/**
 * Mica and Acrylic effects utilities for Windows 11-style backgrounds
 * Enhanced with advanced visual effects system
 */

export interface MicaConfig {
  variant: 'mica' | 'acrylic' | 'none' | 'glass';
  tintColor?: string;
  tintOpacity?: number;
  blur?: number;
  saturation?: number;
  intensity?: 'subtle' | 'normal' | 'strong';
  theme?: 'light' | 'dark';
}

export const DEFAULT_MICA_CONFIG: MicaConfig = {
  variant: 'mica',
  tintColor: '#ffffff',
  tintOpacity: 0.1,
  blur: 12,
  saturation: 1.2,
};

export const DEFAULT_ACRYLIC_CONFIG: MicaConfig = {
  variant: 'acrylic',
  tintColor: '#ffffff',
  tintOpacity: 0.2,
  blur: 20,
  saturation: 1.1,
};

/**
 * Generates CSS styles for Mica effect
 */
export function getMicaStyles(config: MicaConfig = DEFAULT_MICA_CONFIG): React.CSSProperties {
  if (config.variant === 'none') {
    return {};
  }

  const {
    tintColor = '#ffffff',
    tintOpacity = 0.1,
    blur = 12,
    saturation = 1.2,
  } = config;

  return {
    backdropFilter: `blur(${blur}px) saturate(${saturation})`,
    backgroundColor: `${tintColor}${Math.round(tintOpacity * 255).toString(16).padStart(2, '0')}`,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
}

/**
 * Generates CSS classes for Mica effect using Tailwind
 */
export function getMicaClasses(config: MicaConfig = DEFAULT_MICA_CONFIG): string {
  if (config.variant === 'none') {
    return '';
  }

  const baseClasses = 'backdrop-blur-sm border border-white/10';
  
  switch (config.variant) {
    case 'mica':
      return `${baseClasses} bg-white/10 backdrop-saturate-150`;
    case 'acrylic':
      return `${baseClasses} bg-white/20 backdrop-blur-md backdrop-saturate-110`;
    default:
      return baseClasses;
  }
}

/**
 * Mica effect variants for different contexts
 */
export const MICA_VARIANTS = {
  // Taskbar and system UI
  taskbar: {
    variant: 'mica' as const,
    tintColor: '#000000',
    tintOpacity: 0.3,
    blur: 16,
    saturation: 1.4,
  },
  
  // Start menu and panels
  panel: {
    variant: 'acrylic' as const,
    tintColor: '#ffffff',
    tintOpacity: 0.15,
    blur: 24,
    saturation: 1.2,
  },
  
  // Window chrome
  window: {
    variant: 'mica' as const,
    tintColor: '#ffffff',
    tintOpacity: 0.05,
    blur: 12,
    saturation: 1.3,
  },
  
  // Context menus and tooltips
  menu: {
    variant: 'acrylic' as const,
    tintColor: '#ffffff',
    tintOpacity: 0.25,
    blur: 20,
    saturation: 1.1,
  },
  
  // Notification toasts
  notification: {
    variant: 'acrylic' as const,
    tintColor: '#ffffff',
    tintOpacity: 0.2,
    blur: 16,
    saturation: 1.2,
  },
  
  // Dark theme variants
  dark: {
    taskbar: {
      variant: 'mica' as const,
      tintColor: '#000000',
      tintOpacity: 0.5,
      blur: 16,
      saturation: 1.4,
    },
    panel: {
      variant: 'acrylic' as const,
      tintColor: '#000000',
      tintOpacity: 0.3,
      blur: 24,
      saturation: 1.2,
    },
    window: {
      variant: 'mica' as const,
      tintColor: '#000000',
      tintOpacity: 0.2,
      blur: 12,
      saturation: 1.3,
    },
  },
};

/**
 * Gets Mica configuration based on theme and context
 */
export function getMicaConfig(
  context: keyof Omit<typeof MICA_VARIANTS, 'dark'>,
  theme: 'light' | 'dark' = 'light'
): MicaConfig {
  if (theme === 'dark' && context in MICA_VARIANTS.dark) {
    return MICA_VARIANTS.dark[context as keyof typeof MICA_VARIANTS.dark];
  }
  
  return MICA_VARIANTS[context];
}

/**
 * Creates a CSS custom property for Mica background
 */
export function createMicaCSSProperty(config: MicaConfig): string {
  const { tintColor, tintOpacity = 0.1, blur = 12, saturation = 1.2 } = config;
  
  const alpha = Math.round(tintOpacity * 255).toString(16).padStart(2, '0');
  const background = `${tintColor}${alpha}`;
  
  return `background: ${background}; backdrop-filter: blur(${blur}px) saturate(${saturation});`;
}

/**
 * Hook to get Mica styles based on theme and context
 */
export function useMicaEffect(
  context: keyof Omit<typeof MICA_VARIANTS, 'dark'>,
  theme: 'light' | 'dark' = 'light'
) {
  const config = getMicaConfig(context, theme);
  return {
    styles: getMicaStyles(config),
    classes: getMicaClasses(config),
    config,
  };
}

/**
 * Animation variants for Mica transitions
 */
export const MICA_ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, backdropFilter: 'blur(12px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, y: 0, backdropFilter: 'blur(12px)' },
    exit: { opacity: 0, y: 20, backdropFilter: 'blur(0px)' },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.95, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, scale: 1, backdropFilter: 'blur(12px)' },
    exit: { opacity: 0, scale: 0.95, backdropFilter: 'blur(0px)' },
  },
};

/**
 * Utility to check if backdrop-filter is supported
 */
export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  return 'backdropFilter' in testElement.style || 'webkitBackdropFilter' in testElement.style;
}

/**
 * Fallback styles for browsers that don't support backdrop-filter
 */
export function getFallbackStyles(config: MicaConfig): React.CSSProperties {
  const { tintColor = '#ffffff', tintOpacity = 0.1 } = config;
  
  return {
    backgroundColor: `${tintColor}${Math.round(tintOpacity * 255).toString(16).padStart(2, '0')}`,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
}

/**
 * Gets appropriate styles based on browser support
 */
export function getAdaptiveMicaStyles(config: MicaConfig = DEFAULT_MICA_CONFIG): React.CSSProperties {
  if (supportsBackdropFilter()) {
    return getMicaStyles(config);
  } else {
    return getFallbackStyles(config);
  }
}

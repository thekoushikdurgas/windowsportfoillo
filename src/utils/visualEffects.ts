/**
 * Visual Effects Utilities for Windows 11 Replica
 * Enhanced shadows, blur effects, and animations
 */

export interface VisualEffectOptions {
  intensity?: 'subtle' | 'normal' | 'strong';
  theme?: 'light' | 'dark';
  reducedMotion?: boolean;
}

export const SHADOW_PRESETS = {
  // Windows 11 elevation shadows
  'elevation-1': {
    light: '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    dark: '0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.4)',
  },
  'elevation-2': {
    light: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    dark: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  },
  'elevation-3': {
    light: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    dark: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  },
  'elevation-4': {
    light: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    dark: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  },
  'elevation-5': {
    light: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    dark: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  },
  
  // Special Windows 11 effects
  'window': {
    light: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
    dark: '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  'taskbar': {
    light: '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06)',
    dark: '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2)',
  },
  'start-menu': {
    light: '0 16px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)',
    dark: '0 16px 40px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  'notification': {
    light: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
    dark: '0 8px 24px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  'button-hover': {
    light: '0 4px 12px rgba(0, 0, 0, 0.15)',
    dark: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  'button-active': {
    light: '0 2px 6px rgba(0, 0, 0, 0.2)',
    dark: '0 2px 6px rgba(0, 0, 0, 0.5)',
  },
} as const;

export const BLUR_PRESETS = {
  'subtle': 'blur(8px)',
  'normal': 'blur(12px)',
  'strong': 'blur(20px)',
  'extra-strong': 'blur(32px)',
  'acrylic': 'blur(40px)',
  'mica': 'blur(80px)',
} as const;

export const ANIMATION_PRESETS = {
  // Spring animations for Windows 11 feel
  'spring-subtle': {
    type: 'spring' as const,
    damping: 25,
    stiffness: 300,
    mass: 0.8,
  },
  'spring-normal': {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
    mass: 1,
  },
  'spring-bouncy': {
    type: 'spring' as const,
    damping: 15,
    stiffness: 300,
    mass: 1.2,
  },
  'spring-smooth': {
    type: 'spring' as const,
    damping: 30,
    stiffness: 200,
    mass: 0.8,
  },
  
  // Easing animations
  'ease-subtle': {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  'ease-normal': {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  'ease-smooth': {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  'ease-bounce': {
    duration: 0.4,
    ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  },
} as const;

export function getShadow(elevation: keyof typeof SHADOW_PRESETS, options: VisualEffectOptions = {}) {
  const { theme = 'light', intensity = 'normal' } = options;
  
  const shadow = SHADOW_PRESETS[elevation][theme];
  
  if (intensity === 'subtle') {
    return shadow.replace(/rgba\(0, 0, 0, ([^)]+)\)/g, (match, alpha) => {
      const value = parseFloat(alpha);
      return `rgba(0, 0, 0, ${Math.max(0, value * 0.5)})`;
    });
  }
  
  if (intensity === 'strong') {
    return shadow.replace(/rgba\(0, 0, 0, ([^)]+)\)/g, (match, alpha) => {
      const value = parseFloat(alpha);
      return `rgba(0, 0, 0, ${Math.min(1, value * 1.5)})`;
    });
  }
  
  return shadow;
}

export function getBlur(preset: keyof typeof BLUR_PRESETS, intensity: 'subtle' | 'normal' | 'strong' = 'normal') {
  const blur = BLUR_PRESETS[preset];
  
  if (intensity === 'subtle') {
    const value = parseInt(blur.replace('blur(', '').replace('px)', ''));
    return `blur(${Math.max(2, value * 0.5)}px)`;
  }
  
  if (intensity === 'strong') {
    const value = parseInt(blur.replace('blur(', '').replace('px)', ''));
    return `blur(${value * 1.5}px)`;
  }
  
  return blur;
}

export function getAnimation(preset: keyof typeof ANIMATION_PRESETS, options: VisualEffectOptions = {}) {
  const { reducedMotion = false } = options;
  
  if (reducedMotion) {
    return {
      duration: 0.01,
      ease: 'linear' as const,
    };
  }
  
  return ANIMATION_PRESETS[preset];
}

export function getMicaEffect(options: VisualEffectOptions = {}) {
  const { theme = 'light', intensity = 'normal' } = options;
  
  const baseOpacity = theme === 'light' ? 0.8 : 0.6;
  const opacity = intensity === 'subtle' ? baseOpacity * 0.7 : 
                  intensity === 'strong' ? Math.min(1, baseOpacity * 1.3) : 
                  baseOpacity;
  
  return {
    backdropFilter: getBlur('mica', intensity),
    backgroundColor: theme === 'light' ? 
      `rgba(255, 255, 255, ${opacity})` : 
      `rgba(32, 32, 32, ${opacity})`,
  };
}

export function getAcrylicEffect(options: VisualEffectOptions = {}) {
  const { theme = 'light', intensity = 'normal' } = options;
  
  const baseOpacity = theme === 'light' ? 0.9 : 0.8;
  const opacity = intensity === 'subtle' ? baseOpacity * 0.8 : 
                  intensity === 'strong' ? Math.min(1, baseOpacity * 1.2) : 
                  baseOpacity;
  
  return {
    backdropFilter: getBlur('acrylic', intensity),
    backgroundColor: theme === 'light' ? 
      `rgba(255, 255, 255, ${opacity})` : 
      `rgba(40, 40, 40, ${opacity})`,
  };
}

export function getGlassEffect(options: VisualEffectOptions = {}) {
  const { theme = 'light', intensity = 'normal' } = options;
  
  const baseOpacity = theme === 'light' ? 0.7 : 0.6;
  const opacity = intensity === 'subtle' ? baseOpacity * 0.6 : 
                  intensity === 'strong' ? Math.min(1, baseOpacity * 1.4) : 
                  baseOpacity;
  
  return {
    backdropFilter: getBlur('normal', intensity),
    backgroundColor: theme === 'light' ? 
      `rgba(255, 255, 255, ${opacity})` : 
      `rgba(50, 50, 50, ${opacity})`,
    border: theme === 'light' ? 
      '1px solid rgba(255, 255, 255, 0.3)' : 
      '1px solid rgba(255, 255, 255, 0.1)',
  };
}

// Enhanced hover effects
export function getHoverEffect(baseShadow: string, options: VisualEffectOptions = {}) {
  const { theme = 'light' } = options;
  
  const hoverShadow = theme === 'light' ? 
    '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)' :
    '0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)';
  
  return {
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    boxShadow: baseShadow,
    '&:hover': {
      boxShadow: hoverShadow,
      transform: 'translateY(-1px)',
    },
  };
}

// Focus ring effects
export function getFocusRing(theme: 'light' | 'dark' = 'light') {
  return {
    outline: 'none',
    boxShadow: theme === 'light' ? 
      '0 0 0 2px rgba(0, 120, 212, 0.6), 0 0 0 4px rgba(0, 120, 212, 0.2)' :
      '0 0 0 2px rgba(96, 205, 255, 0.6), 0 0 0 4px rgba(96, 205, 255, 0.2)',
    transition: 'box-shadow 0.15s ease',
  };
}

// Loading animations
export function getLoadingAnimation(type: 'pulse' | 'spin' | 'wave' = 'pulse') {
  switch (type) {
    case 'pulse':
      return {
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      };
    case 'spin':
      return {
        animation: 'spin 1s linear infinite',
      };
    case 'wave':
      return {
        animation: 'wave 1.5s ease-in-out infinite',
      };
  }
}

// Micro-interactions
export function getMicroInteraction(type: 'scale' | 'lift' | 'glow' = 'scale') {
  switch (type) {
    case 'scale':
      return {
        transition: 'transform 0.15s ease',
        '&:hover': { transform: 'scale(1.05)' },
        '&:active': { transform: 'scale(0.98)' },
      };
    case 'lift':
      return {
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { 
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      };
    case 'glow':
      return {
        transition: 'box-shadow 0.3s ease',
        '&:hover': { 
          boxShadow: '0 0 20px rgba(0, 120, 212, 0.4)',
        },
      };
  }
}

// Theme-aware color utilities
export function getThemeColors(theme: 'light' | 'dark' = 'light') {
  return {
    primary: theme === 'light' ? '#0078d4' : '#60cdff',
    surface: theme === 'light' ? '#ffffff' : '#202020',
    surfaceVariant: theme === 'light' ? '#f3f3f3' : '#2a2a2a',
    text: theme === 'light' ? '#323130' : '#ffffff',
    textSecondary: theme === 'light' ? '#605e5c' : '#cccccc',
    border: theme === 'light' ? '#e1dfdd' : '#484644',
    accent: theme === 'light' ? '#0078d4' : '#60cdff',
    error: theme === 'light' ? '#d13438' : '#ff5f5f',
    warning: theme === 'light' ? '#ff8c00' : '#ffb366',
    success: theme === 'light' ? '#107c10' : '#4caf50',
  };
}

// Export commonly used combinations
export const VISUAL_EFFECTS = {
  window: (theme: 'light' | 'dark' = 'light') => ({
    boxShadow: getShadow('window', { theme }),
    ...getMicaEffect({ theme }),
  }),
  
  taskbar: (theme: 'light' | 'dark' = 'light') => ({
    boxShadow: getShadow('taskbar', { theme }),
    ...getAcrylicEffect({ theme }),
  }),
  
  startMenu: (theme: 'light' | 'dark' = 'light') => ({
    boxShadow: getShadow('start-menu', { theme }),
    ...getAcrylicEffect({ theme }),
  }),
  
  notification: (theme: 'light' | 'dark' = 'light') => ({
    boxShadow: getShadow('notification', { theme }),
    ...getGlassEffect({ theme }),
  }),
  
  button: (theme: 'light' | 'dark' = 'light') => ({
    boxShadow: getShadow('elevation-1', { theme }),
    ...getMicroInteraction('scale'),
  }),
} as const;

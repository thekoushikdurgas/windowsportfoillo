'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeConfig, AccessibilityConfig, ThemeContextType } from '@/types/theme';
import { themes, defaultTheme } from '@/themes';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeType?: 'light' | 'dark' | 'auto';
}

export function ThemeProvider({ children, defaultThemeType = 'auto' }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(defaultTheme);
  const [accessibility, setAccessibility] = useState<AccessibilityConfig>({
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false,
  });

  const initializeTheme = useCallback(() => {
    if (defaultThemeType === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setCurrentTheme(themes[systemTheme]);
    } else {
      setCurrentTheme(themes[defaultThemeType]);
    }
  }, [defaultThemeType]);

  // Initialize theme based on system preference or stored preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('windows11-theme');
    const storedAccessibility = localStorage.getItem('windows11-accessibility');
    
    if (storedTheme) {
      try {
        const parsedTheme = JSON.parse(storedTheme);
        setCurrentTheme(parsedTheme);
      } catch {
        // Fallback to system preference
        initializeTheme();
      }
    } else {
      initializeTheme();
    }

    if (storedAccessibility) {
      try {
        const parsedAccessibility = JSON.parse(storedAccessibility);
        setAccessibility(parsedAccessibility);
      } catch {
        // Use default accessibility settings
      }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (defaultThemeType === 'auto') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        setCurrentTheme(themes[systemTheme]);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [defaultThemeType, initializeTheme]);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(currentTheme.colors).forEach(([category, scale]) => {
      if (typeof scale === 'object' && scale !== null) {
        Object.entries(scale).forEach(([shade, color]) => {
          root.style.setProperty(`--color-${category}-${shade}`, color as string);
        });
      }
    });

    // Apply typography variables
    Object.entries(currentTheme.typography).forEach(([category, values]) => {
      if (typeof values === 'object' && values !== null) {
        Object.entries(values).forEach(([key, value]) => {
          root.style.setProperty(`--font-${category}-${key}`, value as string);
        });
      }
    });

    // Apply spacing variables
    Object.entries(currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value as string);
    });

    // Apply shadow variables
    Object.entries(currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value as string);
    });

    // Apply animation variables
    Object.entries(currentTheme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--animation-duration-${key}`, `${value as number}ms`);
    });

    Object.entries(currentTheme.animations.easing).forEach(([key, value]) => {
      root.style.setProperty(`--animation-easing-${key}`, value as string);
    });

    // Apply accessibility settings
    root.style.setProperty('--high-contrast', accessibility.highContrast ? '1' : '0');
    root.style.setProperty('--reduced-motion', accessibility.reducedMotion ? '1' : '0');
    root.style.setProperty('--focus-indicators', accessibility.focusIndicators ? '1' : '0');

    // Save theme to localStorage
    localStorage.setItem('windows11-theme', JSON.stringify(currentTheme));
  }, [currentTheme, accessibility]);

  // Apply accessibility settings to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme.type);
    document.documentElement.setAttribute('data-high-contrast', accessibility.highContrast.toString());
    document.documentElement.setAttribute('data-reduced-motion', accessibility.reducedMotion.toString());
    
    // Save accessibility settings
    localStorage.setItem('windows11-accessibility', JSON.stringify(accessibility));
  }, [currentTheme.type, accessibility]);

  const handleSetTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
  };

  const handleToggleTheme = () => {
    const newThemeType = currentTheme.type === 'light' ? 'dark' : 'light';
    setCurrentTheme(themes[newThemeType]);
  };

  const handleSetAccessibility = (config: AccessibilityConfig) => {
    setAccessibility(config);
  };

  const value: ThemeContextType = {
    theme: currentTheme,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
    accessibility,
    setAccessibility: handleSetAccessibility,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for accessing current theme colors
export function useThemeColors() {
  const { theme } = useTheme();
  return theme.colors;
}

// Hook for accessing current theme animations
export function useThemeAnimations() {
  const { theme } = useTheme();
  return theme.animations;
}

// Hook for checking accessibility preferences
export function useAccessibility() {
  const { accessibility } = useTheme();
  return accessibility;
}

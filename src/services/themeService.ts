export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

import { logger, errorToLogContext } from '../lib/logger';

export interface Theme {
  id: string;
  name: string;
  description: string;
  type: 'light' | 'dark' | 'auto';
  colors: ColorScheme;
  typography: {
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large';
    fontWeight: 'light' | 'normal' | 'bold';
    lineHeight: number;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: 'fast' | 'normal' | 'slow';
    easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
  customCSS?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: Omit<Theme, 'id'>;
}

export class ThemeService {
  private currentTheme: Theme;
  private themes: Map<string, Theme> = new Map();
  private presets: ThemePreset[] = [];
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    this.initializePresets();
    this.loadThemes();
    this.currentTheme = this.getDefaultTheme();
    this.applyTheme(this.currentTheme);
  }

  private initializePresets() {
    this.presets = [
      {
        id: 'modern-light',
        name: 'Modern Light',
        description: 'Clean and contemporary light theme with subtle gradients',
        theme: {
          name: 'Modern Light',
          description: 'Clean and contemporary light theme with subtle gradients',
          type: 'light',
          colors: {
            primary: '#6366F1',
            secondary: '#8B5CF6',
            accent: '#F59E0B',
            background: '#FAFAFA',
            surface: '#FFFFFF',
            text: '#1F2937',
            textSecondary: '#6B7280',
            border: '#E5E7EB',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
          },
          typography: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 'medium',
            fontWeight: 'normal',
            lineHeight: 1.6,
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: {
            sm: '6px',
            md: '8px',
            lg: '12px',
            xl: '16px',
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          animations: {
            duration: 'normal',
            easing: 'ease-out',
          },
        },
      },
      {
        id: 'modern-dark',
        name: 'Modern Dark',
        description: 'Sleek dark theme with vibrant accents and smooth gradients',
        theme: {
          name: 'Modern Dark',
          description: 'Sleek dark theme with vibrant accents and smooth gradients',
          type: 'dark',
          colors: {
            primary: '#818CF8',
            secondary: '#A78BFA',
            accent: '#FBBF24',
            background: '#0F172A',
            surface: '#1E293B',
            text: '#F8FAFC',
            textSecondary: '#CBD5E1',
            border: '#334155',
            success: '#34D399',
            warning: '#FBBF24',
            error: '#F87171',
            info: '#60A5FA',
          },
          typography: {
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 'medium',
            fontWeight: 'normal',
            lineHeight: 1.6,
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: {
            sm: '6px',
            md: '8px',
            lg: '12px',
            xl: '16px',
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
          },
          animations: {
            duration: 'normal',
            easing: 'ease-out',
          },
        },
      },
      {
        id: 'windows11-light',
        name: 'Windows 11 Light',
        description: 'Clean and modern Windows 11 light theme',
        theme: {
          name: 'Windows 11 Light',
          description: 'Clean and modern Windows 11 light theme',
          type: 'light',
          colors: {
            primary: '#0078D4',
            secondary: '#106EBE',
            accent: '#0078D4',
            background: '#FFFFFF',
            surface: '#F3F2F1',
            text: '#323130',
            textSecondary: '#605E5C',
            border: '#E1DFDD',
            success: '#107C10',
            warning: '#FF8C00',
            error: '#D13438',
            info: '#0078D4',
          },
          typography: {
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            fontSize: 'medium',
            fontWeight: 'normal',
            lineHeight: 1.5,
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: {
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
          },
          shadows: {
            sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
            md: '0 4px 8px rgba(0, 0, 0, 0.1)',
            lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
            xl: '0 16px 32px rgba(0, 0, 0, 0.1)',
          },
          animations: {
            duration: 'normal',
            easing: 'ease-out',
          },
        },
      },
      {
        id: 'windows11-dark',
        name: 'Windows 11 Dark',
        description: 'Sleek and elegant Windows 11 dark theme',
        theme: {
          name: 'Windows 11 Dark',
          description: 'Sleek and elegant Windows 11 dark theme',
          type: 'dark',
          colors: {
            primary: '#0078D4',
            secondary: '#106EBE',
            accent: '#0078D4',
            background: '#202020',
            surface: '#2D2D30',
            text: '#FFFFFF',
            textSecondary: '#CCCCCC',
            border: '#3E3E42',
            success: '#107C10',
            warning: '#FF8C00',
            error: '#D13438',
            info: '#0078D4',
          },
          typography: {
            fontFamily: 'Segoe UI, system-ui, sans-serif',
            fontSize: 'medium',
            fontWeight: 'normal',
            lineHeight: 1.5,
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: {
            sm: '4px',
            md: '8px',
            lg: '12px',
            xl: '16px',
          },
          shadows: {
            sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
            md: '0 4px 8px rgba(0, 0, 0, 0.3)',
            lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
            xl: '0 16px 32px rgba(0, 0, 0, 0.3)',
          },
          animations: {
            duration: 'normal',
            easing: 'ease-out',
          },
        },
      },
      {
        id: 'macos-light',
        name: 'macOS Light',
        description: 'Clean and minimal macOS-inspired light theme',
        theme: {
          name: 'macOS Light',
          description: 'Clean and minimal macOS-inspired light theme',
          type: 'light',
          colors: {
            primary: '#007AFF',
            secondary: '#5856D6',
            accent: '#FF9500',
            background: '#FFFFFF',
            surface: '#F2F2F7',
            text: '#000000',
            textSecondary: '#6D6D70',
            border: '#C6C6C8',
            success: '#34C759',
            warning: '#FF9500',
            error: '#FF3B30',
            info: '#007AFF',
          },
          typography: {
            fontFamily: 'SF Pro Display, system-ui, sans-serif',
            fontSize: 'medium',
            fontWeight: 'normal',
            lineHeight: 1.4,
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: {
            sm: '6px',
            md: '10px',
            lg: '14px',
            xl: '18px',
          },
          shadows: {
            sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
            md: '0 4px 12px rgba(0, 0, 0, 0.1)',
            lg: '0 8px 24px rgba(0, 0, 0, 0.1)',
            xl: '0 16px 48px rgba(0, 0, 0, 0.1)',
          },
          animations: {
            duration: 'fast',
            easing: 'ease-out',
          },
        },
      },
      {
        id: 'ubuntu-light',
        name: 'Ubuntu Light',
        description: 'Warm and friendly Ubuntu-inspired light theme',
        theme: {
          name: 'Ubuntu Light',
          description: 'Warm and friendly Ubuntu-inspired light theme',
          type: 'light',
          colors: {
            primary: '#E95420',
            secondary: '#77216F',
            accent: '#E95420',
            background: '#FFFFFF',
            surface: '#F7F7F7',
            text: '#2C001E',
            textSecondary: '#5E5E5E',
            border: '#DEDEDE',
            success: '#38B44A',
            warning: '#EFB73E',
            error: '#DF382C',
            info: '#17A2B8',
          },
          typography: {
            fontFamily: 'Ubuntu, system-ui, sans-serif',
            fontSize: 'medium',
            fontWeight: 'normal',
            lineHeight: 1.5,
          },
          spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px',
          },
          borderRadius: {
            sm: '2px',
            md: '4px',
            lg: '8px',
            xl: '12px',
          },
          shadows: {
            sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
            md: '0 2px 4px rgba(0, 0, 0, 0.1)',
            lg: '0 4px 8px rgba(0, 0, 0, 0.1)',
            xl: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
          animations: {
            duration: 'normal',
            easing: 'ease',
          },
        },
      },
    ];
  }

  private getDefaultTheme(): Theme {
    const defaultPreset = this.presets.find(p => p.id === 'modern-light');
    if (defaultPreset) {
      return {
        id: 'default',
        ...defaultPreset.theme,
      };
    }
    
    // Fallback theme
    return {
      id: 'default',
      name: 'Default',
      description: 'Default theme',
      type: 'light',
      colors: {
        primary: '#0078D4',
        secondary: '#106EBE',
        accent: '#0078D4',
        background: '#FFFFFF',
        surface: '#F3F2F1',
        text: '#323130',
        textSecondary: '#605E5C',
        border: '#E1DFDD',
        success: '#107C10',
        warning: '#FF8C00',
        error: '#D13438',
        info: '#0078D4',
      },
      typography: {
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: 'medium',
        fontWeight: 'normal',
        lineHeight: 1.5,
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
        xl: '0 16px 32px rgba(0, 0, 0, 0.1)',
      },
      animations: {
        duration: 'normal',
        easing: 'ease-out',
      },
    };
  }

  private loadThemes() {
    if (typeof window === 'undefined') return;
    const savedThemes = localStorage.getItem('durgasos-themes');
    if (savedThemes) {
      try {
        const themes = JSON.parse(savedThemes);
        themes.forEach((theme: Theme) => {
          this.themes.set(theme.id, theme);
        });
      } catch (error) {
        logger.error('Failed to load themes:', errorToLogContext(error));
      }
    }
  }

  private saveThemes() {
    if (typeof window === 'undefined') return;
    const themes = Array.from(this.themes.values());
    localStorage.setItem('durgasos-themes', JSON.stringify(themes));
  }

  private applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--line-height', theme.typography.lineHeight.toString());

    // Apply custom CSS
    if (theme.customCSS) {
      let styleElement = document.getElementById('custom-theme-css');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-css';
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = theme.customCSS;
    }

    // Apply theme class
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${theme.type}`);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  getThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  getPresets(): ThemePreset[] {
    return this.presets;
  }

  setTheme(themeId: string): boolean {
    const theme = this.themes.get(themeId);
    if (theme) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.notifyListeners();
      return true;
    }
    return false;
  }

  createTheme(theme: Omit<Theme, 'id'>): string {
    const id = `theme_${Date.now()}`;
    const newTheme: Theme = {
      id,
      ...theme,
    };
    
    this.themes.set(id, newTheme);
    this.saveThemes();
    return id;
  }

  updateTheme(themeId: string, updates: Partial<Theme>): boolean {
    const theme = this.themes.get(themeId);
    if (theme) {
      const updatedTheme = { ...theme, ...updates };
      this.themes.set(themeId, updatedTheme);
      this.saveThemes();
      
      if (themeId === this.currentTheme.id) {
        this.currentTheme = updatedTheme;
        this.applyTheme(updatedTheme);
        this.notifyListeners();
      }
      return true;
    }
    return false;
  }

  deleteTheme(themeId: string): boolean {
    if (this.themes.has(themeId)) {
      this.themes.delete(themeId);
      this.saveThemes();
      
      if (themeId === this.currentTheme.id) {
        this.currentTheme = this.getDefaultTheme();
        this.applyTheme(this.currentTheme);
        this.notifyListeners();
      }
      return true;
    }
    return false;
  }

  duplicateTheme(themeId: string): string | null {
    const theme = this.themes.get(themeId);
    if (theme) {
      const duplicatedTheme: Theme = {
        ...theme,
        id: `theme_${Date.now()}`,
        name: `${theme.name} (Copy)`,
      };
      
      this.themes.set(duplicatedTheme.id, duplicatedTheme);
      this.saveThemes();
      return duplicatedTheme.id;
    }
    return null;
  }

  exportTheme(themeId: string): string | null {
    const theme = this.themes.get(themeId);
    if (theme) {
      return JSON.stringify(theme, null, 2);
    }
    return null;
  }

  importTheme(themeData: string): string | null {
    try {
      const theme: Theme = JSON.parse(themeData);
      const id = `theme_${Date.now()}`;
      const importedTheme: Theme = {
        ...theme,
        id,
      };
      
      this.themes.set(id, importedTheme);
      this.saveThemes();
      return id;
    } catch (error) {
      logger.error('Failed to import theme:', errorToLogContext(error));
      return null;
    }
  }

  createFromPreset(presetId: string): string | null {
    const preset = this.presets.find(p => p.id === presetId);
    if (preset) {
      return this.createTheme(preset.theme);
    }
    return null;
  }

  onThemeChange(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentTheme));
  }

  generateColorPalette(baseColor: string): ColorScheme {
    // Simple color palette generation
    const hsl = this.hexToHsl(baseColor);
    
    return {
      primary: baseColor,
      secondary: this.hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.max(0, hsl.l - 20)),
      accent: this.hslToHex(hsl.h, Math.min(100, hsl.s + 20), Math.min(100, hsl.l + 20)),
      background: '#FFFFFF',
      surface: '#F3F2F1',
      text: '#323130',
      textSecondary: '#605E5C',
      border: '#E1DFDD',
      success: '#107C10',
      warning: '#FF8C00',
      error: '#D13438',
      info: baseColor,
    };
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
}

// Singleton instance
export const themeService = new ThemeService();

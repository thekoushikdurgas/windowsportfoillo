'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { themeService, type Theme } from '@/services/themeService';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => boolean;
  themes: Theme[];
  presets: Theme[];
  createTheme: (theme: Omit<Theme, 'id'>) => string;
  updateTheme: (themeId: string, updates: Partial<Theme>) => boolean;
  deleteTheme: (themeId: string) => boolean;
  duplicateTheme: (themeId: string) => string | null;
  exportTheme: (themeId: string) => string | null;
  importTheme: (themeData: string) => string | null;
  createFromPreset: (presetId: string) => string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(themeService.getCurrentTheme());
  const [themes, setThemes] = useState<Theme[]>(themeService.getThemes());
  const [presets] = useState<Theme[]>(themeService.getPresets().map(preset => {
    const theme: Theme = {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      type: preset.theme.type,
      colors: preset.theme.colors,
      typography: preset.theme.typography,
      spacing: preset.theme.spacing,
      borderRadius: preset.theme.borderRadius,
      shadows: preset.theme.shadows,
      animations: preset.theme.animations,
    };
    if (preset.theme.customCSS) {
      theme.customCSS = preset.theme.customCSS;
    }
    return theme;
  }));

  useEffect(() => {
    const unsubscribe = themeService.onThemeChange((newTheme) => {
      setThemeState(newTheme);
      setThemes(themeService.getThemes());
    });

    return unsubscribe;
  }, []);

  const setTheme = (themeId: string) => {
    const success = themeService.setTheme(themeId);
    if (success) {
      setThemeState(themeService.getCurrentTheme());
    }
    return success;
  };

  const createTheme = (themeData: Omit<Theme, 'id'>) => {
    const id = themeService.createTheme(themeData);
    setThemes(themeService.getThemes());
    return id;
  };

  const updateTheme = (themeId: string, updates: Partial<Theme>) => {
    const success = themeService.updateTheme(themeId, updates);
    if (success) {
      setThemes(themeService.getThemes());
      if (themeId === theme.id) {
        setThemeState(themeService.getCurrentTheme());
      }
    }
    return success;
  };

  const deleteTheme = (themeId: string) => {
    const success = themeService.deleteTheme(themeId);
    if (success) {
      setThemes(themeService.getThemes());
    }
    return success;
  };

  const duplicateTheme = (themeId: string) => {
    const id = themeService.duplicateTheme(themeId);
    if (id) {
      setThemes(themeService.getThemes());
    }
    return id;
  };

  const exportTheme = (themeId: string) => {
    return themeService.exportTheme(themeId);
  };

  const importTheme = (themeData: string) => {
    const id = themeService.importTheme(themeData);
    if (id) {
      setThemes(themeService.getThemes());
    }
    return id;
  };

  const createFromPreset = (presetId: string) => {
    const id = themeService.createFromPreset(presetId);
    if (id) {
      setThemes(themeService.getThemes());
    }
    return id;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes,
        presets,
        createTheme,
        updateTheme,
        deleteTheme,
        duplicateTheme,
        exportTheme,
        importTheme,
        createFromPreset,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

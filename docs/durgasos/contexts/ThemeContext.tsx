import React, { createContext, useContext, useState, useEffect } from 'react';
import { WALLPAPERS, ACCENT_COLORS } from '../constants';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  wallpaperUrl: string;
  setWallpaperUrl: (url: string) => void;
  accentColor: typeof ACCENT_COLORS[0];
  setAccentColor: (color: typeof ACCENT_COLORS[0]) => void;
  transparencyEffect: boolean;
  toggleTransparency: () => void;
  centerTaskbar: boolean;
  toggleTaskbarAlignment: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [wallpaperUrl, setWallpaperUrl] = useState(WALLPAPERS[0].url);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [transparencyEffect, setTransparencyEffect] = useState(true);
  const [centerTaskbar, setCenterTaskbar] = useState(true);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme: () => setIsDarkMode(prev => !prev), 
      wallpaperUrl, 
      setWallpaperUrl,
      accentColor,
      setAccentColor,
      transparencyEffect,
      toggleTransparency: () => setTransparencyEffect(prev => !prev),
      centerTaskbar,
      toggleTaskbarAlignment: () => setCenterTaskbar(prev => !prev)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor, Contrast } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, accessibility, setAccessibility } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    {
      id: 'light',
      name: 'Light',
      icon: <Sun className="w-4 h-4" />,
      description: 'Light theme'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      description: 'Dark theme'
    },
    {
      id: 'auto',
      name: 'Auto',
      icon: <Monitor className="w-4 h-4" />,
      description: 'System preference'
    },
    {
      id: 'highContrast',
      name: 'High Contrast',
      icon: <Contrast className="w-4 h-4" />,
      description: 'High contrast theme'
    }
  ];

  const currentTheme = themeOptions.find(t => t.id === theme.type) || themeOptions[0];

  const handleThemeChange = (themeId: string) => {
    if (themeId === 'highContrast') {
      setTheme({
        ...theme,
        name: 'High Contrast',
        type: 'dark',
        colors: {
          ...theme.colors,
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
        }
      });
      setAccessibility({
        ...accessibility,
        highContrast: true
      });
    } else {
      setTheme({
        ...theme,
        type: themeId as 'light' | 'dark' | 'auto'
      });
      if (themeId !== 'auto') {
        setAccessibility({
          ...accessibility,
          highContrast: false
        });
      }
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-100 transition-colors"
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center justify-center w-6 h-6">
          {currentTheme.icon}
        </div>
        {showLabel && (
          <span className="text-sm font-medium">{currentTheme.name}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-48 bg-surface-50 border border-surface-300 rounded-lg shadow-xl py-1 z-50"
          >
            {themeOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ backgroundColor: 'var(--color-surface-100)' }}
                onClick={() => handleThemeChange(option.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-surface-100 transition-colors ${
                  currentTheme.id === option.id ? 'bg-primary-100 text-primary-700' : 'text-surface-900'
                }`}
                aria-pressed={currentTheme.id === option.id}
              >
                <span className={currentTheme.id === option.id ? 'text-primary-500' : 'text-surface-600'}>
                  {option.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{option.name}</div>
                  <div className="text-xs text-surface-600">{option.description}</div>
                </div>
                {currentTheme.id === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-primary-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

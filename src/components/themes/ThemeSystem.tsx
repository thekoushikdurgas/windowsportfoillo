'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSettings } from '@/store/settingsStore'

export interface Theme {
  id: string
  name: string
  type: 'light' | 'dark' | 'auto'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  animations: {
    fast: string
    normal: string
    slow: string
  }
}

export interface ThemeContextType {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  themes: Theme[]
  isDark: boolean
  isLight: boolean
  isAuto: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Default themes
const defaultThemes: Theme[] = [
  {
    id: 'windows-11-light',
    name: 'Windows 11 Light',
    type: 'light',
    colors: {
      primary: '#0078d4',
      secondary: '#106ebe',
      accent: '#0078d4',
      background: '#ffffff',
      surface: '#f3f3f3',
      text: '#323130',
      textSecondary: '#605e5c',
      border: '#d2d0ce',
      success: '#107c10',
      warning: '#ff8c00',
      error: '#d83b01',
      info: '#0078d4'
    },
    fonts: {
      primary: 'Segoe UI, system-ui, sans-serif',
      secondary: 'Segoe UI Variable, system-ui, sans-serif',
      mono: 'Consolas, Monaco, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
      xl: '0 20px 25px rgba(0,0,0,0.1)'
    },
    animations: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s'
    }
  },
  {
    id: 'windows-11-dark',
    name: 'Windows 11 Dark',
    type: 'dark',
    colors: {
      primary: '#0078d4',
      secondary: '#106ebe',
      accent: '#0078d4',
      background: '#202020',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#c5c5c5',
      border: '#404040',
      success: '#107c10',
      warning: '#ff8c00',
      error: '#d83b01',
      info: '#0078d4'
    },
    fonts: {
      primary: 'Segoe UI, system-ui, sans-serif',
      secondary: 'Segoe UI Variable, system-ui, sans-serif',
      mono: 'Consolas, Monaco, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.3)',
      md: '0 4px 6px rgba(0,0,0,0.4)',
      lg: '0 10px 15px rgba(0,0,0,0.4)',
      xl: '0 20px 25px rgba(0,0,0,0.4)'
    },
    animations: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s'
    }
  },
  {
    id: 'macos-light',
    name: 'macOS Light',
    type: 'light',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      background: '#ffffff',
      surface: '#f2f2f7',
      text: '#000000',
      textSecondary: '#6d6d70',
      border: '#c6c6c8',
      success: '#34c759',
      warning: '#ff9500',
      error: '#ff3b30',
      info: '#007AFF'
    },
    fonts: {
      primary: 'SF Pro Display, system-ui, sans-serif',
      secondary: 'SF Pro Text, system-ui, sans-serif',
      mono: 'SF Mono, Monaco, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
      xl: '0 20px 25px rgba(0,0,0,0.1)'
    },
    animations: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s'
    }
  },
  {
    id: 'macos-dark',
    name: 'macOS Dark',
    type: 'dark',
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      accent: '#FF9F0A',
      background: '#000000',
      surface: '#1c1c1e',
      text: '#ffffff',
      textSecondary: '#8e8e93',
      border: '#38383a',
      success: '#30d158',
      warning: '#ff9f0a',
      error: '#ff453a',
      info: '#0a84ff'
    },
    fonts: {
      primary: 'SF Pro Display, system-ui, sans-serif',
      secondary: 'SF Pro Text, system-ui, sans-serif',
      mono: 'SF Mono, Monaco, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.3)',
      md: '0 4px 6px rgba(0,0,0,0.4)',
      lg: '0 10px 15px rgba(0,0,0,0.4)',
      xl: '0 20px 25px rgba(0,0,0,0.4)'
    },
    animations: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s'
    }
  },
  {
    id: 'ubuntu-light',
    name: 'Ubuntu Light',
    type: 'light',
    colors: {
      primary: '#E95420',
      secondary: '#77216F',
      accent: '#F7A072',
      background: '#ffffff',
      surface: '#f7f7f7',
      text: '#2c2c2c',
      textSecondary: '#666666',
      border: '#d0d0d0',
      success: '#38b44a',
      warning: '#efb73e',
      error: '#df382c',
      info: '#17a2b8'
    },
    fonts: {
      primary: 'Ubuntu, system-ui, sans-serif',
      secondary: 'Ubuntu, system-ui, sans-serif',
      mono: 'Ubuntu Mono, Monaco, monospace'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
      xl: '0 20px 25px rgba(0,0,0,0.1)'
    },
    animations: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s'
    }
  }
]

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themes] = useState<Theme[]>(defaultThemes)
  const [currentThemeId, setCurrentThemeId] = useState('windows-11-dark')
  const settings = useSettings()

  const currentTheme = themes.find(theme => theme.id === currentThemeId) || themes[0]
  const isDark = currentTheme.type === 'dark'
  const isLight = currentTheme.type === 'light'
  const isAuto = currentTheme.type === 'auto'

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Set CSS custom properties
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    Object.entries(currentTheme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value)
    })
    
    Object.entries(currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })
    
    Object.entries(currentTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value)
    })
    
    Object.entries(currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })
    
    Object.entries(currentTheme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value)
    })

    // Set theme class
    root.className = currentTheme.type
  }, [currentTheme])

  // Handle auto theme
  useEffect(() => {
    if (isAuto) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        const themeId = e.matches ? 'windows-11-dark' : 'windows-11-light'
        setCurrentThemeId(themeId)
      }

      handleChange(mediaQuery)
      mediaQuery.addEventListener('change', handleChange)

      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [isAuto])

  // Sync with settings
  useEffect(() => {
    if (settings.personalization.theme !== currentTheme.type) {
      const themeId = settings.personalization.theme === 'dark' ? 'windows-11-dark' : 'windows-11-light'
      setCurrentThemeId(themeId)
    }
  }, [settings.personalization.theme, currentTheme.type])

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId)
  }

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    themes,
    isDark,
    isLight,
    isAuto
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme selector component
export const ThemeSelector = () => {
  const { currentTheme, setTheme, themes } = useTheme()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Choose Theme</h3>
      <div className="grid grid-cols-1 gap-3">
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              currentTheme.id === theme.id
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : 'border-gray-600 bg-gray-700 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-white"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div className="text-left">
                <div className="text-white font-medium">{theme.name}</div>
                <div className="text-gray-400 text-sm capitalize">{theme.type}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Theme preview component
export const ThemePreview = ({ theme }: { theme: Theme }) => {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
        color: theme.colors.text
      }}
    >
      <div className="space-y-3">
        <div
          className="h-8 rounded"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div className="space-y-2">
          <div
            className="h-4 rounded"
            style={{ backgroundColor: theme.colors.surface }}
          />
          <div
            className="h-4 rounded w-3/4"
            style={{ backgroundColor: theme.colors.surface }}
          />
        </div>
        <div className="flex space-x-2">
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: theme.colors.success }}
          />
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: theme.colors.warning }}
          />
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: theme.colors.error }}
          />
        </div>
      </div>
    </div>
  )
}

// CSS-in-JS theme application
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value)
  })
  
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value)
  })
  
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--border-radius-${key}`, value)
  })
  
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value)
  })
  
  Object.entries(theme.animations).forEach(([key, value]) => {
    root.style.setProperty(`--animation-${key}`, value)
  })
}

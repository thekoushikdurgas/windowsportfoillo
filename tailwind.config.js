/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Windows 11 Fluent Design Colors
        'windows-blue': '#0078d4',
        'windows-blue-dark': '#106ebe',
        'windows-blue-light': '#deecf9',
        'windows-gray': '#f3f2f1',
        'windows-gray-dark': '#323130',
        'windows-gray-light': '#faf9f8',
        'windows-accent': '#0078d4',
        'windows-accent-light': '#deecf9',
        'windows-surface': '#ffffff',
        'windows-surface-dark': '#1e1e1e',
        'windows-surface-elevated': '#ffffff',
        'windows-surface-elevated-dark': '#2d2d30',
        'taskbar': 'rgba(32, 32, 32, 0.8)',
        'taskbar-dark': 'rgba(0, 0, 0, 0.9)',
        'window-border': '#e1dfdd',
        'window-border-dark': '#3b3a39',
        'start-menu': '#f3f2f1',
        'start-menu-dark': '#2d2d30',
        'text-primary': '#323130',
        'text-primary-dark': '#ffffff',
        'text-secondary': '#605e5c',
        'text-secondary-dark': '#a19f9d',
        'background': '#ffffff',
        'background-dark': '#1e1e1e',
        'foreground': '#323130',
        'foreground-dark': '#ffffff',
        'border': '#e1dfdd',
        'border-dark': '#3b3a39',
        'ring-windows-blue': '#0078d4',
        'ring-offset-windows-surface': '#ffffff',
        'ring-offset-windows-surface-dark': '#1e1e1e',
      },
      borderRadius: {
        'windows': '8px',
        'windows-sm': '4px',
        'windows-lg': '12px',
        'windows-xl': '16px',
      },
      boxShadow: {
        'windows': '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'windows-lg': '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
        'windows-xl': '0 12px 24px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)',
        'windows-inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'segoe': ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      animation: {
        'boot-spin': 'spin 2s linear infinite',
        'boot-fade': 'fadeIn 1s ease-in-out',
        'window-open': 'windowOpen 0.2s ease-out',
        'window-close': 'windowClose 0.15s ease-in',
        'start-menu-open': 'startMenuOpen 0.3s cubic-bezier(0.1, 0.9, 0.2, 1)',
        'start-menu-close': 'startMenuClose 0.2s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        windowOpen: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.8) translateY(-10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        windowClose: {
          '0%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.8) translateY(-10px)',
          },
        },
        startMenuOpen: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        startMenuClose: {
          '0%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

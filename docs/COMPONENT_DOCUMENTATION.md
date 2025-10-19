# durgasOS Component Documentation

## Overview

durgasOS is a modern Windows 11 clone built with Next.js, TypeScript, and Tailwind CSS. This document provides comprehensive documentation for all components, their usage, and best practices.

## Table of Contents

1. [Design System](#design-system)
2. [Core Components](#core-components)
3. [Application Components](#application-components)
4. [Utility Components](#utility-components)
5. [Hooks](#hooks)
6. [Performance Optimization](#performance-optimization)
7. [Accessibility](#accessibility)
8. [Responsive Design](#responsive-design)

## Design System

### Design Tokens

The design system uses CSS custom properties and Tailwind utilities for consistent styling.

```css
/* Colors */
--windows-blue: #0078d4
--windows-gray: #f3f2f1
--windows-surface: #ffffff
--windows-text-primary: #323130

/* Spacing */
--space-xs: 0.25rem   /* 4px */
--space-sm: 0.5rem    /* 8px */
--space-md: 0.75rem   /* 12px */
--space-lg: 1rem      /* 16px */

/* Border Radius */
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px

/* Shadows */
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)
```

### Usage

```tsx
import { useResponsive } from '@/hooks/useResponsive'

function MyComponent() {
  const { isMobile, getResponsiveValue } = useResponsive()
  
  return (
    <div className="bg-windows-surface dark:bg-windows-surface-dark rounded-windows shadow-windows">
      Content
    </div>
  )
}
```

## Core Components

### Desktop

The main desktop component that manages the overall layout and state.

```tsx
import Desktop from '@/components/desktop/Desktop'

function App() {
  return <Desktop />
}
```

**Features:**
- Desktop wallpaper management
- Desktop icon positioning
- Context menu integration
- Keyboard shortcuts
- Window management

### Taskbar

The taskbar component with responsive design and mobile support.

```tsx
import Taskbar from '@/components/taskbar/Taskbar'

function App() {
  return <Taskbar />
}
```

**Props:**
- `showTaskbar: boolean` - Controls taskbar visibility
- `taskbarPosition: 'bottom' | 'top' | 'left' | 'right'` - Taskbar position

**Features:**
- Start button
- Application icons
- System tray
- Mobile-optimized layout

### Start Menu

The start menu with application grid and search functionality.

```tsx
import StartMenu from '@/components/startmenu/StartMenu'

function App() {
  return <StartMenu />
}
```

**Features:**
- Application grid
- Search functionality
- User profile section
- Power options
- Responsive sizing

### Window

The window component with drag, resize, and focus management.

```tsx
import Window from '@/components/windows/Window'

function App() {
  return (
    <Window
      window={windowState}
      isFocused={true}
    />
  )
}
```

**Props:**
- `window: WindowState` - Window state object
- `isFocused: boolean` - Whether window is focused

**Features:**
- Drag and drop
- Resize handles
- Window controls (minimize, maximize, close)
- Focus management
- Responsive constraints

## Application Components

### File Explorer

A full-featured file management application.

```tsx
import FileExplorer from '@/components/apps/FileExplorer/FileExplorer'

function App() {
  return (
    <FileExplorer
      window={windowState}
    />
  )
}
```

**Features:**
- Sidebar navigation
- List and grid view modes
- File selection
- Quick access
- Responsive layout

### Settings

A comprehensive settings application with categorized options.

```tsx
import Settings from '@/components/apps/Settings/Settings'

function App() {
  return (
    <Settings
      window={windowState}
    />
  )
}
```

**Features:**
- Categorized settings
- Search functionality
- System preferences
- Personalization options
- Responsive design

### Calculator

A basic calculator application.

```tsx
import Calculator from '@/components/apps/Calculator/Calculator'

function App() {
  return (
    <Calculator
      window={windowState}
    />
  )
}
```

### Notepad

A simple text editor application.

```tsx
import Notepad from '@/components/apps/Notepad/Notepad'

function App() {
  return (
    <Notepad
      window={windowState}
    />
  )
}
```

## Utility Components

### Context Menu

A desktop context menu with accessibility support.

```tsx
import ContextMenu, { desktopContextMenuItems } from '@/components/ui/ContextMenu'

function App() {
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 }
  })

  return (
    <ContextMenu
      isOpen={contextMenu.isOpen}
      position={contextMenu.position}
      items={desktopContextMenuItems}
      onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
    />
  )
}
```

**Features:**
- Right-click activation
- Keyboard navigation
- Submenu support
- Accessibility compliant

### Accessible Context Menu

An enhanced context menu with full accessibility support.

```tsx
import AccessibleContextMenu from '@/components/ui/AccessibleContextMenu'

function App() {
  return (
    <AccessibleContextMenu
      isOpen={isOpen}
      position={position}
      items={items}
      onClose={onClose}
    />
  )
}
```

## Hooks

### useResponsive

Hook for responsive design and screen size detection.

```tsx
import { useResponsive } from '@/hooks/useResponsive'

function MyComponent() {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    windowSize, 
    getResponsiveValue 
  } = useResponsive()

  const width = getResponsiveValue({
    mobile: '100%',
    tablet: '50%',
    desktop: '33%'
  })

  return <div style={{ width }}>Content</div>
}
```

### usePerformanceMonitor

Hook for performance monitoring and optimization.

```tsx
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

function MyComponent() {
  const { recordCustomMetric, getMetrics } = usePerformanceMonitor('MyComponent')

  const handleClick = () => {
    recordCustomMetric('click', performance.now())
  }

  return <button onClick={handleClick}>Click me</button>
}
```

### useKeyboardShortcuts

Hook for global keyboard shortcuts.

```tsx
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

function App() {
  useKeyboardShortcuts() // Automatically handles common shortcuts
  return <div>App content</div>
}
```

## Performance Optimization

### Optimized Components

Use optimized versions of components for better performance:

```tsx
import OptimizedWindow from '@/components/optimized/OptimizedWindow'
import OptimizedFileExplorer from '@/components/optimized/OptimizedFileExplorer'
```

**Features:**
- React.memo for preventing unnecessary re-renders
- useMemo for expensive calculations
- useCallback for stable function references
- Performance monitoring

### Animation Configuration

Use optimized animation configurations:

```tsx
import { getAnimations } from '@/config/animations'

function MyComponent() {
  const animations = getAnimations()
  
  return (
    <motion.div
      animate={animations.window.open}
      transition={animations.window.open.transition}
    >
      Content
    </motion.div>
  )
}
```

## Accessibility

### Accessibility Utilities

Use the accessibility utilities for consistent ARIA patterns:

```tsx
import { a11yPatterns, keyboardNavigation } from '@/utils/accessibility'

function MyButton() {
  return (
    <button
      {...a11yPatterns.button({
        'aria-label': 'Close window'
      })}
      onKeyDown={(e) => keyboardNavigation.handleArrowKeys(e, 0, 5, setIndex)}
    >
      Close
    </button>
  )
}
```

### Screen Reader Support

```tsx
import { screenReader } from '@/utils/accessibility'

function MyComponent() {
  const announce = () => {
    screenReader.announce('Window closed', 'polite')
  }

  return (
    <button onClick={announce}>
      Close Window
      <span className="sr-only">This will close the current window</span>
    </button>
  )
}
```

## Responsive Design

### Breakpoints

The system uses the following breakpoints:

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

```tsx
function ResponsiveComponent() {
  return (
    <div className="
      w-full sm:w-1/2 md:w-1/3 lg:w-1/4
      p-2 sm:p-4 md:p-6
      text-sm sm:text-base md:text-lg
    ">
      Content
    </div>
  )
}
```

### Responsive Hooks

```tsx
import { useWindowConstraints } from '@/hooks/useResponsive'

function MyComponent() {
  const { maxWidth, maxHeight } = useWindowConstraints()
  
  return (
    <div style={{ maxWidth, maxHeight }}>
      Content
    </div>
  )
}
```

## Best Practices

### Component Structure

1. Use TypeScript interfaces for props
2. Implement proper error boundaries
3. Use React.memo for performance
4. Follow accessibility guidelines
5. Test with screen readers

### Performance

1. Use optimized components for heavy operations
2. Implement proper memoization
3. Monitor performance metrics
4. Use lazy loading for large components

### Accessibility

1. Provide proper ARIA labels
2. Implement keyboard navigation
3. Support screen readers
4. Test with assistive technologies

### Responsive Design

1. Mobile-first approach
2. Use responsive utilities
3. Test on multiple devices
4. Consider touch interactions

## Troubleshooting

### Common Issues

1. **Performance Issues**: Use optimized components and performance monitoring
2. **Accessibility Issues**: Check ARIA labels and keyboard navigation
3. **Responsive Issues**: Test on different screen sizes
4. **Animation Issues**: Check reduced motion preferences

### Debug Tools

1. React DevTools for component inspection
2. Performance monitoring hooks
3. Accessibility testing tools
4. Responsive design testing

## Contributing

When adding new components:

1. Follow the established patterns
2. Include proper TypeScript types
3. Add accessibility support
4. Include responsive design
5. Add performance optimizations
6. Update documentation

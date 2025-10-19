# DurgasOS API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Store APIs](#store-apis)
3. [Component APIs](#component-apis)
4. [Hook APIs](#hook-apis)
5. [Utility APIs](#utility-apis)
6. [Plugin APIs](#plugin-apis)
7. [Type Definitions](#type-definitions)
8. [Examples](#examples)

## Overview

DurgasOS is a comprehensive Windows 11 replica built with React, TypeScript, and modern web technologies. This documentation covers all the APIs available for developers to extend and customize the operating system.

## Store APIs

### Window Store

The window store manages all window-related state and operations.

#### `useWindowStore()`

Returns the complete window store state and actions.

```typescript
const { windows, focusedWindow, nextZIndex, actions } = useWindowStore()
```

#### `useWindows()`

Returns all windows as a record.

```typescript
const windows = useWindows()
// Returns: Record<string, WindowState>
```

#### `useFocusedWindow()`

Returns the currently focused window ID.

```typescript
const focusedWindow = useFocusedWindow()
// Returns: string | null
```

#### `useWindowActions()`

Returns all window management actions.

```typescript
const {
  openWindow,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  restoreWindow,
  focusWindow,
  updateWindowPosition,
  updateWindowSize,
  setWindowDragging,
  setWindowResizing,
  bringToFront,
  moveWindowToDesktop
} = useWindowActions()
```

#### Actions

##### `openWindow(window: WindowState)`

Opens a new window.

```typescript
const window: WindowState = {
  id: 'window-1',
  title: 'My App',
  appId: 'my-app',
  position: { x: 100, y: 100 },
  size: { width: 800, height: 600 },
  isMinimized: false,
  isMaximized: false,
  isFocused: true,
  zIndex: 1,
  isDragging: false,
  isResizing: false
}

actions.openWindow(window)
```

##### `closeWindow(id: string)`

Closes a window by ID.

```typescript
actions.closeWindow('window-1')
```

##### `minimizeWindow(id: string)`

Minimizes a window.

```typescript
actions.minimizeWindow('window-1')
```

##### `maximizeWindow(id: string)`

Maximizes a window.

```typescript
actions.maximizeWindow('window-1')
```

##### `restoreWindow(id: string)`

Restores a minimized or maximized window.

```typescript
actions.restoreWindow('window-1')
```

##### `focusWindow(id: string)`

Focuses a window. If already focused, minimizes it.

```typescript
actions.focusWindow('window-1')
```

##### `updateWindowPosition(id: string, position: WindowPosition)`

Updates window position.

```typescript
actions.updateWindowPosition('window-1', { x: 200, y: 200 })
```

##### `updateWindowSize(id: string, size: WindowSize)`

Updates window size.

```typescript
actions.updateWindowSize('window-1', { width: 1000, height: 800 })
```

##### `setWindowDragging(id: string, isDragging: boolean)`

Sets window dragging state.

```typescript
actions.setWindowDragging('window-1', true)
```

##### `setWindowResizing(id: string, isResizing: boolean)`

Sets window resizing state.

```typescript
actions.setWindowResizing('window-1', true)
```

##### `bringToFront(id: string)`

Brings window to front.

```typescript
actions.bringToFront('window-1')
```

##### `moveWindowToDesktop(windowId: string, desktopId: string)`

Moves window to a different virtual desktop.

```typescript
actions.moveWindowToDesktop('window-1', 'desktop-2')
```

### Desktop Store

The desktop store manages desktop-related state and operations.

#### `useDesktopStore()`

Returns the complete desktop store state and actions.

```typescript
const {
  wallpaper,
  theme,
  desktopIcons,
  startMenuOpen,
  systemTrayExpanded,
  taskbarPosition,
  showDesktopIcons,
  showTaskbar,
  showSystemTray,
  currentDesktop,
  desktops,
  screenSize,
  settings,
  actions
} = useDesktopStore()
```

#### `useDesktopState()`

Returns desktop state without actions.

```typescript
const {
  wallpaper,
  theme,
  desktopIcons,
  startMenuOpen,
  systemTrayExpanded,
  taskbarPosition,
  showDesktopIcons,
  showTaskbar,
  showSystemTray,
  currentDesktop,
  desktops,
  screenSize
} = useDesktopState()
```

#### `useDesktopActions()`

Returns desktop management actions.

```typescript
const {
  setWallpaper,
  setTheme,
  toggleStartMenu,
  closeStartMenu,
  toggleSystemTray,
  closeSystemTray,
  setFocusedWindow,
  addDesktopIcon,
  removeDesktopIcon,
  updateDesktopIconPosition,
  selectDesktopIcon,
  deselectAllDesktopIcons,
  setTaskbarPosition,
  updateSettings,
  createDesktop,
  deleteDesktop,
  renameDesktop,
  switchDesktop,
  setScreenSize
} = useDesktopActions()
```

#### Actions

##### `setWallpaper(wallpaper: string)`

Sets the desktop wallpaper.

```typescript
actions.setWallpaper('/wallpapers/new-wallpaper.jpg')
```

##### `setTheme(theme: 'light' | 'dark')`

Sets the desktop theme.

```typescript
actions.setTheme('dark')
```

##### `toggleStartMenu()`

Toggles the start menu visibility.

```typescript
actions.toggleStartMenu()
```

##### `closeStartMenu()`

Closes the start menu.

```typescript
actions.closeStartMenu()
```

##### `toggleSystemTray()`

Toggles the system tray visibility.

```typescript
actions.toggleSystemTray()
```

##### `closeSystemTray()`

Closes the system tray.

```typescript
actions.closeSystemTray()
```

##### `setFocusedWindow(windowId: string | null)`

Sets the focused window.

```typescript
actions.setFocusedWindow('window-1')
```

##### `addDesktopIcon(icon: DesktopIcon)`

Adds a desktop icon.

```typescript
const icon: DesktopIcon = {
  id: 'icon-1',
  appId: 'my-app',
  position: { x: 100, y: 100 },
  name: 'My App',
  icon: '🧪',
  isSelected: false
}

actions.addDesktopIcon(icon)
```

##### `removeDesktopIcon(id: string)`

Removes a desktop icon.

```typescript
actions.removeDesktopIcon('icon-1')
```

##### `updateDesktopIconPosition(id: string, position: { x: number; y: number })`

Updates desktop icon position.

```typescript
actions.updateDesktopIconPosition('icon-1', { x: 200, y: 200 })
```

##### `selectDesktopIcon(id: string)`

Selects a desktop icon.

```typescript
actions.selectDesktopIcon('icon-1')
```

##### `deselectAllDesktopIcons()`

Deselects all desktop icons.

```typescript
actions.deselectAllDesktopIcons()
```

##### `setTaskbarPosition(position: 'bottom' | 'top' | 'left' | 'right')`

Sets taskbar position.

```typescript
actions.setTaskbarPosition('top')
```

##### `updateSettings(settings: Partial<DesktopSettings>)`

Updates desktop settings.

```typescript
actions.updateSettings({
  showDesktopIcons: false,
  showTaskbar: true,
  autoHideTaskbar: true
})
```

##### `createDesktop(id: string, name: string)`

Creates a new virtual desktop.

```typescript
actions.createDesktop('desktop-2', 'Desktop 2')
```

##### `deleteDesktop(id: string)`

Deletes a virtual desktop.

```typescript
actions.deleteDesktop('desktop-2')
```

##### `renameDesktop(id: string, name: string)`

Renames a virtual desktop.

```typescript
actions.renameDesktop('desktop-2', 'Work Desktop')
```

##### `switchDesktop(id: string)`

Switches to a virtual desktop.

```typescript
actions.switchDesktop('desktop-2')
```

##### `setScreenSize(size: { width: number; height: number })`

Sets screen size.

```typescript
actions.setScreenSize({ width: 1920, height: 1080 })
```

### App Store

The app store manages application lifecycle and state.

#### `useAppStore()`

Returns the complete app store state and actions.

```typescript
const {
  apps,
  runningApps,
  recentApps,
  pinnedApps,
  desktopIcons,
  actions
} = useAppStore()
```

#### `useApps()`

Returns all installed apps.

```typescript
const apps = useApps()
// Returns: Record<string, AppDefinition>
```

#### `useRunningApps()`

Returns currently running apps.

```typescript
const runningApps = useRunningApps()
// Returns: Record<string, AppInstance>
```

#### `useRecentApps()`

Returns recently used apps.

```typescript
const recentApps = useRecentApps()
// Returns: AppDefinition[]
```

#### `usePinnedApps()`

Returns pinned apps.

```typescript
const pinnedApps = usePinnedApps()
// Returns: AppDefinition[]
```

#### `useDesktopIcons()`

Returns desktop icons.

```typescript
const desktopIcons = useDesktopIcons()
// Returns: DesktopIcon[]
```

#### `useAppActions()`

Returns app management actions.

```typescript
const {
  registerApp,
  unregisterApp,
  launchApp,
  stopApp,
  pinApp,
  unpinApp,
  addToRecent,
  addDesktopIcon,
  removeDesktopIcon,
  updateDesktopIconPosition,
  selectDesktopIcon,
  deselectAllDesktopIcons
} = useAppActions()
```

#### Actions

##### `registerApp(app: AppDefinition)`

Registers a new app.

```typescript
const app: AppDefinition = {
  id: 'my-app',
  name: 'My App',
  icon: '🧪',
  component: MyAppComponent,
  defaultSize: { width: 800, height: 600 },
  defaultPosition: { x: 100, y: 100 },
  category: 'utilities',
  description: 'My custom app',
  version: '1.0.0',
  isSystemApp: false
}

actions.registerApp(app)
```

##### `unregisterApp(id: string)`

Unregisters an app.

```typescript
actions.unregisterApp('my-app')
```

##### `launchApp(id: string)`

Launches an app.

```typescript
const instanceId = actions.launchApp('my-app')
```

##### `stopApp(instanceId: string)`

Stops a running app.

```typescript
actions.stopApp('instance-1')
```

##### `pinApp(id: string)`

Pins an app to the taskbar.

```typescript
actions.pinApp('my-app')
```

##### `unpinApp(id: string)`

Unpins an app from the taskbar.

```typescript
actions.unpinApp('my-app')
```

##### `addToRecent(app: AppDefinition)`

Adds an app to recent apps.

```typescript
actions.addToRecent(app)
```

##### `addDesktopIcon(icon: DesktopIcon)`

Adds a desktop icon.

```typescript
const icon: DesktopIcon = {
  id: 'icon-1',
  appId: 'my-app',
  position: { x: 100, y: 100 },
  name: 'My App',
  icon: '🧪',
  isSelected: false
}

actions.addDesktopIcon(icon)
```

##### `removeDesktopIcon(id: string)`

Removes a desktop icon.

```typescript
actions.removeDesktopIcon('icon-1')
```

##### `updateDesktopIconPosition(id: string, position: { x: number; y: number })`

Updates desktop icon position.

```typescript
actions.updateDesktopIconPosition('icon-1', { x: 200, y: 200 })
```

##### `selectDesktopIcon(id: string)`

Selects a desktop icon.

```typescript
actions.selectDesktopIcon('icon-1')
```

##### `deselectAllDesktopIcons()`

Deselects all desktop icons.

```typescript
actions.deselectAllDesktopIcons()
```

### Settings Store

The settings store manages system settings and preferences.

#### `useSettingsStore()`

Returns the complete settings store state and actions.

```typescript
const {
  personalization,
  system,
  display,
  sound,
  notifications,
  keyboard,
  applications,
  actions
} = useSettingsStore()
```

#### `useSettings()`

Returns all settings.

```typescript
const settings = useSettings()
// Returns: SettingsState
```

#### `useSettingsActions()`

Returns settings management actions.

```typescript
const {
  updatePersonalization,
  updateSystem,
  updateDisplay,
  updateSound,
  updateNotifications,
  updateKeyboard,
  updateApplications,
  resetSettings,
  exportSettings,
  importSettings
} = useSettingsActions()
```

#### Actions

##### `updatePersonalization(settings: Partial<PersonalizationSettings>)`

Updates personalization settings.

```typescript
actions.updatePersonalization({
  theme: 'dark',
  wallpaper: '/wallpapers/new-wallpaper.jpg',
  accentColor: '#0078d4'
})
```

##### `updateSystem(settings: Partial<SystemSettings>)`

Updates system settings.

```typescript
actions.updateSystem({
  language: 'en-US',
  region: 'US',
  timezone: 'America/New_York'
})
```

##### `updateDisplay(settings: Partial<DisplaySettings>)`

Updates display settings.

```typescript
actions.updateDisplay({
  resolution: { width: 1920, height: 1080 },
  scale: 100,
  refreshRate: 60
})
```

##### `updateSound(settings: Partial<SoundSettings>)`

Updates sound settings.

```typescript
actions.updateSound({
  masterVolume: 50,
  systemSounds: true,
  appSounds: true
})
```

##### `updateNotifications(settings: Partial<NotificationSettings>)`

Updates notification settings.

```typescript
actions.updateNotifications({
  showBanners: true,
  playSounds: true,
  doNotDisturb: false
})
```

##### `updateKeyboard(settings: Partial<KeyboardSettings>)`

Updates keyboard settings.

```typescript
actions.updateKeyboard({
  globalShortcutsEnabled: true,
  customShortcuts: []
})
```

##### `updateApplications(settings: Partial<ApplicationSettings>)`

Updates application settings.

```typescript
actions.updateApplications({
  autoStart: ['my-app'],
  defaultApps: {
    browser: 'my-browser',
    textEditor: 'my-editor'
  }
})
```

##### `resetSettings()`

Resets all settings to default.

```typescript
actions.resetSettings()
```

##### `exportSettings()`

Exports settings to JSON.

```typescript
const settingsJson = actions.exportSettings()
```

##### `importSettings(settings: SettingsState)`

Imports settings from JSON.

```typescript
actions.importSettings(settingsJson)
```

### Notification Store

The notification store manages notifications and alerts.

#### `useNotificationStore()`

Returns the complete notification store state and actions.

```typescript
const {
  notifications,
  isOpen,
  unreadCount,
  actions
} = useNotificationStore()
```

#### `useNotifications()`

Returns all notifications.

```typescript
const notifications = useNotifications()
// Returns: Notification[]
```

#### `useNotificationCenter()`

Returns notification center state.

```typescript
const {
  notifications,
  isOpen,
  unreadCount
} = useNotificationCenter()
```

#### `useNotificationActions()`

Returns notification management actions.

```typescript
const {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  clearAll,
  toggleNotificationCenter
} = useNotificationActions()
```

#### Actions

##### `addNotification(notification: Omit<Notification, 'id' | 'timestamp'>)`

Adds a new notification.

```typescript
actions.addNotification({
  title: 'New Message',
  message: 'You have a new message',
  type: 'info',
  priority: 'normal',
  source: 'messaging-app'
})
```

##### `removeNotification(id: string)`

Removes a notification.

```typescript
actions.removeNotification('notification-1')
```

##### `markAsRead(id: string)`

Marks a notification as read.

```typescript
actions.markAsRead('notification-1')
```

##### `markAllAsRead()`

Marks all notifications as read.

```typescript
actions.markAllAsRead()
```

##### `clearAll()`

Clears all notifications.

```typescript
actions.clearAll()
```

##### `toggleNotificationCenter()`

Toggles notification center visibility.

```typescript
actions.toggleNotificationCenter()
```

## Component APIs

### Window Component

The Window component provides a draggable, resizable window with controls.

#### Props

```typescript
interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  initialPosition?: WindowPosition
  initialSize?: WindowSize
  controls?: WindowControls
  resizable?: boolean
  draggable?: boolean
  minSize?: WindowSize
  maxSize?: WindowSize
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}
```

#### Usage

```typescript
<Window
  id="my-window"
  title="My App"
  position={{ x: 100, y: 100 }}
  size={{ width: 800, height: 600 }}
  resizable={true}
  draggable={true}
  onClose={() => console.log('Window closed')}
>
  <div>Window content</div>
</Window>
```

### Desktop Component

The Desktop component provides the main desktop interface.

#### Props

```typescript
interface DesktopProps {
  wallpaper?: string
  theme?: 'light' | 'dark'
  showDesktopIcons?: boolean
  onDesktopClick?: (event: React.MouseEvent) => void
  onDesktopRightClick?: (event: React.MouseEvent) => void
}
```

#### Usage

```typescript
<Desktop
  wallpaper="/wallpapers/custom.jpg"
  theme="dark"
  showDesktopIcons={true}
  onDesktopClick={() => console.log('Desktop clicked')}
  onDesktopRightClick={() => console.log('Desktop right-clicked')}
/>
```

### Taskbar Component

The Taskbar component provides the taskbar interface.

#### Props

```typescript
interface TaskbarProps {
  position?: 'bottom' | 'top' | 'left' | 'right'
  showStartButton?: boolean
  showAppIcons?: boolean
  showSystemTray?: boolean
  showClock?: boolean
  autoHide?: boolean
}
```

#### Usage

```typescript
<Taskbar
  position="bottom"
  showStartButton={true}
  showAppIcons={true}
  showSystemTray={true}
  showClock={true}
  autoHide={false}
/>
```

### StartMenu Component

The StartMenu component provides the start menu interface.

#### Props

```typescript
interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  apps?: AppDefinition[]
  recentApps?: AppDefinition[]
  pinnedApps?: AppDefinition[]
}
```

#### Usage

```typescript
<StartMenu
  isOpen={startMenuOpen}
  onClose={() => setStartMenuOpen(false)}
  apps={apps}
  recentApps={recentApps}
  pinnedApps={pinnedApps}
/>
```

## Hook APIs

### useTouchGestures

Hook for handling touch gestures on mobile devices.

#### Parameters

```typescript
interface TouchGestureConfig {
  tapThreshold?: number
  doubleTapDelay?: number
  longPressDelay?: number
  swipeThreshold?: number
  pinchThreshold?: number
  panThreshold?: number
}
```

#### Usage

```typescript
const { touchPoints, isTouching } = useTouchGestures(
  (gesture) => {
    console.log('Gesture detected:', gesture)
  },
  {
    tapThreshold: 10,
    doubleTapDelay: 300,
    longPressDelay: 500
  }
)
```

### useMobileViewport

Hook for detecting mobile viewport characteristics.

#### Usage

```typescript
const {
  isMobile,
  isTablet,
  isDesktop,
  orientation,
  isPortrait,
  isLandscape
} = useMobileViewport()
```

### useKeyboardShortcuts

Hook for handling keyboard shortcuts.

#### Usage

```typescript
useKeyboardShortcuts()
```

### usePerformanceMonitor

Hook for monitoring performance metrics.

#### Usage

```typescript
const {
  metrics,
  measureRender,
  measureMemory,
  measureFrameRate
} = usePerformanceMonitor()
```

## Utility APIs

### Animation System

The animation system provides various animation components and utilities.

#### Components

- `HoverScale` - Scales element on hover
- `TapScale` - Scales element on tap
- `HoverLift` - Lifts element on hover
- `RippleEffect` - Adds ripple effect on click
- `ShakeAnimation` - Shakes element when triggered
- `PulseAnimation` - Pulses element continuously
- `FloatingAnimation` - Floats element up and down
- `PageTransition` - Provides page transition animations
- `LoadingSpinner` - Shows loading spinner
- `LoadingDots` - Shows loading dots
- `LoadingBar` - Shows loading progress bar
- `SwipeAnimation` - Handles swipe gestures
- `ParallaxScroll` - Provides parallax scrolling
- `MorphingIcon` - Morphs between icon states
- `StaggerContainer` - Staggers child animations
- `StaggerItem` - Individual stagger item

#### Usage

```typescript
import { HoverScale, TapScale, RippleEffect } from '@/components/animations/AnimationSystem'

<HoverScale scale={1.05}>
  <button>Hover me</button>
</HoverScale>

<TapScale scale={0.95}>
  <button>Tap me</button>
</TapScale>

<RippleEffect color="rgba(255,255,255,0.3)">
  <button>Click me</button>
</RippleEffect>
```

### Theme System

The theme system provides theme management and customization.

#### Components

- `ThemeProvider` - Provides theme context
- `ThemeSelector` - Theme selection component
- `ThemePreview` - Theme preview component

#### Usage

```typescript
import { ThemeProvider, useTheme } from '@/components/themes/ThemeSystem'

function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  )
}

function MyComponent() {
  const { currentTheme, setTheme, themes } = useTheme()
  
  return (
    <div>
      <h1>Current theme: {currentTheme.name}</h1>
      <ThemeSelector />
    </div>
  )
}
```

### Drag & Drop System

The drag and drop system provides drag and drop functionality.

#### Components

- `DragDropSystem` - Main drag and drop system
- `withDragDrop` - HOC for draggable components

#### Usage

```typescript
import { DragDropSystem, useDragDrop } from '@/components/ui/DragDropSystem'

function MyComponent() {
  const { createDragItem, createDropZone } = useDragDrop()
  
  return (
    <DragDropSystem>
      <div>Draggable content</div>
    </DragDropSystem>
  )
}
```

### Context Menu System

The context menu system provides advanced context menus.

#### Components

- `AdvancedContextMenu` - Advanced context menu component
- `useContextMenu` - Hook for context menu management

#### Usage

```typescript
import { AdvancedContextMenu, useContextMenu } from '@/components/ui/AdvancedContextMenu'

function MyComponent() {
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu()
  
  const menuItems = [
    {
      id: 'copy',
      label: 'Copy',
      icon: <Copy className="w-4 h-4" />,
      action: () => console.log('Copy clicked')
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: <Paste className="w-4 h-4" />,
      action: () => console.log('Paste clicked')
    }
  ]
  
  return (
    <div onContextMenu={(e) => showContextMenu(e, menuItems)}>
      Right-click me
      <AdvancedContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={contextMenu.items}
        onClose={hideContextMenu}
      />
    </div>
  )
}
```

## Plugin APIs

### Plugin System

The plugin system provides extensibility through plugins.

#### Components

- `PluginProvider` - Provides plugin context
- `PluginManager` - Plugin management component
- `usePlugins` - Hook for plugin management
- `usePlugin` - Hook for individual plugin access

#### Usage

```typescript
import { PluginProvider, usePlugins } from '@/plugins/PluginSystem'

function App() {
  return (
    <PluginProvider>
      <MyApp />
    </PluginProvider>
  )
}

function MyComponent() {
  const { plugins, loadPlugin, unloadPlugin } = usePlugins()
  
  const handleLoadPlugin = async () => {
    const manifest = {
      id: 'my-plugin',
      name: 'My Plugin',
      version: '1.0.0',
      description: 'A custom plugin',
      author: 'Developer',
      main: '/plugins/my-plugin.js',
      apiVersion: '1.0.0'
    }
    
    await loadPlugin(manifest)
  }
  
  return (
    <div>
      <button onClick={handleLoadPlugin}>Load Plugin</button>
      <div>
        {plugins.map(plugin => (
          <div key={plugin.id}>{plugin.name}</div>
        ))}
      </div>
    </div>
  )
}
```

## Type Definitions

### Core Types

```typescript
// Window types
interface WindowState {
  id: string
  title: string
  appId: string
  position: WindowPosition
  size: WindowSize
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  zIndex: number
  isDragging: boolean
  isResizing: boolean
  desktopId?: string
}

interface WindowPosition {
  x: number
  y: number
}

interface WindowSize {
  width: number
  height: number
}

// Desktop types
interface DesktopState {
  wallpaper: string
  theme: 'light' | 'dark'
  desktopIcons: DesktopIcon[]
  openWindows: string[]
  focusedWindow: string | null
  startMenuOpen: boolean
  systemTrayExpanded: boolean
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right'
  showDesktopIcons: boolean
  showTaskbar: boolean
  showSystemTray: boolean
  currentDesktop: string
  desktops: Record<string, VirtualDesktop>
  screenSize: { width: number; height: number }
}

interface DesktopIcon {
  id: string
  appId: string
  position: { x: number; y: number }
  name: string
  icon: string
  isSelected: boolean
}

interface VirtualDesktop {
  id: string
  name: string
  wallpaper: string
  isActive: boolean
  windowCount: number
  createdAt: Date
}

// App types
interface AppDefinition {
  id: string
  name: string
  icon: string
  component: React.ComponentType<any>
  defaultSize: WindowSize
  defaultPosition: WindowPosition
  category: string
  description?: string
  version: string
  isSystemApp: boolean
}

interface AppInstance {
  id: string
  appId: string
  windowId: string
  isRunning: boolean
  startTime: Date
}

// Notification types
interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: Date
  isRead: boolean
  priority: NotificationPriority
  icon?: string
  action?: {
    label: string
    callback: () => void
  }
  duration?: number
  source?: string
}

type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system'
type NotificationPriority = 'low' | 'normal' | 'high' | 'critical'

// Settings types
interface SettingsState {
  personalization: PersonalizationSettings
  system: SystemSettings
  display: DisplaySettings
  sound: SoundSettings
  notifications: NotificationSettings
  keyboard: KeyboardSettings
  applications: ApplicationSettings
}

interface PersonalizationSettings {
  theme: 'light' | 'dark' | 'auto'
  wallpaper: string
  accentColor: string
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right'
  showDesktopIcons: boolean
  showTaskbar: boolean
  showSystemTray: boolean
  autoHideTaskbar: boolean
  showClock: boolean
  showDate: boolean
  showSeconds: boolean
  timeFormat: '12h' | '24h'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
}

interface SystemSettings {
  language: string
  region: string
  timezone: string
  dateTime: string
  accessibility: AccessibilitySettings
}

interface DisplaySettings {
  resolution: { width: number; height: number }
  scale: number
  refreshRate: number
  brightness: number
  nightLight: boolean
  nightLightSchedule: 'sunset' | 'custom'
  nightLightStartTime: string
  nightLightEndTime: string
}

interface SoundSettings {
  masterVolume: number
  systemSounds: boolean
  appSounds: boolean
  inputDevice: string
  outputDevice: string
}

interface NotificationSettings {
  showBanners: boolean
  playSounds: boolean
  doNotDisturb: boolean
  appNotifications: Record<string, boolean>
}

interface KeyboardSettings {
  globalShortcutsEnabled: boolean
  customShortcuts: KeyboardShortcut[]
}

interface ApplicationSettings {
  autoStart: string[]
  defaultApps: Record<string, string>
  appPermissions: Record<string, AppPermission[]>
}

// Touch gesture types
interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'pan'
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  velocity?: number
  scale?: number
  center?: { x: number; y: number }
}

// Theme types
interface Theme {
  id: string
  name: string
  type: 'light' | 'dark' | 'auto'
  colors: ThemeColors
  fonts: ThemeFonts
  spacing: ThemeSpacing
  borderRadius: ThemeBorderRadius
  shadows: ThemeShadows
  animations: ThemeAnimations
}

interface ThemeColors {
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

// Plugin types
interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  icon?: string
  main: string
  dependencies?: Record<string, string>
  permissions?: string[]
  apiVersion: string
  minOSVersion?: string
  maxOSVersion?: string
}

interface PluginAPI {
  id: string
  name: string
  version: string
  description: string
  author: string
  icon?: string
  component?: React.ComponentType<any>
  hooks?: Record<string, Function>
  commands?: Record<string, Function>
  events?: Record<string, Function>
  settings?: Record<string, any>
  enabled: boolean
  loaded: boolean
  error?: string
}
```

## Examples

### Creating a Custom App

```typescript
import React from 'react'
import { Window } from '@/components/windows/Window'
import { useAppActions } from '@/store/appStore'

const MyCustomApp: React.FC = () => {
  return (
    <div className="p-4">
      <h1>My Custom App</h1>
      <p>This is a custom application for DurgasOS.</p>
    </div>
  )
}

// Register the app
const { registerApp } = useAppActions()

registerApp({
  id: 'my-custom-app',
  name: 'My Custom App',
  icon: '🧪',
  component: MyCustomApp,
  defaultSize: { width: 800, height: 600 },
  defaultPosition: { x: 100, y: 100 },
  category: 'utilities',
  description: 'A custom application',
  version: '1.0.0',
  isSystemApp: false
})
```

### Creating a Custom Theme

```typescript
import { ThemeProvider, useTheme } from '@/components/themes/ThemeSystem'

const customTheme: Theme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  type: 'dark',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#404040',
    success: '#51cf66',
    warning: '#ffd43b',
    error: '#ff6b6b',
    info: '#339af0'
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Inter, system-ui, sans-serif',
    mono: 'Fira Code, monospace'
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
}

function App() {
  return (
    <ThemeProvider>
      <MyApp />
    </ThemeProvider>
  )
}
```

### Creating a Custom Plugin

```typescript
// plugin.js
export default {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'A custom plugin for DurgasOS',
  author: 'Developer',
  main: './plugin.js',
  apiVersion: '1.0.0',
  
  hooks: {
    onAppLaunch: (appId) => {
      console.log(`App launched: ${appId}`)
    },
    onWindowOpen: (windowId) => {
      console.log(`Window opened: ${windowId}`)
    }
  },
  
  commands: {
    sayHello: (name) => {
      return `Hello, ${name}!`
    },
    getSystemInfo: () => {
      return {
        os: 'DurgasOS',
        version: '1.0.0',
        platform: 'web'
      }
    }
  },
  
  events: {
    onNotification: (notification) => {
      console.log('New notification:', notification)
    }
  }
}
```

This comprehensive API documentation covers all the major APIs available in DurgasOS. For more specific examples and advanced usage, refer to the individual component documentation and the source code.

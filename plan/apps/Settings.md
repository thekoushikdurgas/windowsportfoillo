# Settings App

## Overview

The Settings app provides comprehensive system customization options for personalizing the DurgasOS experience, including theme selection, accent colors, and wallpaper management.

## Features

- **Theme Selection**: Switch between light, dark, and auto themes
- **Accent Colors**: Choose from 8 accent color options
- **Wallpaper Gallery**: Select from a variety of desktop wallpapers with search
- **Typography Settings**: Customize fonts, sizes, weights, and line heights
- **Sound Controls**: Configure audio settings and notifications
- **Privacy Settings**: Control data collection and device permissions
- **Accessibility Options**: High contrast, screen reader, keyboard navigation
- **Performance Settings**: Memory limits, cache management, optimization
- **Network Configuration**: Proxy settings, bandwidth limits, data saver
- **Account Management**: Profile settings, sync, security options
- **System Configuration**: Language, timezone, updates, developer mode
- **Settings Search**: Find settings quickly with search functionality
- **Export/Import**: Backup and restore settings
- **Real-time Preview**: Changes apply immediately
- **Responsive Design**: Adapts to different window sizes

## Technical Details

- **Component**: `src/components/apps/Settings.tsx`
- **Default Size**: 700x550 pixels
- **Pinned**: Yes
- **Desktop**: No
- **File Association**: None

## Configuration Options

### Appearance Settings

- **Theme Toggle**: Light/Dark/Auto mode selection
- **Accent Colors**: Eight color options (blue, green, orange, pink, purple, red, yellow, indigo)
- **Typography**: Font family, size, weight, line height customization
- **Density**: Compact, normal, comfortable layout options
- **Visual Effects**: Animations, transitions, transparency, blur effects
- **Real-time Updates**: Changes apply immediately without restart

### Wallpaper Selection

- **Wallpaper Gallery**: Grid of available wallpapers with search
- **Visual Preview**: Thumbnail previews with names and descriptions
- **Selection Indicator**: Clear visual indication of current wallpaper
- **Hover Effects**: Interactive wallpaper selection
- **Search Functionality**: Find wallpapers by name or description

### Sound Settings

- **Master Volume**: 0-100% volume control
- **Sound Categories**: System, notification, and media sounds
- **Sound Themes**: Default, minimal, nature, electronic
- **Do Not Disturb**: Quiet hours configuration
- **Audio Controls**: Enable/disable different sound types

### Privacy & Security

- **Data Collection**: Control analytics, telemetry, and crash reporting
- **Device Permissions**: Camera, microphone, location access
- **Privacy Controls**: Personalized ads, data collection settings
- **Security Options**: Two-factor authentication, session timeout

### Accessibility Options

- **Visual**: High contrast, large text, color blind support
- **Navigation**: Keyboard navigation, screen reader support
- **Interaction**: Voice control, reduced motion
- **Magnification**: 100-300% zoom levels

### Performance Settings

- **Memory Management**: Memory limits and cache size controls
- **Visual Effects**: Animations, transparency, blur effects
- **Hardware Acceleration**: GPU acceleration options
- **Background Refresh**: App refresh and auto-optimization

### Network Configuration

- **Proxy Settings**: HTTP proxy configuration with authentication
- **Bandwidth Control**: Data usage limits and data saver mode
- **Connection Management**: Offline mode and network preferences

### Account Management

- **Profile Settings**: Name, email, profile picture
- **Sync Options**: Cross-device synchronization
- **Security**: Two-factor authentication, auto-logout
- **Data Backup**: Automatic backup settings

### System Configuration

- **Localization**: Language and timezone settings
- **Date/Time**: Format preferences (12h/24h, date formats)
- **Updates**: Auto-update configuration
- **Developer**: Debug mode, developer tools, log levels

### System Information

- **OS Version**: DurgasOS 1.0.0
- **Framework**: Next.js 15.3.3
- **React**: 18.3.1
- **TypeScript**: 5.x
- **Build Date**: Current build information
- **Environment**: Development/Production status

## UI Components

- **Settings Header**: Title and description with search functionality
- **Sidebar Navigation**: Organized sections for different settings categories
- **Settings Sections**: 8 main categories (Appearance, Sound, Privacy, Accessibility, Performance, Network, Account, System)
- **Theme Controls**: Toggle buttons for light/dark/auto theme
- **Color Palette**: Grid of 8 accent color options
- **Typography Controls**: Font family, size, weight, and line height sliders
- **Wallpaper Grid**: Responsive grid of wallpaper thumbnails with search
- **Sound Controls**: Volume sliders, sound category toggles, theme selection
- **Privacy Toggles**: Data collection and device permission switches
- **Accessibility Options**: High contrast, screen reader, keyboard navigation toggles
- **Performance Sliders**: Memory and cache size controls
- **Network Configuration**: Proxy settings, bandwidth controls
- **Account Management**: Profile settings, security options
- **System Configuration**: Language, timezone, developer options
- **System Info**: Structured display of system information
- **Export/Import**: Settings backup and restore functionality
- **Search Bar**: Real-time settings search with filtering

## Styling Features

- **Gradient Background**: Gray to blue gradient in light mode, gray in dark mode
- **Card Layout**: Clean white/dark cards with shadows
- **Interactive Elements**: Hover effects and active states
- **Responsive Grid**: Adapts to different screen sizes
- **Visual Feedback**: Clear indication of selected options

## State Management

- **Settings Store**: Uses Zustand store for state management
- **Persistent Settings**: Settings persist across sessions
- **Real-time Updates**: Changes apply immediately to the entire system

## Integration

- **Settings Store**: Integrates with `useSettingsStore` hook
- **Wallpaper System**: Uses the wallpapers library for available options
- **Theme System**: Connects to the global theme system
- **Image System**: Uses Next.js Image component for wallpapers

## User Experience

- **Intuitive Interface**: Familiar settings app layout
- **Immediate Feedback**: Changes apply instantly
- **Visual Clarity**: Clear organization and visual hierarchy
- **Accessibility**: Proper contrast and keyboard navigation

## Future Features (Planned)

- **Custom Theme Creator**: Visual theme builder with color picker
- **Theme Marketplace**: Share and download custom themes
- **Advanced Fonts**: More font options and custom font upload
- **Sound Customization**: Custom sound effects and audio themes
- **Advanced Privacy**: More granular privacy controls
- **Accessibility Profiles**: Save and load accessibility presets
- **Performance Monitoring**: Real-time performance metrics
- **Network Diagnostics**: Connection testing and troubleshooting
- **Multi-User Support**: Multiple user profiles and settings
- **Cloud Sync**: Settings synchronization across devices
- **Settings Backup**: Automated settings backup and restore
- **Advanced Security**: Biometric authentication, advanced 2FA

## Technical Considerations

- **State Persistence**: Ensure settings persist across sessions
- **Performance**: Optimize theme switching performance
- **Compatibility**: Ensure all apps respect theme changes
- **Validation**: Validate user input and settings

## Future Enhancements

- **Settings Backup**: Export and import settings
- **User Profiles**: Multiple user profiles with different settings
- **Settings Sync**: Cloud sync for settings across devices
- **Advanced Customization**: More granular customization options
- **Settings Search**: Search functionality within settings
- **Settings Categories**: More organized settings categories

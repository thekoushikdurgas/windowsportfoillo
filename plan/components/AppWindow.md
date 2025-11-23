# App Window Component

## Overview

The App Window component provides the container and management system for individual application windows in DurgasOS. It handles window positioning, sizing, state management, and user interactions for all application instances running on the desktop.

## Features

- **Window Management**: Complete window lifecycle management
- **Drag and Drop**: Draggable window positioning (mouse and touch)
- **Resize**: Resizable window dimensions
- **Minimize/Maximize**: Window state management
- **Focus Management**: Window focus and activation
- **Z-Index Management**: Window layering and stacking
- **Window Controls**: Close, minimize, maximize buttons
- **Responsive**: Adapts to different screen sizes
- **Window Snap**: Snap to edges/corners with animated glass indicators
- **Window Groups & Tabs**: Group windows with tabs (reorder, rename, detach)
- **Window Preview**: Live hover preview on taskbar/title bar (glass card)
- **Window Animations**: Smooth open/close/minimize/maximize transitions
- **Window Themes**: Glassmorphism presets (glassLight, glassDark, glassFrost, glassUltra)
- **Shortcuts & Gestures**: Win/Ctrl+Arrows, Win+Tab, touch edge-snap

## Technical Details

- **Component**: `src/components/shared/AppWindow.tsx`
- **Position**: Absolute positioned on desktop
- **Z-Index**: Dynamic based on focus and state
- **Performance**: Optimized for multiple windows
- **Integration**: Deep integration with desktop system

## UI Components

- **Window Frame**: Main window container (glassmorphism: backdrop blur + transparent, subtle borders and shadows)
- **Title Bar**: Window title and controls
- **Window Controls**: Close, minimize, maximize buttons
- **Content Area**: Application content container
- **Resize Handles**: Window resize handles
- **Focus Indicator**: Visual focus indication

## Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐   │
│  │              Window Frame                       │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │              Title Bar                  │   │   │
│  │  │  [Title]                    [─] [□] [×] │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │              Content Area               │   │   │
│  │  │                                         │   │   │
│  │  │            App Content                  │   │   │
│  │  │                                         │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Window States

- **Normal**: Standard window state
- **Minimized**: Hidden window state
- **Maximized**: Full screen window state
- **Focused**: Active window state
- **Unfocused**: Inactive window state

## Window Controls

- **Close Button**: Close the window
- **Minimize Button**: Minimize the window
- **Maximize Button**: Maximize/restore the window
- **Title Bar**: Drag to move window
- **Resize Handles**: Drag to resize window

## Window Management

- **Positioning**: Absolute positioning on desktop
- **Sizing**: Dynamic window dimensions
- **Stacking**: Z-index management
- **Focus**: Window focus management
- **State**: Window state persistence

## Integration

- **Desktop Context**: Desktop state management
- **App System**: Application integration
- **Settings Store**: Window preferences
- **Theme System**: Window theming
- **Performance System**: Window performance monitoring

## User Experience

- **Intuitive**: Familiar window behavior
- **Responsive**: Smooth window interactions
- **Accessible**: Full accessibility support
- **Performance**: Optimized window rendering
- **Customizable**: Window appearance options (theme presets: glassLight/glassDark, opacity)

## Functionality

- **Window Creation**: Create new application windows
- **Window Manipulation**: Move, resize, and manage windows
- **Window State**: Handle window states and transitions
- **Window Focus**: Manage window focus and activation
- **Window Events**: Handle window events and interactions

## Future Features (Planned)

- **Custom Themes**: User-defined theme editor and sharing
- **Advanced Window Management**: Layout rules, multi-monitor presets
- **Window AI**: AI-powered window management and analytics

## Technical Considerations

- **Performance**: Efficient window rendering
- **Memory Usage**: Optimized memory management
- **Event Handling**: Proper event management
- **State Management**: Window state synchronization
- **Rendering**: Hardware-accelerated rendering

## Future Enhancements

- **Advanced Window Management**: More sophisticated window controls
- **Window AI**: AI-powered window management
- **Window Analytics**: Window usage analytics
- **Window Security**: Enhanced window security
- **Window Collaboration**: Collaborative window features
- **Window VR**: VR window support
- **Window Voice**: Voice control for windows
- **Window Automation**: Automated window management

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Screen reader compatibility
- **High Contrast**: High contrast mode support
- **Focus Management**: Proper focus handling
- **Voice Control**: Voice control for windows

## State Management

- **Window State**: Individual window state
- **Position State**: Window position state
- **Size State**: Window size state
- **Focus State**: Window focus state
- **Z-Index State**: Window stacking state

## Performance Optimization

- **Window Caching**: Cached window data
- **Lazy Loading**: Load window content on demand
- **Memory Management**: Efficient memory usage
- **Event Optimization**: Optimized event handling
- **Rendering**: Hardware-accelerated rendering

## Window Events

- **Window Open**: Window creation event
- **Window Close**: Window destruction event
- **Window Focus**: Window focus change event
- **Window Move**: Window position change event
- **Window Resize**: Window size change event

## Integration Points

- **Desktop System**: Desktop integration
- **App System**: Application integration
- **Settings System**: Settings management
- **Theme System**: Theme integration (`useWindowTheme`) with glass presets
- **Performance System**: Performance monitoring

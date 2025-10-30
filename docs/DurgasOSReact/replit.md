# DurgasOS - Windows 11 Desktop Simulator

## Overview
DurgasOS is a pixel-perfect Windows 11 desktop simulator built with React and TypeScript. It replicates the complete Windows 11 experience including boot sequence, desktop environment, taskbar, start menu, and multiple fully functional applications with resizable windows.

## Project Status
**Current State**: MVP Implementation Complete
**Last Updated**: October 23, 2025

## Architecture

### Frontend (React + TypeScript)
- **Boot Sequence**: Animated Windows logo with loading progress bar
- **Desktop Environment**: Full desktop with taskbar, start menu, and system tray
- **Window Management**: Draggable, resizable windows with minimize, maximize, close controls
- **Built-in Applications**:
  - About Me: User profile and information
  - Portfolio: Project showcase with filtering
  - Browser: Simulated web browser with address bar
  - App Store: Browse and search applications
  - File Explorer: Navigate folders and files
  - Settings: System configuration panels

### Backend (Express + In-Memory Storage)
- API endpoints for profile data, projects, and app store content
- In-memory storage using MemStorage class
- RESTful API design

### Design System
- **Colors**: Windows 11 blue (#0078D4), dark theme backgrounds
- **Typography**: Segoe UI Variable font stack
- **Effects**: Backdrop blur, glass morphism, smooth animations
- **Components**: Custom window system, taskbar, start menu

## Key Features
1. ✅ Complete boot sequence with loading animation
2. ✅ Fully functional desktop with taskbar and start menu
3. ✅ Multi-window support with z-index management
4. ✅ Draggable and resizable windows
5. ✅ 6+ built-in applications
6. ✅ Context menus and desktop icons
7. ✅ System tray with clock
8. ✅ Authentic Windows 11 design with glass effects

## File Structure
```
client/src/
├── components/
│   ├── BootScreen.tsx          # Boot animation
│   ├── Desktop.tsx             # Main desktop container
│   ├── Taskbar.tsx             # Bottom taskbar
│   ├── StartMenu.tsx           # Start menu overlay
│   ├── WindowManager.tsx       # Window orchestration
│   ├── Window.tsx              # Individual window component
│   ├── DesktopIcons.tsx        # Desktop shortcuts
│   ├── ContextMenu.tsx         # Right-click menu
│   └── apps/
│       ├── AboutMeApp.tsx      # Profile application
│       ├── PortfolioApp.tsx    # Project showcase
│       ├── BrowserApp.tsx      # Web browser
│       ├── AppStoreApp.tsx     # App marketplace
│       ├── FileExplorerApp.tsx # File manager
│       └── SettingsApp.tsx     # System settings
├── pages/
│   └── Home.tsx                # Main page
└── App.tsx                     # Router configuration

shared/
└── schema.ts                   # TypeScript types and schemas

server/
├── routes.ts                   # API endpoints
└── storage.ts                  # Data persistence
```

## Development Guidelines
- Follow design_guidelines.md for all UI implementations
- Use Windows 11 color palette and design patterns
- Maintain 8px border radius for consistency
- Apply backdrop-filter blur effects for glass morphism
- Ensure all interactive elements have proper hover states

## Recent Changes
- Initial MVP implementation completed
- All core applications built and integrated
- Window management system fully functional
- Design system configured with Windows 11 aesthetics

## User Preferences
None specified yet.

## Next Steps
1. Backend API integration for dynamic data
2. Add more applications (Calculator, Paint, Notepad)
3. Implement notification center
4. Add file system simulation
5. Window snapping and virtual desktops
6. Theme customization options

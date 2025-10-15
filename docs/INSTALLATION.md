# Windows 11 Clone - Installation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone or Download the Project**
   ```bash
   # If using git
   git clone <repository-url>
   cd windows11-clone
   
   # Or download and extract the ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Use

### Desktop Interaction
- **Double-click** desktop icons to open applications
- **Click** on desktop to deselect icons
- **Right-click** for context menus (foundation implemented)

### Start Menu
- **Click** the Windows logo in taskbar to open start menu
- **Type** to search for applications
- **Click** on apps to launch them
- **Click** outside to close

### Window Management
- **Drag** title bar to move windows
- **Click** minimize (-) to minimize windows
- **Click** maximize (□) to maximize/restore windows
- **Click** close (×) to close windows
- **Click** on windows to bring to front

### Applications

#### About Me
- Personal portfolio application
- Interactive sections with animations
- Professional design with modern UI

#### File Explorer
- Browse files and folders
- Search functionality
- Switch between list and grid view
- Navigation pane with quick access

#### Settings
- System settings and preferences
- Multiple categories (System, Personalization, Accounts, etc.)
- Interactive controls and sliders

#### Calculator
- Fully functional calculator
- All basic operations (+, -, *, /)
- Clear and memory functions
- Windows 11 styling

#### Notepad
- Simple text editor
- Formatting options (Bold, Italic, Underline)
- Word count display
- File operations (New, Open, Save)

### Taskbar
- **Click** pinned apps to launch
- **View** system tray with time/date
- **Start button** to access start menu

## 📱 Responsive Design

The application adapts to different screen sizes:

- **Desktop** (1024px+): Full Windows 11 experience
- **Tablet** (768px-1023px): Adapted interface
- **Mobile** (480px-767px): Touch-optimized layout
- **Small Mobile** (<480px): Compact design

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🎨 Customization

### Changing Wallpaper
1. Add your image to `public/images/wallpapers/`
2. Update the wallpaper path in `src/store/systemStore.ts`

### Adding New Applications
1. Create app component in `src/components/apps/[AppName]/`
2. Register the app in `src/app/page.tsx`
3. Add desktop icon in `src/store/systemStore.ts`

### Modifying Colors
1. Update color palette in `tailwind.config.js`
2. Modify CSS variables in `src/app/globals.css`

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Use different port
npm run dev -- -p 3001
```

**Dependencies not installing**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Check types
npm run type-check
```

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Ensure all dependencies are installed
3. Verify Node.js version (18+)
4. Check the project's GitHub issues

## 🎯 Features Overview

✅ **Completed Features:**
- Boot screen with Windows 11 loading animation
- Desktop interface with wallpaper and icons
- Taskbar with start button and system tray
- Start menu with search and pinned apps
- Window management system (minimize, maximize, close, drag, resize)
- 5 fully functional system applications
- Smooth animations and transitions
- Responsive design for all screen sizes
- TypeScript support
- State management with Zustand

The Windows 11 clone is now ready to use with a complete desktop environment!

# Windows 11 Clone - Setup Instructions

## Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Features

✅ **Completed Features:**
- Boot screen with Windows 11 loading animation
- Desktop interface with wallpaper and icons
- Taskbar with start button and system tray
- Start menu with pinned apps and search
- Window management system (minimize, maximize, close, drag, resize)
- About Me application with personal portfolio
- Smooth animations and transitions
- Responsive design
- TypeScript support
- State management with Zustand

🔄 **In Progress:**
- Additional system applications (File Explorer, Settings, Calculator, Notepad)

## File Structure

The project follows the plan outlined in `plan/structure.md` with:
- Core system components in `src/components/system/`
- Application components in `src/components/apps/`
- UI components in `src/components/ui/`
- State management in `src/store/`
- Type definitions in `src/types/`
- Utilities in `src/utils/`

## Next Steps

1. Install dependencies and start the development server
2. Test the Windows 11 clone functionality
3. Explore the About Me application
4. Try the window management features
5. Use the start menu to search and launch apps

The application provides an authentic Windows 11 experience in the browser!

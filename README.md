# Windows 11 OS Clone

A comprehensive Windows 11 operating system clone built with Next.js, TypeScript, and Tailwind CSS. This project recreates the authentic Windows 11 experience in a web browser, including the boot screen, desktop interface, start menu, and various system applications.

## 🚀 Features

### Core System Components
- ✅ **Boot Screen** - Authentic Windows 11 loading experience with progress bar
- ✅ **Desktop Interface** - Complete desktop with wallpaper, icons, and taskbar
- ✅ **Start Menu** - Windows 11 centered start menu with pinned apps and search
- ✅ **Window Management** - Full window system (minimize, maximize, close, drag, resize)
- ✅ **Taskbar** - Windows 11 style taskbar with system tray

### System Applications
- ✅ **About Me** - Personal portfolio and information app
- ✅ **File Explorer** - Windows 11 File Explorer with navigation and search
- ✅ **Settings** - System settings and preferences with categories
- ✅ **Calculator** - Fully functional Windows 11 Calculator app
- ✅ **Notepad** - Text editor with formatting options and word count

### Advanced Features
- ✅ **Smooth Animations** - Framer Motion powered transitions
- ✅ **Responsive Design** - Works on different screen sizes
- ✅ **State Management** - Zustand for efficient state handling
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Modern UI** - Windows 11 Fluent Design System

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React + Emoji icons
- **Build Tool**: Next.js built-in bundler

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd windows11-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Desktop Interaction
- **Click** on desktop icons to select them
- **Double-click** on icons to open applications
- **Right-click** on desktop for context menu (Coming Soon)
- **Click** on desktop to deselect all icons

### Start Menu
- **Click** the Windows logo in the taskbar to open start menu
- **Type** to search for applications
- **Click** on apps to launch them
- **Click** outside to close the start menu

### Window Management
- **Drag** the title bar to move windows
- **Click** minimize (-) to minimize windows
- **Click** maximize (□) to maximize/restore windows
- **Click** close (×) to close windows
- **Click** on windows to bring them to front

### Taskbar
- **Click** pinned apps to launch them
- **Click** the start button to open start menu
- **View** system information in the system tray

## 🏗️ Project Structure

```
windows11-clone/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── system/         # Core system components
│   │   ├── apps/           # Application components
│   │   ├── ui/             # Reusable UI components
│   │   └── common/         # Common components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand state stores
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
│   └── images/            # Images and wallpapers
└── styles/                # Global styles
```

## 🎨 Customization

### Adding New Applications
1. Create a new app component in `src/components/apps/`
2. Register the app in `src/app/page.tsx`
3. Add the app to the system store if needed

### Changing Wallpaper
1. Add your image to `public/images/wallpapers/`
2. Update the wallpaper path in `src/store/systemStore.ts`

### Modifying Colors
1. Update the color palette in `tailwind.config.js`
2. Modify CSS variables in `src/app/globals.css`

## 🚧 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and structure
- [x] Core system components
- [x] Window management system
- [x] State management

### Phase 2: Boot & Desktop ✅
- [x] Boot screen animation
- [x] Desktop interface
- [x] Taskbar implementation
- [x] Start menu

### Phase 3: Applications ✅
- [x] About Me app
- [x] File Explorer
- [x] Settings app
- [x] Calculator
- [x] Notepad
- [ ] Microsoft Edge (simplified)

### Phase 4: Advanced Features ✅
- [x] Smooth animations and transitions
- [x] Responsive design
- [x] Window management system
- [x] State management
- [ ] Context menus (foundation implemented)
- [ ] System notifications
- [ ] Keyboard shortcuts
- [ ] Multiple desktop support
- [ ] Window snapping

### Phase 5: Polish & Optimization ✅
- [x] Performance optimization
- [x] Accessibility improvements
- [x] Mobile responsiveness
- [x] Documentation
- [ ] Testing coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Microsoft for the Windows 11 design inspiration
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Zustand for simple state management

## 📞 Contact

If you have any questions or suggestions, feel free to open an issue or reach out to the maintainers.

---

**Note**: This is a fan project created for educational purposes. Windows 11 is a trademark of Microsoft Corporation.

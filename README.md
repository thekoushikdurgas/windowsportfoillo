# DurgasOS - Windows 11 Replica

A fully functional Windows 11 operating system replica built with Next.js, TypeScript, and modern web technologies. Experience the Windows 11 desktop environment in your browser with working applications, window management, and system features.

![DurgasOS Preview](https://via.placeholder.com/800x600/0078d4/ffffff?text=DurgasOS+Windows+11+Replica)

## ✨ Features

### 🖥️ Desktop Environment
- **Windows 11-style Desktop**: Authentic Windows 11 look and feel
- **Desktop Icons**: Interactive desktop icons with hover effects
- **Wallpaper System**: Customizable desktop backgrounds
- **Context Menus**: Right-click functionality (coming soon)

### 🪟 Window Management
- **Resizable Windows**: Drag to resize windows from any corner or edge
- **Draggable Windows**: Click and drag window headers to move windows
- **Window Controls**: Minimize, maximize, and close buttons
- **Window Stacking**: Proper z-index management and focus handling
- **Multi-window Support**: Open multiple applications simultaneously

### 📱 Taskbar & Start Menu
- **Windows 11 Taskbar**: Authentic taskbar with start button
- **Start Menu**: Modern Windows 11 start menu with app grid
- **System Tray**: Time, volume, network, and system controls
- **Application Icons**: Running applications appear in taskbar

### 🚀 Applications
- **About Me**: Personal portfolio application
- **Calculator**: Full-featured calculator with arithmetic operations
- **Notepad**: Text editor with save and download functionality
- **File Explorer**: File management system (coming soon)
- **Settings**: System customization panel (coming soon)
- **Weather Widget**: Weather information display (coming soon)

### ⌨️ Keyboard Shortcuts
- **Windows Key**: Toggle start menu
- **Escape**: Close start menu
- **Alt + Tab**: Switch between windows (coming soon)
- **F5**: Refresh desktop
- **Ctrl + Alt + Del**: Task manager (coming soon)

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Next.js built-in bundler

## 📦 Installation

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/durgas-os.git
   cd durgas-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see DurgasOS in action!

## 🏗️ Project Structure

```
durgasOS/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main desktop page
│   │   └── loading.tsx        # Loading screen
│   ├── components/
│   │   ├── desktop/           # Desktop components
│   │   ├── taskbar/           # Taskbar components
│   │   ├── windows/           # Window management
│   │   ├── startmenu/         # Start menu components
│   │   └── apps/              # Application components
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # Zustand state stores
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🎮 Usage

### Desktop Interaction
1. **Click** on desktop icons to select them
2. **Double-click** on desktop icons to open applications
3. **Right-click** on desktop for context menu (coming soon)
4. **Click** on the start button to open the start menu

### Window Management
1. **Drag** window headers to move windows
2. **Resize** windows by dragging the edges or corners
3. **Click** minimize, maximize, or close buttons
4. **Click** on taskbar icons to restore minimized windows

### Applications
- **About Me**: View personal information and skills
- **Calculator**: Perform arithmetic calculations
- **Notepad**: Edit and save text files

## 🎨 Customization

### Themes
The application supports light and dark themes that can be toggled through the system settings.

### Wallpapers
You can customize the desktop wallpaper by modifying the wallpaper path in the desktop store.

### Applications
Add new applications by:
1. Creating a new component in `src/components/apps/`
2. Registering the app in the application store
3. Adding it to the start menu grid

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 Roadmap

### Phase 1 (Current)
- ✅ Basic desktop environment
- ✅ Window management system
- ✅ Start menu and taskbar
- ✅ Core applications (About Me, Calculator, Notepad)

### Phase 2 (Coming Soon)
- 🔄 File Explorer with folder navigation
- 🔄 Settings panel with customization options
- 🔄 Weather widget with real-time data
- 🔄 Desktop context menu
- 🔄 Keyboard shortcuts (Alt+Tab, Win+D, etc.)

### Phase 3 (Future)
- 🔮 Multi-user support
- 🔮 File system simulation
- 🔮 Network and internet functionality
- 🔮 Advanced window features (snap, virtual desktops)
- 🔮 System sounds and notifications

## 🐛 Known Issues

- Window maximization needs proper implementation
- Some keyboard shortcuts are placeholders
- File system is not persistent between sessions
- No real file operations (read-only simulation)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Microsoft for the Windows 11 design inspiration
- The Next.js team for the amazing framework
- The React community for excellent libraries and tools
- Figma community for design resources

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review the code comments for implementation details

---

**DurgasOS** - Bringing the Windows 11 experience to the web! 🚀

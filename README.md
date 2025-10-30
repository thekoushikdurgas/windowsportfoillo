# DurgasOS

A sophisticated web-based operating system that replicates the Windows 11 experience using Next.js 15, React 18, and modern web technologies. Features an AI-powered assistant, multiple built-in applications, and a complete desktop environment with window management. Available as both a web application and a native desktop app via Electron.

## 🚀 Features

### Core System

- **Boot Sequence**: Authentic Windows 11 boot animation
- **Desktop Environment**: Wallpaper support, desktop icons, window rendering
- **Taskbar**: Start menu, pinned apps, system tray, assistant button
- **Window Management**: Draggable, resizable windows with minimize/maximize/close controls
- **Mobile Support**: Responsive design with touch gestures and mobile-optimized interface
- **Performance Monitoring**: Built-in performance tracking and optimization

### Built-in Applications (13 Apps)

1. **Welcome** - Onboarding experience with hero image and navigation
2. **About Me** - Personal information display with skills and contact links
3. **Portfolio** - Project showcase with interactive cards and external links
4. **File Explorer** - Full-featured virtual file system with context menus, operations
5. **Browser** - Web browsing interface (placeholder - coming soon)
6. **App Store** - Application marketplace with app cards and installation
7. **Settings** - System configuration with theme, wallpaper, and accent color selection
8. **Notepad** - Text editor with file content support
9. **Terminal** - Command-line interface with basic commands (help, clear, ls, pwd, echo)
10. **Video Player** - Media playback with video controls
11. **Creator Studio** - AI image generation interface (placeholder - coming soon)
12. **Gemini Chat** - AI chat interface (placeholder - coming soon)
13. **Live Assistant** - Voice-based AI interaction (placeholder - coming soon)

### AI Integration

- **Durgas Assistant**: AI assistant with tool calling capabilities
- **Multiple AI Flows**: Assistant, chat, browser, creator-studio, live-assistant flows
- **Tool Calling**: AI can open apps, create folders, get system info, execute commands
- **Text-to-Speech**: Multiple voice options (algenib, charon, fable, onyx, nova, shimmer)
- **Google Gemini 2.5 Flash**: Advanced AI models for various tasks
- **System Integration**: AI tools for file operations and app management

### Design System

- **Windows 11 Aesthetics**: Authentic visual design with Microsoft-style components
- **Customizable Themes**: Light/dark mode with 6 accent colors (blue, green, orange, pink, purple, red)
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Smooth Animations**: Windows-style transitions and effects
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.3 with Turbopack, React 18.3.1
- **Styling**: Tailwind CSS 3.4.1 with custom Windows 11 theme
- **State Management**: Zustand 4.5.4 + Redux Toolkit 2.0.0
- **AI Integration**: Google Genkit 1.0.0-rc.18 with Gemini 2.5 Flash models
- **UI Components**: Radix UI primitives with shadcn/ui
- **Window Management**: react-rnd for draggable/resizable windows
- **Desktop App**: Electron 28.0.0 with electron-builder
- **TypeScript**: Full type safety with strict configuration
- **Testing**: Jest 29.0.0 + Playwright 1.40.0 + Testing Library
- **Performance**: Built-in monitoring and optimization tools

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd durgasos
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your Google AI API key:

   ```
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### AI Integration Setup

To enable AI features, you'll need to set up Google Genkit:

1. **Install Genkit CLI**

   ```bash
   npm install -g @genkit-ai/cli
   ```

2. **Start Genkit development server**

   ```bash
   npm run genkit:dev
   ```

3. **Configure your Google AI API key**
   - Get your API key from [Google AI Studio](https://aistudio.google.com/)
   - Add it to your `.env.local` file

## 📁 Project Structure

```
durgasos/
├── src/
│   ├── ai/                    # AI/Genkit integration
│   │   ├── flows/            # AI flow definitions (assistant, chat, etc.)
│   │   ├── tools/            # AI tools (system, file, app tools)
│   │   ├── schemas/          # Zod schemas for AI inputs/responses
│   │   ├── genkit.ts         # Genkit configuration
│   │   └── server.ts         # Express server for AI
│   ├── app/                  # Next.js app directory
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout with providers
│   │   └── page.tsx          # Main entry point
│   ├── components/           # React components
│   │   ├── apps/             # Application components (13 apps)
│   │   ├── shared/           # Shared UI components
│   │   ├── system/           # OS system components (desktop, taskbar, etc.)
│   │   └── ui/               # Base UI components (shadcn/ui)
│   ├── context/              # React contexts (Desktop, Auth)
│   ├── hooks/                # Custom React hooks (13 hooks)
│   ├── lib/                  # Utility libraries
│   ├── services/             # Service layer (13 services)
│   ├── store/                # State management (Zustand + Redux)
│   │   └── slices/           # Redux slices
│   ├── types/                # TypeScript type definitions
│   └── __tests__/            # Test files
├── electron/                 # Electron desktop app
├── docs/                     # Documentation and examples
├── tests/                    # E2E tests (Playwright)
└── Configuration files       # Next.js, TypeScript, Jest, etc.
```

## 🎯 Usage

### Desktop Navigation

- **Click desktop icons** to open applications
- **Use the Start Menu** (Windows key or click Windows logo) to access all apps
- **Drag windows** to move them around
- **Resize windows** by dragging the edges
- **Minimize/Maximize/Close** using window controls

### AI Assistant

- **Click the microphone icon** in the taskbar to activate the assistant
- **Tool calling capabilities** - AI can open apps, create folders, get system info
- **Text-based interaction** through the Live Assistant app (coming soon)
- **Voice commands** are supported (coming soon)
- **Multiple AI flows** for different use cases

### Settings

- **Open Settings** from the Start Menu
- **Customize theme** (light/dark mode)
- **Change accent colors** (blue, green, orange, pink, purple, red)
- **Select wallpapers** from the available options

## 🔧 Development

### Available Scripts

**Development:**

- `npm run dev` - Start development server with Turbopack
- `npm run dev:fast` - Start with Turbopack and experimental build mode
- `npm run dev:webpack` - Start with traditional Webpack
- `npm run dev:full` - Start both Next.js and Genkit servers

**AI Integration:**

- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching
- `npm run genkit:server` - Start Genkit Express server
- `npm run genkit:setup` - Setup environment variables

**Building:**

- `npm run build` - Build for production
- `npm run build:turbo` - Build with Turbopack
- `npm run build:analyze` - Build with bundle analysis
- `npm run build:clean` - Clean build

**Desktop App:**

- `npm run electron` - Run Electron app
- `npm run electron:dev` - Run Electron in development mode
- `npm run electron:build` - Build Electron app
- `npm run electron:dist` - Create distribution packages

**Testing:**

- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:all` - Run all tests

**Code Quality:**

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

### Code Organization

- **Feature-based Structure**: Group related components together
- **Consistent Naming**: Use descriptive, Windows-style naming
- **Type Safety**: Full TypeScript coverage with proper interfaces
- **Component Props**: Consistent prop patterns across applications

### Styling Standards

- **Windows 11 Design**: Follow Microsoft's design guidelines
- **Tailwind Classes**: Use utility classes with custom CSS variables
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Deployment

### Web Application

**Vercel (Recommended)**

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on push to main branch

**Other Platforms**
The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Heroku

### Desktop Application

**Electron Build**

1. **Build the web app**: `npm run build`
2. **Create desktop packages**: `npm run electron:dist`
3. **Distribute** the generated packages in the `dist/` folder

**Supported Platforms**

- Windows (NSIS installer)
- macOS (DMG package)
- Linux (AppImage)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Microsoft** for the Windows 11 design inspiration
- **Next.js Team** for the amazing framework and Turbopack
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Google** for the AI capabilities through Genkit and Gemini
- **Electron** for desktop app capabilities
- **Vercel** for hosting and deployment platform

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the existing code for examples

---

**DurgasOS** - Bringing the Windows 11 experience to the web! 🖥️✨

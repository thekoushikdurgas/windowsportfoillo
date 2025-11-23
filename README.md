# DurgasOS

A sophisticated web-based operating system that replicates the Windows 11 experience using Next.js 15, React 18, and modern web technologies. Features an AI-powered assistant, multiple built-in applications, and a complete desktop environment with window management. Available as both a web application and a native desktop app via Electron.

## Features

### Windows 11 UI Experience
- 🖥️ **Full Windows 11 Replica** - Complete desktop environment matching Windows 11 design
- 🪟 **Window Management** - Snap layouts, rounded corners, acrylic effects, smooth animations
- 🎯 **Snap Layouts** - Drag windows to edges for automatic snapping (2, 3, 4 panel layouts)
- 🎨 **Acrylic/Glassmorphism** - Beautiful backdrop blur effects throughout the UI
- 📱 **Start Menu** - Windows 11-style Start Menu with pinned apps and recommended section
- 🔔 **Action Center** - Quick actions, notifications, and calendar widget
- 🔍 **Global Search** - Search apps, files, and settings (Win+S)
- 📊 **Widgets Panel** - Weather, calendar, news, and stock widgets (Win+W)
- 🖥️ **Task View** - Virtual desktops and window management (Win+Tab)
- ⌨️ **Keyboard Shortcuts** - Full Windows 11 keyboard shortcut support

### Applications
- 🤖 **AI Copilot** - Powered by Google Gemini AI with thinking mode
- 💬 **Real-time Chat** - Interactive AI chat interface
- 🎨 **Creator Studio** - Image and video generation with AI
- 🎤 **Voice Assistant** - Real-time voice interaction
- 📁 **File Explorer** - Windows 11-style file management
- 🧮 **Calculator** - Standard calculator with multiple modes
- 📝 **Notepad** - Simple text editor
- 💻 **Terminal** - Command line interface
- 🏪 **App Store** - Application discovery and installation
- 🌤️ **Weather** - Weather information and forecasts
- ⚙️ **Settings** - Complete Windows 11 Settings app with sidebar navigation

### Technical Features
- 🔔 **Real-time Notifications** - WebSocket-based notification system
- 🔍 **Vector Search** - AI-powered search with vector database
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 🖥️ **Electron Support** - Native desktop app wrapper

## Tech Stack

### Frontend

- Next.js 13+ (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Google GenAI SDK

### Backend

- FastAPI
- Python 3.11+
- SQLAlchemy (PostgreSQL via Supabase)
- ChromaDB (Vector Database)
- WebSockets
- Google Generative AI

### Desktop App

- Electron
- Cross-platform support (Windows, macOS, Linux)
- Native window controls
- System integration

## Project Structure

```
DurgasOS/
├── frontend/          # Next.js frontend
│   ├── app/          # App Router
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React contexts
│   │   ├── services/    # API services
│   │   └── lib/         # Utilities
│   └── public/       # Static assets
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── modules/     # Feature modules (NestJS-like)
│   │   ├── config/      # Configuration
│   │   ├── core/        # Core utilities
│   │   └── database/    # Database setup
│   └── requirements.txt
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (optional)

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd DurgasOS
```

2. Create `.env` file in the root:

```env
# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres.woqnlgszvkqxaqabtqfv:njAbg1RUZSaXh8vO@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# Or use individual parameters:
# DATABASE_HOST=aws-1-ap-south-1.pooler.supabase.com
# DATABASE_PORT=6543
# DATABASE_NAME=postgres
# DATABASE_USER=postgres.woqnlgszvkqxaqabtqfv
# DATABASE_PASSWORD=njAbg1RUZSaXh8vO

# API Keys
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
```

3. Start all services:

```bash
docker-compose up
```

4. Access the application:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:8000>
- API Docs: <http://localhost:8000/docs>

### Manual Setup

#### Frontend

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

4. Run development server:

```bash
npm run dev
```

#### Backend

1. Navigate to backend directory:

```bash
cd backend
```

2. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create `.env` file in the `backend` directory:

**Option 1: Using full connection string (Recommended)**
```env
DATABASE_URL=postgresql://postgres.woqnlgszvkqxaqabtqfv:njAbg1RUZSaXh8vO@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
CORS_ORIGINS=http://localhost:3000
```

**Option 2: Using individual parameters**
```env
DATABASE_HOST=aws-1-ap-south-1.pooler.supabase.com
DATABASE_PORT=6543
DATABASE_NAME=postgres
DATABASE_USER=postgres.woqnlgszvkqxaqabtqfv
DATABASE_PASSWORD=njAbg1RUZSaXh8vO
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
CORS_ORIGINS=http://localhost:3000
```

5. Run the server:

```bash
uvicorn app.main:app --reload
```

## Environment Variables

### Frontend (.env.local)

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL
- `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API Key

### Backend (.env)

**Database Configuration (Supabase PostgreSQL):**
- `DATABASE_URL` - Full PostgreSQL connection string (recommended)
  - OR use individual parameters:
- `DATABASE_HOST` - Database host (e.g., aws-1-ap-south-1.pooler.supabase.com)
- `DATABASE_PORT` - Database port (default: 6543 for Supabase pooler)
- `DATABASE_NAME` - Database name (default: postgres)
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password

**Other Settings:**
- `GEMINI_API_KEY` - Google Gemini API Key
- `SECRET_KEY` - Secret key for encryption
- `CORS_ORIGINS` - Allowed CORS origins
- `VECTOR_DB_URL` - Vector database URL (optional)
- `VECTOR_DB_API_KEY` - Vector database API key (optional)

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Linting
```

### Backend Development

```bash
cd backend
uvicorn app.main:app --reload  # Development server with auto-reload
```

## Architecture

### Frontend Architecture

- **App Router**: Next.js 13+ App Router for routing
- **Components**: Organized by feature (os, apps, ui)
- **Contexts**: Theme, Notification, WebSocket state management
- **Services**: API client and Gemini service integration

### Backend Architecture

- **Modular Design**: NestJS-like module structure
  - Each module has: `controller.py`, `service.py`, `schemas.py`, `models.py`
- **Dependency Injection**: Custom DI container
- **WebSocket Support**: Real-time notifications
- **Vector Database**: ChromaDB for embeddings and search

## Modules

### Frontend Apps

- **ChatApp**: AI chat interface with Gemini
- **FileExplorerApp**: File browser
- **SettingsApp**: System settings and preferences
- **StudioApp**: Image and video generation
- **VoiceApp**: Real-time voice assistant

### Backend Modules

- **Gemini**: AI chat, image, video, transcription, TTS
- **Files**: File operations and storage
- **Settings**: User preferences
- **Notifications**: WebSocket-based notifications
- **Vector**: Vector database operations
- **Desktop**: Desktop state management

## API Documentation

When the backend is running, visit:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Acknowledgments

- Google Gemini AI
- Next.js Team
- FastAPI Team
- All open-source contributors

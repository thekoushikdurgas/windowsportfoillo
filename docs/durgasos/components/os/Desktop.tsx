import React, { useState, useEffect } from 'react';
import { AppDefinition, WindowState } from '../../types';
import Taskbar from './Taskbar';
import Window from './Window';
import { MessageSquare, Image as ImageIcon, Mic, Terminal, Settings as SettingsIcon, Folder, Bell } from 'lucide-react';
import ChatApp from '../apps/ChatApp';
import StudioApp from '../apps/StudioApp';
import VoiceApp from '../apps/VoiceApp';
import SettingsApp from '../apps/SettingsApp';
import FileExplorerApp from '../apps/FileExplorerApp';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationContainer from './NotificationContainer';

// App Registry
const APPS: AppDefinition[] = [
  {
    id: 'copilot',
    title: 'Copilot',
    icon: <MessageSquare className="text-blue-400" />,
    component: ChatApp,
    defaultWidth: 500,
    defaultHeight: 600
  },
  {
    id: 'explorer',
    title: 'File Explorer',
    icon: <Folder className="text-yellow-400 fill-yellow-400/20" />,
    component: FileExplorerApp,
    defaultWidth: 800,
    defaultHeight: 500
  },
  {
    id: 'studio',
    title: 'Studio',
    icon: <ImageIcon className="text-purple-400" />,
    component: StudioApp,
    defaultWidth: 900,
    defaultHeight: 700
  },
  {
    id: 'voice',
    title: 'Voice',
    icon: <Mic className="text-red-400" />,
    component: VoiceApp,
    defaultWidth: 400,
    defaultHeight: 500
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: <SettingsIcon className="text-gray-400" />,
    component: SettingsApp,
    defaultWidth: 900,
    defaultHeight: 650
  },
  // Dummy placeholder for About Me
  {
    id: 'about',
    title: 'About Me',
    icon: <Terminal className="text-green-400" />,
    component: () => <div className="p-8 text-white"><h1>DurgasOS</h1><p>Built with React + Tailwind + Gemini.</p></div>,
    defaultWidth: 400,
    defaultHeight: 300
  }
];

const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const { wallpaperUrl } = useTheme();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Initial boot notification
    const t = setTimeout(() => {
        addNotification({
            title: 'Welcome to DurgasOS',
            message: 'Your AI-powered cloud desktop is ready. Click the Start button to begin.',
            appName: 'System',
            icon: <Bell size={14} />,
            duration: 6000
        });
    }, 1500);
    return () => clearTimeout(t);
  }, [addNotification]);

  const openApp = (appId: string, options?: { forceNew?: boolean }) => {
    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    const existingInstances = windows.filter(w => w.appId === appId);

    if (existingInstances.length > 0 && !options?.forceNew) {
        // Bring the most recently active instance to front
        const topInstance = [...existingInstances].sort((a, b) => b.zIndex - a.zIndex)[0];
        
        if (topInstance.isMinimized) {
            setWindows(prev => prev.map(w => w.id === topInstance.id ? { ...w, isMinimized: false } : w));
        }
        focusWindow(topInstance.id);
        return;
    }

    const newWindow: WindowState = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      appId: app.id,
      title: app.title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) + 1 : 1,
      position: { 
        x: 50 + (windows.length * 30) % 400, 
        y: 50 + (windows.length * 30) % 200 
      },
      size: { width: app.defaultWidth || 600, height: app.defaultHeight || 400 }
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
    setStartOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const updateWindow = (id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
  };

  const minimizeAllWindows = () => {
    setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
    setActiveWindowId(null);
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center transition-all duration-500 ease-in-out"
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
      onClick={() => setStartOpen(false)}
    >
      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-4 flex flex-col gap-4">
        {APPS.map(app => (
          <div 
            key={app.id}
            className="w-20 h-24 flex flex-col items-center justify-center gap-1 hover:bg-white/10 rounded border border-transparent hover:border-white/20 transition cursor-pointer text-shadow group"
            onClick={(e) => { e.stopPropagation(); openApp(app.id, { forceNew: e.shiftKey }); }}
          >
            <div className="p-2 bg-white/10 rounded-lg shadow-lg group-hover:scale-105 transition">
              {React.cloneElement(app.icon as React.ReactElement<any>, { size: 32 })}
            </div>
            <span className="text-xs text-white text-center font-medium drop-shadow-md">{app.title}</span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.map(win => {
        const app = APPS.find(a => a.id === win.appId);
        if (!app) return null;
        return (
          <Window 
            key={win.id}
            state={win}
            isActive={activeWindowId === win.id}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => toggleMaximizeWindow(win.id)}
            onMove={(pos) => updateWindow(win.id, { position: pos })}
            onResize={(size) => updateWindow(win.id, { size })}
            icon={app.icon}
          >
            <app.component windowId={win.id} isActive={activeWindowId === win.id} />
          </Window>
        );
      })}

      <Taskbar 
        apps={APPS} 
        openWindows={windows} 
        activeWindowId={activeWindowId} 
        onAppClick={openApp} 
        onMinimizeWindow={minimizeWindow}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        startOpen={startOpen} 
        toggleStart={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}
        onShowDesktop={minimizeAllWindows}
      />

      <NotificationContainer />
    </div>
  );
};

export default Desktop;
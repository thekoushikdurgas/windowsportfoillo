'use client';

import React, { useState, useEffect } from 'react';
import { AppDefinition, WindowState } from '@/types';
import Taskbar from './Taskbar';
import Window from './Window';
import { MessageSquare, Image as ImageIcon, Mic, Terminal, Settings as SettingsIcon, Folder, Bell, Calculator, FileText, Store, Cloud } from 'lucide-react';
import ChatApp from '../apps/ChatApp';
import StudioApp from '../apps/StudioApp';
import VoiceApp from '../apps/VoiceApp';
import SettingsApp from '../apps/SettingsApp';
import FileExplorerApp from '../apps/FileExplorerApp';
import CalculatorApp from '../apps/CalculatorApp';
import NotepadApp from '../apps/NotepadApp';
import TerminalApp from '../apps/TerminalApp';
import StoreApp from '../apps/StoreApp';
import WeatherApp from '../apps/WeatherApp';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import NotificationContainer from './NotificationContainer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import SearchPanel from './SearchPanel';
import Widgets from './Widgets';
import TaskView from './TaskView';

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
  {
    id: 'calculator',
    title: 'Calculator',
    icon: <Calculator className="text-blue-400" />,
    component: CalculatorApp,
    defaultWidth: 400,
    defaultHeight: 600
  },
  {
    id: 'notepad',
    title: 'Notepad',
    icon: <FileText className="text-green-400" />,
    component: NotepadApp,
    defaultWidth: 600,
    defaultHeight: 500
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: <Terminal className="text-green-400" />,
    component: TerminalApp,
    defaultWidth: 700,
    defaultHeight: 500
  },
  {
    id: 'store',
    title: 'Store',
    icon: <Store className="text-purple-400" />,
    component: StoreApp,
    defaultWidth: 900,
    defaultHeight: 700
  },
  {
    id: 'weather',
    title: 'Weather',
    icon: <Cloud className="text-blue-400" />,
    component: WeatherApp,
    defaultWidth: 500,
    defaultHeight: 600
  }
];

const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [taskViewOpen, setTaskViewOpen] = useState(false);
  const { wallpaperUrl } = useTheme();
  const { addNotification } = useNotification();

  useEffect(() => {
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

  const handleSnap = (windowId: string, zone: { layout: string; x: number; y: number; width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { 
            ...w, 
            position: { x: zone.x, y: zone.y },
            size: { width: zone.width, height: zone.height },
            isSnapped: true,
            snapState: { layout: zone.layout as any, zone: zone.layout },
            animationState: 'snapping' as const
          }
        : w
    ));
    // Clear animation state after animation completes
    setTimeout(() => {
      setWindows(prev => prev.map(w => w.id === windowId ? { ...w, animationState: null } : w));
    }, 200);
  };

  const handleUnsnap = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId 
        ? { 
            ...w, 
            isSnapped: false,
            snapState: undefined,
            animationState: 'restoring' as const
          }
        : w
    ));
    setTimeout(() => {
      setWindows(prev => prev.map(w => w.id === windowId ? { ...w, animationState: null } : w));
    }, 200);
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

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'Tab',
      meta: true,
      action: () => {
        setTaskViewOpen(prev => !prev);
      },
    },
    {
      key: 'd',
      meta: true,
      action: () => {
        minimizeAllWindows();
      },
    },
    {
      key: 'w',
      meta: true,
      action: () => {
        setWidgetsOpen(prev => !prev);
      },
    },
    {
      key: 'a',
      meta: true,
      action: () => {
        setActionCenterOpen(prev => !prev);
      },
    },
    {
      key: 's',
      meta: true,
      action: () => {
        setSearchOpen(prev => !prev);
      },
    },
    {
      key: 'i',
      meta: true,
      action: () => {
        openApp('settings');
      },
    },
    {
      key: 'ArrowLeft',
      meta: true,
      action: () => {
        // Snap window left
        if (activeWindowId) {
          const win = windows.find(w => w.id === activeWindowId);
          if (win && !win.isMaximized) {
            handleSnap(win.id, {
              layout: 'left',
              x: 0,
              y: 0,
              width: window.innerWidth / 2,
              height: window.innerHeight - 48,
            });
          }
        }
      },
    },
    {
      key: 'ArrowRight',
      meta: true,
      action: () => {
        // Snap window right
        if (activeWindowId) {
          const win = windows.find(w => w.id === activeWindowId);
          if (win && !win.isMaximized) {
            handleSnap(win.id, {
              layout: 'right',
              x: window.innerWidth / 2,
              y: 0,
              width: window.innerWidth / 2,
              height: window.innerHeight - 48,
            });
          }
        }
      },
    },
    {
      key: 'ArrowUp',
      meta: true,
      action: () => {
        // Maximize window
        if (activeWindowId) {
          const win = windows.find(w => w.id === activeWindowId);
          if (win && !win.isMaximized) {
            toggleMaximizeWindow(win.id);
          }
        }
      },
    },
    {
      key: 'ArrowDown',
      meta: true,
      action: () => {
        // Restore/Minimize window
        if (activeWindowId) {
          const win = windows.find(w => w.id === activeWindowId);
          if (win) {
            if (win.isMaximized) {
              toggleMaximizeWindow(win.id);
            } else {
              minimizeWindow(win.id);
            }
          }
        }
      },
    },
  ]);

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
            onSnap={(zone) => handleSnap(win.id, zone)}
            onUnsnap={() => handleUnsnap(win.id)}
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
        actionCenterOpen={actionCenterOpen}
        toggleActionCenter={() => setActionCenterOpen(prev => !prev)}
      />

      <NotificationContainer />

      <SearchPanel
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        apps={APPS}
        onAppClick={openApp}
      />

      <Widgets
        isOpen={widgetsOpen}
        onClose={() => setWidgetsOpen(false)}
      />

      <TaskView
        isOpen={taskViewOpen}
        onClose={() => setTaskViewOpen(false)}
        windows={windows}
        apps={APPS}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        onMinimizeWindow={minimizeWindow}
      />
    </div>
  );
};

export default Desktop;


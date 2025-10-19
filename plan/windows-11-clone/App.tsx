import React, { useState, useEffect, useCallback, useRef } from 'react';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import { APPS } from './constants';
import type { WindowState } from './types';
import { playSound } from './utils/audio';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<'loading' | 'login' | 'desktop'>('loading');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
        setAuthState('login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setAuthState('desktop');
    playSound('/sounds/windows-start.mp3');
    openApp('welcome');
  };
  
  const focusWindow = useCallback((id: string) => {
    setWindows(currentWindows => {
        const win = currentWindows.find(w => w.id === id);
        if (!win) return currentWindows;

        // If the window is already focused, but minimized, restore it.
        if (id === focusedWindowId) {
            if (win.isMinimized) {
                playSound('/sounds/window-restore.mp3');
                const newZIndex = nextZIndex;
                setNextZIndex(prev => prev + 1);
                return currentWindows.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: newZIndex } : w);
            }
            return currentWindows;
        }

        playSound('/sounds/click.mp3');
        if (win.isMinimized) {
            playSound('/sounds/window-restore.mp3');
        }

        setFocusedWindowId(id);
        const newZIndex = nextZIndex;
        setNextZIndex(prev => prev + 1);
        return currentWindows.map(w =>
            w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w
        );
    });
  }, [focusedWindowId, nextZIndex]);

  const openApp = useCallback((appId: string) => {
    let appOpened = false;
    setWindows(currentWindows => {
      const existingWindow = currentWindows.find(w => w.appId === appId);
      if (existingWindow) {
        focusWindow(existingWindow.id);
        return currentWindows;
      }

      const appData = APPS.find(app => app.id === appId);
      if (!appData) return currentWindows;
      
      playSound('/sounds/app-open.mp3');
      appOpened = true;

      const newWindow: WindowState = {
        id: `${appId}-${Date.now()}`,
        appId: appId,
        position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
        size: appData.defaultSize || { width: 600, height: 400 },
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        title: appData.title,
        icon: appData.icon,
        taskbarIcon: appData.taskbarIcon || appData.icon,
      };
      setFocusedWindowId(newWindow.id);
      return [...currentWindows, newWindow];
    });
    if(appOpened) {
      setNextZIndex(prev => prev + 1);
    }
  }, [nextZIndex, focusWindow]);

  const closeWindow = (id: string) => {
    playSound('/sounds/window-close.mp3');
    setWindows(prev => prev.map(win => win.id === id ? { ...win, isClosing: true } : win));
  };

  const destroyWindow = useCallback((id: string) => {
     setWindows(prevWindows => {
        const newWindows = prevWindows.filter(win => win.id !== id);
        if (focusedWindowId === id) {
            if (newWindows.length > 0) {
                const topWindow = [...newWindows].filter(w => !w.isMinimized).sort((a, b) => b.zIndex - a.zIndex)[0];
                setFocusedWindowId(topWindow ? topWindow.id : null);
            } else {
                setFocusedWindowId(null);
            }
        }
        return newWindows;
    });
  }, [focusedWindowId]);


  const minimizeWindow = (id: string) => {
    playSound('/sounds/window-minimize.mp3');
    setWindows(prev => prev.map(win => win.id === id ? { ...win, isMinimized: true } : win));
    if (focusedWindowId === id) {
        const otherWindows = windows.filter(w => w.id !== id && !w.isMinimized);
         if (otherWindows.length > 0) {
            const topWindow = otherWindows.sort((a,b) => b.zIndex - a.zIndex)[0];
            setFocusedWindowId(topWindow.id);
        } else {
            setFocusedWindowId(null);
        }
    }
  };

  const maximizeWindow = (id: string) => {
    playSound('/sounds/click.mp3');
    setWindows(prev => prev.map(win => win.id === id ? { ...win, isMaximized: !win.isMaximized } : win));
    focusWindow(id);
  };
  
  const dragWindow = (id: string, newPosition: { x: number; y: number }) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, position: newPosition } : win));
  };
  
  const resizeWindow = (id: string, newSize: { width: number; height: number }, newPosition: {x: number, y: number}) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, size: newSize, position: newPosition } : win));
  };

  const toggleStartMenu = useCallback(() => {
    playSound('/sounds/click.mp3');
    setIsStartMenuOpen(prev => !prev);
  }, []);

  const handleDesktopClick = () => {
    if (isStartMenuOpen) {
      toggleStartMenu();
    }
  };

  if (authState === 'loading') {
    return <LoadingScreen />;
  }

  if (authState === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div 
        className="h-screen w-screen bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1635350736043-2363675f3a14?q=80&w=2070&auto=format&fit=crop')" }}
        onClick={handleDesktopClick}
    >
      <Desktop
        windows={windows}
        focusedWindowId={focusedWindowId}
        onCloseWindow={closeWindow}
        onDestroyWindow={destroyWindow}
        onMinimizeWindow={minimizeWindow}
        onMaximizeWindow={maximizeWindow}
        onFocusWindow={focusWindow}
        onDragWindow={dragWindow}
        onResizeWindow={resizeWindow}
        onOpenApp={openApp}
        desktopRef={desktopRef}
      />
      {isStartMenuOpen && <StartMenu onOpenApp={openApp} onClose={toggleStartMenu} />}
      <Taskbar 
        onToggleStartMenu={toggleStartMenu}
        openWindows={windows}
        onFocusWindow={focusWindow}
        onCloseWindow={closeWindow}
        focusedWindowId={focusedWindowId}
      />
    </div>
  );
};

export default App;

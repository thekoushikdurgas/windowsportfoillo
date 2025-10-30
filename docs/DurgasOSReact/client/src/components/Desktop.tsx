import { useState, useCallback } from "react";
import { Taskbar } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { WindowManager } from "./WindowManager";
import { DesktopIcons } from "./DesktopIcons";
import { ContextMenu } from "./ContextMenu";
import type { WindowState, DesktopIcon } from "@shared/schema";

export function Desktop() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(1000);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const desktopIcons: DesktopIcon[] = [
    { id: "this-pc", name: "This PC", icon: "monitor", appId: "file-explorer" },
    { id: "recycle", name: "Recycle Bin", icon: "trash-2", appId: "recycle-bin" },
  ];

  const openWindow = useCallback((appId: string, title: string, icon: string) => {
    const existingWindow = windows.find(w => w.appId === appId);
    
    if (existingWindow) {
      setWindows(prev => prev.map(w => 
        w.id === existingWindow.id 
          ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 }
          : w
      ));
      setHighestZIndex(prev => prev + 1);
      return;
    }

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title,
      icon,
      isMinimized: false,
      isMaximized: false,
      position: { 
        x: 100 + windows.length * 30, 
        y: 80 + windows.length * 30 
      },
      size: { width: 800, height: 600 },
      zIndex: highestZIndex + 1,
    };

    setWindows(prev => [...prev, newWindow]);
    setHighestZIndex(prev => prev + 1);
  }, [windows, highestZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: highestZIndex + 1, isMinimized: false } : w
    ));
    setHighestZIndex(prev => prev + 1);
  }, [highestZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsStartMenuOpen(false);
      setContextMenu(null);
    }
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-[#1F1F1F] overflow-hidden select-none"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      data-testid="desktop"
    >
      {/* Desktop Icons */}
      <DesktopIcons icons={desktopIcons} onOpen={openWindow} />

      {/* Windows */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onMaximize={maximizeWindow}
        onFocus={focusWindow}
        onUpdatePosition={updateWindowPosition}
        onUpdateSize={updateWindowSize}
      />

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
        onWindowClick={focusWindow}
        onOpenApp={openWindow}
      />

      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu
          onClose={() => setIsStartMenuOpen(false)}
          onOpenApp={(appId, title, icon) => {
            openWindow(appId, title, icon);
            setIsStartMenuOpen(false);
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

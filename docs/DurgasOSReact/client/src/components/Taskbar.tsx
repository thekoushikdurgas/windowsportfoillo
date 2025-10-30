import { useEffect, useState } from "react";
import { 
  Search, 
  Wifi, 
  Volume2, 
  Battery,
  ChevronUp,
  Power,
  Folder,
  Globe,
  ShoppingBag,
  FileText
} from "lucide-react";
import type { WindowState } from "@shared/schema";

interface TaskbarProps {
  windows: WindowState[];
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onWindowClick: (id: string) => void;
  onOpenApp: (appId: string, title: string, icon: string) => void;
}

export function Taskbar({ 
  windows, 
  isStartMenuOpen, 
  onToggleStartMenu, 
  onWindowClick,
  onOpenApp 
}: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const pinnedApps = [
    { id: "file-explorer", title: "File Explorer", icon: "folder" },
    { id: "browser", title: "Browser", icon: "globe" },
    { id: "app-store", title: "App Store", icon: "shopping-bag" },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-center px-2 z-[9999]"
      style={{
        backgroundColor: "rgba(32, 32, 32, 0.85)",
        backdropFilter: "blur(40px) saturate(150%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      data-testid="taskbar"
    >
      <div className="flex items-center gap-1 flex-1 justify-center max-w-screen-xl">
        {/* Start Button */}
        <button
          onClick={onToggleStartMenu}
          className={`h-12 w-12 flex items-center justify-center rounded-lg transition-all hover-elevate active-elevate-2 ${
            isStartMenuOpen ? 'bg-white/10' : ''
          }`}
          data-testid="button-start-menu"
        >
          <div className="w-6 h-6 grid grid-cols-2 gap-[2px]">
            <div className="bg-[#0078D4] rounded-[1px]"></div>
            <div className="bg-[#0078D4] rounded-[1px]"></div>
            <div className="bg-[#0078D4] rounded-[1px]"></div>
            <div className="bg-[#0078D4] rounded-[1px]"></div>
          </div>
        </button>

        {/* Search Button */}
        <button
          className="h-12 px-4 flex items-center gap-2 rounded-lg transition-all hover-elevate active-elevate-2"
          data-testid="button-search"
        >
          <Search className="w-4 h-4 text-white/80" />
          <span className="text-[11px] text-white/60">Search</span>
        </button>

        {/* Pinned Apps */}
        {pinnedApps.map(app => {
          const activeWindow = windows.find(w => w.appId === app.id && !w.isMinimized);
          const getIcon = (iconName: string) => {
            switch (iconName) {
              case "folder": return <Folder className="w-5 h-5 text-white/90" />;
              case "globe": return <Globe className="w-5 h-5 text-white/90" />;
              case "shopping-bag": return <ShoppingBag className="w-5 h-5 text-white/90" />;
              default: return <Folder className="w-5 h-5 text-white/90" />;
            }
          };
          return (
            <button
              key={app.id}
              onClick={() => {
                if (activeWindow) {
                  onWindowClick(activeWindow.id);
                } else {
                  onOpenApp(app.id, app.title, app.icon);
                }
              }}
              className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all relative hover-elevate active-elevate-2 ${
                activeWindow ? 'bg-white/5' : ''
              }`}
              data-testid={`button-app-${app.id}`}
            >
              {getIcon(app.icon)}
              {activeWindow && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[#0078D4] rounded-t-full" />
              )}
            </button>
          );
        })}

        {/* Running Windows */}
        {windows.filter(w => 
          !pinnedApps.some(app => app.id === w.appId)
        ).map(window => (
          <button
            key={window.id}
            onClick={() => onWindowClick(window.id)}
            className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all relative hover-elevate active-elevate-2 ${
              !window.isMinimized ? 'bg-white/5' : ''
            }`}
            data-testid={`button-window-${window.appId}`}
          >
            <FileText className="w-5 h-5 text-white/90" />
            {!window.isMinimized && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] bg-[#0078D4] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="h-6 w-6 flex items-center justify-center rounded hover-elevate active-elevate-2" data-testid="button-tray-expand">
          <ChevronUp className="w-4 h-4 text-white/80" />
        </button>
        <button className="h-6 w-6 flex items-center justify-center rounded hover-elevate active-elevate-2" data-testid="button-wifi">
          <Wifi className="w-4 h-4 text-white/80" />
        </button>
        <button className="h-6 w-6 flex items-center justify-center rounded hover-elevate active-elevate-2" data-testid="button-volume">
          <Volume2 className="w-4 h-4 text-white/80" />
        </button>
        <button className="h-6 w-6 flex items-center justify-center rounded hover-elevate active-elevate-2" data-testid="button-battery">
          <Battery className="w-4 h-4 text-white/80" />
        </button>

        {/* Clock */}
        <button 
          className="flex flex-col items-end px-2 py-1 rounded hover-elevate active-elevate-2"
          data-testid="button-clock"
        >
          <span className="text-[11px] font-medium text-white leading-none">
            {formatTime(currentTime)}
          </span>
          <span className="text-[11px] text-white/60 leading-none mt-[2px]">
            {formatDate(currentTime)}
          </span>
        </button>
      </div>
    </div>
  );
}

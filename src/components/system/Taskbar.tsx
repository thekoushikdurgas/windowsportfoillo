'use client';

import { useDesktop } from '@/context/DesktopContext';
import { useDurgasAssistant } from '@/hooks/use-durgas-assistant';
import { SystemTray } from './SystemTray';
import { StartMenu } from './StartMenu';
import { WindowsLogo } from './WindowsLogo';
import { Mic, Search, Settings, Wifi, Battery, Volume2, Clock } from 'lucide-react';
import { apps } from '@/lib/apps.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/shared/ThemeSwitcher';

export function Taskbar() {
  const { windows, isStartMenuOpen, setStartMenuOpen, openApp, focusApp, toggleMinimize } = useDesktop();
  const { isAssistantOpen, assistantState, toggleAssistant } = useDurgasAssistant();

  const pinnedApps = apps.filter(app => app.pinned);

  const handleAppClick = (appId: string) => {
    const existingWindow = windows.find((w) => w.app.id === appId);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        toggleMinimize(existingWindow.id);
      }
      focusApp(existingWindow.id);
    } else {
      openApp(appId);
    }
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStartMenuOpen(!isStartMenuOpen)}
            className={cn(
              "h-10 w-10 rounded-lg transition-all duration-200",
              isStartMenuOpen ? "bg-white/20 hover:bg-white/30" : "hover:bg-white/10"
            )}
            aria-label="Start Menu"
          >
            <WindowsLogo className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAssistant}
            className={cn(
              "h-10 w-10 rounded-lg transition-all duration-200",
              isAssistantOpen ? "bg-white/20 hover:bg-white/30" : "hover:bg-white/10"
            )}
            aria-label="Durgas Assistant"
          >
            <Mic className={cn(
              "w-5 h-5",
              assistantState === 'listening' && "animate-pulse text-green-400",
              assistantState === 'thinking' && "animate-spin text-yellow-400",
              assistantState === 'speaking' && "animate-pulse text-blue-400"
            )} />
          </Button>

          <div className="h-6 w-px bg-white/20 mx-1" />

          <div className="flex items-center gap-1">
            {pinnedApps.map((app) => {
              const window = windows.find((w) => w.app.id === app.id);
              const isOpen = !!window;
              const isMinimized = window?.isMinimized;

              return (
                <Button
                  key={app.id}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAppClick(app.id)}
                  className={cn(
                    "h-10 w-10 rounded-lg transition-all duration-200 relative",
                    isOpen && !isMinimized ? "bg-white/20 hover:bg-white/30" : "hover:bg-white/10"
                  )}
                  aria-label={app.title}
                >
                  <app.Icon className="w-5 h-5" />
                  {isOpen && (
                    <Badge 
                      variant="default" 
                      size="sm" 
                      className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-blue-500"
                    />
                  )}
                  {isMinimized && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/60 rounded-full" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <ThemeSwitcher />

          <div className="h-6 w-px bg-white/20 mx-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="WiFi"
            >
              <Wifi className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Battery"
            >
              <Battery className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Volume"
            >
              <Volume2 className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Clock"
            >
              <Clock className="w-5 h-5" />
            </Button>
          </div>

          <SystemTray />
        </div>
      </div>

      <StartMenu />
    </>
  );
}

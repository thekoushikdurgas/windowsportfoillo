'use client';

import { useState } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { DesktopIcon } from '@/components/shared/DesktopIcon';
import { MobileAppWindow } from '@/components/shared/MobileAppWindow';
import { useSettingsStore } from '@/store/settingsStore';
import { wallpapers } from '@/lib/wallpapers';
import Image from 'next/image';
import { Menu, X, Plus, Clock, Wifi, Battery, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function MobileDesktop() {
  const { windows, isStartMenuOpen, setStartMenuOpen } = useDesktop();
  const { wallpaper: wallpaperId } = useSettingsStore();
  const wallpaper = wallpapers.find((p) => p.id === wallpaperId);
  const desktopApps = apps.filter(app => app.desktop);
  const [showAllApps] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Wallpaper */}
      {wallpaper && (
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.description || 'Desktop wallpaper'}
          fill
          quality={100}
          className="object-cover"
          priority
          data-ai-hint={wallpaper.imageHint}
        />
      )}
      
      {/* Desktop Icons Grid */}
      <div className="absolute inset-0 p-4">
        <div className="grid grid-cols-3 gap-6 h-full">
          {desktopApps.slice(0, showAllApps ? desktopApps.length : 6).map(app => (
            <DesktopIcon key={app.id} app={app} />
          ))}
          
          {desktopApps.length > 6 && !showAllApps && (
            <Card variant="glass" className="flex flex-col items-center justify-center w-24 h-24 p-2 hover:scale-105 transition-all duration-200 cursor-pointer">
              <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-2 border border-white/20">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-white text-center truncate w-full font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                  More Apps
                </span>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Mobile Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-t border-white/20 flex items-center justify-between px-4 shadow-2xl">
        <Button
          onClick={() => setStartMenuOpen(!isStartMenuOpen)}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          {windows.slice(0, 3).map((win) => (
            <Button
              key={win.id}
              variant="ghost"
              size="icon"
              onClick={() => {
                if (win.isMinimized) {
                  // Focus and unminimize
                } else {
                  // Focus
                }
              }}
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105"
              title={`Focus ${win.app.title}`}
            >
              <win.app.Icon className="w-4 h-4 text-white" />
              {win.isMinimized && (
                <Badge 
                  variant="secondary" 
                  size="sm" 
                  className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-orange-500"
                />
              )}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <Volume2 className="w-4 h-4 text-blue-400" />
          <Battery className="w-4 h-4 text-green-400" />
          <Card variant="glass" className="px-2 py-1">
            <CardContent className="p-0 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="text-white text-xs font-medium">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Start Menu */}
      {isStartMenuOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in">
          <div className="absolute bottom-16 left-0 right-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto shadow-2xl border-t border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Apps
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStartMenuOpen(false)}
                className="h-8 w-8 rounded-lg text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {apps.map((app) => (
                <Card
                  key={app.id}
                  variant="glass"
                  className="flex flex-col items-center p-3 hover:scale-105 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-white/10"
                  onClick={() => {
                    // Open app logic
                    setStartMenuOpen(false);
                  }}
                >
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-2 border border-white/20">
                      <app.Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-white text-center font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                      {app.title}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile App Windows */}
      {windows.map((win) => (
        <MobileAppWindow
          key={win.id}
          id={win.id}
          app={win.app}
          data={win.data}
          zIndex={win.zIndex}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          position={win.position}
          size={win.size}
        />
      ))}
    </div>
  );
}

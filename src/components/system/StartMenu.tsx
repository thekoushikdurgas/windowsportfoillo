'use client';

import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { Search, Power, Settings, User, Shield, Zap, Briefcase, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StartMenu() {
  const { isStartMenuOpen, setStartMenuOpen, openApp } = useDesktop();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  if (!isStartMenuOpen) return null;

  const pinnedApps = apps.filter(app => app.pinned);

  return (
    <div
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[700px] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col animate-fade-in overflow-hidden"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header with Search */}
      <div className="p-6 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Type here to search apps, files, and more..." 
            className="pl-10 bg-white/10 border-white/20 focus:bg-white/20 focus:border-white/30 text-white placeholder:text-gray-400 rounded-xl h-12" 
          />
        </div>
      </div>
      
      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Pinned Apps
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                All apps →
              </Button>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {pinnedApps.map((app) => (
                <Card
                  key={app.id}
                  variant="glass"
                  className="cursor-pointer hover:scale-105 transition-all duration-200 hover:bg-white/20"
                  onClick={() => {
                    openApp(app.id);
                    setStartMenuOpen(false);
                  }}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                    <div className="relative">
                      <app.Icon className="w-10 h-10 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs text-white font-medium text-center truncate w-full">
                      {app.title}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommended Files */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Recommended
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Card
                variant="glass"
                className="cursor-pointer hover:scale-105 transition-all duration-200 hover:bg-white/20"
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Project Proposal.docx</p>
                    <p className="text-gray-400 text-xs">Recently added</p>
                  </div>
                </CardContent>
              </Card>
              <Card
                variant="glass"
                className="cursor-pointer hover:scale-105 transition-all duration-200 hover:bg-white/20"
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <Image className="w-8 h-8 text-green-400" aria-label="Folder" />
                  <div>
                    <p className="text-white text-sm font-medium">Product_Screenshots</p>
                    <p className="text-gray-400 text-xs">1h ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white/5 border-l border-white/10 p-6">
          <div className="space-y-6">
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={userAvatar?.imageUrl} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-semibold">Koushik Chandra Saha</h3>
                <p className="text-gray-400 text-sm">Full Stack Developer</p>
                <Badge variant="success" size="sm" className="mt-1">
                  Online
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant="glass"
                className="w-full justify-start h-12 hover:bg-white/20"
                onClick={() => {
                  openApp('settings');
                  setStartMenuOpen(false);
                }}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
              <Button
                variant="glass"
                className="w-full justify-start h-12 hover:bg-white/20"
                onClick={() => {
                  openApp('about-me');
                  setStartMenuOpen(false);
                }}
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => setStartMenuOpen(false)}
              >
                <Power className="w-4 h-4 mr-3" />
                Shut Down
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

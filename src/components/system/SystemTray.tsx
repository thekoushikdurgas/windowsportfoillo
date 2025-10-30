'use client';

import { Wifi, Volume2, Battery, Clock, Bell } from 'lucide-react';
import { useLocalTime } from '@/hooks/use-local-time';
import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationPanel } from './NotificationPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SystemTray() {
  const { time, date } = useLocalTime();
  const [isClient, setIsClient] = useState(false);
  const { toggleNotifications, isOpen, unreadCount } = useNotifications();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <Wifi className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <Volume2 className="w-4 h-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
            <Battery className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        <Card variant="glass" className="px-3 py-1">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <div className="text-xs text-right leading-tight">
                <div>--:-- --</div>
                <div>--/--/----</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* System Status Icons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-white/10 transition-all duration-200"
          aria-label="WiFi Status"
        >
          <Wifi className="w-4 h-4 text-green-400" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-white/10 transition-all duration-200"
          aria-label="Volume"
        >
          <Volume2 className="w-4 h-4 text-blue-400" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-white/10 transition-all duration-200"
          aria-label="Battery Status"
        >
          <div className="flex items-center gap-1">
            <Battery className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white">98%</span>
          </div>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleNotifications}
          className={cn(
            "h-8 w-8 rounded-lg hover:bg-white/10 transition-all duration-200 relative",
            isOpen && "bg-white/20"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-yellow-400" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              size="sm" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Time and Date */}
      <Card variant="glass" className="px-3 py-1">
        <CardContent className="p-0">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-4 h-4 text-blue-400" />
            <div className="text-xs text-right leading-tight">
              <div className="font-medium">{time}</div>
              <div className="text-gray-400">{date}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Panel - Right Side Sliding */}
      <NotificationPanel 
        isOpen={isOpen} 
        onClose={toggleNotifications}
      />
    </div>
  );
}

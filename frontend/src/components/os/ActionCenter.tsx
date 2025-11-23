'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { Acrylic } from '@/components/ui/Acrylic';
import { cn } from '@/lib/utils/cn';
import {
  Wifi, Bluetooth, Plane, Battery, Moon, Sun, Monitor,
  Volume2, Brightness, Settings, ChevronUp, ChevronDown,
  X, Calendar, Bell
} from 'lucide-react';
import { BORDER_RADIUS } from '@/lib/windows11';

interface ActionCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Windows 11 Action Center Component
 * Quick actions, notifications, and calendar widget
 */
export const ActionCenter: React.FC<ActionCenterProps> = ({ isOpen, onClose }) => {
  const { isDarkMode, accentColor, transparencyEffect } = useTheme();
  const { notifications } = useNotification();
  const [time, setTime] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [toggles, setToggles] = useState({
    wifi: true,
    bluetooth: true,
    airplane: false,
    saver: false,
    night: false,
    accessibility: false,
  });

  const [volume, setVolume] = useState(85);
  const [brightness, setBrightness] = useState(100);

  const panelBg = isDarkMode 
    ? (transparencyEffect ? 'bg-[#202020]/95 backdrop-blur-xl' : 'bg-[#202020]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/95 backdrop-blur-xl' : 'bg-[#f3f3f3]');
    
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const activeBg = isDarkMode ? 'bg-white/10' : 'bg-black/5';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { daysInMonth, firstDayOfMonth } = useMemo(() => {
    const year = time.getFullYear();
    const month = time.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOfMonth: new Date(year, month, 1).getDay()
    };
  }, [time.getFullYear(), time.getMonth()]);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const ToggleButton = ({ 
    active, 
    icon, 
    label, 
    onClick 
  }: { 
    active: boolean; 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void;
  }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }} 
      className={cn(
        'flex flex-col items-center gap-2 w-full p-3 rounded-lg transition',
        active ? `bg-${accentColor.tailwind} text-white` : hoverBg,
        textColor
      )}
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-[11px] truncate w-full text-center">{label}</span>
    </button>
  );

  const Slider = ({ 
    icon, 
    value, 
    onChange 
  }: { 
    icon: React.ReactNode; 
    value: number; 
    onChange: (val: number) => void;
  }) => (
    <div className="flex items-center gap-3 h-8">
      <div className={mutedText}>{icon}</div>
      <div className={cn(
        'flex-1 h-1 rounded-full relative group cursor-pointer',
        isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
      )}>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onClick={(e) => e.stopPropagation()}
        />
        <div 
          className={cn(
            'absolute top-0 left-0 h-full rounded-full',
            `bg-${accentColor.tailwind}`
          )} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className={cn('text-xs w-10 text-right', mutedText)}>{value}%</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-[420px] z-[3000]',
        'win11-transition',
        panelBg,
        'border-l shadow-2xl',
        borderColor,
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{
        animation: isOpen ? 'win11-menu-slide-right 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-4 border-b shrink-0',
          borderColor
        )}>
          <h2 className={cn('text-lg font-semibold', textColor)}>Quick settings</h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition',
              hoverBg,
              textColor
            )}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <ToggleButton 
              active={toggles.wifi} 
              icon={<Wifi size={24} />} 
              label="Wi-Fi" 
              onClick={() => setToggles(t => ({...t, wifi: !t.wifi}))} 
            />
            <ToggleButton 
              active={toggles.bluetooth} 
              icon={<Bluetooth size={24} />} 
              label="Bluetooth" 
              onClick={() => setToggles(t => ({...t, bluetooth: !t.bluetooth}))} 
            />
            <ToggleButton 
              active={toggles.airplane} 
              icon={<Plane size={24} />} 
              label="Airplane" 
              onClick={() => setToggles(t => ({...t, airplane: !t.airplane}))} 
            />
            <ToggleButton 
              active={toggles.saver} 
              icon={<Battery size={24} />} 
              label="Battery Saver" 
              onClick={() => setToggles(t => ({...t, saver: !t.saver}))} 
            />
            <ToggleButton 
              active={toggles.night} 
              icon={<Moon size={24} />} 
              label="Night Light" 
              onClick={() => setToggles(t => ({...t, night: !t.night}))} 
            />
            <ToggleButton 
              active={toggles.accessibility} 
              icon={<Monitor size={24} />} 
              label="Accessibility" 
              onClick={() => setToggles(t => ({...t, accessibility: !t.accessibility}))} 
            />
          </div>

          <div className="space-y-3">
            <Slider icon={<Sun size={20}/>} value={brightness} onChange={setBrightness} />
            <Slider icon={<Volume2 size={20}/>} value={volume} onChange={setVolume} />
          </div>
        </div>

        {/* Notifications */}
        <div className="flex-1 overflow-y-auto win11-scrollbar">
          <div className="p-4">
            <div className={cn('flex items-center justify-between mb-3', textColor)}>
              <h3 className="text-sm font-semibold">Notifications</h3>
              <button className={cn('text-xs', mutedText, hoverBg, 'px-2 py-1 rounded')}>
                Clear all
              </button>
            </div>
            <div className="space-y-2">
              {notifications.length > 0 ? (
                notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-3 rounded-lg border transition',
                      hoverBg,
                      borderColor
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {notif.icon && (
                        <div className="mt-0.5">{notif.icon}</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-sm font-medium mb-1', textColor)}>
                          {notif.title}
                        </div>
                        <div className={cn('text-xs', mutedText)}>
                          {notif.message}
                        </div>
                        {notif.appName && (
                          <div className={cn('text-[10px] mt-1', mutedText)}>
                            {notif.appName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={cn('text-center py-8 text-sm', mutedText)}>
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className={cn(
          'p-4 border-t shrink-0',
          borderColor
        )}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className={cn('text-2xl font-semibold', textColor)}>
                {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </div>
              <div className={cn('text-sm', mutedText)}>
                {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className={cn(
                'p-2 rounded-lg transition',
                hoverBg,
                textColor
              )}
            >
              {calendarOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>

          {calendarOpen && (
            <div className={cn(
              'mt-3 p-3 rounded-lg border',
              borderColor,
              isDarkMode ? 'bg-black/20' : 'bg-white/50'
            )}>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className={cn('text-center text-xs font-medium py-1', mutedText)}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday = day === time.getDate();
                  return (
                    <div
                      key={day}
                      className={cn(
                        'aspect-square flex items-center justify-center text-xs rounded transition',
                        isToday 
                          ? `bg-${accentColor.tailwind} text-white font-semibold`
                          : hoverBg,
                        textColor
                      )}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionCenter;


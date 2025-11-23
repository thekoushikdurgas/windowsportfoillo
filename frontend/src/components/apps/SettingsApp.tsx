'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { WALLPAPERS, ACCENT_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';
import { 
  Monitor, Palette, Bluetooth, Wifi, User, AppWindow, 
  Gamepad2, Accessibility, ShieldCheck, Laptop, Moon, Sun, Droplet, Search
} from 'lucide-react';

const SettingsApp: React.FC<WindowProps> = () => {
  const { 
    isDarkMode, toggleTheme, 
    wallpaperUrl, setWallpaperUrl, 
    accentColor, setAccentColor,
    transparencyEffect, toggleTransparency,
    centerTaskbar, toggleTaskbarAlignment
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState('personalization');
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = isDarkMode 
    ? (transparencyEffect ? 'bg-[#1f1f1f]/95 backdrop-blur-xl' : 'bg-[#1f1f1f]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/95 backdrop-blur-xl' : 'bg-[#f3f3f3]');
  const sidebarColor = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#f9f9f9]';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const cardColor = isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const activeBg = isDarkMode ? 'bg-white/10' : 'bg-black/5';

  const menuItems = [
    { id: 'system', label: 'System', icon: Laptop },
    { id: 'bluetooth', label: 'Bluetooth & devices', icon: Bluetooth },
    { id: 'network', label: 'Network & internet', icon: Wifi },
    { id: 'personalization', label: 'Personalization', icon: Palette },
    { id: 'apps', label: 'Apps', icon: AppWindow },
    { id: 'accounts', label: 'Accounts', icon: User },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'privacy', label: 'Privacy & security', icon: ShieldCheck },
  ];

  const Toggle = ({ value, onToggle }: { value: boolean, onToggle: () => void }) => (
    <div 
      className={cn(
        'w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors',
        value ? `bg-${accentColor.tailwind}` : (isDarkMode ? 'bg-gray-600' : 'bg-gray-400')
      )}
      onClick={onToggle}
    >
      <div className={cn(
        'w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200',
        value ? 'translate-x-5' : 'translate-x-0'
      )} />
    </div>
  );

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('flex h-full', bgColor, textColor, 'font-sans')}>
      {/* Sidebar */}
      <div className={cn(
        'w-64 flex-shrink-0 flex flex-col',
        sidebarColor,
        'border-r',
        borderColor,
        'overflow-hidden'
      )}>
        {/* User Profile */}
        <div className="p-4 mb-2 flex items-center gap-3 border-b" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <div className={cn(
            'w-10 h-10 rounded-full',
            `bg-gradient-to-br from-${accentColor.tailwind} to-purple-400`
          )}></div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">User</span>
            <span className={cn('text-xs', mutedText)}>Local Account</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            isDarkMode ? 'bg-[#1f1f1f] border border-white/10' : 'bg-white border border-black/10'
          )}>
            <Search size={16} className={mutedText} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a setting"
              className={cn(
                'flex-1 bg-transparent outline-none text-sm',
                textColor,
                'placeholder:text-gray-500'
              )}
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 win11-scrollbar">
          <div className={cn('px-3 pb-2 text-xs font-semibold', mutedText)}>Settings</div>
          {filteredMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                activeTab === item.id ? activeBg : hoverBg
              )}
            >
              <item.icon 
                size={18} 
                className={activeTab === item.id ? `text-${accentColor.tailwind}` : mutedText} 
              />
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && (
                <div className={cn('w-1 h-4 rounded-full', `bg-${accentColor.tailwind}`)}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto win11-scrollbar">
        <div className="p-8">
          <h1 className={cn('text-3xl font-semibold mb-2', textColor)}>
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <p className={cn('text-sm mb-8', mutedText)}>
            Customize your {menuItems.find(i => i.id === activeTab)?.label.toLowerCase()} settings
          </p>

        {activeTab === 'personalization' && (
          <div className="space-y-6">
            <div className={cn(
              cardColor,
              'win11-rounded-card p-6 border',
              borderColor
            )}>
              <h2 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', textColor)}>
                <Moon size={20} /> Theme
              </h2>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className={textColor}>Dark mode</div>
                  <div className={cn('text-xs mt-0.5', mutedText)}>Switch between light and dark themes</div>
                </div>
                <Toggle value={isDarkMode} onToggle={toggleTheme} />
              </div>
            </div>

            <div className={cn(
              cardColor,
              'win11-rounded-card p-6 border',
              borderColor
            )}>
              <h2 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', textColor)}>
                <Droplet size={20} /> Accent Color
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      accentColor.id === color.id 
                        ? `border-${color.tailwind} ring-2 ring-${color.tailwind}/50` 
                        : borderColor,
                      hoverBg
                    )}
                  >
                    <div className={cn('w-full h-10 rounded mb-2', `bg-${color.tailwind}`)}></div>
                    <span className={cn('text-sm', textColor)}>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={cn(
              cardColor,
              'win11-rounded-card p-6 border',
              borderColor
            )}>
              <h2 className={cn('text-lg font-semibold mb-4', textColor)}>Background</h2>
              <div className="grid grid-cols-3 gap-3">
                {WALLPAPERS.map(wp => (
                  <button
                    key={wp.id}
                    onClick={() => setWallpaperUrl(wp.url)}
                    className={cn(
                      'relative aspect-video rounded-lg overflow-hidden border-2 transition-all',
                      wallpaperUrl === wp.url 
                        ? `border-${accentColor.tailwind} ring-2 ring-${accentColor.tailwind}/50` 
                        : borderColor,
                      'hover:scale-105'
                    )}
                  >
                    <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-center">
                      {wp.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={cn(
              cardColor,
              'win11-rounded-card p-6 border',
              borderColor
            )}>
              <h2 className={cn('text-lg font-semibold mb-4', textColor)}>Effects</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className={textColor}>Transparency effects</div>
                    <div className={cn('text-xs mt-0.5', mutedText)}>Enable acrylic and blur effects</div>
                  </div>
                  <Toggle value={transparencyEffect} onToggle={toggleTransparency} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className={textColor}>Center taskbar</div>
                    <div className={cn('text-xs mt-0.5', mutedText)}>Center taskbar icons</div>
                  </div>
                  <Toggle value={centerTaskbar} onToggle={toggleTaskbarAlignment} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'personalization' && (
          <div className={cn(
            cardColor,
            'win11-rounded-card p-6 border',
            borderColor
          )}>
            <p className={mutedText}>Settings for {menuItems.find(i => i.id === activeTab)?.label} coming soon...</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;


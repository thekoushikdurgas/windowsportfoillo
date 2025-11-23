'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { WALLPAPERS, ACCENT_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';
import { 
  Palette, Bluetooth, Wifi, User, AppWindow, 
  Gamepad2, Accessibility, ShieldCheck, Laptop, Moon, Droplet, Search
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
      className={cn('settings-toggle', value && 'settings-toggle-active')}
      onClick={onToggle}
      style={value ? { backgroundColor: accentColor.hex } : undefined}
    >
      <div className="settings-toggle-thumb" />
    </div>
  );

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('settings-container')} data-transparency={transparencyEffect} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Sidebar */}
      <div className="settings-sidebar">
        {/* User Profile */}
        <div className="settings-sidebar-profile">
          <div className="settings-sidebar-profile-avatar" style={{ background: `linear-gradient(to bottom right, ${accentColor.hex}, #a855f7)` }}></div>
          <div className="settings-sidebar-profile-info">
            <span className="settings-sidebar-profile-name">User</span>
            <span className="settings-sidebar-profile-subtitle">Local Account</span>
          </div>
        </div>

        {/* Search */}
        <div className="settings-sidebar-search">
          <div className="settings-sidebar-search-input">
            <Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find a setting"
              className="settings-sidebar-search-input-field"
            />
          </div>
        </div>

        {/* Menu Items */}
        <div className="settings-sidebar-menu win11-scrollbar">
          <div className="settings-sidebar-menu-title">Settings</div>
          {filteredMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn('settings-sidebar-menu-item', activeTab === item.id && 'settings-sidebar-menu-item-active')}
            >
              <item.icon 
                size={18} 
                className="settings-sidebar-menu-item-icon"
                style={activeTab === item.id ? { color: accentColor.hex } : undefined}
              />
              <span className="settings-sidebar-menu-item-label">{item.label}</span>
              {activeTab === item.id && (
                <div className="settings-sidebar-menu-item-indicator" style={{ backgroundColor: accentColor.hex }}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="settings-content win11-scrollbar">
        <div className="settings-content-inner">
          <h1 className="settings-content-title">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <p className="settings-content-subtitle">
            Customize your {menuItems.find(i => i.id === activeTab)?.label.toLowerCase()} settings
          </p>

        {activeTab === 'personalization' && (
          <div className="settings-content-sections">
            <div className="settings-card">
              <h2 className="settings-card-title">
                <Moon size={20} /> Theme
              </h2>
              <div className="settings-card-row">
                <div className="settings-card-row-info">
                  <div className="settings-card-row-label">Dark mode</div>
                  <div className="settings-card-row-description">Switch between light and dark themes</div>
                </div>
                <Toggle value={isDarkMode} onToggle={toggleTheme} />
              </div>
            </div>

            <div className="settings-card">
              <h2 className="settings-card-title">
                <Droplet size={20} /> Accent Color
              </h2>
              <div className="settings-color-grid">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color)}
                    className={cn('settings-color-button', accentColor.id === color.id && 'settings-color-button-active')}
                    style={accentColor.id === color.id ? { borderColor: color.hex, boxShadow: `0 0 0 2px ${color.hex}50` } : undefined}
                  >
                    <div className="settings-color-preview" style={{ '--color-preview': color.hex, backgroundColor: color.hex } as React.CSSProperties}></div>
                    <span className="settings-color-name">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <h2 className="settings-card-title">Background</h2>
              <div className="settings-wallpaper-grid">
                {WALLPAPERS.map(wp => (
                  <button
                    key={wp.id}
                    onClick={() => setWallpaperUrl(wp.url)}
                    className={cn('settings-wallpaper-button', wallpaperUrl === wp.url && 'settings-wallpaper-button-active')}
                    style={wallpaperUrl === wp.url ? { borderColor: accentColor.hex, boxShadow: `0 0 0 2px ${accentColor.hex}50` } : undefined}
                  >
                    <div className="settings-wallpaper-image-wrapper">
                      <Image 
                        src={wp.url} 
                        alt={wp.name} 
                        className="settings-wallpaper-image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="settings-wallpaper-label">
                      {wp.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <h2 className="settings-card-title">Effects</h2>
              <div className="settings-card-rows">
                <div className="settings-card-row">
                  <div className="settings-card-row-info">
                    <div className="settings-card-row-label">Transparency effects</div>
                    <div className="settings-card-row-description">Enable acrylic and blur effects</div>
                  </div>
                  <Toggle value={transparencyEffect} onToggle={toggleTransparency} />
                </div>
                <div className="settings-card-row">
                  <div className="settings-card-row-info">
                    <div className="settings-card-row-label">Center taskbar</div>
                    <div className="settings-card-row-description">Center taskbar icons</div>
                  </div>
                  <Toggle value={centerTaskbar} onToggle={toggleTaskbarAlignment} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'personalization' && (
          <div className="settings-card">
            <p className="settings-card-row-description">Settings for {menuItems.find(i => i.id === activeTab)?.label} coming soon...</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;


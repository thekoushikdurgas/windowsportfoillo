'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Store, Search, Download, Star } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rating: number;
  category: string;
}

const StoreApp: React.FC<WindowProps> = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');


  const apps: App[] = [
    {
      id: '1',
      name: 'Calculator',
      description: 'Standard calculator app',
      icon: <Store size={32} />,
      rating: 4.5,
      category: 'Utilities',
    },
    {
      id: '2',
      name: 'Notepad',
      description: 'Simple text editor',
      icon: <Store size={32} />,
      rating: 4.0,
      category: 'Productivity',
    },
    {
      id: '3',
      name: 'Terminal',
      description: 'Command line interface',
      icon: <Store size={32} />,
      rating: 4.8,
      category: 'Developer Tools',
    },
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('store-container')} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Header */}
      <div className="store-header" data-theme={isDarkMode ? 'dark' : 'light'}>
        <Store size={24} />
        <h1 className="store-title">App Store</h1>
        <div className="flex-1"></div>
        <div className="store-search" data-theme={isDarkMode ? 'dark' : 'light'}>
          <Search size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="store-search-input"
          />
        </div>
      </div>

      {/* Content */}
      <div className="store-content win11-scrollbar">
        <div className="store-grid">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="store-app-card"
              data-theme={isDarkMode ? 'dark' : 'light'}
            >
              <div className="store-app-header">
                <div className="store-app-icon" data-theme={isDarkMode ? 'dark' : 'light'}>
                  {app.icon}
                </div>
                <div className="store-app-info">
                  <h3 className="store-app-name">{app.name}</h3>
                  <div className="store-app-rating">
                    <Star size={14} className="store-app-rating-star" />
                    <span className="store-app-rating-value">{app.rating}</span>
                  </div>
                </div>
              </div>
              <p className="store-app-description">{app.description}</p>
              <div className="store-app-footer">
                <span className="store-app-category">{app.category}</span>
                <button className="store-app-install-button">
                  <Download size={14} />
                  Install
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreApp;


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

const StoreApp: React.FC<WindowProps> = ({ windowId, isActive }) => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const bgColor = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';

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
    <div className={cn('h-full flex flex-col', bgColor, textColor)}>
      {/* Header */}
      <div className={cn(
        'h-16 flex items-center gap-4 px-6 border-b shrink-0',
        borderColor,
        isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-50'
      )}>
        <Store size={24} />
        <h1 className="text-xl font-semibold">App Store</h1>
        <div className="flex-1"></div>
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-black/10'
        )}>
          <Search size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className={cn(
              'bg-transparent outline-none text-sm',
              textColor,
              'placeholder:text-gray-500'
            )}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 win11-scrollbar">
        <div className="grid grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={cn(
                'p-4 rounded-lg border transition',
                borderColor,
                hoverBg,
                isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-50'
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  'p-3 rounded-lg',
                  isDarkMode ? 'bg-white/10' : 'bg-white border border-gray-200'
                )}>
                  {app.icon}
                </div>
                <div className="flex-1">
                  <h3 className={cn('font-semibold mb-1', textColor)}>{app.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className={cn('text-xs', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
                      {app.rating}
                    </span>
                  </div>
                </div>
              </div>
              <p className={cn('text-sm mb-3', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
                {app.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={cn('text-xs', isDarkMode ? 'text-gray-500' : 'text-gray-500')}>
                  {app.category}
                </span>
                <button className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition',
                  'bg-blue-600 hover:bg-blue-700 text-white',
                  'flex items-center gap-2'
                )}>
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


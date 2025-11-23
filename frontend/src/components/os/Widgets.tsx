'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Acrylic } from '@/components/ui/Acrylic';
import { cn } from '@/lib/utils/cn';
import { Cloud, CloudRain, Sun, Calendar, TrendingUp, Newspaper, X } from 'lucide-react';
import { BORDER_RADIUS } from '@/lib/windows11';

interface WidgetsProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Windows 11 Widgets Panel Component
 * Weather, Calendar, News, and Stock widgets
 */
export const Widgets: React.FC<WidgetsProps> = ({ isOpen, onClose }) => {
  const { isDarkMode, accentColor, transparencyEffect } = useTheme();

  const panelBg = isDarkMode 
    ? (transparencyEffect ? 'bg-[#202020]/95 backdrop-blur-xl' : 'bg-[#202020]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/95 backdrop-blur-xl' : 'bg-[#f3f3f3]');
    
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';

  // Mock data
  const [weather] = useState({
    temp: 72,
    condition: 'Sunny',
    high: 78,
    low: 65,
    location: 'New York, NY',
  });

  const [stocks] = useState([
    { symbol: 'MSFT', name: 'Microsoft', price: 378.85, change: 2.34, changePercent: 0.62 },
    { symbol: 'AAPL', name: 'Apple', price: 175.43, change: -1.23, changePercent: -0.70 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 142.56, change: 0.89, changePercent: 0.63 },
  ]);

  const [news] = useState([
    { title: 'Tech Industry Updates', source: 'Tech News', time: '2h ago' },
    { title: 'Market Analysis', source: 'Finance Daily', time: '4h ago' },
    { title: 'Innovation Trends', source: 'Innovation Weekly', time: '6h ago' },
  ]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-full w-[400px] z-[3000]',
        'win11-transition',
        panelBg,
        'border-r shadow-2xl',
        borderColor,
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      style={{
        animation: isOpen ? 'win11-menu-slide-left 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-4 border-b shrink-0',
          borderColor
        )}>
          <h2 className={cn('text-lg font-semibold', textColor)}>Widgets</h2>
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

        {/* Widgets Content */}
        <div className="flex-1 overflow-y-auto win11-scrollbar p-4 space-y-4">
          {/* Weather Widget */}
          <div className={cn(
            'p-4 rounded-lg border',
            borderColor,
            isDarkMode ? 'bg-black/20' : 'bg-white/50'
          )}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn('text-sm font-semibold', textColor)}>Weather</h3>
              <Cloud size={20} className={mutedText} />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold" style={{ color: accentColor.hex }}>
                {weather.temp}°
              </div>
              <div className="flex-1">
                <div className={cn('text-sm font-medium', textColor)}>{weather.condition}</div>
                <div className={cn('text-xs', mutedText)}>{weather.location}</div>
                <div className={cn('text-xs mt-1', mutedText)}>
                  H: {weather.high}° L: {weather.low}°
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className={cn(
            'p-4 rounded-lg border',
            borderColor,
            isDarkMode ? 'bg-black/20' : 'bg-white/50'
          )}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn('text-sm font-semibold', textColor)}>Calendar</h3>
              <Calendar size={20} className={mutedText} />
            </div>
            <div className={cn('text-2xl font-bold mb-1', textColor)}>
              {new Date().getDate()}
            </div>
            <div className={cn('text-xs', mutedText)}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long' })}
            </div>
          </div>

          {/* Stocks Widget */}
          <div className={cn(
            'p-4 rounded-lg border',
            borderColor,
            isDarkMode ? 'bg-black/20' : 'bg-white/50'
          )}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn('text-sm font-semibold', textColor)}>Stocks</h3>
              <TrendingUp size={20} className={mutedText} />
            </div>
            <div className="space-y-2">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between">
                  <div>
                    <div className={cn('text-sm font-medium', textColor)}>{stock.symbol}</div>
                    <div className={cn('text-xs', mutedText)}>{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-sm font-medium', textColor)}>${stock.price}</div>
                    <div
                      className={cn('text-xs', stock.change >= 0 ? 'text-green-500' : 'text-red-500')}
                    >
                      {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Widget */}
          <div className={cn(
            'p-4 rounded-lg border',
            borderColor,
            isDarkMode ? 'bg-black/20' : 'bg-white/50'
          )}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn('text-sm font-semibold', textColor)}>News</h3>
              <Newspaper size={20} className={mutedText} />
            </div>
            <div className="space-y-3">
              {news.map((item, index) => (
                <div key={index} className={cn('pb-3', index < news.length - 1 && 'border-b', borderColor)}>
                  <div className={cn('text-sm font-medium mb-1', textColor)}>{item.title}</div>
                  <div className={cn('text-xs flex items-center gap-2', mutedText)}>
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;


'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Calendar, TrendingUp, Newspaper, X, Cloud } from 'lucide-react';

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
      className={cn('widgets-container', 'win11-transition')}
      data-open={isOpen}
      data-transparency={transparencyEffect}
      data-theme={isDarkMode ? 'dark' : 'light'}
      style={{
        animation: isOpen ? 'win11-menu-slide-left 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="widgets-inner">
        {/* Header */}
        <div className="widgets-header">
          <h2 className="widgets-header-title">Widgets</h2>
          <button
            onClick={onClose}
            className="widgets-header-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Widgets Content */}
        <div className="widgets-content win11-scrollbar">
          {/* Weather Widget */}
          <div className="widget-card" data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className="widget-card-header">
              <h3 className="widget-card-title">Weather</h3>
              <Cloud size={20} />
            </div>
            <div className="flex items-center gap-4">
              <div className="widget-weather-temp" style={{ color: accentColor.hex }}>
                {weather.temp}°
              </div>
              <div className="widget-weather-info">
                <div className="widget-weather-condition">{weather.condition}</div>
                <div className="widget-weather-location">{weather.location}</div>
                <div className="widget-weather-range">
                  H: {weather.high}° L: {weather.low}°
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="widget-card" data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className="widget-card-header">
              <h3 className="widget-card-title">Calendar</h3>
              <Calendar size={20} />
            </div>
            <div className="widget-calendar-date">
              {new Date().getDate()}
            </div>
            <div className="widget-calendar-day">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long' })}
            </div>
          </div>

          {/* Stocks Widget */}
          <div className="widget-card" data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className="widget-card-header">
              <h3 className="widget-card-title">Stocks</h3>
              <TrendingUp size={20} />
            </div>
            <div className="space-y-2">
              {stocks.map((stock) => (
                <div key={stock.symbol} className="widget-stock-item">
                  <div>
                    <div className="widget-stock-symbol">{stock.symbol}</div>
                    <div className="widget-stock-name">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="widget-stock-price">${stock.price}</div>
                    <div className={cn('widget-stock-change', stock.change >= 0 ? 'widget-stock-change-positive' : 'widget-stock-change-negative')}>
                      {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News Widget */}
          <div className="widget-card" data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className="widget-card-header">
              <h3 className="widget-card-title">News</h3>
              <Newspaper size={20} />
            </div>
            <div className="space-y-3">
              {news.map((item, index) => (
                <div key={index} className="widget-news-item">
                  <div className="widget-news-title">{item.title}</div>
                  <div className="widget-news-meta">
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


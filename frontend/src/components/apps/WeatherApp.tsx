'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Cloud, CloudRain, Sun, CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';

const WeatherApp: React.FC<WindowProps> = ({ windowId, isActive }) => {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const bgColor = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';

  // Mock weather data
  const [weather] = useState({
    location: 'New York, NY',
    temp: 72,
    condition: 'Sunny',
    high: 78,
    low: 65,
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: 'Today', high: 78, low: 65, condition: 'Sunny', icon: <Sun size={24} /> },
      { day: 'Tomorrow', high: 75, low: 62, condition: 'Partly Cloudy', icon: <CloudSun size={24} /> },
      { day: 'Wed', high: 73, low: 60, condition: 'Cloudy', icon: <Cloud size={24} /> },
      { day: 'Thu', high: 70, low: 58, condition: 'Rainy', icon: <CloudRain size={24} /> },
      { day: 'Fri', high: 76, low: 63, condition: 'Sunny', icon: <Sun size={24} /> },
    ],
  });

  return (
    <div className={cn('h-full flex flex-col', bgColor, textColor)}>
      {/* Current Weather */}
      <div className={cn(
        'p-8 border-b',
        borderColor,
        'bg-gradient-to-br from-blue-500 to-blue-700'
      )}>
        <div className="text-white">
          <div className="text-sm opacity-90 mb-2">{weather.location}</div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl font-light">{weather.temp}°</div>
            <div>
              <div className="text-xl font-medium">{weather.condition}</div>
              <div className="text-sm opacity-90">H: {weather.high}° L: {weather.low}°</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Droplets size={16} />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={16} />
              <span>{weather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="flex-1 overflow-y-auto p-6 win11-scrollbar">
        <h2 className={cn('text-lg font-semibold mb-4', textColor)}>5-Day Forecast</h2>
        <div className="space-y-3">
          {weather.forecast.map((day, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg border',
                borderColor,
                isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-50'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn('text-blue-400', isDarkMode ? 'text-blue-400' : 'text-blue-600')}>
                  {day.icon}
                </div>
                <div>
                  <div className={cn('font-medium', textColor)}>{day.day}</div>
                  <div className={cn('text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600')}>
                    {day.condition}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn('font-medium', textColor)}>
                  {day.high}° / {day.low}°
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;


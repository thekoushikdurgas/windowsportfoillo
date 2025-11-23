'use client';

import React, { useState } from 'react';
import { WindowProps } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { Cloud, CloudRain, Sun, CloudSun, Droplets, Wind } from 'lucide-react';

const WeatherApp: React.FC<WindowProps> = () => {
  const { isDarkMode } = useTheme();


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
    <div className={cn('weather-container')} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Current Weather */}
      <div className="weather-header">
        <div className="weather-header-content">
          <div className="weather-location">{weather.location}</div>
          <div className="weather-main">
            <div className="weather-temp">{weather.temp}°</div>
            <div className="weather-info">
              <div className="weather-condition">{weather.condition}</div>
              <div className="weather-range">H: {weather.high}° L: {weather.low}°</div>
            </div>
          </div>
          <div className="weather-details">
            <div className="weather-detail-item">
              <Droplets size={16} />
              <span>{weather.humidity}%</span>
            </div>
            <div className="weather-detail-item">
              <Wind size={16} />
              <span>{weather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="weather-forecast win11-scrollbar">
        <h2 className="weather-forecast-title">5-Day Forecast</h2>
        <div className="weather-forecast-list">
          {weather.forecast.map((day, index) => (
            <div
              key={index}
              className="weather-forecast-item"
              data-theme={isDarkMode ? 'dark' : 'light'}
            >
              <div className="weather-forecast-left">
                <div className="weather-forecast-icon" data-theme={isDarkMode ? 'dark' : 'light'}>
                  {day.icon}
                </div>
                <div>
                  <div className="weather-forecast-day">{day.day}</div>
                  <div className="weather-forecast-condition">{day.condition}</div>
                </div>
              </div>
              <div className="weather-forecast-right">
                <div className="weather-forecast-temp">
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


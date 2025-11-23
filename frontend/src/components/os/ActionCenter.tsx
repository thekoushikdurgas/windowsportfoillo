'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useNotification } from '@/context/NotificationContext';
import { cn } from '@/lib/utils/cn';
import {
  Wifi, Bluetooth, Plane, Battery, Moon, Sun, Monitor,
  Volume2, ChevronUp, ChevronDown,
  X
} from 'lucide-react';

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


  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = time.getFullYear();
  const month = time.getMonth();
  const { daysInMonth, firstDayOfMonth } = useMemo(() => {
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOfMonth: new Date(year, month, 1).getDay()
    };
  }, [year, month]);

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
      className={cn('action-center-toggle-button', active && 'action-center-toggle-button-active')}
      style={active ? { backgroundColor: accentColor.hex, color: 'white' } : undefined}
    >
      <div className="action-center-toggle-icon">{icon}</div>
      <span className="action-center-toggle-label">{label}</span>
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
    <div className="action-center-slider-container">
      <div className="action-center-slider-icon">{icon}</div>
      <div className="action-center-slider-track" data-theme={isDarkMode ? 'dark' : 'light'}>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="action-center-slider-input"
          onClick={(e) => e.stopPropagation()}
        />
        <div 
          className="action-center-slider-fill"
          style={{ width: `${value}%`, backgroundColor: accentColor.hex }}
        ></div>
      </div>
      <span className="action-center-slider-value">{value}%</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div
      className={cn('action-center-container', 'win11-transition')}
      data-open={isOpen}
      data-transparency={transparencyEffect}
      data-theme={isDarkMode ? 'dark' : 'light'}
      style={{
        animation: isOpen ? 'win11-menu-slide-right 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="action-center-inner">
        {/* Header */}
        <div className="action-center-header">
          <h2 className="action-center-header-title">Quick settings</h2>
          <button
            onClick={onClose}
            className="action-center-header-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="action-center-content">
          <div className="action-center-quick-actions">
            <div className="action-center-quick-actions-title">Quick actions</div>
            <div className="action-center-quick-actions-grid">
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

          <div className="action-center-slider" style={{ marginTop: '12px' }}>
            <Slider icon={<Sun size={20}/>} value={brightness} onChange={setBrightness} />
          </div>
          <div className="action-center-slider">
            <Slider icon={<Volume2 size={20}/>} value={volume} onChange={setVolume} />
          </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="action-center-content win11-scrollbar" style={{ flex: '1 1 0%', overflowY: 'auto' }}>
          <div className="action-center-notifications-section">
            <div className="action-center-notifications-header">
              <h3 className="action-center-notifications-title">Notifications</h3>
              <button className="action-center-notifications-clear-button">
                Clear all
              </button>
            </div>
            <div className="action-center-notifications-list">
              {notifications.length > 0 ? (
                notifications.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className="action-center-notification-item"
                    data-theme={isDarkMode ? 'dark' : 'light'}
                  >
                    {notif.icon && (
                      <div className="action-center-notification-icon">{notif.icon}</div>
                    )}
                    <div className="action-center-notification-content">
                      <div className="action-center-notification-title">
                        {notif.title}
                      </div>
                      <div className="action-center-notification-message">
                        {notif.message}
                      </div>
                      {notif.appName && (
                        <div className="action-center-notification-time">
                          {notif.appName}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="action-center-no-notifications">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="action-center-footer">
          <div className="action-center-footer-time-section">
            <div className="action-center-footer-date">
              {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
            <div className="action-center-footer-day">
              {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="action-center-footer-button"
          >
            {calendarOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        {calendarOpen && (
          <div className="action-center-calendar-panel" data-theme={isDarkMode ? 'dark' : 'light'}>
            <div className="action-center-calendar-grid-header">
              {weekDays.map(day => (
                <div key={day} className="action-center-calendar-weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="action-center-calendar-grid">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="action-center-calendar-day action-center-calendar-day-empty"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === time.getDate();
                return (
                  <div
                    key={day}
                    className="action-center-calendar-day"
                    data-current-day={isToday}
                    style={isToday ? { backgroundColor: accentColor.hex, color: 'white' } : undefined}
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
  );
};

export default ActionCenter;


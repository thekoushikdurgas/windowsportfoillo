'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppDefinition, WindowState } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { 
  Search, Wifi, Volume2, Battery, ChevronUp, ChevronLeft, ChevronRight, 
  Bluetooth, Plane, Moon, Sun, Monitor, Settings, Pen, Power, X
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import ActionCenter from './ActionCenter';

interface TaskbarProps {
  apps: AppDefinition[];
  openWindows: WindowState[];
  activeWindowId: string | null;
  onAppClick: (appId: string, options?: { forceNew?: boolean }) => void;
  onMinimizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  startOpen: boolean;
  toggleStart: (e: React.MouseEvent) => void;
  onShowDesktop: () => void;
  actionCenterOpen?: boolean;
  toggleActionCenter?: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  apps, openWindows, activeWindowId, onAppClick, 
  onMinimizeWindow, onFocusWindow, onCloseWindow,
  startOpen, toggleStart, onShowDesktop,
  actionCenterOpen = false,
  toggleActionCenter
}) => {
  const { isDarkMode, accentColor, transparencyEffect, centerTaskbar } = useTheme();
  const [time, setTime] = useState(new Date());
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [hiddenIconsOpen, setHiddenIconsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Use Action Center if provided, otherwise use local state
  const [localActionCenterOpen, setLocalActionCenterOpen] = useState(false);
  const isActionCenterOpen = actionCenterOpen !== undefined ? actionCenterOpen : localActionCenterOpen;
  const handleToggleActionCenter = useCallback(() => {
    if (toggleActionCenter) {
      toggleActionCenter();
    } else {
      setLocalActionCenterOpen(prev => !prev);
    }
  }, [toggleActionCenter]);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [showAllApps, setShowAllApps] = useState(false);

  const [toggles, setToggles] = useState({
    wifi: true,
    bluetooth: true,
    airplane: false,
    saver: false,
    night: false,
    accessibility: false
  });
  const [volume, setVolume] = useState(85);
  const [brightness, setBrightness] = useState(100);



  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!startOpen) {
       const t = setTimeout(() => setShowAllApps(false), 300);
       return () => clearTimeout(t);
    }
  }, [startOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      setQuickSettingsOpen(false);
      setHiddenIconsOpen(false);
      setCalendarOpen(false);
      if (isActionCenterOpen && !actionCenterOpen) {
        handleToggleActionCenter();
      }
    };
    if (quickSettingsOpen || hiddenIconsOpen || calendarOpen || isActionCenterOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [quickSettingsOpen, hiddenIconsOpen, calendarOpen, isActionCenterOpen, actionCenterOpen, handleToggleActionCenter]);

  const togglePanel = (e: React.MouseEvent, panelSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.stopPropagation();
    if (panelSetter !== setQuickSettingsOpen) setQuickSettingsOpen(false);
    if (panelSetter !== setHiddenIconsOpen) setHiddenIconsOpen(false);
    if (panelSetter !== setCalendarOpen) setCalendarOpen(false);
    panelSetter(prev => !prev);
  };

  const handleAppClick = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
        onAppClick(appId, { forceNew: true });
        return;
    }

    const instances = openWindows.filter(w => w.appId === appId);
    if (instances.length === 0) {
        onAppClick(appId);
    } else if (instances.length === 1) {
        const instance = instances[0];
        if (instance.id === activeWindowId && !instance.isMinimized) {
            onMinimizeWindow(instance.id);
        } else {
            onFocusWindow(instance.id);
        }
    } else {
        const hasActive = instances.some(w => w.id === activeWindowId && !w.isMinimized);
        if (hasActive) {
             const active = instances.find(w => w.id === activeWindowId);
             if (active) onMinimizeWindow(active.id);
        } else {
             const recent = [...instances].sort((a,b) => b.zIndex - a.zIndex)[0];
             onFocusWindow(recent.id);
        }
    }
  };

  const ToggleButton = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="taskbar-quick-settings-toggle-button">
      <div className={cn('taskbar-quick-settings-toggle-icon', active && 'taskbar-quick-settings-toggle-icon-active')} data-active={active} data-theme={isDarkMode ? 'dark' : 'light'}>
        {icon}
      </div>
      <span className="taskbar-quick-settings-toggle-label">{label}</span>
    </button>
  );

  const Slider = ({ icon, value, onChange }: { icon: React.ReactNode, value: number, onChange: (val: number) => void }) => (
    <div className="action-center-slider">
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
          style={{ width: `${value}%`, '--slider-value': `${value}%` } as React.CSSProperties}
        ></div>
      </div>
      <span className="action-center-slider-value">{value}%</span>
    </div>
  );

  const dateTooltip = time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  const displayApps = useMemo(() => {
     const pinnedIds = new Set(apps.map(a => a.id));
     const unpinnedOpenApps = openWindows
        .filter(w => !pinnedIds.has(w.appId))
        .map(w => w.appId)
        .filter((id, index, self) => self.indexOf(id) === index)
        .map(id => {
            return apps.find(a => a.id === id) || { id, title: 'Unknown', icon: <div className="taskbar-unknown-icon"/>, component: () => null };
        });
     return [...apps, ...unpinnedOpenApps];
  }, [apps, openWindows]);


  return (
    <>
      {/* Start Menu - Windows 11 Style */}
      <div 
        className={cn(
          'taskbar-start-menu',
          'win11-rounded-panel',
          'win11-transition'
        )} 
        data-open={startOpen}
        data-centered={centerTaskbar}
        data-transparency={transparencyEffect}
        data-theme={isDarkMode ? 'dark' : 'light'}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: startOpen ? 'win11-menu-slide-up 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
        }}
      >
        {/* Search Bar */}
        <div className="taskbar-start-menu-search">
          <div className="taskbar-start-menu-search-input">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search for apps, settings, and documents" 
              className="taskbar-start-menu-search-input-field"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="taskbar-start-menu-content">
          {!showAllApps ? (
            <>
              {/* Pinned Apps Section */}
              <div className="taskbar-start-menu-pinned">
                <div className="taskbar-start-menu-pinned-header">
                  <div className="taskbar-start-menu-pinned-title">Pinned</div>
                  <button 
                    onClick={() => setShowAllApps(true)} 
                    className="taskbar-start-menu-pinned-header-button"
                  >
                    All apps <ChevronRight size={12} />
                  </button>
                </div>
                <div className="taskbar-start-menu-pinned-grid">
                  {apps.slice(0, 18).map(app => (
                    <button 
                      key={app.id} 
                      onClick={(e) => handleAppClick(app.id, e)} 
                      className="taskbar-start-menu-app-button"
                    >
                      <div className="taskbar-start-menu-app-icon">
                        {React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 32 })}
                      </div>
                      <span className="taskbar-start-menu-app-title">
                        {app.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Section */}
              <div className="taskbar-start-menu-recommended" data-theme={isDarkMode ? 'dark' : 'light'}>
                <div className="taskbar-start-menu-recommended-title">Recommended</div>
                <div className="taskbar-start-menu-recommended-list">
                  {openWindows.slice(0, 3).map(win => {
                    const app = apps.find(a => a.id === win.appId);
                    if (!app) return null;
                    return (
                      <button
                        key={win.id}
                        onClick={(e) => { e.stopPropagation(); onFocusWindow(win.id); }}
                        className="taskbar-start-menu-recommended-item"
                      >
                        <div className="taskbar-start-menu-recommended-item-icon">
                          {React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 20 })}
                        </div>
                        <div className="taskbar-start-menu-recommended-item-content">
                          <div className="taskbar-start-menu-recommended-item-title">{win.title}</div>
                          <div className="taskbar-start-menu-recommended-item-subtitle">Recently opened</div>
                        </div>
                      </button>
                    );
                  })}
                  {openWindows.length === 0 && (
                    <div className="taskbar-start-menu-recommended-item-subtitle" style={{ padding: '16px', textAlign: 'center' }}>
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="taskbar-start-menu-pinned" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <div className="taskbar-start-menu-pinned-header">
                <span className="taskbar-start-menu-pinned-title">All Apps</span>
                <button 
                  onClick={() => setShowAllApps(false)} 
                  className="taskbar-start-menu-pinned-header-button"
                >
                  <ChevronLeft size={12}/> Back
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 win11-scrollbar">
                <div className="taskbar-start-menu-all-apps-list">
                  {[...apps].sort((a,b) => a.title.localeCompare(b.title)).map(app => (
                    <button 
                      key={app.id} 
                      onClick={(e) => handleAppClick(app.id, e)}
                      className="taskbar-start-menu-recommended-item"
                    >
                      <div className="taskbar-start-menu-recommended-item-icon">
                        {React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 20 })}
                      </div>
                      <span className="taskbar-start-menu-recommended-item-title">{app.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - User Profile */}
        <div className="taskbar-start-menu-footer" data-theme={isDarkMode ? 'dark' : 'light'}>
          <div className="taskbar-start-menu-footer-user">
            <div className="taskbar-start-menu-footer-user-avatar" style={{ background: `linear-gradient(to bottom right, ${accentColor.hex}, #9333ea)` }}></div>
            <span className="taskbar-start-menu-footer-user-name">Durgas User</span>
          </div>
          <button className="taskbar-start-menu-footer-power">
            <Power size={20} />
          </button>
        </div>
      </div>

      {/* Quick Settings Panel */}
      {quickSettingsOpen && (
        <div 
          className={cn('taskbar-quick-settings')}
          data-transparency={transparencyEffect}
          data-theme={isDarkMode ? 'dark' : 'light'}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="taskbar-quick-settings-grid">
            <ToggleButton active={toggles.wifi} icon={<Wifi size={20} />} label="Wi-Fi" onClick={() => setToggles(t => ({...t, wifi: !t.wifi}))} />
            <ToggleButton active={toggles.bluetooth} icon={<Bluetooth size={20} />} label="Bluetooth" onClick={() => setToggles(t => ({...t, bluetooth: !t.bluetooth}))} />
            <ToggleButton active={toggles.airplane} icon={<Plane size={20} />} label="Airplane" onClick={() => setToggles(t => ({...t, airplane: !t.airplane}))} />
            <ToggleButton active={toggles.saver} icon={<Battery size={20} />} label="Battery Saver" onClick={() => setToggles(t => ({...t, saver: !t.saver}))} />
            <ToggleButton active={toggles.night} icon={<Moon size={20} />} label="Night Light" onClick={() => setToggles(t => ({...t, night: !t.night}))} />
            <ToggleButton active={toggles.accessibility} icon={<Monitor size={20} />} label="Accessibility" onClick={() => setToggles(t => ({...t, accessibility: !t.accessibility}))} />
          </div>
          <div className="taskbar-quick-settings-sliders">
             <Slider icon={<Sun size={20}/>} value={brightness} onChange={setBrightness} />
             <Slider icon={<Volume2 size={20}/>} value={volume} onChange={setVolume} />
          </div>
          <div className="taskbar-quick-settings-footer">
             <div className="taskbar-quick-settings-footer-battery">
                <Battery size={16} />
                <span>74%</span>
             </div>
             <div className="taskbar-quick-settings-footer-actions">
                <button className="taskbar-quick-settings-footer-button"><Pen size={14} /></button>
                <button className="taskbar-quick-settings-footer-button" onClick={() => { setQuickSettingsOpen(false); onAppClick('settings'); }}><Settings size={14} /></button>
             </div>
          </div>
        </div>
      )}

      {/* Taskbar Main Bar */}
      <div className={cn('taskbar-main')} data-transparency={transparencyEffect} data-theme={isDarkMode ? 'dark' : 'light'}>
        {centerTaskbar && <div className="flex-1"></div>}
        
        <div className="taskbar-left">
          <button onClick={toggleStart} className={cn('taskbar-button', startOpen && 'taskbar-button-active')} title="Start">
             <img 
               src="/icon.png" 
               alt="DurgasOS Logo" 
               className="taskbar-start-icon"
               width="20"
               height="20"
             />
          </button>
          
          {displayApps.map(app => {
            const instances = openWindows.filter(w => w.appId === app.id);
            const isOpen = instances.length > 0;
            const hasActive = instances.some(w => w.id === activeWindowId && !w.isMinimized);
            
            return (
              <div 
                key={app.id} 
                className="taskbar-app-icon-container"
                onMouseEnter={() => setHoveredAppId(app.id)}
                onMouseLeave={() => setHoveredAppId(null)}
              >
                <button 
                  onClick={(e) => handleAppClick(app.id, e)} 
                  className={cn('taskbar-button', hasActive && 'taskbar-button-active')}
                  title={app.title}
                >
                  {React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                </button>

                {isOpen && (
                  <div className={cn('taskbar-indicator', hasActive && 'taskbar-indicator-active', instances.length > 1 && 'taskbar-indicator-multiple')} style={hasActive ? { backgroundColor: accentColor.hex } : undefined} data-active={hasActive} data-multiple={instances.length > 1}>
                  </div>
                )}
                
                {hoveredAppId === app.id && isOpen && (
                  <div className={cn('taskbar-thumbnail-preview')} data-transparency={transparencyEffect} data-theme={isDarkMode ? 'dark' : 'light'}>
                     {instances.map(instance => (
                       <div 
                         key={instance.id}
                         onClick={(e) => { e.stopPropagation(); onFocusWindow(instance.id); }}
                         className={cn('taskbar-thumbnail-item', activeWindowId === instance.id && 'taskbar-thumbnail-item-active')}
                         data-active={activeWindowId === instance.id}
                         data-theme={isDarkMode ? 'dark' : 'light'}
                         style={activeWindowId === instance.id ? { borderColor: accentColor.hex } : undefined}
                       >
                          <div className="taskbar-thumbnail-item-header">
                             {React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 12 })}
                             <span className="taskbar-thumbnail-item-title">{instance.title}</span>
                             <button 
                               onClick={(e) => { e.stopPropagation(); onCloseWindow(instance.id); }} 
                               className="taskbar-thumbnail-item-close"
                             >
                               <X size={10} />
                             </button>
                          </div>
                          <div className="taskbar-thumbnail-item-content">
                             {React.cloneElement(app.icon as React.ReactElement<{ size?: number; className?: string }>, { size: 24, className: 'taskbar-thumbnail-item-icon-placeholder' })}
                          </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="taskbar-right">
           <button 
              onClick={(e) => togglePanel(e, setHiddenIconsOpen)}
              className={cn('taskbar-button', hiddenIconsOpen && 'taskbar-button-active')}
           ><ChevronUp size={16} /></button>
           <button
              onClick={(e) => { e.stopPropagation(); handleToggleActionCenter(); }}
              className={cn('taskbar-button', isActionCenterOpen && 'taskbar-button-active')}
           >
             <Wifi size={18} />
             <Volume2 size={18} />
             <Battery size={18} />
           </button>
           <div 
             onClick={(e) => togglePanel(e, setCalendarOpen)}
             className={cn('taskbar-time', calendarOpen && 'taskbar-time-open')}
             data-open={calendarOpen}
             title={dateTooltip}
            >
             <div className="taskbar-time-text">{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
             <div className="taskbar-time-date">{time.toLocaleDateString()}</div>
           </div>
           <div 
             className="taskbar-divider"
             data-theme={isDarkMode ? 'dark' : 'light'}
             title="Show desktop"
             onClick={onShowDesktop}
           ></div>
        </div>
      </div>

      {/* Action Center */}
      {toggleActionCenter !== undefined ? (
        <ActionCenter 
          isOpen={isActionCenterOpen} 
          onClose={() => handleToggleActionCenter()} 
        />
      ) : (
        <ActionCenter 
          isOpen={isActionCenterOpen} 
          onClose={() => setLocalActionCenterOpen(false)} 
        />
      )}
    </>
  );
};

export default Taskbar;


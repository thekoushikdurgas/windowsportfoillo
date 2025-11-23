import React, { useState, useEffect, useMemo } from 'react';
import { AppDefinition, WindowState } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Search, Wifi, Volume2, Battery, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Bluetooth, 
  Plane, Moon, Sun, Monitor, Settings, Pen, Shield, Cloud, 
  MessageCircle, Gamepad2, Mic, Power, X
} from 'lucide-react';

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
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  apps, openWindows, activeWindowId, onAppClick, 
  onMinimizeWindow, onFocusWindow, onCloseWindow,
  startOpen, toggleStart, onShowDesktop 
}) => {
  const { isDarkMode, accentColor, transparencyEffect, centerTaskbar } = useTheme();
  const [time, setTime] = useState(new Date());
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [hiddenIconsOpen, setHiddenIconsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [showAllApps, setShowAllApps] = useState(false);

  // Quick Settings State
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

  // Theme-aware styles
  const glassBg = isDarkMode 
    ? (transparencyEffect ? 'bg-[#202020]/85 backdrop-blur-xl' : 'bg-[#202020]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/85 backdrop-blur-xl' : 'bg-[#f3f3f3]');
    
  const panelBg = isDarkMode 
    ? (transparencyEffect ? 'bg-[#202020]/95 backdrop-blur-xl' : 'bg-[#202020]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/95 backdrop-blur-xl' : 'bg-[#f3f3f3]');
    
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const activeBg = isDarkMode ? 'bg-white/10' : 'bg-black/5';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // Calendar Logic
  const { daysInMonth, firstDayOfMonth } = useMemo(() => {
    const year = time.getFullYear();
    const month = time.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOfMonth: new Date(year, month, 1).getDay()
    };
  }, [time.getFullYear(), time.getMonth()]);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
    };
    if (quickSettingsOpen || hiddenIconsOpen || calendarOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [quickSettingsOpen, hiddenIconsOpen, calendarOpen]);

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
        // Multiple instances behavior
        const hasActive = instances.some(w => w.id === activeWindowId && !w.isMinimized);
        if (hasActive) {
             const active = instances.find(w => w.id === activeWindowId);
             if (active) onMinimizeWindow(active.id);
        } else {
             // Bring most recent to front
             const recent = [...instances].sort((a,b) => b.zIndex - a.zIndex)[0];
             onFocusWindow(recent.id);
        }
    }
  };

  const ToggleButton = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`flex flex-col items-center gap-2 w-full`}>
      <div className={`w-full aspect-[2/1] rounded-xl flex items-center justify-center transition-colors border ${active ? `bg-${accentColor.tailwind} border-${accentColor.tailwind} text-white` : isDarkMode ? 'bg-[#333] border-gray-600 hover:bg-[#3a3a3a] text-white' : 'bg-white border-gray-300 hover:bg-gray-50 text-black'}`}>
        {icon}
      </div>
      <span className={`text-[11px] truncate w-full text-center ${textColor}`}>{label}</span>
    </button>
  );

  const Slider = ({ icon, value, onChange }: { icon: React.ReactNode, value: number, onChange: (val: number) => void }) => (
    <div className="flex items-center gap-3 h-8">
      <div className={mutedText}>{icon}</div>
      <div className={`flex-1 h-1 rounded-full relative group cursor-pointer ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onClick={(e) => e.stopPropagation()}
        />
        <div 
          className={`absolute top-0 left-0 h-full rounded-full bg-${accentColor.tailwind}`} 
          style={{ width: `${value}%` }}
        ></div>
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${value}%`, transform: `translate(-50%, -50%)` }}
        ></div>
      </div>
    </div>
  );

  const dateTooltip = time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  // Combine pinned apps and unpinned open apps
  const displayApps = useMemo(() => {
     const pinnedIds = new Set(apps.map(a => a.id));
     const unpinnedOpenApps = openWindows
        .filter(w => !pinnedIds.has(w.appId))
        .map(w => w.appId)
        .filter((id, index, self) => self.indexOf(id) === index) // Unique
        .map(id => {
            // Find definition if possible, or fallback
            return apps.find(a => a.id === id) || { id, title: 'Unknown', icon: <div className="w-full h-full bg-gray-500 rounded"/>, component: () => null };
        });
     return [...apps, ...unpinnedOpenApps];
  }, [apps, openWindows]);

  const startMenuClasses = centerTaskbar 
    ? 'left-1/2 -translate-x-1/2 origin-bottom' 
    : 'left-2 translate-x-0 origin-bottom-left';

  return (
    <>
      {/* Start Menu */}
      <div className={`absolute bottom-14 w-[640px] ${panelBg} rounded-xl border ${isDarkMode ? 'border-white/10' : 'border-black/10'} shadow-2xl p-6 transition-all duration-200 z-50 ${startMenuClasses} ${startOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-6">
          <div className={`${isDarkMode ? 'bg-[#1f1f1f] border-white/10' : 'bg-white border-black/10'} border rounded-full px-4 py-2.5 flex items-center gap-2 text-gray-400 shadow-inner`}>
            <Search size={18} />
            <input type="text" placeholder="Search for apps, settings, and documents" className={`bg-transparent text-sm w-full outline-none ${textColor} placeholder:text-gray-500`} />
          </div>
        </div>

        {/* Start Content Area */}
        <div className="min-h-[300px]">
           {!showAllApps ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="flex justify-between items-center mb-4 px-4">
                    <div className={`text-sm font-semibold ${textColor}`}>Pinned</div>
                    <button 
                      onClick={() => setShowAllApps(true)} 
                      className={`${hoverBg} px-3 py-1 rounded text-xs ${textColor} transition flex items-center gap-1`}
                    >
                      All apps <ChevronRight size={12} />
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-4 px-2">
                    {apps.map(app => (
                      <button key={app.id} onClick={(e) => handleAppClick(app.id, e)} className={`flex flex-col items-center gap-2 p-2 ${hoverBg} rounded transition group`}>
                        <div className={`p-3 rounded-xl shadow-lg group-hover:scale-105 group-hover:shadow-xl transition duration-200 ${isDarkMode ? 'bg-white/5' : 'bg-white border border-gray-100'}`}>
                            {React.cloneElement(app.icon as React.ReactElement<any>, { size: 32 })}
                        </div>
                        <span className={`text-xs font-medium ${textColor} text-center line-clamp-2 w-full`}>{app.title}</span>
                      </button>
                    ))}
                  </div>
              </div>
           ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-[300px] flex flex-col">
                  <div className="flex items-center justify-between mb-2 px-2 shrink-0">
                      <span className={`text-sm font-semibold ${textColor}`}>All Apps</span>
                      <button 
                        onClick={() => setShowAllApps(false)} 
                        className={`text-xs ${hoverBg} px-2 py-1 rounded ${textColor} flex items-center gap-1`}
                      >
                         <ChevronLeft size={12}/> Back
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="flex flex-col gap-1 pb-2">
                        {[...apps].sort((a,b) => a.title.localeCompare(b.title)).map(app => (
                            <button 
                                key={app.id} 
                                onClick={(e) => handleAppClick(app.id, e)}
                                className={`flex items-center gap-3 p-2 rounded-lg ${hoverBg} transition text-left group px-4`}
                            >
                                <div className={`p-1.5 rounded-lg shadow-sm ${isDarkMode ? 'bg-white/10' : 'bg-white border border-gray-100'}`}>
                                    {React.cloneElement(app.icon as React.ReactElement<any>, { size: 20 })}
                                </div>
                                <span className={`text-sm font-medium ${textColor}`}>{app.title}</span>
                            </button>
                        ))}
                      </div>
                  </div>
              </div>
           )}
        </div>

        <div className={`mt-10 border-t ${isDarkMode ? 'border-white/10 bg-black/20' : 'border-black/5 bg-gray-50'} pt-4 flex justify-between items-center px-6 -mx-6 -mb-6 py-4 rounded-b-xl`}>
           <div className={`flex items-center gap-3 ${hoverBg} p-2 rounded-lg transition cursor-pointer`}>
             <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${accentColor.tailwind} to-purple-600 border border-white/20`}></div>
             <span className={`text-sm font-medium ${textColor}`}>Durgas User</span>
           </div>
           <button className={`${textColor} ${hoverBg} p-2 rounded-lg transition`}><Power size={20} /></button>
        </div>
      </div>

      {/* Hidden Icons & Settings Panels */}
      {hiddenIconsOpen && (
        <div 
          className={`absolute bottom-14 right-36 ${panelBg} border ${isDarkMode ? 'border-white/10' : 'border-black/10'} rounded-lg p-2 shadow-xl z-50 animate-in slide-in-from-bottom-2 fade-in duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-3 gap-1">
            <div className={`p-2 ${hoverBg} rounded text-blue-400`} title="OneDrive"><Cloud size={16} /></div>
            <div className={`p-2 ${hoverBg} rounded text-green-400`} title="Security"><Shield size={16} /></div>
            <div className={`p-2 ${hoverBg} rounded text-indigo-400`} title="Discord"><MessageCircle size={16} /></div>
            <div className={`p-2 ${hoverBg} rounded ${textColor}`} title="Steam"><Gamepad2 size={16} /></div>
            <div className={`p-2 ${hoverBg} rounded text-red-400`} title="Mic In Use"><Mic size={16} /></div>
          </div>
        </div>
      )}

      {/* Quick Settings Panel */}
      {quickSettingsOpen && (
        <div 
          className={`absolute bottom-14 right-4 w-80 ${panelBg} border ${isDarkMode ? 'border-white/10' : 'border-black/10'} rounded-xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-3 gap-3 mb-6">
            <ToggleButton active={toggles.wifi} icon={<Wifi size={20} />} label="Wi-Fi" onClick={() => setToggles(t => ({...t, wifi: !t.wifi}))} />
            <ToggleButton active={toggles.bluetooth} icon={<Bluetooth size={20} />} label="Bluetooth" onClick={() => setToggles(t => ({...t, bluetooth: !t.bluetooth}))} />
            <ToggleButton active={toggles.airplane} icon={<Plane size={20} />} label="Airplane" onClick={() => setToggles(t => ({...t, airplane: !t.airplane}))} />
            <ToggleButton active={toggles.saver} icon={<Battery size={20} />} label="Battery Saver" onClick={() => setToggles(t => ({...t, saver: !t.saver}))} />
            <ToggleButton active={toggles.night} icon={<Moon size={20} />} label="Night Light" onClick={() => setToggles(t => ({...t, night: !t.night}))} />
            <ToggleButton active={toggles.accessibility} icon={<Monitor size={20} />} label="Accessibility" onClick={() => setToggles(t => ({...t, accessibility: !t.accessibility}))} />
          </div>
          <div className="space-y-4 mb-6">
             <Slider icon={<Sun size={20}/>} value={brightness} onChange={setBrightness} />
             <Slider icon={<Volume2 size={20}/>} value={volume} onChange={setVolume} />
          </div>
          <div className={`flex justify-between items-center border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'} pt-3`}>
             <div className={`flex items-center gap-2 ${textColor} opacity-80 text-xs`}>
                <Battery size={16} />
                <span>74%</span>
             </div>
             <div className="flex gap-2">
                <button className={`p-2 ${hoverBg} rounded-full transition ${textColor}`}><Pen size={14} /></button>
                <button className={`p-2 ${hoverBg} rounded-full transition ${textColor}`} onClick={() => { setQuickSettingsOpen(false); onAppClick('settings'); }}><Settings size={14} /></button>
             </div>
          </div>
        </div>
      )}

      {/* Calendar Panel */}
      {calendarOpen && (
        <div 
          className={`absolute bottom-14 right-4 w-96 h-[500px] ${panelBg} border ${isDarkMode ? 'border-white/10' : 'border-black/10'} rounded-xl shadow-2xl p-4 z-50 flex flex-col animate-in slide-in-from-right-4 fade-in duration-200`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-y-auto mb-4 min-h-[150px]">
             <div className="flex justify-between items-center mb-2">
                <span className={`text-xs ${mutedText} font-semibold uppercase tracking-wider`}>Notifications</span>
                <span className={`text-xs text-${accentColor.tailwind} cursor-pointer hover:underline`}>Clear all</span>
             </div>
             <div className={`${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} ${hoverBg} transition rounded-lg p-3 border mb-2 cursor-pointer group`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 bg-${accentColor.tailwind} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition`}><Settings size={12} className="text-white"/></div>
                  <span className={`text-xs ${textColor} font-bold`}>System</span>
                  <span className={`text-[10px] ${mutedText} ml-auto`}>Just now</span>
                </div>
                <div className={`text-sm ${textColor} font-medium`}>Welcome to DurgasOS</div>
                <div className={`text-xs ${mutedText} mt-0.5`}>Your AI-powered workspace is ready. Explore the apps to get started.</div>
             </div>
          </div>
          <div className={`${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-black/5'} rounded-xl p-4 border`}>
            <div className="flex justify-between items-center mb-4">
                <div className={textColor}>
                    <div className="text-sm font-semibold">{time.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="flex gap-1">
                    <button className={`p-1 ${hoverBg} rounded-full transition`}><ChevronUp size={16} className={`rotate-[-90deg] ${mutedText}`}/></button>
                    <button className={`p-1 ${hoverBg} rounded-full transition`}><ChevronUp size={16} className={`rotate-90deg ${mutedText}`}/></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {weekDays.map(d => (<div key={d} className={`text-[10px] ${mutedText} font-medium py-1`}>{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                 {Array.from({ length: firstDayOfMonth }).map((_, i) => (<div key={`empty-${i}`} className="h-8"></div>))}
                 {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === time.getDate();
                    return (<div key={day} className={`h-8 w-8 flex items-center justify-center rounded-full text-xs transition cursor-pointer ${isToday ? `bg-${accentColor.tailwind} text-white font-bold` : `${textColor} ${hoverBg}`}`}>{day}</div>);
                 })}
            </div>
          </div>
           <div className={`flex justify-center mt-2 pt-2 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'} cursor-pointer ${hoverBg} rounded transition`} onClick={() => setCalendarOpen(false)}>
               <ChevronDown size={16} className={mutedText} />
           </div>
        </div>
      )}

      {/* Taskbar Main Bar */}
      <div className={`absolute bottom-0 w-full h-12 ${glassBg} border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'} flex items-center justify-between px-2 z-40 transition-all duration-300`}>
        {/* Left Spacer for Centering */}
        {centerTaskbar && <div className="flex-1"></div>}
        
        {/* Apps Container */}
        <div className="flex items-center gap-1 h-full">
          <button onClick={toggleStart} className={`p-2 rounded ${hoverBg} transition ${startOpen ? activeBg : ''}`} title="Start">
             <div className="grid grid-cols-2 gap-[2px]">
               <div className="w-3 h-3 bg-blue-500 rounded-[1px]"></div>
               <div className="w-3 h-3 bg-blue-500 rounded-[1px]"></div>
               <div className="w-3 h-3 bg-blue-500 rounded-[1px]"></div>
               <div className="w-3 h-3 bg-blue-500 rounded-[1px]"></div>
            </div>
          </button>
          
          {displayApps.map(app => {
            const instances = openWindows.filter(w => w.appId === app.id);
            const isOpen = instances.length > 0;
            const hasActive = instances.some(w => w.id === activeWindowId && !w.isMinimized);
            
            return (
              <div 
                key={app.id} 
                className="relative group h-full flex items-center justify-center px-1"
                onMouseEnter={() => setHoveredAppId(app.id)}
                onMouseLeave={() => setHoveredAppId(null)}
              >
                <button 
                  onClick={(e) => handleAppClick(app.id, e)} 
                  className={`p-2 rounded ${hoverBg} transition mx-1 ${hasActive ? activeBg : ''} active:scale-90 duration-100 relative`}
                  title={app.title}
                >
                  {React.cloneElement(app.icon as React.ReactElement<any>, { size: 24 })}
                  
                  {/* Multiple Instances Stack Effect */}
                  {instances.length > 1 && (
                     <div className={`absolute top-1 -right-1 flex flex-col gap-0.5 pointer-events-none opacity-80`}>
                        {/* Subtle visual cue for multiple windows */}
                     </div>
                  )}
                </button>

                {/* Open Indicator */}
                {isOpen && (
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ${hasActive ? `w-3 bg-${accentColor.tailwind} h-1` : 'w-1 bg-gray-400 h-1'} ${instances.length > 1 ? 'w-8' : ''}`}>
                    {/* If multiple, split indicator or just wider pill */}
                    {instances.length > 1 && <div className="absolute inset-0 border-x-2 border-transparent border-opacity-50"></div>}
                  </div>
                )}
                
                {/* Thumbnails Tooltip */}
                {hoveredAppId === app.id && isOpen && (
                  <div className={`absolute bottom-[130%] left-1/2 -translate-x-1/2 flex gap-2 p-2 ${panelBg} rounded-lg shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-black/10'} animate-in fade-in slide-in-from-bottom-2 z-50`}>
                     {instances.map(instance => (
                       <div 
                         key={instance.id}
                         onClick={(e) => { e.stopPropagation(); onFocusWindow(instance.id); }}
                         className={`w-40 h-28 ${isDarkMode ? 'bg-[#2d2d2d] hover:bg-[#3d3d3d]' : 'bg-gray-100 hover:bg-white'} rounded-md cursor-pointer transition relative flex flex-col group/thumb border ${activeWindowId === instance.id ? `border-${accentColor.tailwind}` : 'border-transparent'}`}
                       >
                          {/* Thumb Header */}
                          <div className="flex items-center gap-2 p-2 border-b border-black/5 dark:border-white/5">
                             {React.cloneElement(app.icon as React.ReactElement<any>, { size: 12 })}
                             <span className={`text-[10px] truncate flex-1 ${textColor}`}>{instance.title}</span>
                             <button 
                               onClick={(e) => { e.stopPropagation(); onCloseWindow(instance.id); }} 
                               className="hover:bg-red-500 hover:text-white rounded p-0.5 opacity-0 group-hover/thumb:opacity-100 transition"
                             >
                               <X size={10} />
                             </button>
                          </div>
                          {/* Thumb Body (Fake Preview) */}
                          <div className="flex-1 p-2 flex items-center justify-center opacity-50">
                             {React.cloneElement(app.icon as React.ReactElement<any>, { size: 24, className: 'opacity-20' })}
                          </div>
                       </div>
                     ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right System Tray */}
        <div className="flex-1 flex justify-end items-center gap-2 h-full py-1">
           <button 
              onClick={(e) => togglePanel(e, setHiddenIconsOpen)}
              className={`${hoverBg} p-1 rounded transition ${textColor} opacity-80 ${hiddenIconsOpen ? activeBg : ''}`}
           ><ChevronUp size={16} /></button>
           <div 
              onClick={(e) => togglePanel(e, setQuickSettingsOpen)}
              className={`${hoverBg} p-1 px-2 rounded transition cursor-default flex gap-2 ${textColor} opacity-90 ${quickSettingsOpen ? activeBg : ''}`}
           >
             <Wifi size={18} />
             <Volume2 size={18} />
             <Battery size={18} />
           </div>
           <div 
             onClick={(e) => togglePanel(e, setCalendarOpen)}
             className={`${hoverBg} p-1 px-2 rounded transition cursor-default text-right ${calendarOpen ? activeBg : ''}`}
             title={dateTooltip}
            >
             <div className={`text-xs ${textColor} font-medium leading-tight`}>{time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
             <div className={`text-[10px] ${textColor} opacity-90 leading-tight`}>{time.toLocaleDateString()}</div>
           </div>
           <div 
             className={`w-1 h-full border-l ${isDarkMode ? 'border-white/10' : 'border-black/10'} ml-1 ${hoverBg} transition cursor-pointer`} 
             title="Show desktop"
             onClick={onShowDesktop}
           ></div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
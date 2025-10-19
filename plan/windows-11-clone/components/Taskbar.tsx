import React, { useState, useEffect } from 'react';
import { WindowsLogo, WifiIcon, VolumeIcon, BatteryIcon } from './icons';
import type { WindowState } from '../types';
import TaskbarThumbnail from './TaskbarThumbnail';

interface TaskbarProps {
  onToggleStartMenu: () => void;
  openWindows: WindowState[];
  onFocusWindow: (windowId: string) => void;
  onCloseWindow: (windowId: string) => void;
  focusedWindowId: string | null;
}

const Taskbar: React.FC<TaskbarProps> = ({ onToggleStartMenu, openWindows, onFocusWindow, onCloseWindow, focusedWindowId }) => {
  const [time, setTime] = useState(new Date());
  const [hoveredWindowId, setHoveredWindowId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: '2-digit' });

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-200/70 dark:bg-gray-900/70 backdrop-blur-xl flex justify-center items-center z-50">
      <div className="flex items-center space-x-2 max-w-[calc(100%-12rem)] overflow-x-auto md:max-w-none md:overflow-visible">
         <button onClick={onToggleStartMenu} className="p-2 rounded-md text-blue-600 dark:text-blue-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <WindowsLogo />
        </button>
        {openWindows.map(win => {
           return (
             <div 
                key={win.id}
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHoveredWindowId(win.id)}
                onMouseLeave={() => setHoveredWindowId(null)}
             >
                {hoveredWindowId === win.id && (
                    <TaskbarThumbnail window={win} onClose={onCloseWindow} />
                )}
                <button
                  onClick={() => onFocusWindow(win.id)}
                  className={`relative p-2 rounded-md text-gray-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 transition-all duration-200
                    ${focusedWindowId === win.id && !win.isMinimized ? 'bg-black/10 dark:bg-white/10' : ''}
                  `}
                  aria-label={`Focus ${win.title}`}
                >
                    {/* Use the taskbarIcon from the window state, with a fallback to the regular icon */}
                    {React.cloneElement(win.taskbarIcon || win.icon, { className: 'w-6 h-6' })}
                    {win.isMinimized && (
                      <div className="absolute bottom-1 left-2 right-2 h-[3px] bg-blue-500 rounded-full"></div>
                    )}
                     {focusedWindowId === win.id && !win.isMinimized && (
                      <div className="absolute bottom-1 left-2 right-2 h-[3px] bg-blue-500 rounded-full"></div>
                    )}
                </button>
             </div>
           );
        })}
      </div>

      <div className="absolute right-4 flex items-center space-x-1 sm:space-x-3 text-black dark:text-white text-xs">
        <div className="flex items-center space-x-1 sm:space-x-3">
          <WifiIcon className="w-4 h-4" />
          <VolumeIcon className="w-4 h-4" />
          <BatteryIcon className="w-4 h-4" />
        </div>
        <div className="h-4 w-px bg-gray-500"></div>
        <button className="text-center p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
          <div className="text-center">
            <div>{timeString}</div>
            <div className="hidden sm:block">{dateString}</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Taskbar;

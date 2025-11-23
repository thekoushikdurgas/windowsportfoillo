'use client';

import React, { useEffect, useState } from 'react';
import { NotificationItem } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { X, Bell, Clock } from 'lucide-react';

interface Props {
  notification: NotificationItem;
  onClose: (id: string) => void;
  onSnooze: (id: string, duration: number) => void;
}

const NotificationToast: React.FC<Props> = ({ notification, onClose, onSnooze }) => {
  const { isDarkMode, accentColor } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSnoozeMenu(true);
  };

  const handleSnooze = (duration: number) => {
      onSnooze(notification.id, duration);
      setShowSnoozeMenu(false);
  };

  const bg = isDarkMode ? 'bg-[#202020]/95' : 'bg-[#f3f3f3]/95';
  const menuBg = isDarkMode ? 'bg-[#2d2d2d]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';

  return (
    <div 
      className={`
        w-80 rounded-lg shadow-2xl backdrop-blur-md border ${borderColor} ${bg} 
        transition-all duration-300 ease-out transform
        ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-8 opacity-0 scale-95'}
        cursor-pointer group relative overflow-hidden select-none
      `}
      onClick={() => onClose(notification.id)}
      onContextMenu={handleContextMenu}
      onMouseLeave={() => setShowSnoozeMenu(false)}
    >
        {showSnoozeMenu ? (
            <div className={`absolute inset-0 z-20 ${menuBg} flex flex-col p-2 animate-in fade-in duration-200`} onClick={(e) => e.stopPropagation()}>
                <div className={`text-xs font-semibold ${mutedText} mb-2 px-2 flex items-center gap-1`}>
                    <Clock size={12} /> Snooze notification
                </div>
                <div className="flex flex-col gap-1">
                    <button 
                        onClick={() => handleSnooze(60 * 1000)}
                        className={`text-left text-xs ${textColor} px-2 py-1.5 rounded ${hoverBg} transition flex justify-between items-center`}
                    >
                        <span>For 1 minute (Demo)</span>
                    </button>
                    <button 
                        onClick={() => handleSnooze(60 * 60 * 1000)}
                        className={`text-left text-xs ${textColor} px-2 py-1.5 rounded ${hoverBg} transition flex justify-between items-center`}
                    >
                        <span>For 1 hour</span>
                    </button>
                    <button 
                        onClick={() => handleSnooze(24 * 60 * 60 * 1000)}
                        className={`text-left text-xs ${textColor} px-2 py-1.5 rounded ${hoverBg} transition flex justify-between items-center`}
                    >
                        <span>Until tomorrow</span>
                    </button>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowSnoozeMenu(false); }}
                    className={`mt-auto text-center text-xs ${mutedText} hover:text-${accentColor.tailwind} py-1`}
                >
                    Cancel
                </button>
            </div>
        ) : (
            <div className="p-4">
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${accentColor.tailwind}`}></div>

                <div className="flex justify-between items-start mb-1 pl-3">
                    <div className="flex items-center gap-2">
                        <div className="text-current opacity-80">
                            {notification.icon || <Bell size={14} />}
                        </div>
                        <span className={`text-xs font-semibold ${textColor} opacity-90`}>{notification.appName || 'System'}</span>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(notification.id); }}
                        className={`p-1 rounded hover:bg-red-500 hover:text-white ${mutedText} transition-opacity opacity-0 group-hover:opacity-100`}
                    >
                        <X size={14} />
                    </button>
                </div>
                
                <div className="pl-3 mt-1">
                    <h4 className={`text-sm font-semibold mb-0.5 ${textColor}`}>{notification.title}</h4>
                    <p className={`text-xs ${mutedText} leading-relaxed line-clamp-2`}>{notification.message}</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default NotificationToast;


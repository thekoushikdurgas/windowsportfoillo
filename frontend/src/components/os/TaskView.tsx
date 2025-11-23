'use client';

import React, { useState } from 'react';
import { WindowState, AppDefinition } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskViewProps {
  isOpen: boolean;
  onClose: () => void;
  windows: WindowState[];
  apps: AppDefinition[];
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
}

interface VirtualDesktop {
  id: string;
  name: string;
  windows: WindowState[];
}

/**
 * Windows 11 Task View Component
 * Virtual desktops and window management
 */
export const TaskView: React.FC<TaskViewProps> = ({
  isOpen,
  onClose,
  windows,
  apps,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
}) => {
  const { isDarkMode, accentColor, transparencyEffect } = useTheme();
  const [desktops, setDesktops] = useState<VirtualDesktop[]>([
    { id: 'desktop-1', name: 'Desktop 1', windows: windows },
  ]);
  const [currentDesktop, setCurrentDesktop] = useState(0);

  const panelBg = isDarkMode 
    ? (transparencyEffect ? 'bg-[#202020]/95 backdrop-blur-xl' : 'bg-[#202020]') 
    : (transparencyEffect ? 'bg-[#f3f3f3]/95 backdrop-blur-xl' : 'bg-[#f3f3f3]');
    
  const hoverBg = isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5';
  const activeBg = isDarkMode ? 'bg-white/10' : 'bg-black/5';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';

  const createNewDesktop = () => {
    const newDesktop: VirtualDesktop = {
      id: `desktop-${desktops.length + 1}`,
      name: `Desktop ${desktops.length + 1}`,
      windows: [],
    };
    setDesktops([...desktops, newDesktop]);
    setCurrentDesktop(desktops.length);
  };

  const switchDesktop = (index: number) => {
    setCurrentDesktop(index);
  };

  const closeDesktop = (index: number) => {
    if (desktops.length > 1) {
      const newDesktops = desktops.filter((_, i) => i !== index);
      setDesktops(newDesktops);
      if (currentDesktop >= newDesktops.length) {
        setCurrentDesktop(newDesktops.length - 1);
      }
    }
  };

  if (!isOpen) return null;

  const currentDesktopWindows = desktops[currentDesktop]?.windows || windows;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[4000]',
        panelBg,
        'win11-transition'
      )}
      style={{
        animation: isOpen ? 'win11-menu-slide-up 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="h-full flex flex-col p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={cn('text-2xl font-semibold', textColor)}>Task View</h1>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition',
              hoverBg,
              textColor
            )}
          >
            <X size={24} />
          </button>
        </div>

        {/* Virtual Desktops */}
        <div className="flex-1 flex gap-4 mb-6">
          {desktops.map((desktop, index) => (
            <div
              key={desktop.id}
              className={cn(
                'flex-1 rounded-lg border p-4 transition',
                borderColor,
                index === currentDesktop ? activeBg : hoverBg,
                'cursor-pointer'
              )}
              onClick={() => switchDesktop(index)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn('font-semibold', textColor)}>{desktop.name}</h3>
                {desktops.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeDesktop(index);
                    }}
                    className={cn('p-1 rounded', hoverBg, textColor)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {desktop.windows.slice(0, 8).map((win) => {
                  const app = apps.find(a => a.id === win.appId);
                  return (
                    <div
                      key={win.id}
                      className={cn(
                        'aspect-video rounded border p-2',
                        borderColor,
                        isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-100',
                        'flex flex-col items-center justify-center gap-1',
                        'cursor-pointer transition hover:scale-105'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFocusWindow(win.id);
                        onClose();
                      }}
                    >
                      {app && React.cloneElement(app.icon as React.ReactElement<any>, { size: 24 })}
                      <span className={cn('text-xs text-center truncate w-full', textColor)}>
                        {win.title}
                      </span>
                    </div>
                  );
                })}
                {desktop.windows.length === 0 && (
                  <div className={cn('col-span-4 text-center py-8', mutedText)}>
                    No windows
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={createNewDesktop}
            className={cn(
              'w-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition',
              borderColor,
              hoverBg,
              textColor
            )}
          >
            <Plus size={24} />
            <span className="text-sm">New desktop</span>
          </button>
        </div>

        {/* All Windows */}
        <div className="border-t pt-6" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
          <h2 className={cn('text-lg font-semibold mb-4', textColor)}>All Windows</h2>
          <div className="grid grid-cols-6 gap-4">
            {windows.map((win) => {
              const app = apps.find(a => a.id === win.appId);
              return (
                <div
                  key={win.id}
                  className={cn(
                    'aspect-video rounded-lg border p-3',
                    borderColor,
                    isDarkMode ? 'bg-[#2d2d2d]' : 'bg-gray-100',
                    'flex flex-col items-center justify-center gap-2',
                    'cursor-pointer transition hover:scale-105 relative group'
                  )}
                  onClick={() => {
                    onFocusWindow(win.id);
                    onClose();
                  }}
                >
                  {app && React.cloneElement(app.icon as React.ReactElement<any>, { size: 32 })}
                  <span className={cn('text-xs text-center truncate w-full', textColor)}>
                    {win.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseWindow(win.id);
                    }}
                    className={cn(
                      'absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 transition',
                      'bg-red-500 hover:bg-red-600 text-white'
                    )}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;


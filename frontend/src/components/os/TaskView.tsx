'use client';

import React, { useState } from 'react';
import { WindowState, AppDefinition } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils/cn';
import { X, Plus } from 'lucide-react';

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
}) => {
  const { isDarkMode, transparencyEffect } = useTheme();
  const [desktops, setDesktops] = useState<VirtualDesktop[]>([
    { id: 'desktop-1', name: 'Desktop 1', windows: windows },
  ]);
  const [currentDesktop, setCurrentDesktop] = useState(0);


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

  return (
    <div
      className={cn('task-view-overlay', 'win11-transition')}
      data-transparency={transparencyEffect}
      data-theme={isDarkMode ? 'dark' : 'light'}
      style={{
        animation: isOpen ? 'win11-menu-slide-up 200ms cubic-bezier(0.1, 0.9, 0.2, 1)' : undefined,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="task-view-content">
        {/* Header */}
        <div className="task-view-header">
          <h1 className="task-view-title">Task View</h1>
          <button
            onClick={onClose}
            className="task-view-close-button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Virtual Desktops */}
        <div className="task-view-desktops">
          {desktops.map((desktop, index) => (
            <div
              key={desktop.id}
              className={cn('task-view-desktop-card', index === currentDesktop && 'task-view-desktop-card-active')}
              data-theme={isDarkMode ? 'dark' : 'light'}
              onClick={() => switchDesktop(index)}
            >
              <div className="task-view-desktop-header">
                <h3 className="task-view-desktop-name">{desktop.name}</h3>
                {desktops.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeDesktop(index);
                    }}
                    className="task-view-desktop-close"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="task-view-desktop-windows">
                {desktop.windows.slice(0, 8).map((win) => {
                  const app = apps.find(a => a.id === win.appId);
                  return (
                    <div
                      key={win.id}
                      className="task-view-window-thumbnail"
                      data-theme={isDarkMode ? 'dark' : 'light'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFocusWindow(win.id);
                        onClose();
                      }}
                    >
                      {app && React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 24 })}
                      <span className="task-view-window-thumbnail-title">
                        {win.title}
                      </span>
                    </div>
                  );
                })}
                {desktop.windows.length === 0 && (
                  <div className="task-view-window-thumbnail-title" style={{ gridColumn: 'span 4', textAlign: 'center', padding: '32px 0', color: 'var(--win11-text-secondary)' }}>
                    No windows
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={createNewDesktop}
            className="task-view-new-desktop"
            data-theme={isDarkMode ? 'dark' : 'light'}
          >
            <Plus size={24} />
            <span className="text-sm">New desktop</span>
          </button>
        </div>

        {/* All Windows */}
        <div className="task-view-all-windows" data-theme={isDarkMode ? 'dark' : 'light'}>
          <h2 className="task-view-all-windows-title">All Windows</h2>
          <div className="task-view-all-windows-grid">
            {windows.map((win) => {
              const app = apps.find(a => a.id === win.appId);
              return (
                <div
                  key={win.id}
                  className="task-view-window-card"
                  data-theme={isDarkMode ? 'dark' : 'light'}
                  onClick={() => {
                    onFocusWindow(win.id);
                    onClose();
                  }}
                >
                  {app && React.cloneElement(app.icon as React.ReactElement<{ size?: number }>, { size: 32 })}
                  <span className="task-view-window-card-title">
                    {win.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseWindow(win.id);
                    }}
                    className="task-view-window-card-close"
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


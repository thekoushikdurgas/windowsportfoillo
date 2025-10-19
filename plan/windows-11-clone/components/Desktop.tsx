import React from 'react';
import type { WindowState } from '../types';
import WindowComponent from './Window';
import { APPS } from '../constants';

interface DesktopProps {
  windows: WindowState[];
  focusedWindowId: string | null;
  onCloseWindow: (id: string) => void;
  onDestroyWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onDragWindow: (id: string, newPosition: { x: number; y: number }) => void;
  onResizeWindow: (id: string, newSize: { width: number; height: number }, newPosition: { x: number; y: number }) => void;
  onOpenApp: (appId: string) => void;
  desktopRef: React.RefObject<HTMLDivElement>;
}

const Desktop: React.FC<DesktopProps> = ({
  windows, focusedWindowId, onCloseWindow, onDestroyWindow, onMinimizeWindow, onMaximizeWindow, onFocusWindow, onDragWindow, onResizeWindow, onOpenApp, desktopRef
}) => {
  const desktopSize = {
    width: desktopRef.current?.clientWidth ?? window.innerWidth,
    height: desktopRef.current?.clientHeight ? desktopRef.current.clientHeight - 48 : window.innerHeight - 48, // Subtract taskbar height
  };

  return (
    <div ref={desktopRef} className="h-full w-full relative">
       {/* Desktop Icons */}
       <div className="p-2 md:p-4">
        <div className="flex flex-row flex-wrap gap-2">
            {APPS.map(app => (
                <div 
                    key={app.id} 
                    className="flex flex-col items-center w-24 p-2 rounded cursor-pointer hover:bg-white hover:bg-opacity-20"
                    onDoubleClick={() => onOpenApp(app.id)}
                >
                    <div className="text-white text-5xl">
                        {/* FIX: Removed redundant type cast. The 'icon' prop is now correctly typed as React.ReactElement. */}
                        {React.cloneElement(app.icon, { className: 'w-10 h-10' })}
                    </div>
                    <p className="text-white text-xs mt-1 text-center break-words shadow-lg">{app.title}</p>
                </div>
            ))}
        </div>
      </div>

      {windows.map(win => (
        <WindowComponent
          key={win.id}
          windowState={win}
          onClose={onCloseWindow}
          onDestroy={onDestroyWindow}
          onMinimize={onMinimizeWindow}
          onMaximize={onMaximizeWindow}
          onFocus={onFocusWindow}
          onDrag={onDragWindow}
          onResize={onResizeWindow}
          isFocused={win.id === focusedWindowId}
          desktopSize={desktopSize}
        />
      ))}
    </div>
  );
};

export default Desktop;
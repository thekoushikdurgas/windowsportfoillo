import React from 'react';
import type { WindowState } from '../types';
import { CloseIcon } from './icons';
import { useWindowSize } from '../hooks/useWindowSize';

interface TaskbarThumbnailProps {
  window: WindowState;
  onClose: (id: string) => void;
}

const TaskbarThumbnail: React.FC<TaskbarThumbnailProps> = ({ window, onClose }) => {
  const { width: screenWidth } = useWindowSize();
  const isMobile = screenWidth < 768; // Tailwind's md breakpoint

  if (isMobile) {
    return null;
  }
  
  return (
    <div
      className="absolute bottom-full left-1/2 mb-2 w-52 bg-gray-800 bg-opacity-80 backdrop-blur-lg border border-gray-500 rounded-md text-white p-1 animate-fade-in-up"
    >
      <div className="p-1">
        <div className="flex justify-between items-center text-xs mb-1">
          <div className="flex items-center gap-1.5 truncate">
            {/* Use the taskbarIcon from the window state, with a fallback to the regular icon */}
            {React.cloneElement(window.taskbarIcon || window.icon, { className: 'w-4 h-4' })}
            <span className="truncate">{window.title}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(window.id);
            }}
            className="p-1 rounded hover:bg-red-500 transition-colors"
            aria-label={`Close ${window.title}`}
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
        <div className="w-full h-28 bg-gray-900 bg-opacity-50 rounded-sm flex items-center justify-center overflow-hidden">
          {/* This is a placeholder for the content preview */}
          <div className="opacity-60 flex items-center justify-center w-full h-full">
            {/* Use the taskbarIcon from the window state, with a fallback to the regular icon */}
            {React.cloneElement(window.taskbarIcon || window.icon, { className: 'w-12 h-12' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskbarThumbnail;

'use client';

import React from 'react';

interface ControlPanelProps {
  isConnected: boolean;
  isConnecting: boolean;
  status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'connecting' | 'error';
  onStart: () => void;
  onStop: () => void;
  onSettings: () => void;
  className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isConnected,
  isConnecting,
  status,
  onStart,
  onStop,
  onSettings,
  className = ''
}) => {
  const getButtonStyles = (variant: 'primary' | 'secondary' | 'danger') => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl`;
      case 'secondary':
        return `${baseStyles} bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-gray-500`;
      case 'danger':
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl`;
      default:
        return baseStyles;
    }
  };

  const getStatusIndicator = () => {
    const indicators = {
      'idle': { color: 'bg-gray-400', text: 'Ready' },
      'listening': { color: 'bg-blue-500 animate-pulse', text: 'Listening' },
      'thinking': { color: 'bg-yellow-500 animate-pulse', text: 'Thinking' },
      'speaking': { color: 'bg-purple-500 animate-pulse', text: 'Speaking' },
      'connecting': { color: 'bg-blue-400 animate-pulse', text: 'Connecting' },
      'error': { color: 'bg-red-500', text: 'Error' }
    };

    const indicator = indicators[status] || indicators.idle;

    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${indicator.color}`}></div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {indicator.text}
        </span>
      </div>
    );
  };

  const isDisabled = isConnecting || status === 'connecting';

  return (
    <div className={`flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${className}`}>
      {/* Status Indicator */}
      <div className="flex items-center space-x-4">
        {getStatusIndicator()}
        
        {isConnected && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Model: Gemini Live
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-3">
        {!isConnected ? (
          <button
            onClick={onStart}
            disabled={isDisabled}
            className={getButtonStyles('primary')}
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🎤</span>
                <span>Start Conversation</span>
              </div>
            )}
          </button>
        ) : (
          <button
            onClick={onStop}
            disabled={isDisabled}
            className={getButtonStyles('danger')}
          >
            <div className="flex items-center space-x-2">
              <span>⏹️</span>
              <span>Stop</span>
            </div>
          </button>
        )}

        <button
          onClick={onSettings}
          disabled={isDisabled}
          className={getButtonStyles('secondary')}
        >
          <div className="flex items-center space-x-2">
            <span>⚙️</span>
            <span>Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

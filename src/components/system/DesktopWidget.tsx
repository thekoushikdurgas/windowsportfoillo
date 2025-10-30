'use client';

import React, { memo, useCallback, useState, useEffect } from 'react';
import { X, Minimize2, Settings, Grip } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DesktopWidget as DesktopWidgetType } from '@/hooks/use-desktop-widgets';
import { logger } from '@/lib/logger';

interface DesktopWidgetProps {
  widget: DesktopWidgetType;
  onUpdate: (widgetId: string, updates: Partial<DesktopWidgetType>) => void;
  onRemove: (widgetId: string) => void;
  onFocus: (widgetId: string) => void;
  onStartDrag: (widgetId: string, startPos: { x: number; y: number }) => void;
  onDrag: (currentPos: { x: number; y: number }) => void;
  onStopDrag: () => void;
  zIndex: number;
}

const DesktopWidgetComponent = ({
  widget,
  onUpdate,
  onRemove,
  onFocus,
  onStartDrag,
  onDrag,
  onStopDrag,
  zIndex,
}: DesktopWidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.widget-handle')) {
      onFocus(widget.id);
      setDragStartPos({ x: e.clientX, y: e.clientY });
      onStartDrag(widget.id, { x: e.clientX, y: e.clientY });
      setIsDragging(true);
    }
  }, [widget.id, onFocus, onStartDrag]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragStartPos) {
      onDrag({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStartPos, onDrag]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartPos(null);
      onStopDrag();
    }
  }, [isDragging, onStopDrag]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMinimize = useCallback(() => {
    onUpdate(widget.id, { isMinimized: !widget.isMinimized });
  }, [widget.id, widget.isMinimized, onUpdate]);

  const handleRemove = useCallback(() => {
    onRemove(widget.id);
  }, [widget.id, onRemove]);

  const handleSettings = useCallback(() => {
    // This would open a settings modal for the widget
    logger.debug('Open widget settings', { widgetId: widget.id });
  }, [widget.id]);

  const renderWidgetContent = (): JSX.Element => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget settings={widget.settings} />;
      case 'weather':
        return <WeatherWidget settings={widget.settings} />;
      case 'system-info':
        return <SystemInfoWidget settings={widget.settings} />;
      case 'notes':
        return <NotesWidget settings={widget.settings} />;
      case 'calendar':
        return <CalendarWidget settings={widget.settings} />;
      default:
        return <div className="p-4 text-white/70">Unknown widget type</div>;
    }
  };

  if (widget.isMinimized) {
    return (
      <div
        className="absolute bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg cursor-pointer"
        // eslint-disable-next-line react/forbid-dom-props
        style={{
          left: widget.position.x,
          top: widget.position.y,
          width: 60,
          height: 30,
          zIndex,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-center h-full text-white text-xs">
          {widget.title}
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg"
      // eslint-disable-next-line react/forbid-dom-props
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
        zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Widget Header */}
      <div className="widget-handle flex items-center justify-between p-2 border-b border-white/20 cursor-move">
        <div className="flex items-center gap-2">
          <Grip className="w-3 h-3 text-white/50" />
          <span className="text-white text-sm font-medium">{widget.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSettings}
            className="p-1 text-white/50 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={handleMinimize}
            className="p-1 text-white/50 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleRemove}
            className="p-1 text-white/50 hover:text-red-400 transition-colors"
            title="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex-1 overflow-hidden">
        {renderWidgetContent()}
      </div>
    </div>
  );
};

// Widget Components
const ClockWidget = ({ settings }: { settings: Record<string, unknown> }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const format = settings['format'] === '24h' ? '24h' : '12h';
  const showSeconds = settings['showSeconds'] === true;

  return (
    <div className="p-4 text-center">
      <div className="text-white text-2xl font-mono">
        {time.toLocaleTimeString('en-US', {
          hour12: format === '12h',
          hour: '2-digit',
          minute: '2-digit',
          second: showSeconds ? '2-digit' : undefined,
        })}
      </div>
      <div className="text-white/70 text-sm mt-1">
        {time.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </div>
  );
};

const WeatherWidget = ({ settings: _settings }: { settings: Record<string, unknown> }) => {
  // Settings parameter is intentionally unused for this widget
  void _settings;
  // Mock weather data
  const weather = {
    temperature: 72,
    condition: 'Sunny',
    location: 'San Francisco',
  };

  return (
    <div className="p-4 text-center">
      <div className="text-white text-3xl font-bold">{weather.temperature}°F</div>
      <div className="text-white/70 text-sm">{weather.condition}</div>
      <div className="text-white/50 text-xs mt-1">{weather.location}</div>
    </div>
  );
};

const SystemInfoWidget = ({ settings: _settings }: { settings: Record<string, unknown> }) => {
  // Settings parameter is intentionally unused for this widget
  void _settings;
  const [systemInfo, setSystemInfo] = useState({
    cpu: 45,
    memory: 62,
    storage: 78,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemInfo({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        storage: Math.floor(Math.random() * 100),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-2">
      <div className="text-white text-sm font-medium mb-2">System Info</div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/70">
          <span>CPU</span>
          <span>{systemInfo.cpu}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
            // eslint-disable-next-line react/forbid-dom-props
            style={{ width: `${systemInfo.cpu}%` }}
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/70">
          <span>Memory</span>
          <span>{systemInfo.memory}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-300"
            // eslint-disable-next-line react/forbid-dom-props
            style={{ width: `${systemInfo.memory}%` }}
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-white/70">
          <span>Storage</span>
          <span>{systemInfo.storage}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
            // eslint-disable-next-line react/forbid-dom-props
            style={{ width: `${systemInfo.storage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const NotesWidget = ({ settings: _settings }: { settings: Record<string, unknown> }) => {
  // Settings parameter is intentionally unused for this widget
  void _settings;
  const [note, setNote] = useState('');

  return (
    <div className="p-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Take a note..."
        className="w-full h-full bg-transparent text-white placeholder-white/50 resize-none outline-none text-sm"
      />
    </div>
  );
};

const CalendarWidget = ({ settings: _settings }: { settings: Record<string, unknown> }) => {
  // Settings parameter is intentionally unused for this widget
  void _settings;
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="p-4">
      <div className="text-white text-sm font-medium mb-2">
        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-white/50 text-center p-1">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} className="p-1" />
        ))}
        {days.map(day => (
          <div
            key={day}
            className={cn(
              "text-white text-center p-1 rounded",
              day === today.getDate() && "bg-blue-500 text-white"
            )}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DesktopWidget = memo(DesktopWidgetComponent);

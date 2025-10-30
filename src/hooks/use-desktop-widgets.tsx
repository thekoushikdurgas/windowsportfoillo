'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface DesktopWidget {
  id: string;
  type: 'clock' | 'weather' | 'system-info' | 'notes' | 'calendar';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings: Record<string, unknown>;
  isVisible: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface DesktopWidgetsState {
  widgets: DesktopWidget[];
  nextZIndex: number;
  isDragging: boolean;
  dragWidgetId: string | null;
}

const defaultWidgets: Omit<DesktopWidget, 'id' | 'position' | 'zIndex'>[] = [
  {
    type: 'clock',
    title: 'Clock',
    size: { width: 200, height: 100 },
    settings: { format: '12h', showSeconds: true },
    isVisible: true,
    isMinimized: false,
  },
  {
    type: 'system-info',
    title: 'System Info',
    size: { width: 250, height: 150 },
    settings: { showCPU: true, showMemory: true, showStorage: true },
    isVisible: true,
    isMinimized: false,
  },
];

export function useDesktopWidgets() {
  const [state, setState] = useState<DesktopWidgetsState>({
    widgets: [],
    nextZIndex: 1000,
    isDragging: false,
    dragWidgetId: null,
  });

  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize default widgets
  useEffect(() => {
    if (state.widgets.length === 0) {
      const initialWidgets: DesktopWidget[] = defaultWidgets.map((widget, index) => ({
        ...widget,
        id: `widget-${widget.type}-${Date.now()}-${index}`,
        position: { x: 50 + index * 20, y: 50 + index * 20 },
        zIndex: state.nextZIndex + index,
      }));

      setState(prev => ({
        ...prev,
        widgets: initialWidgets,
        nextZIndex: prev.nextZIndex + initialWidgets.length,
      }));
    }
  }, [state.widgets.length, state.nextZIndex]);

  // Add widget
  const addWidget = useCallback((type: DesktopWidget['type'], settings?: Record<string, unknown>) => {
    const newWidget: DesktopWidget = {
      id: `widget-${type}-${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      settings: settings || {},
      isVisible: true,
      isMinimized: false,
      zIndex: state.nextZIndex,
    };

    setState(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
      nextZIndex: prev.nextZIndex + 1,
    }));

    return newWidget;
  }, [state.nextZIndex]);

  // Remove widget
  const removeWidget = useCallback((widgetId: string) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId),
    }));
  }, []);

  // Update widget
  const updateWidget = useCallback((widgetId: string, updates: Partial<DesktopWidget>) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      ),
    }));
  }, []);

  // Move widget
  const moveWidget = useCallback((widgetId: string, position: { x: number; y: number }) => {
    updateWidget(widgetId, { position });
  }, [updateWidget]);

  // Resize widget
  const resizeWidget = useCallback((widgetId: string, size: { width: number; height: number }) => {
    updateWidget(widgetId, { size });
  }, [updateWidget]);

  // Toggle widget visibility
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, isVisible: !widget.isVisible }
          : widget
      ),
    }));
  }, []);

  // Toggle widget minimized state
  const toggleWidgetMinimized = useCallback((widgetId: string) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, isMinimized: !widget.isMinimized }
          : widget
      ),
    }));
  }, []);

  // Focus widget (bring to front)
  const focusWidget = useCallback((widgetId: string) => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, zIndex: prev.nextZIndex }
          : widget
      ),
      nextZIndex: prev.nextZIndex + 1,
    }));
  }, []);

  // Start dragging
  const startDrag = useCallback((widgetId: string, startPos: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      dragWidgetId: widgetId,
    }));
    dragStartPosRef.current = startPos;
  }, []);

  // Handle drag
  const handleDrag = useCallback((currentPos: { x: number; y: number }) => {
    if (!state.isDragging || !state.dragWidgetId || !dragStartPosRef.current) return;

    const deltaX = currentPos.x - dragStartPosRef.current.x;
    const deltaY = currentPos.y - dragStartPosRef.current.y;

    const widget = state.widgets.find(w => w.id === state.dragWidgetId);
    if (widget) {
      const newPosition = {
        x: Math.max(0, widget.position.x + deltaX),
        y: Math.max(0, widget.position.y + deltaY),
      };
      moveWidget(state.dragWidgetId, newPosition);
      dragStartPosRef.current = currentPos;
    }
  }, [state.isDragging, state.dragWidgetId, state.widgets, moveWidget]);

  // Stop dragging
  const stopDrag = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false,
      dragWidgetId: null,
    }));
    dragStartPosRef.current = null;
  }, []);

  // Get widget by ID
  const getWidget = useCallback((widgetId: string) => {
    return state.widgets.find(w => w.id === widgetId);
  }, [state.widgets]);

  // Get widgets by type
  const getWidgetsByType = useCallback((type: DesktopWidget['type']) => {
    return state.widgets.filter(w => w.type === type);
  }, [state.widgets]);

  // Get visible widgets
  const getVisibleWidgets = useCallback(() => {
    return state.widgets.filter(w => w.isVisible && !w.isMinimized);
  }, [state.widgets]);

  // Update widget settings
  const updateWidgetSettings = useCallback((widgetId: string, settings: Record<string, unknown>) => {
    updateWidget(widgetId, { settings });
  }, [updateWidget]);

  // Duplicate widget
  const duplicateWidget = useCallback((widgetId: string) => {
    const widget = getWidget(widgetId);
    if (!widget) return;

    const newWidget: DesktopWidget = {
      ...widget,
      id: `widget-${widget.type}-${Date.now()}`,
      position: { x: widget.position.x + 20, y: widget.position.y + 20 },
      zIndex: state.nextZIndex,
    };

    setState(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
      nextZIndex: prev.nextZIndex + 1,
    }));

    return newWidget;
  }, [getWidget, state.nextZIndex]);

  // Reset widget positions
  const resetWidgetPositions = useCallback(() => {
    setState(prev => ({
      ...prev,
      widgets: prev.widgets.map((widget, index) => ({
        ...widget,
        position: { x: 50 + index * 20, y: 50 + index * 20 },
      })),
    }));
  }, []);

  return {
    // State
    widgets: state.widgets,
    isDragging: state.isDragging,
    dragWidgetId: state.dragWidgetId,
    
    // Actions
    addWidget,
    removeWidget,
    updateWidget,
    moveWidget,
    resizeWidget,
    toggleWidgetVisibility,
    toggleWidgetMinimized,
    focusWidget,
    startDrag,
    handleDrag,
    stopDrag,
    updateWidgetSettings,
    duplicateWidget,
    resetWidgetPositions,
    
    // Getters
    getWidget,
    getWidgetsByType,
    getVisibleWidgets,
  };
}

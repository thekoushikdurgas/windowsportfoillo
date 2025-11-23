'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SNAP_LAYOUTS, WINDOW_CONFIG, BORDER_RADIUS } from '@/lib/windows11';
import { useTheme } from '@/context/ThemeContext';

export interface SnapZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  layout: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

interface SnapLayoutsProps {
  windowId: string;
  windowPosition: { x: number; y: number };
  windowSize: { width: number; height: number };
  onSnap: (zone: SnapZone) => void;
  onUnsnap: () => void;
  isDragging: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Windows 11 Snap Layouts Component
 * Displays snap zones and handles window snapping
 */
export const SnapLayouts: React.FC<SnapLayoutsProps> = ({
  windowId,
  windowPosition,
  windowSize,
  onSnap,
  isDragging,
  viewportWidth,
  viewportHeight,
}) => {
  const { accentColor } = useTheme();
  const [activeZone, setActiveZone] = useState<SnapZone | null>(null);
  const [showZones, setShowZones] = useState(false);

  const createZone = useCallback((
    layout: SnapZone['layout'],
    x: number,
    y: number,
    width: number,
    height: number
  ): SnapZone => ({
    id: `${layout}-${windowId}`,
    x: x * viewportWidth,
    y: y * viewportHeight,
    width: width * viewportWidth,
    height: height * viewportHeight,
    layout,
  }), [windowId, viewportWidth, viewportHeight]);

  const detectSnapZone = useCallback((centerX: number, centerY: number) => {
    const threshold = WINDOW_CONFIG.snapThreshold;
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;

    let detectedZone: SnapZone | null = null;

    // Left side
    if (centerX < viewportWidth * 0.25) {
      if (centerY < viewportHeight * 0.33) {
        detectedZone = createZone('top-left', 0, 0, 0.5, 0.5);
      } else if (centerY > viewportHeight * 0.67) {
        detectedZone = createZone('bottom-left', 0, 0.5, 0.5, 0.5);
      } else {
        detectedZone = createZone('left', 0, 0, 0.5, 1);
      }
    }
    // Right side
    else if (centerX > viewportWidth * 0.75) {
      if (centerY < viewportHeight * 0.33) {
        detectedZone = createZone('top-right', 0.5, 0, 0.5, 0.5);
      } else if (centerY > viewportHeight * 0.67) {
        detectedZone = createZone('bottom-right', 0.5, 0.5, 0.5, 0.5);
      } else {
        detectedZone = createZone('right', 0.5, 0, 0.5, 1);
      }
    }
    // Top
    else if (centerY < viewportHeight * 0.25) {
      detectedZone = createZone('top', 0, 0, 1, 0.5);
    }
    // Bottom
    else if (centerY > viewportHeight * 0.75) {
      detectedZone = createZone('bottom', 0, 0.5, 1, 0.5);
    }
    // Center (for 4-panel layout)
    else if (
      Math.abs(centerX - viewportCenterX) < threshold &&
      Math.abs(centerY - viewportCenterY) < threshold
    ) {
      // Could show 4-panel layout option
    }

    setActiveZone(detectedZone);
  }, [viewportWidth, viewportHeight, createZone]);

  // Detect when window is near edges for snap zones
  useEffect(() => {
    if (!isDragging) {
      setShowZones(false);
      setActiveZone(null);
      return;
    }

    const threshold = WINDOW_CONFIG.snapThreshold;
    const centerX = windowPosition.x + windowSize.width / 2;
    const centerY = windowPosition.y + windowSize.height / 2;

    // Check proximity to edges
    const nearLeft = windowPosition.x < threshold;
    const nearRight = windowPosition.x + windowSize.width > viewportWidth - threshold;
    const nearTop = windowPosition.y < threshold;
    const nearBottom = windowPosition.y + windowSize.height > viewportHeight - threshold;

    if (nearLeft || nearRight || nearTop || nearBottom) {
      setShowZones(true);
      detectSnapZone(centerX, centerY);
    } else {
      setShowZones(false);
      setActiveZone(null);
    }
  }, [isDragging, windowPosition, windowSize, viewportWidth, viewportHeight, detectSnapZone]);

  // Auto-snap when zone is detected and dragging stops
  useEffect(() => {
    if (activeZone && !isDragging) {
      onSnap(activeZone);
      setShowZones(false);
      setActiveZone(null);
    }
  }, [activeZone, isDragging, onSnap]);

  if (!showZones || !activeZone) return null;

  const zoneStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${activeZone.x}px`,
    top: `${activeZone.y}px`,
    width: `${activeZone.width}px`,
    height: `${activeZone.height}px`,
    backgroundColor: `${accentColor.hex}20`,
    border: `2px solid ${accentColor.hex}`,
    borderRadius: BORDER_RADIUS.sm,
    pointerEvents: 'none',
    zIndex: 9999,
    animation: 'win11-snap-indicator 1s ease-in-out infinite',
  };

  return (
    <div
      className="snap-layouts-zone"
      style={zoneStyle}
    />
  );
};

/**
 * Snap Layout Preview Component
 * Shows available snap layouts when hovering over window title bar
 */
export const SnapLayoutPreview: React.FC<{
  onSelectLayout: (layout: keyof typeof SNAP_LAYOUTS) => void;
  isVisible: boolean;
}> = ({ onSelectLayout, isVisible }) => {
  const { isDarkMode, accentColor } = useTheme();

  if (!isVisible) return null;

  const layouts = [
    { key: 'splitVertical' as const, label: 'Split Vertical', icon: '⬌' },
    { key: 'splitHorizontal' as const, label: 'Split Horizontal', icon: '⬍' },
    { key: 'quad' as const, label: 'Quad', icon: '⬒' },
  ];

  return (
    <div
      className="snap-layouts-preview"
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      {layouts.map((layout) => (
        <button
          key={layout.key}
          onClick={() => onSelectLayout(layout.key)}
          className="snap-layouts-preview-button"
          style={{
            border: `1px solid ${accentColor.hex}40`,
          }}
        >
          <span className="snap-layouts-preview-icon">{layout.icon}</span>
          <span className="snap-layouts-preview-label">{layout.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SnapLayouts;


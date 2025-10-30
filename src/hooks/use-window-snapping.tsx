'use client';

import { useCallback, useRef, useState } from 'react';

interface SnapZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  snapPosition: { x: number; y: number };
  snapSize: { width: number; height: number };
}

interface WindowSnappingState {
  isSnapping: boolean;
  snapZone: SnapZone | null;
  previewPosition: { x: number; y: number } | null;
  previewSize: { width: number; height: number } | null;
}

export function useWindowSnapping() {
  const [snappingState, setSnappingState] = useState<WindowSnappingState>({
    isSnapping: false,
    snapZone: null,
    previewPosition: null,
    previewSize: null,
  });

  const snapZones = useRef<SnapZone[]>([]);
  const snapThreshold = 50; // pixels

  const calculateSnapZones = useCallback((viewportWidth: number, viewportHeight: number) => {
    const zones: SnapZone[] = [
      // Left half
      {
        id: 'left',
        x: 0,
        y: 0,
        width: viewportWidth / 2,
        height: viewportHeight,
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: viewportWidth / 2, height: viewportHeight },
      },
      // Right half
      {
        id: 'right',
        x: viewportWidth / 2,
        y: 0,
        width: viewportWidth / 2,
        height: viewportHeight,
        snapPosition: { x: viewportWidth / 2, y: 0 },
        snapSize: { width: viewportWidth / 2, height: viewportHeight },
      },
      // Top half
      {
        id: 'top',
        x: 0,
        y: 0,
        width: viewportWidth,
        height: viewportHeight / 2,
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: viewportWidth, height: viewportHeight / 2 },
      },
      // Bottom half
      {
        id: 'bottom',
        x: 0,
        y: viewportHeight / 2,
        width: viewportWidth,
        height: viewportHeight / 2,
        snapPosition: { x: 0, y: viewportHeight / 2 },
        snapSize: { width: viewportWidth, height: viewportHeight / 2 },
      },
      // Top-left quarter
      {
        id: 'top-left',
        x: 0,
        y: 0,
        width: viewportWidth / 2,
        height: viewportHeight / 2,
        snapPosition: { x: 0, y: 0 },
        snapSize: { width: viewportWidth / 2, height: viewportHeight / 2 },
      },
      // Top-right quarter
      {
        id: 'top-right',
        x: viewportWidth / 2,
        y: 0,
        width: viewportWidth / 2,
        height: viewportHeight / 2,
        snapPosition: { x: viewportWidth / 2, y: 0 },
        snapSize: { width: viewportWidth / 2, height: viewportHeight / 2 },
      },
      // Bottom-left quarter
      {
        id: 'bottom-left',
        x: 0,
        y: viewportHeight / 2,
        width: viewportWidth / 2,
        height: viewportHeight / 2,
        snapPosition: { x: 0, y: viewportHeight / 2 },
        snapSize: { width: viewportWidth / 2, height: viewportHeight / 2 },
      },
      // Bottom-right quarter
      {
        id: 'bottom-right',
        x: viewportWidth / 2,
        y: viewportHeight / 2,
        width: viewportWidth / 2,
        height: viewportHeight / 2,
        snapPosition: { x: viewportWidth / 2, y: viewportHeight / 2 },
        snapSize: { width: viewportWidth / 2, height: viewportHeight / 2 },
      },
    ];

    snapZones.current = zones;
    return zones;
  }, []);

  const checkSnapZone = useCallback((
    windowX: number,
    windowY: number,
    windowWidth: number,
    windowHeight: number,
    viewportWidth: number,
    viewportHeight: number
  ) => {
    if (snapZones.current.length === 0) {
      calculateSnapZones(viewportWidth, viewportHeight);
    }

    const windowCenterX = windowX + windowWidth / 2;
    const windowCenterY = windowY + windowHeight / 2;

    for (const zone of snapZones.current) {
      const zoneCenterX = zone.x + zone.width / 2;
      const zoneCenterY = zone.y + zone.height / 2;

      const distanceX = Math.abs(windowCenterX - zoneCenterX);
      const distanceY = Math.abs(windowCenterY - zoneCenterY);

      if (distanceX < snapThreshold && distanceY < snapThreshold) {
        return zone;
      }
    }

    return null;
  }, [calculateSnapZones, snapThreshold]);

  const handleDragStart = useCallback(() => {
    setSnappingState(prev => ({ ...prev, isSnapping: false, snapZone: null }));
  }, []);

  const handleDrag = useCallback((
    windowX: number,
    windowY: number,
    windowWidth: number,
    windowHeight: number,
    viewportWidth: number,
    viewportHeight: number
  ) => {
    const snapZone = checkSnapZone(windowX, windowY, windowWidth, windowHeight, viewportWidth, viewportHeight);
    
    if (snapZone) {
      setSnappingState({
        isSnapping: true,
        snapZone,
        previewPosition: snapZone.snapPosition,
        previewSize: snapZone.snapSize,
      });
    } else {
      setSnappingState(prev => ({
        ...prev,
        isSnapping: false,
        snapZone: null,
        previewPosition: null,
        previewSize: null,
      }));
    }
  }, [checkSnapZone]);

  const handleDragStop = useCallback(() => {
    const { snapZone, previewPosition, previewSize } = snappingState;
    
    setSnappingState({
      isSnapping: false,
      snapZone: null,
      previewPosition: null,
      previewSize: null,
    });

    if (snapZone && previewPosition && previewSize) {
      return {
        position: previewPosition,
        size: previewSize,
        snapped: true,
        snapZoneId: snapZone.id,
      };
    }

    return null;
  }, [snappingState]);

  const snapWindow = useCallback((
    windowId: string,
    snapZoneId: string,
    viewportWidth: number,
    viewportHeight: number
  ) => {
    if (snapZones.current.length === 0) {
      calculateSnapZones(viewportWidth, viewportHeight);
    }

    const zone = snapZones.current.find(z => z.id === snapZoneId);
    if (!zone) return null;

    return {
      position: zone.snapPosition,
      size: zone.snapSize,
      snapped: true,
      snapZoneId: zone.id,
    };
  }, [calculateSnapZones]);

  return {
    snappingState,
    handleDragStart,
    handleDrag,
    handleDragStop,
    snapWindow,
    calculateSnapZones,
  };
}

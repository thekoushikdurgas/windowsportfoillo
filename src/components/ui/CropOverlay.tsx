'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropOverlayProps {
  isVisible: boolean;
  windowSize: { width: number; height: number };
  initialCrop?: CropRect | null;
  onCropChange: (crop: CropRect | null) => void;
  onConfirm: (crop: CropRect | null) => void;
  onCancel: () => void;
}

interface ResizeHandle {
  id: string;
  position: { x: number; y: number };
  cursor: string;
  resizeFunction: (rect: CropRect, deltaX: number, deltaY: number) => CropRect;
}

const MIN_CROP_SIZE = 50;

export default function CropOverlay({
  isVisible,
  windowSize,
  initialCrop,
  onCropChange,
  onConfirm,
  onCancel,
}: CropOverlayProps) {
  const [cropRect, setCropRect] = useState<CropRect>(() => {
    if (initialCrop) return initialCrop;
    // Default crop rectangle - center of window
    return {
      x: windowSize.width * 0.1,
      y: windowSize.height * 0.1,
      width: windowSize.width * 0.8,
      height: windowSize.height * 0.8,
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const getResizeHandles = useCallback((): ResizeHandle[] => [
    // Corner handles
    {
      id: 'nw',
      position: { x: cropRect.x - 4, y: cropRect.y - 4 },
      cursor: 'nw-resize',
      resizeFunction: (rect, _deltaX, _deltaY) => ({
        x: rect.x + _deltaX,
        y: rect.y + _deltaY,
        width: rect.width - _deltaX,
        height: rect.height - _deltaY,
      }),
    },
    {
      id: 'ne',
      position: { x: cropRect.x + cropRect.width - 4, y: cropRect.y - 4 },
      cursor: 'ne-resize',
      resizeFunction: (rect, _deltaX, _deltaY) => ({
        x: rect.x,
        y: rect.y + _deltaY,
        width: rect.width + _deltaX,
        height: rect.height - _deltaY,
      }),
    },
    {
      id: 'sw',
      position: { x: cropRect.x - 4, y: cropRect.y + cropRect.height - 4 },
      cursor: 'sw-resize',
      resizeFunction: (rect, _deltaX, deltaY) => ({
        x: rect.x + _deltaX,
        y: rect.y,
        width: rect.width - _deltaX,
        height: rect.height + deltaY,
      }),
    },
    {
      id: 'se',
      position: { x: cropRect.x + cropRect.width - 4, y: cropRect.y + cropRect.height - 4 },
      cursor: 'se-resize',
      resizeFunction: (rect, _deltaX, deltaY) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width + _deltaX,
        height: rect.height + deltaY,
      }),
    },
    // Edge handles
    {
      id: 'n',
      position: { x: cropRect.x + cropRect.width / 2 - 4, y: cropRect.y - 4 },
      cursor: 'n-resize',
      resizeFunction: (rect, _deltaX, deltaY) => ({
        x: rect.x,
        y: rect.y + deltaY,
        width: rect.width,
        height: rect.height - deltaY,
      }),
    },
    {
      id: 's',
      position: { x: cropRect.x + cropRect.width / 2 - 4, y: cropRect.y + cropRect.height - 4 },
      cursor: 's-resize',
      resizeFunction: (rect, _deltaX, deltaY) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height + deltaY,
      }),
    },
    {
      id: 'w',
      position: { x: cropRect.x - 4, y: cropRect.y + cropRect.height / 2 - 4 },
      cursor: 'w-resize',
      resizeFunction: (rect, _deltaX, _deltaY) => ({
        x: rect.x + _deltaX,
        y: rect.y,
        width: rect.width - _deltaX,
        height: rect.height,
      }),
    },
    {
      id: 'e',
      position: { x: cropRect.x + cropRect.width - 4, y: cropRect.y + cropRect.height / 2 - 4 },
      cursor: 'e-resize',
      resizeFunction: (rect, _deltaX, _deltaY) => ({
        x: rect.x,
        y: rect.y,
        width: rect.width + _deltaX,
        height: rect.height,
      }),
    },
  ], [cropRect]);

  useEffect(() => {
    if (!isDragging && !isResizing) {
      onCropChange(cropRect);
    }
  }, [cropRect, isDragging, isResizing, onCropChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const newRect = {
          x: Math.max(0, Math.min(windowSize.width - cropRect.width, cropRect.x + deltaX)),
          y: Math.max(0, Math.min(windowSize.height - cropRect.height, cropRect.y + deltaY)),
          width: cropRect.width,
          height: cropRect.height,
        };
        
        setCropRect(newRect);
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing && resizeHandle) {
        const handle = getResizeHandles().find(h => h.id === resizeHandle);
        if (handle) {
          const deltaX = e.clientX - dragStart.x;
          const deltaY = e.clientY - dragStart.y;
          
          const newRect = handle.resizeFunction(cropRect, deltaX, deltaY);
          
          // Constrain to window bounds
          const constrainedRect = {
            x: Math.max(0, Math.min(windowSize.width - newRect.width, newRect.x)),
            y: Math.max(0, Math.min(windowSize.height - newRect.height, newRect.y)),
            width: Math.max(MIN_CROP_SIZE, Math.min(windowSize.width, newRect.width)),
            height: Math.max(MIN_CROP_SIZE, Math.min(windowSize.height, newRect.height)),
          };
          
          setCropRect(constrainedRect);
          setDragStart({ x: e.clientX, y: e.clientY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, cropRect, resizeHandle, windowSize, getResizeHandles]);

  const handleCropAreaMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResizeMouseDown = (handleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handleId);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleConfirm = () => {
    onConfirm(cropRect);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleClear = () => {
    setCropRect({
      x: windowSize.width * 0.1,
      y: windowSize.height * 0.1,
      width: windowSize.width * 0.8,
      height: windowSize.height * 0.8,
    });
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50"
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Crop area */}
        <div
          className="absolute border-2 border-orange-400 bg-transparent cursor-move"
          style={{
            left: cropRect.x,
            top: cropRect.y,
            width: cropRect.width,
            height: cropRect.height,
          }}
          onMouseDown={handleCropAreaMouseDown}
        >
          {/* Crop area content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-orange-400/20 backdrop-blur-sm rounded px-3 py-1">
              <span className="text-orange-400 text-sm font-medium">
                {Math.round(cropRect.width)} × {Math.round(cropRect.height)}
              </span>
            </div>
          </div>

          {/* Resize handles */}
          {getResizeHandles().map((handle) => (
            <div
              key={handle.id}
              className="absolute w-2 h-2 bg-orange-400 border border-white rounded-full cursor-pointer hover:scale-125 transition-transform"
              style={{
                left: handle.position.x,
                top: handle.position.y,
                cursor: handle.cursor,
              }}
              onMouseDown={(e) => handleResizeMouseDown(handle.id, e)}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-black/80 backdrop-blur-md rounded-lg px-4 py-2 border border-gray-600"
          >
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              Reset
            </button>
            <div className="w-px h-4 bg-gray-600" />
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 text-sm bg-orange-500 text-white hover:bg-orange-600 rounded transition-colors font-medium"
            >
              Apply Crop
            </button>
          </motion.div>
        </div>

        {/* Instructions */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 backdrop-blur-md rounded-lg px-4 py-2 border border-gray-600"
          >
            <p className="text-white text-sm">
              Drag to move • Drag handles to resize • Click outside to cancel
            </p>
          </motion.div>
        </div>

        {/* Corner indicators */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-orange-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-orange-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-orange-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-orange-400" />
      </motion.div>
    </AnimatePresence>
  );
}

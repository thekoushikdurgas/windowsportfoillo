import { useCallback, useRef, useEffect } from 'react';

interface DraggableOptions {
  onDrag: (newPosition: { x: number; y: number }) => void;
  bounds: { top: number; left: number; right: number; bottom: number };
  initialPosition: { x: number; y: number };
  windowSize: { width: number; height: number };
  disabled?: boolean;
}

export function useDraggable({ onDrag, bounds, initialPosition, windowSize, disabled = false }: DraggableOptions) {
  const dragStartOffset = useRef({ x: 0, y: 0 });

  const handleDragMove = useCallback((e: MouseEvent) => {
    // Prevent text selection while dragging
    e.preventDefault();
    
    let newX = e.clientX - dragStartOffset.current.x;
    let newY = e.clientY - dragStartOffset.current.y;
    
    // Clamp to bounds. Keep title bar (32px) visible at all times.
    const titleBarHeight = 32;
    newX = Math.max(bounds.left - windowSize.width + 100, Math.min(newX, bounds.right - 100)); // Keep at least 100px of the window visible horizontally
    newY = Math.max(bounds.top, Math.min(newY, bounds.bottom - titleBarHeight));

    onDrag({ x: newX, y: newY });
  }, [onDrag, bounds, windowSize]);

  const handleDragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragMove]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    dragStartOffset.current = {
      x: e.clientX - initialPosition.x,
      y: e.clientY - initialPosition.y,
    };
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  }, [initialPosition, handleDragMove, handleDragEnd, disabled]);
  
  useEffect(() => {
    // Cleanup function to remove event listeners if the component unmounts during a drag
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  return { handleDragStart };
}

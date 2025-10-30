'use client';

import { useState, useCallback, useRef } from 'react';
import { FileSystemItem } from '@/types/filesystem';
import { logger } from '@/lib/logger';

interface DragDropState {
  isDragging: boolean;
  draggedItem: FileSystemItem | null;
  dragOverItem: string | null;
  dropZone: 'file' | 'folder' | null;
}

interface UseDragDropProps {
  onDrop: (draggedItem: FileSystemItem, targetPath: string[]) => void;
  onMove: (draggedItem: FileSystemItem, targetPath: string[]) => void;
  onCopy: (draggedItem: FileSystemItem, targetPath: string[]) => void;
}

export function useDragDrop({ onMove, onCopy }: UseDragDropProps) {
  const [dragState, setDragState] = useState<DragDropState>({
    isDragging: false,
    draggedItem: null,
    dragOverItem: null,
    dropZone: null,
  });

  const dragCounter = useRef(0);

  const handleDragStart = useCallback((e: React.DragEvent, item: FileSystemItem) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      type: 'file-explorer-item',
      item: item,
    }));

    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: item,
    }));

    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOverItem: null,
      dropZone: null,
    });

    // Remove visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string, itemType: 'file' | 'folder') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    setDragState(prev => ({
      ...prev,
      dragOverItem: itemId,
      dropZone: itemType === 'folder' ? 'folder' : 'file',
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drag over state if we're leaving the entire drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragState(prev => ({
        ...prev,
        dragOverItem: null,
        dropZone: null,
      }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetPath: string[]) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.type === 'file-explorer-item' && data.item) {
        const draggedItem = data.item as FileSystemItem;
        
        // Determine operation based on modifier keys
        if (e.ctrlKey || e.metaKey) {
          // Copy operation
          onCopy(draggedItem, targetPath);
        } else {
          // Move operation
          onMove(draggedItem, targetPath);
        }
      }
    } catch (error) {
      logger.error('Error handling drop', { error });
    }

    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOverItem: null,
      dropZone: null,
    });
  }, [onMove, onCopy]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    
    if (dragCounter.current === 1) {
      setDragState(prev => ({
        ...prev,
        isDragging: true,
      }));
    }
  }, []);

  const handleDragLeaveGlobal = useCallback(() => {
    dragCounter.current--;
    
    if (dragCounter.current === 0) {
      setDragState({
        isDragging: false,
        draggedItem: null,
        dragOverItem: null,
        dropZone: null,
      });
    }
  }, []);

  const getDragProps = useCallback((item: FileSystemItem) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, item),
    onDragEnd: handleDragEnd,
  }), [handleDragStart, handleDragEnd]);

  const getDropProps = useCallback((itemId: string, itemType: 'file' | 'folder', targetPath: string[]) => ({
    onDragOver: (e: React.DragEvent) => handleDragOver(e, itemId, itemType),
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => handleDrop(e, targetPath),
  }), [handleDragOver, handleDragLeave, handleDrop]);

  const getContainerProps = useCallback(() => ({
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeaveGlobal,
  }), [handleDragEnter, handleDragLeaveGlobal]);

  return {
    dragState,
    getDragProps,
    getDropProps,
    getContainerProps,
  };
}

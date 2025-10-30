'use client';

import { useState, useCallback } from 'react';
import { logger } from '../lib/logger';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: 'file' | 'folder' | 'desktop' | 'empty';
  item?: {
    id: string;
    name: string;
    type: 'file' | 'folder';
  } | undefined;
}

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    type: 'desktop',
  });

  const showContextMenu = useCallback((
    event: React.MouseEvent,
    type: 'file' | 'folder' | 'desktop' | 'empty',
    item?: { id: string; name: string; type: 'file' | 'folder' }
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenu({
      isOpen: true,
      x: event.clientX,
      y: event.clientY,
      type,
      item: item,
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleContextAction = useCallback((action: string, data?: Record<string, unknown>) => {
    logger.debug('Context menu action:', { action, data });
    
    // This will be handled by the parent component that uses this hook
    // The parent should pass a custom handler for context actions
    return { action, data };
  }, []);

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
    handleContextAction,
  };
}

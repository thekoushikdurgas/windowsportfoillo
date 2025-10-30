'use client';

import { useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { FolderPlus, FileText, Trash2, Edit, Copy, Scissors, Clipboard, Download, Info, Archive, FolderOpen } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string, data?: unknown) => void;
  type: 'file' | 'folder' | 'desktop' | 'empty';
  item?: {
    id: string;
    name: string;
    type: 'file' | 'folder';
  } | undefined;
}

// Constants for better performance
const BASE_ITEMS = [
  { id: 'new-folder', label: 'New Folder', icon: FolderPlus, disabled: false },
];

const FILE_ITEMS = [
  { id: 'open', label: 'Open', icon: FileText, disabled: false },
  { id: 'edit', label: 'Edit', icon: Edit, disabled: false },
  { id: 'rename', label: 'Rename', icon: Edit, disabled: false },
  { id: 'copy', label: 'Copy', icon: Copy, disabled: false },
  { id: 'cut', label: 'Cut', icon: Scissors, disabled: false },
  { id: 'delete', label: 'Delete', icon: Trash2, disabled: false },
  { id: 'download', label: 'Download', icon: Download, disabled: false },
  { id: 'extract', label: 'Extract', icon: FolderOpen, disabled: false },
  { id: 'properties', label: 'Properties', icon: Info, disabled: false },
];

const FOLDER_ITEMS = [
  { id: 'open', label: 'Open', icon: FolderPlus, disabled: false },
  { id: 'new-file', label: 'New File', icon: FileText, disabled: false },
  { id: 'rename', label: 'Rename', icon: Edit, disabled: false },
  { id: 'copy', label: 'Copy', icon: Copy, disabled: false },
  { id: 'cut', label: 'Cut', icon: Scissors, disabled: false },
  { id: 'delete', label: 'Delete', icon: Trash2, disabled: false },
  { id: 'compress', label: 'Compress', icon: Archive, disabled: false },
  { id: 'properties', label: 'Properties', icon: Info, disabled: false },
];

const DESKTOP_ITEMS = [
  { id: 'new-file', label: 'New File', icon: FileText, disabled: false },
  { id: 'paste', label: 'Paste', icon: Clipboard, disabled: false },
  { id: 'compress', label: 'Compress Selected', icon: Archive, disabled: false },
];

const ContextMenu = memo(({ x, y, onClose, onAction, type, item }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClickOutside, handleEscape]);

  const getMenuItems = useCallback(() => {
    if (type === 'file') {
      return [...BASE_ITEMS, ...FILE_ITEMS];
    }

    if (type === 'folder') {
      return [...BASE_ITEMS, ...FOLDER_ITEMS];
    }

    if (type === 'desktop' || type === 'empty') {
      return [...BASE_ITEMS, ...DESKTOP_ITEMS];
    }

    return BASE_ITEMS;
  }, [type]);

  const menuItems = useMemo(() => getMenuItems(), [getMenuItems]);

  const handleAction = useCallback((actionId: string) => {
    onAction(actionId, item);
    onClose();
  }, [onAction, item, onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-[160px]"
      // eslint-disable-next-line react/forbid-dom-props
      style={{
        left: Math.min(x, window.innerWidth - 200),
        top: Math.min(y, window.innerHeight - 300),
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleAction(item.id)}
          disabled={item.disabled}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
});

ContextMenu.displayName = 'ContextMenu';

export { ContextMenu };

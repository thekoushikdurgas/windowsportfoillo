'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
  children?: ContextMenuItem[];
}

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  onItemClick?: (itemId: string) => void;
}

interface ContextMenuState {
  activeSubmenu: string | null;
  submenuPosition: { x: number; y: number };
}

export default function ContextMenu({
  isVisible,
  position,
  items,
  onClose,
  onItemClick,
}: ContextMenuProps) {
  const [state, setState] = useState<ContextMenuState>({
    activeSubmenu: null,
    submenuPosition: { x: 0, y: 0 },
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          (!submenuRef.current || !submenuRef.current.contains(event.target as Node))
        ) {
          onClose();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isVisible, onClose]);

  useEffect(() => {
    // Adjust position if menu goes off-screen
    if (isVisible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (rect.right > viewport.width) {
        adjustedX = viewport.width - rect.width - 10;
      }
      if (rect.bottom > viewport.height) {
        adjustedY = viewport.height - rect.height - 10;
      }

      if (adjustedX !== position.x || adjustedY !== position.y) {
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
      }
    }
  }, [isVisible, position]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.separator) return;

    if (item.children && item.children.length > 0) {
      // Handle submenu
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect) {
        setState({
          activeSubmenu: item.id,
          submenuPosition: {
            x: rect.right + 5,
            y: rect.top,
          },
        });
      }
    } else {
      // Handle regular item
      item.onClick?.();
      onItemClick?.(item.id);
      onClose();
    }
  };


  const handleMouseEnter = (item: ContextMenuItem) => {
    if (item.children && item.children.length > 0) {
      const rect = menuRef.current?.getBoundingClientRect();
      if (rect) {
        setState({
          activeSubmenu: item.id,
          submenuPosition: {
            x: rect.right + 5,
            y: rect.top,
          },
        });
      }
    } else {
      setState(prev => ({ ...prev, activeSubmenu: null }));
    }
  };

  const renderMenuItem = (item: ContextMenuItem, index: number) => {
    if (item.separator) {
      return (
        <div
          key={`separator-${index}`}
          className="my-1 border-t border-gray-200"
        />
      );
    }

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <button
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => handleMouseEnter(item)}
          disabled={item.disabled}
          className={`
            w-full flex items-center justify-between px-3 py-2 text-sm
            hover:bg-blue-50 hover:text-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
            ${item.disabled ? 'text-gray-400' : 'text-gray-700'}
            ${state.activeSubmenu === item.id ? 'bg-blue-50 text-blue-700' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="w-4 h-4 flex-shrink-0">
                {item.icon}
              </span>
            )}
            {item.label && <span>{item.label}</span>}
          </div>
          {item.shortcut && (
            <span className="text-xs text-gray-400 ml-4">
              {item.shortcut}
            </span>
          )}
          {item.children && item.children.length > 0 && (
            <span className="text-xs text-gray-400 ml-2">›</span>
          )}
        </button>
      </motion.div>
    );
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="fixed z-[10000] bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px]"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {items.map((item, index) => renderMenuItem(item, index))}

        {/* Submenu */}
        <AnimatePresence>
          {state.activeSubmenu && (
            <motion.div
              ref={submenuRef}
              initial={{ opacity: 0, scale: 0.95, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed z-[10001] bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[180px]"
              style={{
                left: state.submenuPosition.x,
                top: state.submenuPosition.y,
              }}
            >
              {items
                .find(item => item.id === state.activeSubmenu)
                ?.children?.map((item, index) => renderMenuItem(item, index))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

// Utility function to create common context menu items
export const createContextMenuItems = {
  file: (): ContextMenuItem[] => [
    {
      id: 'new',
      label: 'New',
      icon: '📄',
      onClick: () => {
        // Create new file - could open a new notepad window or file explorer
        // TODO: Implement file creation functionality
      },
    },
    {
      id: 'open',
      label: 'Open',
      icon: '📂',
      shortcut: 'Ctrl+O',
      onClick: () => {
        // Open file dialog
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.click();
      },
    },
    { id: 'separator1', separator: true },
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      shortcut: 'Ctrl+C',
      onClick: () => {
        // Copy selected text to clipboard
        if (window.getSelection) {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            navigator.clipboard.writeText(selectedText);
          }
        }
      },
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📋',
      shortcut: 'Ctrl+V',
      onClick: async () => {
        // Paste from clipboard
        try {
          const text = await navigator.clipboard.readText();
          document.execCommand('insertText', false, text);
        } catch (err) {
          // Failed to paste text - silently fail
        }
      },
    },
    { id: 'separator2', separator: true },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      onClick: () => {
        // Delete selected item
        if (window.getSelection) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            selection.deleteFromDocument();
          }
        }
      },
    },
  ],

  desktop: (): ContextMenuItem[] => [
    {
      id: 'view',
      label: 'View',
      icon: '👁️',
      children: [
        { id: 'large-icons', label: 'Large icons' },
        { id: 'medium-icons', label: 'Medium icons' },
        { id: 'small-icons', label: 'Small icons' },
        { id: 'list', label: 'List' },
        { id: 'details', label: 'Details' },
      ],
    },
    {
      id: 'sort-by',
      label: 'Sort by',
      icon: '🔀',
      children: [
        { id: 'name', label: 'Name' },
        { id: 'date', label: 'Date modified' },
        { id: 'size', label: 'Size' },
        { id: 'type', label: 'Item type' },
      ],
    },
    { id: 'separator1', separator: true },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: '🔄',
      shortcut: 'F5',
      onClick: () => {
        // Refresh desktop/current view
        window.location.reload();
      },
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📋',
      shortcut: 'Ctrl+V',
      onClick: async () => {
        // Paste from clipboard
        try {
          const text = await navigator.clipboard.readText();
          document.execCommand('insertText', false, text);
        } catch (err) {
          // Failed to paste text - silently fail
        }
      },
    },
    { id: 'separator2', separator: true },
    {
      id: 'personalize',
      label: 'Personalize',
      icon: '🎨',
      onClick: () => {
        // Open personalization settings
        // TODO: Implement personalization settings
      },
    },
  ],

  window: (): ContextMenuItem[] => [
    {
      id: 'restore',
      label: 'Restore',
      icon: '⛶',
      onClick: () => {
        // Restore window from minimized state
        // TODO: Implement window restore functionality
      },
    },
    {
      id: 'move',
      label: 'Move',
      icon: '↕️',
      onClick: () => {
        // Enable window move mode
        // TODO: Implement window move mode
      },
    },
    {
      id: 'size',
      label: 'Size',
      icon: '↗️',
      onClick: () => {
        // Enable window resize mode
        // TODO: Implement window resize mode
      },
    },
    {
      id: 'minimize',
      label: 'Minimize',
      icon: '➖',
      shortcut: 'Ctrl+M',
      onClick: () => {
        // Minimize active window
        // TODO: Implement window minimize functionality
      },
    },
    {
      id: 'maximize',
      label: 'Maximize',
      icon: '⬜',
      shortcut: 'F11',
      onClick: () => {
        // Maximize/restore active window
        // TODO: Implement window maximize/restore functionality
      },
    },
    { id: 'separator1', separator: true },
    {
      id: 'close',
      label: 'Close',
      icon: '❌',
      shortcut: 'Alt+F4',
      onClick: () => {
        // Close active window
        // TODO: Implement window close functionality
      },
    },
  ],
};

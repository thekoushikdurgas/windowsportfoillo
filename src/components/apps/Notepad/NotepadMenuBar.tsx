'use client';

import { useState } from 'react';
import { NotepadState, NotepadActions, MenuGroup, MenuAction } from '@/types/notepad';

interface NotepadMenuBarProps {
  state: NotepadState;
  actions: NotepadActions;
}

export function NotepadMenuBar({ state, actions }: NotepadMenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // No-op function for separators
  const noOp = () => {
    // Separator - no action needed
  };

  const handleRecentFileClick = (filename?: string) => {
    if (filename) {
      // TODO: Implement recent file opening
      actions.openDocument();
    }
    setActiveMenu(null);
  };

  const menuGroups: MenuGroup[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        {
          id: 'new',
          label: 'New',
          shortcut: 'Ctrl+N',
          action: actions.newDocument,
        },
        {
          id: 'open',
          label: 'Open...',
          shortcut: 'Ctrl+O',
          action: actions.openDocument,
        },
        {
          id: 'recent',
          label: 'Recent Files',
          shortcut: '',
          action: handleRecentFileClick,
          disabled: state.recentFiles.length === 0,
        },
        { id: 'separator1', label: '', action: noOp, separator: true },
        {
          id: 'save',
          label: 'Save',
          shortcut: 'Ctrl+S',
          action: actions.saveDocument,
          disabled: !state.document.isModified,
        },
        {
          id: 'saveAs',
          label: 'Save As...',
          shortcut: 'Ctrl+Shift+S',
          action: actions.saveAsDocument,
        },
        { id: 'separator2', label: '', action: noOp, separator: true },
        {
          id: 'print',
          label: 'Print...',
          shortcut: 'Ctrl+P',
          action: actions.print,
        },
        { id: 'separator3', label: '', action: noOp, separator: true },
        {
          id: 'exit',
          label: 'Exit',
          shortcut: 'Alt+F4',
          action: actions.closeDocument,
        },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        {
          id: 'undo',
          label: 'Undo',
          shortcut: 'Ctrl+Z',
          action: actions.undo,
          disabled: !actions.canUndo(),
        },
        {
          id: 'redo',
          label: 'Redo',
          shortcut: 'Ctrl+Y',
          action: actions.redo,
          disabled: !actions.canRedo(),
        },
        { id: 'separator1', label: '', action: noOp, separator: true },
        {
          id: 'cut',
          label: 'Cut',
          shortcut: 'Ctrl+X',
          action: actions.cut,
        },
        {
          id: 'copy',
          label: 'Copy',
          shortcut: 'Ctrl+C',
          action: actions.copy,
        },
        {
          id: 'paste',
          label: 'Paste',
          shortcut: 'Ctrl+V',
          action: actions.paste,
        },
        { id: 'separator2', label: '', action: noOp, separator: true },
        {
          id: 'selectAll',
          label: 'Select All',
          shortcut: 'Ctrl+A',
          action: actions.selectAll,
        },
        { id: 'separator3', label: '', action: noOp, separator: true },
        {
          id: 'find',
          label: 'Find...',
          shortcut: 'Ctrl+F',
          action: actions.showFindDialog,
        },
        {
          id: 'replace',
          label: 'Replace...',
          shortcut: 'Ctrl+H',
          action: actions.showReplaceDialog,
        },
        {
          id: 'goToLine',
          label: 'Go to Line...',
          shortcut: 'Ctrl+G',
          action: () => {
            const line = prompt('Go to line:');
            if (line) {
              actions.goToLine(parseInt(line, 10));
            }
          },
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'lineNumbers',
          label: 'Line Numbers',
          shortcut: '',
          action: actions.toggleLineNumbers,
        },
        {
          id: 'wordWrap',
          label: 'Word Wrap',
          shortcut: '',
          action: actions.toggleWordWrap,
        },
        { id: 'separator1', label: '', action: noOp, separator: true },
        {
          id: 'zoomIn',
          label: 'Zoom In',
          shortcut: 'Ctrl++',
          action: () => actions.setZoom(state.settings.zoom + 10),
        },
        {
          id: 'zoomOut',
          label: 'Zoom Out',
          shortcut: 'Ctrl+-',
          action: () => actions.setZoom(state.settings.zoom - 10),
        },
        {
          id: 'resetZoom',
          label: 'Reset Zoom',
          shortcut: 'Ctrl+0',
          action: actions.resetZoom,
        },
        { id: 'separator2', label: '', action: noOp, separator: true },
        {
          id: 'fullscreen',
          label: 'Fullscreen',
          shortcut: 'F11',
          action: actions.toggleFullscreen,
        },
      ],
    },
    {
      id: 'format',
      label: 'Format',
      items: [
        {
          id: 'font',
          label: 'Font...',
          shortcut: '',
          action: () => actions.showSettingsDialog(),
        },
        {
          id: 'wordWrap',
          label: 'Word Wrap',
          shortcut: '',
          action: actions.toggleWordWrap,
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        {
          id: 'about',
          label: 'About Notepad',
          shortcut: '',
          action: actions.showAboutDialog,
        },
        {
          id: 'shortcuts',
          label: 'Keyboard Shortcuts',
          shortcut: '',
          action: () => {
            // TODO: Implement keyboard shortcuts dialog
            alert('Keyboard shortcuts:\n\nCtrl+N - New\nCtrl+O - Open\nCtrl+S - Save\nCtrl+Z - Undo\nCtrl+Y - Redo\nCtrl+F - Find\nCtrl+H - Replace\nCtrl+G - Go to Line\nF11 - Fullscreen');
          },
        },
      ],
    },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const handleItemClick = (item: MenuAction) => {
    if (!item.separator && !item.disabled) {
      item.action();
    }
    setActiveMenu(null);
  };

  return (
    <div className="flex items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" role="menubar">
      {menuGroups.map((group) => (
        <div key={group.id} className="relative">
          <button
            className={`px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              activeMenu === group.id ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            onClick={() => handleMenuClick(group.id)}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={activeMenu === group.id}
            aria-label={`${group.label} menu`}
          >
            {group.label}
          </button>
          
          {activeMenu === group.id && (
            <div 
              className="absolute top-full left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50 min-w-48"
              role="menu"
              aria-label={`${group.label} menu`}
            >
              {group.items.map((item) => (
                <div key={item.id}>
                  {item.separator ? (
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  ) : item.id === 'recent' ? (
                    <div className="px-3 py-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Recent Files
                      </div>
                      {state.recentFiles.length === 0 ? (
                        <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1">
                          No recent files
                        </div>
                      ) : (
                        state.recentFiles.slice(0, 5).map((file) => (
                          <button
                            key={file.filename}
                            className="block w-full text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                            onClick={() => handleRecentFileClick(file.filename)}
                          >
                            {file.filename}
                          </button>
                        ))
                      )}
                    </div>
                  ) : (
                    <button
                      className={`w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                        item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Document title */}
      <div className="flex-1 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {state.document.filename}
          {state.document.isModified && '*'}
        </span>
      </div>
      
      {/* Window controls */}
      <div className="flex items-center space-x-1">
        <button
          className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          onClick={actions.toggleFullscreen}
          title="Toggle Fullscreen"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

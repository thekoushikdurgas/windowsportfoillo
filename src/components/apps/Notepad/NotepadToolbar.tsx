'use client';

import { NotepadState, NotepadActions, ToolbarButton } from '@/types/notepad';

interface NotepadToolbarProps {
  state: NotepadState;
  actions: NotepadActions;
}

export function NotepadToolbar({ state, actions }: NotepadToolbarProps) {
  // No-op function for separators
  const noOp = () => {
    // Separator - no action needed
  };

  const toolbarButtons: ToolbarButton[] = [
    {
      id: 'new',
      label: 'New',
      icon: '📄',
      action: actions.newDocument,
      tooltip: 'New Document (Ctrl+N)',
    },
    {
      id: 'open',
      label: 'Open',
      icon: '📁',
      action: actions.openDocument,
      tooltip: 'Open Document (Ctrl+O)',
    },
    {
      id: 'save',
      label: 'Save',
      icon: '💾',
      action: actions.saveDocument,
      disabled: !state.document.isModified,
      tooltip: 'Save Document (Ctrl+S)',
    },
    {
      id: 'separator1',
      label: '',
      icon: '|',
      action: noOp,
      tooltip: '',
    },
    {
      id: 'undo',
      label: 'Undo',
      icon: '↶',
      action: actions.undo,
      disabled: !actions.canUndo(),
      tooltip: 'Undo (Ctrl+Z)',
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: '↷',
      action: actions.redo,
      disabled: !actions.canRedo(),
      tooltip: 'Redo (Ctrl+Y)',
    },
    {
      id: 'separator2',
      label: '',
      icon: '|',
      action: noOp,
      tooltip: '',
    },
    {
      id: 'cut',
      label: 'Cut',
      icon: '✂️',
      action: actions.cut,
      tooltip: 'Cut (Ctrl+X)',
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      action: actions.copy,
      tooltip: 'Copy (Ctrl+C)',
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📌',
      action: actions.paste,
      tooltip: 'Paste (Ctrl+V)',
    },
    {
      id: 'separator3',
      label: '',
      icon: '|',
      action: noOp,
      tooltip: '',
    },
    {
      id: 'find',
      label: 'Find',
      icon: '🔍',
      action: actions.showFindDialog,
      tooltip: 'Find (Ctrl+F)',
    },
    {
      id: 'replace',
      label: 'Replace',
      icon: '🔄',
      action: actions.showReplaceDialog,
      tooltip: 'Replace (Ctrl+H)',
    },
    {
      id: 'separator4',
      label: '',
      icon: '|',
      action: noOp,
      tooltip: '',
    },
    {
      id: 'print',
      label: 'Print',
      icon: '🖨️',
      action: actions.print,
      tooltip: 'Print (Ctrl+P)',
    },
    {
      id: 'separator5',
      label: '',
      icon: '|',
      action: noOp,
      tooltip: '',
    },
    {
      id: 'lineNumbers',
      label: 'Line Numbers',
      icon: state.settings.showLineNumbers ? '🔢' : '🔢',
      action: actions.toggleLineNumbers,
      tooltip: 'Toggle Line Numbers',
    },
    {
      id: 'wordWrap',
      label: 'Word Wrap',
      icon: state.settings.wordWrap ? '📝' : '📄',
      action: actions.toggleWordWrap,
      tooltip: 'Toggle Word Wrap',
    },
    {
      id: 'separator6',
      label: '',
      icon: '|',
      action: noOp,
      tooltip: '',
    },
    {
      id: 'zoomOut',
      label: 'Zoom Out',
      icon: '🔍-',
      action: () => actions.setZoom(state.settings.zoom - 10),
      disabled: state.settings.zoom <= 50,
      tooltip: 'Zoom Out (Ctrl+-)',
    },
    {
      id: 'zoom',
      label: `${state.settings.zoom}%`,
      icon: '',
      action: actions.resetZoom,
      tooltip: 'Reset Zoom (Ctrl+0)',
    },
    {
      id: 'zoomIn',
      label: 'Zoom In',
      icon: '🔍+',
      action: () => actions.setZoom(state.settings.zoom + 10),
      disabled: state.settings.zoom >= 200,
      tooltip: 'Zoom In (Ctrl++)',
    },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700" role="toolbar" aria-label="Notepad toolbar">
      {toolbarButtons.map((button) => (
        <button
          key={button.id}
          className={`flex items-center gap-1 px-2 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            button.disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${button.id.startsWith('separator') ? 'cursor-default hover:bg-transparent' : ''}`}
          onClick={button.action}
          disabled={button.disabled}
          title={button.tooltip}
          aria-label={button.tooltip || button.label}
          role="button"
        >
          {button.id.startsWith('separator') ? (
            <span className="text-gray-400 dark:text-gray-600">|</span>
          ) : (
            <>
              {button.icon && <span>{button.icon}</span>}
              {button.label && <span>{button.label}</span>}
            </>
          )}
        </button>
      ))}
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Document status */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        {state.document.isModified && (
          <span className="text-orange-500 dark:text-orange-400">●</span>
        )}
        <span>
          {state.statistics.words} words, {state.statistics.characters} characters
        </span>
      </div>
    </div>
  );
}

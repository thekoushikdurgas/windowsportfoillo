'use client';

import { useEffect, useCallback } from 'react';
import { useNotepadState } from '@/hooks/use-notepad-state';
import { NotepadMenuBar } from './Notepad/NotepadMenuBar';
import { NotepadToolbar } from './Notepad/NotepadToolbar';
import { NotepadEditor } from './Notepad/NotepadEditor';
import { NotepadStatusBar } from './Notepad/NotepadStatusBar';
import { NotepadDialogs } from './Notepad/NotepadDialogs';
import { NotepadKeyboardShortcuts } from './Notepad/NotepadKeyboardShortcuts';
import { NotepadProps } from '@/types/notepad';

export default function Notepad({ onContentChange }: NotepadProps) {
  const { state, actions, refs } = useNotepadState(undefined);

  // Handle content changes
  useEffect(() => {
    if (onContentChange) {
      onContentChange(state.document.content);
    }
  }, [state.document.content, onContentChange]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Handle common shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'n':
          event.preventDefault();
          actions.newDocument();
          break;
        case 'o':
          event.preventDefault();
          actions.openDocument();
          break;
        case 's':
          event.preventDefault();
          if (event.shiftKey) {
            actions.saveAsDocument();
          } else {
            actions.saveDocument();
          }
          break;
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            actions.redo();
          } else {
            actions.undo();
          }
          break;
        case 'y':
          event.preventDefault();
          actions.redo();
          break;
        case 'x':
          event.preventDefault();
          actions.cut();
          break;
        case 'c':
          event.preventDefault();
          actions.copy();
          break;
        case 'v':
          event.preventDefault();
          actions.paste();
          break;
        case 'a':
          event.preventDefault();
          actions.selectAll();
          break;
        case 'f':
          event.preventDefault();
          actions.showFindDialog();
          break;
        case 'h':
          event.preventDefault();
          actions.showReplaceDialog();
          break;
        case 'p':
          event.preventDefault();
          actions.print();
          break;
        case 'g':
          event.preventDefault();
          const line = prompt('Go to line:');
          if (line) {
            actions.goToLine(parseInt(line, 10));
          }
          break;
      }
    }

    // Handle F11 for fullscreen
    if (event.key === 'F11') {
      event.preventDefault();
      actions.toggleFullscreen();
    }

    // Handle Escape to close dialogs
    if (event.key === 'Escape') {
      actions.hideFindDialog();
      actions.hideReplaceDialog();
      actions.hideSettingsDialog();
      actions.hideAboutDialog();
    }
  }, [actions]);

  return (
    <div 
      className={`h-full flex flex-col bg-white dark:bg-gray-900 ${
        state.isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Menu Bar */}
      <NotepadMenuBar state={state} actions={actions} />
      
      {/* Toolbar */}
      <NotepadToolbar state={state} actions={actions} />
      
      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        {state.settings.showLineNumbers && (
          <div 
            ref={refs.lineNumbersRef}
            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono p-2 select-none border-r border-gray-200 dark:border-gray-700"
            style={{ 
              minWidth: `${String(state.statistics.lines).length * 8 + 16}px`,
              fontSize: `${state.settings.fontSize}px`,
              lineHeight: `${state.settings.fontSize * 1.5}px`,
            }}
          >
            {Array.from({ length: state.statistics.lines }, (_, i) => (
              <div key={i + 1} className="text-right">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Editor */}
        <NotepadEditor 
          state={state} 
          actions={actions} 
          refs={refs}
        />
      </div>
      
      {/* Status Bar */}
      <NotepadStatusBar state={state} actions={actions} />
      
      {/* Dialogs */}
      <NotepadDialogs state={state} actions={actions} />
      
      {/* Keyboard Shortcuts */}
      <NotepadKeyboardShortcuts actions={actions} />
    </div>
  );
}

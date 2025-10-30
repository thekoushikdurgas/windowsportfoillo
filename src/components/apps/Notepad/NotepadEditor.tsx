'use client';

import { useEffect, useCallback } from 'react';
import { NotepadState, NotepadActions } from '@/types/notepad';

interface NotepadEditorProps {
  state: NotepadState;
  actions: NotepadActions;
  refs: {
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    lineNumbersRef: React.RefObject<HTMLDivElement>;
  };
}

export function NotepadEditor({ state, actions, refs }: NotepadEditorProps) {
  const { textareaRef, lineNumbersRef } = refs;

  // Sync line numbers with textarea scroll
  const syncLineNumbers = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [textareaRef, lineNumbersRef]);

  // Debounced text change handler for performance
  const debouncedSetContent = useCallback((content: string) => {
    const timeoutId = setTimeout(() => {
      actions.setContent(content);
    }, 100); // 100ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [actions]);

  // Handle text changes
  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    debouncedSetContent(newContent);
  }, [debouncedSetContent]);

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      actions.selectText(start, end);
    }
  }, [actions, textareaRef]);

  // Handle cursor position changes
  const handleCursorChange = useCallback(() => {
    if (textareaRef.current) {
      // Update cursor position in state if needed
      // This is handled by the parent component
    }
  }, [textareaRef]);

  // Handle key down events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      if (state.settings.insertSpaces) {
        const spaces = ' '.repeat(state.settings.tabSize);
        const newValue = value.substring(0, start) + spaces + value.substring(end);
        actions.setContent(newValue);
        
        // Set cursor position after inserted spaces
        setTimeout(() => {
          textarea.setSelectionRange(start + spaces.length, start + spaces.length);
        }, 0);
      } else {
        // Insert tab character
        const newValue = `${value.substring(0, start)}\t${value.substring(end)}`;
        actions.setContent(newValue);
        
        setTimeout(() => {
          textarea.setSelectionRange(start + 1, start + 1);
        }, 0);
      }
    }

    // Handle Enter key for auto-indentation
    if (event.key === 'Enter') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const value = textarea.value;
      const beforeCursor = value.substring(0, start);
      const lines = beforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Check if current line starts with whitespace
      const match = currentLine?.match(/^(\s*)/);
      if (match) {
        const indent = match[1];
        if (indent) {
          const newValue = `${value.substring(0, start)}\n${indent}${value.substring(start)}`;
          actions.setContent(newValue);
          
          setTimeout(() => {
            textarea.setSelectionRange(start + 1 + indent.length, start + 1 + indent.length);
          }, 0);
          
          event.preventDefault();
        }
      }
    }
  }, [actions, state.settings.insertSpaces, state.settings.tabSize, textareaRef]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    syncLineNumbers();
  }, [syncLineNumbers]);

  // Handle focus events
  const handleFocus = useCallback(() => {
    // Update cursor position when textarea gains focus
    handleCursorChange();
  }, [handleCursorChange]);

  // Handle blur events
  const handleBlur = useCallback(() => {
    // Save cursor position when textarea loses focus
    handleCursorChange();
  }, [handleCursorChange]);

  // Update line numbers when content changes
  useEffect(() => {
    syncLineNumbers();
  }, [state.document.content, syncLineNumbers]);

  // Auto-save functionality
  useEffect(() => {
    if (!state.settings.autoSave || !state.document.isModified) return;

    const timer = setTimeout(() => {
      actions.saveDocument();
    }, state.settings.autoSaveInterval);

    return () => clearTimeout(timer);
  }, [state.document.content, state.document.isModified, state.settings.autoSave, state.settings.autoSaveInterval, actions]);

  return (
    <div className="flex-1 relative">
      <textarea
        ref={textareaRef}
        value={state.document.content}
        onChange={handleTextChange}
        onSelect={handleSelectionChange}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full h-full resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white font-mono text-sm p-4 ${
          state.settings.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
        }`}
        style={{
          fontSize: `${state.settings.fontSize}px`,
          fontFamily: state.settings.fontFamily,
          lineHeight: `${state.settings.fontSize * 1.5}px`,
          transform: `scale(${state.settings.zoom / 100})`,
          transformOrigin: 'top left',
          width: `${100 / (state.settings.zoom / 100)}%`,
          height: `${100 / (state.settings.zoom / 100)}%`,
        }}
        placeholder="Start typing..."
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-testid="notepad-textarea"
        aria-label="Text editor"
        aria-describedby="notepad-status"
        role="textbox"
        tabIndex={0}
      />
      
      {/* Search highlights */}
      {state.searchResults.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {state.searchResults.map((result) => (
            <div
              key={`${result.line}-${result.column}-${result.start}`}
              className={`absolute ${
                state.searchResults.indexOf(result) === state.currentSearchIndex 
                  ? 'bg-yellow-300 dark:bg-yellow-600' 
                  : 'bg-yellow-200 dark:bg-yellow-700'
              } opacity-50`}
              style={{
                // Calculate position based on line and column
                // This is a simplified version - in a real implementation,
                // you'd need more sophisticated positioning logic
                top: `${result.line * state.settings.fontSize * 1.5}px`,
                left: `${result.column * (state.settings.fontSize * 0.6)}px`,
                width: `${result.text.length * (state.settings.fontSize * 0.6)}px`,
                height: `${state.settings.fontSize * 1.5}px`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Loading overlay */}
      {state.isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {state.error && (
        <div className="absolute inset-0 bg-red-50 dark:bg-red-900 bg-opacity-90 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-red-500">⚠️</div>
              <h3 className="font-semibold text-red-700 dark:text-red-300">Error</h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{state.error}</p>
            <button
              onClick={actions.clearError}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { NotepadState, NotepadActions, StatusBarItem } from '@/types/notepad';

interface NotepadStatusBarProps {
  state: NotepadState;
  actions: NotepadActions;
}

export function NotepadStatusBar({ state }: NotepadStatusBarProps) {
  const statusItems: StatusBarItem[] = [
    {
      id: 'position',
      content: `Line ${state.document.cursorPosition.line}, Col ${state.document.cursorPosition.column}`,
      position: 'left',
      priority: 1,
    },
    {
      id: 'selection',
      content: state.document.selection.start !== state.document.selection.end 
        ? `${state.document.selection.end - state.document.selection.start} characters selected`
        : '',
      position: 'left',
      priority: 2,
    },
    {
      id: 'statistics',
      content: `${state.statistics.words} words, ${state.statistics.characters} characters`,
      position: 'center',
      priority: 1,
    },
    {
      id: 'readingTime',
      content: state.statistics.readingTime > 0 
        ? `~${state.statistics.readingTime} min read`
        : '',
      position: 'center',
      priority: 2,
    },
    {
      id: 'status',
      content: state.isLoading 
        ? 'Loading...' 
        : state.document.isModified 
          ? 'Modified' 
          : 'Ready',
      position: 'right',
      priority: 1,
    },
    {
      id: 'zoom',
      content: `${state.settings.zoom}%`,
      position: 'right',
      priority: 2,
    },
    {
      id: 'encoding',
      content: 'UTF-8',
      position: 'right',
      priority: 3,
    },
  ];

  const leftItems = statusItems
    .filter(item => item.position === 'left')
    .sort((a, b) => a.priority - b.priority)
    .filter(item => item.content);

  const centerItems = statusItems
    .filter(item => item.position === 'center')
    .sort((a, b) => a.priority - b.priority)
    .filter(item => item.content);

  const rightItems = statusItems
    .filter(item => item.position === 'right')
    .sort((a, b) => a.priority - b.priority)
    .filter(item => item.content);

  return (
    <div 
      id="notepad-status"
      className="flex items-center justify-between px-3 py-1 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400"
      role="status"
      aria-live="polite"
    >
      {/* Left items */}
      <div className="flex items-center space-x-4">
        {leftItems.map((item) => (
          <span key={item.id} className="whitespace-nowrap">
            {item.content}
          </span>
        ))}
      </div>

      {/* Center items */}
      <div className="flex items-center space-x-4">
        {centerItems.map((item) => (
          <span key={item.id} className="whitespace-nowrap">
            {item.content}
          </span>
        ))}
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-4">
        {rightItems.map((item) => (
          <span key={item.id} className="whitespace-nowrap">
            {item.content}
          </span>
        ))}
        
        {/* Additional status indicators */}
        {state.document.isModified && (
          <span className="text-orange-500 dark:text-orange-400" title="Document has unsaved changes">
            ●
          </span>
        )}
        
        {state.searchResults.length > 0 && (
          <span className="text-blue-500 dark:text-blue-400" title={`${state.searchResults.length} search results`}>
            {state.currentSearchIndex + 1}/{state.searchResults.length}
          </span>
        )}
        
        {/* Word wrap indicator */}
        {state.settings.wordWrap && (
          <span className="text-gray-500 dark:text-gray-400" title="Word wrap enabled">
            WRAP
          </span>
        )}
        
        {/* Line numbers indicator */}
        {state.settings.showLineNumbers && (
          <span className="text-gray-500 dark:text-gray-400" title="Line numbers enabled">
            LN
          </span>
        )}
      </div>
    </div>
  );
}

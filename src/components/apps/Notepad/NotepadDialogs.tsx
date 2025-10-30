'use client';

import { useState, useEffect, useRef } from 'react';
import { NotepadState, NotepadActions } from '@/types/notepad';

interface NotepadDialogsProps {
  state: NotepadState;
  actions: NotepadActions;
}

export function NotepadDialogs({ state, actions }: NotepadDialogsProps) {
  const [findQuery, setFindQuery] = useState(state.searchOptions.query);
  const [replaceQuery, setReplaceQuery] = useState(state.searchOptions.replaceText);
  const [caseSensitive, setCaseSensitive] = useState(state.searchOptions.caseSensitive);
  const [wholeWord, setWholeWord] = useState(state.searchOptions.wholeWord);
  const [regex, setRegex] = useState(state.searchOptions.regex);
  const [wrapAround, setWrapAround] = useState(state.searchOptions.wrapAround);

  const findInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Focus find input when dialog opens
  useEffect(() => {
    if (state.showFindDialog && findInputRef.current) {
      findInputRef.current.focus();
      findInputRef.current.select();
    }
  }, [state.showFindDialog]);

  // Focus replace input when dialog opens
  useEffect(() => {
    if (state.showReplaceDialog && replaceInputRef.current) {
      replaceInputRef.current.focus();
      replaceInputRef.current.select();
    }
  }, [state.showReplaceDialog]);

  // Handle find
  const handleFind = () => {
    if (findQuery.trim()) {
      actions.find(findQuery, {
        caseSensitive,
        wholeWord,
        regex,
        wrapAround,
      });
    }
  };

  // Handle replace
  const handleReplace = () => {
    if (findQuery.trim() && replaceQuery.trim()) {
      actions.replace(findQuery, replaceQuery, {
        caseSensitive,
        wholeWord,
        regex,
        wrapAround,
      });
    }
  };

  // Handle replace all
  const handleReplaceAll = () => {
    if (findQuery.trim() && replaceQuery.trim()) {
      actions.replaceAll(findQuery, replaceQuery, {
        caseSensitive,
        wholeWord,
        regex,
        wrapAround,
      });
    }
  };

  // Handle key down in find dialog
  const handleFindKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFind();
    } else if (e.key === 'Escape') {
      actions.hideFindDialog();
    }
  };

  // Handle key down in replace dialog
  const handleReplaceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        handleReplace();
      } else {
        handleFind();
      }
    } else if (e.key === 'Escape') {
      actions.hideReplaceDialog();
    }
  };

  return (
    <>
      {/* Find Dialog */}
      {state.showFindDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Find
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Find what:
                </label>
                <input
                  ref={findInputRef}
                  type="text"
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  onKeyDown={handleFindKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter search term..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Match case</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wholeWord}
                    onChange={(e) => setWholeWord(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Match whole word</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={regex}
                    onChange={(e) => setRegex(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Use regular expressions</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wrapAround}
                    onChange={(e) => setWrapAround(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Wrap around</span>
                </label>
              </div>

              {state.searchResults.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {state.searchResults.length} result{state.searchResults.length !== 1 ? 's' : ''} found
                  {state.currentSearchIndex >= 0 && (
                    <span> (showing {state.currentSearchIndex + 1})</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={actions.hideFindDialog}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFind}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Find
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace Dialog */}
      {state.showReplaceDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Replace
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Find what:
                </label>
                <input
                  ref={findInputRef}
                  type="text"
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  onKeyDown={handleReplaceKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter search term..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Replace with:
                </label>
                <input
                  ref={replaceInputRef}
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  onKeyDown={handleReplaceKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter replacement text..."
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Match case</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wholeWord}
                    onChange={(e) => setWholeWord(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Match whole word</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={regex}
                    onChange={(e) => setRegex(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Use regular expressions</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={wrapAround}
                    onChange={(e) => setWrapAround(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Wrap around</span>
                </label>
              </div>

              {state.searchResults.length > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {state.searchResults.length} result{state.searchResults.length !== 1 ? 's' : ''} found
                  {state.currentSearchIndex >= 0 && (
                    <span> (showing {state.currentSearchIndex + 1})</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={actions.hideReplaceDialog}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFind}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Find
              </button>
              <button
                onClick={handleReplace}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={handleReplaceAll}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {state.showSettingsDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={state.settings.fontSize}
                  onChange={(e) => actions.updateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Family
                </label>
                <select
                  value={state.settings.fontFamily}
                  onChange={(e) => actions.updateSettings({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monospace">Monospace</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tab Size
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={state.settings.tabSize}
                  onChange={(e) => actions.updateSettings({ tabSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.settings.showLineNumbers}
                    onChange={(e) => actions.updateSettings({ showLineNumbers: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show line numbers</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.settings.wordWrap}
                    onChange={(e) => actions.updateSettings({ wordWrap: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Word wrap</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.settings.insertSpaces}
                    onChange={(e) => actions.updateSettings({ insertSpaces: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Insert spaces for tabs</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={state.settings.autoSave}
                    onChange={(e) => actions.updateSettings({ autoSave: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Auto-save</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={actions.hideSettingsDialog}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={actions.resetSettings}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={actions.hideSettingsDialog}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Dialog */}
      {state.showAboutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About Notepad
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  DurgasOS Notepad
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Version 1.0.0
                </p>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  A simple, clean text editor for DurgasOS with advanced features including:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>File operations (New, Open, Save, Save As)</li>
                  <li>Advanced text editing (Undo/Redo, Find/Replace)</li>
                  <li>Customizable interface (Fonts, Line Numbers, Word Wrap)</li>
                  <li>Print support</li>
                  <li>Keyboard shortcuts</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={actions.hideAboutDialog}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { realFileSystem } from '@/services/realFileSystemService';
import { logger } from '@/lib/logger';
import {
  NotepadState,
  NotepadActions,
  NotepadHookReturn,
  DocumentState,
  NotepadSettings,
  DocumentStatistics,
  SearchOptions,
  SearchResult,
  PrintOptions,
  RecentFile,
  HistoryItem,
} from '@/types/notepad';

const DEFAULT_SETTINGS: NotepadSettings = {
  showLineNumbers: true,
  wordWrap: false,
  fontSize: 14,
  fontFamily: 'monospace',
  zoom: 100,
  theme: 'auto',
  tabSize: 2,
  insertSpaces: true,
  autoSave: false,
  autoSaveInterval: 30000, // 30 seconds
};

const DEFAULT_DOCUMENT: DocumentState = {
  content: '',
  filename: 'Untitled.txt',
  isModified: false,
  cursorPosition: { line: 1, column: 1 },
  selection: { start: 0, end: 0 },
  history: [],
  historyIndex: -1,
};

const DEFAULT_STATISTICS: DocumentStatistics = {
  characters: 0,
  charactersNoSpaces: 0,
  words: 0,
  lines: 1,
  paragraphs: 0,
  readingTime: 0,
  lastCalculated: new Date(),
};

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  query: '',
  replaceText: '',
  caseSensitive: false,
  wholeWord: false,
  regex: false,
  wrapAround: true,
};

const DEFAULT_PRINT_OPTIONS: PrintOptions = {
  fontSize: 12,
  fontFamily: 'monospace',
  margins: { top: 1, right: 1, bottom: 1, left: 1 },
  orientation: 'portrait',
  pageSize: 'A4',
  header: '',
  footer: '',
  showLineNumbers: false,
  showPageNumbers: true,
};

export function useNotepadState(initialContent?: string): NotepadHookReturn {
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // State
  const [state, setState] = useState<NotepadState>({
    document: {
      ...DEFAULT_DOCUMENT,
      content: initialContent || '',
    },
    settings: DEFAULT_SETTINGS,
    statistics: DEFAULT_STATISTICS,
    searchOptions: DEFAULT_SEARCH_OPTIONS,
    searchResults: [],
    currentSearchIndex: -1,
    recentFiles: [],
    isFullscreen: false,
    isPrintPreview: false,
    printOptions: DEFAULT_PRINT_OPTIONS,
    showFindDialog: false,
    showReplaceDialog: false,
    showSettingsDialog: false,
    showAboutDialog: false,
    isLoading: false,
  });

  // Calculate statistics
  const calculateStatistics = useCallback((content: string): DocumentStatistics => {
    const characters = content.length;
    const charactersNoSpaces = content.replace(/\s/g, '').length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const lines = content.split('\n').length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute

    return {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      readingTime,
      lastCalculated: new Date(),
    };
  }, []);

  // Update statistics when content changes
  useEffect(() => {
    const newStats = calculateStatistics(state.document.content);
    setState(prev => ({
      ...prev,
      statistics: newStats,
    }));
  }, [state.document.content, calculateStatistics]);

  // Add to history
  const addToHistory = useCallback((action: string, content: string, cursorPosition: { line: number; column: number }, selection?: { start: number; end: number }) => {
    setState(prev => {
      const newHistoryItem: HistoryItem = {
        content,
        cursorPosition,
        timestamp: new Date(),
        action,
        ...(selection !== undefined && { selection }),
      };

      // Remove any history after current index
      const newHistory = prev.document.history.slice(0, prev.document.historyIndex + 1);
      newHistory.push(newHistoryItem);

      // Limit history size
      const maxHistorySize = 50;
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      return {
        ...prev,
        document: {
          ...prev.document,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isModified: true,
        },
      };
    });
  }, []);

  // File operations
  const saveDocument = useCallback(async () => {
    try {
      setState(prev => {
        const { error: _error, ...rest } = prev;
        void _error; // Intentionally unused
        return { ...rest, isLoading: true };
      });

      if (state.document.fileHandle) {
        await realFileSystem.writeFile(state.document.fileHandle, state.document.content);
      } else {
        const fileHandle = await realFileSystem.saveFile(
          state.document.filename,
          {
            'Text Files': ['.txt'],
            'All Files': ['*'],
          }
        );
        
        if (!fileHandle) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        await realFileSystem.writeFile(fileHandle, state.document.content);
        
        setState(prev => ({
          ...prev,
          document: {
            ...prev.document,
            filename: fileHandle.name,
            isModified: false,
            lastSaved: new Date(),
            fileHandle,
          },
          isLoading: false,
        }));
        
        logger.info('Document saved as successfully', { filename: fileHandle.name });
        return;
      }

      setState(prev => ({
        ...prev,
        document: {
          ...prev.document,
          isModified: false,
          lastSaved: new Date(),
        },
        isLoading: false,
      }));

      logger.info('Document saved successfully', { filename: state.document.filename });
    } catch (_error) {
      logger.error('Failed to save document:', _error as unknown as Record<string, unknown>);
      setState(prev => ({
        ...prev,
        error: 'Failed to save document',
        isLoading: false,
      }));
    }
  }, [state.document.fileHandle, state.document.content, state.document.filename]);

  const newDocument = useCallback(async () => {
    if (state.document.isModified) {
      const shouldSave = window.confirm('Do you want to save changes to the current document?');
      if (shouldSave) {
        await saveDocument();
      }
    }

    setState(prev => {
      const { error: _error, ...rest } = prev;
      void _error; // Intentionally unused
      return {
        ...rest,
        document: DEFAULT_DOCUMENT,
        searchResults: [],
        currentSearchIndex: -1,
      };
    });
  }, [state.document.isModified, saveDocument]);

  const openDocument = useCallback(async () => {
    try {
      setState(prev => {
        const { error: _error, ...rest } = prev;
        void _error; // Intentionally unused
        return { ...rest, isLoading: true };
      });

      const fileHandle = await realFileSystem.selectFile({
        'Text Files': ['.txt'],
        'All Files': ['*'],
      });

      if (!fileHandle) return;

      const file = await realFileSystem.readFile(fileHandle);
      const content = await file.text();

      const newDocument: DocumentState = {
        content,
        filename: file.name,
        isModified: false,
        cursorPosition: { line: 1, column: 1 },
        selection: { start: 0, end: 0 },
        history: [],
        historyIndex: -1,
        lastSaved: new Date(),
        fileHandle,
      };

      setState(prev => ({
        ...prev,
        document: newDocument,
        isLoading: false,
        recentFiles: [
          { filename: file.name, path: file.name, lastOpened: new Date() },
          ...prev.recentFiles.filter(f => f.filename !== file.name).slice(0, 9)
        ],
      }));

      logger.info('Document opened successfully', { filename: file.name });
    } catch (error) {
      logger.error('Failed to open document:', error as unknown as Record<string, unknown>);
      setState(prev => ({
        ...prev,
        error: 'Failed to open document',
        isLoading: false,
      }));
    }
  }, []);

  const saveAsDocument = useCallback(async () => {
    try {
      setState(prev => {
        const { error: _error, ...rest } = prev;
        void _error; // Intentionally unused
        return { ...rest, isLoading: true };
      });

      const fileHandle = await realFileSystem.saveFile(
        state.document.filename,
        {
          'Text Files': ['.txt'],
          'All Files': ['*'],
        }
      );

      if (!fileHandle) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      await realFileSystem.writeFile(fileHandle, state.document.content);

      setState(prev => ({
        ...prev,
        document: {
          ...prev.document,
          filename: fileHandle.name,
          isModified: false,
          lastSaved: new Date(),
          fileHandle,
        },
        isLoading: false,
      }));

      logger.info('Document saved as successfully', { filename: fileHandle.name });
    } catch (_error) {
      logger.error('Failed to save document as:', _error as unknown as Record<string, unknown>);
      setState(prev => ({
        ...prev,
        error: 'Failed to save document',
        isLoading: false,
      }));
    }
  }, [state.document.content, state.document.filename]);

  const closeDocument = useCallback(() => {
    if (state.document.isModified) {
      const shouldSave = window.confirm('Do you want to save changes to the current document?');
      if (shouldSave) {
        saveDocument();
      }
    }

    setState(prev => {
      const { error: _error, ...rest } = prev;
      void _error; // Intentionally unused
      return {
        ...rest,
        document: DEFAULT_DOCUMENT,
        searchResults: [],
        currentSearchIndex: -1,
      };
    });
  }, [state.document.isModified, saveDocument]);

  // Content operations
  const setContent = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      document: {
        ...prev.document,
        content,
        isModified: true,
      },
    }));
  }, []);

  const insertText = useCallback((text: string, position?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = position ?? textarea.selectionStart;
    const end = position ?? textarea.selectionEnd;
    const newContent = state.document.content.slice(0, start) + text + state.document.content.slice(end);

    addToHistory('insert', newContent, { line: 1, column: 1 });
    setContent(newContent);

    // Update cursor position
    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }, [state.document.content, addToHistory, setContent]);

  const deleteText = useCallback((start: number, end: number) => {
    const newContent = state.document.content.slice(0, start) + state.document.content.slice(end);
    addToHistory('delete', newContent, { line: 1, column: 1 });
    setContent(newContent);
  }, [state.document.content, addToHistory, setContent]);

  const selectText = useCallback((start: number, end: number) => {
    setState(prev => ({
      ...prev,
      document: {
        ...prev.document,
        selection: { start, end },
      },
    }));
  }, []);

  const selectAll = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.select();
    selectText(0, state.document.content.length);
  }, [state.document.content.length, selectText]);

  // History operations
  const undo = useCallback(() => {
    if (state.document.historyIndex <= 0) return;

    const newIndex = state.document.historyIndex - 1;
    const historyItem = state.document.history[newIndex];
    if (!historyItem) return;

    setState(prev => ({
      ...prev,
      document: {
        ...prev.document,
        content: historyItem.content,
        cursorPosition: historyItem.cursorPosition,
        selection: historyItem.selection || { start: 0, end: 0 },
        historyIndex: newIndex,
        isModified: true,
      },
    }));
  }, [state.document.historyIndex, state.document.history]);

  const redo = useCallback(() => {
    if (state.document.historyIndex >= state.document.history.length - 1) return;

    const newIndex = state.document.historyIndex + 1;
    const historyItem = state.document.history[newIndex];
    if (!historyItem) return;

    setState(prev => ({
      ...prev,
      document: {
        ...prev.document,
        content: historyItem.content,
        cursorPosition: historyItem.cursorPosition,
        selection: historyItem.selection || { start: 0, end: 0 },
        historyIndex: newIndex,
        isModified: true,
      },
    }));
  }, [state.document.historyIndex, state.document.history]);

  const canUndo = useCallback(() => {
    return state.document.historyIndex > 0;
  }, [state.document.historyIndex]);

  const canRedo = useCallback(() => {
    return state.document.historyIndex < state.document.history.length - 1;
  }, [state.document.historyIndex, state.document.history.length]);

  // Clipboard operations
  const cut = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      deleteText(textarea.selectionStart, textarea.selectionEnd);
    }
  }, [deleteText]);

  const copy = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
  }, []);

  const paste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        insertText(text);
      }
    } catch (error) {
      logger.error('Failed to paste text:', error as unknown as Record<string, unknown>);
    }
  }, [insertText]);

  // Search operations
  const find = useCallback((query: string, options?: Partial<SearchOptions>) => {
    if (!query.trim()) return;

    const searchOptions = { ...state.searchOptions, ...options, query };
    const results: SearchResult[] = [];
    const content = state.document.content;

    let searchText = content;
    if (!searchOptions.caseSensitive) {
      searchText = content.toLowerCase();
      query = query.toLowerCase();
    }

    let index = 0;
    while (index < searchText.length) {
      const foundIndex = searchText.indexOf(query, index);
      if (foundIndex === -1) break;

      // Check whole word if required
      if (searchOptions.wholeWord) {
        const before = foundIndex > 0 ? searchText.charAt(foundIndex - 1) : ' ';
        const after = foundIndex + query.length < searchText.length ? searchText.charAt(foundIndex + query.length) : ' ';
        if (!/\s/.test(before) || !/\s/.test(after)) {
          index = foundIndex + 1;
          continue;
        }
      }

      // Calculate line and column
      const beforeText = content.substring(0, foundIndex);
      const beforeLines = beforeText.split('\n');
      const line = beforeLines.length - 1;
      const lastLine = beforeLines[beforeLines.length - 1];
      const column = lastLine?.length ?? 0;

      results.push({
        start: foundIndex,
        end: foundIndex + query.length,
        line,
        column,
        text: content.substring(foundIndex, foundIndex + query.length),
      });

      index = foundIndex + query.length;
    }

    setState(prev => ({
      ...prev,
      searchOptions: searchOptions,
      searchResults: results,
      currentSearchIndex: results.length > 0 ? 0 : -1,
    }));
  }, [state.searchOptions, state.document.content]);

  const findNext = useCallback(() => {
    if (state.searchResults.length === 0) return;

    const nextIndex = (state.currentSearchIndex + 1) % state.searchResults.length;
    setState(prev => ({
      ...prev,
      currentSearchIndex: nextIndex,
    }));

    // Scroll to result
    const result = state.searchResults[nextIndex];
    if (result && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(result.start, result.end);
    }
  }, [state.searchResults, state.currentSearchIndex]);

  const findPrevious = useCallback(() => {
    if (state.searchResults.length === 0) return;

    const prevIndex = state.currentSearchIndex <= 0 ? state.searchResults.length - 1 : state.currentSearchIndex - 1;
    setState(prev => ({
      ...prev,
      currentSearchIndex: prevIndex,
    }));

    // Scroll to result
    const result = state.searchResults[prevIndex];
    if (result && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(result.start, result.end);
    }
  }, [state.searchResults, state.currentSearchIndex]);

  const replace = useCallback((query: string, replaceText: string, options?: Partial<SearchOptions>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    if (selectedText === query) {
      insertText(replaceText);
      find(query, options);
    }
  }, [insertText, find]);

  const replaceAll = useCallback((query: string, replaceText: string, options?: Partial<SearchOptions>) => {
    let newContent = state.document.content;
    const searchOptions = { ...state.searchOptions, ...options, query };

    if (searchOptions.caseSensitive) {
      newContent = newContent.replace(new RegExp(query, 'g'), replaceText);
    } else {
      newContent = newContent.replace(new RegExp(query, 'gi'), replaceText);
    }

    addToHistory('replaceAll', newContent, { line: 1, column: 1 });
    setContent(newContent);
  }, [state.document.content, state.searchOptions, addToHistory, setContent]);

  // View operations
  const toggleLineNumbers = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        showLineNumbers: !prev.settings.showLineNumbers,
      },
    }));
  }, []);

  const toggleWordWrap = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        wordWrap: !prev.settings.wordWrap,
      },
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        zoom: Math.max(50, Math.min(200, zoom)),
      },
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        zoom: 100,
      },
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, []);

  // Settings operations
  const updateSettings = useCallback((newSettings: Partial<NotepadSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      settings: DEFAULT_SETTINGS,
    }));
  }, []);

  // Print operations
  const print = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = state.document.content;
    const lines = content.split('\n');
    const printContent = lines.map((line, index) => {
      const lineNumber = state.printOptions.showLineNumbers ? `${index + 1}: ` : '';
      return `${lineNumber}${line}`;
    }).join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>${state.document.filename}</title>
          <style>
            body { 
              font-family: ${state.printOptions.fontFamily}; 
              font-size: ${state.printOptions.fontSize}px;
              margin: ${state.printOptions.margins.top}in ${state.printOptions.margins.right}in ${state.printOptions.margins.bottom}in ${state.printOptions.margins.left}in;
              white-space: pre-wrap;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [state.document.content, state.document.filename, state.printOptions]);

  const printPreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPrintPreview: !prev.isPrintPreview,
    }));
  }, []);

  const updatePrintOptions = useCallback((options: Partial<PrintOptions>) => {
    setState(prev => ({
      ...prev,
      printOptions: {
        ...prev.printOptions,
        ...options,
      },
    }));
  }, []);

  // Dialog operations
  const showFindDialog = useCallback(() => {
    setState(prev => ({ ...prev, showFindDialog: true }));
  }, []);

  const hideFindDialog = useCallback(() => {
    setState(prev => ({ ...prev, showFindDialog: false }));
  }, []);

  const showReplaceDialog = useCallback(() => {
    setState(prev => ({ ...prev, showReplaceDialog: true }));
  }, []);

  const hideReplaceDialog = useCallback(() => {
    setState(prev => ({ ...prev, showReplaceDialog: false }));
  }, []);

  const showSettingsDialog = useCallback(() => {
    setState(prev => ({ ...prev, showSettingsDialog: true }));
  }, []);

  const hideSettingsDialog = useCallback(() => {
    setState(prev => ({ ...prev, showSettingsDialog: false }));
  }, []);

  const showAboutDialog = useCallback(() => {
    setState(prev => ({ ...prev, showAboutDialog: true }));
  }, []);

  const hideAboutDialog = useCallback(() => {
    setState(prev => ({ ...prev, showAboutDialog: false }));
  }, []);

  // Utility operations
  const goToLine = useCallback((line: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lines = state.document.content.split('\n');
    if (line < 1 || line > lines.length) return;

    const position = lines.slice(0, line - 1).join('\n').length + (line > 1 ? 1 : 0);
    textarea.setSelectionRange(position, position);
    textarea.focus();
  }, [state.document.content]);

  const clearError = useCallback(() => {
    setState(prev => {
      const { error: _error, ...rest } = prev;
      void _error; // Intentionally unused
      return rest;
    });
  }, []);

  const addRecentFile = useCallback((file: RecentFile) => {
    setState(prev => ({
      ...prev,
      recentFiles: [file, ...prev.recentFiles.filter(f => f.filename !== file.filename)].slice(0, 10),
    }));
  }, []);

  const removeRecentFile = useCallback((filename: string) => {
    setState(prev => ({
      ...prev,
      recentFiles: prev.recentFiles.filter(f => f.filename !== filename),
    }));
  }, []);

  const clearRecentFiles = useCallback(() => {
    setState(prev => ({ ...prev, recentFiles: [] }));
  }, []);

  // Actions object
  const actions: NotepadActions = useMemo(() => ({
    newDocument,
    openDocument,
    saveDocument,
    saveAsDocument,
    closeDocument,
    setContent,
    insertText,
    deleteText,
    selectText,
    selectAll,
    undo,
    redo,
    canUndo,
    canRedo,
    cut,
    copy,
    paste,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    toggleLineNumbers,
    toggleWordWrap,
    setZoom,
    resetZoom,
    toggleFullscreen,
    updateSettings,
    resetSettings,
    print,
    printPreview,
    updatePrintOptions,
    showFindDialog,
    hideFindDialog,
    showReplaceDialog,
    hideReplaceDialog,
    showSettingsDialog,
    hideSettingsDialog,
    showAboutDialog,
    hideAboutDialog,
    calculateStatistics: () => calculateStatistics(state.document.content),
    goToLine,
    clearError,
    addRecentFile,
    removeRecentFile,
    clearRecentFiles,
  }), [
    newDocument,
    openDocument,
    saveDocument,
    saveAsDocument,
    closeDocument,
    setContent,
    insertText,
    deleteText,
    selectText,
    selectAll,
    undo,
    redo,
    canUndo,
    canRedo,
    cut,
    copy,
    paste,
    find,
    findNext,
    findPrevious,
    replace,
    replaceAll,
    toggleLineNumbers,
    toggleWordWrap,
    setZoom,
    resetZoom,
    toggleFullscreen,
    updateSettings,
    resetSettings,
    print,
    printPreview,
    updatePrintOptions,
    showFindDialog,
    hideFindDialog,
    showReplaceDialog,
    hideReplaceDialog,
    showSettingsDialog,
    hideSettingsDialog,
    showAboutDialog,
    hideAboutDialog,
    calculateStatistics,
    state.document.content,
    goToLine,
    clearError,
    addRecentFile,
    removeRecentFile,
    clearRecentFiles,
  ]);

  return {
    state,
    actions,
    refs: {
      textareaRef,
      lineNumbersRef,
    },
  };
}

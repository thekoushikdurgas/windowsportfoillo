'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { apps } from '@/lib/apps.config';
import { logger } from '@/lib/logger';

export interface SearchResult {
  id: string;
  type: 'app' | 'file' | 'setting' | 'recent';
  title: string;
  description: string;
  icon: string;
  category: string;
  relevance: number;
  action: () => void;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultCount: number;
}

interface DesktopSearchState {
  query: string;
  results: SearchResult[];
  isOpen: boolean;
  selectedIndex: number;
  history: SearchHistoryItem[];
  suggestions: string[];
}

export function useDesktopSearch() {
  const [state, setState] = useState<DesktopSearchState>({
    query: '',
    results: [],
    isOpen: false,
    selectedIndex: -1,
    history: [],
    suggestions: [],
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchIndexRef = useRef<Map<string, SearchResult[]>>(new Map());

  // Build search index
  const buildSearchIndex = useCallback(() => {
    const index = new Map<string, SearchResult[]>();

    // Index applications
    apps.forEach(app => {
      const result: SearchResult = {
        id: `app-${app.id}`,
        type: 'app',
        title: app.title,
        description: `Open ${app.title}`,
        icon: app.Icon ? app.title : 'App',
        category: 'Applications',
        relevance: 1,
        action: () => {
          // This will be handled by the parent component
          logger.debug('Open app', { appId: app.id });
        },
      };

      // Index by title
      const titleWords = app.title.toLowerCase().split(/\s+/);
      titleWords.forEach((word: string) => {
        if (!index.has(word)) index.set(word, []);
        const wordResults = index.get(word);
        if (wordResults) {
          wordResults.push(result);
        }
      });

      // Index by description
      const descWords = result.description.toLowerCase().split(/\s+/);
      descWords.forEach((word: string) => {
        if (!index.has(word)) index.set(word, []);
        const wordResults = index.get(word);
        if (wordResults) {
          wordResults.push({ ...result, relevance: 0.8 });
        }
      });

      // Index by category
      const categoryWords = result.category.toLowerCase().split(/\s+/);
      categoryWords.forEach((word: string) => {
        if (!index.has(word)) index.set(word, []);
        const wordResults = index.get(word);
        if (wordResults) {
          wordResults.push({ ...result, relevance: 0.6 });
        }
      });
    });

    // Index recent files (mock data)
    const recentFiles = [
      { name: 'Document.pdf', path: '/Documents/Document.pdf' },
      { name: 'Image.jpg', path: '/Pictures/Image.jpg' },
      { name: 'Spreadsheet.xlsx', path: '/Documents/Spreadsheet.xlsx' },
    ];

    recentFiles.forEach(file => {
      const result: SearchResult = {
        id: `file-${file.name}`,
        type: 'file',
        title: file.name,
        description: file.path,
        icon: 'File',
        category: 'Recent Files',
        relevance: 0.9,
        action: () => {
          logger.debug('Open file', { filePath: file.path });
        },
      };

      const fileNameWords = file.name.toLowerCase().split(/[.\s]+/);
      fileNameWords.forEach(word => {
        if (!index.has(word)) index.set(word, []);
        const wordResults = index.get(word);
        if (wordResults) {
          wordResults.push(result);
        }
      });
    });

    // Index settings (mock data)
    const settings = [
      { name: 'Display Settings', description: 'Change screen resolution and brightness' },
      { name: 'Sound Settings', description: 'Adjust volume and audio devices' },
      { name: 'Network Settings', description: 'Configure internet and WiFi' },
      { name: 'Privacy Settings', description: 'Manage privacy and security options' },
    ];

    settings.forEach(setting => {
      const result: SearchResult = {
        id: `setting-${setting.name}`,
        type: 'setting',
        title: setting.name,
        description: setting.description,
        icon: 'Settings',
        category: 'Settings',
        relevance: 0.7,
        action: () => {
          logger.debug('Open setting', { settingName: setting.name });
        },
      };

      const settingWords = setting.name.toLowerCase().split(/\s+/);
      settingWords.forEach(word => {
        if (!index.has(word)) index.set(word, []);
        const wordResults = index.get(word);
        if (wordResults) {
          wordResults.push(result);
        }
      });
    });

    searchIndexRef.current = index;
  }, []);

  // Search function
  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, query, results: [], selectedIndex: -1 }));
      return;
    }

    if (searchIndexRef.current.size === 0) {
      buildSearchIndex();
    }

    const queryWords = query.toLowerCase().split(/\s+/);
    const resultMap = new Map<string, SearchResult>();

    // Find results for each query word
    queryWords.forEach(word => {
      searchIndexRef.current.forEach((results, indexWord) => {
        if (indexWord.includes(word) || word.includes(indexWord)) {
          results.forEach(result => {
            const key = result.id;
            if (!resultMap.has(key)) {
              resultMap.set(key, { ...result });
            } else {
              // Increase relevance for multiple word matches
              const existing = resultMap.get(key);
              if (existing) {
                existing.relevance = Math.min(1, existing.relevance + 0.1);
              }
            }
          });
        }
      });
    });

    // Convert to array and sort by relevance
    const results = Array.from(resultMap.values())
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10); // Limit to 10 results

    setState(prev => ({
      ...prev,
      query,
      results,
      selectedIndex: results.length > 0 ? 0 : -1,
    }));
  }, [buildSearchIndex]);

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      search(query);
    }, 150);
  }, [search]);

  // Update query
  const updateQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Open search
  const openSearch = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  // Close search
  const closeSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      query: '',
      results: [],
      selectedIndex: -1,
    }));
  }, []);

  // Navigate results
  const navigateResults = useCallback((direction: 'up' | 'down') => {
    setState(prev => {
      if (prev.results.length === 0) return prev;

      const newIndex = direction === 'up'
        ? Math.max(0, prev.selectedIndex - 1)
        : Math.min(prev.results.length - 1, prev.selectedIndex + 1);

      return { ...prev, selectedIndex: newIndex };
    });
  }, []);

  // Select result
  const selectResult = useCallback((index?: number) => {
    const targetIndex = index ?? state.selectedIndex;
    if (targetIndex >= 0 && targetIndex < state.results.length) {
      const result = state.results[targetIndex];
      if (result) {
        result.action();
      }
      closeSearch();
    }
  }, [state.selectedIndex, state.results, closeSearch]);

  // Add to history
  const addToHistory = useCallback((query: string, resultCount: number) => {
    const historyItem: SearchHistoryItem = {
      id: `history-${Date.now()}`,
      query,
      timestamp: new Date(),
      resultCount,
    };

    setState(prev => ({
      ...prev,
      history: [historyItem, ...prev.history.slice(0, 9)], // Keep last 10 items
    }));
  }, []);

  // Get suggestions
  const getSuggestions = useCallback(() => {
    if (state.query.length < 2) return [];

    const suggestions = new Set<string>();
    
    // Add from history
    state.history.forEach(item => {
      if (item.query.toLowerCase().includes(state.query.toLowerCase())) {
        suggestions.add(item.query);
      }
    });

    // Add from apps
    apps.forEach(app => {
      if (app.title.toLowerCase().includes(state.query.toLowerCase())) {
        suggestions.add(app.title);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }, [state.query, state.history]);

  // Memoized suggestions
  const suggestions = useMemo(() => getSuggestions(), [getSuggestions]);

  return {
    // State
    query: state.query,
    results: state.results,
    isOpen: state.isOpen,
    selectedIndex: state.selectedIndex,
    history: state.history,
    suggestions,
    
    // Actions
    updateQuery,
    openSearch,
    closeSearch,
    navigateResults,
    selectResult,
    addToHistory,
    search,
  };
}

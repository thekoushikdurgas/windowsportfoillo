'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, History, X, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDesktopSearch } from '@/hooks/use-desktop-search';

interface DesktopSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopSearch({ isOpen, onClose }: DesktopSearchProps) {
  const { 
    query, 
    results, 
    selectedIndex, 
    suggestions,
    updateQuery, 
    navigateResults, 
    selectResult,
    addToHistory 
  } = useDesktopSearch();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateResults('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateResults('down');
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectResult(selectedIndex);
          addToHistory(query, results.length);
        }
        break;
    }
  }, [isOpen, onClose, navigateResults, selectResult, addToHistory, query, results.length, selectedIndex]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateQuery(value);
    setShowSuggestions(value.length > 0);
  }, [updateQuery]);

  // Handle result click
  const handleResultClick = useCallback((index: number) => {
    selectResult(index);
    addToHistory(query, results.length);
  }, [selectResult, addToHistory, query, results.length]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    updateQuery(suggestion);
    setShowSuggestions(false);
  }, [updateQuery]);

  // Close on outside click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl">
            <Search className="w-5 h-5 text-white/70 ml-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search apps, files, and settings..."
              className="flex-1 bg-transparent text-white placeholder-white/50 px-4 py-4 text-lg outline-none"
            />
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white transition-colors"
            title="Close search"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
          </div>

          {/* Search Results */}
          {query && (
            <div 
              ref={resultsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl max-h-96 overflow-y-auto"
            >
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(index)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors",
                        selectedIndex === index && "bg-white/20"
                      )}
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                          {result.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {result.title}
                        </div>
                        <div className="text-white/70 text-sm truncate">
                          {result.description}
                        </div>
                      </div>
                      <div className="text-white/50 text-xs">
                        {result.category}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-white/70">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && !query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl">
              <div className="py-2">
                <div className="px-4 py-2 text-white/70 text-sm font-medium flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent searches
                </div>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/10 transition-colors text-white/90"
                  >
                    <Clock className="w-4 h-4 text-white/50" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-4 flex items-center justify-center gap-6 text-white/50 text-sm">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" />
            <ArrowDown className="w-3 h-3" />
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            <span>Select</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="w-3 h-3" />
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

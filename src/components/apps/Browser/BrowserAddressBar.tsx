'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Lock, AlertTriangle, Loader2, Home } from 'lucide-react';
import { useBrowserStore } from '@/store/browserStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BrowserAddressBarProps {
  className?: string;
}

export function BrowserAddressBar({ className = '' }: BrowserAddressBarProps) {
  const {
    activeTabId,
    tabs,
    navigateTo,
    settings,
  } = useBrowserStore();

  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (activeTab) {
      setInputValue(activeTab.url);
    }
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNavigate();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleNavigate = () => {
    if (!inputValue.trim()) return;

    let url = inputValue.trim();

    // If it looks like a search query, use the search engine
    if (!isValidUrl(url)) {
      url = getSearchUrl(url);
    }

    navigateTo(url);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return string.includes('.') && !string.includes(' ');
    }
  };

  const getSearchUrl = (query: string): string => {
    const searchEngines = {
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
    };

    return searchEngines[settings.searchEngine] || searchEngines.google;
  };

  const getSecurityIcon = () => {
    if (!activeTab) return null;

    const url = activeTab.url;
    if (url.startsWith('https://')) {
      return <Lock className="h-4 w-4 text-green-500" />;
    } else if (url.startsWith('http://')) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  const getLoadingIcon = () => {
    if (activeTab?.isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 p-2 ${className}`}>
        {/* Security Icon */}
        <div className="flex-shrink-0">
          {getSecurityIcon()}
        </div>

        {/* Address Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                // Input is focused
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder="Search or enter address"
              className="pr-10 pl-4 py-2 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Loading Indicator */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getLoadingIcon()}
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50">
              <div className="p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Suggestions
                </div>
                <div className="space-y-1">
                  <div
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => {
                      setInputValue(settings.homepage);
                      handleNavigate();
                    }}
                  >
                    <Home className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Go to homepage</span>
                  </div>
                  <div
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => {
                      const searchUrl = getSearchUrl(inputValue);
                      setInputValue(searchUrl);
                      handleNavigate();
                    }}
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Search for &quot;{inputValue}&quot;</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigate}
              className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

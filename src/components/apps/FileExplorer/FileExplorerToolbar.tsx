'use client';

import { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, RefreshCw, Grid, List, MoreHorizontal, ArrowUp, ArrowDown, Undo2 } from 'lucide-react';

interface FileExplorerToolbarProps {
  currentPath: string[];
  onNavigateUp: () => void;
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'list' | 'grid' | 'details';
  onViewModeChange: (mode: 'list' | 'grid' | 'details') => void;
  onSearch: () => void;
  onClearSearch: () => void;
  sortBy: 'name' | 'size' | 'date' | 'type';
  onSortByChange: (sortBy: 'name' | 'size' | 'date' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onUndo: () => void;
  canUndo: boolean;
}

const FileExplorerToolbar = memo(({
  currentPath,
  onNavigateUp,
  onRefresh,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onSearch,
  onClearSearch,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onUndo,
  canUndo,
}: FileExplorerToolbarProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  }, [onSearch]);

  const handleClearSearch = useCallback(() => {
    onClearSearch();
    onSearchChange('');
  }, [onClearSearch, onSearchChange]);

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNavigateUp} 
          disabled={currentPath.length === 0}
        >
          ← Back
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last operation (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 min-w-0">
        <div className="truncate">
          {currentPath.length === 0 ? 'This PC' : currentPath.join(' > ')}
        </div>
      </div>

      {/* Search */}
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`pl-8 pr-8 w-64 ${isSearchFocused ? 'ring-2 ring-blue-500' : ''}`}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSearch}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </div>

      {/* Sorting */}
      <div className="flex items-center gap-1">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as 'name' | 'size' | 'date' | 'type')}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          aria-label="Sort by"
          title="Sort by"
        >
          <option value="name">Name</option>
          <option value="size">Size</option>
          <option value="date">Date</option>
          <option value="type">Type</option>
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* View Mode */}
      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'details' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('details')}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

FileExplorerToolbar.displayName = 'FileExplorerToolbar';

export { FileExplorerToolbar };

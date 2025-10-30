'use client';

import { memo, useCallback, useMemo } from 'react';
import { FileSystemItem } from '@/types/filesystem';
import { FileExplorerItem } from './FileExplorerItem';

interface FileExplorerListProps {
  items: FileSystemItem[];
  expandedFolders: Set<string>;
  onToggleFolder: (itemId: string) => void;
  onItemDoubleClick: (item: FileSystemItem) => void;
  onItemContextMenu: (e: React.MouseEvent, item: FileSystemItem) => void;
  onEmptyContextMenu: (e: React.MouseEvent) => void;
  viewMode: 'list' | 'grid' | 'details';
  selectedItems: Set<string>;
  onItemSelect: (itemId: string, selected: boolean) => void;
  searchQuery: string;
  sortBy: 'name' | 'size' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
  dragProps?: (item: FileSystemItem) => {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
  };
  dropProps?: (itemId: string, itemType: 'file' | 'folder', targetPath: string[]) => {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  isDragOver?: (itemId: string) => boolean;
}

const FileExplorerList = memo(({
  items,
  expandedFolders,
  onToggleFolder,
  onItemDoubleClick,
  onItemContextMenu,
  onEmptyContextMenu,
  viewMode,
  selectedItems,
  onItemSelect,
  searchQuery,
  sortBy,
  sortOrder,
  dragProps,
  dropProps,
  isDragOver,
}: FileExplorerListProps) => {
  const handleItemDoubleClick = useCallback((item: FileSystemItem) => {
    onItemDoubleClick(item);
  }, [onItemDoubleClick]);

  const handleItemContextMenu = useCallback((e: React.MouseEvent, item: FileSystemItem) => {
    onItemContextMenu(e, item);
  }, [onItemContextMenu]);

  const handleItemSelect = useCallback((itemId: string, selected: boolean) => {
    onItemSelect(itemId, selected);
  }, [onItemSelect]);

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'date':
          comparison = (a.modified?.getTime() || 0) - (b.modified?.getTime() || 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [items, sortBy, sortOrder]);

  const renderGridView = () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      {sortedItems.map((item) => (
        <FileExplorerItem
          key={item.id}
          item={item}
          isExpanded={expandedFolders.has(item.id)}
          onToggleFolder={onToggleFolder}
          onDoubleClick={handleItemDoubleClick}
          onContextMenu={handleItemContextMenu}
          viewMode={viewMode}
          isSelected={selectedItems.has(item.id)}
          onSelect={handleItemSelect}
          searchQuery={searchQuery}
          dragProps={dragProps?.(item)}
          dropProps={dropProps?.(item.id, item.type, [item.id])}
          isDragOver={isDragOver?.(item.id)}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-1 p-2">
      {sortedItems.map((item) => (
        <FileExplorerItem
          key={item.id}
          item={item}
          isExpanded={expandedFolders.has(item.id)}
          onToggleFolder={onToggleFolder}
          onDoubleClick={handleItemDoubleClick}
          onContextMenu={handleItemContextMenu}
          viewMode={viewMode}
          isSelected={selectedItems.has(item.id)}
          onSelect={handleItemSelect}
          searchQuery={searchQuery}
          dragProps={dragProps?.(item)}
          dropProps={dropProps?.(item.id, item.type, [item.id])}
          isDragOver={isDragOver?.(item.id)}
        />
      ))}
    </div>
  );

  const renderDetailsView = () => (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        <div className="w-6"></div>
        <div className="w-6"></div>
        <div className="flex-1">Name</div>
        <div className="w-20 text-right">Size</div>
        <div className="w-32 text-right">Modified</div>
        <div className="w-20 text-right">Type</div>
      </div>
      
      {/* Items */}
      <div className="space-y-1">
        {sortedItems.map((item) => (
          <FileExplorerItem
            key={item.id}
            item={item}
            isExpanded={expandedFolders.has(item.id)}
            onToggleFolder={onToggleFolder}
            onDoubleClick={handleItemDoubleClick}
            onContextMenu={handleItemContextMenu}
            viewMode={viewMode}
            isSelected={selectedItems.has(item.id)}
            onSelect={handleItemSelect}
            searchQuery={searchQuery}
            dragProps={dragProps?.(item)}
            dropProps={dropProps?.(item.id, item.type, [item.id])}
            isDragOver={isDragOver?.(item.id)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className="flex-1 overflow-y-auto"
      onContextMenu={items.length === 0 ? onEmptyContextMenu : undefined}
    >
      {viewMode === 'grid' ? renderGridView() : 
       viewMode === 'details' ? renderDetailsView() : 
       renderListView()}
    </div>
  );
});

FileExplorerList.displayName = 'FileExplorerList';

export { FileExplorerList };

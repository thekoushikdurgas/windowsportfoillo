'use client';

import { memo, useCallback } from 'react';
import { FileSystemItem } from '@/types/filesystem';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  Presentation,
  FileType
} from 'lucide-react';

interface FileExplorerItemProps {
  item: FileSystemItem;
  isExpanded: boolean;
  onToggleFolder: (itemId: string) => void;
  onDoubleClick: (item: FileSystemItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileSystemItem) => void;
  viewMode: 'list' | 'grid' | 'details';
  isSelected?: boolean;
  onSelect?: (itemId: string, selected: boolean) => void;
  searchQuery?: string;
  dragProps?: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
  } | undefined;
  dropProps?: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  } | undefined;
  isDragOver?: boolean | undefined;
}

const FileExplorerItem = memo(({
  item,
  isExpanded,
  onToggleFolder,
  onDoubleClick,
  onContextMenu,
  viewMode,
  isSelected = false,
  onSelect,
  searchQuery = '',
  dragProps,
  dropProps,
  isDragOver = false,
}: FileExplorerItemProps) => {
  const handleToggleFolder = useCallback(() => {
    onToggleFolder(item.id);
  }, [item.id, onToggleFolder]);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick(item);
  }, [item, onDoubleClick]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    onContextMenu(e, item);
  }, [item, onContextMenu]);

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect?.(item.id, !isSelected);
  }, [item.id, isSelected, onSelect]);

  const getFileIcon = useCallback((item: FileSystemItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-5 h-5 text-blue-500" />;
    }

    const extension = item.name.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return <FileImage className="w-5 h-5 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
        return <FileVideo className="w-5 h-5 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return <FileAudio className="w-5 h-5 text-pink-500" />;
      case 'txt':
      case 'md':
      case 'rtf':
        return <FileText className="w-5 h-5 text-gray-500" />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'scss':
      case 'json':
      case 'xml':
        return <FileCode className="w-5 h-5 text-orange-500" />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <FileArchive className="w-5 h-5 text-yellow-500" />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      case 'pptx':
      case 'ppt':
        return <Presentation className="w-5 h-5 text-red-500" />;
      case 'pdf':
        return <FileType className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  }, []);

  const formatFileSize = useCallback((size?: number) => {
    if (!size) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }, []);

  const formatDate = useCallback((date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }, []);

  const highlightSearchText = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part) => 
      regex.test(part) ? (
        <mark key={part} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  }, []);

  const renderListView = () => (
    <div
      className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
        isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
      } ${isDragOver ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500' : ''}`}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...dragProps}
      {...dropProps}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="w-4 h-4"
          aria-label={`Select ${item.name}`}
          title={`Select ${item.name}`}
        />
      )}
      
      {item.type === 'folder' ? (
        <button
          onClick={handleToggleFolder}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      ) : (
        <div className="w-6" />
      )}
      
      {getFileIcon(item)}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {highlightSearchText(item.name, searchQuery)}
        </div>
        {viewMode === 'details' && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(item.size)} • {formatDate(item.modified)}
          </div>
        )}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div
      className={`flex flex-col items-center p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
        isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
      } ${isDragOver ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500' : ''}`}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...dragProps}
      {...dropProps}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="absolute top-2 left-2 w-4 h-4"
          aria-label={`Select ${item.name}`}
          title={`Select ${item.name}`}
        />
      )}
      
      <div className="relative mb-2">
        {getFileIcon(item)}
        {item.type === 'folder' && (
          <button
            onClick={handleToggleFolder}
            className="absolute -top-1 -left-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full bg-white dark:bg-gray-800"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      
      <div className="text-center">
        <div className="text-xs font-medium truncate max-w-20">
          {highlightSearchText(item.name, searchQuery)}
        </div>
        {viewMode === 'details' && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatFileSize(item.size)}
          </div>
        )}
      </div>
    </div>
  );

  const renderDetailsView = () => (
    <div
      className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
        isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
      } ${isDragOver ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500' : ''}`}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      {...dragProps}
      {...dropProps}
    >
      {onSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="w-4 h-4"
          aria-label={`Select ${item.name}`}
          title={`Select ${item.name}`}
        />
      )}
      
      {item.type === 'folder' ? (
        <button
          onClick={handleToggleFolder}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      ) : (
        <div className="w-6" />
      )}
      
      {getFileIcon(item)}
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {highlightSearchText(item.name, searchQuery)}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 w-20 text-right">
        {formatFileSize(item.size)}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 w-32 text-right">
        {formatDate(item.modified)}
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 w-20 text-right">
        {item.type === 'folder' ? 'Folder' : 'File'}
      </div>
    </div>
  );

  if (viewMode === 'grid') {
    return renderGridView();
  }

  if (viewMode === 'details') {
    return renderDetailsView();
  }

  return renderListView();
});

FileExplorerItem.displayName = 'FileExplorerItem';

export { FileExplorerItem };

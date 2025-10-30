'use client';

import { memo } from 'react';

interface FileExplorerStatusBarProps {
  totalItems: number;
  selectedItems: number;
  folders: number;
  files: number;
  totalSize: number;
  currentPath: string[];
}

const FileExplorerStatusBar = memo(({
  totalItems,
  selectedItems,
  folders,
  files,
  totalSize,
  currentPath,
}: FileExplorerStatusBarProps) => {
  const formatSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const getPathDisplay = () => {
    if (currentPath.length === 0) return 'This PC';
    return currentPath.join(' > ');
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <span>
          {selectedItems > 0 ? `${selectedItems} of ` : ''}{totalItems} items
        </span>
        {folders > 0 && (
          <span>
            {folders} folder{folders !== 1 ? 's' : ''}
          </span>
        )}
        {files > 0 && (
          <span>
            {files} file{files !== 1 ? 's' : ''}
          </span>
        )}
        {totalSize > 0 && (
          <span>
            {formatSize(totalSize)} total
          </span>
        )}
      </div>
      <div className="truncate max-w-96">
        {getPathDisplay()}
      </div>
    </div>
  );
});

FileExplorerStatusBar.displayName = 'FileExplorerStatusBar';

export { FileExplorerStatusBar };

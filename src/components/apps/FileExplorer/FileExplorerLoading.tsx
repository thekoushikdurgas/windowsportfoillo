'use client';

import { memo } from 'react';

const FileExplorerLoading = memo(() => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
});

FileExplorerLoading.displayName = 'FileExplorerLoading';

export { FileExplorerLoading };

'use client';

import { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { FileSystemItem } from '@/types/filesystem';
import { X, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface FileExplorerPreviewProps {
  item: FileSystemItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (item: FileSystemItem) => void;
}

const FileExplorerPreview = memo(({
  item,
  isOpen,
  onClose,
  onDownload,
}: FileExplorerPreviewProps) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleDownload = useCallback(() => {
    if (item && onDownload) {
      onDownload(item);
    }
  }, [item, onDownload]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  const getFileExtension = useCallback((filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  }, []);

  const renderPreview = useCallback(() => {
    if (!item) return null;

    const extension = getFileExtension(item.name);

    // Image preview
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return (
        <div className="flex items-center justify-center h-full">
          <Image
            src={item.content || '/placeholder-image.png'}
            alt={item.name}
            width={400}
            height={300}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.png';
            }}
          />
        </div>
      );
    }

    // Video preview
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
      return (
        <div className="flex items-center justify-center h-full">
          <video
            src={item.content}
            controls
            className="max-w-full max-h-full"
            onError={(e) => {
              logger.error('Video preview error', { error: e });
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Text preview
    if (['txt', 'md', 'rtf', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml'].includes(extension)) {
      return (
        <div className="h-full overflow-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono p-4">
            {item.content || 'No content available'}
          </pre>
        </div>
      );
    }

    // Default preview
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">📄</div>
        <div className="text-lg font-medium">{item.name}</div>
        <div className="text-sm mt-2">
          {item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Unknown size'}
        </div>
        <div className="text-xs mt-1">
          {item.modified ? new Date(item.modified).toLocaleDateString() : 'Unknown date'}
        </div>
      </div>
    );
  }, [item, getFileExtension]);

  if (!isOpen || !item) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isMaximized ? 'p-0' : 'p-8'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${isMaximized ? 'w-full h-full' : 'w-4/5 h-4/5'} flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium truncate">{item.name}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Unknown size'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMaximize}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
});

FileExplorerPreview.displayName = 'FileExplorerPreview';

export { FileExplorerPreview };

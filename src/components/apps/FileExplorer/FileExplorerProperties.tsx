'use client';

import { memo, useCallback } from 'react';
import { FileSystemItem } from '@/types/filesystem';
import { X, File, Folder, HardDrive, Shield, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileExplorerPropertiesProps {
  item: FileSystemItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRename?: (item: FileSystemItem, newName: string) => void;
}

const FileExplorerProperties = memo(({
  item,
  isOpen,
  onClose,
  onRename,
}: FileExplorerPropertiesProps) => {
  const formatFileSize = useCallback((size?: number) => {
    if (!size) return '0 B';
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
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }, []);

  const getFileIcon = useCallback((item: FileSystemItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  }, []);

  const getFileType = useCallback((item: FileSystemItem) => {
    if (item.type === 'folder') {
      return 'Folder';
    }
    const extension = item.name.split('.').pop()?.toUpperCase();
    return extension ? `${extension} File` : 'File';
  }, []);

  const getMimeType = useCallback((item: FileSystemItem) => {
    if (item.type === 'folder') {
      return 'folder/directory';
    }
    
    const extension = item.name.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'txt': 'text/plain',
      'md': 'text/markdown',
      'js': 'application/javascript',
      'ts': 'application/typescript',
      'jsx': 'application/javascript',
      'tsx': 'application/typescript',
      'html': 'text/html',
      'css': 'text/css',
      'json': 'application/json',
      'xml': 'application/xml',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg',
      'pdf': 'application/pdf',
    };
    
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }, []);

  const handleRename = useCallback((newName: string) => {
    if (item && onRename && newName.trim() && newName !== item.name) {
      onRename(item, newName.trim());
    }
  }, [item, onRename]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Properties</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* File Icon and Name */}
          <div className="flex items-center gap-4">
            {getFileIcon(item)}
            <div className="flex-1">
              <Label htmlFor="file-name" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Name
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="file-name"
                  value={item.name}
                  onChange={() => {
                    // This would need to be handled by parent component
                    // For now, just display the name
                  }}
                  className="flex-1"
                />
                {onRename && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRename(item.name)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Properties */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Type
                </Label>
                <p className="text-sm mt-1">{getFileType(item)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Size
                </Label>
                <p className="text-sm mt-1">{formatFileSize(item.size)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Created
                </Label>
                <p className="text-sm mt-1">{formatDate(item.created)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Modified
                </Label>
                <p className="text-sm mt-1">{formatDate(item.modified)}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Technical Details</h4>
            
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                MIME Type
              </Label>
              <p className="text-sm mt-1 font-mono">{getMimeType(item)}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ID
              </Label>
              <p className="text-xs mt-1 font-mono">{item.id}</p>
            </div>

            {item.content && (
              <div>
                <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Content Length
                </Label>
                <p className="text-sm mt-1">{item.content.length} characters</p>
              </div>
            )}
          </div>

          {/* Permissions */}
          {item.permissions && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Read</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    item.permissions.read 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {item.permissions.read ? 'Allowed' : 'Denied'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Write</span>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    item.permissions.write 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {item.permissions.write ? 'Allowed' : 'Denied'}
                  </span>
                </div>

                {item.type === 'folder' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Execute</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      item.permissions.execute 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {item.permissions.execute ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Children Count for Folders */}
          {item.type === 'folder' && item.children && (
            <div>
              <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Items
              </Label>
              <p className="text-sm mt-1">
                {item.children.length} item{item.children.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
});

FileExplorerProperties.displayName = 'FileExplorerProperties';

export { FileExplorerProperties };

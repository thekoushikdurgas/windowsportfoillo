'use client';

import { memo, useState, useCallback, useEffect } from 'react';
import { FileSystemItem } from '@/types/filesystem';
import { X, Archive, FolderOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { compressionManager, CompressionOptions } from '@/lib/compression';

interface FileExplorerCompressionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: FileSystemItem[];
  onCompress: (items: FileSystemItem[], options: CompressionOptions) => void;
  onExtract: (archiveItem: FileSystemItem) => void;
  archiveItem?: FileSystemItem | null;
  mode: 'compress' | 'extract';
}

const FileExplorerCompressionDialog = memo(({
  isOpen,
  onClose,
  selectedItems,
  onCompress,
  onExtract,
  archiveItem,
  mode,
}: FileExplorerCompressionDialogProps) => {
  const [archiveName, setArchiveName] = useState('');
  const [compressionOptions, setCompressionOptions] = useState<CompressionOptions>({
    format: 'zip',
    compressionLevel: 6,
    includeHidden: false,
    excludePatterns: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'compress') {
        setArchiveName(`archive_${Date.now()}.zip`);
      } else {
        setArchiveName(archiveItem?.name || '');
      }
    }
  }, [isOpen, mode, archiveItem]);

  const handleCompress = useCallback(async () => {
    if (selectedItems.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    try {
      await onCompress(selectedItems, compressionOptions);
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);
    } catch (error) {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  }, [selectedItems, compressionOptions, onCompress, onClose]);

  const handleExtract = useCallback(async () => {
    if (!archiveItem) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);
    
    try {
      await onExtract(archiveItem);
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);
    } catch (error) {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  }, [archiveItem, onExtract, onClose]);

  const handleFormatChange = useCallback((format: string) => {
    setCompressionOptions(prev => ({
      ...prev,
      format: format as 'zip' | 'tar' | 'gzip'
    }));
    
    // Update archive name extension
    const baseName = archiveName.split('.')[0];
    setArchiveName(`${baseName}.${format}`);
  }, [archiveName]);

  const supportedFormats = compressionManager.getSupportedFormats();
  const compressionLevels = compressionManager.getCompressionLevels();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {mode === 'compress' ? (
              <Archive className="w-5 h-5 text-blue-500" />
            ) : (
              <FolderOpen className="w-5 h-5 text-green-500" />
            )}
            <h3 className="text-lg font-medium">
              {mode === 'compress' ? 'Compress Files' : 'Extract Archive'}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {mode === 'compress' ? (
            <>
              {/* Archive Name */}
              <div>
                <Label htmlFor="archive-name" className="text-sm font-medium">
                  Archive Name
                </Label>
                <Input
                  id="archive-name"
                  value={archiveName}
                  onChange={(e) => setArchiveName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter archive name"
                />
              </div>

              {/* Compression Format */}
              <div>
                <Label className="text-sm font-medium">Format</Label>
                <Select
                  value={compressionOptions.format}
                  onValueChange={handleFormatChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map(format => (
                      <SelectItem key={format} value={format}>
                        {format.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Compression Level */}
              <div>
                <Label className="text-sm font-medium">Compression Level</Label>
                <Select
                  value={compressionOptions.compressionLevel.toString()}
                  onValueChange={(value) => setCompressionOptions(prev => ({
                    ...prev,
                    compressionLevel: parseInt(value)
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {compressionLevels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-hidden"
                    checked={compressionOptions.includeHidden}
                    onCheckedChange={(checked) => setCompressionOptions(prev => ({
                      ...prev,
                      includeHidden: checked as boolean
                    }))}
                  />
                  <Label htmlFor="include-hidden" className="text-sm">
                    Include hidden files
                  </Label>
                </div>
              </div>

              {/* Selected Items Info */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </p>
                <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                  {selectedItems.slice(0, 5).map(item => (
                    <p key={item.id} className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type === 'folder' ? '📁' : '📄'} {item.name}
                    </p>
                  ))}
                  {selectedItems.length > 5 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ... and {selectedItems.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Archive Info */}
              {archiveItem && (
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{archiveItem.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Size: {(archiveItem.size || 0 / 1024).toFixed(1)} KB</p>
                    <p>Modified: {archiveItem.modified?.toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {/* Extraction Options */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="preserve-structure"
                    defaultChecked
                  />
                  <Label htmlFor="preserve-structure" className="text-sm">
                    Preserve folder structure
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite-existing"
                    defaultChecked={false}
                  />
                  <Label htmlFor="overwrite-existing" className="text-sm">
                    Overwrite existing files
                  </Label>
                </div>
              </div>
            </>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {mode === 'compress' ? 'Compressing...' : 'Extracting...'}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={mode === 'compress' ? handleCompress : handleExtract}
            disabled={isProcessing || (mode === 'compress' && selectedItems.length === 0)}
          >
            {isProcessing ? (
              <>
                <Settings className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : mode === 'compress' ? (
              <>
                <Archive className="w-4 h-4 mr-2" />
                Compress
              </>
            ) : (
              <>
                <FolderOpen className="w-4 h-4 mr-2" />
                Extract
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

FileExplorerCompressionDialog.displayName = 'FileExplorerCompressionDialog';

export { FileExplorerCompressionDialog };

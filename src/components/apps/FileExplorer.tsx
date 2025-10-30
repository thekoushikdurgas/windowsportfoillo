'use client';

import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { useDesktop } from '@/context/DesktopContext';
import { FileSystemItem } from '@/types/filesystem';
import { ContextMenu } from '@/components/shared/ContextMenu';
import { useContextMenu } from '@/hooks/use-context-menu';
import { useFileSystem } from '@/hooks/use-file-system';
import { FileOperationDialog } from '@/components/shared/FileOperationDialog';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { FileExplorerToolbar } from './FileExplorer/FileExplorerToolbar';
import { FileExplorerList } from './FileExplorer/FileExplorerList';
import { FileExplorerLoading } from './FileExplorer/FileExplorerLoading';
import { FileExplorerPreview } from './FileExplorer/FileExplorerPreview';
import { FileExplorerStatusBar } from './FileExplorer/FileExplorerStatusBar';
import { FileExplorerProperties } from './FileExplorer/FileExplorerProperties';
import { FileExplorerCompressionDialog } from './FileExplorer/FileExplorerCompressionDialog';
import { useDragDrop } from '@/hooks/use-drag-drop';
import { compressionManager, CompressionOptions } from '@/lib/compression';
import { logger } from '@/lib/logger';

// Constants for better performance
const DEFAULT_DIALOG_STATE = {
  isOpen: false,
  type: 'folder' as const,
  operation: 'create' as const,
};

const FILE_EXTENSIONS = {
  txt: 'notepad',
  mp4: 'video',
} as const;

const FileExplorer = memo(() => {
  const { openApp } = useDesktop();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'details'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [previewItem, setPreviewItem] = useState<FileSystemItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [propertiesItem, setPropertiesItem] = useState<FileSystemItem | null>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [showCompressionDialog, setShowCompressionDialog] = useState(false);
  const [compressionMode, setCompressionMode] = useState<'compress' | 'extract'>('compress');
  const [archiveItem, setArchiveItem] = useState<FileSystemItem | null>(null);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: 'file' | 'folder';
    operation: 'create' | 'rename';
    currentName?: string;
    targetPath?: string[];
  }>(DEFAULT_DIALOG_STATE);

  const {
    fileSystem,
    error: fileSystemError,
    loading,
    createItem,
    deleteItem,
    renameItem,
    moveItem,
    copyItem,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
    canPaste,
    undoLastOperation,
    getOperations,
  } = useFileSystem();

  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const { handleError, handleAsyncError } = useErrorHandler();

  // Drag and drop functionality
  const handleDragMove = useCallback(async (draggedItem: FileSystemItem, targetPath: string[]) => {
    const sourcePath = [...currentPath, draggedItem.id];
    await handleAsyncError(
      () => moveItem(sourcePath, targetPath),
      'Move item'
    );
  }, [currentPath, handleAsyncError, moveItem]);

  const handleDragCopy = useCallback(async (draggedItem: FileSystemItem, targetPath: string[]) => {
    const sourcePath = [...currentPath, draggedItem.id];
    await handleAsyncError(
      () => copyItem(sourcePath, targetPath),
      'Copy item'
    );
  }, [currentPath, handleAsyncError, copyItem]);

  const { dragState, getDragProps, getDropProps, getContainerProps } = useDragDrop({
    onDrop: handleDragMove,
    onMove: handleDragMove,
    onCopy: handleDragCopy,
  });

  const getCurrentItems = useCallback((): FileSystemItem[] => {
    let current = fileSystem;
    for (const pathSegment of currentPath) {
      const item = current.find(item => item.id === pathSegment);
      if (item && item.children) {
        current = item.children;
      } else {
        return [];
      }
    }
    return current;
  }, [fileSystem, currentPath]);

  const getFilteredItems = useCallback((): FileSystemItem[] => {
    const items = getCurrentItems();
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.type === 'file' && item.content?.toLowerCase().includes(query))
    );
  }, [getCurrentItems, searchQuery]);

  const handleSearch = useCallback(() => {
    // Search is already handled by getFilteredItems
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSelectedItems(new Set());
  }, []);

  const handleItemSelect = useCallback((itemId: string, selected: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  const handleRefresh = useCallback(() => {
    // Refresh is handled by the file system hook
    setSelectedItems(new Set());
  }, []);

  const handlePreview = useCallback((item: FileSystemItem) => {
    setPreviewItem(item);
    setShowPreview(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewItem(null);
  }, []);

  const handleDownloadPreview = useCallback((item: FileSystemItem) => {
    try {
      const blob = new Blob([item.content || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      handleError(error as Error, 'Download file');
    }
  }, [handleError]);

  const handleShowProperties = useCallback((item: FileSystemItem) => {
    setPropertiesItem(item);
    setShowProperties(true);
  }, []);

  const handleCloseProperties = useCallback(() => {
    setShowProperties(false);
    setPropertiesItem(null);
  }, []);

  const handleRenameProperties = useCallback(async (item: FileSystemItem, newName: string) => {
    const itemPath = [...currentPath, item.id];
    await handleAsyncError(
      () => renameItem(itemPath, newName),
      'Rename item'
    );
  }, [currentPath, renameItem, handleAsyncError]);

  const handleUndo = useCallback(async () => {
    await handleAsyncError(
      () => undoLastOperation(),
      'Undo operation'
    );
  }, [undoLastOperation, handleAsyncError]);

  const canUndo = useMemo(() => {
    return getOperations().length > 0;
  }, [getOperations]);

  // Compression handlers
  const handleCompress = useCallback(async (items: FileSystemItem[], options: CompressionOptions) => {
    try {
      const result = await compressionManager.compressItems(items, currentPath, options);
      if (result.success) {
        // Create the archive file in the current directory
        const archiveItem: FileSystemItem = {
          id: `archive_${Date.now()}`,
          name: result.archivePath || 'archive.zip',
          type: 'file',
          content: `Compressed archive containing ${items.length} items`,
          size: result.archiveSize || 0,
          created: new Date(),
          modified: new Date(),
          permissions: { read: true, write: true, execute: false }
        };
        
        // Add to file system (this would normally be handled by the file system manager)
        logger.info('Archive created', { archiveItem });
        handleRefresh();
      } else {
        handleError(new Error(result.error || 'Compression failed'), 'Compression');
      }
    } catch (error) {
      handleError(error as Error, 'Compression');
    }
  }, [currentPath, handleRefresh, handleError]);

  const handleExtract = useCallback(async (item: FileSystemItem) => {
    try {
      const result = await compressionManager.extractArchive(item, currentPath);
      if (result.success && result.extractedItems) {
        // Add extracted items to file system (this would normally be handled by the file system manager)
        logger.info('Extracted items', { extractedItems: result.extractedItems });
        handleRefresh();
      } else {
        handleError(new Error(result.error || 'Extraction failed'), 'Extraction');
      }
    } catch (error) {
      handleError(error as Error, 'Extraction');
    }
  }, [currentPath, handleRefresh, handleError]);

  const handleShowCompressionDialog = useCallback((mode: 'compress' | 'extract', item?: FileSystemItem) => {
    setCompressionMode(mode);
    setArchiveItem(item || null);
    setShowCompressionDialog(true);
  }, []);

  const handleCloseCompressionDialog = useCallback(() => {
    setShowCompressionDialog(false);
    setArchiveItem(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (canUndo) {
              handleUndo();
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, canUndo]);

  const toggleFolder = useCallback((itemId: string) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      return newExpanded;
    });
  }, []);

  const navigateToFolder = useCallback((itemId: string) => {
    setCurrentPath(prev => [...prev, itemId]);
  }, []);

  const navigateUp = useCallback(() => {
    setCurrentPath(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
  }, []);

  const getFileExtension = useCallback((filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  }, []);

  const openFile = useCallback((item: FileSystemItem) => {
    if (item.type === 'file') {
      const extension = getFileExtension(item.name);
      const appType = FILE_EXTENSIONS[extension as keyof typeof FILE_EXTENSIONS];
      if (appType) {
        const content = item.content || '';
        openApp(appType, appType === 'notepad' ? { content } : { url: content });
      } else {
        // For files without specific app associations, show preview
        handlePreview(item);
      }
    }
  }, [getFileExtension, openApp, handlePreview]);

  const handleContextAction = useCallback(async (action: string, data?: unknown) => {
    hideContextMenu();

    try {
      switch (action) {
        case 'new-folder':
          setDialogState({
            isOpen: true,
            type: 'folder',
            operation: 'create',
            targetPath: currentPath,
          });
          break;

        case 'new-file':
          setDialogState({
            isOpen: true,
            type: 'file',
            operation: 'create',
            targetPath: currentPath,
          });
          break;

        case 'open':
          if (data && typeof data === 'object' && 'type' in data && 'id' in data) {
            const dataObj = data as Record<string, unknown>;
            if (dataObj['type'] === 'folder' && typeof dataObj['id'] === 'string') {
              navigateToFolder(dataObj['id']);
            } else {
              const fileItem: FileSystemItem = {
                id: String(dataObj['id'] || ''),
                name: String(dataObj['name'] || ''),
                type: (dataObj['type'] === 'folder' ? 'folder' : 'file') as 'file' | 'folder',
                content: String(dataObj['content'] || ''),
                children: Array.isArray(dataObj['children']) ? dataObj['children'] as FileSystemItem[] : [],
                size: Number(dataObj['size'] || 0),
                created: dataObj['created'] instanceof Date ? dataObj['created'] : new Date(),
                modified: dataObj['modified'] instanceof Date ? dataObj['modified'] : new Date(),
                permissions: {
                  read: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['read'] ?? true),
                  write: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['write'] ?? true),
                  execute: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['execute'] ?? false),
                },
              };
              openFile(fileItem);
            }
          }
          break;

        case 'edit':
          if (data && typeof data === 'object' && 'type' in data && data['type'] === 'file') {
            const dataObj = data as Record<string, unknown>;
            const fileItem: FileSystemItem = {
              id: String(dataObj['id'] || ''),
              name: String(dataObj['name'] || ''),
              type: 'file' as const,
              content: String(dataObj['content'] || ''),
              children: [],
              size: Number(dataObj['size'] || 0),
              created: dataObj['created'] instanceof Date ? dataObj['created'] : new Date(),
              modified: dataObj['modified'] instanceof Date ? dataObj['modified'] : new Date(),
              permissions: {
                read: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['read'] ?? true),
                write: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['write'] ?? true),
                execute: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['execute'] ?? false),
              },
            };
            openFile(fileItem);
          }
          break;

        case 'copy':
          if (data && typeof data === 'object' && 'id' in data && typeof data['id'] === 'string') {
            const itemPath = [...currentPath, String(data['id'])];
            await handleAsyncError(
              () => copyToClipboard(itemPath),
              'Copy to clipboard'
            );
          }
          break;

        case 'cut':
          if (data && typeof data === 'object' && 'id' in data && typeof data['id'] === 'string') {
            const itemPath = [...currentPath, String(data['id'])];
            await handleAsyncError(
              () => cutToClipboard(itemPath),
              'Cut to clipboard'
            );
          }
          break;

        case 'paste':
          if (canPaste()) {
            await handleAsyncError(
              () => pasteFromClipboard(currentPath),
              'Paste from clipboard'
            );
          }
          break;

        case 'delete':
          if (data && typeof data === 'object' && 'id' in data && typeof data['id'] === 'string') {
            const dataObj = data as Record<string, unknown>;
            const itemPath = [...currentPath, String(data['id'])];
            const itemName = String(dataObj['name'] || 'item');
            if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
              await handleAsyncError(
                () => deleteItem(itemPath),
                'Delete item'
              );
            }
          }
          break;

        case 'rename':
          if (data && typeof data === 'object' && 'id' in data && typeof data['id'] === 'string') {
            const dataObj = data as Record<string, unknown>;
            setDialogState({
              isOpen: true,
              type: (dataObj['type'] === 'folder' ? 'folder' : 'file') as 'file' | 'folder',
              operation: 'rename',
              currentName: String(dataObj['name'] || ''),
              targetPath: [...currentPath, String(data['id'])],
            });
          }
          break;

        case 'download':
          if (data && typeof data === 'object' && 'type' in data && data['type'] === 'file' && 'content' in data) {
            const dataObj = data as Record<string, unknown>;
            try {
              const blob = new Blob([String(dataObj['content'] || '')], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = String(dataObj['name'] || 'file.txt');
              a.click();
              URL.revokeObjectURL(url);
            } catch (error) {
              handleError(error as Error, 'Download file');
            }
          }
          break;

        case 'properties':
          if (data && typeof data === 'object' && 'id' in data && 'name' in data && 'type' in data) {
            const dataObj = data as Record<string, unknown>;
            const fileItem: FileSystemItem = {
              id: String(dataObj['id'] || ''),
              name: String(dataObj['name'] || ''),
              type: (dataObj['type'] === 'folder' ? 'folder' : 'file') as 'file' | 'folder',
              content: String(dataObj['content'] || ''),
              children: Array.isArray(dataObj['children']) ? dataObj['children'] as FileSystemItem[] : [],
              size: Number(dataObj['size'] || 0),
              created: dataObj['created'] instanceof Date ? dataObj['created'] : new Date(),
              modified: dataObj['modified'] instanceof Date ? dataObj['modified'] : new Date(),
              permissions: {
                read: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['read'] ?? true),
                write: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['write'] ?? true),
                execute: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['execute'] ?? false),
              },
            };
            handleShowProperties(fileItem);
          }
          break;

        case 'compress':
          if (selectedItems.size > 0) {
            handleShowCompressionDialog('compress', undefined);
          }
          break;

        case 'extract':
          if (data && typeof data === 'object' && 'id' in data && 'name' in data && 'type' in data) {
            const dataObj = data as Record<string, unknown>;
            const fileItem: FileSystemItem = {
              id: String(dataObj['id'] || ''),
              name: String(dataObj['name'] || ''),
              type: (dataObj['type'] === 'folder' ? 'folder' : 'file') as 'file' | 'folder',
              content: String(dataObj['content'] || ''),
              children: Array.isArray(dataObj['children']) ? dataObj['children'] as FileSystemItem[] : [],
              size: Number(dataObj['size'] || 0),
              created: dataObj['created'] instanceof Date ? dataObj['created'] : new Date(),
              modified: dataObj['modified'] instanceof Date ? dataObj['modified'] : new Date(),
              permissions: {
                read: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['read'] ?? true),
                write: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['write'] ?? true),
                execute: Boolean((dataObj['permissions'] as Record<string, unknown>)?.['execute'] ?? false),
              },
            };
            if (compressionManager.validateArchive(fileItem)) {
              handleShowCompressionDialog('extract', fileItem);
            }
          }
          break;

        default:
          // Unknown action handled
      }
    } catch (error) {
      handleError(error as Error, `File operation: ${action}`);
    }
  }, [currentPath, handleShowCompressionDialog, handleShowProperties, hideContextMenu, handleError, handleAsyncError, navigateToFolder, openFile, copyToClipboard, cutToClipboard, pasteFromClipboard, canPaste, deleteItem, selectedItems.size]);

  const handleDialogConfirm = useCallback(async (name: string) => {
    if (!dialogState.targetPath) return;

    try {
      if (dialogState.operation === 'create') {
        await handleAsyncError(
          () => createItem(dialogState.type, name, dialogState.targetPath || []),
          `Create ${dialogState.type}`
        );
      } else if (dialogState.operation === 'rename') {
        await handleAsyncError(
          () => renameItem(dialogState.targetPath || [], name),
          'Rename item'
        );
      }

      setDialogState(DEFAULT_DIALOG_STATE);
    } catch (error) {
      handleError(error as Error, `Dialog operation: ${dialogState.operation}`);
    }
  }, [dialogState, createItem, renameItem, handleError, handleAsyncError]);

  const currentItems = useMemo(() => getFilteredItems(), [getFilteredItems]);

  const statusBarData = useMemo(() => {
    const items = getCurrentItems();
    const folders = items.filter(item => item.type === 'folder').length;
    const files = items.filter(item => item.type === 'file').length;
    const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0);
    
    return {
      totalItems: items.length,
      selectedItems: selectedItems.size,
      folders,
      files,
      totalSize,
      currentPath,
    };
  }, [getCurrentItems, selectedItems, currentPath]);

  const handleItemDoubleClick = useCallback((item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      openFile(item);
    }
  }, [navigateToFolder, openFile]);

  const handleItemContextMenu = useCallback((e: React.MouseEvent, item: FileSystemItem) => {
    showContextMenu(e, item.type, {
      id: item.id,
      name: item.name,
      type: item.type,
    });
  }, [showContextMenu]);

  const handleEmptyContextMenu = useCallback((e: React.MouseEvent) => {
    showContextMenu(e, 'empty');
  }, [showContextMenu]);

  const handleDialogClose = useCallback(() => {
    setDialogState(DEFAULT_DIALOG_STATE);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <FileExplorerToolbar
        currentPath={currentPath}
        onNavigateUp={navigateUp}
        onRefresh={handleRefresh}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onUndo={handleUndo}
        canUndo={canUndo}
      />

      {/* File List */}
      <div {...getContainerProps()}>
        <FileExplorerList
          items={currentItems}
          expandedFolders={expandedFolders}
          onToggleFolder={toggleFolder}
          onItemDoubleClick={handleItemDoubleClick}
          onItemContextMenu={handleItemContextMenu}
          onEmptyContextMenu={handleEmptyContextMenu}
          viewMode={viewMode}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          searchQuery={searchQuery}
          sortBy={sortBy}
          sortOrder={sortOrder}
          dragProps={getDragProps}
          dropProps={getDropProps}
          isDragOver={(itemId) => dragState.dragOverItem === itemId}
        />
      </div>

      {/* Status Bar */}
      <FileExplorerStatusBar {...statusBarData} />

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={hideContextMenu}
          onAction={handleContextAction}
          type={contextMenu.type}
          item={contextMenu.item || undefined}
        />
      )}

      {/* File Operation Dialog */}
      <FileOperationDialog
        isOpen={dialogState.isOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        type={dialogState.type}
        operation={dialogState.operation}
        currentName={dialogState.currentName || ''}
        error={fileSystemError}
      />

      {/* File Preview */}
      <FileExplorerPreview
        item={previewItem}
        isOpen={showPreview}
        onClose={handleClosePreview}
        onDownload={handleDownloadPreview}
      />

              {/* File Properties */}
              <FileExplorerProperties
                item={propertiesItem}
                isOpen={showProperties}
                onClose={handleCloseProperties}
                onRename={handleRenameProperties}
              />

              {/* Compression Dialog */}
              <FileExplorerCompressionDialog
                isOpen={showCompressionDialog}
                onClose={handleCloseCompressionDialog}
                selectedItems={Array.from(selectedItems).map(id => 
                  currentItems.find(item => item.id === id)
                ).filter(Boolean) as FileSystemItem[]}
                onCompress={handleCompress}
                onExtract={handleExtract}
                archiveItem={archiveItem}
                mode={compressionMode}
              />

              {/* Loading Overlay */}
              {loading && <FileExplorerLoading />}
    </div>
  );
});

FileExplorer.displayName = 'FileExplorer';

export default FileExplorer;

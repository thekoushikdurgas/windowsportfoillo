'use client';

import { useState, useEffect, useCallback } from 'react';
import { fileSystemManager } from '@/lib/filesystem';
import { FileSystemItem, ClipboardItem } from '@/types/filesystem';

export function useFileSystem() {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(fileSystemManager.getFileSystem());
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(fileSystemManager.getClipboard());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Subscribe to file system changes
  useEffect(() => {
    const unsubscribe = fileSystemManager.subscribe(() => {
      setFileSystem(fileSystemManager.getFileSystem());
      setClipboard(fileSystemManager.getClipboard());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const createItem = useCallback(async (
    type: 'file' | 'folder',
    name: string,
    parentPath: string[],
    content?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.createItem(type, name, parentPath, content);
      if (!result.success) {
        showError(result.error || 'Failed to create item');
        return null;
      }
      return result.item;
    } catch (err) {
      showError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const deleteItem = useCallback(async (path: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.deleteItem(path);
      if (!result.success) {
        showError(result.error || 'Failed to delete item');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const renameItem = useCallback(async (path: string[], newName: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.renameItem(path, newName);
      if (!result.success) {
        showError(result.error || 'Failed to rename item');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const moveItem = useCallback(async (fromPath: string[], toPath: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.moveItem(fromPath, toPath);
      if (!result.success) {
        showError(result.error || 'Failed to move item');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const copyItem = useCallback(async (fromPath: string[], toPath: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.copyItem(fromPath, toPath);
      if (!result.success) {
        showError(result.error || 'Failed to copy item');
        return null;
      }
      return result.item;
    } catch (err) {
      showError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateFileContent = useCallback(async (path: string[], content: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.updateFileContent(path, content);
      if (!result.success) {
        showError(result.error || 'Failed to update file content');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Clipboard operations
  const copyToClipboard = useCallback(async (path: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.copyToClipboard(path);
      if (!result.success) {
        showError(result.error || 'Failed to copy to clipboard');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cutToClipboard = useCallback(async (path: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.cutToClipboard(path);
      if (!result.success) {
        showError(result.error || 'Failed to cut to clipboard');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const pasteFromClipboard = useCallback(async (toPath: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.pasteFromClipboard(toPath);
      if (!result.success) {
        showError(result.error || 'Failed to paste from clipboard');
        return null;
      }
      return result.item;
    } catch (err) {
      showError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const clearClipboard = useCallback(() => {
    fileSystemManager.clearClipboard();
  }, []);

  const getItemByPath = useCallback((path: string[]) => {
    return fileSystemManager.getItemByPath(path);
  }, []);

  const canPaste = useCallback(() => {
    return clipboard !== null;
  }, [clipboard]);

  const undoLastOperation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = fileSystemManager.undoLastOperation();
      if (!result.success) {
        showError(result.error || 'Failed to undo operation');
        return false;
      }
      return true;
    } catch (err) {
      showError('An unexpected error occurred during undo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const getOperations = useCallback(() => {
    return fileSystemManager.getOperations();
  }, []);

  return {
    fileSystem,
    clipboard,
    error,
    loading,
    createItem,
    deleteItem,
    renameItem,
    moveItem,
    copyItem,
    updateFileContent,
    copyToClipboard,
    cutToClipboard,
    pasteFromClipboard,
    clearClipboard,
    getItemByPath,
    canPaste,
    undoLastOperation,
    getOperations,
  };
}

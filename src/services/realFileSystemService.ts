import { logger, errorToLogContext } from '../lib/logger';

// File System Access API types
interface FilePickerOptions {
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
  multiple?: boolean;
}

interface DirectoryPickerOptions {
  mode?: 'read' | 'readwrite';
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}

interface ExtendedFileSystemDirectoryHandle extends FileSystemDirectoryHandle {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

interface WindowWithFileSystemAccess extends Window {
  showDirectoryPicker: (options?: DirectoryPickerOptions) => Promise<FileSystemDirectoryHandle>;
  showOpenFilePicker: (options?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
  showSaveFilePicker: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
}

export interface FileSystemEntry {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  lastModified: Date;
  permissions: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
  mimeType?: string;
  thumbnail?: string;
}

export interface FileSystemWatcher {
  id: string;
  path: string;
  onAdd: (entry: FileSystemEntry) => void;
  onRemove: (entry: FileSystemEntry) => void;
  onModify: (entry: FileSystemEntry) => void;
}

export class RealFileSystemService {
  private watchers: Map<string, FileSystemWatcher> = new Map();
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkSupport();
  }

  private checkSupport(): boolean {
    return typeof window !== 'undefined' && 
           'showDirectoryPicker' in window &&
           'showOpenFilePicker' in window &&
           'showSaveFilePicker' in window;
  }

  async selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
    if (!this.isSupported) {
      throw new Error('File System Access API not supported');
    }

    try {
      const directoryHandle = await ((window as unknown) as WindowWithFileSystemAccess).showDirectoryPicker({
        mode: 'readwrite',
      });
      return directoryHandle;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      throw error;
    }
  }

  async selectFile(accept?: Record<string, string[]>): Promise<FileSystemFileHandle | null> {
    if (!this.isSupported) {
      throw new Error('File System Access API not supported');
    }

    try {
      const typesArray = accept ? Object.entries(accept).map(([description, acceptTypes]) => ({
        description,
        accept: { [description]: acceptTypes },
      })) : undefined;
      const fileHandles = await ((window as unknown) as WindowWithFileSystemAccess).showOpenFilePicker({
        ...(typesArray && { types: typesArray }),
        multiple: false,
      });
      return fileHandles[0] || null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      throw error;
    }
  }

  async selectFiles(accept?: Record<string, string[]>): Promise<FileSystemFileHandle[]> {
    if (!this.isSupported) {
      throw new Error('File System Access API not supported');
    }

    try {
      const typesArray = accept ? Object.entries(accept).map(([description, acceptTypes]) => ({
        description,
        accept: { [description]: acceptTypes },
      })) : undefined;
      const fileHandles = await ((window as unknown) as WindowWithFileSystemAccess).showOpenFilePicker({
        ...(typesArray && { types: typesArray }),
        multiple: true,
      });
      return fileHandles;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return [];
      }
      throw error;
    }
  }

  async saveFile(suggestedName?: string, accept?: Record<string, string[]>): Promise<FileSystemFileHandle | null> {
    if (!this.isSupported) {
      throw new Error('File System Access API not supported');
    }

    try {
      const typesArray = accept ? Object.entries(accept).map(([description, acceptTypes]) => ({
        description,
        accept: { [description]: acceptTypes },
      })) : undefined;
      const fileHandle = await ((window as unknown) as WindowWithFileSystemAccess).showSaveFilePicker({
        ...(suggestedName && { suggestedName }),
        ...(typesArray && { types: typesArray }),
      });
      return fileHandle;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      throw error;
    }
  }

  async readFile(fileHandle: FileSystemFileHandle): Promise<File> {
    return await fileHandle.getFile();
  }

  async writeFile(fileHandle: FileSystemFileHandle, content: string | Blob): Promise<void> {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async readDirectory(directoryHandle: FileSystemDirectoryHandle): Promise<FileSystemEntry[]> {
    const entries: FileSystemEntry[] = [];

    for await (const [name, handle] of (directoryHandle as ExtendedFileSystemDirectoryHandle).entries()) {
      const entry: FileSystemEntry = {
        id: `${handle.kind}_${name}_${Date.now()}`,
        name,
        type: handle.kind === 'directory' ? 'directory' : 'file',
        path: name,
        lastModified: new Date(),
        permissions: {
          read: true,
          write: true,
          execute: handle.kind === 'directory',
        },
      };

      if (handle.kind === 'file') {
        const fileHandle = handle as FileSystemFileHandle;
        const file = await fileHandle.getFile();
        entry.size = file.size;
        entry.lastModified = new Date(file.lastModified);
        entry.mimeType = file.type;
      }

      entries.push(entry);
    }

    return entries;
  }

  async createDirectory(parentHandle: FileSystemDirectoryHandle, name: string): Promise<FileSystemDirectoryHandle> {
    return await parentHandle.getDirectoryHandle(name, { create: true });
  }

  async createFile(parentHandle: FileSystemDirectoryHandle, name: string): Promise<FileSystemFileHandle> {
    return await parentHandle.getFileHandle(name, { create: true });
  }

  async deleteEntry(parentHandle: FileSystemDirectoryHandle, name: string): Promise<void> {
    await parentHandle.removeEntry(name, { recursive: true });
  }

  async renameEntry(parentHandle: FileSystemDirectoryHandle, oldName: string, newName: string): Promise<void> {
    // File System Access API doesn't support direct renaming
    // We need to copy and delete
    const oldHandle = await parentHandle.getFileHandle(oldName);
    const newHandle = await parentHandle.getFileHandle(newName, { create: true });
    
    const file = await oldHandle.getFile();
    const writable = await newHandle.createWritable();
    await writable.write(file);
    await writable.close();
    
    await parentHandle.removeEntry(oldName);
  }

  async copyEntry(sourceHandle: FileSystemDirectoryHandle, targetHandle: FileSystemDirectoryHandle, name: string): Promise<void> {
    const sourceFileHandle = await sourceHandle.getFileHandle(name);
    const targetFileHandle = await targetHandle.getFileHandle(name, { create: true });
    
    const file = await sourceFileHandle.getFile();
    const writable = await targetFileHandle.createWritable();
    await writable.write(file);
    await writable.close();
  }

  async moveEntry(sourceHandle: FileSystemDirectoryHandle, targetHandle: FileSystemDirectoryHandle, name: string): Promise<void> {
    await this.copyEntry(sourceHandle, targetHandle, name);
    await sourceHandle.removeEntry(name);
  }

  async getFileInfo(fileHandle: FileSystemFileHandle): Promise<FileSystemEntry> {
    const file = await fileHandle.getFile();
    return {
      id: `file_${file.name}_${Date.now()}`,
      name: file.name,
      type: 'file',
      path: file.name,
      size: file.size,
      lastModified: new Date(file.lastModified),
      permissions: {
        read: true,
        write: true,
        execute: false,
      },
      mimeType: file.type,
    };
  }

  async getDirectoryInfo(directoryHandle: FileSystemDirectoryHandle): Promise<FileSystemEntry> {
    return {
      id: `directory_${Date.now()}`,
      name: directoryHandle.name || 'Unknown',
      type: 'directory',
      path: directoryHandle.name || 'Unknown',
      lastModified: new Date(),
      permissions: {
        read: true,
        write: true,
        execute: true,
      },
    };
  }

  async generateThumbnail(fileHandle: FileSystemFileHandle, maxSize = 200): Promise<string | null> {
    try {
      const file = await fileHandle.getFile();
      if (!file.type.startsWith('image/')) {
        return null;
      }

      return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
          const { width, height } = img;
          const aspectRatio = width / height;
          
          let newWidth = maxSize;
          let newHeight = maxSize;
          
          if (aspectRatio > 1) {
            newHeight = maxSize / aspectRatio;
          } else {
            newWidth = maxSize * aspectRatio;
          }

          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx?.drawImage(img, 0, 0, newWidth, newHeight);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };

        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      logger.error('Thumbnail generation failed:', errorToLogContext(error));
      return null;
    }
  }

  async searchFiles(directoryHandle: FileSystemDirectoryHandle, query: string): Promise<FileSystemEntry[]> {
    const results: FileSystemEntry[] = [];
    
    const searchRecursive = async (handle: FileSystemDirectoryHandle, currentPath = '') => {
      for await (const [name, entryHandle] of (handle as ExtendedFileSystemDirectoryHandle).entries()) {
        const fullPath = currentPath ? `${currentPath}/${name}` : name;
        
        if (name.toLowerCase().includes(query.toLowerCase())) {
          const entry: FileSystemEntry = {
            id: `${entryHandle.kind}_${name}_${Date.now()}`,
            name,
            type: entryHandle.kind === 'directory' ? 'directory' : 'file',
            path: fullPath,
            lastModified: new Date(),
            permissions: {
              read: true,
              write: true,
              execute: entryHandle.kind === 'directory',
            },
          };

          if (entryHandle.kind === 'file') {
            const fileHandle = entryHandle as FileSystemFileHandle;
            const file = await fileHandle.getFile();
            entry.size = file.size;
            entry.lastModified = new Date(file.lastModified);
            entry.mimeType = file.type;
          }

          results.push(entry);
        }

        if (entryHandle.kind === 'directory') {
          await searchRecursive(entryHandle as FileSystemDirectoryHandle, fullPath);
        }
      }
    };

    await searchRecursive(directoryHandle);
    return results;
  }

  async watchDirectory(directoryHandle: FileSystemDirectoryHandle, callback: (entries: FileSystemEntry[]) => void): Promise<string> {
    const watcherId = `watcher_${Date.now()}`;
    
    // Note: File System Access API doesn't support real-time watching
    // This is a placeholder for future implementation
    const watcher: FileSystemWatcher = {
      id: watcherId,
      path: directoryHandle.name || 'Unknown',
      onAdd: () => {
        logger.info(`File added to ${directoryHandle.name}`);
      },
      onRemove: () => {
        logger.info(`File removed from ${directoryHandle.name}`);
      },
      onModify: () => {
        logger.info(`File modified in ${directoryHandle.name}`);
      },
    };

    this.watchers.set(watcherId, watcher);

    // Poll for changes every 5 seconds
    const interval = setInterval(async () => {
      try {
        const entries = await this.readDirectory(directoryHandle);
        callback(entries);
      } catch (error) {
        logger.error('Directory watch error:', errorToLogContext(error));
      }
    }, 5000);

    // Store interval ID for cleanup
    (watcher as FileSystemWatcher & { interval?: NodeJS.Timeout }).interval = interval;

    return watcherId;
  }

  stopWatching(watcherId: string): void {
    const watcher = this.watchers.get(watcherId);
    if (watcher && (watcher as FileSystemWatcher & { interval?: NodeJS.Timeout }).interval) {
      clearInterval((watcher as FileSystemWatcher & { interval?: NodeJS.Timeout }).interval);
    }
    this.watchers.delete(watcherId);
  }

  isFileSystemSupported(): boolean {
    return this.isSupported;
  }

  async getStorageEstimate(): Promise<{ quota: number; usage: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota !== undefined && estimate.usage !== undefined) {
        return { quota: estimate.quota, usage: estimate.usage };
      }
    }
    return null;
  }

  async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      return await navigator.storage.persist();
    }
    return false;
  }
}

// Singleton instance
export const realFileSystem = new RealFileSystemService();

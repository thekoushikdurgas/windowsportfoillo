import { FileSystemItem, FileSystemOperation, ClipboardItem } from '@/types/filesystem';

// File system state management
class FileSystemManager {
  private fileSystem: FileSystemItem[] = [];
  private clipboard: ClipboardItem | null = null;
  private operations: FileSystemOperation[] = [];
  private listeners: Set<() => void> = new Set();

  constructor(initialFileSystem: FileSystemItem[]) {
    this.fileSystem = this.deepClone(initialFileSystem);
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getFileSystem(): FileSystemItem[] {
    return this.deepClone(this.fileSystem);
  }

  getItemByPath(path: string[]): FileSystemItem | null {
    let current = this.fileSystem;
    for (let i = 0; i < path.length; i++) {
      const item = current.find(item => item.id === path[i]);
      if (!item) return null;
      if (i === path.length - 1) return item;
      if (item.children) {
        current = item.children;
      } else {
        return null;
      }
    }
    return null;
  }

  getParentByPath(path: string[]): { parent: FileSystemItem[]; index: number } | null {
    if (path.length === 0) return null;
    
    let current = this.fileSystem;
    for (let i = 0; i < path.length - 1; i++) {
      const item = current.find(item => item.id === path[i]);
      if (!item || !item.children) return null;
      current = item.children;
    }
    
    const targetId = path[path.length - 1];
    const index = current.findIndex(item => item.id === targetId);
    return { parent: current, index };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private validateName(name: string, parent: FileSystemItem[]): boolean {
    if (!name.trim()) return false;
    return !parent.some(item => item.name === name);
  }

  createItem(
    type: 'file' | 'folder',
    name: string,
    parentPath: string[],
    content?: string
  ): { success: boolean; error?: string; item?: FileSystemItem } {
    const parent = parentPath.length === 0 ? this.fileSystem : this.getItemByPath(parentPath);
    
    if (!parent || !Array.isArray(parent) && parent.type !== 'folder') {
      return { success: false, error: 'Parent folder not found' };
    }

    const parentChildren = Array.isArray(parent) ? parent : parent.children || [];

    if (!this.validateName(name, parentChildren)) {
      return { success: false, error: 'Name already exists or is invalid' };
    }

    const newItem: FileSystemItem = {
      id: this.generateId(),
      name: name.trim(),
      type,
      content: content || '',
      ...(type === 'folder' && { children: [] }),
      size: content ? content.length : 0,
      created: new Date(),
      modified: new Date(),
      permissions: { read: true, write: true, execute: type === 'folder' },
    };

    if (Array.isArray(parent)) {
      parent.push(newItem);
    } else {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(newItem);
    }

    this.operations.push({
      type: 'create',
      item: newItem,
      newPath: [...parentPath, newItem.id],
      timestamp: new Date(),
    });

    this.notifyListeners();
    return { success: true, item: newItem };
  }

  deleteItem(path: string[]): { success: boolean; error?: string } {
    const result = this.getParentByPath(path);
    if (!result) {
      return { success: false, error: 'Item not found' };
    }

    const { parent, index } = result;
    const item = parent[index];
    if (!item) {
      throw new Error('Item not found');
    }

    this.operations.push({
      type: 'delete',
      item: this.deepClone(item),
      oldPath: path,
      timestamp: new Date(),
    });

    parent.splice(index, 1);
    this.notifyListeners();
    return { success: true };
  }

  renameItem(path: string[], newName: string): { success: boolean; error?: string } {
    const item = this.getItemByPath(path);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    const parentPath = path.slice(0, -1);
    const parent = parentPath.length === 0 ? this.fileSystem : this.getItemByPath(parentPath);
    
    if (!parent || (!Array.isArray(parent) && parent.type !== 'folder')) {
      return { success: false, error: 'Parent folder not found' };
    }

    const parentChildren = Array.isArray(parent) ? parent : parent.children || [];

    if (!this.validateName(newName, parentChildren)) {
      return { success: false, error: 'Name already exists or is invalid' };
    }

    // const oldName = item.name;
    item.name = newName.trim();
    item.modified = new Date();

    this.operations.push({
      type: 'rename',
      item: this.deepClone(item),
      oldPath: path,
      newPath: path,
      timestamp: new Date(),
    });

    this.notifyListeners();
    return { success: true };
  }

  moveItem(fromPath: string[], toPath: string[]): { success: boolean; error?: string } {
    const item = this.getItemByPath(fromPath);
    if (!item) {
      return { success: false, error: 'Source item not found' };
    }

    const toParent = toPath.length === 0 ? this.fileSystem : this.getItemByPath(toPath);
    if (!toParent || (!Array.isArray(toParent) && toParent.type !== 'folder')) {
      return { success: false, error: 'Destination folder not found' };
    }

    const toParentChildren = Array.isArray(toParent) ? toParent : toParent.children || [];

    if (!this.validateName(item.name, toParentChildren)) {
      return { success: false, error: 'Name already exists in destination' };
    }

    // Remove from source
    const sourceResult = this.getParentByPath(fromPath);
    if (!sourceResult) {
      return { success: false, error: 'Source parent not found' };
    }

    sourceResult.parent.splice(sourceResult.index, 1);

    // Add to destination
    if (Array.isArray(toParent)) {
      toParent.push(item);
    } else {
      if (!toParent.children) {
        toParent.children = [];
      }
      toParent.children.push(item);
    }
    item.modified = new Date();

    this.operations.push({
      type: 'move',
      item: this.deepClone(item),
      oldPath: fromPath,
      newPath: [...toPath, item.id],
      timestamp: new Date(),
    });

    this.notifyListeners();
    return { success: true };
  }

  copyItem(fromPath: string[], toPath: string[]): { success: boolean; error?: string; item?: FileSystemItem } {
    const sourceItem = this.getItemByPath(fromPath);
    if (!sourceItem) {
      return { success: false, error: 'Source item not found' };
    }

    const toParent = toPath.length === 0 ? this.fileSystem : this.getItemByPath(toPath);
    if (!toParent || (!Array.isArray(toParent) && toParent.type !== 'folder')) {
      return { success: false, error: 'Destination folder not found' };
    }

    const copiedItem = this.deepClone(sourceItem);
    copiedItem.id = this.generateId();
    copiedItem.name = `${sourceItem.name} (Copy)`;
    copiedItem.created = new Date();
    copiedItem.modified = new Date();

    const toParentChildren = Array.isArray(toParent) ? toParent : toParent.children || [];

    if (!this.validateName(copiedItem.name, toParentChildren)) {
      return { success: false, error: 'Name already exists in destination' };
    }

    if (Array.isArray(toParent)) {
      toParent.push(copiedItem);
    } else {
      if (!toParent.children) {
        toParent.children = [];
      }
      toParent.children.push(copiedItem);
    }

    this.operations.push({
      type: 'copy',
      item: this.deepClone(copiedItem),
      oldPath: fromPath,
      newPath: [...toPath, copiedItem.id],
      timestamp: new Date(),
    });

    this.notifyListeners();
    return { success: true, item: copiedItem };
  }

  updateFileContent(path: string[], content: string): { success: boolean; error?: string } {
    const item = this.getItemByPath(path);
    if (!item || item.type !== 'file') {
      return { success: false, error: 'File not found' };
    }

    item.content = content;
    item.size = content.length;
    item.modified = new Date();

    this.operations.push({
      type: 'update',
      item: this.deepClone(item),
      oldPath: path,
      timestamp: new Date(),
    });

    this.notifyListeners();
    return { success: true };
  }

  // Clipboard operations
  copyToClipboard(path: string[]): { success: boolean; error?: string } {
    const item = this.getItemByPath(path);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    this.clipboard = {
      type: item.type,
      item: this.deepClone(item),
      operation: 'copy',
      sourcePath: path,
    };

    return { success: true };
  }

  cutToClipboard(path: string[]): { success: boolean; error?: string } {
    const item = this.getItemByPath(path);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    this.clipboard = {
      type: item.type,
      item: this.deepClone(item),
      operation: 'cut',
      sourcePath: path,
    };

    return { success: true };
  }

  pasteFromClipboard(toPath: string[]): { success: boolean; error?: string; item?: FileSystemItem } {
    if (!this.clipboard) {
      return { success: false, error: 'Clipboard is empty' };
    }

    if (this.clipboard.operation === 'copy') {
      return this.copyItem(this.clipboard.sourcePath, toPath);
    } else {
      const result = this.moveItem(this.clipboard.sourcePath, toPath);
      if (result.success) {
        this.clipboard = null;
      }
      return result;
    }
  }

  getClipboard(): ClipboardItem | null {
    return this.clipboard;
  }

  clearClipboard() {
    this.clipboard = null;
  }

  getOperations(): FileSystemOperation[] {
    return [...this.operations];
  }

  undoLastOperation(): { success: boolean; error?: string } {
    if (this.operations.length === 0) {
      return { success: false, error: 'No operations to undo' };
    }

    const lastOperation = this.operations[this.operations.length - 1];
    if (!lastOperation) {
      return { success: false, error: 'No operations to undo' };
    }
    
    try {
      switch (lastOperation.type) {
        case 'create':
          // Undo create by deleting the item
          if (lastOperation.newPath) {
            const result = this.deleteItem(lastOperation.newPath);
            if (result.success) {
              this.operations.pop(); // Remove the operation from history
              this.notifyListeners();
              return { success: true };
            }
            return result;
          }
          break;
          
        case 'delete':
          // Undo delete by recreating the item
          if (lastOperation.oldPath && lastOperation.item) {
            const parentPath = lastOperation.oldPath.slice(0, -1);
            const result = this.createItem(
              lastOperation.item.type,
              lastOperation.item.name,
              parentPath,
              lastOperation.item.content
            );
            if (result.success) {
              this.operations.pop(); // Remove the operation from history
              this.notifyListeners();
              return { success: true };
            }
            return result;
          }
          break;
          
        case 'rename':
          // Undo rename by renaming back to original name
          if (lastOperation.oldPath && lastOperation.item) {
            const originalName = lastOperation.item.name;
            const result = this.renameItem(lastOperation.oldPath, originalName);
            if (result.success) {
              this.operations.pop(); // Remove the operation from history
              this.notifyListeners();
              return { success: true };
            }
            return result;
          }
          break;
          
        case 'move':
          // Undo move by moving back to original location
          if (lastOperation.oldPath && lastOperation.newPath) {
            const result = this.moveItem(lastOperation.newPath, lastOperation.oldPath);
            if (result.success) {
              this.operations.pop(); // Remove the operation from history
              this.notifyListeners();
              return { success: true };
            }
            return result;
          }
          break;
          
        case 'copy':
          // Undo copy by deleting the copied item
          if (lastOperation.newPath) {
            const result = this.deleteItem(lastOperation.newPath);
            if (result.success) {
              this.operations.pop(); // Remove the operation from history
              this.notifyListeners();
              return { success: true };
            }
            return result;
          }
          break;
          
        case 'update':
          // Undo update by restoring original content
          if (lastOperation.oldPath && lastOperation.item) {
            const result = this.updateFileContent(lastOperation.oldPath, lastOperation.item.content || '');
            if (result.success) {
              this.operations.pop(); // Remove the operation from history
              this.notifyListeners();
              return { success: true };
            }
            return result;
          }
          break;
      }
      
      return { success: false, error: 'Unable to undo this operation' };
    } catch (error) {
      return { success: false, error: 'Error during undo operation' };
    }
  }
}

// Initialize the file system manager
const initialFileSystem: FileSystemItem[] = [
  {
    id: 'users',
    name: 'Users',
    type: 'folder',
    children: [
      {
        id: 'durgas',
        name: 'Durgas',
        type: 'folder',
        children: [
          {
            id: 'desktop',
            name: 'Desktop',
            type: 'folder',
            children: [
              { id: 'screenshot-1.png', name: 'screenshot-1.png', type: 'file' },
            ],
          },
          {
            id: 'documents',
            name: 'Documents',
            type: 'folder',
            children: [
              { id: 'project-plan.pdf', name: 'project-plan.pdf', type: 'file' },
              { id: 'notes.txt', name: 'notes.txt', type: 'file', content: 'This is a note inside a text file.' },
              { id: 'sample.mp4', name: 'sample.mp4', type: 'file', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            ],
          },
          {
            id: 'downloads',
            name: 'Downloads',
            type: 'folder',
            children: [],
          },
          {
            id: 'pictures',
            name: 'Pictures',
            type: 'folder',
            children: [
                { id: 'avatar.jpg', name: 'avatar.jpg', type: 'file' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'windows',
    name: 'Windows',
    type: 'folder',
    children: [
        { id: 'system32', name: 'system32', type: 'folder', children: [] }
    ],
  },
  {
    id: 'program-files',
    name: 'Program Files',
    type: 'folder',
    children: [],
  },
];

export const fileSystemManager = new FileSystemManager(initialFileSystem);
export const mockFileSystem = initialFileSystem;

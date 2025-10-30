export interface FileSystemItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string;
  children?: FileSystemItem[];
  size?: number;
  created?: Date;
  modified?: Date;
  permissions?: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
}

export interface FileSystemOperation {
  type: 'create' | 'update' | 'delete' | 'move' | 'copy' | 'rename';
  item: FileSystemItem;
  oldPath?: string[];
  newPath?: string[];
  timestamp: Date;
}

export interface ClipboardItem {
  type: 'file' | 'folder';
  item: FileSystemItem;
  operation: 'copy' | 'cut';
  sourcePath: string[];
}

export interface FileSystemManager {
  getFileSystem(): FileSystemItem[];
  getItemByPath(path: string[]): FileSystemItem | null;
  createItem(
    type: 'file' | 'folder',
    name: string,
    parentPath: string[],
    content?: string
  ): { success: boolean; error?: string; item?: FileSystemItem };
  deleteItem(path: string[]): { success: boolean; error?: string };
  renameItem(path: string[], newName: string): { success: boolean; error?: string };
  moveItem(fromPath: string[], toPath: string[]): { success: boolean; error?: string };
  copyItem(fromPath: string[], toPath: string[]): { success: boolean; error?: string; item?: FileSystemItem };
  updateFileContent(path: string[], content: string): { success: boolean; error?: string };
  copyToClipboard(path: string[]): { success: boolean; error?: string };
  cutToClipboard(path: string[]): { success: boolean; error?: string };
  pasteFromClipboard(toPath: string[]): { success: boolean; error?: string; item?: FileSystemItem };
  getClipboard(): ClipboardItem | null;
  clearClipboard(): void;
  getOperations(): FileSystemOperation[];
  undoLastOperation(): { success: boolean; error?: string };
  subscribe(listener: () => void): () => void;
}

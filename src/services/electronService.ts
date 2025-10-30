import { logger, errorToLogContext } from '../lib/logger';

// Electron dialog options
interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: string[];
}

interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: string[];
  multiSelections?: boolean;
}

interface MessageBoxOptions {
  type?: 'info' | 'warning' | 'error' | 'question';
  buttons?: string[];
  defaultId?: number;
  cancelId?: number;
  title?: string;
  message: string;
  detail?: string;
}

// Dialog results
interface SaveDialogResult {
  canceled: boolean;
  filePath?: string;
}

interface OpenDialogResult {
  canceled: boolean;
  filePaths?: string[];
}

interface MessageBoxResult {
  response: number;
  checkboxChecked?: boolean;
}

// File info interface
interface FileInfo {
  size: number;
  created: Date;
  modified: Date;
  isFile: boolean;
  isDirectory: boolean;
}

// System info interface
interface SystemInfo {
  platform: string;
  arch: string;
  version: string;
  totalMemory: number;
  freeMemory: number;
  cpuUsage: number;
}

export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getAppPath: () => Promise<string>;
  showSaveDialog: (options: SaveDialogOptions) => Promise<SaveDialogResult>;
  showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogResult>;
  showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxResult>;
  readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  writeFile: (filePath: string, data: string) => Promise<{ success: boolean; error?: string }>;
  getFileInfo: (filePath: string) => Promise<{ success: boolean; info?: FileInfo; error?: string }>;
  onFileOpened: (callback: (event: Event, filePath: string) => void) => void;
  onSaveRequested: (callback: (event: Event) => void) => void;
  removeAllListeners: (channel: string) => void;
  platform: string;
  isElectron: boolean;
  openExternal: (url: string) => void;
  getSystemInfo: () => SystemInfo;
}

export interface NodeAPI {
  path: {
    join: (...args: string[]) => string;
    dirname: (path: string) => string;
    basename: (path: string) => string;
    extname: (path: string) => string;
    resolve: (...args: string[]) => string;
  };
  os: {
    homedir: () => string;
    tmpdir: () => string;
    platform: () => string;
    arch: () => string;
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
    nodeAPI?: NodeAPI;
  }
}

export class ElectronService {
  private electronAPI: ElectronAPI | null = null;
  private nodeAPI: NodeAPI | null = null;
  private isElectron = false;

  constructor() {
    this.isElectron = typeof window !== 'undefined' && !!(window as unknown as { electronAPI?: unknown }).electronAPI;
    if (this.isElectron) {
      this.electronAPI = (window as unknown as { electronAPI?: unknown }).electronAPI as ElectronAPI | null;
      this.nodeAPI = (window as unknown as { nodeAPI?: unknown }).nodeAPI as NodeAPI | null;
    }
  }

  isElectronApp(): boolean {
    return this.isElectron;
  }

  async getAppVersion(): Promise<string> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    return await this.electronAPI.getAppVersion();
  }

  async getAppPath(): Promise<string> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    return await this.electronAPI.getAppPath();
  }

  async showSaveDialog(options: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }): Promise<{ canceled: boolean; filePath?: string }> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    return await this.electronAPI.showSaveDialog(options);
  }

  async showOpenDialog(options: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    properties?: string[];
  }): Promise<{ canceled: boolean; filePaths?: string[] }> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    return await this.electronAPI.showOpenDialog(options);
  }

  async showMessageBox(options: {
    type?: 'info' | 'warning' | 'error' | 'question';
    title?: string;
    message: string;
    detail?: string;
    buttons?: string[];
  }): Promise<{ response: number; checkboxChecked?: boolean }> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    return await this.electronAPI.showMessageBox(options);
  }

  async readFile(filePath: string): Promise<string> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    const result = await this.electronAPI.readFile(filePath);
    if (!result.success) {
      throw new Error(result.error || 'Failed to read file');
    }
    return result.data || '';
  }

  async writeFile(filePath: string, data: string): Promise<void> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    const result = await this.electronAPI.writeFile(filePath, data);
    if (!result.success) {
      throw new Error(result.error || 'Failed to write file');
    }
  }

  async getFileInfo(filePath: string): Promise<{ size: number; created: Date; modified: Date; isDirectory: boolean }> {
    if (!this.electronAPI) throw new Error('Not running in Electron');
    const result = await this.electronAPI.getFileInfo(filePath);
    if (!result.success) {
      throw new Error(result.error || 'Failed to get file info');
    }
    if (!result.info) {
      throw new Error('Failed to get file info');
    }
    return result.info;
  }

  onFileOpened(callback: (filePath: string) => void): void {
    if (!this.electronAPI) return;
    this.electronAPI.onFileOpened((event, filePath) => callback(filePath));
  }

  onSaveRequested(callback: () => void): void {
    if (!this.electronAPI) return;
    this.electronAPI.onSaveRequested(callback);
  }

  openExternal(url: string): void {
    if (!this.electronAPI) {
      window.open(url, '_blank');
      return;
    }
    this.electronAPI.openExternal(url);
  }

  getSystemInfo(): SystemInfo | null {
    if (!this.electronAPI) return null;
    return this.electronAPI.getSystemInfo();
  }

  getPlatform(): string {
    if (!this.electronAPI) return 'web';
    return this.electronAPI.platform;
  }

  // Node.js API helpers
  joinPath(...paths: string[]): string {
    if (!this.nodeAPI) return paths.join('/');
    return this.nodeAPI.path.join(...paths);
  }

  getDirname(path: string): string {
    if (!this.nodeAPI) return path.substring(0, path.lastIndexOf('/'));
    return this.nodeAPI.path.dirname(path);
  }

  getBasename(path: string): string {
    if (!this.nodeAPI) return path.substring(path.lastIndexOf('/') + 1);
    return this.nodeAPI.path.basename(path);
  }

  getExtname(path: string): string {
    if (!this.nodeAPI) return path.substring(path.lastIndexOf('.'));
    return this.nodeAPI.path.extname(path);
  }

  resolvePath(...paths: string[]): string {
    if (!this.nodeAPI) return paths.join('/');
    return this.nodeAPI.path.resolve(...paths);
  }

  getHomeDir(): string {
    if (!this.nodeAPI) return '/';
    return this.nodeAPI.os.homedir();
  }

  getTmpDir(): string {
    if (!this.nodeAPI) return '/tmp';
    return this.nodeAPI.os.tmpdir();
  }

  getOSPlatform(): string {
    if (!this.nodeAPI) return 'web';
    return this.nodeAPI.os.platform();
  }

  getOSArch(): string {
    if (!this.nodeAPI) return 'unknown';
    return this.nodeAPI.os.arch();
  }

  // File operations with error handling
  async saveFile(content: string, defaultName = 'untitled.txt'): Promise<string | null> {
    try {
      const result = await this.showSaveDialog({
        title: 'Save File',
        defaultPath: defaultName,
        filters: [
          { name: 'Text Files', extensions: ['txt', 'md', 'log'] },
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        await this.writeFile(result.filePath, content);
        return result.filePath;
      }
      return null;
    } catch (error) {
      logger.error('Failed to save file:', errorToLogContext(error));
      return null;
    }
  }

  async openFile(): Promise<{ content: string; filePath: string } | null> {
    try {
      const result = await this.showOpenDialog({
        title: 'Open File',
        properties: ['openFile'],
        filters: [
          { name: 'Text Files', extensions: ['txt', 'md', 'log'] },
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        if (!filePath) {
          throw new Error('No file path selected');
        }
        const content = await this.readFile(filePath);
        return { content, filePath };
      }
      return null;
    } catch (error) {
      logger.error('Failed to open file:', errorToLogContext(error));
      return null;
    }
  }

  async showError(title: string, message: string): Promise<void> {
    try {
      await this.showMessageBox({
        type: 'error',
        title,
        message,
        buttons: ['OK']
      });
    } catch (error) {
      logger.error('Failed to show error dialog:', errorToLogContext(error));
      alert(`${title}: ${message}`);
    }
  }

  async showInfo(title: string, message: string): Promise<void> {
    try {
      await this.showMessageBox({
        type: 'info',
        title,
        message,
        buttons: ['OK']
      });
    } catch (error) {
      logger.error('Failed to show info dialog:', errorToLogContext(error));
      alert(`${title}: ${message}`);
    }
  }

  async showConfirm(title: string, message: string): Promise<boolean> {
    try {
      const result = await this.showMessageBox({
        type: 'question',
        title,
        message,
        buttons: ['Yes', 'No']
      });
      return result.response === 0;
    } catch (error) {
      logger.error('Failed to show confirm dialog:', errorToLogContext(error));
      return confirm(`${title}: ${message}`);
    }
  }
}

// Singleton instance
export const electronService = new ElectronService();

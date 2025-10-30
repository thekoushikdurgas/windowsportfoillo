import React from 'react';

// SDK Types
interface HTTPOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string | FormData;
  timeout?: number;
}

interface HTTPResponse {
  status: number;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
}

interface NotificationOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  actions?: Array<{ label: string; action: () => void }>;
}

interface DialogOptions {
  title?: string;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'question';
  buttons?: string[];
  defaultButton?: number;
}

interface DialogResult {
  response: number;
  checkboxChecked?: boolean;
}

interface AIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

interface AIResponse {
  text: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

interface WindowOptions {
  width?: number;
  height?: number;
  title?: string;
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  modal?: boolean;
  parent?: string;
}

export interface PluginSDK {
  // Plugin registration
  register: (manifest: PluginManifest, hooks?: PluginHooks) => void;
  
  // App lifecycle
  onLoad: (callback: () => void) => void;
  onUnload: (callback: () => void) => void;
  onEnable: (callback: () => void) => void;
  onDisable: (callback: () => void) => void;
  onUpdate: (callback: (oldVersion: string, newVersion: string) => void) => void;
  
  // API access
  getAPI: () => PluginAPI;
  
  // Utilities
  createElement: (tag: string, props?: Record<string, unknown>, children?: unknown[]) => HTMLElement;
  createComponent: <T = unknown>(component: React.ComponentType<T>, props?: T) => React.ReactElement;
  render: (element: HTMLElement, container: HTMLElement) => void;
  
  // Event system
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  emit: (event: string, data?: Record<string, unknown>) => void;
  
  // Storage
  storage: {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
    remove: (key: string) => void;
    clear: () => void;
  };
  
  // Settings
  settings: {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
    getAll: () => Record<string, unknown>;
    setAll: (settings: Record<string, unknown>) => void;
  };
  
  // Logging
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  error: (message: string, error?: Error) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  
  // HTTP client
  http: {
    request: (url: string, options?: HTTPOptions) => Promise<HTTPResponse>;
    get: (url: string, options?: HTTPOptions) => Promise<HTTPResponse>;
    post: (url: string, data: Record<string, unknown>, options?: HTTPOptions) => Promise<HTTPResponse>;
    put: (url: string, data: Record<string, unknown>, options?: HTTPOptions) => Promise<HTTPResponse>;
    delete: (url: string, options?: HTTPOptions) => Promise<HTTPResponse>;
  };
  
  // File operations
  files: {
    read: (path: string) => Promise<string>;
    write: (path: string, content: string) => Promise<void>;
    list: (path: string) => Promise<string[]>;
    createDir: (path: string) => Promise<void>;
    delete: (path: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
    stat: (path: string) => Promise<{ size: number; isFile: boolean; isDirectory: boolean; mtime: Date }>;
  };
  
  // UI components
  ui: {
    showNotification: (title: string, message: string, options?: NotificationOptions) => void;
    showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    showDialog: (options: DialogOptions) => Promise<DialogResult>;
    showConfirm: (title: string, message: string) => Promise<boolean>;
    showAlert: (title: string, message: string) => Promise<void>;
  };
  
  // AI services
  ai: {
    call: (prompt: string, options?: AIOptions) => Promise<AIResponse>;
    generateImage: (prompt: string, options?: AIOptions) => Promise<string>;
    generateText: (prompt: string, options?: AIOptions) => Promise<string>;
    chat: (message: string, options?: AIOptions) => Promise<string>;
  };
  
  // App management
  apps: {
    open: (appId: string, data?: Record<string, unknown>) => void;
    close: (appId: string) => void;
    minimize: (appId: string) => void;
    maximize: (appId: string) => void;
    focus: (appId: string) => void;
  };
  
  // Window management
  windows: {
    create: (options: WindowOptions) => void;
    close: (windowId: string) => void;
    focus: (windowId: string) => void;
    minimize: (windowId: string) => void;
    maximize: (windowId: string) => void;
  };
}

export interface PluginHooks {
  onLoad?: () => void;
  onUnload?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  onUpdate?: (oldVersion: string, newVersion: string) => void;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  main: string;
  icon?: string;
  permissions?: string[];
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  engines?: {
    durgasos?: string;
    node?: string;
  };
  api?: {
    version: string;
    compatibility: string[];
  };
}

import { logger } from '../lib/logger';

export interface PluginAPI {
  // App management
  openApp: (appId: string, data?: Record<string, unknown>) => void;
  closeApp: (appId: string) => void;
  minimizeApp: (appId: string) => void;
  maximizeApp: (appId: string) => void;
  
  // Window management
  createWindow: (options: WindowOptions) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  
  // File system
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  listFiles: (path: string) => Promise<string[]>;
  createDirectory: (path: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  
  // Settings
  getSetting: (key: string) => unknown;
  setSetting: (key: string, value: unknown) => void;
  getSettings: () => Record<string, unknown>;
  setSettings: (settings: Record<string, unknown>) => void;
  
  // Notifications
  showNotification: (title: string, message: string, options?: NotificationOptions) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  
  // AI
  callAI: (prompt: string, options?: AIOptions) => Promise<AIResponse>;
  generateImage: (prompt: string, options?: AIOptions) => Promise<string>;
  generateText: (prompt: string, options?: AIOptions) => Promise<string>;
  
  // Events
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  emit: (event: string, data?: Record<string, unknown>) => void;
  
  // Storage
  getStorage: (key: string) => unknown;
  setStorage: (key: string, value: unknown) => void;
  removeStorage: (key: string) => void;
  clearStorage: () => void;
  
  // HTTP
  request: (url: string, options?: HTTPOptions) => Promise<HTTPResponse>;
  get: (url: string, options?: HTTPOptions) => Promise<HTTPResponse>;
  post: (url: string, data: Record<string, unknown>, options?: HTTPOptions) => Promise<HTTPResponse>;
  
  // Utilities
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
  error: (message: string, error?: Error) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}

export class PluginSDKImpl {
  private pluginId: string;
  private api: PluginAPI;
  private hooks: PluginHooks = {};
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor(pluginId: string, api: PluginAPI) {
    this.pluginId = pluginId;
    this.api = api;
  }

  register(manifest: PluginManifest, hooks?: PluginHooks) {
    if (hooks) {
      this.hooks = hooks;
    }
  }

  onLoad(callback: () => void) {
    this.hooks.onLoad = callback;
  }

  onUnload(callback: () => void) {
    this.hooks.onUnload = callback;
  }

  onEnable(callback: () => void) {
    this.hooks.onEnable = callback;
  }

  onDisable(callback: () => void) {
    this.hooks.onDisable = callback;
  }

  onUpdate(callback: (oldVersion: string, newVersion: string) => void) {
    this.hooks.onUpdate = callback;
  }

  getAPI(): PluginAPI {
    return this.api;
  }

  createElement(tag: string, props?: Record<string, unknown>, children?: unknown[]): HTMLElement {
    const element = document.createElement(tag);
    
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value as string;
        } else if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value);
        } else {
          element.setAttribute(key, value as string);
        }
      });
    }
    
    if (children) {
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    }
    
    return element;
  }

  createComponent<T extends Record<string, unknown> = Record<string, unknown>>(component: React.ComponentType<T>, props?: T): React.ReactElement<T> {
    // This would integrate with React or other component systems
    return React.createElement<T>(component, props as T);
  }

  render(element: HTMLElement, container: HTMLElement) {
    container.appendChild(element);
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  emit(event: string, data?: Record<string, unknown>) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  get storage() {
    return {
      get: (key: string) => this.api.getStorage(key),
      set: (key: string, value: unknown) => this.api.setStorage(key, value),
      remove: (key: string) => this.api.removeStorage(key),
      clear: () => this.api.clearStorage()
    };
  }

  get settings() {
    return {
      get: (key: string) => this.api.getSetting(key),
      set: (key: string, value: unknown) => this.api.setSetting(key, value),
      getAll: () => this.api.getSettings(),
      setAll: (settings: Record<string, unknown>) => this.api.setSettings(settings)
    };
  }

  log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    this.api.log(message, level);
  }

  error(message: string, error?: Error) {
    this.api.error(message, error);
  }

  warn(message: string) {
    this.api.warn(message);
  }

  info(message: string) {
    this.api.info(message);
  }

  get http() {
    return {
      request: (url: string, options?: HTTPOptions) => this.api.request(url, options),
      get: (url: string, options?: HTTPOptions) => this.api.get(url, options),
      post: (url: string, data: Record<string, unknown>, options?: HTTPOptions) => this.api.post(url, data, options),
      put: (url: string, data: Record<string, unknown>, options?: HTTPOptions) => this.api.request(url, { ...options, method: 'PUT', body: JSON.stringify(data) }),
      delete: (url: string, options?: HTTPOptions) => this.api.request(url, { ...options, method: 'DELETE' })
    };
  }

  get files() {
    return {
      read: (path: string) => this.api.readFile(path),
      write: (path: string, content: string) => this.api.writeFile(path, content),
      list: (path: string) => this.api.listFiles(path),
      createDir: (path: string) => this.api.createDirectory(path),
      delete: (path: string) => this.api.deleteFile(path),
      exists: async (path: string) => {
        try {
          await this.api.readFile(path);
          return true;
        } catch {
          return false;
        }
      },
      stat: async () => {
        // This would need to be implemented in the API
        return { size: 0, isFile: true, isDirectory: false };
      }
    };
  }

  get ui() {
    return {
      showNotification: (title: string, message: string, options?: NotificationOptions) => {
        this.api.showNotification(title, message, options);
      },
      showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => {
        this.api.showToast(message, type);
      },
      showDialog: async () => {
        // This would need to be implemented in the API
        return { response: 0 };
      },
      showConfirm: async (title: string, message: string) => {
        // This would need to be implemented in the API
        return confirm(`${title}: ${message}`);
      },
      showAlert: async (title: string, message: string) => {
        alert(`${title}: ${message}`);
      }
    };
  }

  get ai() {
    return {
      call: (prompt: string, options?: AIOptions) => this.api.callAI(prompt, options),
      generateImage: (prompt: string, options?: AIOptions) => this.api.generateImage(prompt, options),
      generateText: (prompt: string, options?: AIOptions) => this.api.generateText(prompt, options),
      chat: async (message: string, options?: AIOptions) => {
        const response = await this.api.callAI(message, options);
        return (response as AIResponse & { response?: unknown }).response || response;
      }
    };
  }

  get apps() {
    return {
      open: (appId: string, data?: Record<string, unknown>) => this.api.openApp(appId, data),
      close: (appId: string) => this.api.closeApp(appId),
      minimize: (appId: string) => this.api.minimizeApp(appId),
      maximize: (appId: string) => this.api.maximizeApp(appId),
      focus: (appId: string) => this.api.openApp(appId)
    };
  }

  get windows() {
    return {
      create: (options: WindowOptions) => this.api.createWindow(options),
      close: (windowId: string) => this.api.closeWindow(windowId),
      focus: (windowId: string) => this.api.focusWindow(windowId),
      minimize: (windowId: string) => {
        // This would need to be implemented in the API
        logger.info(`Minimizing window ${windowId}`);
      },
      maximize: (windowId: string) => {
        // This would need to be implemented in the API
        logger.info(`Maximizing window ${windowId}`);
      }
    };
  }
}

// Global SDK instance for plugins
declare global {
  interface Window {
    DurgasOSPluginSDK: PluginSDK;
  }
}

// Export for use in plugins
export const createPluginSDK = (pluginId: string, api: PluginAPI): PluginSDKImpl => {
  return new PluginSDKImpl(pluginId, api);
};

/**
 * Electron Integration Utilities
 * Detect Electron environment and provide native integrations
 */

// Type definitions for Electron API
export interface ElectronAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
  };
  platform: string;
  app: {
    name: string;
    version: string;
  };
}

declare global {
  interface Window {
    electron?: ElectronAPI;
    isElectron?: boolean;
  }
}

/**
 * Check if running in Electron
 */
export function isElectron(): boolean {
  return typeof window !== 'undefined' && (window.isElectron === true || window.electron !== undefined);
}

/**
 * Get Electron API
 */
export function getElectronAPI(): ElectronAPI | null {
  if (isElectron() && window.electron) {
    return window.electron;
  }
  return null;
}

/**
 * Use native window controls if available
 */
export async function minimizeWindow(): Promise<void> {
  const electron = getElectronAPI();
  if (electron) {
    await electron.window.minimize();
  }
}

export async function maximizeWindow(): Promise<void> {
  const electron = getElectronAPI();
  if (electron) {
    await electron.window.maximize();
  }
}

export async function closeWindow(): Promise<void> {
  const electron = getElectronAPI();
  if (electron) {
    await electron.window.close();
  }
}

export async function isWindowMaximized(): Promise<boolean> {
  const electron = getElectronAPI();
  if (electron) {
    return await electron.window.isMaximized();
  }
  return false;
}

/**
 * Get platform information
 */
export function getPlatform(): string {
  const electron = getElectronAPI();
  if (electron) {
    return electron.platform;
  }
  // Fallback to browser detection
  if (typeof navigator !== 'undefined') {
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) return 'win32';
    if (platform.includes('mac')) return 'darwin';
    if (platform.includes('linux')) return 'linux';
  }
  return 'unknown';
}

/**
 * Check if on Windows
 */
export function isWindows(): boolean {
  return getPlatform() === 'win32';
}

/**
 * Check if on macOS
 */
export function isMacOS(): boolean {
  return getPlatform() === 'darwin';
}

/**
 * Check if on Linux
 */
export function isLinux(): boolean {
  return getPlatform() === 'linux';
}


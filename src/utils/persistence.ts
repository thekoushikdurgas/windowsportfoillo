/**
 * Persistence utilities for saving and loading user preferences
 */

interface PersistedSettings {
  theme: 'light' | 'dark';
  wallpaper: string;
  volume: number;
  brightness: number;
  taskbarAlignment: 'left' | 'center';
  desktopIcons: Array<{
    id: string;
    appId: string;
    name: string;
    icon: string;
    position: { x: number; y: number };
  }>;
  windowPositions: Record<string, {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized: boolean;
    crop?: { x: number; y: number; width: number; height: number } | null;
  }>;
  recentApps: string[];
  calculatorHistory: string[];
  calculatorMemory: number;
  lastLoginTime: number;
}

const DEFAULT_SETTINGS: PersistedSettings = {
  theme: 'light',
  wallpaper: 'default',
  volume: 70,
  brightness: 100,
  taskbarAlignment: 'center',
  desktopIcons: [],
  windowPositions: {},
  recentApps: [],
  calculatorHistory: [],
  calculatorMemory: 0,
  lastLoginTime: 0,
};

const STORAGE_KEY = 'windows11-settings';

export class PersistenceManager {
  private static instance: PersistenceManager;
  private settings: PersistedSettings;

  private constructor() {
    this.settings = this.loadSettings();
  }

  public static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager();
    }
    return PersistenceManager.instance;
  }

  private loadSettings(): PersistedSettings {
    try {
      if (typeof window === 'undefined') {
        return DEFAULT_SETTINGS;
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      // Failed to load settings from localStorage - using defaults
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      // Failed to save settings to localStorage
    }
  }

  public getSettings(): PersistedSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<PersistedSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  // Theme management
  public setTheme(theme: 'light' | 'dark'): void {
    this.updateSettings({ theme });
    this.applyTheme(theme);
  }

  public getTheme(): 'light' | 'dark' {
    return this.settings.theme;
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Wallpaper management
  public setWallpaper(wallpaper: string): void {
    this.updateSettings({ wallpaper });
  }

  public getWallpaper(): string {
    return this.settings.wallpaper;
  }

  // System settings
  public setVolume(volume: number): void {
    this.updateSettings({ volume });
  }

  public setBrightness(brightness: number): void {
    this.updateSettings({ brightness });
  }

  public setTaskbarAlignment(alignment: 'left' | 'center'): void {
    this.updateSettings({ taskbarAlignment: alignment });
  }

  // Desktop icons
  public setDesktopIcons(icons: PersistedSettings['desktopIcons']): void {
    this.updateSettings({ desktopIcons: icons });
  }

  public addDesktopIcon(icon: PersistedSettings['desktopIcons'][0]): void {
    const icons = [...this.settings.desktopIcons];
    const existingIndex = icons.findIndex(i => i.id === icon.id);
    
    if (existingIndex >= 0) {
      icons[existingIndex] = icon;
    } else {
      icons.push(icon);
    }
    
    this.updateSettings({ desktopIcons: icons });
  }

  public removeDesktopIcon(iconId: string): void {
    const icons = this.settings.desktopIcons.filter(i => i.id !== iconId);
    this.updateSettings({ desktopIcons: icons });
  }

  // Window positions
  public setWindowPosition(windowId: string, position: {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized: boolean;
    crop?: { x: number; y: number; width: number; height: number } | null;
  }): void {
    const windowPositions = { ...this.settings.windowPositions };
    windowPositions[windowId] = position;
    this.updateSettings({ windowPositions });
  }

  public getWindowPosition(windowId: string): {
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized: boolean;
    crop?: { x: number; y: number; width: number; height: number } | null;
  } | null {
    return this.settings.windowPositions[windowId] || null;
  }

  public removeWindowPosition(windowId: string): void {
    const windowPositions = { ...this.settings.windowPositions };
    delete windowPositions[windowId];
    this.updateSettings({ windowPositions });
  }

  // Recent apps
  public addRecentApp(appId: string): void {
    const recentApps = [appId, ...this.settings.recentApps.filter(id => id !== appId)];
    this.updateSettings({ recentApps: recentApps.slice(0, 10) }); // Keep only last 10
  }

  public getRecentApps(): string[] {
    return [...this.settings.recentApps];
  }

  // Calculator state
  public setCalculatorHistory(history: string[]): void {
    this.updateSettings({ calculatorHistory: history });
  }

  public getCalculatorHistory(): string[] {
    return [...this.settings.calculatorHistory];
  }

  public setCalculatorMemory(memory: number): void {
    this.updateSettings({ calculatorMemory: memory });
  }

  public getCalculatorMemory(): number {
    return this.settings.calculatorMemory;
  }

  // Session management
  public setLastLoginTime(): void {
    this.updateSettings({ lastLoginTime: Date.now() });
  }

  public getLastLoginTime(): number {
    return this.settings.lastLoginTime;
  }

  // Reset and export/import
  public resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    this.applyTheme(this.settings.theme);
  }

  public exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  public importSettings(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      this.settings = { ...DEFAULT_SETTINGS, ...imported };
      this.saveSettings();
      this.applyTheme(this.settings.theme);
      return true;
    } catch (error) {
      // Failed to import settings
      return false;
    }
  }

  // Auto-save debounced updates
  private saveTimeout: NodeJS.Timeout | null = null;

  public debouncedSave(updates: Partial<PersistedSettings>): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.updateSettings(updates);
    }, 1000); // Save after 1 second of inactivity
  }

  // Initialize theme on load
  public initialize(): void {
    this.applyTheme(this.settings.theme);
  }

  // Cleanup old data (optional maintenance)
  public cleanup(): void {
    // Remove window positions for windows that haven't been used in 30 days
    const windowPositions = { ...this.settings.windowPositions };
    
    Object.keys(windowPositions).forEach(_windowId => {
      // This would require storing last used timestamps for each window
      // For now, we'll just keep all window positions
    });
    
    // Limit calculator history to last 100 entries
    if (this.settings.calculatorHistory.length > 100) {
      this.updateSettings({
        calculatorHistory: this.settings.calculatorHistory.slice(0, 100)
      });
    }
  }
}

// Export singleton instance
export const persistence = PersistenceManager.getInstance();

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  persistence.initialize();
}

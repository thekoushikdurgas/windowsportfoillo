export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isActive: boolean;
  isPinned: boolean;
  isMuted: boolean;
  lastAccessed: Date;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Download {
  id: string;
  url: string;
  filename: string;
  totalBytes: number;
  downloadedBytes: number;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  speed: number; // bytes per second
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  visitCount: number;
  lastVisit: Date;
  typedCount: number;
}

export interface BrowserSettings {
  homepage: string;
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'yahoo';
  defaultZoom: number;
  blockPopups: boolean;
  blockAds: boolean;
  enableJavaScript: boolean;
  enableCookies: boolean;
  enableLocation: boolean;
  enableNotifications: boolean;
  enableCamera: boolean;
  enableMicrophone: boolean;
  privateMode: boolean;
  downloadPath: string;
  autoDownloadImages: boolean;
  enableExtensions: boolean;
}

export interface SecurityInfo {
  isSecure: boolean;
  protocol: 'http' | 'https' | 'file' | 'data';
  certificate?: {
    issuer: string;
    validFrom: Date;
    validTo: Date;
    subject: string;
  };
  warnings: string[];
}

export interface NavigationState {
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  loadingProgress: number;
  currentUrl: string;
  securityInfo: SecurityInfo;
}

export interface TabGroup {
  id: string;
  name: string;
  color: string;
  tabIds: string[];
  collapsed: boolean;
  createdAt: Date;
}

export interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  downloads: Download[];
  history: HistoryItem[];
  settings: BrowserSettings;
  tabGroups: TabGroup[];
  isFullscreen: boolean;
  isDeveloperMode: boolean;
}

export interface BrowserActions {
  // Tab management
  createTab: (url?: string) => void;
  closeTab: (tabId: string) => void;
  switchTab: (tabId: string) => void;
  updateTab: (tabId: string, updates: Partial<Tab>) => void;
  pinTab: (tabId: string) => void;
  unpinTab: (tabId: string) => void;
  muteTab: (tabId: string) => void;
  unmuteTab: (tabId: string) => void;
  duplicateTab: (tabId: string) => void;
  
  // Navigation
  navigateTo: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  stop: () => void;
  goHome: () => void;
  
  // Bookmarks
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  createBookmarkFolder: (folder: Omit<BookmarkFolder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBookmarkFolder: (folderId: string, updates: Partial<BookmarkFolder>) => void;
  removeBookmarkFolder: (folderId: string) => void;
  
  // Downloads
  startDownload: (url: string, filename?: string) => void;
  pauseDownload: (downloadId: string) => void;
  resumeDownload: (downloadId: string) => void;
  cancelDownload: (downloadId: string) => void;
  clearDownload: (downloadId: string) => void;
  
  // History
  addToHistory: (item: Omit<HistoryItem, 'id'>) => void;
  clearHistory: () => void;
  removeFromHistory: (itemId: string) => void;
  
  // Settings
  updateSettings: (settings: Partial<BrowserSettings>) => void;
  resetSettings: () => void;
  
  // Tab groups
  createTabGroup: (group: Omit<TabGroup, 'id' | 'createdAt'>) => void;
  addTabToGroup: (tabId: string, groupId: string) => void;
  removeTabFromGroup: (tabId: string) => void;
  deleteTabGroup: (groupId: string) => void;
  
  // UI state
  toggleFullscreen: () => void;
  toggleDeveloperMode: () => void;
}

export type BrowserStore = BrowserState & BrowserActions;

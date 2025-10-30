import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import { BrowserStore, Tab, Bookmark, BookmarkFolder, Download, HistoryItem, BrowserSettings, TabGroup } from '@/types/browser';

const defaultSettings: BrowserSettings = {
  homepage: 'https://www.google.com',
  searchEngine: 'google',
  defaultZoom: 100,
  blockPopups: true,
  blockAds: false,
  enableJavaScript: true,
  enableCookies: true,
  enableLocation: false,
  enableNotifications: false,
  enableCamera: false,
  enableMicrophone: false,
  privateMode: false,
  downloadPath: '/Downloads',
  autoDownloadImages: true,
  enableExtensions: false,
};

const createNewTab = (url = 'https://www.google.com'): Tab => ({
  id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  title: 'New Tab',
  url,
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
  isActive: true,
  isPinned: false,
  isMuted: false,
  lastAccessed: new Date(),
});

export const useBrowserStore = create<BrowserStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        tabs: [createNewTab()],
        activeTabId: null,
        bookmarks: [],
        bookmarkFolders: [],
        downloads: [],
        history: [],
        settings: defaultSettings,
        tabGroups: [],
        isFullscreen: false,
        isDeveloperMode: false,

        // Tab management
        createTab: (url) => {
          const newTab = createNewTab(url);
          set((state) => ({
            tabs: [...state.tabs.map(tab => ({ ...tab, isActive: false })), newTab],
            activeTabId: newTab.id,
          }));
        },

        closeTab: (tabId) => {
          set((state) => {
            const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
            if (tabIndex === -1) return state;

            const newTabs = state.tabs.filter(tab => tab.id !== tabId);
            let newActiveTabId = state.activeTabId;

            // If closing the active tab, switch to another tab
            if (state.activeTabId === tabId) {
              if (newTabs.length > 0) {
                // Switch to the tab to the right, or the last tab if closing the rightmost
                const nextTabIndex = Math.min(tabIndex, newTabs.length - 1);
                const nextTab = newTabs[nextTabIndex];
                if (nextTab) {
                  newActiveTabId = nextTab.id;
                  nextTab.isActive = true;
                }
              } else {
                // Create a new tab if no tabs remain
                const newTab = createNewTab();
                newTabs.push(newTab);
                newActiveTabId = newTab.id;
              }
            }

            return {
              tabs: newTabs,
              activeTabId: newActiveTabId,
            };
          });
        },

        switchTab: (tabId) => {
          set((state) => ({
            tabs: state.tabs.map(tab => ({
              ...tab,
              isActive: tab.id === tabId,
            })),
            activeTabId: tabId,
          }));
        },

        updateTab: (tabId, updates) => {
          set((state) => ({
            tabs: state.tabs.map(tab =>
              tab.id === tabId ? { ...tab, ...updates } : tab
            ),
          }));
        },

        pinTab: (tabId) => {
          set((state) => ({
            tabs: state.tabs.map(tab =>
              tab.id === tabId ? { ...tab, isPinned: true } : tab
            ),
          }));
        },

        unpinTab: (tabId) => {
          set((state) => ({
            tabs: state.tabs.map(tab =>
              tab.id === tabId ? { ...tab, isPinned: false } : tab
            ),
          }));
        },

        muteTab: (tabId) => {
          set((state) => ({
            tabs: state.tabs.map(tab =>
              tab.id === tabId ? { ...tab, isMuted: true } : tab
            ),
          }));
        },

        unmuteTab: (tabId) => {
          set((state) => ({
            tabs: state.tabs.map(tab =>
              tab.id === tabId ? { ...tab, isMuted: false } : tab
            ),
          }));
        },

        duplicateTab: (tabId) => {
          set((state) => {
            const tabToDuplicate = state.tabs.find(tab => tab.id === tabId);
            if (!tabToDuplicate) return state;

            const newTab = createNewTab(tabToDuplicate.url);
            newTab.title = tabToDuplicate.title || '';
            newTab.favicon = tabToDuplicate.favicon || '';

            const tabIndex = state.tabs.findIndex(tab => tab.id === tabId);
            const newTabs = [...state.tabs];
            newTabs.splice(tabIndex + 1, 0, newTab);

            return {
              tabs: newTabs.map(tab => ({ ...tab, isActive: tab.id === newTab.id })),
              activeTabId: newTab.id,
            };
          });
        },

        // Navigation
        navigateTo: (url) => {
          const { activeTabId, updateTab, addToHistory } = get();
          if (!activeTabId) return;

          // Add protocol if missing
          let normalizedUrl = url;
          if (!url.match(/^https?:\/\//)) {
            normalizedUrl = `https://${url}`;
          }

          updateTab(activeTabId, {
            url: normalizedUrl,
            isLoading: true,
            lastAccessed: new Date(),
          });

          // Add to history
          addToHistory({
            url: normalizedUrl,
            title: 'Loading...',
            visitCount: 1,
            lastVisit: new Date(),
            typedCount: 1,
          });
        },

        goBack: () => {
          const { activeTabId, updateTab } = get();
          if (!activeTabId) return;

          updateTab(activeTabId, {
            canGoBack: false, // This would be updated by the webview
            lastAccessed: new Date(),
          });
        },

        goForward: () => {
          const { activeTabId, updateTab } = get();
          if (!activeTabId) return;

          updateTab(activeTabId, {
            canGoForward: false, // This would be updated by the webview
            lastAccessed: new Date(),
          });
        },

        refresh: () => {
          const { activeTabId, updateTab } = get();
          if (!activeTabId) return;

          updateTab(activeTabId, {
            isLoading: true,
            lastAccessed: new Date(),
          });
        },

        stop: () => {
          const { activeTabId, updateTab } = get();
          if (!activeTabId) return;

          updateTab(activeTabId, {
            isLoading: false,
          });
        },

        goHome: () => {
          const { settings, navigateTo } = get();
          navigateTo(settings.homepage);
        },

        // Bookmarks
        addBookmark: (bookmark) => {
          const newBookmark: Bookmark = {
            ...bookmark,
            id: `bookmark-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            bookmarks: [...state.bookmarks, newBookmark],
          }));
        },

        removeBookmark: (bookmarkId) => {
          set((state) => ({
            bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== bookmarkId),
          }));
        },

        updateBookmark: (bookmarkId, updates) => {
          set((state) => ({
            bookmarks: state.bookmarks.map(bookmark =>
              bookmark.id === bookmarkId
                ? { ...bookmark, ...updates, updatedAt: new Date() }
                : bookmark
            ),
          }));
        },

        createBookmarkFolder: (folder) => {
          const newFolder: BookmarkFolder = {
            ...folder,
            id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            bookmarkFolders: [...state.bookmarkFolders, newFolder],
          }));
        },

        updateBookmarkFolder: (folderId, updates) => {
          set((state) => ({
            bookmarkFolders: state.bookmarkFolders.map(folder =>
              folder.id === folderId
                ? { ...folder, ...updates, updatedAt: new Date() }
                : folder
            ),
          }));
        },

        removeBookmarkFolder: (folderId) => {
          set((state) => ({
            bookmarkFolders: state.bookmarkFolders.filter(folder => folder.id !== folderId),
            bookmarks: state.bookmarks.map(bookmark => {
              if (bookmark.folderId === folderId) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { folderId: _, ...rest } = bookmark;
                return rest;
              }
              return bookmark;
            }),
          }));
        },

        // Downloads
        startDownload: (url, filename) => {
          const newDownload: Download = {
            id: `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url,
            filename: filename || url.split('/').pop() || 'download',
            totalBytes: 0,
            downloadedBytes: 0,
            status: 'pending',
            startTime: new Date(),
            speed: 0,
          };

          set((state) => ({
            downloads: [...state.downloads, newDownload],
          }));

          // Simulate download progress (in real implementation, this would be handled by the webview)
          setTimeout(() => {
            get().downloads.find(d => d.id === newDownload.id);
          }, 1000);
        },

        pauseDownload: (downloadId) => {
          set((state) => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId ? { ...download, status: 'paused' } : download
            ),
          }));
        },

        resumeDownload: (downloadId) => {
          set((state) => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId ? { ...download, status: 'downloading' } : download
            ),
          }));
        },

        cancelDownload: (downloadId) => {
          set((state) => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId ? { ...download, status: 'failed' } : download
            ),
          }));
        },

        clearDownload: (downloadId) => {
          set((state) => ({
            downloads: state.downloads.filter(download => download.id !== downloadId),
          }));
        },

        updateDownload: (downloadId: string, updates: Partial<Download>) => {
          set((state) => ({
            downloads: state.downloads.map(download =>
              download.id === downloadId ? { ...download, ...updates } : download
            ),
          }));
        },

        // History
        addToHistory: (item) => {
          const newHistoryItem: HistoryItem = {
            ...item,
            id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };

          set((state) => {
            // Check if URL already exists in history
            const existingIndex = state.history.findIndex(h => h.url === item.url);
            if (existingIndex !== -1) {
              // Update existing entry
              const updatedHistory = [...state.history];
              const existingItem = updatedHistory[existingIndex];
              if (existingItem) {
                updatedHistory[existingIndex] = {
                  ...existingItem,
                  visitCount: existingItem.visitCount + 1,
                  lastVisit: new Date(),
                  typedCount: existingItem.typedCount + (item.typedCount || 0),
                };
              }
              return { history: updatedHistory };
            }

            return { history: [newHistoryItem, ...state.history] };
          });
        },

        clearHistory: () => {
          set({ history: [] });
        },

        removeFromHistory: (itemId) => {
          set((state) => ({
            history: state.history.filter(item => item.id !== itemId),
          }));
        },

        // Settings
        updateSettings: (newSettings) => {
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          }));
        },

        resetSettings: () => {
          set({ settings: defaultSettings });
        },

        // Tab groups
        createTabGroup: (group) => {
          const newGroup: TabGroup = {
            ...group,
            id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
          };

          set((state) => ({
            tabGroups: [...state.tabGroups, newGroup],
          }));
        },

        addTabToGroup: (tabId, groupId) => {
          set((state) => ({
            tabGroups: state.tabGroups.map(group =>
              group.id === groupId
                ? { ...group, tabIds: [...group.tabIds, tabId] }
                : group
            ),
          }));
        },

        removeTabFromGroup: (tabId) => {
          set((state) => ({
            tabGroups: state.tabGroups.map(group => ({
              ...group,
              tabIds: group.tabIds.filter(id => id !== tabId),
            })),
          }));
        },

        deleteTabGroup: (groupId) => {
          set((state) => ({
            tabGroups: state.tabGroups.filter(group => group.id !== groupId),
          }));
        },

        // UI state
        toggleFullscreen: () => {
          set((state) => ({ isFullscreen: !state.isFullscreen }));
        },

        toggleDeveloperMode: () => {
          set((state) => ({ isDeveloperMode: !state.isDeveloperMode }));
        },
      }),
      {
        name: 'browser-store',
        partialize: (state) => ({
          bookmarks: state.bookmarks,
          bookmarkFolders: state.bookmarkFolders,
          history: state.history,
          settings: state.settings,
          tabGroups: state.tabGroups,
        }),
      }
    )
  )
);

// Initialize with a default tab if none exist
if (useBrowserStore.getState().tabs.length === 0) {
  useBrowserStore.getState().createTab();
}

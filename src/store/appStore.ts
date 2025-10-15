import { create } from 'zustand';
import { App, AppState, AppWindow, AppRegistry } from '@/types/app';

interface AppStore extends AppState {
  registry: AppRegistry;
  registerApp: (app: App) => void;
  openApp: (appId: string) => void;
  closeApp: (appId: string) => void;
  pinApp: (appId: string) => void;
  unpinApp: (appId: string) => void;
  addToRecent: (appId: string) => void;
  getAppById: (appId: string) => App | undefined;
  getOpenApp: (appId: string) => AppWindow | undefined;
}

export const useAppStore = create<AppStore>((set, get) => ({
  registry: {},
  installedApps: [],
  openApps: [],
  pinnedApps: ['file-explorer', 'settings'],
  recentApps: [],

  registerApp: (app) => {
    const { registry, installedApps } = get();
    const updatedRegistry = { ...registry, [app.id]: app };
    const updatedInstalledApps = installedApps.find(a => a.id === app.id)
      ? installedApps
      : [...installedApps, app];

    set({
      registry: updatedRegistry,
      installedApps: updatedInstalledApps,
    });
  },

  openApp: (appId) => {
    const { openApps } = get();
    const existingApp = openApps.find(app => app.appId === appId);
    
    if (!existingApp) {
      const newApp: AppWindow = {
        appId,
        windowId: `window-${appId}-${Date.now()}`,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: { x: 100 + openApps.length * 30, y: 100 + openApps.length * 30 },
        size: { width: 800, height: 600 },
      };

      set({
        openApps: [...openApps, newApp],
      });
    } else {
      const updatedApps = openApps.map(app =>
        app.appId === appId ? { ...app, isMinimized: false } : app
      );
      set({ openApps: updatedApps });
    }
  },

  closeApp: (appId) => {
    const { openApps } = get();
    set({ openApps: openApps.filter(app => app.appId !== appId) });
  },

  pinApp: (appId) => {
    const { pinnedApps } = get();
    if (!pinnedApps.includes(appId)) {
      set({ pinnedApps: [...pinnedApps, appId] });
    }
  },

  unpinApp: (appId) => {
    const { pinnedApps } = get();
    set({ pinnedApps: pinnedApps.filter(id => id !== appId) });
  },

  addToRecent: (appId) => {
    const { recentApps } = get();
    const updatedRecent = [appId, ...recentApps.filter(id => id !== appId)].slice(0, 10);
    set({ recentApps: updatedRecent });
  },

  getAppById: (appId) => {
    const { registry } = get();
    return registry[appId];
  },

  getOpenApp: (appId) => {
    const { openApps } = get();
    return openApps.find(app => app.appId === appId);
  },
}));

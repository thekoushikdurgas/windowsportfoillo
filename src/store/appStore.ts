import { create } from 'zustand'
import { AppDefinition, AppInstance, AppState } from '@/types/app'
import { appRegistry } from '@/apps/appRegistry'

interface AppStoreState {
  // App registry and definitions
  apps: Record<string, AppDefinition>
  runningApps: Record<string, AppState>
  appInstances: Record<string, AppInstance>
  
  // Desktop and taskbar
  desktopIcons: Array<{
    id: string
    appId: string
    position: { x: number; y: number }
    name: string
    icon: string
    isSelected: boolean
  }>
  pinnedApps: string[]
  recentApps: string[]
  
  // App management
  actions: {
    // App registration
    registerApp: (app: AppDefinition) => void
    unregisterApp: (appId: string) => void
    
    // App lifecycle
    launchApp: (appId: string, args?: Record<string, any>) => string | null
    terminateApp: (instanceId: string) => void
    terminateAllInstances: (appId: string) => void
    
    // App state management
    updateAppState: (instanceId: string, updates: Partial<AppState>) => void
    getAppInstances: (appId: string) => AppInstance[]
    getRunningApps: () => AppState[]
    
    // Desktop icons
    addDesktopIcon: (icon: {
      id: string
      appId: string
      position: { x: number; y: number }
      name: string
      icon: string
      isSelected: boolean
    }) => void
    removeDesktopIcon: (id: string) => void
    updateDesktopIconPosition: (id: string, position: { x: number; y: number }) => void
    selectDesktopIcon: (id: string) => void
    deselectAllDesktopIcons: () => void
    
    // Pinned apps
    pinApp: (appId: string) => void
    unpinApp: (appId: string) => void
    isAppPinned: (appId: string) => boolean
    
    // Recent apps
    addRecentApp: (appId: string) => void
    clearRecentApps: () => void
    getRecentApps: (limit?: number) => string[]
    
    // App search
    searchApps: (query: string) => AppDefinition[]
    getAppsByCategory: (category: string) => AppDefinition[]
    getSystemApps: () => AppDefinition[]
    getUserApps: () => AppDefinition[]
    
    // App permissions
    grantPermission: (appId: string, permissionId: string) => void
    revokePermission: (appId: string, permissionId: string) => void
    hasPermission: (appId: string, permissionId: string) => boolean
  }
}

// Initialize with default apps
const initializeApps = () => {
  const apps: Record<string, AppDefinition> = {}
  appRegistry.forEach(app => {
    apps[app.id] = app
  })
  return apps
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  apps: initializeApps(),
  runningApps: {},
  appInstances: {},
  desktopIcons: [],
  pinnedApps: ['calculator', 'notepad', 'file-explorer', 'settings'],
  recentApps: [],
  
  actions: {
    registerApp: (app) => {
      set((state) => ({
        apps: {
          ...state.apps,
          [app.id]: app,
        },
      }))
    },
    
    unregisterApp: (appId) => {
      set((state) => {
        const { [appId]: removed, ...apps } = state.apps
        return { apps }
      })
    },
    
    launchApp: (appId, args = {}) => {
      const state = get()
      const app = state.apps[appId]
      
      if (!app) {
        console.error(`App ${appId} not found`)
        return null
      }
      
      // Check if app supports multiple instances
      if (!app.supportsMultipleInstances) {
        const existingInstance = Object.values(state.appInstances).find(
          instance => instance.appId === appId
        )
        if (existingInstance) {
          return existingInstance.id
        }
      }
      
      const instanceId = `instance-${appId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const windowId = `window-${instanceId}`
      
      const instance: AppInstance = {
        id: instanceId,
        appId,
        windowId,
        args,
        createdAt: new Date(),
        lastActive: new Date(),
      }
      
      const appState: AppState = {
        id: instanceId,
        isRunning: true,
        windowId,
        lastUsed: new Date(),
        usageCount: 1,
      }
      
      set((state) => ({
        appInstances: {
          ...state.appInstances,
          [instanceId]: instance,
        },
        runningApps: {
          ...state.runningApps,
          [instanceId]: appState,
        },
      }))
      
      // Add to recent apps
      get().actions.addRecentApp(appId)
      
      return instanceId
    },
    
    terminateApp: (instanceId) => {
      set((state) => {
        const { [instanceId]: removedInstance, ...appInstances } = state.appInstances
        const { [instanceId]: removedState, ...runningApps } = state.runningApps
        
        return {
          appInstances,
          runningApps,
        }
      })
    },
    
    terminateAllInstances: (appId) => {
      set((state) => {
        const instancesToRemove = Object.values(state.appInstances)
          .filter(instance => instance.appId === appId)
          .map(instance => instance.id)
        
        const newAppInstances = { ...state.appInstances }
        const newRunningApps = { ...state.runningApps }
        
        instancesToRemove.forEach(instanceId => {
          delete newAppInstances[instanceId]
          delete newRunningApps[instanceId]
        })
        
        return {
          appInstances: newAppInstances,
          runningApps: newRunningApps,
        }
      })
    },
    
    updateAppState: (instanceId, updates) => {
      set((state) => ({
        runningApps: {
          ...state.runningApps,
          [instanceId]: {
            ...state.runningApps[instanceId],
            ...updates,
          },
        },
      }))
    },
    
    getAppInstances: (appId) => {
      const state = get()
      return Object.values(state.appInstances).filter(instance => instance.appId === appId)
    },
    
    getRunningApps: () => {
      const state = get()
      return Object.values(state.runningApps)
    },
    
    addDesktopIcon: (icon) => {
      set((state) => ({
        desktopIcons: [...state.desktopIcons, icon],
      }))
    },
    
    removeDesktopIcon: (id) => {
      set((state) => ({
        desktopIcons: state.desktopIcons.filter(icon => icon.id !== id),
      }))
    },
    
    updateDesktopIconPosition: (id, position) => {
      set((state) => ({
        desktopIcons: state.desktopIcons.map(icon =>
          icon.id === id ? { ...icon, position } : icon
        ),
      }))
    },
    
    selectDesktopIcon: (id) => {
      set((state) => ({
        desktopIcons: state.desktopIcons.map(icon =>
          icon.id === id ? { ...icon, isSelected: true } : { ...icon, isSelected: false }
        ),
      }))
    },
    
    deselectAllDesktopIcons: () => {
      set((state) => ({
        desktopIcons: state.desktopIcons.map(icon => ({
          ...icon,
          isSelected: false,
        })),
      }))
    },
    
    pinApp: (appId) => {
      set((state) => ({
        pinnedApps: [...state.pinnedApps.filter(id => id !== appId), appId],
      }))
    },
    
    unpinApp: (appId) => {
      set((state) => ({
        pinnedApps: state.pinnedApps.filter(id => id !== appId),
      }))
    },
    
    isAppPinned: (appId) => {
      const state = get()
      return state.pinnedApps.includes(appId)
    },
    
    addRecentApp: (appId) => {
      set((state) => ({
        recentApps: [appId, ...state.recentApps.filter(id => id !== appId)].slice(0, 10),
      }))
    },
    
    clearRecentApps: () => {
      set({ recentApps: [] })
    },
    
    getRecentApps: (limit = 10) => {
      const state = get()
      return state.recentApps.slice(0, limit)
    },
    
    searchApps: (query) => {
      const state = get()
      const lowercaseQuery = query.toLowerCase()
      return Object.values(state.apps).filter(app =>
        app.name.toLowerCase().includes(lowercaseQuery) ||
        app.description?.toLowerCase().includes(lowercaseQuery) ||
        app.category.toLowerCase().includes(lowercaseQuery)
      )
    },
    
    getAppsByCategory: (category) => {
      const state = get()
      return Object.values(state.apps).filter(app => app.category === category)
    },
    
    getSystemApps: () => {
      const state = get()
      return Object.values(state.apps).filter(app => app.isSystemApp)
    },
    
    getUserApps: () => {
      const state = get()
      return Object.values(state.apps).filter(app => !app.isSystemApp)
    },
    
    grantPermission: (appId, permissionId) => {
      set((state) => {
        const app = state.apps[appId]
        if (app && app.permissions) {
          const updatedPermissions = app.permissions.map(permission =>
            permission.id === permissionId
              ? { ...permission, granted: true }
              : permission
          )
          
          return {
            apps: {
              ...state.apps,
              [appId]: {
                ...app,
                permissions: updatedPermissions,
              },
            },
          }
        }
        return state
      })
    },
    
    revokePermission: (appId, permissionId) => {
      set((state) => {
        const app = state.apps[appId]
        if (app && app.permissions) {
          const updatedPermissions = app.permissions.map(permission =>
            permission.id === permissionId
              ? { ...permission, granted: false }
              : permission
          )
          
          return {
            apps: {
              ...state.apps,
              [appId]: {
                ...app,
                permissions: updatedPermissions,
              },
            },
          }
        }
        return state
      })
    },
    
    hasPermission: (appId, permissionId) => {
      const state = get()
      const app = state.apps[appId]
      if (app && app.permissions) {
        const permission = app.permissions.find(p => p.id === permissionId)
        return permission ? permission.granted : false
      }
      return false
    },
  },
}))

export const useApps = () => useAppStore((state) => state.apps)
export const useRunningApps = () => useAppStore((state) => state.runningApps)
export const useAppInstances = () => useAppStore((state) => state.appInstances)
export const useDesktopIcons = () => useAppStore((state) => state.desktopIcons)
export const usePinnedApps = () => useAppStore((state) => state.pinnedApps)
export const useRecentApps = () => useAppStore((state) => state.recentApps)
export const useAppActions = () => useAppStore((state) => state.actions)

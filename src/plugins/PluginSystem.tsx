'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useNotificationActions } from '@/store/notificationStore'

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  icon?: string
  main: string
  dependencies?: Record<string, string>
  permissions?: string[]
  apiVersion: string
  minOSVersion?: string
  maxOSVersion?: string
}

export interface PluginAPI {
  id: string
  name: string
  version: string
  description: string
  author: string
  icon?: string
  component?: React.ComponentType<any>
  hooks?: Record<string, Function>
  commands?: Record<string, Function>
  events?: Record<string, Function>
  settings?: Record<string, any>
  enabled: boolean
  loaded: boolean
  error?: string
}

export interface PluginContextType {
  plugins: PluginAPI[]
  loadPlugin: (manifest: PluginManifest) => Promise<boolean>
  unloadPlugin: (pluginId: string) => Promise<boolean>
  enablePlugin: (pluginId: string) => Promise<boolean>
  disablePlugin: (pluginId: string) => Promise<boolean>
  getPlugin: (pluginId: string) => PluginAPI | undefined
  executeCommand: (pluginId: string, command: string, ...args: any[]) => any
  emitEvent: (event: string, data?: any) => void
  subscribeToEvent: (event: string, callback: Function) => () => void
}

const PluginContext = createContext<PluginContextType | undefined>(undefined)

// Plugin registry
class PluginRegistry {
  private plugins: Map<string, PluginAPI> = new Map()
  private eventListeners: Map<string, Set<Function>> = new Map()
  private loadedModules: Map<string, any> = new Map()

  register(plugin: PluginAPI) {
    this.plugins.set(plugin.id, plugin)
  }

  unregister(pluginId: string) {
    this.plugins.delete(pluginId)
    this.loadedModules.delete(pluginId)
  }

  get(pluginId: string): PluginAPI | undefined {
    return this.plugins.get(pluginId)
  }

  getAll(): PluginAPI[] {
    return Array.from(this.plugins.values())
  }

  getEnabled(): PluginAPI[] {
    return Array.from(this.plugins.values()).filter(plugin => plugin.enabled)
  }

  async loadModule(pluginId: string, modulePath: string): Promise<any> {
    if (this.loadedModules.has(pluginId)) {
      return this.loadedModules.get(pluginId)
    }

    try {
      // In a real implementation, this would load the actual module
      // For now, we'll simulate loading
      const module = await import(/* webpackIgnore: true */ modulePath)
      this.loadedModules.set(pluginId, module)
      return module
    } catch (error) {
      console.error(`Failed to load module for plugin ${pluginId}:`, error)
      throw error
    }
  }

  emitEvent(event: string, data?: any) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  subscribeToEvent(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)

    return () => {
      const listeners = this.eventListeners.get(event)
      if (listeners) {
        listeners.delete(callback)
      }
    }
  }
}

const pluginRegistry = new PluginRegistry()

export const PluginProvider = ({ children }: { children: ReactNode }) => {
  const [plugins, setPlugins] = useState<PluginAPI[]>([])
  const { addNotification } = useNotificationActions()

  // Load plugins from localStorage on mount
  useEffect(() => {
    const savedPlugins = localStorage.getItem('durgasos_plugins')
    if (savedPlugins) {
      try {
        const parsedPlugins = JSON.parse(savedPlugins)
        parsedPlugins.forEach((plugin: PluginAPI) => {
          pluginRegistry.register(plugin)
        })
        setPlugins(pluginRegistry.getAll())
      } catch (error) {
        console.error('Failed to load saved plugins:', error)
      }
    }
  }, [])

  // Save plugins to localStorage when they change
  useEffect(() => {
    localStorage.setItem('durgasos_plugins', JSON.stringify(plugins))
  }, [plugins])

  const loadPlugin = async (manifest: PluginManifest): Promise<boolean> => {
    try {
      // Check if plugin already exists
      if (pluginRegistry.get(manifest.id)) {
        throw new Error(`Plugin ${manifest.id} is already loaded`)
      }

      // Validate manifest
      if (!manifest.id || !manifest.name || !manifest.version) {
        throw new Error('Invalid plugin manifest')
      }

      // Check API version compatibility
      if (manifest.apiVersion !== '1.0.0') {
        throw new Error(`Unsupported API version: ${manifest.apiVersion}`)
      }

      // Create plugin API object
      const plugin: PluginAPI = {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
        icon: manifest.icon,
        enabled: true,
        loaded: false,
        settings: {}
      }

      // Load plugin module
      try {
        const module = await pluginRegistry.loadModule(manifest.id, manifest.main)
        
        if (module.default) {
          plugin.component = module.default
        }
        
        if (module.hooks) {
          plugin.hooks = module.hooks
        }
        
        if (module.commands) {
          plugin.commands = module.commands
        }
        
        if (module.events) {
          plugin.events = module.events
        }

        plugin.loaded = true
      } catch (error) {
        plugin.error = `Failed to load module: ${error}`
        plugin.loaded = false
      }

      // Register plugin
      pluginRegistry.register(plugin)
      setPlugins(pluginRegistry.getAll())

      addNotification({
        title: 'Plugin Loaded',
        message: `${manifest.name} has been loaded successfully`,
        type: 'success',
        priority: 'low',
        source: 'plugin-system'
      })

      return true
    } catch (error) {
      console.error('Failed to load plugin:', error)
      addNotification({
        title: 'Plugin Load Failed',
        message: `Failed to load plugin: ${error}`,
        type: 'error',
        priority: 'normal',
        source: 'plugin-system'
      })
      return false
    }
  }

  const unloadPlugin = async (pluginId: string): Promise<boolean> => {
    try {
      const plugin = pluginRegistry.get(pluginId)
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`)
      }

      // Unregister plugin
      pluginRegistry.unregister(pluginId)
      setPlugins(pluginRegistry.getAll())

      addNotification({
        title: 'Plugin Unloaded',
        message: `${plugin.name} has been unloaded`,
        type: 'info',
        priority: 'low',
        source: 'plugin-system'
      })

      return true
    } catch (error) {
      console.error('Failed to unload plugin:', error)
      addNotification({
        title: 'Plugin Unload Failed',
        message: `Failed to unload plugin: ${error}`,
        type: 'error',
        priority: 'normal',
        source: 'plugin-system'
      })
      return false
    }
  }

  const enablePlugin = async (pluginId: string): Promise<boolean> => {
    try {
      const plugin = pluginRegistry.get(pluginId)
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`)
      }

      plugin.enabled = true
      setPlugins(pluginRegistry.getAll())

      addNotification({
        title: 'Plugin Enabled',
        message: `${plugin.name} has been enabled`,
        type: 'success',
        priority: 'low',
        source: 'plugin-system'
      })

      return true
    } catch (error) {
      console.error('Failed to enable plugin:', error)
      return false
    }
  }

  const disablePlugin = async (pluginId: string): Promise<boolean> => {
    try {
      const plugin = pluginRegistry.get(pluginId)
      if (!plugin) {
        throw new Error(`Plugin ${pluginId} not found`)
      }

      plugin.enabled = false
      setPlugins(pluginRegistry.getAll())

      addNotification({
        title: 'Plugin Disabled',
        message: `${plugin.name} has been disabled`,
        type: 'info',
        priority: 'low',
        source: 'plugin-system'
      })

      return true
    } catch (error) {
      console.error('Failed to disable plugin:', error)
      return false
    }
  }

  const getPlugin = (pluginId: string): PluginAPI | undefined => {
    return pluginRegistry.get(pluginId)
  }

  const executeCommand = (pluginId: string, command: string, ...args: any[]): any => {
    const plugin = pluginRegistry.get(pluginId)
    if (!plugin || !plugin.enabled || !plugin.loaded) {
      throw new Error(`Plugin ${pluginId} is not available`)
    }

    if (!plugin.commands || !plugin.commands[command]) {
      throw new Error(`Command ${command} not found in plugin ${pluginId}`)
    }

    return plugin.commands[command](...args)
  }

  const emitEvent = (event: string, data?: any) => {
    pluginRegistry.emitEvent(event, data)
  }

  const subscribeToEvent = (event: string, callback: Function) => {
    return pluginRegistry.subscribeToEvent(event, callback)
  }

  const value: PluginContextType = {
    plugins,
    loadPlugin,
    unloadPlugin,
    enablePlugin,
    disablePlugin,
    getPlugin,
    executeCommand,
    emitEvent,
    subscribeToEvent
  }

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  )
}

export const usePlugins = () => {
  const context = useContext(PluginContext)
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider')
  }
  return context
}

// Plugin manager component
export const PluginManager = () => {
  const { plugins, loadPlugin, unloadPlugin, enablePlugin, disablePlugin } = usePlugins()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadPlugin = async (manifest: PluginManifest) => {
    setIsLoading(true)
    try {
      await loadPlugin(manifest)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnloadPlugin = async (pluginId: string) => {
    setIsLoading(true)
    try {
      await unloadPlugin(pluginId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePlugin = async (pluginId: string, enabled: boolean) => {
    setIsLoading(true)
    try {
      if (enabled) {
        await enablePlugin(pluginId)
      } else {
        await disablePlugin(pluginId)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Plugin Manager</h2>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load Plugin'}
        </button>
      </div>

      <div className="space-y-4">
        {plugins.map(plugin => (
          <div
            key={plugin.id}
            className="p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {plugin.icon && (
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">{plugin.icon}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{plugin.name}</h3>
                  <p className="text-gray-400 text-sm">{plugin.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-gray-500 text-xs">v{plugin.version}</span>
                    <span className="text-gray-500 text-xs">by {plugin.author}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      plugin.enabled 
                        ? 'bg-green-500 bg-opacity-20 text-green-400' 
                        : 'bg-red-500 bg-opacity-20 text-red-400'
                    }`}>
                      {plugin.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    {plugin.loaded ? (
                      <span className="text-xs px-2 py-1 rounded bg-blue-500 bg-opacity-20 text-blue-400">
                        Loaded
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500 bg-opacity-20 text-yellow-400">
                        Error
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTogglePlugin(plugin.id, !plugin.enabled)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    plugin.enabled
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  disabled={isLoading}
                >
                  {plugin.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleUnloadPlugin(plugin.id)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                  disabled={isLoading}
                >
                  Unload
                </button>
              </div>
            </div>
            
            {plugin.error && (
              <div className="mt-3 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded text-red-400 text-sm">
                {plugin.error}
              </div>
            )}
          </div>
        ))}
        
        {plugins.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No plugins loaded</p>
            <p className="text-sm">Load a plugin to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Plugin hook for easy integration
export const usePlugin = (pluginId: string) => {
  const { getPlugin, executeCommand, emitEvent, subscribeToEvent } = usePlugins()
  
  const plugin = getPlugin(pluginId)
  
  const callCommand = (command: string, ...args: any[]) => {
    return executeCommand(pluginId, command, ...args)
  }
  
  const emit = (event: string, data?: any) => {
    emitEvent(event, data)
  }
  
  const subscribe = (event: string, callback: Function) => {
    return subscribeToEvent(event, callback)
  }
  
  return {
    plugin,
    callCommand,
    emit,
    subscribe,
    isLoaded: plugin?.loaded || false,
    isEnabled: plugin?.enabled || false
  }
}

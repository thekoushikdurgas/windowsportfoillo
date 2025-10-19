'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings, useSettingsActions } from '@/store/settingsStore'
import { useDesktopActions } from '@/store/desktopStore'
import { useNotificationActions } from '@/store/notificationStore'
import { useAppActions } from '@/store/appStore'
import { 
  Settings as SettingsIcon, 
  Palette, 
  Keyboard, 
  Bell, 
  Monitor, 
  User, 
  Shield, 
  Database,
  ChevronRight,
  Check,
  X
} from 'lucide-react'

interface SettingsSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
}

const settingsSections: SettingsSection[] = [
  {
    id: 'personalization',
    title: 'Personalization',
    icon: <Palette className="w-5 h-5" />,
    description: 'Wallpaper, theme, and appearance settings'
  },
  {
    id: 'keyboard',
    title: 'Keyboard & Shortcuts',
    icon: <Keyboard className="w-5 h-5" />,
    description: 'Keyboard shortcuts and input settings'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Bell className="w-5 h-5" />,
    description: 'Notification preferences and settings'
  },
  {
    id: 'display',
    title: 'Display',
    icon: <Monitor className="w-5 h-5" />,
    description: 'Display settings and resolution'
  },
  {
    id: 'account',
    title: 'Account',
    icon: <User className="w-5 h-5" />,
    description: 'User account and profile settings'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: <Shield className="w-5 h-5" />,
    description: 'Privacy controls and security settings'
  },
  {
    id: 'system',
    title: 'System',
    icon: <Database className="w-5 h-5" />,
    description: 'System information and advanced settings'
  }
]

export default function Settings() {
  const [activeSection, setActiveSection] = useState('personalization')
  const settings = useSettings()
  const { updateSettings } = useSettingsActions()
  const { updateWallpaper, updateTheme, updateTaskbarPosition } = useDesktopActions()
  const { addNotification } = useNotificationActions()
  const { getInstalledApps } = useAppActions()

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    addNotification({
      title: 'Settings Updated',
      message: `${key} has been updated successfully.`,
      type: 'success',
      priority: 'low',
      source: 'settings'
    })
  }

  const renderPersonalizationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={settings.personalization.theme}
              onChange={(e) => {
                const theme = e.target.value as 'light' | 'dark' | 'auto'
                handleSettingChange('personalization.theme', theme)
                updateTheme(theme)
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Accent Color
            </label>
            <div className="flex space-x-2">
              {['#0078d4', '#107c10', '#d83b01', '#ff8c00', '#e3008c', '#8764b8'].map((color) => (
                <button
                  key={color}
                  onClick={() => handleSettingChange('personalization.accentColor', color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    settings.personalization.accentColor === color
                      ? 'border-white'
                      : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wallpaper
            </label>
            <select
              value={settings.personalization.wallpaper}
              onChange={(e) => {
                const wallpaper = e.target.value
                handleSettingChange('personalization.wallpaper', wallpaper)
                updateWallpaper(wallpaper)
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="windows-11-default.svg">Windows 11 Default</option>
              <option value="solid-color">Solid Color</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Taskbar</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Taskbar Position
            </label>
            <select
              value={settings.personalization.taskbarPosition}
              onChange={(e) => {
                const position = e.target.value as 'bottom' | 'top' | 'left' | 'right'
                handleSettingChange('personalization.taskbarPosition', position)
                updateTaskbarPosition(position)
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Show Taskbar
              </label>
              <p className="text-xs text-gray-500">Always show the taskbar</p>
            </div>
            <button
              onClick={() => handleSettingChange('personalization.showTaskbar', !settings.personalization.showTaskbar)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.personalization.showTaskbar ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.personalization.showTaskbar ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderKeyboardSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Enable Global Shortcuts
              </label>
              <p className="text-xs text-gray-500">Allow keyboard shortcuts to work globally</p>
            </div>
            <button
              onClick={() => handleSettingChange('keyboard.globalShortcutsEnabled', !settings.keyboard.globalShortcutsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.keyboard.globalShortcutsEnabled ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.keyboard.globalShortcutsEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Shortcuts
            </label>
            <div className="space-y-2">
              {settings.keyboard.customShortcuts.map((shortcut) => (
                <div key={shortcut.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-white text-sm">{shortcut.description}</span>
                    <p className="text-gray-400 text-xs">
                      {shortcut.modifiers?.join(' + ')} + {shortcut.key}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('keyboard.customShortcuts', 
                      settings.keyboard.customShortcuts.map(s => 
                        s.id === shortcut.id ? { ...s, isEnabled: !s.isEnabled } : s
                      )
                    )}
                    className={`w-8 h-8 rounded flex items-center justify-center ${
                      shortcut.isEnabled ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    {shortcut.isEnabled ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Show Notification Banners
              </label>
              <p className="text-xs text-gray-500">Display notification banners on screen</p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications.showBanners', !settings.notifications.showBanners)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.notifications.showBanners ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notifications.showBanners ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Play Notification Sounds
              </label>
              <p className="text-xs text-gray-500">Play sounds for notifications</p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications.playSounds', !settings.notifications.playSounds)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.notifications.playSounds ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notifications.playSounds ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Do Not Disturb
              </label>
              <p className="text-xs text-gray-500">Suppress all notifications</p>
            </div>
            <button
              onClick={() => handleSettingChange('notifications.doNotDisturb', !settings.notifications.doNotDisturb)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.notifications.doNotDisturb ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.notifications.doNotDisturb ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">App Notifications</h3>
        <div className="space-y-2">
          {Object.entries(settings.notifications.appNotifications).map(([appId, enabled]) => (
            <div key={appId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span className="text-white text-sm capitalize">{appId.replace('-', ' ')}</span>
              <button
                onClick={() => handleSettingChange('notifications.appNotifications', {
                  ...settings.notifications.appNotifications,
                  [appId]: !enabled
                })}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  enabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                {enabled ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => {
    const installedApps = getInstalledApps()
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300 text-sm">OS Version:</span>
              <span className="text-white ml-2">DurgasOS 1.0.0</span>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300 text-sm">Installed Apps:</span>
              <span className="text-white ml-2">{installedApps.length}</span>
            </div>
            <div className="p-3 bg-gray-700 rounded-lg">
              <span className="text-gray-300 text-sm">Memory Usage:</span>
              <span className="text-white ml-2">~{Math.round(performance.memory?.usedJSHeapSize / 1024 / 1024 || 0)} MB</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Installed Applications</h3>
          <div className="space-y-2">
            {installedApps.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <span className="text-white text-sm">{app.name}</span>
                    <p className="text-gray-400 text-xs">{app.description}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{app.version}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personalization':
        return renderPersonalizationSettings()
      case 'keyboard':
        return renderKeyboardSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'system':
        return renderSystemSettings()
      default:
        return (
          <div className="text-center text-gray-400 py-8">
            <SettingsIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Settings for {activeSection} are coming soon!</p>
          </div>
        )
    }
  }

  return (
    <div className="w-full h-full bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        <nav className="space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {section.icon}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{section.title}</div>
                <div className="text-xs text-gray-400 truncate">{section.description}</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
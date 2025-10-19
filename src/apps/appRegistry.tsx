import { AppDefinition } from '@/types/app'
import Calculator from '@/components/apps/Calculator/Calculator'
import Notepad from '@/components/apps/Notepad/Notepad'
import AboutMe from '@/components/apps/AboutMe/AboutMe'
import FileExplorer from '@/components/apps/FileExplorer/FileExplorer'
import Settings from '@/components/apps/Settings/Settings'

export const appRegistry: AppDefinition[] = [
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    component: Calculator,
    defaultSize: { width: 400, height: 500 },
    defaultPosition: { x: 100, y: 100 },
    category: 'utilities',
    description: 'Perform basic and scientific calculations',
    version: '1.0.0',
    isSystemApp: true
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: '📝',
    component: Notepad,
    defaultSize: { width: 600, height: 400 },
    defaultPosition: { x: 150, y: 150 },
    category: 'productivity',
    description: 'Simple text editor for notes and documents',
    version: '1.0.0',
    isSystemApp: true
  },
  {
    id: 'about-me',
    name: 'About Me',
    icon: '👤',
    component: AboutMe,
    defaultSize: { width: 500, height: 400 },
    defaultPosition: { x: 200, y: 200 },
    category: 'personal',
    description: 'Personal information and portfolio',
    version: '1.0.0',
    isSystemApp: false
  },
  {
    id: 'file-explorer',
    name: 'File Explorer',
    icon: '📁',
    component: FileExplorer,
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 50, y: 50 },
    category: 'system',
    description: 'Browse and manage files and folders',
    version: '1.0.0',
    isSystemApp: true
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: Settings,
    defaultSize: { width: 1000, height: 700 },
    defaultPosition: { x: 100, y: 100 },
    category: 'system',
    description: 'System settings and preferences',
    version: '1.0.0',
    isSystemApp: true
  }
]

// Create a map for easy lookup
export const appRegistryMap = appRegistry.reduce((acc, app) => {
  acc[app.id] = app
  return acc
}, {} as Record<string, AppDefinition>)

// Get apps by category
export const getAppsByCategory = (category: string) => 
  appRegistry.filter(app => app.category === category)

// Get system apps
export const getSystemApps = () => 
  appRegistry.filter(app => app.isSystemApp)

// Get user apps
export const getUserApps = () => 
  appRegistry.filter(app => !app.isSystemApp)

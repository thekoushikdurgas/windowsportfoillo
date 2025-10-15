'use client';

import { useEffect } from 'react';
import Desktop from '@/components/system/Desktop';
import { useAppStore } from '@/store/appStore';
import AboutMeApp from '@/components/apps/AboutMe/AboutMeApp';
import FileExplorerApp from '@/components/apps/FileExplorer/FileExplorerApp';
import SettingsApp from '@/components/apps/Settings/SettingsApp';
import CalculatorApp from '@/components/apps/Calculator/CalculatorApp';
import NotepadApp from '@/components/apps/Notepad/NotepadApp';

export default function HomePage() {
  const { registerApp } = useAppStore();

  useEffect(() => {
    // Register system apps
    const apps = [
      {
        id: 'about-me',
        name: 'About Me',
        icon: '👤',
        component: AboutMeApp,
        category: 'utilities' as const,
        description: 'Personal information and portfolio',
      },
      {
        id: 'file-explorer',
        name: 'File Explorer',
        icon: '📁',
        component: FileExplorerApp,
        category: 'system' as const,
        description: 'Browse files and folders',
      },
      {
        id: 'settings',
        name: 'Settings',
        icon: '⚙️',
        component: SettingsApp,
        category: 'system' as const,
        description: 'System settings and preferences',
      },
      {
        id: 'calculator',
        name: 'Calculator',
        icon: '🧮',
        component: CalculatorApp,
        category: 'utilities' as const,
        description: 'Basic calculator application',
      },
      {
        id: 'notepad',
        name: 'Notepad',
        icon: '📝',
        component: NotepadApp,
        category: 'utilities' as const,
        description: 'Simple text editor',
      },
    ];

    apps.forEach(app => registerApp(app));
  }, [registerApp]);

  return <Desktop />;
}

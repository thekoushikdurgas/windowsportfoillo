'use client';

import { memo } from 'react';
import { useWindowStore } from '@/store/windowStore';
import { useAppStore } from '@/store/appStore';
import Window from '@/components/ui/Window';
import AboutMeApp from '@/components/apps/AboutMe/AboutMeApp';
import FileExplorerApp from '@/components/apps/FileExplorer/FileExplorerApp';
import SettingsApp from '@/components/apps/Settings/SettingsApp';
import CalculatorApp from '@/components/apps/Calculator/CalculatorApp';
import NotepadApp from '@/components/apps/Notepad/NotepadApp';

const WindowManager = memo(function WindowManager() {
  const { windows } = useWindowStore();
  const { getAppById } = useAppStore();

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'about-me':
        return <AboutMeApp />;
      case 'file-explorer':
        return <FileExplorerApp />;
      case 'settings':
        return <SettingsApp />;
      case 'calculator':
        return <CalculatorApp />;
      case 'notepad':
        return <NotepadApp />;
      default:
        const app = getAppById(appId);
        if (app && app.component) {
          const AppComponent = app.component;
          return <AppComponent />;
        }
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Application</h2>
            <p className="text-windows-text-light">
              Application not found: {appId}
            </p>
          </div>
        );
    }
  };

  return (
    <>
      {windows.map((windowItem) => (
        <Window
          key={windowItem.id}
          id={windowItem.id}
          title={windowItem.title}
          appId={windowItem.appId}
          position={windowItem.position}
          size={windowItem.size}
          isMinimized={windowItem.isMinimized}
          isMaximized={windowItem.isMaximized}
          isFocused={windowItem.isFocused}
          zIndex={windowItem.zIndex}
        >
          {renderAppContent(windowItem.appId)}
        </Window>
      ))}
    </>
  );
});

export default WindowManager;

import { Window } from "./Window";
import { AboutMeApp } from "./apps/AboutMeApp";
import { PortfolioApp } from "./apps/PortfolioApp";
import { BrowserApp } from "./apps/BrowserApp";
import { AppStoreApp } from "./apps/AppStoreApp";
import { FileExplorerApp } from "./apps/FileExplorerApp";
import { SettingsApp } from "./apps/SettingsApp";
import type { WindowState } from "@shared/schema";

interface WindowManagerProps {
  windows: WindowState[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateSize: (id: string, size: { width: number; height: number }) => void;
}

export function WindowManager({
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
}: WindowManagerProps) {
  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "about-me":
        return <AboutMeApp />;
      case "portfolio":
        return <PortfolioApp />;
      case "browser":
        return <BrowserApp />;
      case "app-store":
        return <AppStoreApp />;
      case "file-explorer":
        return <FileExplorerApp />;
      case "settings":
        return <SettingsApp />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60 text-sm">Application coming soon...</p>
          </div>
        );
    }
  };

  return (
    <>
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={() => onClose(window.id)}
          onMinimize={() => onMinimize(window.id)}
          onMaximize={() => onMaximize(window.id)}
          onFocus={() => onFocus(window.id)}
          onUpdatePosition={(position) => onUpdatePosition(window.id, position)}
          onUpdateSize={(size) => onUpdateSize(window.id, size)}
        >
          {renderAppContent(window.appId)}
        </Window>
      ))}
    </>
  );
}

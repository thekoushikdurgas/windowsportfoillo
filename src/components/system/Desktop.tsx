'use client';

import { useCallback, useEffect } from 'react';
import { AppWindow } from '@/components/shared/AppWindow';
import { useDesktop } from '@/context/DesktopContext';
import { apps } from '@/lib/apps.config';
import { DesktopIcon } from '@/components/shared/DesktopIcon';
import { KeyboardShortcutsHandler } from './KeyboardShortcutsHandler';
import { FallbackImage } from '@/components/shared/FallbackImage';
import { useSettingsStore } from '@/store/settingsStore';
import { wallpapers } from '@/lib/wallpapers';
import { DesktopSearch } from './DesktopSearch';
import { DesktopWidget } from './DesktopWidget';
import { useDesktopSearch } from '@/hooks/use-desktop-search';
import { useDesktopWidgets } from '@/hooks/use-desktop-widgets';
import { useContextMenu } from '@/hooks/use-context-menu';

export function Desktop() {
  const { windows, cascadeWindows, tileWindowsHorizontal, tileWindowsVertical } = useDesktop();
  const { wallpaper: wallpaperId } = useSettingsStore();
  const wallpaper = wallpapers.find((p) => p.id === wallpaperId);
  const desktopApps = apps.filter(app => app.desktop);
  
  // Desktop features
  const { isOpen: isSearchOpen, openSearch, closeSearch } = useDesktopSearch();
  const { widgets, getVisibleWidgets, addWidget, removeWidget, updateWidget, startDrag, handleDrag, stopDrag } = useDesktopWidgets();
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  // Handle desktop click
  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hideContextMenu();
    }
  }, [hideContextMenu]);

  // Handle desktop context menu
  const handleDesktopContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(e, 'desktop');
  }, [showContextMenu]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Super') {
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  // Get current desktop
  const visibleWidgets = getVisibleWidgets();

  return (
    <div 
      className="relative h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
      data-testid="desktop"
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
    >
      <KeyboardShortcutsHandler />
      
      {/* Wallpaper */}
      {wallpaper && (
        <div className="absolute inset-0">
          <FallbackImage
            src={wallpaper.imageUrl}
            alt={wallpaper.description || 'Desktop wallpaper'}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/30" />
        </div>
      )}
      
      {/* Desktop Icons */}
      <div className="absolute top-6 left-6 grid grid-cols-1 gap-3">
        {desktopApps.map((app, index) => (
          <div
            key={app.id}
            className="animate-fade-in hover-lift"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <DesktopIcon app={app} />
          </div>
        ))}
      </div>

      {/* Desktop Widgets */}
      {visibleWidgets.map(widget => (
        <DesktopWidget
          key={widget.id}
          widget={widget}
          onUpdate={updateWidget}
          onRemove={removeWidget}
          onFocus={(widgetId) => {
            const widget = widgets.find(w => w.id === widgetId);
            if (widget) {
              updateWidget(widgetId, { zIndex: Math.max(...widgets.map(w => w.zIndex)) + 1 });
            }
          }}
          onStartDrag={startDrag}
          onDrag={handleDrag}
          onStopDrag={stopDrag}
          zIndex={widget.zIndex}
        />
      ))}

      {/* Application Windows */}
      {windows.map((win) => (
        <AppWindow
          key={win.id}
          id={win.id}
          app={win.app}
          data={win.data || {}}
          zIndex={win.zIndex}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          position={win.position}
          size={win.size}
        />
      ))}

      {/* Desktop Search */}
      <DesktopSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />

      {/* Context Menu */}
      {contextMenu.isOpen && (
        <div
          className="fixed bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-50"
          // eslint-disable-next-line react/forbid-dom-props
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={hideContextMenu}
        >
          <div className="py-2">
            <button
              onClick={() => {
                openSearch();
                hideContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => {
                addWidget('clock');
                hideContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
            >
              Add Clock Widget
            </button>
            <button
              onClick={() => {
                addWidget('system-info');
                hideContextMenu();
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
            >
              Add System Info Widget
            </button>
            {windows.length > 1 && (
              <>
                <div className="border-t border-white/20 my-1"></div>
                <button
                  onClick={() => {
                    cascadeWindows();
                    hideContextMenu();
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                >
                  Cascade Windows
                </button>
                <button
                  onClick={() => {
                    tileWindowsHorizontal();
                    hideContextMenu();
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                >
                  Tile Windows Horizontally
                </button>
                <button
                  onClick={() => {
                    tileWindowsVertical();
                    hideContextMenu();
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                >
                  Tile Windows Vertically
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

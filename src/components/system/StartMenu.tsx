'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystemStore } from '@/store/systemStore';
import { useAppStore } from '@/store/appStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { VISUAL_EFFECTS, getAnimation } from '@/utils/visualEffects';
import AppIcon from '@/components/common/AppIcon';

const StartMenu = memo(function StartMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isStartMenuOpen, setStartMenuOpen } = useSystemStore();
  const { installedApps, pinnedApps, recentApps, openApp } = useAppStore();

  // Accessibility
  const { announceChange } = useAccessibility({
    announceOnMount: 'Start menu opened',
    announceOnUnmount: 'Start menu closed',
  });

  // Enhanced visual effects (memoized)
  const startMenuEffects = useMemo(() => VISUAL_EFFECTS.startMenu('light'), []);

  const handleAppClick = useCallback((appId: string) => {
    openApp(appId);
    setStartMenuOpen(false);
    announceChange(`Opened ${appId} application`);
  }, [openApp, setStartMenuOpen, announceChange]);

  const filteredApps = useMemo(() => 
    installedApps.filter(app =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [installedApps, searchQuery]);

  const pinnedAppObjects = installedApps.filter(app => pinnedApps.includes(app.id));
  const recentAppObjects = installedApps.filter(app => recentApps.includes(app.id));

  if (!isStartMenuOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: getAnimation('spring-normal')
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95, 
          y: 30,
          transition: getAnimation('ease-subtle')
        }}
        className="windows-start-menu fixed bottom-16 left-1/2 transform -translate-x-1/2 w-96 z-50 p-6"
        style={{ 
          height: '600px',
          ...startMenuEffects,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Start menu"
      >
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Type here to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="windows-input w-full px-4 py-3 text-lg"
            autoFocus
            aria-label="Search applications"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Search for applications by name
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-windows-text-light mb-3">
              Search Results
            </h3>
            <div className="space-y-1">
              {filteredApps.map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ x: 4 }}
                  className="windows-start-menu-item"
                  onClick={() => handleAppClick(app.id)}
                >
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <div className="font-medium text-windows-text">{app.name}</div>
                    {app.description && (
                      <div className="text-sm text-windows-text-light">{app.description}</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pinned Apps */}
        {!searchQuery && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-windows-text-light mb-3">
                Pinned
              </h3>
              <div className="grid grid-cols-6 gap-4">
                {pinnedAppObjects.map((app) => (
                  <AppIcon
                    key={app.id}
                    icon={app.icon}
                    name={app.name}
                    size="large"
                    onClick={() => handleAppClick(app.id)}
                  />
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-windows-text-light mb-3">
                Recommended
              </h3>
              <div className="space-y-1">
                {recentAppObjects.slice(0, 5).map((app) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ x: 4 }}
                    className="windows-start-menu-item"
                    onClick={() => handleAppClick(app.id)}
                  >
                    <span className="text-xl">{app.icon}</span>
                    <div>
                      <div className="font-medium text-windows-text">{app.name}</div>
                      <div className="text-sm text-windows-text-light">Recently used</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* User Profile and Power */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-windows-blue rounded-full flex items-center justify-center text-white font-medium">
                U
              </div>
              <div>
                <div className="font-medium text-windows-text text-sm">User</div>
                <div className="text-xs text-windows-text-light">Administrator</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="windows-taskbar-item"
                title="Settings"
                onClick={() => handleAppClick('settings')}
              >
                <span className="text-lg">⚙️</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="windows-taskbar-item"
                title="Power"
              >
                <span className="text-lg">⏻</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default StartMenu;

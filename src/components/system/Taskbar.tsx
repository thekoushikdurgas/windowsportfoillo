'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Volume2, 
  Wifi, 
  Battery, 
  ChevronUp,
  WifiOff,
  VolumeX,
  BatteryCharging,
  HelpCircle
} from 'lucide-react';
import { useSystemStore } from '@/store/systemStore';
import { useAppStore } from '@/store/appStore';
import useNotificationStore from '@/store/notificationStore';
import { useAccessibility } from '@/hooks/useAccessibility';
import { formatTime } from '@/utils/helpers';
import QuickSettings from './QuickSettings';
import NotificationCenter from './NotificationCenter';
import { getMicaStyles, MICA_VARIANTS } from '@/utils/mica';
import { VISUAL_EFFECTS, getShadow, getAnimation } from '@/utils/visualEffects';
import { useSystemSounds, useUISounds } from '@/hooks/useAudio';
import HelpSystem from './HelpSystem';

const Taskbar = memo(function Taskbar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const { taskbarItems, toggleStartMenu, isStartMenuOpen, systemStatus } = useSystemStore();
  const { openApp } = useAppStore();
  const { unreadCount, setNotificationCenterOpen } = useNotificationStore();
  
  // Mock volume for now - this should come from system store
  const volume = 50;

  // Accessibility
  const { announceChange } = useAccessibility();

  // Enhanced visual effects (memoized)
  const taskbarEffects = useMemo(() => VISUAL_EFFECTS.taskbar('light'), []);

  // Audio effects
  const { playTaskbarClick, playStartMenuOpen, playStartMenuClose } = useSystemSounds();
  const { playButtonClick, playButtonHover } = useUISounds();

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  });

  const handleTaskbarItemClick = useCallback((appId: string) => {
    if (appId === 'start-menu') {
      if (isStartMenuOpen) {
        playStartMenuClose();
      } else {
        playStartMenuOpen();
      }
      toggleStartMenu();
      announceChange('Start menu toggled');
    } else {
      playTaskbarClick();
      openApp(appId);
      announceChange(`Opened ${appId} application`);
    }
  }, [isStartMenuOpen, playStartMenuClose, playStartMenuOpen, playTaskbarClick, toggleStartMenu, openApp, announceChange]);

  const handleSystemTrayClick = useCallback((type: string) => {
    playButtonClick();
    switch (type) {
      case 'notifications':
        setShowNotifications(!showNotifications);
        setShowQuickSettings(false);
        setNotificationCenterOpen(!showNotifications);
        break;
      case 'quick-settings':
        setShowQuickSettings(!showQuickSettings);
        setShowNotifications(false);
        setShowHelp(false);
        break;
      case 'help':
        setShowHelp(!showHelp);
        setShowQuickSettings(false);
        setShowNotifications(false);
        break;
      case 'date-time':
        // Toggle calendar/notifications
        setShowNotifications(!showNotifications);
        setShowQuickSettings(false);
        setShowHelp(false);
        setNotificationCenterOpen(!showNotifications);
        break;
      default:
        break;
    }
  }, [playButtonClick, showNotifications, showQuickSettings, showHelp, setNotificationCenterOpen]);

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'volume':
        return volume > 0 ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        );
      case 'wifi':
        return systemStatus.wifi ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        );
      case 'battery':
        return systemStatus.charging ? (
          <BatteryCharging className="w-4 h-4" />
        ) : (
          <Battery className="w-4 h-4" />
        );
      case 'notifications':
        return <Bell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={getAnimation('spring-normal')}
          className="windows-taskbar fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-2"
          style={{ 
            height: 48,
            ...getMicaStyles(MICA_VARIANTS.taskbar),
            ...taskbarEffects,
          }}
        >
      {/* Left side - Start button and pinned apps */}
      <div className="flex items-center gap-1">
        {/* Start Button */}
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: getShadow('button-hover', { theme: 'light' })
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleStartMenu()}
          onMouseEnter={() => playButtonHover()}
          className="windows-taskbar-item"
          aria-label="Start menu"
          title="Start menu"
          transition={getAnimation('spring-subtle')}
        >
          <span className="text-lg">🪟</span>
        </motion.button>

        {/* Pinned Apps */}
        {taskbarItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ 
              scale: 1.1, 
              y: -2,
              boxShadow: getShadow('button-hover', { theme: 'light' })
            }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              scale: item.isActive ? 1.05 : 1,
              y: item.isActive ? -2 : 0
            }}
            transition={getAnimation('spring-normal')}
            onClick={() => handleTaskbarItemClick(item.appId)}
            onMouseEnter={() => playButtonHover()}
            className={`windows-taskbar-item ${item.isActive ? 'active' : ''}`}
            aria-label={`${item.appId} application`}
            title={`${item.appId} application`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.hasNotifications && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

        {/* Right side - System tray */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSystemTrayClick('notifications')}
            className="windows-taskbar-item relative"
            title="Notifications"
          >
            {getSystemIcon('notifications')}
            {/* Notification badge */}
            {unreadCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
              />
            )}
          </motion.button>

          {/* Volume */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSystemTrayClick('quick-settings')}
            className="windows-taskbar-item"
            title="Volume"
          >
            {getSystemIcon('volume')}
          </motion.button>

          {/* Network */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSystemTrayClick('quick-settings')}
            className="windows-taskbar-item"
            title="Network"
          >
            {getSystemIcon('wifi')}
          </motion.button>

          {/* Battery */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSystemTrayClick('quick-settings')}
            className="windows-taskbar-item"
            title="Battery"
          >
            {getSystemIcon('battery')}
          </motion.button>

          {/* Quick Settings Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSystemTrayClick('quick-settings')}
            className="windows-taskbar-item"
            title="Quick settings"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>

          {/* Help Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSystemTrayClick('help')}
            className="windows-taskbar-item"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5 text-white/90" />
          </motion.button>

          {/* Date and Time */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => handleSystemTrayClick('date-time')}
            className="px-3 py-1 text-xs text-white/90 cursor-pointer hover:bg-white/10 rounded-md transition-colors duration-150"
          >
            <div className="text-right">
              <div className="font-medium">{formatTime(currentTime)}</div>
              <div className="text-white/70">
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Settings Panel */}
      <QuickSettings
        isVisible={showQuickSettings}
        onClose={() => setShowQuickSettings(false)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Help System */}
      <HelpSystem
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
});

export default Taskbar;

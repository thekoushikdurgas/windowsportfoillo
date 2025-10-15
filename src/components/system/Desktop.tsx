'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useSystemStore } from '@/store/systemStore';
import { LearnProvider } from '@/contexts/LearnContext';
import DesktopContent from './DesktopContent';
import Taskbar from './Taskbar';
import Wallpaper from '@/components/common/Wallpaper';
import BootScreen from './BootScreen';
import LoginScreen from './LoginScreen';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePersistence } from '@/hooks/usePersistence';
import { useSystemSounds } from '@/hooks/useAudio';
import { notifications } from '@/services/notificationService';

// Lazy load heavy components for better performance
const StartMenu = lazy(() => import('./StartMenu'));
const WindowManager = lazy(() => import('./WindowManager'));
const TutorialOverlay = lazy(() => import('@/components/ui/TutorialOverlay'));
const KeyboardShortcutsHelp = lazy(() => import('./KeyboardShortcutsHelp'));
const ToastContainer = lazy(() => import('./ToastContainer'));

export default function Desktop() {
  const [isBooting, setIsBooting] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const { isStartMenuOpen, wallpaper } = useSystemStore();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onShowKeyboardHelp: () => setShowKeyboardHelp(true)
  });

  // Initialize persistence
  usePersistence();

  // Audio effects
  const { playBoot } = useSystemSounds();

  useEffect(() => {
    // Simulate boot time
    const timer = setTimeout(() => {
      setIsBooting(false);
      setShowLogin(true);
    }, 3000);

    // Play boot sound
    const bootSoundTimer = setTimeout(() => {
      playBoot();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(bootSoundTimer);
    };
  }, [playBoot]);

  const handleLoginComplete = () => {
    setShowLogin(false);
    
    // Show welcome notification after login
    setTimeout(() => {
      notifications.systemBootComplete();
    }, 1000);

    // Show some demo notifications
    setTimeout(() => {
      notifications.systemWifiConnected('Home Network');
    }, 2000);

    setTimeout(() => {
      notifications.systemUpdateAvailable();
    }, 4000);

    setTimeout(() => {
      notifications.info(
        'Welcome to Windows 11',
        'Try using Win+Shift+? to see keyboard shortcuts!',
        'System'
      );
    }, 6000);
  };



  if (isBooting) {
    return (
      <BootScreen onBootComplete={() => setIsBooting(false)} />
    );
  }

  if (showLogin) {
    return (
      <LoginScreen 
        isVisible={showLogin} 
        onLogin={handleLoginComplete}
      />
    );
  }

  return (
    <LearnProvider>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Wallpaper */}
        <Wallpaper wallpaper={wallpaper} />

        {/* Desktop Content */}
        <DesktopContent />

        {/* Window Manager */}
        <Suspense fallback={<div className="loading-placeholder" />}>
          <WindowManager />
        </Suspense>

        {/* Taskbar */}
        <Taskbar />

        {/* Start Menu */}
        {isStartMenuOpen && (
          <Suspense fallback={<div className="loading-placeholder" />}>
            <StartMenu />
          </Suspense>
        )}

        {/* Tutorial Overlay */}
        <Suspense fallback={<div className="loading-placeholder" />}>
          <TutorialOverlay />
        </Suspense>

        {/* Keyboard Shortcuts Help */}
        {showKeyboardHelp && (
          <Suspense fallback={<div className="loading-placeholder" />}>
            <KeyboardShortcutsHelp
              isVisible={showKeyboardHelp}
              onClose={() => setShowKeyboardHelp(false)}
            />
          </Suspense>
        )}

        {/* Toast Notifications */}
        <Suspense fallback={<div className="loading-placeholder" />}>
          <ToastContainer />
        </Suspense>
      </div>
    </LearnProvider>
  );
}


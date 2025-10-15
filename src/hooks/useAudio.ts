'use client';

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { audioSystem, AudioConfig } from '@/utils/audioSystem';

interface UseAudioOptions {
  autoInitialize?: boolean;
  onConfigChange?: (config: AudioConfig) => void;
}

export function useAudio(options: UseAudioOptions = {}) {
  const { autoInitialize = true, onConfigChange } = options;
  const configRef = useRef<AudioConfig>(audioSystem.getConfig());

  // Initialize audio system
  useEffect(() => {
    if (autoInitialize) {
      audioSystem.initialize();
    }
  }, [autoInitialize]);

  // Get current configuration
  const getConfig = useCallback(() => {
    return audioSystem.getConfig();
  }, []);

  // Update configuration
  const setConfig = useCallback((updates: Partial<AudioConfig>) => {
    audioSystem.setConfig(updates);
    const newConfig = audioSystem.getConfig();
    configRef.current = newConfig;
    onConfigChange?.(newConfig);
  }, [onConfigChange]);

  // Individual configuration setters
  const setEnabled = useCallback((enabled: boolean) => {
    setConfig({ enabled });
  }, [setConfig]);

  const setVolume = useCallback((volume: number) => {
    setConfig({ volume });
  }, [setConfig]);

  const setMasterVolume = useCallback((volume: number) => {
    setConfig({ masterVolume: volume });
  }, [setConfig]);

  const setSystemSounds = useCallback((enabled: boolean) => {
    setConfig({ systemSounds: enabled });
  }, [setConfig]);

  const setAppSounds = useCallback((enabled: boolean) => {
    setConfig({ appSounds: enabled });
  }, [setConfig]);

  const setNotificationSounds = useCallback((enabled: boolean) => {
    setConfig({ notificationSounds: enabled });
  }, [setConfig]);

  const setKeyboardSounds = useCallback((enabled: boolean) => {
    setConfig({ keyboardSounds: enabled });
  }, [setConfig]);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setConfig({ reducedMotion: enabled });
  }, [setConfig]);

  // Sound playing methods
  const playSound = useCallback((soundId: string, options?: { volume?: number; delay?: number }) => {
    audioSystem.playSound(soundId, options);
  }, []);

  const playWindowSound = useMemo(() => ({
    open: () => audioSystem.playWindowOpen(),
    close: () => audioSystem.playWindowClose(),
    minimize: () => audioSystem.playWindowMinimize(),
    maximize: () => audioSystem.playWindowMaximize(),
    restore: () => audioSystem.playWindowRestore(),
    focus: () => audioSystem.playWindowFocus(),
  }), []);

  const playSystemSound = useMemo(() => ({
    taskbarClick: () => audioSystem.playTaskbarClick(),
    startMenuOpen: () => audioSystem.playStartMenuOpen(),
    startMenuClose: () => audioSystem.playStartMenuClose(),
    boot: () => audioSystem.playSystemBoot(),
    shutdown: () => audioSystem.playSystemShutdown(),
    snapLayout: () => audioSystem.playSnapLayout(),
    cropStart: () => audioSystem.playCropStart(),
    cropEnd: () => audioSystem.playCropEnd(),
  }), []);

  const playUISound = useMemo(() => ({
    buttonClick: () => audioSystem.playButtonClick(),
    buttonHover: () => audioSystem.playButtonHover(),
    menuOpen: () => audioSystem.playMenuOpen(),
    menuClose: () => audioSystem.playMenuClose(),
    dragStart: () => audioSystem.playDragStart(),
    dragEnd: () => audioSystem.playDragEnd(),
  }), []);

  const playNotificationSound = useCallback((type: 'default' | 'success' | 'error' | 'warning' = 'default') => {
    audioSystem.playNotification(type);
  }, []);

  const playAppSound = useMemo(() => ({
    open: () => audioSystem.playAppOpen(),
    close: () => audioSystem.playAppClose(),
  }), []);

  const playKeyboardSound = useMemo(() => ({
    typing: () => audioSystem.playKeyboardTyping(),
    enter: () => audioSystem.playKeyboardEnter(),
    backspace: () => audioSystem.playKeyboardBackspace(),
  }), []);

  return {
    config: configRef.current,
    getConfig,
    setConfig,
    setEnabled,
    setVolume,
    setMasterVolume,
    setSystemSounds,
    setAppSounds,
    setNotificationSounds,
    setKeyboardSounds,
    setReducedMotion,
    playSound,
    playWindowSound,
    playSystemSound,
    playUISound,
    playNotificationSound,
    playAppSound,
    playKeyboardSound,
  };
}

// Hook for specific sound effects
export function useSoundEffect(soundId: string, options?: { volume?: number; delay?: number }) {
  const play = useCallback(() => {
    audioSystem.playSound(soundId, options);
  }, [soundId, options]);

  return play;
}

// Hook for keyboard sounds
export function useKeyboardSounds() {
  const playTyping = useCallback(() => {
    audioSystem.playKeyboardTyping();
  }, []);

  const playEnter = useCallback(() => {
    audioSystem.playKeyboardEnter();
  }, []);

  const playBackspace = useCallback(() => {
    audioSystem.playKeyboardBackspace();
  }, []);

  return {
    playTyping,
    playEnter,
    playBackspace,
  };
}

// Hook for window sounds
export function useWindowSounds() {
  const playOpen = useCallback(() => {
    audioSystem.playWindowOpen();
  }, []);

  const playClose = useCallback(() => {
    audioSystem.playWindowClose();
  }, []);

  const playMinimize = useCallback(() => {
    audioSystem.playWindowMinimize();
  }, []);

  const playMaximize = useCallback(() => {
    audioSystem.playWindowMaximize();
  }, []);

  const playRestore = useCallback(() => {
    audioSystem.playWindowRestore();
  }, []);

  const playFocus = useCallback(() => {
    audioSystem.playWindowFocus();
  }, []);

  return {
    playOpen,
    playClose,
    playMinimize,
    playMaximize,
    playRestore,
    playFocus,
  };
}

// Hook for UI interaction sounds
export function useUISounds() {
  const playButtonClick = useCallback(() => {
    audioSystem.playButtonClick();
  }, []);

  const playButtonHover = useCallback(() => {
    audioSystem.playButtonHover();
  }, []);

  const playMenuOpen = useCallback(() => {
    audioSystem.playMenuOpen();
  }, []);

  const playMenuClose = useCallback(() => {
    audioSystem.playMenuClose();
  }, []);

  const playDragStart = useCallback(() => {
    audioSystem.playDragStart();
  }, []);

  const playDragEnd = useCallback(() => {
    audioSystem.playDragEnd();
  }, []);

  return {
    playButtonClick,
    playButtonHover,
    playMenuOpen,
    playMenuClose,
    playDragStart,
    playDragEnd,
  };
}

// Hook for notification sounds
export function useNotificationSounds() {
  const playDefault = useCallback(() => {
    audioSystem.playNotification('default');
  }, []);

  const playSuccess = useCallback(() => {
    audioSystem.playNotification('success');
  }, []);

  const playError = useCallback(() => {
    audioSystem.playNotification('error');
  }, []);

  const playWarning = useCallback(() => {
    audioSystem.playNotification('warning');
  }, []);

  return {
    playDefault,
    playSuccess,
    playError,
    playWarning,
  };
}

// Hook for system sounds
export function useSystemSounds() {
  const playTaskbarClick = useCallback(() => {
    audioSystem.playTaskbarClick();
  }, []);

  const playStartMenuOpen = useCallback(() => {
    audioSystem.playStartMenuOpen();
  }, []);

  const playStartMenuClose = useCallback(() => {
    audioSystem.playStartMenuClose();
  }, []);

  const playBoot = useCallback(() => {
    audioSystem.playSystemBoot();
  }, []);

  const playShutdown = useCallback(() => {
    audioSystem.playSystemShutdown();
  }, []);

  const playSnapLayout = useCallback(() => {
    audioSystem.playSnapLayout();
  }, []);

  const playCropStart = useCallback(() => {
    audioSystem.playCropStart();
  }, []);

  const playCropEnd = useCallback(() => {
    audioSystem.playCropEnd();
  }, []);

  return {
    playTaskbarClick,
    playStartMenuOpen,
    playStartMenuClose,
    playBoot,
    playShutdown,
    playSnapLayout,
    playCropStart,
    playCropEnd,
  };
}

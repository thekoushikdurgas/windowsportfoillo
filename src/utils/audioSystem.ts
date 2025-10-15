/**
 * Audio System for Windows 11 Replica
 * Provides sound effects for system interactions
 */

export interface AudioConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
  masterVolume: number; // 0.0 to 1.0
  systemSounds: boolean;
  appSounds: boolean;
  notificationSounds: boolean;
  keyboardSounds: boolean;
  reducedMotion: boolean;
}

export interface SoundEffect {
  id: string;
  name: string;
  category: 'system' | 'app' | 'notification' | 'keyboard' | 'ui';
  frequency?: number; // For generated sounds
  duration?: number; // In milliseconds
  volume?: number; // Override default volume
  waveform?: 'sine' | 'square' | 'sawtooth' | 'triangle';
  filePath?: string; // Path to audio file
  useFile?: boolean; // Whether to use file or generated sound
}

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  enabled: true,
  volume: 0.7,
  masterVolume: 1.0,
  systemSounds: true,
  appSounds: true,
  notificationSounds: true,
  keyboardSounds: false,
  reducedMotion: false,
};

export const SOUND_EFFECTS: Record<string, SoundEffect> = {
  // System Sounds
  'window-open': {
    id: 'window-open',
    name: 'Window Open',
    category: 'system',
    frequency: 800,
    duration: 150,
    waveform: 'sine',
    volume: 0.6,
    filePath: '/sounds/system/windows-open.wav',
    useFile: true,
  },
  'window-close': {
    id: 'window-close',
    name: 'Window Close',
    category: 'system',
    frequency: 600,
    duration: 120,
    waveform: 'sine',
    volume: 0.6,
    filePath: '/sounds/system/windows-close.wav',
    useFile: true,
  },
  'window-minimize': {
    id: 'window-minimize',
    name: 'Window Minimize',
    category: 'system',
    frequency: 500,
    duration: 100,
    waveform: 'sine',
    volume: 0.5,
    filePath: '/sounds/system/windows-minimize.wav',
    useFile: true,
  },
  'window-maximize': {
    id: 'window-maximize',
    name: 'Window Maximize',
    category: 'system',
    frequency: 900,
    duration: 150,
    waveform: 'sine',
    volume: 0.6,
    filePath: '/sounds/system/windows-maximize.wav',
    useFile: true,
  },
  'window-restore': {
    id: 'window-restore',
    name: 'Window Restore',
    category: 'system',
    frequency: 750,
    duration: 120,
    waveform: 'sine',
    volume: 0.5,
  },
  'window-focus': {
    id: 'window-focus',
    name: 'Window Focus',
    category: 'system',
    frequency: 1000,
    duration: 80,
    waveform: 'sine',
    volume: 0.3,
  },
  'taskbar-click': {
    id: 'taskbar-click',
    name: 'Taskbar Click',
    category: 'system',
    frequency: 1200,
    duration: 60,
    waveform: 'sine',
    volume: 0.4,
    filePath: '/sounds/system/taskbar-click.wav',
    useFile: true,
  },
  'start-menu-open': {
    id: 'start-menu-open',
    name: 'Start Menu Open',
    category: 'system',
    frequency: 800,
    duration: 200,
    waveform: 'sine',
    volume: 0.6,
    filePath: '/sounds/system/start-menu-open.wav',
    useFile: true,
  },
  'start-menu-close': {
    id: 'start-menu-close',
    name: 'Start Menu Close',
    category: 'system',
    frequency: 600,
    duration: 150,
    waveform: 'sine',
    volume: 0.5,
    filePath: '/sounds/system/start-menu-close.wav',
    useFile: true,
  },
  'notification': {
    id: 'notification',
    name: 'Notification',
    category: 'notification',
    frequency: 1000,
    duration: 300,
    waveform: 'sine',
    volume: 0.7,
    filePath: '/sounds/notifications/notification-default.wav',
    useFile: true,
  },
  'notification-success': {
    id: 'notification-success',
    name: 'Success Notification',
    category: 'notification',
    frequency: 1200,
    duration: 200,
    waveform: 'sine',
    volume: 0.6,
    filePath: '/sounds/notifications/notification-success.wav',
    useFile: true,
  },
  'notification-error': {
    id: 'notification-error',
    name: 'Error Notification',
    category: 'notification',
    frequency: 400,
    duration: 400,
    waveform: 'square',
    volume: 0.8,
    filePath: '/sounds/notifications/notification-error.wav',
    useFile: true,
  },
  'notification-warning': {
    id: 'notification-warning',
    name: 'Warning Notification',
    category: 'notification',
    frequency: 800,
    duration: 300,
    waveform: 'triangle',
    volume: 0.7,
    filePath: '/sounds/notifications/notification-warning.wav',
    useFile: true,
  },
  'app-open': {
    id: 'app-open',
    name: 'App Open',
    category: 'app',
    frequency: 900,
    duration: 180,
    waveform: 'sine',
    volume: 0.6,
  },
  'app-close': {
    id: 'app-close',
    name: 'App Close',
    category: 'app',
    frequency: 600,
    duration: 150,
    waveform: 'sine',
    volume: 0.5,
  },
  'button-click': {
    id: 'button-click',
    name: 'Button Click',
    category: 'ui',
    frequency: 1000,
    duration: 50,
    waveform: 'square',
    volume: 0.3,
    filePath: '/sounds/ui/button-click.wav',
    useFile: true,
  },
  'button-hover': {
    id: 'button-hover',
    name: 'Button Hover',
    category: 'ui',
    frequency: 1200,
    duration: 30,
    waveform: 'sine',
    volume: 0.2,
    filePath: '/sounds/ui/button-hover.wav',
    useFile: true,
  },
  'menu-open': {
    id: 'menu-open',
    name: 'Menu Open',
    category: 'ui',
    frequency: 800,
    duration: 100,
    waveform: 'sine',
    volume: 0.4,
    filePath: '/sounds/ui/menu-open.wav',
    useFile: true,
  },
  'menu-close': {
    id: 'menu-close',
    name: 'Menu Close',
    category: 'ui',
    frequency: 600,
    duration: 80,
    waveform: 'sine',
    volume: 0.3,
    filePath: '/sounds/ui/menu-close.wav',
    useFile: true,
  },
  'drag-start': {
    id: 'drag-start',
    name: 'Drag Start',
    category: 'ui',
    frequency: 700,
    duration: 60,
    waveform: 'sine',
    volume: 0.4,
    filePath: '/sounds/ui/drag-start.wav',
    useFile: true,
  },
  'drag-end': {
    id: 'drag-end',
    name: 'Drag End',
    category: 'ui',
    frequency: 900,
    duration: 80,
    waveform: 'sine',
    volume: 0.4,
    filePath: '/sounds/ui/drag-end.wav',
    useFile: true,
  },
  'snap-layout': {
    id: 'snap-layout',
    name: 'Snap Layout',
    category: 'system',
    frequency: 1000,
    duration: 120,
    waveform: 'sine',
    volume: 0.5,
  },
  'crop-start': {
    id: 'crop-start',
    name: 'Crop Start',
    category: 'system',
    frequency: 600,
    duration: 100,
    waveform: 'sine',
    volume: 0.4,
  },
  'crop-end': {
    id: 'crop-end',
    name: 'Crop End',
    category: 'system',
    frequency: 800,
    duration: 120,
    waveform: 'sine',
    volume: 0.5,
  },
  'keyboard-typing': {
    id: 'keyboard-typing',
    name: 'Keyboard Typing',
    category: 'keyboard',
    frequency: 800,
    duration: 30,
    waveform: 'square',
    volume: 0.2,
  },
  'keyboard-enter': {
    id: 'keyboard-enter',
    name: 'Enter Key',
    category: 'keyboard',
    frequency: 1000,
    duration: 50,
    waveform: 'sine',
    volume: 0.3,
  },
  'keyboard-backspace': {
    id: 'keyboard-backspace',
    name: 'Backspace Key',
    category: 'keyboard',
    frequency: 600,
    duration: 40,
    waveform: 'square',
    volume: 0.25,
  },
  'system-boot': {
    id: 'system-boot',
    name: 'System Boot',
    category: 'system',
    frequency: 800,
    duration: 1000,
    waveform: 'sine',
    volume: 0.8,
    filePath: '/sounds/system-boot/system-boot.wav',
    useFile: true,
  },
  'system-shutdown': {
    id: 'system-shutdown',
    name: 'System Shutdown',
    category: 'system',
    frequency: 400,
    duration: 800,
    waveform: 'sine',
    volume: 0.6,
    filePath: '/sounds/system-boot/system-shutdown.wav',
    useFile: true,
  },
};

class AudioSystem {
  private static instance: AudioSystem;
  private audioContext: AudioContext | null = null;
  private config: AudioConfig;
  private soundCache: Map<string, AudioBuffer> = new Map();
  private fileCache: Map<string, AudioBuffer> = new Map();
  private isInitialized = false;

  private constructor() {
    this.config = { ...DEFAULT_AUDIO_CONFIG };
    this.loadConfig();
  }

  public static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  private loadConfig(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('windows11-audio-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      // Failed to load audio config - using defaults
    }
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('windows11-audio-config', JSON.stringify(this.config));
    } catch (error) {
      // Failed to save audio config
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Preload critical audio files
      await this.preloadCriticalSounds();

      this.isInitialized = true;
      // Audio system initialized successfully
    } catch (error) {
      // Failed to initialize audio system
    }
  }

  private async preloadCriticalSounds(): Promise<void> {
    const criticalSounds = [
      'button-click',
      'window-open',
      'window-close',
      'notification',
    ];

    for (const soundId of criticalSounds) {
      try {
        await this.loadAudioFile(soundId);
      } catch (error) {
        // Failed to preload sound - will fall back to generated sound
      }
    }
  }

  private async loadAudioFile(soundId: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    // Check if already cached
    if (this.fileCache.has(soundId)) {
      return this.fileCache.get(soundId)!;
    }

    const sound = SOUND_EFFECTS[soundId];
    if (!sound?.filePath || !sound.useFile) return null;

    try {
      const response = await fetch(sound.filePath);
      if (!response.ok) {
        throw new Error(`Failed to load audio file: ${sound.filePath}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.fileCache.set(soundId, audioBuffer);
      return audioBuffer;
    } catch (error) {
      // Failed to load audio file - will fall back to generated sound
      return null;
    }
  }

  public playSound(soundId: string, options?: { volume?: number; delay?: number }): void {
    if (!this.shouldPlaySound(soundId)) return;

    const sound = SOUND_EFFECTS[soundId];
    if (!sound) {
      // Sound effect not found - using default
      return;
    }

    if (options?.delay) {
      setTimeout(() => this.playSoundInternal(sound, options.volume), options.delay);
    } else {
      this.playSoundInternal(sound, options?.volume);
    }
  }

  private async playSoundInternal(sound: SoundEffect, volumeOverride?: number): Promise<void> {
    // Try to play audio file first
    if (sound.useFile && sound.filePath) {
      try {
        const audioBuffer = await this.loadAudioFile(sound.id);
        if (audioBuffer) {
          this.playAudioBuffer(audioBuffer, sound, volumeOverride);
          return;
        }
      } catch (error) {
        // Failed to play audio file - fall back to generated sound
      }
    }

    // Fall back to generated sound
    this.playGeneratedSound(sound, volumeOverride);
  }

  private playAudioBuffer(audioBuffer: AudioBuffer, sound: SoundEffect, volumeOverride?: number): void {
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;

    // Set volume
    const volume = (volumeOverride ?? sound.volume ?? this.config.volume) * this.config.masterVolume;
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

    // Connect and play
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(this.audioContext.currentTime);
  }

  private shouldPlaySound(soundId: string): boolean {
    if (!this.config.enabled || !this.isInitialized) return false;
    if (this.config.reducedMotion) return false;

    const sound = SOUND_EFFECTS[soundId];
    if (!sound) return false;

    switch (sound.category) {
      case 'system':
        return this.config.systemSounds;
      case 'app':
        return this.config.appSounds;
      case 'notification':
        return this.config.notificationSounds;
      case 'keyboard':
        return this.config.keyboardSounds;
      case 'ui':
        return this.config.systemSounds;
      default:
        return false;
    }
  }

  private playGeneratedSound(sound: SoundEffect, volumeOverride?: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Set frequency and waveform
    oscillator.frequency.setValueAtTime(sound.frequency || 800, this.audioContext.currentTime);
    oscillator.type = sound.waveform || 'sine';

    // Set volume
    const volume = (volumeOverride ?? sound.volume ?? this.config.volume) * this.config.masterVolume;
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

    // Apply fade out for smoother sound
    const duration = (sound.duration || 100) / 1000;
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Public API methods
  public setConfig(updates: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public getConfig(): AudioConfig {
    return { ...this.config };
  }

  public setEnabled(enabled: boolean): void {
    this.setConfig({ enabled });
  }

  public setVolume(volume: number): void {
    this.setConfig({ volume: Math.max(0, Math.min(1, volume)) });
  }

  public setMasterVolume(volume: number): void {
    this.setConfig({ masterVolume: Math.max(0, Math.min(1, volume)) });
  }

  public setSystemSounds(enabled: boolean): void {
    this.setConfig({ systemSounds: enabled });
  }

  public setAppSounds(enabled: boolean): void {
    this.setConfig({ appSounds: enabled });
  }

  public setNotificationSounds(enabled: boolean): void {
    this.setConfig({ notificationSounds: enabled });
  }

  public setKeyboardSounds(enabled: boolean): void {
    this.setConfig({ keyboardSounds: enabled });
  }

  public setReducedMotion(enabled: boolean): void {
    this.setConfig({ reducedMotion: enabled });
  }

  // Convenience methods for common sounds
  public playWindowOpen(): void {
    this.playSound('window-open');
  }

  public playWindowClose(): void {
    this.playSound('window-close');
  }

  public playWindowMinimize(): void {
    this.playSound('window-minimize');
  }

  public playWindowMaximize(): void {
    this.playSound('window-maximize');
  }

  public playWindowRestore(): void {
    this.playSound('window-restore');
  }

  public playWindowFocus(): void {
    this.playSound('window-focus');
  }

  public playTaskbarClick(): void {
    this.playSound('taskbar-click');
  }

  public playStartMenuOpen(): void {
    this.playSound('start-menu-open');
  }

  public playStartMenuClose(): void {
    this.playSound('start-menu-close');
  }

  public playNotification(type: 'default' | 'success' | 'error' | 'warning' = 'default'): void {
    const soundId = type === 'default' ? 'notification' : `notification-${type}`;
    this.playSound(soundId);
  }

  public playAppOpen(): void {
    this.playSound('app-open');
  }

  public playAppClose(): void {
    this.playSound('app-close');
  }

  public playButtonClick(): void {
    this.playSound('button-click');
  }

  public playButtonHover(): void {
    this.playSound('button-hover');
  }

  public playMenuOpen(): void {
    this.playSound('menu-open');
  }

  public playMenuClose(): void {
    this.playSound('menu-close');
  }

  public playDragStart(): void {
    this.playSound('drag-start');
  }

  public playDragEnd(): void {
    this.playSound('drag-end');
  }

  public playSnapLayout(): void {
    this.playSound('snap-layout');
  }

  public playCropStart(): void {
    this.playSound('crop-start');
  }

  public playCropEnd(): void {
    this.playSound('crop-end');
  }

  public playKeyboardTyping(): void {
    this.playSound('keyboard-typing');
  }

  public playKeyboardEnter(): void {
    this.playSound('keyboard-enter');
  }

  public playKeyboardBackspace(): void {
    this.playSound('keyboard-backspace');
  }

  public playSystemBoot(): void {
    this.playSound('system-boot');
  }

  public playSystemShutdown(): void {
    this.playSound('system-shutdown');
  }

  // Cleanup
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.soundCache.clear();
    this.fileCache.clear();
    this.isInitialized = false;
  }

  // Public methods for audio file management
  public async preloadSound(soundId: string): Promise<boolean> {
    try {
      await this.loadAudioFile(soundId);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async preloadSounds(soundIds: string[]): Promise<{ success: string[]; failed: string[] }> {
    const results = await Promise.allSettled(
      soundIds.map(async (soundId) => {
        await this.loadAudioFile(soundId);
        return soundId;
      })
    );

    const success: string[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        success.push(result.value);
      } else {
        failed.push(soundIds[index]);
      }
    });

    return { success, failed };
  }

  public clearAudioCache(): void {
    this.fileCache.clear();
    this.soundCache.clear();
  }

  public getAudioFileStatus(soundId: string): 'loaded' | 'loading' | 'not-found' | 'error' {
    if (this.fileCache.has(soundId)) {
      return 'loaded';
    }
    
    const sound = SOUND_EFFECTS[soundId];
    if (!sound?.filePath || !sound.useFile) {
      return 'not-found';
    }

    return 'error';
  }
}

// Export singleton instance
export const audioSystem = AudioSystem.getInstance();

// Convenience functions for easy use
export const playSound = (soundId: string, options?: { volume?: number; delay?: number }) => {
  audioSystem.playSound(soundId, options);
};

export const playWindowSound = {
  open: () => audioSystem.playWindowOpen(),
  close: () => audioSystem.playWindowClose(),
  minimize: () => audioSystem.playWindowMinimize(),
  maximize: () => audioSystem.playWindowMaximize(),
  restore: () => audioSystem.playWindowRestore(),
  focus: () => audioSystem.playWindowFocus(),
};

export const playSystemSound = {
  taskbarClick: () => audioSystem.playTaskbarClick(),
  startMenuOpen: () => audioSystem.playStartMenuOpen(),
  startMenuClose: () => audioSystem.playStartMenuClose(),
  boot: () => audioSystem.playSystemBoot(),
  shutdown: () => audioSystem.playSystemShutdown(),
  snapLayout: () => audioSystem.playSnapLayout(),
  cropStart: () => audioSystem.playCropStart(),
  cropEnd: () => audioSystem.playCropEnd(),
};

export const playUISound = {
  buttonClick: () => audioSystem.playButtonClick(),
  buttonHover: () => audioSystem.playButtonHover(),
  menuOpen: () => audioSystem.playMenuOpen(),
  menuClose: () => audioSystem.playMenuClose(),
  dragStart: () => audioSystem.playDragStart(),
  dragEnd: () => audioSystem.playDragEnd(),
};

export const playNotificationSound = (type: 'default' | 'success' | 'error' | 'warning' = 'default') => {
  audioSystem.playNotification(type);
};

export const playAppSound = {
  open: () => audioSystem.playAppOpen(),
  close: () => audioSystem.playAppClose(),
};

export const playKeyboardSound = {
  typing: () => audioSystem.playKeyboardTyping(),
  enter: () => audioSystem.playKeyboardEnter(),
  backspace: () => audioSystem.playKeyboardBackspace(),
};

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  audioSystem.initialize();
}

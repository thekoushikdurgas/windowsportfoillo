# Audio Assets Directory

This directory contains audio files for the Windows 11 clone system.

## Directory Structure

```
sounds/
├── system/           # System operation sounds
│   ├── windows-open.wav
│   ├── windows-close.wav
│   ├── windows-minimize.wav
│   ├── windows-maximize.wav
│   ├── start-menu-open.wav
│   ├── start-menu-close.wav
│   └── taskbar-click.wav
├── notifications/    # Notification sounds
│   ├── notification-default.wav
│   ├── notification-success.wav
│   ├── notification-error.wav
│   └── notification-warning.wav
├── ui/              # UI interaction sounds
│   ├── button-click.wav
│   ├── button-hover.wav
│   ├── menu-open.wav
│   ├── menu-close.wav
│   ├── drag-start.wav
│   └── drag-end.wav
└── system-boot/     # System startup/shutdown
    ├── system-boot.wav
    └── system-shutdown.wav
```

## Audio File Specifications

- **Format**: WAV (uncompressed) or MP3 (compressed)
- **Sample Rate**: 44.1 kHz
- **Bit Depth**: 16-bit minimum
- **Duration**: 50-500ms for UI sounds, up to 2s for system sounds
- **Volume**: Normalized to prevent clipping

## Download Sources

1. **Microsoft Store**: Search for "Windows 11 System Sounds"
2. **Freesound.org**: High-quality system sounds
3. **Zapsplat.com**: Professional audio library
4. **Adobe Audition**: Built-in system sounds

## Installation Instructions

1. Download audio files from recommended sources
2. Place files in appropriate subdirectories
3. Ensure file names match the expected naming convention
4. Test audio playback in the application

## Fallback System

If audio files are not available, the system will fall back to generated tones using the Web Audio API.

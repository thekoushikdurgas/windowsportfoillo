/**
 * Audio File Generator Utility
 * Generates placeholder audio files for development and testing
 */

export interface AudioFileConfig {
  frequency: number;
  duration: number;
  waveform: OscillatorType;
  volume: number;
  sampleRate?: number;
}

export class AudioFileGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
  }

  /**
   * Generate a WAV file blob from audio configuration
   */
  public async generateWavBlob(config: AudioFileConfig): Promise<Blob> {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    const sampleRate = config.sampleRate || this.audioContext.sampleRate;
    const length = sampleRate * (config.duration / 1000);
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate audio data
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (config.waveform) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * config.frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * config.frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * config.frequency - Math.floor(t * config.frequency + 0.5));
          break;
        case 'triangle':
          const phase = t * config.frequency;
          sample = 2 * Math.abs(2 * (phase - Math.floor(phase + 0.5))) - 1;
          break;
      }

      // Apply volume and fade out
      const fadeOut = Math.max(0, 1 - (t * 1000) / config.duration);
      data[i] = sample * config.volume * fadeOut;
    }

    // Convert to WAV format
    return this.bufferToWav(buffer);
  }

  /**
   * Convert AudioBuffer to WAV blob
   */
  private bufferToWav(buffer: AudioBuffer): Blob {
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float samples to 16-bit PCM
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /**
   * Generate and download a WAV file
   */
  public async generateAndDownload(config: AudioFileConfig, filename: string): Promise<void> {
    const blob = await this.generateWavBlob(config);
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Generate multiple audio files based on sound effects
   */
  public async generateAllSoundFiles(): Promise<void> {
    const soundEffects = [
      // System sounds
      { id: 'windows-open', frequency: 800, duration: 150, waveform: 'sine' as OscillatorType, volume: 0.6 },
      { id: 'windows-close', frequency: 600, duration: 120, waveform: 'sine' as OscillatorType, volume: 0.6 },
      { id: 'windows-minimize', frequency: 500, duration: 100, waveform: 'sine' as OscillatorType, volume: 0.5 },
      { id: 'windows-maximize', frequency: 900, duration: 150, waveform: 'sine' as OscillatorType, volume: 0.6 },
      { id: 'taskbar-click', frequency: 1200, duration: 60, waveform: 'sine' as OscillatorType, volume: 0.4 },
      { id: 'start-menu-open', frequency: 800, duration: 200, waveform: 'sine' as OscillatorType, volume: 0.6 },
      { id: 'start-menu-close', frequency: 600, duration: 150, waveform: 'sine' as OscillatorType, volume: 0.5 },
      
      // Notification sounds
      { id: 'notification-default', frequency: 1000, duration: 300, waveform: 'sine' as OscillatorType, volume: 0.7 },
      { id: 'notification-success', frequency: 1200, duration: 200, waveform: 'sine' as OscillatorType, volume: 0.6 },
      { id: 'notification-error', frequency: 400, duration: 400, waveform: 'square' as OscillatorType, volume: 0.8 },
      { id: 'notification-warning', frequency: 800, duration: 300, waveform: 'triangle' as OscillatorType, volume: 0.7 },
      
      // UI sounds
      { id: 'button-click', frequency: 1000, duration: 50, waveform: 'square' as OscillatorType, volume: 0.3 },
      { id: 'button-hover', frequency: 1200, duration: 30, waveform: 'sine' as OscillatorType, volume: 0.2 },
      { id: 'menu-open', frequency: 800, duration: 100, waveform: 'sine' as OscillatorType, volume: 0.4 },
      { id: 'menu-close', frequency: 600, duration: 80, waveform: 'sine' as OscillatorType, volume: 0.3 },
      { id: 'drag-start', frequency: 700, duration: 60, waveform: 'sine' as OscillatorType, volume: 0.4 },
      { id: 'drag-end', frequency: 900, duration: 80, waveform: 'sine' as OscillatorType, volume: 0.4 },
      
      // System boot sounds
      { id: 'system-boot', frequency: 800, duration: 1000, waveform: 'sine' as OscillatorType, volume: 0.8 },
      { id: 'system-shutdown', frequency: 400, duration: 800, waveform: 'sine' as OscillatorType, volume: 0.6 },
    ];

    for (const sound of soundEffects) {
      try {
        const config: AudioFileConfig = {
          frequency: sound.frequency,
          duration: sound.duration,
          waveform: sound.waveform,
          volume: sound.volume,
        };
        
        await this.generateAndDownload(config, `${sound.id}.wav`);
        
        // Small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        // Silent error handling for production
      }
    }
  }

  /**
   * Create a data URL for embedding in HTML
   */
  public async generateDataUrl(config: AudioFileConfig): Promise<string> {
    const blob = await this.generateWavBlob(config);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Export singleton instance
export const audioGenerator = new AudioFileGenerator();

// Development helper function
export const generatePlaceholderAudioFiles = () => {
  if (typeof window !== 'undefined') {
    audioGenerator.generateAllSoundFiles();
  }
};

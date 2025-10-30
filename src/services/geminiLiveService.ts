import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { logger, errorToLogContext } from '../lib/logger';

// Use unknown for the session type since @google/genai doesn't export LiveSession
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LiveSession = any;

export interface LiveAssistantSettings {
  voice: 'algenib' | 'charon' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  language: string;
  responseMode: 'conversational' | 'assistant' | 'creative';
  enableEchoCancellation: boolean;
  enableNoiseSuppression: boolean;
  enableAutoGainControl: boolean;
}

export interface ConversationMessage {
  id: string;
  text: string;
  source: 'user' | 'assistant';
  timestamp: Date;
  isPartial?: boolean;
  confidence?: number;
}

export interface LiveAssistantState {
  status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'connecting' | 'error';
  isConnected: boolean;
  latency: number;
  audioLevel: number;
  currentTranscription: string;
  conversationHistory: ConversationMessage[];
}

export interface LiveAssistantCallbacks {
  onStateChange?: (state: LiveAssistantState) => void;
  onMessage?: (message: ConversationMessage) => void;
  onError?: (error: Error) => void;
  onConnectionChange?: (isConnected: boolean) => void;
  onAudioLevelChange?: (level: number) => void;
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private session: LiveSession | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private streamSource: MediaStreamAudioSourceNode | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private animationFrame: number | null = null;
  
  private state: LiveAssistantState = {
    status: 'idle',
    isConnected: false,
    latency: 0,
    audioLevel: 0,
    currentTranscription: '',
    conversationHistory: []
  };

  private callbacks: LiveAssistantCallbacks = {};
  private settings: LiveAssistantSettings = {
    voice: 'algenib',
    language: 'en-US',
    responseMode: 'conversational',
    enableEchoCancellation: true,
    enableNoiseSuppression: true,
    enableAutoGainControl: true
  };

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async connect(callbacks: LiveAssistantCallbacks = {}): Promise<void> {
    try {
      this.callbacks = callbacks;
      this.updateState({ status: 'connecting' });

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: this.settings.enableEchoCancellation,
          noiseSuppression: this.settings.enableNoiseSuppression,
          autoGainControl: this.settings.enableAutoGainControl,
          sampleRate: 16000
        }
      });

      // Setup audio context for input processing
      const AudioContextImpl = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      this.audioContext = new AudioContextImpl();
      this.streamSource = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1);

      // Setup audio level monitoring
      this.streamSource.connect(this.analyser);
      this.analyser.fftSize = 256;
      this.startAudioLevelMonitoring();

      // Setup output audio context
      this.outputAudioContext = new AudioContextImpl();

      // Connect to Gemini Live API
      this.session = await this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => this.handleConnectionOpen(),
          onmessage: (message: LiveServerMessage) => this.handleMessage(message),
          onerror: (error: ErrorEvent) => this.handleError(new Error(error.message)),
          onclose: () => this.handleConnectionClose()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { 
                voiceName: this.settings.voice 
              }
            }
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are Durgas, the helpful AI assistant for DurgasOS. 
          Respond naturally and conversationally in ${this.settings.responseMode} mode. 
          Keep responses concise and helpful.`
        }
      });

      // Setup audio processing pipeline
      this.setupAudioProcessing();

    } catch (error) {
      logger.error('Failed to connect to Gemini Live:', errorToLogContext(error));
      this.updateState({ status: 'error' });
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  private handleConnectionOpen(): void {
    this.updateState({ 
      status: 'listening', 
      isConnected: true 
    });
    this.callbacks.onConnectionChange?.(true);
    logger.info('Connected to Gemini Live API');
  }

  private handleMessage(message: LiveServerMessage): void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = message as any; // LiveServerMessage type doesn't expose these properties
      // Handle input transcription
      if (msg.inputTranscription) {
        const userMessage: ConversationMessage = {
          id: `user_${Date.now()}`,
          text: msg.inputTranscription.text,
          source: 'user',
          timestamp: new Date(),
          isPartial: !msg.inputTranscription.isFinal,
          confidence: msg.inputTranscription.confidence
        };

        if (msg.inputTranscription.isFinal) {
          this.addMessage(userMessage);
          this.updateState({ currentTranscription: '' });
        } else {
          this.updateState({ currentTranscription: msg.inputTranscription.text });
        }
      }

      // Handle output transcription
      if (msg.outputTranscription) {
        const assistantMessage: ConversationMessage = {
          id: `assistant_${Date.now()}`,
          text: msg.outputTranscription.text,
          source: 'assistant',
          timestamp: new Date(),
          isPartial: !msg.outputTranscription.isFinal
        };

        if (msg.outputTranscription.isFinal) {
          this.addMessage(assistantMessage);
        }
      }

      // Handle audio response
      if (msg.modelTurn?.parts) {
        this.updateState({ status: 'speaking' });
        
        for (const part of msg.modelTurn.parts) {
          if (part.inlineData?.mimeType?.startsWith('audio/')) {
            this.playAudioResponse(part.inlineData.data);
          }
        }
      }

      // Handle turn complete
      if (msg.modelTurn?.isComplete) {
        this.updateState({ status: 'listening' });
      }

    } catch (error) {
      logger.error('Error handling message:', errorToLogContext(error));
      this.callbacks.onError?.(error as Error);
    }
  }

  private handleError(error: Error): void {
    logger.error('Gemini Live API error:', errorToLogContext(error));
    this.updateState({ status: 'error' });
    this.callbacks.onError?.(error);
  }

  private handleConnectionClose(): void {
    logger.info('Disconnected from Gemini Live API');
    this.updateState({ 
      status: 'idle', 
      isConnected: false 
    });
    this.callbacks.onConnectionChange?.(false);
  }

  private setupAudioProcessing(): void {
    if (!this.scriptProcessor || !this.streamSource) return;

    this.scriptProcessor.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0);
      const int16 = new Int16Array(inputData.length);
      
      for (let i = 0; i < inputData.length; i++) {
        const value = inputData[i];
        if (value !== undefined) {
          int16[i] = Math.max(-32768, Math.min(32767, Math.round(value * 32768)));
        } else {
          int16[i] = 0;
        }
      }

      const encodedData = this.encode(new Uint8Array(int16.buffer));
      const pcmBlob = new Blob([encodedData], { type: 'audio/pcm;rate=16000' });

      // Send audio data to Gemini
      if (this.session) {
        this.session.sendRealtimeInput({ media: pcmBlob });
      }
    };

    this.streamSource.connect(this.scriptProcessor);
    if (this.audioContext) {
      this.scriptProcessor.connect(this.audioContext.destination);
    }
  }

  private async playAudioResponse(audioData: string): Promise<void> {
    if (!this.outputAudioContext) return;

    try {
      const audioBuffer = await this.decodeAudioData(
        this.decode(audioData), 
        this.outputAudioContext, 
        24000, 
        1
      );

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioContext.destination);
      
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

      source.onended = () => {
        this.updateState({ status: 'listening' });
      };

    } catch (error) {
      logger.error('Error playing audio response:', errorToLogContext(error));
    }
  }

  private startAudioLevelMonitoring(): void {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!this.analyser) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedLevel = average / 255;
      
      this.updateState({ audioLevel: normalizedLevel });
      this.callbacks.onAudioLevelChange?.(normalizedLevel);
      
      this.animationFrame = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  }

  private addMessage(message: ConversationMessage): void {
    this.state.conversationHistory.push(message);
    this.callbacks.onMessage?.(message);
    this.updateState({ conversationHistory: [...this.state.conversationHistory] });
  }

  private updateState(updates: Partial<LiveAssistantState>): void {
    this.state = { ...this.state, ...updates };
    this.callbacks.onStateChange?.(this.state);
  }

  disconnect(): void {
    try {
      // Stop audio processing
      if (this.scriptProcessor) {
        this.scriptProcessor.disconnect();
        this.scriptProcessor = null;
      }

      if (this.streamSource) {
        this.streamSource.disconnect();
        this.streamSource = null;
      }

      if (this.analyser) {
        this.analyser.disconnect();
        this.analyser = null;
      }

      // Stop media stream
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      // Close audio contexts
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      if (this.outputAudioContext) {
        this.outputAudioContext.close();
        this.outputAudioContext = null;
      }

      // Close session
      if (this.session) {
        this.session.close();
        this.session = null;
      }

      // Stop animation frame
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }

      this.updateState({ 
        status: 'idle', 
        isConnected: false,
        audioLevel: 0,
        currentTranscription: ''
      });

      logger.info('Disconnected from Gemini Live service');

    } catch (error) {
      logger.error('Error disconnecting:', errorToLogContext(error));
    }
  }

  updateSettings(settings: Partial<LiveAssistantSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getState(): LiveAssistantState {
    return { ...this.state };
  }

  getSettings(): LiveAssistantSettings {
    return { ...this.settings };
  }

  // Utility functions for audio encoding/decoding
  private encode(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < (bytes.byteLength ?? 0); i++) {
      binary += String.fromCharCode(bytes[i] ?? 0);
    }
    return btoa(binary);
  }

  private decode(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      const dataLength = dataInt16.length;
      for (let i = 0; i < frameCount && i * numChannels + channel < dataLength; i++) {
        const value = dataInt16[i * numChannels + channel];
        if (value !== undefined) {
          channelData[i] = value / 32768.0;
        }
      }
    }
    return buffer;
  }
}

// Singleton instance
export const geminiLiveService = new GeminiLiveService(
  process.env['NEXT_PUBLIC_GEMINI_API_KEY'] || ''
);

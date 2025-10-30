import '@/types/web-apis';

export interface VoiceSettings {
  wakeWord: string;
  language: string;
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  autoResponse: boolean;
  learningEnabled: boolean;
}

import { logger, errorToLogContext } from '../lib/logger';

// Speech Recognition API types
interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((event: WebSpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface WebSpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: WebSpeechRecognitionResultList;
}

interface WebSpeechRecognitionResultList {
  length: number;
  item(index: number): WebSpeechRecognitionResult;
  [index: number]: WebSpeechRecognitionResult;
}

interface WebSpeechRecognitionResult {
  length: number;
  item(index: number): WebSpeechRecognitionAlternative;
  [index: number]: WebSpeechRecognitionAlternative;
  isFinal: boolean;
}

interface WebSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface WebSpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface WebSpeechRecognitionConstructor {
  new (): WebSpeechRecognition;
}

interface WindowWithSpeechRecognition {
  webkitSpeechRecognition?: WebSpeechRecognitionConstructor;
  SpeechRecognition?: WebSpeechRecognitionConstructor;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  confidence: number;
  learned: boolean;
  usageCount: number;
  lastUsed: Date;
}

export interface VoiceLearningData {
  commands: VoiceCommand[];
  userPhrases: string[];
  corrections: Array<{
    original: string;
    corrected: string;
    timestamp: Date;
  }>;
}

export class VoiceAssistantService {
  private recognition: WebSpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private wakeWordDetected = false;
  private settings: VoiceSettings;
  private learningData: VoiceLearningData;
  private onCommandCallback?: (command: VoiceCommand) => void;
  private onWakeWordCallback?: () => void;

  constructor() {
    this.settings = {
      wakeWord: 'hey durgas',
      language: 'en-US',
      voice: 'default',
      speed: 1.0,
      pitch: 1.0,
      volume: 1.0,
      autoResponse: true,
      learningEnabled: true,
    };

    this.learningData = {
      commands: [],
      userPhrases: [],
      corrections: [],
    };

    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
    this.loadLearningData();
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const WebkitSpeechRecognition = (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
      if (WebkitSpeechRecognition) {
        this.recognition = new WebkitSpeechRecognition();
      }
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as WindowWithSpeechRecognition).SpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
      }
    }

    if (this.recognition) {
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.settings.language;

      this.recognition.onstart = () => {
        this.isListening = true;
        logger.info('Voice recognition started');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        logger.info('Voice recognition ended');
      };

      this.recognition.onresult = (event: WebSpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .filter((result): result is WebSpeechRecognitionAlternative => result !== undefined)
          .map(result => result.transcript)
          .join('')
          .toLowerCase();

        this.processTranscript(transcript);
      };

      this.recognition.onerror = (event: WebSpeechRecognitionErrorEvent) => {
        logger.error('Speech recognition error:', errorToLogContext(event.error));
      };
    }
  }

  private initializeSpeechSynthesis() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private processTranscript(transcript: string) {
    // Check for wake word
    if (transcript.includes(this.settings.wakeWord.toLowerCase())) {
      this.wakeWordDetected = true;
      this.onWakeWordCallback?.();
      return;
    }

    // Process commands only if wake word was detected
    if (this.wakeWordDetected) {
      this.processCommand(transcript);
      this.wakeWordDetected = false;
    }
  }

  private processCommand(transcript: string) {
    const command = this.findMatchingCommand(transcript);
    if (command) {
      this.updateCommandUsage(command);
      this.onCommandCallback?.(command);
    } else if (this.settings.learningEnabled) {
      this.learnNewCommand(transcript);
    }
  }

  private findMatchingCommand(transcript: string): VoiceCommand | null {
    // First, try exact matches
    let command = this.learningData.commands.find(cmd => 
      transcript.includes(cmd.phrase.toLowerCase())
    );

    // If no exact match, try fuzzy matching
    if (!command) {
      command = this.learningData.commands.find(cmd => 
        this.calculateSimilarity(transcript, cmd.phrase) > 0.7
      );
    }

    return command || null;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    const firstRow = matrix[0];
    if (firstRow) {
      for (let i = 0; i <= str1.length; i++) firstRow[i] = i;
    }
    for (let j = 0; j <= str2.length; j++) {
      const row = matrix[j];
      if (row) row[0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      const row = matrix[j];
      const prevRow = matrix[j - 1];
      if (!row || !prevRow) continue;
      
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        const top = row[i - 1] ?? 0;
        const left = prevRow[i] ?? 0;
        const diagonal = prevRow[i - 1] ?? 0;
        row[i] = Math.min(top + 1, left + 1, diagonal + indicator);
      }
    }
    
    const lastRow = matrix[str2.length];
    const lastCol = lastRow?.[str1.length];
    return lastCol ?? 0;
  }

  private learnNewCommand(transcript: string) {
    // Extract potential command from transcript
    const words = transcript.split(' ');
    const actionWords = words.filter(word => 
      !['hey', 'durgas', 'please', 'can', 'you', 'the', 'a', 'an'].includes(word)
    );

    if (actionWords.length > 0) {
      const newCommand: VoiceCommand = {
        id: `cmd_${Date.now()}`,
        phrase: actionWords.join(' '),
        action: 'unknown',
        confidence: 0.5,
        learned: true,
        usageCount: 0,
        lastUsed: new Date(),
      };

      this.learningData.commands.push(newCommand);
      this.saveLearningData();
    }
  }

  private updateCommandUsage(command: VoiceCommand) {
    command.usageCount++;
    command.lastUsed = new Date();
    this.saveLearningData();
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  speak(text: string) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.settings.language;
      utterance.rate = this.settings.speed;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Set voice if available
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name === this.settings.voice || 
        voice.lang.startsWith(this.settings.language)
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      this.synthesis.speak(utterance);
    }
  }

  setWakeWord(wakeWord: string) {
    this.settings.wakeWord = wakeWord.toLowerCase();
    this.saveSettings();
  }

  setLanguage(language: string) {
    this.settings.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
    this.saveSettings();
  }

  setVoice(voice: string) {
    this.settings.voice = voice;
    this.saveSettings();
  }

  setSpeed(speed: number) {
    this.settings.speed = Math.max(0.1, Math.min(10, speed));
    this.saveSettings();
  }

  setPitch(pitch: number) {
    this.settings.pitch = Math.max(0, Math.min(2, pitch));
    this.saveSettings();
  }

  setVolume(volume: number) {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  toggleLearning() {
    this.settings.learningEnabled = !this.settings.learningEnabled;
    this.saveSettings();
  }

  addCommand(phrase: string, action: string) {
    const command: VoiceCommand = {
      id: `cmd_${Date.now()}`,
      phrase: phrase.toLowerCase(),
      action,
      confidence: 1.0,
      learned: false,
      usageCount: 0,
      lastUsed: new Date(),
    };

    this.learningData.commands.push(command);
    this.saveLearningData();
  }

  removeCommand(commandId: string) {
    this.learningData.commands = this.learningData.commands.filter(
      cmd => cmd.id !== commandId
    );
    this.saveLearningData();
  }

  correctCommand(commandId: string, correctedPhrase: string) {
    const command = this.learningData.commands.find(cmd => cmd.id === commandId);
    if (command) {
      this.learningData.corrections.push({
        original: command.phrase,
        corrected: correctedPhrase,
        timestamp: new Date(),
      });
      command.phrase = correctedPhrase.toLowerCase();
      this.saveLearningData();
    }
  }

  getAvailableVoices() {
    if (this.synthesis) {
      return this.synthesis.getVoices();
    }
    return [];
  }

  getLearningData() {
    return this.learningData;
  }

  getSettings() {
    return this.settings;
  }

  onCommand(callback: (command: VoiceCommand) => void) {
    this.onCommandCallback = callback;
  }

  onWakeWord(callback: () => void) {
    this.onWakeWordCallback = callback;
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('voiceAssistantSettings', JSON.stringify(this.settings));
  }

  private saveLearningData() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('voiceAssistantLearning', JSON.stringify(this.learningData));
  }

  private loadLearningData() {
    if (typeof window === 'undefined') return;
    const savedSettings = localStorage.getItem('voiceAssistantSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }

    const savedLearning = localStorage.getItem('voiceAssistantLearning');
    if (savedLearning) {
      this.learningData = { ...this.learningData, ...JSON.parse(savedLearning) };
    }
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }

  getIsListening() {
    return this.isListening;
  }
}

// Singleton instance
export const voiceAssistant = new VoiceAssistantService();

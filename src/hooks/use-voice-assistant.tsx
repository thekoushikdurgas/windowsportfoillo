'use client';

import { useState, useEffect, useCallback } from 'react';
import { voiceAssistant, VoiceCommand, VoiceSettings } from '@/services/voiceAssistantService';
import { logger } from '../lib/logger';

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>(voiceAssistant.getSettings());
  const [learningData, setLearningData] = useState(voiceAssistant.getLearningData());
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(voiceAssistant.isSupported());
    setSettings(voiceAssistant.getSettings());
    setLearningData(voiceAssistant.getLearningData());

    // Set up event listeners
    voiceAssistant.onCommand((command) => {
      setLastCommand(command);
    });

    voiceAssistant.onWakeWord(() => {
      logger.info('Wake word detected!');
    });

    return () => {
      voiceAssistant.stopListening();
    };
  }, []);

  const startListening = useCallback(() => {
    try {
      voiceAssistant.startListening();
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start listening');
    }
  }, []);

  const stopListening = useCallback(() => {
    try {
      voiceAssistant.stopListening();
      setIsListening(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop listening');
    }
  }, []);

  const speak = useCallback((text: string) => {
    try {
      voiceAssistant.speak(text);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to speak');
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    try {
      if (newSettings.wakeWord) {
        voiceAssistant.setWakeWord(newSettings.wakeWord);
      }
      if (newSettings.language) {
        voiceAssistant.setLanguage(newSettings.language);
      }
      if (newSettings.voice) {
        voiceAssistant.setVoice(newSettings.voice);
      }
      if (newSettings.speed !== undefined) {
        voiceAssistant.setSpeed(newSettings.speed);
      }
      if (newSettings.pitch !== undefined) {
        voiceAssistant.setPitch(newSettings.pitch);
      }
      if (newSettings.volume !== undefined) {
        voiceAssistant.setVolume(newSettings.volume);
      }
      if (newSettings.learningEnabled !== undefined) {
        voiceAssistant.toggleLearning();
      }

      setSettings(voiceAssistant.getSettings());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  }, []);

  const addCommand = useCallback((phrase: string, action: string) => {
    try {
      voiceAssistant.addCommand(phrase, action);
      setLearningData(voiceAssistant.getLearningData());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add command');
    }
  }, []);

  const removeCommand = useCallback((commandId: string) => {
    try {
      voiceAssistant.removeCommand(commandId);
      setLearningData(voiceAssistant.getLearningData());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove command');
    }
  }, []);

  const correctCommand = useCallback((commandId: string, correctedPhrase: string) => {
    try {
      voiceAssistant.correctCommand(commandId, correctedPhrase);
      setLearningData(voiceAssistant.getLearningData());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to correct command');
    }
  }, []);

  const getAvailableVoices = useCallback(() => {
    return voiceAssistant.getAvailableVoices();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    settings,
    learningData,
    lastCommand,
    error,
    startListening,
    stopListening,
    speak,
    updateSettings,
    addCommand,
    removeCommand,
    correctCommand,
    getAvailableVoices,
    clearError,
  };
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VoiceVisualizer } from './LiveAssistant/VoiceVisualizer';
import { TranscriptionDisplay } from './LiveAssistant/TranscriptionDisplay';
import { ControlPanel } from './LiveAssistant/ControlPanel';
import { SettingsPanel } from './LiveAssistant/SettingsPanel';
import { 
  geminiLiveService, 
  LiveAssistantState, 
  LiveAssistantSettings,
  ConversationMessage 
} from '@/services/geminiLiveService';
import { logger } from '@/lib/logger';

export default function LiveAssistant() {
  const [state, setState] = useState<LiveAssistantState>({
    status: 'idle',
    isConnected: false,
    latency: 0,
    audioLevel: 0,
    currentTranscription: '',
    conversationHistory: []
  });
  
  const [settings, setSettings] = useState<LiveAssistantSettings>({
    voice: 'algenib',
    language: 'en-US',
    responseMode: 'conversational',
    enableEchoCancellation: true,
    enableNoiseSuppression: true,
    enableAutoGainControl: true
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize service callbacks
  useEffect(() => {
    geminiLiveService.updateSettings(settings);
  }, [settings]);

  const handleStateChange = useCallback((newState: LiveAssistantState) => {
    setState(newState);
  }, []);

  const handleMessage = useCallback((message: ConversationMessage) => {
    logger.info('New conversation message:', {
      id: message.id,
      text: message.text,
      source: message.source,
      timestamp: message.timestamp.toString(),
      isPartial: message.isPartial,
      confidence: message.confidence
    });
  }, []);

  const handleError = useCallback((error: Error) => {
    logger.error('LiveAssistant error:', { 
      name: error.name, 
      message: error.message,
      stack: error.stack 
    });
    setError(error.message);
    setIsConnecting(false);
  }, []);

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    if (!isConnected) {
      setIsConnecting(false);
    }
  }, []);

  const handleAudioLevelChange = useCallback(() => {
    // Audio level is already handled by the service state
  }, []);

  const startConversation = async () => {
    try {
      setError(null);
      setIsConnecting(true);
      
      await geminiLiveService.connect({
        onStateChange: handleStateChange,
        onMessage: handleMessage,
        onError: handleError,
        onConnectionChange: handleConnectionChange,
        onAudioLevelChange: handleAudioLevelChange
      });
      
    } catch (error) {
      const errorContext = error instanceof Error 
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) };
      logger.error('Failed to start conversation:', errorContext);
      setError(error instanceof Error ? error.message : 'Failed to start conversation');
      setIsConnecting(false);
    }
  };

  const stopConversation = () => {
    try {
      geminiLiveService.disconnect();
      setState({
        status: 'idle',
        isConnected: false,
        latency: 0,
        audioLevel: 0,
        currentTranscription: '',
        conversationHistory: []
      });
    } catch (error) {
      const errorContext = error instanceof Error 
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) };
      logger.error('Failed to stop conversation:', errorContext);
    }
  };

  const handleSettingsSave = (newSettings: LiveAssistantSettings) => {
    setSettings(newSettings);
    geminiLiveService.updateSettings(newSettings);
  };

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geminiLiveService.disconnect();
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 text-lg">🎤</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Live Assistant
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time voice conversation with AI
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Model: Gemini Live</span>
          {state.isConnected && (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Visual State Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <VoiceVisualizer
            audioLevel={state.audioLevel}
            status={state.status}
            className="w-full max-w-md"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-600 dark:text-red-400 mr-2">⚠️</span>
              <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Transcription Display */}
        <TranscriptionDisplay
          messages={state.conversationHistory}
          currentTranscription={state.currentTranscription}
          className="border-t border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Control Panel */}
      <ControlPanel
        isConnected={state.isConnected}
        isConnecting={isConnecting}
        status={state.status}
        onStart={startConversation}
        onStop={stopConversation}
        onSettings={handleSettingsOpen}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={handleSettingsClose}
        onSave={handleSettingsSave}
      />
    </div>
  );
}

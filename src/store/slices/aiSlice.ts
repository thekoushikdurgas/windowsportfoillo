import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIMessage } from '@/types/ai';

interface AIState {
  messages: AIMessage[];
  isTyping: boolean;
  isListening: boolean;
  isProcessing: boolean;
  currentFlow: string | null;
  error: string | null;
  settings: {
    voiceEnabled: boolean;
    autoResponse: boolean;
    language: string;
    voice: string;
    speed: number;
    pitch: number;
  };
}

const initialState: AIState = {
  messages: [],
  isTyping: false,
  isListening: false,
  isProcessing: false,
  currentFlow: null,
  error: null,
  settings: {
    voiceEnabled: true,
    autoResponse: true,
    language: 'en',
    voice: 'default',
    speed: 1.0,
    pitch: 1.0,
  },
};

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<AIMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setCurrentFlow: (state, action: PayloadAction<string | null>) => {
      state.currentFlow = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateAISettings: (state, action: PayloadAction<Partial<AIState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setVoiceEnabled: (state, action: PayloadAction<boolean>) => {
      state.settings.voiceEnabled = action.payload;
    },
    setAutoResponse: (state, action: PayloadAction<boolean>) => {
      state.settings.autoResponse = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.settings.language = action.payload;
    },
    setVoice: (state, action: PayloadAction<string>) => {
      state.settings.voice = action.payload;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.settings.speed = action.payload;
    },
    setPitch: (state, action: PayloadAction<number>) => {
      state.settings.pitch = action.payload;
    },
  },
});

export const {
  addMessage,
  clearMessages,
  setTyping,
  setListening,
  setProcessing,
  setCurrentFlow,
  setError,
  updateAISettings,
  setVoiceEnabled,
  setAutoResponse,
  setLanguage,
  setVoice,
  setSpeed,
  setPitch,
} = aiSlice.actions;

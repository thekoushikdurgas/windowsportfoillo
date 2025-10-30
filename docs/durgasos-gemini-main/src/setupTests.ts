/**
 * @file Test setup configuration for Jest and React Testing Library.
 */
import '@testing-library/jest-dom';

// Mock the Google GenAI API
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    chats: {
      create: jest.fn().mockReturnValue({
        sendMessage: jest.fn().mockResolvedValue({ text: 'Mock response' }),
      }),
    },
    models: {
      generateContent: jest.fn().mockResolvedValue({ text: 'Mock response' }),
      generateImages: jest.fn().mockResolvedValue({
        generatedImages: [{ image: { imageBytes: 'mock-image-data' } }],
      }),
    },
    live: {
      connect: jest.fn().mockResolvedValue({
        sendRealtimeInput: jest.fn(),
        close: jest.fn(),
      }),
    },
  })),
}));

// Mock the Speech Recognition API
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    onend: null,
    onerror: null,
  })),
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    onend: null,
    onerror: null,
  })),
});

// Mock the AudioContext API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    createBufferSource: jest.fn().mockReturnValue({
      buffer: null,
      connect: jest.fn(),
      start: jest.fn(),
      onended: null,
    }),
    createMediaStreamSource: jest.fn().mockReturnValue({
      connect: jest.fn(),
    }),
    createScriptProcessor: jest.fn().mockReturnValue({
      onaudioprocess: null,
      connect: jest.fn(),
    }),
    destination: {},
    currentTime: 0,
    close: jest.fn().mockResolvedValue(undefined),
  })),
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    createBufferSource: jest.fn().mockReturnValue({
      buffer: null,
      connect: jest.fn(),
      start: jest.fn(),
      onended: null,
    }),
    createMediaStreamSource: jest.fn().mockReturnValue({
      connect: jest.fn(),
    }),
    createScriptProcessor: jest.fn().mockReturnValue({
      onaudioprocess: null,
      connect: jest.fn(),
    }),
    destination: {},
    currentTime: 0,
    close: jest.fn().mockResolvedValue(undefined),
  })),
});

// Mock the MediaDevices API
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn().mockReturnValue([
        { stop: jest.fn() },
      ]),
    }),
  },
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

import React from 'react';
import { FunctionDeclaration } from "@google/genai";

declare global {
  interface Window {
    // aistudio is defined in environment types
    webkitAudioContext: typeof AudioContext;
  }
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.FC<WindowProps>;
  defaultWidth?: number;
  defaultHeight?: number;
  canResize?: boolean;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface WindowProps {
  windowId: string;
  isActive: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  groundingMetadata?: any;
  thinking?: boolean; // UI state for "Thinking..."
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  appName?: string;
  icon?: React.ReactNode;
  timestamp: number;
}
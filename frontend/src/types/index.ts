import React from 'react';

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
  // Windows 11 enhancements
  snapState?: {
    layout: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | null;
    zone?: string;
  };
  isSnapped?: boolean;
  animationState?: 'opening' | 'closing' | 'minimizing' | 'maximizing' | 'restoring' | 'snapping' | null;
}

export interface WindowProps {
  windowId: string;
  isActive: boolean;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  groundingMetadata?: GroundingMetadata;
  thinking?: boolean;
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


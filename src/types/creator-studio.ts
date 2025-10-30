export interface Project {
  id: string;
  name: string;
  type: 'image-generation' | 'image-editing' | 'analysis' | 'transcription';
  assets: Asset[];
  settings: ProjectSettings;
  collaborators: Collaborator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text';
  url: string;
  metadata: AssetMetadata;
  generatedBy: 'user' | 'ai';
  prompt?: string;
  createdAt: Date;
}

export interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  size?: number;
  model?: string;
  format?: string;
  confidence?: number;
  tags?: string[];
  entities?: Entity[];
}

export interface Entity {
  name: string;
  type: string;
  confidence: number;
}

export interface ProjectSettings {
  theme: 'light' | 'dark';
  quality: 'low' | 'medium' | 'high';
  format: 'png' | 'jpg' | 'jpeg' | 'webp';
  resolution: {
    width: number;
    height: number;
  };
  style?: string;
  model?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'admin';
  avatar?: string;
  isOnline: boolean;
}

export interface GenerationOptions {
  width: number;
  height: number;
  quality: 'low' | 'medium' | 'high';
  style?: string;
  aspectRatio?: string;
  seed?: number;
  batchSize?: number;
}

export interface AnalysisOptions {
  language: string;
  confidence: number;
  includeMetadata: boolean;
  maxResults: number;
}

export interface CreatorStudioState {
  currentProject: Project | null;
  selectedAssets: Set<string>;
  activeTool: Tool;
  isGenerating: boolean;
  generationProgress: number;
  collaborators: Collaborator[];
  recentPrompts: string[];
  recentProjects: Project[];
  settings: ProjectSettings;
}

export type Tool = 'generate' | 'edit' | 'analyze' | 'transcribe';

export interface GenerationResult {
  type: 'image' | 'video' | 'audio' | 'text';
  content: string;
  format: string;
  metadata: AssetMetadata;
  prompt?: string;
  settings?: Record<string, unknown>;
}

export interface AnalysisResult {
  type: 'image' | 'video' | 'audio' | 'text' | 'document';
  content: string;
  format?: string;
  analysis: {
    description: string;
    tags?: string[];
    confidence?: number;
    entities?: Entity[];
    sentiment?: {
      score: number;
      magnitude: number;
      label: string;
    };
  };
  metadata: {
    processingTime: number;
    model: string;
    version?: string;
  };
}

export interface TranscriptionResult {
  type: 'audio';
  content: string;
  format?: string;
  transcription: string;
  confidence: number;
  language: string;
}

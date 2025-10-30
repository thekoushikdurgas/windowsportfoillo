import { useState, useCallback, useRef } from 'react';
import { CreatorStudioState, Project, Asset, GenerationOptions, AnalysisOptions, Tool, GenerationResult, AnalysisResult, TranscriptionResult } from '@/types/creator-studio';
import { logger } from '@/lib/logger';

const defaultSettings = {
  theme: 'light' as const,
  quality: 'medium' as 'low' | 'medium' | 'high',
  format: 'png' as const,
  resolution: { width: 1024, height: 1024 },
  style: 'realistic',
  model: 'imagen-3.0-generate-002',
};

const initialState: CreatorStudioState = {
  currentProject: null,
  selectedAssets: new Set(),
  activeTool: 'generate',
  isGenerating: false,
  generationProgress: 0,
  collaborators: [],
  recentPrompts: [],
  recentProjects: [],
  settings: defaultSettings,
};

export function useCreatorStudio() {
  const [state, setState] = useState<CreatorStudioState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Project Management
  const createProject = useCallback((name: string, type: Project['type']) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      type,
      assets: [],
      settings: { ...defaultSettings },
      collaborators: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      currentProject: newProject,
      recentProjects: [newProject, ...prev.recentProjects.slice(0, 9)],
    }));
  }, []);

  const updateProject = useCallback((updates: Partial<Project>) => {
    setState(prev => {
      if (!prev.currentProject) return prev;
      
      const updatedProject = {
        ...prev.currentProject,
        ...updates,
        updatedAt: new Date(),
      };

      return {
        ...prev,
        currentProject: updatedProject,
        recentProjects: prev.recentProjects.map(p => 
          p.id === updatedProject.id ? updatedProject : p
        ),
      };
    });
  }, []);

  const addAsset = useCallback((asset: Asset) => {
    setState(prev => {
      if (!prev.currentProject) return prev;

      const updatedProject = {
        ...prev.currentProject,
        assets: [...prev.currentProject.assets, asset],
        updatedAt: new Date(),
      };

      return {
        ...prev,
        currentProject: updatedProject,
      };
    });
  }, []);

  // Tool Management
  const setActiveTool = useCallback((tool: Tool) => {
    setState(prev => ({ ...prev, activeTool: tool }));
  }, []);

  const setSelectedAssets = useCallback((assetIds: Set<string>) => {
    setState(prev => ({ ...prev, selectedAssets: assetIds }));
  }, []);

  // Generation Functions
  const generateImage = useCallback(async (prompt: string, options: GenerationOptions) => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      generationProgress: 0 
    }));

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/creator-studio/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: state.settings.style,
          options,
          settings: state.settings,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result: GenerationResult = await response.json();
      
      // Create asset from result
      const asset: Asset = {
        id: Date.now().toString(),
        type: 'image',
        url: result.content,
        metadata: result.metadata,
        generatedBy: 'ai',
        prompt,
        createdAt: new Date(),
      };

      addAsset(asset);

      // Add to recent prompts
      setState(prev => ({
        ...prev,
        recentPrompts: [prompt, ...prev.recentPrompts.filter(p => p !== prompt).slice(0, 9)],
      }));

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('Generation cancelled');
        return null as unknown as GenerationResult;
      } else {
        logger.error('Generation error', { error });
        throw error;
      }
    } finally {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generationProgress: 0 
      }));
    }
  }, [state.settings, addAsset]);

  const editImage = useCallback(async (imageUrl: string, prompt: string, mask?: string) => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      generationProgress: 0 
    }));

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/creator-studio/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl, prompt, mask }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to edit image');
      }

      const result: GenerationResult = await response.json();
      
      // Create asset from result
      const asset: Asset = {
        id: Date.now().toString(),
        type: 'image',
        url: result.content,
        metadata: result.metadata,
        generatedBy: 'ai',
        prompt,
        createdAt: new Date(),
      };

      addAsset(asset);
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('Editing cancelled');
        return null as unknown as GenerationResult;
      } else {
        logger.error('Editing error', { error });
        throw error;
      }
    } finally {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generationProgress: 0 
      }));
    }
  }, [addAsset]);

  const analyzeImage = useCallback(async (imageUrl: string, analysisType: string, options: AnalysisOptions) => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      generationProgress: 0 
    }));

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/creator-studio/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: imageUrl,
          analysisType,
          options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const result: AnalysisResult = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('Analysis cancelled');
        return null as unknown as AnalysisResult;
      } else {
        logger.error('Analysis error', { error });
        throw error;
      }
    } finally {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generationProgress: 0 
      }));
    }
  }, []);

  const analyzeVideo = useCallback(async (videoUrl: string, analysisType: string, options: AnalysisOptions) => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      generationProgress: 0 
    }));

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/creator-studio/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: videoUrl,
          analysisType,
          options,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze video');
      }

      const result: AnalysisResult = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('Analysis cancelled');
        return null as unknown as AnalysisResult;
      } else {
        logger.error('Analysis error', { error });
        throw error;
      }
    } finally {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generationProgress: 0 
      }));
    }
  }, []);

  const transcribeAudio = useCallback(async (audioUrl: string, language = 'en') => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      generationProgress: 0 
    }));

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/creator-studio/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: audioUrl, language }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const result: TranscriptionResult = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('Transcription cancelled');
        return null as unknown as TranscriptionResult;
      } else {
        logger.error('Transcription error', { error });
        throw error;
      }
    } finally {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        generationProgress: 0 
      }));
    }
  }, []);

  const cancelOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<typeof defaultSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  return {
    ...state,
    createProject,
    updateProject,
    addAsset,
    setActiveTool,
    setSelectedAssets,
    generateImage,
    editImage,
    analyzeImage,
    analyzeVideo,
    transcribeAudio,
    cancelOperation,
    updateSettings,
  };
}

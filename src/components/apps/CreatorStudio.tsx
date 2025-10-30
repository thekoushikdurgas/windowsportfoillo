'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useCreatorStudio } from '@/hooks/use-creator-studio';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { GenerationResult, AnalysisResult, TranscriptionResult } from '@/types/creator-studio';

// Type guard functions
const isAnalysisResult = (result: GenerationResult | AnalysisResult | TranscriptionResult): result is AnalysisResult => {
  return 'analysis' in result;
};

const isTranscriptionResult = (result: GenerationResult | AnalysisResult | TranscriptionResult): result is TranscriptionResult => {
  return 'transcription' in result && 'confidence' in result;
};
import { 
  Wand2, 
  Edit3, 
  Search, 
  Mic, 
  Upload, 
  Download, 
  Settings, 
  X,
  Image as ImageIcon,
  Music,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function CreatorStudio() {
  const {
    currentProject,
    activeTool,
    isGenerating,
    generationProgress,
    recentPrompts,
    settings,
    createProject,
    setActiveTool,
    generateImage,
    editImage,
    analyzeImage,
    analyzeVideo,
    transcribeAudio,
    cancelOperation,
    updateSettings,
  } = useCreatorStudio();

  const [prompt, setPrompt] = useState('');
  const [editPrompt, setEditPrompt] = useState('');
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | AnalysisResult | TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize project if none exists
  if (!currentProject) {
    createProject('New Project', 'image-generation');
  }

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) return;
    
    try {
      setError(null);
      const result = await generateImage(prompt, {
        width: settings.resolution.width,
        height: settings.resolution.height,
        quality: settings.quality,
        ...(settings.style ? { style: settings.style } : {}),
        aspectRatio: `${settings.resolution.width}:${settings.resolution.height}`,
      });
      setResult(result ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    }
  }, [prompt, settings, generateImage]);

  const handleEditImage = useCallback(async () => {
    if (!filePreview || !editPrompt.trim()) return;
    
    try {
      setError(null);
      const result = await editImage(filePreview, editPrompt);
      setResult(result ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit image');
    }
  }, [filePreview, editPrompt, editImage]);

  const handleAnalyze = useCallback(async () => {
    if (!filePreview || !analysisPrompt.trim()) return;
    
    try {
      setError(null);
      const result = activeTool === 'analyze' 
        ? await analyzeImage(filePreview, 'general', { language: 'en', confidence: 0.5, includeMetadata: true, maxResults: 10 })
        : await analyzeVideo(filePreview, 'general', { language: 'en', confidence: 0.5, includeMetadata: true, maxResults: 10 });
      setResult(result ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze content');
    }
  }, [filePreview, analysisPrompt, activeTool, analyzeImage, analyzeVideo]);

  const handleTranscribe = useCallback(async () => {
    if (!filePreview) return;
    
    try {
      setError(null);
      const result = await transcribeAudio(filePreview, 'en');
      setResult(result ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio');
    }
  }, [filePreview, transcribeAudio]);

  const renderToolContent = () => {
    switch (activeTool) {
      case 'generate':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Image Prompt
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="min-h-[100px]"
                />
              </div>
              
              {recentPrompts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Recent Prompts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {recentPrompts.slice(0, 5).map((recentPrompt) => (
                      <Badge
                        key={recentPrompt}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => setPrompt(recentPrompt)}
                      >
                        {recentPrompt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Resolution
                  </label>
                  <select
                    value={`${settings.resolution.width}x${settings.resolution.height}`}
                    onChange={(e) => {
                      const [widthStr, heightStr] = e.target.value.split('x');
                      const width = widthStr ? Number(widthStr) : undefined;
                      const height = heightStr ? Number(heightStr) : undefined;
                      if (width !== undefined && height !== undefined) {
                        updateSettings({ resolution: { width, height } });
                      }
                    }}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="512x512">512x512</option>
                    <option value="1024x1024">1024x1024</option>
                    <option value="1024x768">1024x768</option>
                    <option value="768x1024">768x1024</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Quality
                  </label>
                  <select
                    value={settings.quality}
                    onChange={(e) => updateSettings({ quality: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateImage}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={generationProgress} className="w-full" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelOperation}
                  className="w-full"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Upload Image
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {filePreview ? (
                    <Image
                      src={filePreview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="max-w-full max-h-48 mx-auto rounded"
                    />
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload an image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Edit Instructions
                </label>
                <Textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Describe how you want to edit the image..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Button
              onClick={handleEditImage}
              disabled={!filePreview || !editPrompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Editing...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Image
                </>
              )}
            </Button>
          </div>
        );

      case 'analyze':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Upload Image or Video
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {filePreview ? (
                    <div className="space-y-2">
                      <Image
                        src={filePreview}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="max-w-full max-h-48 mx-auto rounded"
                      />
                      <p className="text-sm text-gray-500">
                        {uploadedFile?.type.startsWith('video/') ? 'Video' : 'Image'} ready for analysis
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Search className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload an image or video</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Analysis Question (Optional)
                </label>
                <Textarea
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  placeholder="Ask a specific question about the content..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!filePreview || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>
        );

      case 'transcribe':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Upload Audio File
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {filePreview ? (
                    <div className="space-y-2">
                      <Music className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Audio file ready for transcription</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Mic className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload an audio file</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            <Button
              onClick={handleTranscribe}
              disabled={!filePreview || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Transcribe Audio
                </>
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Creator Studio
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered multimedia creation
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <Tabs value={activeTool} onValueChange={(value) => setActiveTool(value as 'generate' | 'edit' | 'analyze' | 'transcribe')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate" className="text-xs">
                <Wand2 className="w-4 h-4 mr-1" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mt-2">
              <TabsTrigger value="analyze" className="text-xs">
                <Search className="w-4 h-4 mr-1" />
                Analyze
              </TabsTrigger>
              <TabsTrigger value="transcribe" className="text-xs">
                <Mic className="w-4 h-4 mr-1" />
                Transcribe
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setPrompt('A beautiful landscape with mountains and a lake')}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Landscape
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setPrompt('A portrait of a person in professional attire')}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Portrait
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setPrompt('A futuristic city with flying cars and neon lights')}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Sci-Fi
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                      Style
                    </label>
                    <select
                      value={settings.style}
                      onChange={(e) => updateSettings({ style: e.target.value })}
                      className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="realistic">Realistic</option>
                      <option value="artistic">Artistic</option>
                      <option value="abstract">Abstract</option>
                      <option value="cartoon">Cartoon</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                      Model
                    </label>
                    <select
                      value={settings.model}
                      onChange={(e) => updateSettings({ model: e.target.value })}
                      className="w-full p-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    >
                      <option value="imagen-3.0-generate-002">Imagen 3.0</option>
                      <option value="imagen-4.0-generate-001">Imagen 4.0</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
              {renderToolContent()}
            </div>
          </div>

          {/* Results */}
          {(result || error) && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="max-w-4xl mx-auto">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Result
                      </h3>
                      <div className="flex space-x-2">
                        {result.content && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = result.content;
                              const fileExtension = result.format 
                                ? result.format.split('/')[1] || 'png' 
                                : 'png';
                              link.download = `creator-studio-${Date.now()}.${fileExtension}`;
                              link.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>

                    {result.content && (
                      <div className="space-y-4">
                        {result.type === 'image' && (
                          <Image
                            src={result.content}
                            alt="Generated content"
                            width={400}
                            height={300}
                            className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                        )}
                        
                        {isAnalysisResult(result) && result.analysis && (
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Analysis
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300">
                              {result.analysis.description}
                            </p>
                            {result.analysis.tags && result.analysis.tags.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-2">
                                  {result.analysis.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {isTranscriptionResult(result) && result.transcription && (
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Transcription
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300">
                              {result.transcription}
                            </p>
                            {result.confidence && (
                              <div className="mt-2 text-sm text-gray-500">
                                Confidence: {Math.round(result.confidence * 100)}%
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

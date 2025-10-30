import { z } from 'zod';

// Input schemas for different AI flows

export const AssistantInputSchema = z.object({
  prompt: z.string().min(1).max(1000),
  context: z.object({
    currentApp: z.string().optional(),
    recentActions: z.array(z.string()).optional(),
    userPreferences: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  options: z.object({
    includeActions: z.boolean().default(true),
    maxActions: z.number().min(1).max(10).default(5),
    confidence: z.number().min(0).max(1).default(0.7),
  }).optional(),
});

export const ChatInputSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.string().datetime().optional(),
  })).max(50).optional(),
  model: z.enum(['flash-lite', 'flash', 'pro']).default('flash'),
  settings: z.object({
    temperature: z.number().min(0).max(2).default(0.7),
    maxTokens: z.number().min(1).max(4000).default(1000),
    topP: z.number().min(0).max(1).default(0.9),
    topK: z.number().min(1).max(100).default(40),
  }).optional(),
  conversationId: z.string().optional(),
});

export const BrowserInputSchema = z.object({
  query: z.string().min(1).max(200),
  searchType: z.enum(['web', 'images', 'videos', 'news', 'academic']).default('web'),
  filters: z.object({
    language: z.string().default('en'),
    region: z.string().optional(),
    timeRange: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).default('all'),
    safeSearch: z.boolean().default(true),
  }).optional(),
  options: z.object({
    maxResults: z.number().min(1).max(20).default(10),
    includeSummary: z.boolean().default(true),
    includeImages: z.boolean().default(false),
  }).optional(),
});

export const FileOperationInputSchema = z.object({
  operation: z.enum(['read', 'write', 'delete', 'move', 'copy', 'list', 'search']),
  path: z.string().min(1),
  data: z.unknown().optional(),
  options: z.object({
    encoding: z.enum(['utf8', 'base64', 'binary']).default('utf8'),
    recursive: z.boolean().default(false),
    includeHidden: z.boolean().default(false),
    overwrite: z.boolean().default(false),
  }).optional(),
});

export const AppOperationInputSchema = z.object({
  operation: z.enum(['open', 'close', 'install', 'uninstall', 'update', 'search', 'info']),
  appId: z.string().min(1),
  data: z.unknown().optional(),
  options: z.object({
    source: z.enum(['store', 'file', 'url']).optional(),
    keepData: z.boolean().default(false),
    version: z.string().optional(),
    category: z.string().optional(),
  }).optional(),
});

export const SystemOperationInputSchema = z.object({
  operation: z.enum(['info', 'command', 'settings', 'status', 'restart', 'shutdown']),
  data: z.unknown().optional(),
  options: z.object({
    type: z.enum(['memory', 'storage', 'apps', 'settings', 'network']).optional(),
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
    timeout: z.number().min(1000).max(300000).default(30000),
  }).optional(),
});

export const MediaGenerationInputSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'text']),
  prompt: z.string().min(1).max(1000),
  style: z.string().optional(),
  options: z.object({
    width: z.number().min(64).max(2048).default(1024),
    height: z.number().min(64).max(2048).default(1024),
    duration: z.number().min(1).max(60).optional(),
    quality: z.enum(['low', 'medium', 'high']).default('medium'),
    format: z.string().optional(),
    model: z.string().optional(),
  }).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const AnalysisInputSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'text', 'document']),
  content: z.string(), // Base64 encoded or URL
  analysisType: z.enum(['general', 'sentiment', 'entities', 'classification', 'transcription']).default('general'),
  options: z.object({
    language: z.string().default('en'),
    confidence: z.number().min(0).max(1).default(0.5),
    includeMetadata: z.boolean().default(true),
    maxResults: z.number().min(1).max(100).default(10),
  }).optional(),
  context: z.string().optional(),
});

export const WorkflowInputSchema = z.object({
  workflowId: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    config: z.record(z.string(), z.unknown()),
    dependencies: z.array(z.string()).optional(),
  })).min(1).max(20),
  options: z.object({
    parallel: z.boolean().default(false),
    timeout: z.number().min(1000).max(3600000).default(300000),
    retries: z.number().min(0).max(5).default(3),
    onError: z.enum(['stop', 'continue', 'retry']).default('stop'),
  }).optional(),
});

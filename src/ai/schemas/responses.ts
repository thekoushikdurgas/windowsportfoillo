import { z } from 'zod';
import { ActionSchema } from './common';

// Response schemas for different AI flows

export const AssistantResponseSchema = z.object({
  response: z.string(),
  actions: z.array(ActionSchema).optional(),
  confidence: z.number().min(0).max(1).optional(),
  reasoning: z.string().optional(),
  toolsUsed: z.array(z.string()).optional(),
});

export const ChatResponseSchema = z.object({
  response: z.string(),
  model: z.string(),
  tokens: z.object({
    prompt: z.number(),
    completion: z.number(),
    total: z.number(),
  }).optional(),
  finishReason: z.string().optional(),
  conversationId: z.string().optional(),
});

export const BrowserResponseSchema = z.object({
  results: z.array(z.object({
    title: z.string(),
    url: z.string(),
    snippet: z.string(),
    relevance: z.number().min(0).max(1).optional(),
  })),
  summary: z.string(),
  searchTime: z.number().optional(),
  totalResults: z.number().optional(),
});

export const FileOperationResponseSchema = z.object({
  operation: z.enum(['read', 'write', 'delete', 'move', 'copy', 'list']),
  path: z.string(),
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  metadata: z.object({
    size: z.number().optional(),
    modified: z.string().datetime().optional(),
    permissions: z.string().optional(),
  }).optional(),
});

export const AppOperationResponseSchema = z.object({
  operation: z.enum(['open', 'close', 'install', 'uninstall', 'update', 'search']),
  appId: z.string(),
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  metadata: z.object({
    version: z.string().optional(),
    size: z.string().optional(),
    category: z.string().optional(),
  }).optional(),
});

export const SystemOperationResponseSchema = z.object({
  operation: z.enum(['info', 'command', 'settings', 'status']),
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  metadata: z.object({
    timestamp: z.string().datetime(),
    duration: z.number().optional(),
  }).optional(),
});

export const MediaGenerationResponseSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'text']),
  content: z.string(), // Base64 encoded or URL
  format: z.string(),
  metadata: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    duration: z.number().optional(),
    size: z.number().optional(),
    model: z.string().optional(),
  }).optional(),
  prompt: z.string().optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const AnalysisResponseSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'text', 'document']),
  content: z.string(),
  analysis: z.object({
    description: z.string(),
    tags: z.array(z.string()).optional(),
    confidence: z.number().min(0).max(1).optional(),
    entities: z.array(z.object({
      name: z.string(),
      type: z.string(),
      confidence: z.number().min(0).max(1),
    })).optional(),
    sentiment: z.object({
      score: z.number().min(-1).max(1),
      magnitude: z.number().min(0).max(1),
      label: z.string(),
    }).optional(),
  }),
  metadata: z.object({
    processingTime: z.number(),
    model: z.string(),
    version: z.string().optional(),
  }),
});

export const WorkflowResponseSchema = z.object({
  workflowId: z.string(),
  status: z.enum(['running', 'completed', 'failed', 'paused']),
  steps: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['pending', 'running', 'completed', 'failed']),
    result: z.unknown().optional(),
    error: z.string().optional(),
    duration: z.number().optional(),
  })),
  result: z.unknown().optional(),
  error: z.string().optional(),
  metadata: z.object({
    startedAt: z.string().datetime(),
    completedAt: z.string().datetime().optional(),
    totalDuration: z.number().optional(),
  }),
});

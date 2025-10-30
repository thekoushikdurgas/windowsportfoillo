import { z } from 'zod';

// Common schemas for DurgasOS AI responses

export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  timestamp: z.string().datetime().optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
  timestamp: z.string().datetime().optional(),
});

export const ActionSchema = z.object({
  type: z.string(),
  data: z.unknown(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  timestamp: z.string().datetime().optional(),
});

export const FileInfoSchema = z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(['file', 'directory']),
  size: z.number(),
  modified: z.string().datetime(),
  permissions: z.string().optional(),
});

export const AppInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  category: z.string(),
  icon: z.string(),
  installed: z.boolean(),
  features: z.array(z.string()).optional(),
  size: z.string().optional(),
  lastUsed: z.string().datetime().optional(),
});

export const SystemInfoSchema = z.object({
  memory: z.object({
    total: z.string(),
    used: z.string(),
    available: z.string(),
    usage: z.string(),
  }).optional(),
  storage: z.object({
    total: z.string(),
    used: z.string(),
    available: z.string(),
    usage: z.string(),
  }).optional(),
  apps: z.array(z.string()).optional(),
  settings: z.object({
    theme: z.string(),
    accentColor: z.string(),
    wallpaper: z.string(),
    language: z.string(),
  }).optional(),
});

export const CommandResultSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  output: z.string(),
  exitCode: z.number().optional(),
  duration: z.number().optional(),
});

export const MediaInfoSchema = z.object({
  type: z.enum(['image', 'video', 'audio', 'document']),
  format: z.string(),
  size: z.number(),
  duration: z.number().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(ChatMessageSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  settings: z.object({
    model: z.string(),
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
  }).optional(),
});

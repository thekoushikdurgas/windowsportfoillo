export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
  settings: AIConversationSettings;
}

export interface AIConversationSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt?: string;
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  handler: (parameters: Record<string, unknown>) => Promise<unknown>;
}

export interface AIFlow {
  id: string;
  name: string;
  description: string;
  steps: AIFlowStep[];
  triggers: AIFlowTrigger[];
  enabled: boolean;
}

export interface AIFlowStep {
  id: string;
  type: 'message' | 'tool' | 'condition' | 'delay';
  config: Record<string, unknown>;
  nextStepId?: string;
}

export interface AIFlowTrigger {
  type: 'keyword' | 'intent' | 'schedule' | 'event';
  pattern: string;
  config: Record<string, unknown>;
}

export interface AIAssistantConfig {
  name: string;
  model: string;
  systemPrompt: string;
  tools: AITool[];
  flows: AIFlow[];
  settings: AIConversationSettings;
  maxConversations: number;
  maxMessagesPerConversation: number;
}

export interface AIResponse {
  content: string;
  toolCalls?: Array<{
    name: string;
    parameters: Record<string, unknown>;
  }>;
  metadata: {
    model: string;
    tokens: number;
    processingTime: number;
    finishReason: string;
  };
}

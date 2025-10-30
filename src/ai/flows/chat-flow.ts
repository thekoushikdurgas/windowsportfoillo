import ai from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
// import { z } from 'zod';
import { ChatInputSchema } from '@/ai/schemas/inputs';
import { ChatResponseSchema } from '@/ai/schemas/responses';

export const chat = ai.defineFlow(
  {
    name: 'chat',
    inputSchema: ChatInputSchema,
    outputSchema: ChatResponseSchema,
  },
  async (input) => {
    const modelMap: Record<string, string> = {
      'flash-lite': 'gemini-2.5-flash-lite',
      'flash': 'gemini-2.5-flash',
      'pro': 'gemini-2.5-pro',
    };

    const model = googleAI.model(modelMap[input.model] || 'gemini-2.5-flash');
    
    // Build conversation history
    let conversationHistory = '';
    if (input.history && input.history.length > 0) {
      conversationHistory = `${input.history.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n')}\n\n`;
    }

    const fullPrompt = `${conversationHistory}User: ${input.message}`;

    const response = await ai.generate({
      model,
      prompt: fullPrompt,
      config: {
        systemInstruction: 'You are a helpful AI assistant for DurgasOS. Provide clear, accurate, and helpful responses. Be concise but informative.',
        temperature: input.settings?.temperature || 0.7,
        maxOutputTokens: input.settings?.maxTokens || 1000,
        topP: input.settings?.topP || 0.9,
        topK: input.settings?.topK || 40,
      },
    });

    return {
      response: response.text || 'No response generated',
      model: input.model,
      tokens: {
        prompt: response.usage?.inputTokens || 0,
        completion: response.usage?.outputTokens || 0,
        total: response.usage?.totalTokens || 0,
      },
      finishReason: response.finishReason || 'stop',
      conversationId: input.conversationId,
    };
  }
);

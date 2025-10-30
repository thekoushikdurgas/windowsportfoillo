import ai from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { AssistantInputSchema } from '@/ai/schemas/inputs';
import { AssistantResponseSchema } from '@/ai/schemas/responses';
import { openAppTool, createFolderTool, getSystemInfoTool, executeCommandTool } from '@/ai/tools/system-tools';

// Define the assistant flow using correct Genkit patterns
export const assistant = ai.defineFlow(
  {
    name: 'assistant',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantResponseSchema,
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    const response = await ai.generate({
      model,
      prompt: `User: ${input.prompt}`,
      tools: [openAppTool, createFolderTool, getSystemInfoTool, executeCommandTool],
      config: {
        systemInstruction: `You are Durgas Assistant, a helpful AI assistant for DurgasOS. 
        You can help users with:
        - Opening applications (use openApp tool)
        - Creating folders (use createFolder tool)
        - Getting system information (use getSystemInfo tool)
        - Executing commands (use executeCommand tool)
        - Answering questions about the system
        - Providing general assistance
        
        Be helpful, concise, and friendly. When users ask to open apps, use the openApp tool.
        When users ask to create folders, use the createFolder tool.
        When users ask about system status, use the getSystemInfo tool.
        When users want to run commands, use the executeCommand tool.`,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    return {
      response: response.text || 'No response generated',
      actions: [],
      confidence: 0.9,
      toolsUsed: [],
    };
  }
);

// Text-to-Speech flow using correct patterns
export const textToSpeech = ai.defineFlow(
  {
    name: 'textToSpeech',
    inputSchema: z.object({
      text: z.string().describe('The text to convert to speech'),
      voice: z.enum(['algenib', 'charon', 'fable', 'onyx', 'nova', 'shimmer']).default('algenib'),
      speed: z.number().min(0.25).max(4.0).default(1.0),
    }),
    outputSchema: z.object({
      audioUrl: z.string().describe('URL to the generated audio'),
      duration: z.number().optional().describe('Duration of the audio in seconds'),
    }),
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash-preview-tts');
    
    const response = await ai.generate({
      model,
      prompt: input.text,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voice },
          },
        },
      },
    });

    if (!response.media) {
      throw new Error('No audio generated');
    }

    // Convert the audio to base64 WAV format
    const audioBuffer = Buffer.from(
      response.media.url.substring(response.media.url.indexOf(',') + 1),
      'base64'
    );

    return {
      audioUrl: response.media.url,
      duration: audioBuffer.length / 24000, // Approximate duration
    };
  }
);

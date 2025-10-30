import ai from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

// Live Assistant Flow for real-time voice conversations
export const liveAssistant = ai.defineFlow(
  {
    name: 'liveAssistant',
    inputSchema: z.object({
      audio: z.string().describe('Base64 encoded audio input'),
      conversationId: z.string().optional().describe('Conversation ID for context'),
      settings: z.object({
        voice: z.enum(['algenib', 'charon', 'fable', 'onyx', 'nova', 'shimmer']).default('algenib'),
        language: z.string().default('en-US'),
        responseMode: z.enum(['conversational', 'assistant', 'creative']).default('conversational'),
      }).optional(),
    }),
    outputSchema: z.object({
      response: z.string().describe('AI response text'),
      audio: z.string().optional().describe('Generated audio response'),
      transcription: z.string().describe('Transcribed input audio'),
      conversationId: z.string().describe('Conversation ID'),
      timestamp: z.string().datetime().describe('Response timestamp'),
    }),
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    // First, transcribe the audio input
    const transcriptionResponse = await ai.generate({
      model,
      prompt: [
        { text: `Transcribe this audio to text. Language: ${input.settings?.language || 'en-US'}` },
        { 
          media: { 
            url: input.audio.startsWith('data:') ? input.audio : `data:audio/wav;base64,${input.audio}`,
            contentType: 'audio/wav'
          } 
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 200,
      },
    });

    const transcription = transcriptionResponse.text || '';

    // Generate AI response based on transcription
    const response = await ai.generate({
      model,
      prompt: `User: ${transcription}`,
      config: {
        systemInstruction: `You are a live AI assistant for DurgasOS. Respond naturally and conversationally. 
        Keep responses concise and helpful. Mode: ${input.settings?.responseMode || 'conversational'}`,
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    const responseText = response.text || 'I apologize, I didn\'t catch that. Could you please repeat?';

    // Generate audio response
    const audioResponse = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: responseText,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: input.settings?.voice || 'algenib' 
            },
          },
        },
      },
    });

    return {
      response: responseText,
      audio: audioResponse.media?.url,
      transcription,
      conversationId: input.conversationId || `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
);

// Voice Command Flow for system control
export const voiceCommand = ai.defineFlow(
  {
    name: 'voiceCommand',
    inputSchema: z.object({
      audio: z.string().describe('Base64 encoded audio input'),
      context: z.object({
        currentApp: z.string().optional(),
        availableApps: z.array(z.string()).optional(),
      }).optional(),
    }),
    outputSchema: z.object({
      command: z.string().describe('Recognized command'),
      action: z.enum(['open_app', 'close_app', 'system_info', 'file_operation', 'search', 'other']).describe('Command type'),
      parameters: z.record(z.string(), z.unknown()).optional().describe('Command parameters'),
      response: z.string().describe('Confirmation response'),
      executed: z.boolean().describe('Whether command was executed'),
    }),
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    // Transcribe the voice command
    const transcriptionResponse = await ai.generate({
      model,
      prompt: [
        { text: 'Transcribe this voice command accurately.' },
        { 
          media: { 
            url: input.audio.startsWith('data:') ? input.audio : `data:audio/wav;base64,${input.audio}`,
            contentType: 'audio/wav'
          } 
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 100,
      },
    });

    const transcription = transcriptionResponse.text || '';

    // Analyze the command and determine action
    const commandAnalysis = await ai.generate({
      model,
      prompt: `Analyze this voice command and determine the action: "${transcription}"

Available apps: ${input.context?.availableApps?.join(', ') || 'GeminiChat, CreatorStudio, FileExplorer, Settings, Terminal, Notepad, VideoPlayer'}

Respond with JSON format:
{
  "command": "original command text",
  "action": "open_app|close_app|system_info|file_operation|search|other",
  "parameters": {
    "appId": "app name if opening app",
    "query": "search query if searching",
    "path": "file path if file operation"
  },
  "response": "confirmation message"
}`,
      config: {
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });

    // Parse the JSON response
    let commandData;
    try {
      commandData = JSON.parse(commandAnalysis.text || '{}');
    } catch (error) {
      commandData = {
        command: transcription,
        action: 'other',
        parameters: {},
        response: 'I didn\'t understand that command.',
      };
    }

    return {
      command: transcription,
      action: commandData.action || 'other',
      parameters: commandData.parameters || {},
      response: commandData.response || 'Command processed.',
      executed: commandData.action !== 'other',
    };
  }
);

// Real-time Transcription Flow
export const realtimeTranscription = ai.defineFlow(
  {
    name: 'realtimeTranscription',
    inputSchema: z.object({
      audio: z.string().describe('Base64 encoded audio chunk'),
      language: z.string().default('en-US').describe('Audio language'),
      isFinal: z.boolean().default(false).describe('Whether this is the final chunk'),
    }),
    outputSchema: z.object({
      transcription: z.string().describe('Transcribed text'),
      isPartial: z.boolean().describe('Whether this is a partial transcription'),
      confidence: z.number().describe('Confidence score'),
      language: z.string().describe('Detected language'),
    }),
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    const response = await ai.generate({
      model,
      prompt: [
        { text: `Transcribe this audio chunk. Language: ${input.language}. ${input.isFinal ? 'This is the final chunk.' : 'This is a partial chunk.'}` },
        { 
          media: { 
            url: input.audio.startsWith('data:') ? input.audio : `data:audio/wav;base64,${input.audio}`,
            contentType: 'audio/wav'
          } 
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 100,
      },
    });

    return {
      transcription: response.text || '',
      isPartial: !input.isFinal,
      confidence: 0.9,
      language: input.language,
    };
  }
);
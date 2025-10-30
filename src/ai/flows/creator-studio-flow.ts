import ai from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { MediaGenerationInputSchema, AnalysisInputSchema } from '@/ai/schemas/inputs';
import { MediaGenerationResponseSchema, AnalysisResponseSchema } from '@/ai/schemas/responses';

// Image Generation Flow
export const generateImage = ai.defineFlow(
  {
    name: 'generateImage',
    inputSchema: MediaGenerationInputSchema,
    outputSchema: MediaGenerationResponseSchema,
  },
  async (input) => {
    const model = googleAI.model('imagen-3.0-generate-002');
    
    const response = await ai.generate({
      model,
      prompt: input.prompt,
      config: {
        aspectRatio: '1:1' as const,
        safetyFilterLevel: 'block_some',
        personGeneration: 'allow_adult',
      },
    });

    if (!response.media) {
      throw new Error('No image generated');
    }

    return {
      type: 'image' as const,
      content: response.media.url,
      format: 'image/png',
      metadata: {
        width: input.options?.width || 1024,
        height: input.options?.height || 1024,
        model: 'imagen-3.0-generate-002',
      },
      prompt: input.prompt,
      settings: input.settings,
    };
  }
);

// Image Editing Flow
export const editImage = ai.defineFlow(
  {
    name: 'editImage',
    inputSchema: z.object({
      image: z.string().describe('Base64 encoded image or URL'),
      prompt: z.string().describe('Editing instructions'),
      mask: z.string().optional().describe('Optional mask for specific areas'),
    }),
    outputSchema: MediaGenerationResponseSchema,
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash-image-preview');
    
    const response = await ai.generate({
      model,
      prompt: [
        { text: input.prompt },
        { 
          media: { 
            url: input.image.startsWith('data:') ? input.image : `data:image/jpeg;base64,${input.image}`,
            contentType: 'image/jpeg'
          } 
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!response.media) {
      throw new Error('No edited image generated');
    }

    return {
      type: 'image' as const,
      content: response.media.url,
      format: 'image/png',
      metadata: {
        model: 'gemini-2.5-flash-image-preview',
      },
      prompt: input.prompt,
    };
  }
);

// Image Analysis Flow
export const analyzeImage = ai.defineFlow(
  {
    name: 'analyzeImage',
    inputSchema: AnalysisInputSchema,
    outputSchema: AnalysisResponseSchema,
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    const response = await ai.generate({
      model,
      prompt: [
        { text: `Analyze this image and provide a detailed description. Focus on: ${input.analysisType}` },
        { 
          media: { 
            url: input.content.startsWith('data:') ? input.content : `data:image/jpeg;base64,${input.content}`,
            contentType: 'image/jpeg'
          } 
        },
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    return {
      type: input.type,
      content: input.content,
      analysis: {
        description: response.text || 'No analysis available',
        confidence: 0.9,
        tags: [], // Would be extracted from response in real implementation
        entities: [], // Would be extracted from response in real implementation
      },
      metadata: {
        processingTime: 1000, // Mock processing time
        model: 'gemini-2.5-flash',
      },
    };
  }
);

// Video Analysis Flow
export const analyzeVideo = ai.defineFlow(
  {
    name: 'analyzeVideo',
    inputSchema: AnalysisInputSchema,
    outputSchema: AnalysisResponseSchema,
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    const response = await ai.generate({
      model,
      prompt: [
        { text: `Analyze this video and provide a detailed description. Focus on: ${input.analysisType}` },
        { 
          media: { 
            url: input.content.startsWith('data:') ? input.content : `data:video/mp4;base64,${input.content}`,
            contentType: 'video/mp4'
          } 
        },
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    return {
      type: input.type,
      content: input.content,
      analysis: {
        description: response.text || 'No analysis available',
        confidence: 0.9,
        tags: [], // Would be extracted from response in real implementation
        entities: [], // Would be extracted from response in real implementation
      },
      metadata: {
        processingTime: 2000, // Mock processing time
        model: 'gemini-2.5-flash',
      },
    };
  }
);

// Audio Transcription Flow
export const transcribeAudio = ai.defineFlow(
  {
    name: 'transcribeAudio',
    inputSchema: z.object({
      audio: z.string().describe('Base64 encoded audio or URL'),
      language: z.string().default('en').describe('Audio language'),
    }),
    outputSchema: z.object({
      transcription: z.string().describe('Transcribed text'),
      confidence: z.number().describe('Confidence score'),
      language: z.string().describe('Detected language'),
    }),
  },
  async (input) => {
    const model = googleAI.model('gemini-2.5-flash');
    
    const response = await ai.generate({
      model,
      prompt: [
        { text: `Transcribe this audio to text. Language: ${input.language}` },
        { 
          media: { 
            url: input.audio.startsWith('data:') ? input.audio : `data:audio/wav;base64,${input.audio}`,
            contentType: 'audio/wav'
          } 
        },
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 500,
      },
    });

    return {
      transcription: response.text || 'No transcription available',
      confidence: 0.95,
      language: input.language,
    };
  }
);
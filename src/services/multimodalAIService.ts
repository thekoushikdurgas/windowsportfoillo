// import { AIMessage } from '@/types/ai';
import { logger, errorToLogContext } from '../lib/logger';

export interface MultimodalInput {
  text?: string;
  image?: File | string;
  audio?: File | Blob;
  video?: File | Blob;
}

export interface MultimodalResponse {
  text?: string;
  audio?: Blob;
  image?: string;
  video?: string;
  type: 'text' | 'audio' | 'image' | 'video' | 'multimodal';
}

export class MultimodalAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.genkit.dev') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async processMultimodalInput(input: MultimodalInput): Promise<MultimodalResponse> {
    try {
      const formData = new FormData();
      
      if (input.text) {
        formData.append('text', input.text);
      }
      
      if (input.image) {
        if (input.image instanceof File) {
          formData.append('image', input.image);
        } else {
          formData.append('image_url', input.image);
        }
      }
      
      if (input.audio) {
        formData.append('audio', input.audio);
      }
      
      if (input.video) {
        formData.append('video', input.video);
      }

      const response = await fetch(`${this.baseUrl}/multimodal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`);
      }

      const result = await response.json();
      return this.parseResponse(result);
    } catch (error) {
      logger.error('Multimodal AI processing error:', errorToLogContext(error));
      throw error;
    }
  }

  async generateImage(prompt: string, style?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          style: style || 'realistic',
          size: '1024x1024',
        }),
      });

      if (!response.ok) {
        throw new Error(`Image generation error: ${response.statusText}`);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      logger.error('Image generation error:', errorToLogContext(error));
      throw error;
    }
  }

  async generateAudio(text: string, voice?: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text,
          voice: voice || 'default',
          speed: 1.0,
          pitch: 1.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`Audio generation error: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      logger.error('Audio generation error:', errorToLogContext(error));
      throw error;
    }
  }

  async transcribeAudio(audio: File | Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audio);

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Audio transcription error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.text;
    } catch (error) {
      logger.error('Audio transcription error:', errorToLogContext(error));
      throw error;
    }
  }

  async analyzeImage(image: File | string): Promise<string> {
    try {
      const formData = new FormData();
      
      if (image instanceof File) {
        formData.append('image', image);
      } else {
        formData.append('image_url', image);
      }

      const response = await fetch(`${this.baseUrl}/analyze-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image analysis error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.description;
    } catch (error) {
      logger.error('Image analysis error:', errorToLogContext(error));
      throw error;
    }
  }

  private parseResponse(result: Record<string, unknown>): MultimodalResponse {
    if (result['text'] && result['audio']) {
      return {
        text: result['text'] as string,
        audio: result['audio'] as Blob,
        type: 'multimodal',
      };
    } else if (result['text']) {
      return {
        text: result['text'] as string,
        type: 'text',
      };
    } else if (result['audio']) {
      return {
        audio: result['audio'] as Blob,
        type: 'audio',
      };
    } else if (result['image']) {
      return {
        image: result['image'] as string,
        type: 'image',
      };
    } else if (result['video']) {
      return {
        video: result['video'] as string,
        type: 'video',
      };
    }

    throw new Error('Invalid response format');
  }
}

// Singleton instance
export const multimodalAI = new MultimodalAIService(
  process.env['NEXT_PUBLIC_AI_API_KEY'] || 'demo-key'
);

import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/ai/flows/creator-studio-flow';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, options, settings } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateImage({
      type: 'image',
      prompt,
      options: options || {},
      settings: settings || {},
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Image generation error', { error });
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
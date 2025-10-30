import { NextRequest, NextResponse } from 'next/server';
import { editImage } from '@/ai/flows/creator-studio-flow';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, prompt, mask } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      );
    }

    const result = await editImage({
      image,
      prompt,
      mask,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Image editing error', { error });
    return NextResponse.json(
      { error: 'Failed to edit image' },
      { status: 500 }
    );
  }
}
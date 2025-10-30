import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/ai/flows/creator-studio-flow';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audio, language } = body;

    if (!audio) {
      return NextResponse.json(
        { error: 'Audio is required' },
        { status: 400 }
      );
    }

    const result = await transcribeAudio({
      audio,
      language: language || 'en',
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Audio transcription error', { error });
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
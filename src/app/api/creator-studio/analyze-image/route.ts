import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/ai/flows/creator-studio-flow';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, analysisType, options, context } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const result = await analyzeImage({
      type: 'image',
      content,
      analysisType: analysisType || 'general',
      options,
      context,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Image analysis error', { error });
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/ai/flows/chat-flow';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model, history, settings, conversationId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await chat({
      message,
      model: model || 'flash',
      history: history || [],
      settings: settings || {},
      conversationId: conversationId || `conv_${Date.now()}`,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Chat error', { error });
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

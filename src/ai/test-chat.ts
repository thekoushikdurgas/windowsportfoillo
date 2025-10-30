// Test chat flow to verify the fix
import ai from './genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { logger } from '@/lib/logger';

async function testChat() {
  logger.info('Testing chat flow', { component: 'test-chat', action: 'start' });
  
  try {
    const model = googleAI.model('gemini-2.5-flash');
    
    const response = await ai.generate({
      model,
      prompt: 'User: Hello, how are you?',
      config: {
        systemInstruction: 'You are a helpful AI assistant for DurgasOS. Provide clear, accurate, and helpful responses. Be concise but informative.',
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    logger.info('Chat test successful', { 
      component: 'test-chat', 
      action: 'complete',
      responseLength: response.text?.length || 0,
      response: response.text
    });
  } catch (error) {
    logger.error('Chat test failed', { component: 'test-chat', action: 'error', error });
  }
}

testChat();

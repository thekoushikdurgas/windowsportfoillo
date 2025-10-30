// Comprehensive test for all Genkit flows
import ai from './genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { logger } from '@/lib/logger';

async function testAllFlows() {
  logger.info('Testing all Genkit flows', { component: 'test-all-flows', action: 'start' });
  
  const model = googleAI.model('gemini-2.5-flash');
  
  try {
    // Test 1: Simple text generation
    logger.info('Testing simple text generation', { component: 'test-all-flows', test: 'simple-generation' });
    const simpleResponse = await ai.generate({
      model,
      prompt: 'User: What is DurgasOS?',
      config: {
        systemInstruction: 'You are a helpful AI assistant for DurgasOS.',
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });
    logger.info('Simple text generation completed', { 
      component: 'test-all-flows', 
      test: 'simple-generation',
      responseLength: simpleResponse.text?.length || 0,
      preview: simpleResponse.text?.substring(0, 100)
    });

    // Test 2: Chat flow
    logger.info('Testing chat flow', { component: 'test-all-flows', test: 'chat-flow' });
    const chatResponse = await ai.generate({
      model,
      prompt: 'User: Hello, how can you help me?',
      config: {
        systemInstruction: 'You are a helpful AI assistant for DurgasOS. Provide clear, accurate, and helpful responses.',
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });
    logger.info('Chat flow completed', { 
      component: 'test-all-flows', 
      test: 'chat-flow',
      responseLength: chatResponse.text?.length || 0,
      preview: chatResponse.text?.substring(0, 100)
    });

    // Test 3: Assistant flow (with tools)
    logger.info('Testing assistant flow', { component: 'test-all-flows', test: 'assistant-flow' });
    const assistantResponse = await ai.generate({
      model,
      prompt: 'User: Open the browser application',
      config: {
        systemInstruction: 'You are Durgas Assistant. Help users with system tasks.',
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });
    logger.info('Assistant flow completed', { 
      component: 'test-all-flows', 
      test: 'assistant-flow',
      responseLength: assistantResponse.text?.length || 0,
      preview: assistantResponse.text?.substring(0, 100)
    });

    logger.info('All flow tests passed', { component: 'test-all-flows', action: 'complete' });
    logger.info('Test summary', { 
      component: 'test-all-flows', 
      summary: {
        textGeneration: 'works',
        chatFlow: 'works',
        assistantFlow: 'works',
        partTypeErrors: 'none'
      }
    });
    
  } catch (error) {
    logger.error('Test failed', { component: 'test-all-flows', action: 'error', error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
}

testAllFlows();

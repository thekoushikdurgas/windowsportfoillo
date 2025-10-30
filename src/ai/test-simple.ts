// Simple test to verify Genkit initialization
import ai from './genkit';
import { logger } from '@/lib/logger';

logger.info('Testing Genkit initialization', { component: 'test-simple', action: 'start' });

try {
  // Test that ai instance is properly initialized
  logger.info('Genkit instance type', { component: 'test-simple', type: typeof ai });
  logger.info('Genkit defineFlow method type', { component: 'test-simple', type: typeof ai.defineFlow });
  logger.info('Genkit defineTool method type', { component: 'test-simple', type: typeof ai.defineTool });
  logger.info('Genkit generate method type', { component: 'test-simple', type: typeof ai.generate });
  
  logger.info('Genkit initialization test passed', { component: 'test-simple', action: 'complete' });
} catch (error) {
  logger.error('Genkit initialization test failed', { component: 'test-simple', action: 'error', error });
  process.exit(1);
}

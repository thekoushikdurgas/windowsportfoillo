import { startFlowServer } from '@genkit-ai/express';
import express from 'express';
import cors from 'cors';
import { logger } from '@/lib/logger';

// Import Genkit instance first to ensure proper initialization
// import ai from './genkit';

// Import all tools first (they need the ai instance)
import './tools/system-tools';
import './tools/file-tools';
import './tools/app-tools';

// Import all flows (they depend on tools)
import './flows/assistant-flow';
import './flows/chat-flow';
import './flows/browser-flow';
import './flows/creator-studio-flow';
import './flows/live-assistant-flow';

const app = express();
const port = process.env['GENKIT_PORT'] || 4000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] || '1.0.0'
  });
});

// Start the Genkit flow server
startFlowServer({
  flows: [
    // Flows will be automatically discovered from imports
  ],
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
});

// Start the server
app.listen(port, () => {
  // Server startup logs
  logger.info('Genkit server started', { 
    component: 'ai-server', 
    action: 'startup',
    port: port,
    developerUI: `http://localhost:${port}`,
    healthCheck: `http://localhost:${port}/health`
  });
});

export default app;

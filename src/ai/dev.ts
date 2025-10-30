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

// Note: Development server should be started using genkit CLI
// Run: npm run genkit:dev
// Or with Express server: npm run genkit:server

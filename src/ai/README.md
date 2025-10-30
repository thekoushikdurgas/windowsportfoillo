# DurgasOS AI Integration with Google Genkit

This directory contains the complete AI integration for DurgasOS using Google Genkit, following the latest patterns and best practices.

## 🏗️ Architecture

```
src/ai/
├── genkit.ts              # Genkit configuration and initialization
├── server.ts              # Express server for hosting flows
├── dev.ts                 # Development entry point
├── test-integration.ts    # Integration test file
├── flows/                 # AI flow definitions
│   ├── assistant-flow.ts  # Main assistant with tools
│   ├── chat-flow.ts       # Chat functionality
│   ├── browser-flow.ts    # Web search and browsing
│   ├── creator-studio-flow.ts # Media generation and analysis
│   └── live-assistant-flow.ts # Voice conversations
├── tools/                 # Tool definitions
│   ├── system-tools.ts    # System operations
│   ├── file-tools.ts      # File system operations
│   └── app-tools.ts       # Application management
└── schemas/               # Zod schemas for structured I/O
    ├── common.ts          # Common schemas
    ├── inputs.ts          # Input schemas
    └── responses.ts       # Response schemas
```

## 🚀 Getting Started

### Prerequisites

1. **Node.js 20+** - Required for Genkit
2. **Google AI API Key** - Get from [Google AI Studio](https://aistudio.google.com/)

### Environment Setup

Create a `.env.local` file with:

```bash
# Required
GOOGLE_GENAI_API_KEY=your_api_key_here

# Optional
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
NODE_ENV=development
GENKIT_PORT=4000
```

### Installation

```bash
# Install dependencies
npm install

# Install Genkit CLI globally
npm install -g genkit-cli
```

## 🛠️ Development

### Start Development Server

```bash
# Option 1: Genkit CLI (recommended for development)
npm run genkit:dev

# Option 2: Express server (for production-like testing)
npm run genkit:server

# Option 3: Watch mode for development
npm run genkit:watch
```

### Access Developer UI

Once running, visit: http://localhost:4000

## 📋 Available Flows

### 1. Assistant Flow (`assistant`)

Main AI assistant with system integration capabilities.

**Input:**

```typescript
{
  prompt: string;
  context?: {
    currentApp?: string;
    recentActions?: string[];
    userPreferences?: Record<string, unknown>;
  };
  options?: {
    includeActions: boolean;
    maxActions: number;
    confidence: number;
  };
}
```

**Output:**

```typescript
{
  response: string;
  actions?: Array<{
    type: string;
    data: unknown;
    priority: 'low' | 'medium' | 'high';
  }>;
  confidence: number;
  toolsUsed: string[];
}
```

### 2. Chat Flow (`chat`)

Conversational AI with multiple model support.

**Models Available:**

- `flash-lite` - Fast, lightweight responses
- `flash` - Balanced performance and quality
- `pro` - Highest quality, slower responses

### 3. Browser Flow (`browser`)

Web search and information retrieval.

**Features:**

- Web search with AI summarization
- Configurable result limits
- Search type filtering (web, images, videos, news, academic)

### 4. Creator Studio Flows

Media generation and analysis capabilities.

**Available Flows:**

- `generateImage` - AI image generation
- `editImage` - Image editing with prompts
- `analyzeImage` - Image content analysis
- `analyzeVideo` - Video content analysis
- `transcribeAudio` - Audio transcription

### 5. Live Assistant Flows

Real-time voice interaction.

**Available Flows:**

- `liveAssistant` - Voice conversation with AI
- `voiceCommand` - Voice-controlled system commands
- `realtimeTranscription` - Real-time audio transcription

## 🔧 Available Tools

### System Tools

- `openApp` - Open applications in DurgasOS
- `createFolder` - Create file system folders
- `getSystemInfo` - Retrieve system information
- `executeCommand` - Run terminal commands

### File Tools

- `readFile` - Read file contents
- `writeFile` - Write content to files
- `listDirectory` - List directory contents
- `deleteFile` - Delete files/directories
- `moveFile` - Move/rename files

### App Tools

- `searchApps` - Search for applications
- `getAppInfo` - Get application details
- `installApp` - Install new applications
- `uninstallApp` - Remove applications
- `updateApp` - Update applications

## 📊 Structured Output

All flows use Zod schemas for type-safe input/output validation:

### Input Schemas

- `AssistantInputSchema` - Assistant flow inputs
- `ChatInputSchema` - Chat flow inputs
- `BrowserInputSchema` - Browser flow inputs
- `MediaGenerationInputSchema` - Media generation inputs
- `AnalysisInputSchema` - Analysis flow inputs

### Response Schemas

- `AssistantResponseSchema` - Assistant responses
- `ChatResponseSchema` - Chat responses
- `BrowserResponseSchema` - Browser responses
- `MediaGenerationResponseSchema` - Media generation responses
- `AnalysisResponseSchema` - Analysis responses

## 🔄 Integration with DurgasOS Apps

### GeminiChat App

```typescript
// Example usage in React component
const response = await fetch('/api/genkit/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello, how can you help me?',
    model: 'flash',
    settings: { temperature: 0.7 },
  }),
});
```

### CreatorStudio App

```typescript
// Generate an image
const imageResponse = await fetch('/api/genkit/generateImage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'image',
    prompt: 'A futuristic desktop interface',
    options: { width: 1024, height: 1024 },
  }),
});
```

### LiveAssistant App

```typescript
// Voice conversation
const voiceResponse = await fetch('/api/genkit/liveAssistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    audio: base64AudioData,
    settings: { voice: 'algenib', language: 'en-US' },
  }),
});
```

## 🧪 Testing

### Run Integration Test

```bash
tsx src/ai/test-integration.ts
```

### Test Individual Flows

Use the Genkit Developer UI at http://localhost:4000 to test flows interactively.

## 🚀 Production Deployment

### Environment Variables

```bash
NODE_ENV=production
GOOGLE_GENAI_API_KEY=your_production_key
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GENKIT_PORT=4000
```

### Build and Start

```bash
npm run build
npm run genkit:server
```

## 📚 API Reference

### Flow Endpoints

- `POST /assistant` - Main assistant flow
- `POST /chat` - Chat flow
- `POST /browser` - Browser/search flow
- `POST /generateImage` - Image generation
- `POST /editImage` - Image editing
- `POST /analyzeImage` - Image analysis
- `POST /analyzeVideo` - Video analysis
- `POST /transcribeAudio` - Audio transcription
- `POST /liveAssistant` - Voice conversation
- `POST /voiceCommand` - Voice commands
- `POST /realtimeTranscription` - Real-time transcription

### Health Check

- `GET /health` - Server health status

## 🔍 Debugging

### Enable Debug Traces

Set `NODE_ENV=development` to enable detailed execution traces.

### View Logs

Check the Genkit Developer UI for detailed flow execution logs and traces.

### Common Issues

1. **API Key Not Found**
   - Ensure `GOOGLE_GENAI_API_KEY` is set in environment
   - Check `.env.local` file exists and is loaded

2. **Flow Not Found**
   - Ensure flows are imported in `dev.ts`
   - Check flow names match exactly

3. **Tool Execution Errors**
   - Verify tool definitions are correct
   - Check tool input schemas match expected format

## 🤝 Contributing

When adding new flows or tools:

1. Follow the existing patterns in the codebase
2. Add proper Zod schemas for input/output validation
3. Include comprehensive error handling
4. Add tests for new functionality
5. Update this README with new features

## 📄 License

This AI integration is part of DurgasOS and follows the same license terms.

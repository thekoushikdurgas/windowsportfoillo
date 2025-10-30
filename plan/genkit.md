# Genkit Integration Plan for DurgasOS

## Overview

This document outlines the comprehensive plan for implementing Google Genkit correctly into the DurgasOS project, based on the latest Genkit patterns and best practices from the official documentation.

## Current State Analysis

### Issues Identified

1. **Incorrect Flow Definition**: Current flows use `new Flow()` constructor which is not the correct Genkit pattern
2. **Missing Express Integration**: No server setup for hosting Genkit flows
3. **Outdated API Usage**: Using deprecated `model.generateText()` instead of `ai.generate()`
4. **Missing Tool Definitions**: Tools are not properly defined using Genkit's `defineTool` API
5. **Incomplete Configuration**: Genkit instance not properly configured for production use

### Current Dependencies

- `genkit`: ^1.19.3 (needs update to latest)
- `@genkit-ai/google-genai`: ^1.21.0 (current)
- `@genkit-ai/next`: ^1.21.0 (current)
- `genkit-cli`: ^1.19.3 (needs update)

## Implementation Plan

### Phase 1: Update Dependencies and Configuration

#### 1.1 Update Package.json

- Update Genkit to latest version (^1.0.0-rc.18)
- Add missing dependencies:
  - `@genkit-ai/express`: For Express server integration
  - `@genkit-ai/vertexai`: For Vertex AI integration
  - `express`: For server setup
  - `zod`: Already present, ensure latest version

#### 1.2 Fix Genkit Configuration

- Update `src/ai/genkit.ts` to use proper initialization
- Add proper plugin configuration
- Set up environment variable handling

### Phase 2: Implement Correct Flow Patterns

#### 2.1 Update Flow Definitions

Replace current `new Flow()` pattern with `ai.defineFlow()`:

```typescript
// Current (incorrect)
export const assistant = new Flow({...}, async (input) => {...});

// New (correct)
export const assistant = ai.defineFlow({...}, async (input) => {...});
```

#### 2.2 Implement Tool Definitions

Use `ai.defineTool()` for proper tool definitions:

```typescript
const openAppTool = ai.defineTool(
  {
    name: 'openApp',
    inputSchema: z.object({
      appId: z.string(),
      data: z.unknown().optional(),
    }),
    description: 'Open an application in DurgasOS',
  },
  async input => {
    // Tool implementation
  }
);
```

### Phase 3: Add Express Server Integration

#### 3.1 Create Express Server

- Add `src/ai/server.ts` for Express server setup
- Use `@genkit-ai/express` for flow hosting
- Configure proper CORS and middleware

#### 3.2 Update Development Scripts

- Update `genkit:dev` script to use Express server
- Add proper server startup commands

### Phase 4: Implement Advanced Features

#### 4.1 Structured Output

- Add proper Zod schemas for structured responses
- Implement `output: { schema: Schema }` in generate calls

#### 4.2 Streaming Support

- Add streaming capabilities to flows
- Implement `sendChunk` for real-time responses

#### 4.3 Multimodal Support

- Add image and audio processing capabilities
- Implement proper media handling

### Phase 5: Integration with DurgasOS Apps

#### 5.1 Update AI Apps

- Update GeminiChat app to use new flow patterns
- Update CreatorStudio app for image generation
- Update LiveAssistant app for real-time AI

#### 5.2 Add New AI Features

- Text-to-Speech with proper audio generation
- Image generation and editing
- Video analysis capabilities
- Voice conversation support

## File Structure Changes

```
src/ai/
├── genkit.ts              # Updated configuration
├── server.ts              # New Express server
├── dev.ts                 # Updated development entry
├── flows/
│   ├── assistant-flow.ts  # Updated with correct patterns
│   ├── chat-flow.ts       # Updated with correct patterns
│   ├── browser-flow.ts    # Updated with correct patterns
│   ├── creator-studio-flow.ts
│   ├── live-assistant-flow.ts
│   └── tools/             # New tools directory
│       ├── system-tools.ts
│       ├── file-tools.ts
│       └── app-tools.ts
└── schemas/               # New schemas directory
    ├── common.ts
    ├── responses.ts
    └── inputs.ts
```

## Implementation Steps

### Step 1: Update Dependencies

1. Update package.json with latest Genkit versions
2. Install new dependencies
3. Update TypeScript types

### Step 2: Fix Core Configuration

1. Update `src/ai/genkit.ts` with proper initialization
2. Add environment variable validation
3. Configure plugins correctly

### Step 3: Update Flow Definitions

1. Convert all flows to use `ai.defineFlow()`
2. Implement proper input/output schemas
3. Add error handling

### Step 4: Add Express Server

1. Create `src/ai/server.ts`
2. Configure flow hosting
3. Add proper middleware

### Step 5: Implement Tools

1. Create tool definitions using `ai.defineTool()`
2. Add system interaction tools
3. Add file system tools

### Step 6: Update Apps Integration

1. Update GeminiChat app
2. Update CreatorStudio app
3. Update LiveAssistant app

### Step 7: Add Advanced Features

1. Implement structured output
2. Add streaming support
3. Add multimodal capabilities

### Step 8: Testing and Validation

1. Test all flows in development
2. Validate Express server integration
3. Test app integrations

## Environment Variables Required

```bash
# Google AI API Key
GOOGLE_GENAI_API_KEY=your_api_key_here

# Optional: Vertex AI Configuration
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_CLOUD_LOCATION=us-central1

# Development
NODE_ENV=development
GENKIT_PORT=4000
```

## Development Commands

```bash
# Start Genkit development server
npm run genkit:dev

# Start with Express server
npm run genkit:server

# Build and test
npm run build
npm run test
```

## Benefits of This Implementation

1. **Correct API Usage**: Follows official Genkit patterns
2. **Better Performance**: Proper streaming and caching
3. **Enhanced Features**: Structured output, tools, multimodal
4. **Production Ready**: Express server for deployment
5. **Developer Experience**: Better debugging and development tools
6. **Scalability**: Proper architecture for growth

## Next Steps

1. Begin with Phase 1 (Dependencies and Configuration)
2. Progress through each phase systematically
3. Test thoroughly at each step
4. Document any issues or modifications
5. Validate integration with existing DurgasOS apps

This plan ensures a robust, scalable, and maintainable Genkit integration that follows best practices and provides a solid foundation for AI-powered features in DurgasOS.

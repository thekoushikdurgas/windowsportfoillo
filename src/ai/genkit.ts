import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { vertexAI } from '@genkit-ai/vertexai';

// Validate required environment variables
const getApiKey = () => {
  const apiKey = process.env['GOOGLE_GENAI_API_KEY'] || process.env['GOOGLE_API_KEY'] || 'AIzaSyCDD1bDlknbDvkQugTTrxgrYKXJ6Qsm-n4';
  if (!apiKey) {
    throw new Error('GOOGLE_GENAI_API_KEY environment variable is required');
  }
  return apiKey;
};

const getProjectId = () => {
  return process.env['GOOGLE_CLOUD_PROJECT'] || process.env['GOOGLE_GENAI_PROJECT_ID'];
};

const getLocation = () => {
  return process.env['GOOGLE_CLOUD_LOCATION'] || 'us-central1';
};

// Initialize Genkit with proper configuration
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: getApiKey(),
    }),
    // Add Vertex AI plugin if project ID is available
    ...(getProjectId() ? [
      vertexAI({
        projectId: getProjectId() as string,
        location: getLocation(),
      })
    ] : []),
  ],
});

export default ai;
export { ai as genkit };

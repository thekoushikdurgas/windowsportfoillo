# DurgasOS API Postman Collection

This directory contains the Postman collection and environment files for testing the DurgasOS Backend API.

## Files

- `DurgasOS-API.postman_collection.json` - Complete Postman collection with all API endpoints
- `DurgasOS-Development.postman_environment.json` - Development environment variables

## Setup Instructions

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Import both files:
   - `DurgasOS-API.postman_collection.json`
   - `DurgasOS-Development.postman_environment.json`

### 2. Select Environment

1. In Postman, click the environment dropdown (top right)
2. Select **"DurgasOS Development"**

### 3. Start Backend Server

Make sure the backend server is running:

```bash
cd backend
uvicorn app.main:app --reload
```

The server should be running on `http://localhost:8000`

### 4. Test the API

1. Open the **DurgasOS API** collection
2. Start with the **Root > Health Check** endpoint to verify the server is running
3. Explore other endpoints organized by module

## Collection Structure

The collection is organized into the following folders:

### Root
- **Root Endpoint** - API information
- **Health Check** - Server health status

### Gemini
AI-powered endpoints:
- **Chat** - AI conversation
- **Generate Image** - AI image generation
- **Generate Video** - AI video generation
- **Transcribe Audio** - Audio to text transcription
- **Text to Speech** - Text to audio conversion

### Files
File management:
- **List Files** - Get files in a directory
- **Upload File** - Upload a file (multipart/form-data)
- **Delete File** - Delete a file by ID

### Settings
Application settings:
- **Get Settings** - Retrieve all settings
- **Update Setting** - Update a specific setting

### Vector
Vector database operations:
- **Search** - Semantic search in vector DB
- **Add Documents** - Add documents to vector DB

### Desktop
Desktop state management:
- **Get Desktop State** - Retrieve window configurations
- **Save Desktop State** - Save window configurations

### WebSocket
Real-time notifications:
- **WebSocket Connection** - Connect for real-time notifications

## Environment Variables

The Development environment includes:

- `base_url`: `http://localhost:8000` - Base API URL
- `api_base`: `{{base_url}}/api/v1` - API base path
- `ws_url`: `ws://localhost:8000/ws` - WebSocket URL
- `api_version`: `v1` - API version

## Request Examples

All endpoints include example request bodies based on the backend Pydantic schemas. You can modify these examples as needed for your testing.

## Test Scripts

Each endpoint includes automated test scripts that validate:
- HTTP status codes
- Response structure
- Required fields

Tests run automatically after each request. Check the **Test Results** tab to see results.

## WebSocket Testing

For WebSocket endpoints:
1. Use Postman's WebSocket request type
2. Connect to `{{ws_url}}`
3. Send JSON messages in the format:
   ```json
   {
       "type": "send_notification",
       "data": {
           "title": "Notification Title",
           "message": "Notification message",
           "app_name": "App Name",
           "duration": 5000
       }
   }
   ```

## Troubleshooting

### Connection Errors
- Verify the backend server is running on `http://localhost:8000`
- Check the environment is selected in Postman
- Verify environment variables are correct

### 401/403 Errors
- Check if authentication is required (currently not implemented in backend)
- Verify CORS settings in backend if testing from browser

### 500 Errors
- Check backend logs for error details
- Verify required environment variables are set in backend `.env` file
- Ensure database and external services (Gemini API, Vector DB) are configured

## Backend Requirements

The backend requires the following environment variables (in `backend/.env`):

- `GEMINI_API_KEY` - Google Gemini API key
- `DATABASE_URL` or database connection parameters
- `VECTOR_DB_URL` - Vector database URL (optional)
- `SECRET_KEY` - Application secret key
- `CORS_ORIGINS` - Allowed CORS origins

See `backend/README.md` for more setup details.


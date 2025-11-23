"""Gemini AI Service"""
import google.generativeai as genai
from app.config.settings import settings
from app.modules.gemini.schemas import (
    ChatRequest, ChatResponse, ImageRequest, ImageResponse,
    VideoRequest, VideoResponse, TranscribeRequest, TranscribeResponse,
    TTSRequest, TTSResponse
)
from typing import List
import base64
import logging

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    """Service for Gemini AI operations"""
    
    MODELS = {
        "CHAT_COMPLEX": "gemini-3-pro-preview",
        "CHAT_FAST": "gemini-2.5-flash-lite",
        "IMAGE_GEN_HQ": "gemini-3-pro-image-preview",
        "IMAGE_GEN_FAST": "gemini-2.5-flash-image",
        "IMAGE_EDIT": "gemini-2.5-flash-image",
        "VIDEO_VEO_FAST": "veo-3.1-fast-generate-preview",
        "VIDEO_VEO_HQ": "veo-3.1-generate-preview",
        "AUDIO_TTS": "gemini-2.5-flash-preview-tts",
    }
    
    async def chat(self, request: ChatRequest) -> ChatResponse:
        """Generate chat response"""
        try:
            model = genai.GenerativeModel(request.model)
            
            # Build chat history
            chat = model.start_chat(history=[
                {"role": msg.role, "parts": [msg.text]} 
                for msg in request.history
            ])
            
            # Generate response
            response = chat.send_message(request.message)
            
            return ChatResponse(
                text=response.text,
                grounding_metadata=getattr(response, 'grounding_metadata', None)
            )
        except Exception as e:
            logger.error(f"Chat error: {e}")
            raise
    
    async def generate_image(self, request: ImageRequest) -> ImageResponse:
        """Generate image"""
        try:
            model_name = self.MODELS["IMAGE_GEN_HQ"] if request.is_hq else self.MODELS["IMAGE_GEN_FAST"]
            model = genai.GenerativeModel(model_name)
            
            response = model.generate_content(
                request.prompt,
                generation_config={
                    "response_mime_type": "image/png",
                }
            )
            
            images = []
            if hasattr(response, 'parts'):
                for part in response.parts:
                    if hasattr(part, 'inline_data'):
                        images.append(
                            f"data:{part.inline_data.mime_type};base64,{part.inline_data.data}"
                        )
            
            return ImageResponse(images=images)
        except Exception as e:
            logger.error(f"Image generation error: {e}")
            raise
    
    async def generate_video(self, request: VideoRequest) -> VideoResponse:
        """Generate video (placeholder - requires special API access)"""
        # Video generation requires special API access
        raise NotImplementedError("Video generation requires special API access")
    
    async def transcribe_audio(self, request: TranscribeRequest) -> TranscribeResponse:
        """Transcribe audio to text"""
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            
            audio_data = base64.b64decode(request.audio_base64)
            
            response = model.generate_content([
                {"mime_type": request.mime_type, "data": audio_data},
                "Transcribe this audio exactly."
            ])
            
            return TranscribeResponse(text=response.text)
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            raise
    
    async def text_to_speech(self, request: TTSRequest) -> TTSResponse:
        """Convert text to speech"""
        try:
            model = genai.GenerativeModel(self.MODELS["AUDIO_TTS"])
            
            response = model.generate_content(
                request.text,
                generation_config={
                    "response_mime_type": "audio/pcm",
                }
            )
            
            if hasattr(response, 'parts') and response.parts:
                audio_data = response.parts[0].inline_data.data
                return TTSResponse(audio_base64=audio_data)
            
            raise ValueError("No audio generated")
        except Exception as e:
            logger.error(f"TTS error: {e}")
            raise


# Service instance
gemini_service = GeminiService()


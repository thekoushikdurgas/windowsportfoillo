"""Gemini AI Controller (Route Handlers)"""
from fastapi import APIRouter, HTTPException
from app.modules.gemini.service import gemini_service
from app.modules.gemini.schemas import (
    ChatRequest, ChatResponse, ImageRequest, ImageResponse,
    VideoRequest, VideoResponse, TranscribeRequest, TranscribeResponse,
    TTSRequest, TTSResponse
)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint"""
    try:
        return await gemini_service.chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/image", response_model=ImageResponse)
async def generate_image(request: ImageRequest):
    """Generate image endpoint"""
    try:
        return await gemini_service.generate_image(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/video", response_model=VideoResponse)
async def generate_video(request: VideoRequest):
    """Generate video endpoint"""
    try:
        return await gemini_service.generate_video(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(request: TranscribeRequest):
    """Transcribe audio endpoint"""
    try:
        return await gemini_service.transcribe_audio(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tts", response_model=TTSResponse)
async def text_to_speech(request: TTSRequest):
    """Text to speech endpoint"""
    try:
        return await gemini_service.text_to_speech(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


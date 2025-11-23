from pydantic import BaseModel
from typing import List, Optional, Any


class ChatMessage(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str
    model: Optional[str] = "gemini-3-pro-preview"
    use_thinking: Optional[bool] = False
    use_grounding: Optional[bool] = False


class ChatResponse(BaseModel):
    text: str
    grounding_metadata: Optional[Any] = None


class ImageRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "1:1"
    is_hq: Optional[bool] = False


class ImageResponse(BaseModel):
    images: List[str]


class VideoRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "16:9"
    image_base64: Optional[str] = None


class VideoResponse(BaseModel):
    video_url: str


class TranscribeRequest(BaseModel):
    audio_base64: str
    mime_type: Optional[str] = "audio/mp3"


class TranscribeResponse(BaseModel):
    text: str


class TTSRequest(BaseModel):
    text: str


class TTSResponse(BaseModel):
    audio_base64: str


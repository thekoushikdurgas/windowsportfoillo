from pydantic import BaseModel
from typing import Optional


class NotificationRequest(BaseModel):
    title: str
    message: str
    app_name: Optional[str] = None
    duration: Optional[int] = 5000


class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    app_name: Optional[str] = None
    timestamp: int


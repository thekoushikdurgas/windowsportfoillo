from pydantic import BaseModel
from typing import Optional, Dict, Any


class SettingsRequest(BaseModel):
    key: str
    value: Any


class SettingsResponse(BaseModel):
    settings: Dict[str, Any]


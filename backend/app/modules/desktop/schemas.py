from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class WindowState(BaseModel):
    id: str
    app_id: str
    title: str
    is_open: bool
    is_minimized: bool
    is_maximized: bool
    z_index: int
    position: Dict[str, int]
    size: Dict[str, int]


class DesktopStateRequest(BaseModel):
    windows: List[WindowState]


class DesktopStateResponse(BaseModel):
    windows: List[WindowState]


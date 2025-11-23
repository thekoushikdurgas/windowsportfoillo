"""Desktop state service"""
from app.modules.desktop.schemas import DesktopStateRequest, DesktopStateResponse, WindowState
from typing import Dict

# Mock desktop state storage
desktop_states: Dict[str, DesktopStateResponse] = {}


class DesktopService:
    """Service for desktop state management"""
    
    async def get_state(self, user_id: str = "default") -> DesktopStateResponse:
        """Get desktop state"""
        return desktop_states.get(user_id, DesktopStateResponse(windows=[]))
    
    async def save_state(self, user_id: str, request: DesktopStateRequest) -> bool:
        """Save desktop state"""
        desktop_states[user_id] = DesktopStateResponse(windows=request.windows)
        return True


desktop_service = DesktopService()


"""Desktop controller"""
from fastapi import APIRouter
from app.modules.desktop.service import desktop_service
from app.modules.desktop.schemas import DesktopStateRequest, DesktopStateResponse

router = APIRouter()


@router.get("/state", response_model=DesktopStateResponse)
async def get_desktop_state(user_id: str = "default"):
    """Get desktop state"""
    return await desktop_service.get_state(user_id)


@router.post("/state")
async def save_desktop_state(request: DesktopStateRequest, user_id: str = "default"):
    """Save desktop state"""
    await desktop_service.save_state(user_id, request)
    return {"success": True}


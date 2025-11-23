"""Settings controller"""
from fastapi import APIRouter
from app.modules.settings.service import settings_service
from app.modules.settings.schemas import SettingsRequest, SettingsResponse

router = APIRouter()


@router.get("/", response_model=SettingsResponse)
async def get_settings():
    """Get settings"""
    return await settings_service.get_settings()


@router.post("/")
async def update_setting(request: SettingsRequest):
    """Update setting"""
    await settings_service.update_setting(request.key, request.value)
    return {"success": True}


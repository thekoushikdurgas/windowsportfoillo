"""Settings service"""
from app.modules.settings.schemas import SettingsResponse
from typing import Dict, Any

# Mock settings storage
settings_storage: Dict[str, Any] = {}


class SettingsService:
    """Service for user settings"""
    
    async def get_settings(self) -> SettingsResponse:
        """Get all settings"""
        return SettingsResponse(settings=settings_storage)
    
    async def update_setting(self, key: str, value: Any) -> bool:
        """Update a setting"""
        settings_storage[key] = value
        return True


settings_service = SettingsService()


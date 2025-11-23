"""Shared utility functions"""
from typing import Any, Dict


def create_response(data: Any = None, message: str = "Success", status_code: int = 200) -> Dict:
    """Create a standardized API response"""
    return {
        "success": True,
        "message": message,
        "data": data
    }


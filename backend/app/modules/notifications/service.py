"""Notifications service"""
from app.modules.notifications.schemas import NotificationRequest, NotificationResponse
import uuid
import time
from typing import List, Dict

# Active connections
active_connections: List[Dict] = []


class NotificationService:
    """Service for notifications"""
    
    async def send_notification(self, request: NotificationRequest, connection_id: str = None):
        """Send notification to connected clients"""
        notification = NotificationResponse(
            id=str(uuid.uuid4()),
            title=request.title,
            message=request.message,
            app_name=request.app_name,
            timestamp=int(time.time() * 1000)
        )
        
        # Broadcast to all connections or specific connection
        if connection_id:
            # Send to specific connection
            for conn in active_connections:
                if conn.get("id") == connection_id:
                    await conn["websocket"].send_json(notification.dict())
        else:
            # Broadcast to all
            for conn in active_connections:
                await conn["websocket"].send_json(notification.dict())
        
        return notification


notification_service = NotificationService()


"""WebSocket handler for notifications"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from app.modules.notifications.service import notification_service, active_connections
from app.modules.notifications.schemas import NotificationRequest
from app.config.settings import settings
import uuid
import json

router = APIRouter()


def check_origin(origin: str) -> bool:
    """Check if the origin is allowed"""
    if not origin:
        return False
    
    # Compare origin directly with allowed origins
    # Browsers send http:// or https:// in the origin header
    for allowed_origin in settings.CORS_ORIGINS:
        if origin == allowed_origin:
            return True
        # Also check with protocol conversion (http <-> ws, https <-> wss)
        if origin.replace("http://", "ws://").replace("https://", "wss://") == allowed_origin.replace("http://", "ws://").replace("https://", "wss://"):
            return True
    
    return False


@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time notifications"""
    # Check origin before accepting
    origin = websocket.headers.get("origin")
    
    # In development, be more permissive - allow connections without origin or from localhost
    if settings.ENVIRONMENT == "development":
        if not origin:
            # Allow connections without origin in development (e.g., from Postman, direct connections)
            pass
        elif origin and not check_origin(origin):
            # In development, also allow localhost connections even if not explicitly in CORS_ORIGINS
            if "localhost" in origin or "127.0.0.1" in origin:
                pass
            else:
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Origin not allowed")
                return
    elif origin and not check_origin(origin):
        # In production, strictly enforce origin checking
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION, reason="Origin not allowed")
        return
    
    await websocket.accept()
    connection_id = str(uuid.uuid4())
    
    # Add connection
    active_connections.append({
        "id": connection_id,
        "websocket": websocket
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
            try:
                message = json.loads(data)
                if message.get("type") == "send_notification":
                    request = NotificationRequest(**message.get("data", {}))
                    await notification_service.send_notification(request, connection_id)
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        # Remove connection
        active_connections[:] = [c for c in active_connections if c.get("id") != connection_id]


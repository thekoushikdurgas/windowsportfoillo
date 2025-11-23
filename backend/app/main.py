from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.modules.gemini.controller import router as gemini_router
from app.modules.files.controller import router as files_router
from app.modules.settings.controller import router as settings_router
from app.modules.notifications.websocket import websocket_endpoint
from app.modules.vector.controller import router as vector_router
from app.modules.desktop.controller import router as desktop_router

app = FastAPI(
    title="DurgasOS API",
    description="Backend API for DurgasOS Desktop Environment",
    version="0.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(gemini_router, prefix="/api/v1/gemini", tags=["gemini"])
app.include_router(files_router, prefix="/api/v1/files", tags=["files"])
app.include_router(settings_router, prefix="/api/v1/settings", tags=["settings"])
app.include_router(vector_router, prefix="/api/v1/vector", tags=["vector"])
app.include_router(desktop_router, prefix="/api/v1/desktop", tags=["desktop"])

# WebSocket endpoint - register directly to handle /ws (without trailing slash)
@app.websocket("/ws")
async def ws_endpoint(websocket: WebSocket):
    await websocket_endpoint(websocket)


@app.get("/")
async def root():
    return {"message": "DurgasOS API", "version": "0.1.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


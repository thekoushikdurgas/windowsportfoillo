"""Files controller"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.modules.files.service import file_service
from app.modules.files.schemas import FileListResponse

router = APIRouter()


@router.get("/", response_model=FileListResponse)
async def list_files(parent_id: str = "c_drive"):
    """List files"""
    return await file_service.list_files(parent_id)


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), parent_id: str = "c_drive"):
    """Upload file"""
    content = await file.read()
    return await file_service.upload_file(file.filename, content, parent_id)


@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """Delete file"""
    success = await file_service.delete_file(file_id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"success": True}


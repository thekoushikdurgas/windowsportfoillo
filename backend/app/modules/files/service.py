"""File operations service"""
from app.modules.files.schemas import FileItem, FileListResponse
from typing import List
import os
import uuid
from datetime import datetime

# Mock file storage (in production, use proper storage)
file_storage: List[FileItem] = [
    FileItem(id="root", name="This PC", type="folder", date_modified="", parent_id=None),
    FileItem(id="c_drive", name="Local Disk (C:)", type="drive", date_modified="", size="800 GB free", parent_id="root"),
]


class FileService:
    """Service for file operations"""
    
    async def list_files(self, parent_id: str = "c_drive") -> FileListResponse:
        """List files in a directory"""
        files = [f for f in file_storage if f.parent_id == parent_id]
        return FileListResponse(files=files)
    
    async def upload_file(self, filename: str, content: bytes, parent_id: str = "c_drive") -> dict:
        """Upload a file"""
        file_id = str(uuid.uuid4())
        file_item = FileItem(
            id=file_id,
            name=filename,
            type="file",
            size=f"{len(content)} bytes",
            date_modified=datetime.now().isoformat(),
            parent_id=parent_id
        )
        file_storage.append(file_item)
        return {"file_id": file_id, "filename": filename, "size": len(content)}
    
    async def delete_file(self, file_id: str) -> bool:
        """Delete a file"""
        global file_storage
        file_storage = [f for f in file_storage if f.id != file_id]
        return True


file_service = FileService()


from pydantic import BaseModel
from typing import List, Optional


class FileItem(BaseModel):
    id: str
    name: str
    type: str
    size: Optional[str] = None
    date_modified: str
    parent_id: Optional[str] = None


class FileListResponse(BaseModel):
    files: List[FileItem]


class FileUploadResponse(BaseModel):
    file_id: str
    filename: str
    size: int


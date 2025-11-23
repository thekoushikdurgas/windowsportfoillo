"""Vector database controller"""
from fastapi import APIRouter
from app.modules.vector.service import vector_service
from app.modules.vector.schemas import VectorSearchRequest, VectorSearchResponse, VectorAddRequest

router = APIRouter()


@router.post("/search", response_model=VectorSearchResponse)
async def search(request: VectorSearchRequest):
    """Search in vector database"""
    return await vector_service.search(request)


@router.post("/add")
async def add_documents(request: VectorAddRequest):
    """Add documents to vector database"""
    return await vector_service.add_documents(request)


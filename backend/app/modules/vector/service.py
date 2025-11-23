"""Vector database service"""
from app.database.vector_db import vector_db
from app.modules.vector.schemas import VectorSearchRequest, VectorSearchResponse, VectorAddRequest
from typing import List, Dict, Any


class VectorService:
    """Service for vector database operations"""
    
    async def search(self, request: VectorSearchRequest) -> VectorSearchResponse:
        """Search in vector database"""
        results = vector_db.search([request.query], n_results=request.n_results)
        return VectorSearchResponse(results=results)
    
    async def add_documents(self, request: VectorAddRequest):
        """Add documents to vector database"""
        vector_db.add_documents(
            documents=request.documents,
            ids=request.ids,
            metadatas=request.metadatas
        )
        return {"success": True}


vector_service = VectorService()


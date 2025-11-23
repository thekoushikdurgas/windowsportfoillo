from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class VectorSearchRequest(BaseModel):
    query: str
    n_results: Optional[int] = 5


class VectorSearchResponse(BaseModel):
    results: List[Dict[str, Any]]


class VectorAddRequest(BaseModel):
    documents: List[str]
    ids: Optional[List[str]] = None
    metadatas: Optional[List[Dict]] = None


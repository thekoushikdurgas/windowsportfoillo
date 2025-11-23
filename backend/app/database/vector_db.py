"""Vector Database Client (ChromaDB)"""
import chromadb
from app.config.settings import settings
from typing import List, Dict, Any
import logging
import os

# Disable ChromaDB telemetry to suppress warnings
os.environ["CHROMA_TELEMETRY_DISABLED"] = "1"

logger = logging.getLogger(__name__)


class VectorDBClient:
    """ChromaDB client wrapper"""
    
    def __init__(self):
        # Use PersistentClient for local file-based storage (new ChromaDB API)
        persist_directory = "./chroma_db"
        # Ensure directory exists
        os.makedirs(persist_directory, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name="durgasos_embeddings",
            metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(self, documents: List[str], ids: List[str] = None, metadatas: List[Dict] = None):
        """Add documents to the vector database"""
        if ids is None:
            ids = [f"doc_{i}" for i in range(len(documents))]
        if metadatas is None:
            metadatas = [{}] * len(documents)
        
        self.collection.add(
            documents=documents,
            ids=ids,
            metadatas=metadatas
        )
    
    def search(self, query_texts: List[str], n_results: int = 5) -> Dict[str, Any]:
        """Search for similar documents"""
        results = self.collection.query(
            query_texts=query_texts,
            n_results=n_results
        )
        return results
    
    def delete(self, ids: List[str]):
        """Delete documents by IDs"""
        self.collection.delete(ids=ids)


# Global instance
vector_db = VectorDBClient()


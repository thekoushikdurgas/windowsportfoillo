from pydantic_settings import BaseSettings
from pydantic import model_validator
from typing import List, Union, Any, Dict
import json


class Settings(BaseSettings):
    # Database connection - can use either DATABASE_URL or individual parameters
    DATABASE_URL: str = ""
    DATABASE_HOST: str = ""
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = ""
    DATABASE_USER: str = ""
    DATABASE_PASSWORD: str = ""
    
    VECTOR_DB_URL: str = "http://localhost:8000"
    VECTOR_DB_API_KEY: str = ""
    GEMINI_API_KEY: str
    SECRET_KEY: str
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    ENVIRONMENT: str = "development"
    
    @model_validator(mode='before')
    @classmethod
    def parse_cors_origins_before(cls, data: Any) -> Any:
        """Parse CORS_ORIGINS before pydantic tries to parse it as JSON."""
        if isinstance(data, dict):
            cors_value = data.get('CORS_ORIGINS')
            if cors_value is not None:
                # Convert to list if it's a string
                if isinstance(cors_value, str):
                    cors_str = cors_value.strip()
                    if not cors_str:
                        data['CORS_ORIGINS'] = ["http://localhost:3000"]
                    else:
                        # Try to parse as JSON first
                        try:
                            parsed = json.loads(cors_str)
                            if isinstance(parsed, list):
                                data['CORS_ORIGINS'] = [str(item) for item in parsed]
                            else:
                                # Single value, convert to list
                                data['CORS_ORIGINS'] = [cors_str]
                        except (json.JSONDecodeError, TypeError, ValueError):
                            # If not JSON, try comma-separated values
                            origins = [origin.strip() for origin in cors_str.split(',') if origin.strip()]
                            data['CORS_ORIGINS'] = origins if origins else ["http://localhost:3000"]
                elif isinstance(cors_value, list):
                    # Already a list, ensure all items are strings
                    data['CORS_ORIGINS'] = [str(item) for item in cors_value]
        return data
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()


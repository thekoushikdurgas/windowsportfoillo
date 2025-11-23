from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config.settings import settings
import urllib.parse

def get_database_url() -> str:
    """Construct database URL from settings.
    
    Priority:
    1. Use DATABASE_URL if provided (non-empty)
    2. Otherwise, construct from individual parameters
    """
    if settings.DATABASE_URL and settings.DATABASE_URL.strip():
        return settings.DATABASE_URL
    
    # Construct from individual parameters
    if not all([settings.DATABASE_HOST, settings.DATABASE_NAME, 
                settings.DATABASE_USER, settings.DATABASE_PASSWORD]):
        raise ValueError(
            "Either DATABASE_URL or all of (DATABASE_HOST, DATABASE_NAME, "
            "DATABASE_USER, DATABASE_PASSWORD) must be provided"
        )
    
    # URL encode password to handle special characters
    encoded_password = urllib.parse.quote_plus(settings.DATABASE_PASSWORD)
    
    return (
        f"postgresql://{settings.DATABASE_USER}:{encoded_password}"
        f"@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}"
        f"/{settings.DATABASE_NAME}"
    )

# Create engine with connection pooling optimized for Supabase
# Connection pool settings are optimized for Supabase's connection pooler
database_url = get_database_url()
engine = create_engine(
    database_url,
    pool_size=5,  # Connection pool size (Supabase recommended: 5-10 for pooler)
    max_overflow=10,  # Maximum overflow connections
    pool_pre_ping=True,  # Verify connections before using (important for Supabase pooler)
    pool_recycle=3600,  # Recycle connections after 1 hour
    echo=False  # Set to True for SQL query logging in development
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Get database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


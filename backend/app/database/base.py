from app.config.database import Base, engine

# Import all models here to ensure they're registered
# from app.modules.auth.models import User

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


"""Database configuration and session management"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Use SQLite by default if PostgreSQL URL not provided or if it fails
DATABASE_URL = os.getenv("DATABASE_URL", "")

# If DATABASE_URL is empty or doesn't start with postgresql, use SQLite
if not DATABASE_URL or not DATABASE_URL.startswith("postgresql"):
    # Use SQLite for easier setup
    DATABASE_URL = "sqlite:///./portfolio_optimizer.db"
    print("Using SQLite database (portfolio_optimizer.db)")
else:
    print("Using PostgreSQL database")

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
except Exception as e:
    print(f"Error connecting to database: {e}")
    print("Falling back to SQLite...")
    DATABASE_URL = "sqlite:///./portfolio_optimizer.db"
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


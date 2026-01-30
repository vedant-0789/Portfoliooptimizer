import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add current directory to path
sys.path.append(os.getcwd())

from app.database import Base, DATABASE_URL
from app.models import User
from passlib.context import CryptContext

# Setup DB
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def test_insert():
    db = SessionLocal()
    try:
        print("Testing DB connection...")
        # Hashing
        pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
        hashed = pwd_context.hash("password123")
        print(f"Hashed: {hashed}")

        # User
        user = User(
            email="test_script@example.com",
            username="testscript",
            hashed_password=hashed,
            full_name="Script User"
        )
        print("Adding user...")
        db.add(user)
        db.commit()
        print("Committed.")
        db.refresh(user)
        print(f"Success! User ID: {user.id}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_insert()

"""
ALGORHYTHM - AI-Powered Portfolio Optimizer
Main FastAPI Application
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from dotenv import load_dotenv
import os

from app.routers import (
    auth,
    portfolio,
    analysis,
    predictions,
    security,
    recommendations,
    news
)
from app.database import engine, Base
from app.redis_client import redis_client

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

security_scheme = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    print("Starting ALGORHYTHM Portfolio Optimizer...")
    await redis_client.connect()
    yield
    # Shutdown
    print("Shutting down...")
    await redis_client.disconnect()


app = FastAPI(
    title="ALGORHYTHM - AI-Powered Portfolio Optimizer",
    description="Advanced portfolio optimization platform with AI/ML capabilities",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_URL", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Debug Exception Handler
import traceback
from datetime import datetime
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = f"Global Exception: {str(exc)}\n{traceback.format_exc()}"
    print(error_msg)
    with open("error.log", "a") as f:
        f.write(f"\n[{datetime.now()}] {error_msg}\n")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(security.router, prefix="/api/security", tags=["Security"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(news.router, prefix="/api/news", tags=["News"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to ALGORHYTHM - AI-Powered Portfolio Optimizer",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ALGORHYTHM Portfolio Optimizer"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


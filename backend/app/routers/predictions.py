"""AI-powered predictions router"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.routers.auth import get_current_user
from app.schemas import PredictionRequest, PredictionResponse
from app.services.predictions import predict_stock_price

router = APIRouter()


@router.post("/stock", response_model=PredictionResponse)
async def predict_stock(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user)
):
    """Predict stock price using AI/ML models"""
    try:
        result = await predict_stock_price(request.symbol, request.days_ahead)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


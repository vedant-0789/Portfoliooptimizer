"""AI-powered recommendations router"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Portfolio
from app.routers.auth import get_current_user
from app.schemas import RecommendationResponse
from app.services.recommendations import generate_recommendations

router = APIRouter()


@router.get("/portfolio/{portfolio_id}", response_model=List[RecommendationResponse])
async def get_portfolio_recommendations(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-powered recommendations for portfolio"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    recommendations = await generate_recommendations(portfolio)
    return recommendations


@router.get("/stock/{symbol}", response_model=RecommendationResponse)
async def get_stock_recommendation(
    symbol: str,
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered recommendation for a specific stock"""
    from app.services.recommendations import get_stock_recommendation as get_rec
    
    recommendation = await get_rec(symbol)
    return recommendation


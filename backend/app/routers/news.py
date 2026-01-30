"""News aggregation and sentiment analysis router"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.models import User, Portfolio
from app.routers.auth import get_current_user
from app.services.news_aggregator import (
    get_stock_news_with_sentiment,
    get_market_sentiment,
    get_news_for_portfolio,
    fetch_general_market_news
)

router = APIRouter()


@router.get("/market")
async def get_market_news(
    current_user: User = Depends(get_current_user)
):
    """Get general market news with sentiment analysis"""
    try:
        market_sentiment = await get_market_sentiment()
        return market_sentiment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching market news: {str(e)}")


@router.get("/stock/{symbol}")
async def get_stock_news(
    symbol: str,
    current_user: User = Depends(get_current_user)
):
    """Get news for a specific stock with sentiment analysis"""
    try:
        news = await get_stock_news_with_sentiment(symbol.upper())
        return {
            "symbol": symbol.upper(),
            "news_count": len(news),
            "news": news
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock news: {str(e)}")


@router.get("/portfolio/{portfolio_id}")
async def get_portfolio_news(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get aggregated news for all stocks in a portfolio"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Get all symbols from holdings
    symbols = [holding.symbol for holding in portfolio.holdings]
    
    if not symbols:
        return {
            "portfolio_id": portfolio_id,
            "news": [],
            "average_sentiment": 0.0,
            "news_count": 0
        }
    
    try:
        portfolio_news_data = await get_news_for_portfolio(symbols)
        return {
            "portfolio_id": portfolio_id,
            "symbols": symbols,
            **portfolio_news_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching portfolio news: {str(e)}")


@router.get("/feed")
async def get_news_feed(
    limit: int = 20,
    current_user: User = Depends(get_current_user)
):
    """Get general financial news feed"""
    try:
        news = await fetch_general_market_news()
        return {
            "news": news[:limit],
            "total_count": len(news)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching news feed: {str(e)}")


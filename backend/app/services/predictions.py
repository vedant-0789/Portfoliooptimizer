"""AI-powered stock price prediction service with news sentiment analysis"""

import numpy as np
import pandas as pd
from app.services.market_data import get_stock_data
from app.services.news_aggregator import get_stock_news_with_sentiment, get_market_sentiment
from app.schemas import PredictionResponse


async def predict_stock_price(symbol: str, days_ahead: int = 7) -> PredictionResponse:
    """Predict stock price using historical data + news sentiment analysis"""
    # Get historical data
    data = await get_stock_data(symbol, period="1y")
    prices = np.array(data["prices"])
    
    if len(prices) < 30:
        raise ValueError("Insufficient historical data for prediction")
    
    # Get news sentiment for the stock
    stock_news = await get_stock_news_with_sentiment(symbol)
    
    # Get overall market sentiment
    market_sentiment = await get_market_sentiment()
    
    # Calculate stock-specific sentiment
    stock_sentiments = []
    if stock_news:
        for article in stock_news[:10]:  # Use top 10 most recent
            if "sentiment_analysis" in article:
                stock_sentiments.append(article["sentiment_analysis"]["polarity"])
    
    stock_sentiment_score = sum(stock_sentiments) / len(stock_sentiments) if stock_sentiments else 0.0
    market_sentiment_score = market_sentiment.get("sentiment_score", 0.0)
    
    # Combine stock and market sentiment (70% stock, 30% market)
    combined_sentiment = (0.7 * stock_sentiment_score) + (0.3 * market_sentiment_score)
    
    # Calculate moving averages
    short_ma = np.mean(prices[-10:])  # 10-day MA
    long_ma = np.mean(prices[-30:])   # 30-day MA
    
    # Calculate trend
    recent_prices = prices[-20:]
    trend = (recent_prices[-1] - recent_prices[0]) / recent_prices[0]
    
    # Adjust trend based on sentiment
    # Positive sentiment increases trend, negative decreases it
    sentiment_adjustment = combined_sentiment * 0.1  # Scale sentiment impact
    adjusted_trend = trend + sentiment_adjustment
    
    # Simple linear extrapolation with sentiment adjustment
    current_price = prices[-1]
    
    # Base prediction
    base_prediction = current_price * (1 + adjusted_trend * days_ahead / 20)
    
    # Apply sentiment multiplier (sentiment can affect price by up to 5%)
    sentiment_multiplier = 1 + (combined_sentiment * 0.05)
    predicted_price = base_prediction * sentiment_multiplier
    
    # Confidence based on volatility and news coverage
    volatility = np.std(prices[-30:]) / np.mean(prices[-30:])
    news_coverage_bonus = min(0.2, len(stock_news) / 50)  # More news = higher confidence
    base_confidence = max(0.5, 1.0 - volatility)
    confidence = min(0.95, base_confidence + news_coverage_bonus)
    
    # Generate predictions for each day with sentiment decay
    predictions = []
    for day in range(1, days_ahead + 1):
        # Sentiment impact decays over time
        sentiment_decay = 1 - (day / days_ahead) * 0.3  # 30% decay over prediction period
        day_sentiment_impact = combined_sentiment * 0.05 * sentiment_decay
        
        day_base = current_price * (1 + adjusted_trend * day / 20)
        day_prediction = day_base * (1 + day_sentiment_impact)
        
        predictions.append({
            "day": day,
            "price": float(day_prediction)
        })
    
    return PredictionResponse(
        symbol=symbol,
        current_price=float(current_price),
        predicted_price=float(predicted_price),
        confidence=float(confidence),
        predictions=predictions
    )


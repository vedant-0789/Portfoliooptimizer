"""AI-powered stock recommendations service with news sentiment"""

from typing import List
from app.models import Portfolio, Holding
from app.services.market_data import get_stock_data, get_stock_price
from app.services.news_aggregator import get_stock_news_with_sentiment, get_market_sentiment
from app.schemas import RecommendationResponse
import numpy as np


async def generate_recommendations(portfolio: Portfolio) -> List[RecommendationResponse]:
    """Generate AI-powered recommendations for portfolio holdings with news sentiment"""
    recommendations = []
    
    # Get market sentiment once
    market_sentiment = await get_market_sentiment()
    market_sentiment_score = market_sentiment.get("sentiment_score", 0.0)
    
    for holding in portfolio.holdings:
        try:
            # Get current and historical data
            current_price = await get_stock_price(holding.symbol)
            historical_data = await get_stock_data(holding.symbol, period="6mo")
            prices = np.array(historical_data["prices"])
            
            # Get news sentiment for this stock
            stock_news = await get_stock_news_with_sentiment(holding.symbol)
            stock_sentiment_score = 0.0
            if stock_news:
                sentiments = [
                    article.get("sentiment_analysis", {}).get("polarity", 0.0)
                    for article in stock_news[:5]  # Top 5 most recent
                    if "sentiment_analysis" in article
                ]
                if sentiments:
                    stock_sentiment_score = sum(sentiments) / len(sentiments)
            
            # Combine stock and market sentiment
            combined_sentiment = (0.7 * stock_sentiment_score) + (0.3 * market_sentiment_score)
            
            # Calculate metrics
            avg_price = np.mean(prices)
            current_return = (current_price - holding.average_price) / holding.average_price
            
            # Base recommendation logic
            base_recommendation = None
            base_confidence = 0.6
            reasoning_parts = []
            
            if current_price > avg_price * 1.1:
                base_recommendation = "SELL"
                base_confidence = 0.7
                reasoning_parts.append(f"Price {((current_price/avg_price - 1) * 100):.1f}% above 6-month average")
            elif current_price < avg_price * 0.9:
                base_recommendation = "BUY"
                base_confidence = 0.65
                reasoning_parts.append(f"Price {((1 - current_price/avg_price) * 100):.1f}% below 6-month average")
            else:
                base_recommendation = "HOLD"
                base_confidence = 0.6
                reasoning_parts.append("Price near 6-month average")
            
            # Adjust recommendation based on news sentiment
            if combined_sentiment > 0.2:  # Strong positive sentiment
                if base_recommendation == "SELL":
                    base_recommendation = "HOLD"  # Don't sell on positive news
                    base_confidence = 0.65
                elif base_recommendation == "HOLD":
                    base_recommendation = "BUY"
                    base_confidence = 0.75
                reasoning_parts.append("Strong positive news sentiment")
            elif combined_sentiment < -0.2:  # Strong negative sentiment
                if base_recommendation == "BUY":
                    base_recommendation = "HOLD"  # Don't buy on negative news
                    base_confidence = 0.65
                elif base_recommendation == "HOLD":
                    base_recommendation = "SELL"
                    base_confidence = 0.75
                reasoning_parts.append("Negative news sentiment detected")
            elif combined_sentiment > 0.1:
                reasoning_parts.append("Positive news sentiment")
            elif combined_sentiment < -0.1:
                reasoning_parts.append("Slightly negative news sentiment")
            
            # Add news count to reasoning
            if stock_news:
                reasoning_parts.append(f"{len(stock_news)} recent news articles analyzed")
            
            # Set target price and stop loss
            target_price = None
            stop_loss = None
            
            if base_recommendation == "BUY":
                target_price = avg_price if current_price < avg_price else current_price * 1.1
                stop_loss = current_price * 0.90
            elif base_recommendation == "SELL":
                stop_loss = current_price * 0.95
            
            # Adjust confidence based on news coverage
            if len(stock_news) > 5:
                base_confidence = min(0.95, base_confidence + 0.1)  # More news = higher confidence
            
            recommendations.append(RecommendationResponse(
                symbol=holding.symbol,
                recommendation=base_recommendation,
                confidence=base_confidence,
                reasoning=" | ".join(reasoning_parts),
                target_price=target_price,
                stop_loss=stop_loss
            ))
        except Exception as e:
            # If we can't analyze, provide neutral recommendation
            recommendations.append(RecommendationResponse(
                symbol=holding.symbol,
                recommendation="HOLD",
                confidence=0.5,
                reasoning=f"Unable to analyze: {str(e)}",
                target_price=None,
                stop_loss=None
            ))
    
    return recommendations


async def get_stock_recommendation(symbol: str) -> RecommendationResponse:
    """Get recommendation for a specific stock with news sentiment"""
    try:
        current_price = await get_stock_price(symbol)
        historical_data = await get_stock_data(symbol, period="6mo")
        prices = np.array(historical_data["prices"])
        
        # Get news sentiment
        stock_news = await get_stock_news_with_sentiment(symbol)
        stock_sentiment_score = 0.0
        if stock_news:
            sentiments = [
                article.get("sentiment_analysis", {}).get("polarity", 0.0)
                for article in stock_news[:5]
                if "sentiment_analysis" in article
            ]
            if sentiments:
                stock_sentiment_score = sum(sentiments) / len(sentiments)
        
        # Get market sentiment
        market_sentiment = await get_market_sentiment()
        market_sentiment_score = market_sentiment.get("sentiment_score", 0.0)
        combined_sentiment = (0.7 * stock_sentiment_score) + (0.3 * market_sentiment_score)
        
        avg_price = np.mean(prices)
        
        # Base recommendation
        if current_price > avg_price * 1.1:
            recommendation = "SELL"
            confidence = 0.7
            reasoning = "Price is significantly above average"
        elif current_price < avg_price * 0.9:
            recommendation = "BUY"
            confidence = 0.65
            reasoning = "Price is below average, potential upside"
        else:
            recommendation = "HOLD"
            confidence = 0.6
            reasoning = "Price is near average"
        
        # Adjust based on sentiment
        if combined_sentiment > 0.2:
            if recommendation == "SELL":
                recommendation = "HOLD"
            elif recommendation == "HOLD":
                recommendation = "BUY"
                confidence = 0.75
            reasoning += " | Strong positive news sentiment"
        elif combined_sentiment < -0.2:
            if recommendation == "BUY":
                recommendation = "HOLD"
            elif recommendation == "HOLD":
                recommendation = "SELL"
                confidence = 0.75
            reasoning += " | Negative news sentiment"
        
        if stock_news:
            reasoning += f" | {len(stock_news)} news articles analyzed"
        
        return RecommendationResponse(
            symbol=symbol,
            recommendation=recommendation,
            confidence=confidence,
            reasoning=reasoning,
            target_price=avg_price if recommendation == "BUY" else None,
            stop_loss=current_price * 0.95 if recommendation == "SELL" else None
        )
    except Exception as e:
        return RecommendationResponse(
            symbol=symbol,
            recommendation="HOLD",
            confidence=0.5,
            reasoning=f"Unable to analyze: {str(e)}",
            target_price=None,
            stop_loss=None
        )


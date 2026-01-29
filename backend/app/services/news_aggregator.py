"""News aggregation and sentiment analysis service"""

import httpx
import os
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from textblob import TextBlob
import nltk
from app.redis_client import redis_client
import json

# Download NLTK data (run once)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")


async def fetch_news_from_newsapi(query: str, limit: int = 20) -> List[Dict]:
    """Fetch news from NewsAPI"""
    if not NEWS_API_KEY:
        return []
    
    cache_key = f"news:{query}:{limit}"
    
    # Check cache (5 minutes)
    cached_news = await redis_client.get(cache_key)
    if cached_news:
        return json.loads(cached_news)
    
    try:
        async with httpx.AsyncClient() as client:
            # Get general market news
            response = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": query,
                    "apiKey": NEWS_API_KEY,
                    "sortBy": "publishedAt",
                    "language": "en",
                    "pageSize": limit,
                    "from": (datetime.now() - timedelta(days=1)).isoformat()
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                articles = data.get("articles", [])
                
                # Cache for 5 minutes
                await redis_client.set(cache_key, json.dumps(articles), ex=300)
                return articles
    except Exception as e:
        print(f"Error fetching news from NewsAPI: {e}")
    
    return []


async def fetch_news_from_alphavantage(symbol: str) -> List[Dict]:
    """Fetch company-specific news from Alpha Vantage"""
    if not ALPHA_VANTAGE_API_KEY:
        return []
    
    cache_key = f"news_av:{symbol}"
    
    # Check cache (10 minutes)
    cached_news = await redis_client.get(cache_key)
    if cached_news:
        return json.loads(cached_news)
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.alphavantage.co/query",
                params={
                    "function": "NEWS_SENTIMENT",
                    "tickers": symbol,
                    "apikey": ALPHA_VANTAGE_API_KEY,
                    "limit": 20
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                data = response.json()
                feed = data.get("feed", [])
                
                # Transform to consistent format
                articles = []
                for item in feed:
                    articles.append({
                        "title": item.get("title", ""),
                        "description": item.get("summary", ""),
                        "url": item.get("url", ""),
                        "publishedAt": item.get("time_published", ""),
                        "source": {"name": item.get("source", "Alpha Vantage")},
                        "sentiment": item.get("overall_sentiment_score", 0),
                        "relevance_score": item.get("relevance_score", 0)
                    })
                
                # Cache for 10 minutes
                await redis_client.set(cache_key, json.dumps(articles), ex=600)
                return articles
    except Exception as e:
        print(f"Error fetching news from Alpha Vantage: {e}")
    
    return []


async def fetch_general_market_news() -> List[Dict]:
    """Fetch general market and financial news"""
    queries = [
        "stock market",
        "financial markets",
        "economy",
        "Federal Reserve",
        "inflation",
        "interest rates"
    ]
    
    all_news = []
    for query in queries:
        news = await fetch_news_from_newsapi(query, limit=5)
        all_news.extend(news)
    
    # Remove duplicates based on title
    seen_titles = set()
    unique_news = []
    for article in all_news:
        title = article.get("title", "").lower()
        if title and title not in seen_titles:
            seen_titles.add(title)
            unique_news.append(article)
    
    # Sort by published date (newest first)
    unique_news.sort(
        key=lambda x: x.get("publishedAt", ""),
        reverse=True
    )
    
    return unique_news[:30]  # Return top 30


async def analyze_sentiment(text: str) -> Dict:
    """Analyze sentiment of text using TextBlob"""
    if not text:
        return {"polarity": 0.0, "subjectivity": 0.0, "sentiment": "neutral"}
    
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 to 1
    subjectivity = blob.sentiment.subjectivity  # 0 to 1
    
    # Classify sentiment
    if polarity > 0.1:
        sentiment = "positive"
    elif polarity < -0.1:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    return {
        "polarity": float(polarity),
        "subjectivity": float(subjectivity),
        "sentiment": sentiment
    }


async def get_stock_news_with_sentiment(symbol: str) -> List[Dict]:
    """Get news for a specific stock with sentiment analysis"""
    # Fetch from multiple sources
    newsapi_news = await fetch_news_from_newsapi(f"{symbol} stock", limit=10)
    alphavantage_news = await fetch_news_from_alphavantage(symbol)
    
    # Combine and deduplicate
    all_news = newsapi_news + alphavantage_news
    
    # Analyze sentiment for each article
    for article in all_news:
        title = article.get("title", "")
        description = article.get("description", "")
        text = f"{title} {description}"
        
        sentiment_analysis = await analyze_sentiment(text)
        article["sentiment_analysis"] = sentiment_analysis
        
        # If Alpha Vantage already has sentiment, use it
        if "sentiment" in article and article.get("sentiment"):
            article["sentiment_analysis"]["polarity"] = float(article["sentiment"])
    
    # Sort by relevance and recency
    all_news.sort(
        key=lambda x: (
            x.get("relevance_score", 0),
            x.get("publishedAt", "")
        ),
        reverse=True
    )
    
    return all_news[:20]  # Return top 20


async def get_market_sentiment() -> Dict:
    """Get overall market sentiment from news"""
    market_news = await fetch_general_market_news()
    
    if not market_news:
        return {
            "overall_sentiment": "neutral",
            "sentiment_score": 0.0,
            "news_count": 0,
            "positive_count": 0,
            "negative_count": 0,
            "neutral_count": 0
        }
    
    sentiments = []
    positive_count = 0
    negative_count = 0
    neutral_count = 0
    
    for article in market_news:
        title = article.get("title", "")
        description = article.get("description", "")
        text = f"{title} {description}"
        
        sentiment_analysis = await analyze_sentiment(text)
        polarity = sentiment_analysis["polarity"]
        sentiments.append(polarity)
        
        if polarity > 0.1:
            positive_count += 1
        elif polarity < -0.1:
            negative_count += 1
        else:
            neutral_count += 1
    
    avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0.0
    
    if avg_sentiment > 0.1:
        overall_sentiment = "positive"
    elif avg_sentiment < -0.1:
        overall_sentiment = "negative"
    else:
        overall_sentiment = "neutral"
    
    return {
        "overall_sentiment": overall_sentiment,
        "sentiment_score": float(avg_sentiment),
        "news_count": len(market_news),
        "positive_count": positive_count,
        "negative_count": negative_count,
        "neutral_count": neutral_count,
        "recent_news": market_news[:5]  # Top 5 recent news
    }


async def get_news_for_portfolio(symbols: List[str]) -> Dict:
    """Get aggregated news for multiple stocks in a portfolio"""
    portfolio_news = []
    
    for symbol in symbols:
        news = await get_stock_news_with_sentiment(symbol)
        portfolio_news.extend(news)
    
    # Sort by date
    portfolio_news.sort(
        key=lambda x: x.get("publishedAt", ""),
        reverse=True
    )
    
    # Calculate portfolio sentiment
    sentiments = []
    for article in portfolio_news:
        if "sentiment_analysis" in article:
            sentiments.append(article["sentiment_analysis"]["polarity"])
    
    avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0.0
    
    return {
        "news": portfolio_news[:30],  # Top 30
        "average_sentiment": float(avg_sentiment),
        "news_count": len(portfolio_news)
    }


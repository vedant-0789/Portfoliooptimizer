"""Market data service"""

import yfinance as yf
from app.redis_client import redis_client
import json


async def get_stock_price(symbol: str) -> float:
    """Get current stock price with caching"""
    cache_key = f"stock_price:{symbol}"
    
    # Check cache
    cached_price = await redis_client.get(cache_key)
    if cached_price:
        return float(cached_price)
    
    # Fetch from API
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d")
        if not data.empty:
            price = float(data['Close'].iloc[-1])
            # Cache for 5 minutes
            await redis_client.set(cache_key, str(price), ex=300)
            return price
        else:
            raise ValueError(f"No data available for {symbol}")
    except Exception as e:
        raise ValueError(f"Error fetching price for {symbol}: {str(e)}")


async def get_stock_data(symbol: str, period: str = "1y") -> dict:
    """Get historical stock data"""
    cache_key = f"stock_data:{symbol}:{period}"
    
    # Check cache
    cached_data = await redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    # Fetch from API
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period=period)
        if not data.empty:
            result = {
                "dates": data.index.strftime("%Y-%m-%d").tolist(),
                "prices": data['Close'].tolist(),
                "volume": data['Volume'].tolist()
            }
            # Cache for 1 hour
            await redis_client.set(cache_key, json.dumps(result), ex=3600)
            return result
        else:
            raise ValueError(f"No data available for {symbol}")
    except Exception as e:
        raise ValueError(f"Error fetching data for {symbol}: {str(e)}")


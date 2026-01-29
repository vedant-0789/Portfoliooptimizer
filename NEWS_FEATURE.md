# News Aggregation & Sentiment Analysis Feature

## Overview

ALGORHYTHM now includes a comprehensive news aggregation system that fetches live news from multiple sources across the internet and uses sentiment analysis to enhance predictions and recommendations.

## Features

### 1. **Multi-Source News Aggregation**
- **NewsAPI**: General financial and market news
- **Alpha Vantage**: Company-specific news with built-in sentiment scores
- **Real-time Updates**: News refreshed every 5 minutes
- **Caching**: Redis caching for efficient API usage

### 2. **Sentiment Analysis**
- **TextBlob NLP**: Analyzes sentiment of news articles
- **Polarity Scoring**: -1 (very negative) to +1 (very positive)
- **Sentiment Classification**: Positive, Negative, or Neutral
- **Multi-Article Aggregation**: Combines sentiment from multiple sources

### 3. **Integration with Predictions**
- **Price Prediction Enhancement**: News sentiment adjusts price predictions
- **Sentiment Decay**: Sentiment impact decreases over prediction horizon
- **Confidence Boost**: More news coverage increases prediction confidence
- **Market vs Stock Sentiment**: 70% stock-specific, 30% market-wide

### 4. **Integration with Recommendations**
- **BUY/SELL/HOLD Adjustments**: News sentiment can override base recommendations
- **Confidence Scoring**: Higher confidence with more news coverage
- **Reasoning Enhancement**: Recommendations include news sentiment in reasoning

### 5. **News Feed UI**
- **Market Sentiment Dashboard**: Overall market sentiment visualization
- **Stock-Specific News**: News for individual holdings
- **Portfolio News**: Aggregated news for all portfolio holdings
- **Real-time Updates**: Auto-refresh every 5 minutes
- **Sentiment Indicators**: Visual indicators for positive/negative/neutral news

## API Endpoints

### Get Market News & Sentiment
```
GET /api/news/market
```
Returns overall market sentiment with recent news articles.

### Get Stock News
```
GET /api/news/stock/{symbol}
```
Returns news articles for a specific stock with sentiment analysis.

### Get Portfolio News
```
GET /api/news/portfolio/{portfolio_id}
```
Returns aggregated news for all stocks in a portfolio.

### Get News Feed
```
GET /api/news/feed?limit=20
```
Returns general financial news feed.

## How It Works

### 1. News Collection
```python
# Fetches from multiple sources
- NewsAPI: General market news
- Alpha Vantage: Company-specific news
- Aggregates and deduplicates
```

### 2. Sentiment Analysis
```python
# For each article:
1. Extract title and description
2. Analyze with TextBlob
3. Calculate polarity (-1 to +1)
4. Classify as positive/negative/neutral
```

### 3. Prediction Enhancement
```python
# In price predictions:
1. Get stock-specific sentiment
2. Get market-wide sentiment
3. Combine (70% stock, 30% market)
4. Adjust trend based on sentiment
5. Apply sentiment multiplier to predictions
```

### 4. Recommendation Enhancement
```python
# In recommendations:
1. Calculate base recommendation (price-based)
2. Get news sentiment
3. Adjust recommendation if sentiment is strong
4. Increase confidence with more news
5. Add sentiment to reasoning
```

## Configuration

### Required API Keys

1. **NewsAPI** (Free tier available)
   - Sign up at: https://newsapi.org/register
   - Get API key from dashboard
   - Add to `.env`: `NEWS_API_KEY=your-key`

2. **Alpha Vantage** (Free tier available)
   - Sign up at: https://www.alphavantage.co/support/#api-key
   - Get API key
   - Add to `.env`: `ALPHA_VANTAGE_API_KEY=your-key`

### Optional: Without API Keys

The system will still work but with limited news sources. You can:
- Use web scraping (requires additional setup)
- Use RSS feeds (requires feedparser configuration)
- Use mock data for development

## Usage Examples

### Frontend: Display Market News
```tsx
import NewsFeed from '@/components/dashboard/NewsFeed'

<NewsFeed />
```

### Frontend: Display Stock News
```tsx
import StockNews from '@/components/dashboard/StockNews'

<StockNews symbol="AAPL" />
```

### Backend: Get News in Service
```python
from app.services.news_aggregator import get_stock_news_with_sentiment

news = await get_stock_news_with_sentiment("AAPL")
```

## Sentiment Impact on Predictions

### Price Predictions
- **Positive Sentiment (>0.2)**: Increases predicted price by up to 5%
- **Negative Sentiment (<-0.2)**: Decreases predicted price by up to 5%
- **Neutral Sentiment**: No adjustment
- **Decay**: Sentiment impact decreases over prediction horizon

### Recommendations
- **Strong Positive News**: Can change SELL → HOLD or HOLD → BUY
- **Strong Negative News**: Can change BUY → HOLD or HOLD → SELL
- **Confidence Boost**: +10% confidence with >5 news articles

## Performance

- **Caching**: News cached for 5-10 minutes (depending on source)
- **Rate Limiting**: Respects API rate limits
- **Error Handling**: Graceful fallback if APIs are unavailable
- **Async Operations**: Non-blocking news fetching

## Future Enhancements

1. **More News Sources**
   - RSS feeds from financial websites
   - Web scraping (with proper rate limiting)
   - Social media sentiment (Twitter, Reddit)

2. **Advanced NLP**
   - Transformer models (BERT, RoBERTa)
   - Entity recognition
   - Topic modeling

3. **Real-time Updates**
   - WebSocket connections
   - Push notifications
   - Live sentiment streaming

4. **News Impact Analysis**
   - Historical correlation between news and price movements
   - News importance scoring
   - Event detection

## Troubleshooting

### No News Appearing
1. Check API keys in `.env`
2. Verify API quotas haven't been exceeded
3. Check network connectivity
4. Review backend logs for errors

### Sentiment Not Updating
1. Clear Redis cache
2. Check NLTK data is downloaded
3. Verify TextBlob is working

### Slow News Loading
1. Check Redis is running
2. Verify API response times
3. Consider increasing cache duration

---

**This feature significantly enhances the AI capabilities of ALGORHYTHM by incorporating real-world news and sentiment into predictions and recommendations!**


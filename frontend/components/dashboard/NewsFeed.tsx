'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: { name: string }
  sentiment_analysis?: {
    polarity: number
    sentiment: string
  }
}

interface MarketSentiment {
  overall_sentiment: string
  sentiment_score: number
  news_count: number
  positive_count: number
  negative_count: number
  neutral_count: number
  recent_news: NewsArticle[]
}

export default function NewsFeed() {
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMarketNews = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/market`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMarketSentiment(data)
      }
    } catch (error) {
      console.error('Error fetching market news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMarketNews()
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchMarketNews()
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-success-600" />
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-danger-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success-50 border-success-200 text-success-900'
      case 'negative':
        return 'bg-danger-50 border-danger-200 text-danger-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (!marketSentiment) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Unable to load news. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Market News & Sentiment</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Market Sentiment Overview */}
      <div className={`mb-6 p-4 rounded-lg border ${getSentimentColor(marketSentiment.overall_sentiment)}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getSentimentIcon(marketSentiment.overall_sentiment)}
            <span className="font-semibold text-lg capitalize">
              {marketSentiment.overall_sentiment} Market Sentiment
            </span>
          </div>
          <span className="text-sm font-medium">
            Score: {(marketSentiment.sentiment_score * 100).toFixed(1)}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
          <div>
            <span className="text-success-600 font-semibold">{marketSentiment.positive_count}</span>
            <span className="text-gray-600 ml-1">Positive</span>
          </div>
          <div>
            <span className="text-danger-600 font-semibold">{marketSentiment.negative_count}</span>
            <span className="text-gray-600 ml-1">Negative</span>
          </div>
          <div>
            <span className="text-gray-600 font-semibold">{marketSentiment.neutral_count}</span>
            <span className="text-gray-600 ml-1">Neutral</span>
          </div>
        </div>
        <p className="text-xs mt-2 opacity-75">
          Based on {marketSentiment.news_count} recent news articles
        </p>
      </div>

      {/* News Articles */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {marketSentiment.recent_news && marketSentiment.recent_news.length > 0 ? (
          marketSentiment.recent_news.map((article, index) => (
            <div
              key={index}
              className="border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm flex-1 pr-2">
                  {article.title}
                </h4>
                {article.sentiment_analysis && (
                  <div className="flex items-center space-x-1">
                    {getSentimentIcon(article.sentiment_analysis.sentiment)}
                    <span className="text-xs text-gray-500">
                      {(article.sentiment_analysis.polarity * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
              
              {article.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {article.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>{article.source?.name || 'Unknown'}</span>
                  <span>•</span>
                  <span>
                    {article.publishedAt
                      ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                      : 'Recently'}
                  </span>
                </div>
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                  >
                    <span>Read more</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-sm">No recent news available</p>
        )}
      </div>
    </div>
  )
}


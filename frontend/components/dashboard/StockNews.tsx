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

interface StockNewsProps {
  symbol: string
}

export default function StockNews({ symbol }: StockNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news/stock/${symbol}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setNews(data.news || [])
      }
    } catch (error) {
      console.error('Error fetching stock news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (symbol) {
      fetchNews()
    }
  }, [symbol])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchNews()
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm">{symbol} News</h4>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {news.length > 0 ? (
          news.slice(0, 5).map((article, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-1">
                <h5 className="font-medium text-xs text-gray-900 flex-1 pr-2 line-clamp-2">
                  {article.title}
                </h5>
                {article.sentiment_analysis && (
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {getSentimentIcon(article.sentiment_analysis.sentiment)}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {article.publishedAt
                    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                    : 'Recently'}
                </span>
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <span>Read</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-xs">No recent news for {symbol}</p>
        )}
      </div>
    </div>
  )
}


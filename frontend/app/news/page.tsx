'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, RefreshCw, ExternalLink, TrendingDown, Minus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import NewsFeed from '@/components/dashboard/NewsFeed'

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

export default function NewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchNews()
  }, [router])

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/feed?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNews(data.news || [])
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchNews()
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-success-600" />
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-danger-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-success-200 bg-success-50'
      case 'negative':
        return 'border-danger-200 bg-danger-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">ALGORHYTHM</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/portfolio" className="text-gray-600 hover:text-gray-900">Portfolio</Link>
              <Link href="/news" className="text-primary-600 font-semibold">News</Link>
              <Link href="/analysis" className="text-gray-600 hover:text-gray-900">Analysis</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial News</h2>
              <p className="text-gray-600">Stay updated with the latest market news and sentiment</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Market Sentiment Overview */}
        <div className="mb-8">
          <NewsFeed />
        </div>

        {/* News Articles Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest News</h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-6 border-2 hover:shadow-lg transition-shadow ${
                    article.sentiment_analysis
                      ? getSentimentColor(article.sentiment_analysis.sentiment)
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex-1 pr-2">
                      {article.title}
                    </h4>
                    {article.sentiment_analysis && (
                      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                        {getSentimentIcon(article.sentiment_analysis.sentiment)}
                        <span className="text-xs text-gray-500">
                          {(article.sentiment_analysis.polarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {article.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-2">
                      <span>{article.source?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>
                        {article.publishedAt
                          ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                          : 'Recently'}
                      </span>
                    </div>
                  </div>
                  
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <span>Read full article</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">No news available at the moment. Please try again later.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


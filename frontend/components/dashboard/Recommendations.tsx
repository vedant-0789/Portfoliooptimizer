'use client'

import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react'

export default function Recommendations() {
  const recommendations = [
    { symbol: 'AAPL', action: 'HOLD', confidence: 0.85, reasoning: 'Strong fundamentals, maintain position' },
    { symbol: 'GOOGL', action: 'BUY', confidence: 0.78, reasoning: 'Undervalued, good entry point' },
    { symbol: 'TSLA', action: 'SELL', confidence: 0.72, reasoning: 'High volatility, consider reducing exposure' },
    { symbol: 'MSFT', action: 'BUY', confidence: 0.82, reasoning: 'AI growth potential, increase allocation' },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BUY':
        return <TrendingUp className="h-5 w-5 text-success-600" />
      case 'SELL':
        return <TrendingDown className="h-5 w-5 text-danger-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'bg-success-50 border-success-200 text-success-900'
      case 'SELL':
        return 'bg-danger-50 border-danger-200 text-danger-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-primary-600" />
          AI Recommendations
        </h3>
        <span className="text-xs text-gray-500">Updated 5 min ago</span>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.symbol} className={`border rounded-lg p-4 ${getActionColor(rec.action)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getActionIcon(rec.action)}
                <span className="font-bold text-lg">{rec.symbol}</span>
                <span className="px-2 py-1 bg-white rounded text-xs font-semibold">
                  {rec.action}
                </span>
              </div>
              <span className="text-xs font-semibold">
                {(rec.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-sm mt-2 opacity-90">{rec.reasoning}</p>
            <div className="mt-3 flex items-center justify-between">
              <button className="text-xs font-semibold hover:underline">
                View Details
              </button>
              <div className="w-24 bg-white rounded-full h-1.5">
                <div
                  className="bg-current h-1.5 rounded-full"
                  style={{ width: `${rec.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50">
        View All Recommendations
      </button>
    </div>
  )
}


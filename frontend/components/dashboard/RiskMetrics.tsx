'use client'

import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

export default function RiskMetrics() {
  const metrics = [
    { name: 'Sharpe Ratio', value: 1.85, target: 1.5, status: 'good' },
    { name: 'Sortino Ratio', value: 2.12, target: 1.8, status: 'good' },
    { name: 'Beta', value: 0.95, target: 1.0, status: 'good' },
    { name: 'Alpha', value: 0.08, target: 0.05, status: 'good' },
    { name: 'VaR (95%)', value: -2.3, target: -5.0, status: 'good' },
    { name: 'Max Drawdown', value: -8.5, target: -15.0, status: 'good' },
    { name: 'Volatility', value: 12.5, target: 15.0, status: 'good' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              <div className="flex items-center space-x-2">
                {metric.status === 'good' ? (
                  <TrendingUp className="h-4 w-4 text-success-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger-600" />
                )}
                <span className={`text-sm font-semibold ${
                  metric.status === 'good' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {metric.value > 0 ? '+' : ''}{metric.value.toFixed(2)}
                  {metric.name.includes('Ratio') || metric.name === 'Alpha' ? '' : '%'}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metric.status === 'good' ? 'bg-success-500' : 'bg-danger-500'
                }`}
                style={{
                  width: `${Math.min(100, (Math.abs(metric.value) / Math.abs(metric.target)) * 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {metric.target}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-success-600 mr-2" />
          <div>
            <p className="text-sm font-semibold text-success-900">Portfolio Risk: Low</p>
            <p className="text-xs text-success-700">Your portfolio is well-diversified with low risk metrics</p>
          </div>
        </div>
      </div>
    </div>
  )
}


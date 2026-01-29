'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function PortfolioOverview() {
  const [holdings, setHoldings] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', value: 25000, weight: 0.25 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 20000, weight: 0.20 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', value: 18000, weight: 0.18 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 15000, weight: 0.15 },
    { symbol: 'TSLA', name: 'Tesla Inc.', value: 12000, weight: 0.12 },
    { symbol: 'META', name: 'Meta Platforms', value: 10000, weight: 0.10 },
  ])

  const chartData = holdings.map(h => ({
    name: h.symbol,
    value: h.value
  }))

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Overview</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings List */}
        <div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Portfolio Value</p>
          </div>
          
          <div className="space-y-3">
            {holdings.map((holding, index) => (
              <div key={holding.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{holding.symbol}</p>
                    <p className="text-sm text-gray-600">{holding.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${holding.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{(holding.weight * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


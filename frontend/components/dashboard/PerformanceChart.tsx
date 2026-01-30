'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { date: 'Jan', value: 100000, benchmark: 100000 },
  { date: 'Feb', value: 105000, benchmark: 102000 },
  { date: 'Mar', value: 108000, benchmark: 104000 },
  { date: 'Apr', value: 112000, benchmark: 106000 },
  { date: 'May', value: 115000, benchmark: 108000 },
  { date: 'Jun', value: 120000, benchmark: 110000 },
  { date: 'Jul', value: 125000, benchmark: 112000 },
  { date: 'Aug', value: 123000, benchmark: 114000 },
  { date: 'Sep', value: 128000, benchmark: 116000 },
  { date: 'Oct', value: 130000, benchmark: 118000 },
  { date: 'Nov', value: 132000, benchmark: 120000 },
  { date: 'Dec', value: 125430, benchmark: 122000 },
]

export default function PerformanceChart() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#0ea5e9" 
            strokeWidth={2}
            name="Portfolio"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#94a3b8" 
            strokeWidth={2}
            name="Benchmark"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Total Return</p>
          <p className="text-lg font-bold text-success-600">+25.4%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">vs Benchmark</p>
          <p className="text-lg font-bold text-primary-600">+3.4%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Annualized</p>
          <p className="text-lg font-bold text-gray-900">+28.2%</p>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  TrendingUp, Portfolio, BarChart3, Shield, 
  Brain, AlertCircle, DollarSign, Activity 
} from 'lucide-react'
import PortfolioOverview from '@/components/dashboard/PortfolioOverview'
import RiskMetrics from '@/components/dashboard/RiskMetrics'
import Recommendations from '@/components/dashboard/Recommendations'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import NewsFeed from '@/components/dashboard/NewsFeed'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    // Fetch user data
    // setUser(userData)
  }, [router])

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
              <Link href="/dashboard" className="text-primary-600 font-semibold">Dashboard</Link>
              <Link href="/portfolio" className="text-gray-600 hover:text-gray-900">Portfolio</Link>
              <Link href="/news" className="text-gray-600 hover:text-gray-900">News</Link>
              <Link href="/analysis" className="text-gray-600 hover:text-gray-900">Analysis</Link>
              <Link href="/security" className="text-gray-600 hover:text-gray-900">Security</Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/login')
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Here's your portfolio overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Total Value"
            value="$125,430"
            change="+5.2%"
            positive
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Today's Gain"
            value="$2,340"
            change="+1.9%"
            positive
          />
          <StatCard
            icon={<Portfolio className="h-6 w-6" />}
            title="Holdings"
            value="12"
            change="3 new"
          />
          <StatCard
            icon={<Shield className="h-6 w-6" />}
            title="Risk Score"
            value="Low"
            change="Safe"
            positive
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <PortfolioOverview />
          </div>

          {/* Recommendations */}
          <div>
            <Recommendations />
          </div>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart />
          <RiskMetrics />
        </div>

        {/* News Feed */}
        <div className="mb-8">
          <NewsFeed />
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary-600" />
              Security Alerts
            </h3>
            <Link href="/security" className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <AlertItem
              type="info"
              message="All transactions verified. No suspicious activity detected."
            />
            <AlertItem
              type="success"
              message="Portfolio security score: 95/100"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, title, value, change, positive }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400">{icon}</div>
        <span className={`text-sm font-semibold ${positive ? 'text-success-600' : 'text-gray-600'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

function AlertItem({ type, message }: { type: string, message: string }) {
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-danger-50 border-danger-200 text-danger-800'
  }

  return (
    <div className={`border rounded-lg p-3 ${colors[type as keyof typeof colors]}`}>
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}


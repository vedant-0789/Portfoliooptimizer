'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Shield, Brain, BarChart3, Zap, Lock } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">ALGORHYTHM</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Login
              </Link>
              <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Portfolio Optimization
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Optimize your investments with cutting-edge AI and machine learning. 
            Get personalized recommendations, risk analysis, and predictive insights.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700">
              Get Started Free
            </Link>
            <Link href="/demo" className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Unique Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI-Powered Optimization"
            description="Machine learning algorithms optimize your portfolio for maximum risk-adjusted returns"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Predictive Analytics"
            description="Advanced forecasting models predict market trends and stock prices"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Fraud Detection"
            description="Real-time security monitoring and anomaly detection for your transactions"
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Advanced Analytics"
            description="Comprehensive risk metrics, performance analysis, and tax optimization"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Smart Recommendations"
            description="AI-driven buy/sell/hold recommendations with confidence scores"
          />
          <FeatureCard
            icon={<Lock className="h-8 w-8" />}
            title="Bank-Grade Security"
            description="End-to-end encryption, 2FA, and blockchain verification"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Optimize Your Portfolio?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors using AI to make smarter investment decisions
          </p>
          <Link href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 inline-block">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 ALGORHYTHM. Built for CodeAThon Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}


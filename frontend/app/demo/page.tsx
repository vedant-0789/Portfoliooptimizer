'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Play, CheckCircle } from 'lucide-react'

export default function Demo() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLaunchDemo = async () => {
        setLoading(true)
        setError('')

        try {
            // Use mock credentials
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: 'mock@example.com',
                    password: 'password123'
                }),
            })

            if (response.ok) {
                const data = await response.json()
                localStorage.setItem('token', data.access_token)
                router.push('/dashboard')
            } else {
                setError('Failed to launch demo. The server might be offline.')
            }
        } catch (err) {
            setError('Network error. Is the backend server running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 md:p-12 text-center">
                        <div className="flex items-center justify-center mb-6">
                            <TrendingUp className="h-12 w-12 text-primary-600" />
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Experience ALGORHYTHM
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Explore our AI-powered portfolio optimizer with a pre-configured demo account. No registration required.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-10">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                                <span className="text-gray-700">Real-time Data Simulation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                                <span className="text-gray-700">AI Risk Analysis</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                                <span className="text-gray-700">News Sentiment Engine</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-success-500 flex-shrink-0" />
                                <span className="text-gray-700">Portfolio Recommendations</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-800 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleLaunchDemo}
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Preparing Demo Environment...
                                </>
                            ) : (
                                <>
                                    <Play className="h-5 w-5 mr-2 fill-current" />
                                    Launch Live Demo
                                </>
                            )}
                        </button>

                        <p className="mt-6 text-sm text-gray-500">
                            <Link href="/" className="hover:text-primary-600 transition-colors">
                                &larr; Back to Home
                            </Link>
                        </p>
                    </div>
                    <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                        <p className="text-gray-500 text-sm">
                            Note: This demo runs on a secure sandbox environment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

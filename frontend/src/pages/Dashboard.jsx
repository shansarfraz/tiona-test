import { useEffect, useState } from 'react'
import { getDashboard, getPortfolio } from '../services/api'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [dashboardResponse, portfolioResponse] = await Promise.all([
          getDashboard(),
          getPortfolio()
        ])
        setDashboardData(dashboardResponse.data.data)
        setPortfolioData(portfolioResponse.data.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // Real-time updates: Poll every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow h-64"></div>
        <div className="bg-white p-6 rounded-lg shadow h-64"></div>
      </div>
    </div>
  )

  // Error Component
  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
      <p className="text-red-700">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  )

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorDisplay message={error} />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Updates</span>
        </div>
      </div>

      {/* Portfolio Summary Card */}
      {portfolioData && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg mb-6 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>💼</span> Portfolio Summary
          </h2>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-blue-100 text-sm">Total Portfolio Value</p>
              <p className="text-4xl font-bold">${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className={`ml-auto text-right px-4 py-2 rounded-lg ${portfolioData.totalChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="text-2xl font-bold">
                {portfolioData.totalChange >= 0 ? '↗' : '↘'} {portfolioData.totalChange >= 0 ? '+' : ''}${Math.abs(portfolioData.totalChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-lg">
                {portfolioData.totalChangePercent >= 0 ? '+' : ''}{portfolioData.totalChangePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Gainers & Losers Section */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Top Gainers */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📈</span> Top Gainers
            </h2>
            <div className="space-y-3">
              {dashboardData.topGainers.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{asset.symbol}</p>
                    <p className="text-sm text-gray-600">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-green-600 text-sm font-medium">+{asset.changePercent.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📉</span> Top Losers
            </h2>
            <div className="space-y-3">
              {dashboardData.topLosers.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{asset.symbol}</p>
                    <p className="text-sm text-gray-600">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-red-600 text-sm font-medium">{asset.changePercent.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent News Feed and Active Alerts */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent News Feed */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📰</span> Recent News
            </h2>
            <div className="space-y-4">
              {dashboardData.recentNews.map((news, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 hover:bg-gray-50 p-2 rounded transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-sm flex-1 text-gray-900">{news.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2 whitespace-nowrap">
                      {news.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{news.source}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(news.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts Summary */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🔔</span> Active Alerts
            </h2>
            <div className="space-y-3">
              {dashboardData.activeAlerts.slice(0, 5).map((alert, index) => {
                const severityConfig = {
                  critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400', icon: '🚨' },
                  high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', icon: '⚠️' },
                  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400', icon: '⚡' },
                  low: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400', icon: 'ℹ️' }
                }
                const config = severityConfig[alert.severity] || severityConfig.low

                return (
                  <div key={index} className={`border-l-4 ${config.border} pl-3 py-2 hover:bg-gray-50 rounded transition-colors`}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm flex-1 text-gray-900">{config.icon} {alert.message}</p>
                      <span className={`text-xs px-2 py-1 rounded ml-2 whitespace-nowrap ${config.bg} ${config.text}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

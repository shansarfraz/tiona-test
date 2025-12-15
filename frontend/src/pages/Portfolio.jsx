import { useEffect, useState } from 'react'
import { getPortfolio } from '../services/api'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setError(null)
        const response = await getPortfolio()
        setPortfolio(response.data.data)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setError('Failed to load portfolio. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()

    // Real-time updates
    const interval = setInterval(fetchPortfolio, 30000)
    return () => clearInterval(interval)
  }, [])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow h-96"></div>
    </div>
  )

  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Portfolio</h3>
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
  if (!portfolio) return null

  // Prepare chart data
  const assetAllocationData = portfolio.assets.map((asset) => ({
    name: asset.assetId,
    value: asset.value,
    percentage: ((asset.value / portfolio.totalValue) * 100).toFixed(2)
  }))

  const performanceData = portfolio.assets.map((asset) => ({
    name: asset.assetId,
    value: asset.value,
    change: asset.change,
    changePercent: asset.changePercent
  }))

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">💼 Portfolio</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <p className="text-blue-100 text-sm mb-1">Total Portfolio Value</p>
          <p className="text-3xl font-bold">${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className={`bg-gradient-to-br ${portfolio.totalChange >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} p-6 rounded-lg shadow-lg text-white`}>
          <p className="text-white/90 text-sm mb-1">Total Change</p>
          <p className="text-3xl font-bold">
            {portfolio.totalChange >= 0 ? '+' : ''}${portfolio.totalChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-lg mt-1">
            {portfolio.totalChange >= 0 ? '+' : ''}{portfolio.totalChangePercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <p className="text-purple-100 text-sm mb-1">Total Assets</p>
          <p className="text-3xl font-bold">{portfolio.assets.length}</p>
          <p className="text-sm mt-1 text-purple-100">Diversified Portfolio</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Asset Allocation Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Asset Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Current Value" />
              <Bar dataKey="change" fill="#10B981" name="Change" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Details Table - Desktop */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hidden md:block">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Buy Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gain/Loss %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.assets.map((asset, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-semibold text-gray-900">{asset.assetId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                    {asset.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700">
                    ${asset.avgBuyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                    ${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                    asset.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.change >= 0 ? '+' : ''}${asset.change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                    asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr className="font-bold">
                <td className="px-6 py-4" colSpan="4">Total</td>
                <td className="px-6 py-4 text-right text-gray-900">
                  ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-6 py-4 text-right ${
                  portfolio.totalChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolio.totalChange >= 0 ? '+' : ''}${portfolio.totalChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-6 py-4 text-right ${
                  portfolio.totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolio.totalChangePercent >= 0 ? '+' : ''}{portfolio.totalChangePercent.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Asset Details Cards - Mobile */}
      <div className="md:hidden space-y-3">
        <h2 className="text-xl font-bold mb-4">Holdings</h2>
        {portfolio.assets.map((asset, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="font-bold text-lg text-gray-900">{asset.assetId}</span>
              </div>
              <span className={`text-lg font-bold ${
                asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600">Quantity</p>
                <p className="font-semibold text-gray-900">{asset.quantity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Current Price</p>
                <p className="font-semibold text-gray-900">${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Avg Buy Price</p>
                <p className="font-semibold text-gray-900">${asset.avgBuyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Value</p>
                <p className="font-semibold text-gray-900">${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Change</span>
                <span className={`font-semibold ${
                  asset.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {asset.change >= 0 ? '+' : ''}${asset.change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Total Summary */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg p-4 text-white">
          <p className="text-sm text-gray-300 mb-2">Portfolio Total</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              <p className={`text-sm font-semibold mt-1 ${
                portfolio.totalChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolio.totalChange >= 0 ? '+' : ''}${portfolio.totalChange.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <p className={`text-xl font-bold ${
              portfolio.totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolio.totalChangePercent >= 0 ? '+' : ''}{portfolio.totalChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Watchlist */}
      {portfolio.watchlist && portfolio.watchlist.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Watchlist</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.watchlist.map((symbol, index) => (
              <span key={index} className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium">
                {symbol}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio

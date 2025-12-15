import { useEffect, useState } from 'react'
import { getStocks, getCrypto } from '../services/api'

const Assets = () => {
  const [stocks, setStocks] = useState([])
  const [crypto, setCrypto] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [selectedAsset, setSelectedAsset] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [stocksResponse, cryptoResponse] = await Promise.all([
          getStocks(),
          getCrypto()
        ])
        setStocks(stocksResponse.data.data)
        setCrypto(cryptoResponse.data.data)
      } catch (error) {
        console.error('Error fetching assets:', error)
        setError('Failed to load assets. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // Real-time updates: Poll every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getFilteredAssets = () => {
    const stocksWithType = stocks.map(stock => ({ ...stock, type: 'stock' }))
    const cryptoWithType = crypto.map(c => ({ ...c, type: 'crypto' }))

    let assets = []
    if (filter === 'stocks') assets = stocksWithType
    else if (filter === 'crypto') assets = cryptoWithType
    else assets = [...stocksWithType, ...cryptoWithType]

    // Apply search filter
    if (search) {
      assets = assets.filter(asset =>
        asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
        asset.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      assets.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return assets
  }

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const filteredAssets = getFilteredAssets()

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )

  // Error Display
  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Assets</h3>
      <p className="text-red-700">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  )

  // Asset Details Modal
  const AssetModal = ({ asset, onClose }) => {
    if (!asset) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{asset.symbol}</h2>
                <p className="text-sm sm:text-base text-gray-600">{asset.name}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Current Price</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Change</p>
                <p className={`text-lg sm:text-2xl font-bold ${asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Volume</p>
                <p className="text-base sm:text-xl font-semibold text-gray-900">{asset.volume.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">Type</p>
                <p className="text-base sm:text-xl font-semibold text-gray-900 capitalize">{asset.type}</p>
              </div>
            </div>

            {asset.sector && (
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-gray-600">Sector</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{asset.sector}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorDisplay message={error} />

  return (
    <div className="pb-4">
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Live Indicator */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">Assets</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden sm:inline">Live</span>
          </div>
        </div>

        {/* Search Bar and Filter Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 sm:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by symbol or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm flex-shrink-0 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({stocks.length + crypto.length})
            </button>
            <button
              onClick={() => setFilter('stocks')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm flex-shrink-0 ${
                filter === 'stocks'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="hidden sm:inline">📊 </span>Stocks ({stocks.length})
            </button>
            <button
              onClick={() => setFilter('crypto')}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm flex-shrink-0 ${
                filter === 'crypto'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="hidden sm:inline">₿ </span>Crypto ({crypto.length})
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Name
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Type
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('currentPrice')}
                >
                  <span className="hidden sm:inline">Price </span>{getSortIcon('currentPrice')}
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('changePercent')}
                >
                  <span className="hidden sm:inline">Change </span>% {getSortIcon('changePercent')}
                </th>
                <th
                  className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                  onClick={() => handleSort('volume')}
                >
                  Volume {getSortIcon('volume')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">{asset.symbol}</span>
                      <p className="text-xs text-gray-600 sm:hidden truncate">{asset.name}</p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="text-gray-700 text-sm">{asset.name}</span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      asset.type === 'stock'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {asset.type}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-medium text-gray-900 text-sm sm:text-base">
                      ${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-medium text-sm sm:text-base ${
                      asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right hidden lg:table-cell">
                    <span className="text-gray-700 text-sm">
                      {asset.volume.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500 px-4">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-base sm:text-lg">No assets found matching your criteria</p>
            <p className="text-sm mt-2">Try adjusting your search or filter</p>
          </div>
        )}

        {filteredAssets.length > 0 && (
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs sm:text-sm text-gray-600">
            Showing {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  )
}

export default Assets

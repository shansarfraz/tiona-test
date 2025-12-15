import { useEffect, useState } from 'react'
import { getNews } from '../services/api'

const News = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError(null)
        const response = await getNews()
        setNews(response.data.data)
      } catch (error) {
        console.error('Error fetching news:', error)
        setError('Failed to load news. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()

    // Real-time updates
    const interval = setInterval(fetchNews, 30000)
    return () => clearInterval(interval)
  }, [])

  const categories = ['all', ...new Set(news.map(item => item.category))]

  const getFilteredNews = () => {
    let filtered = news

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase()) ||
        item.source.toLowerCase().includes(search.toLowerCase())
      )
    }

    return filtered
  }

  const filteredNews = getFilteredNews()

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  )

  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading News</h3>
      <p className="text-red-700">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  )

  const getCategoryColor = (category) => {
    const colors = {
      crypto: 'bg-orange-100 text-orange-800',
      stocks: 'bg-purple-100 text-purple-800',
      technology: 'bg-blue-100 text-blue-800',
      market: 'bg-green-100 text-green-800',
      macro: 'bg-indigo-100 text-indigo-800',
      default: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.default
  }

  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.7) return { icon: '😊', color: 'text-green-600', label: 'Positive' }
    if (sentiment >= 0.4) return { icon: '😐', color: 'text-gray-600', label: 'Neutral' }
    return { icon: '😟', color: 'text-red-600', label: 'Negative' }
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorDisplay message={error} />

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold">📰 News</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden sm:inline">Live</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all capitalize whitespace-nowrap text-sm flex-shrink-0 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category} {category === 'all' ? `(${news.length})` : `(${news.filter(n => n.category === category).length})`}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <p className="text-lg text-gray-500">No news found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or category filter</p>
          </div>
        ) : (
          filteredNews.map((item, index) => {
            const sentimentInfo = getSentimentIcon(item.sentiment)

            return (
              <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 break-words">{item.title}</h2>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap self-start flex-shrink-0 ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                {item.summary && (
                  <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">{item.summary}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                    </svg>
                    <span className="font-medium truncate">{item.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="hidden sm:inline">{new Date(item.timestamp).toLocaleString()}</span>
                    <span className="sm:hidden">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>

                  {item.sentiment !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className={sentimentInfo.color}>{sentimentInfo.icon}</span>
                      <span className={`${sentimentInfo.color} hidden sm:inline`}>{sentimentInfo.label}</span>
                    </div>
                  )}

                  {item.impact && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.impact === 'critical' ? 'bg-red-100 text-red-800' :
                      item.impact === 'high' ? 'bg-orange-100 text-orange-800' :
                      item.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.impact} impact
                    </span>
                  )}
                </div>

                {item.affectedAssets && item.affectedAssets.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Affected Assets:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.affectedAssets.map((asset, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {filteredNews.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredNews.length} of {news.length} news items
        </div>
      )}
    </div>
  )
}

export default News

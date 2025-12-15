import { useEffect, useState } from 'react'
import { getAlerts } from '../services/api'

const Alerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSeverity, setSelectedSeverity] = useState('all')

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setError(null)
        const response = await getAlerts()
        setAlerts(response.data.data)
      } catch (error) {
        console.error('Error fetching alerts:', error)
        setError('Failed to load alerts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()

    // Real-time updates
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const severities = ['all', 'critical', 'high', 'medium', 'low']

  const groupedAlerts = severities.slice(1).reduce((acc, severity) => {
    acc[severity] = alerts.filter(alert => alert.severity === severity)
    return acc
  }, {})

  const filteredAlerts = selectedSeverity === 'all' ? alerts : groupedAlerts[selectedSeverity] || []

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400', icon: '🚨', gradient: 'from-red-500 to-red-600' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', icon: '⚠️', gradient: 'from-orange-500 to-orange-600' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400', icon: '⚡', gradient: 'from-yellow-500 to-yellow-600' },
      low: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400', icon: 'ℹ️', gradient: 'from-blue-500 to-blue-600' }
    }
    return configs[severity] || configs.low
  }

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )

  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Alerts</h3>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">🔔 Alerts</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>

        {/* Severity Summary */}
        <div className="flex gap-2 text-sm">
          {severities.slice(1).map(severity => {
            const config = getSeverityConfig(severity)
            const count = groupedAlerts[severity]?.length || 0
            return (
              <div key={severity} className={`px-3 py-1 rounded-lg ${config.bg} ${config.text} font-medium`}>
                {config.icon} {count}
              </div>
            )
          })}
        </div>
      </div>

      {/* Severity Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {severities.map(severity => (
          <button
            key={severity}
            onClick={() => setSelectedSeverity(severity)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              selectedSeverity === severity
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {severity} {severity === 'all' ? `(${alerts.length})` : `(${groupedAlerts[severity]?.length || 0})`}
          </button>
        ))}
      </div>

      {/* Alerts Display */}
      {selectedSeverity === 'all' ? (
        // Grouped view
        <div className="space-y-6">
          {severities.slice(1).map(severity => {
            const config = getSeverityConfig(severity)
            const severityAlerts = groupedAlerts[severity] || []

            if (severityAlerts.length === 0) return null

            return (
              <div key={severity} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${config.gradient} text-white px-6 py-4`}>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="capitalize">{severity} Severity</span>
                    <span className="ml-auto text-sm opacity-90">({severityAlerts.length})</span>
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {severityAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`border-l-4 ${config.border} pl-4 py-3 hover:bg-gray-50 transition-colors rounded-r`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-gray-900 font-medium flex-1">{alert.message}</p>
                        {alert.impact && (
                          <span className={`text-xs px-2 py-1 rounded ml-2 ${
                            alert.impact === 'positive' ? 'bg-green-100 text-green-800' :
                            alert.impact === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.impact}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                        {alert.type && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{alert.type}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Single severity view
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <p className="text-lg text-gray-500">No {selectedSeverity} severity alerts</p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const config = getSeverityConfig(alert.severity)
              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{config.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-1">{alert.message}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          </div>
                          {alert.type && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{alert.type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                        {alert.severity}
                      </span>
                      {alert.impact && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          alert.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.impact}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {filteredAlerts.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default Alerts

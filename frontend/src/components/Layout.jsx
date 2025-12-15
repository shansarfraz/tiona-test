import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import MetaMaskButton from './MetaMaskButton'

const Layout = ({ children }) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Assets', path: '/assets', icon: '💰' },
    { name: 'News', path: '/news', icon: '📰' },
    { name: 'Alerts', path: '/alerts', icon: '🔔' },
    { name: 'Portfolio', path: '/portfolio', icon: '💼' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-pulse-primary">Pulse</h1>
                <span className="ml-2 text-xs sm:text-sm text-gray-500 hidden sm:inline">Market Monitoring Engine</span>
              </div>
            </div>
            <MetaMaskButton />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex pt-14 sm:pt-16 w-full max-w-full overflow-x-hidden">
        {/* Sidebar - Desktop */}
        <aside className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] transition-all duration-300 fixed left-0 top-14 sm:top-16 bottom-0 overflow-y-auto`}>
          <div className="p-4">
            {/* Desktop Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 w-full flex justify-end"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
            </button>

            <nav>
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-pulse-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        title={!sidebarOpen ? item.name : ''}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        {sidebarOpen && <span>{item.name}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        <aside className={`lg:hidden fixed left-0 top-14 sm:top-16 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-pulse-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'} w-full max-w-full overflow-x-hidden min-w-0`}>
          <div className="max-w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

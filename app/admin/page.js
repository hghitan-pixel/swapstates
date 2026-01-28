'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Users, Eye, Home, TrendingUp, Calendar, Loader2, RefreshCw, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// Simple password protection - change this!
const ADMIN_PASSWORD = 'swapstates2024'

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="gradient-bg text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeftRight className="w-8 h-8" />
            <span className="text-xl md:text-2xl font-bold">SwapStates</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-200">Home</Link>
            <Link href="/browse" className="hover:text-blue-200">Browse</Link>
            <Link href="/admin" className="hover:text-blue-200">Analytics</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [recentVisits, setRecentVisits] = useState([])
  const [topPages, setTopPages] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setError('')
      fetchAnalytics()
    } else {
      setError('Incorrect password')
    }
  }

  async function fetchAnalytics() {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get today's stats
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

    // Total visits today
    const { count: todayCount } = await supabase
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)

    // Total visits yesterday
    const { count: yesterdayCount } = await supabase
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday)
      .lt('created_at', today)

    // Total visits this week
    const { count: weekCount } = await supabase
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo)

    // Total all time
    const { count: totalCount } = await supabase
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })

    // Listing views today
    const { count: listingViewsToday } = await supabase
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today)
      .not('listing_id', 'is', null)

    setStats({
      today: todayCount || 0,
      yesterday: yesterdayCount || 0,
      week: weekCount || 0,
      total: totalCount || 0,
      listingViewsToday: listingViewsToday || 0
    })

    // Get recent visits
    const { data: recent } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    setRecentVisits(recent || [])

    // Get top pages
    const { data: pages } = await supabase
      .from('visitor_logs')
      .select('page')
      .gte('created_at', weekAgo)

    if (pages) {
      const pageCounts = {}
      pages.forEach(p => {
        pageCounts[p.page] = (pageCounts[p.page] || 0) + 1
      })
      const sorted = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, count]) => ({ page, count }))
      setTopPages(sorted)
    }

    setLoading(false)
  }

  async function handleRefresh() {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  function getPageName(path) {
    if (path === '/') return 'Home'
    if (path === '/browse') return 'Browse'
    if (path === '/about') return 'Who We Are'
    if (path === '/contact') return 'Contact'
    if (path === '/list') return 'List Your Home'
    if (path === '/login') return 'Login'
    if (path.startsWith('/listing/')) return 'Listing View'
    return path
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-gray-600">Enter password to view site analytics</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <input
                type="password"
                className="w-full border rounded-lg px-4 py-3 mb-4"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Access Analytics
              </button>
            </form>
          </div>
        </main>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Site Analytics</h1>
              <p className="text-gray-600">Track visitor activity on SwapStates</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.today || 0}</div>
              <div className="text-sm text-gray-500">Visits Today</div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.yesterday || 0}</div>
              <div className="text-sm text-gray-500">Yesterday</div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.week || 0}</div>
              <div className="text-sm text-gray-500">This Week</div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.total || 0}</div>
              <div className="text-sm text-gray-500">All Time</div>
            </div>
            
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.listingViewsToday || 0}</div>
              <div className="text-sm text-gray-500">Listing Views Today</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Visits */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentVisits.length > 0 ? (
                  recentVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <div className="font-medium text-sm">{getPageName(visit.page)}</div>
                        <div className="text-xs text-gray-500">{formatTime(visit.created_at)}</div>
                      </div>
                      {visit.listing_id && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Listing</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No visits recorded yet</p>
                )}
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Top Pages (This Week)</h2>
              <div className="space-y-3">
                {topPages.length > 0 ? (
                  topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{getPageName(page.page)}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{page.count} views</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

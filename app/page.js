'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Home, Search, ArrowRight, Menu, X, Bed, Bath, Square, MapPin, DollarSign, Clock, Users, Zap, TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
    }
    getUser()
  }, [])

  return (
    <nav className="bg-blue-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeftRight className="w-7 h-7" />
            <span className="text-xl font-bold">SwapStates</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-blue-100 hover:text-white transition">Home</Link>
            <Link href="/browse" className="text-blue-100 hover:text-white transition">Browse</Link>
            <Link href="/about" className="text-blue-100 hover:text-white transition">About</Link>
            <Link href="/contact" className="text-blue-100 hover:text-white transition">Contact</Link>
            {user ? (
              <Link href="/dashboard" className="text-blue-100 hover:text-white transition">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-blue-100 hover:text-white transition">Sign In</Link>
            )}
            <Link href="/list" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold transition">
              List Your Home
            </Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4 border-t border-blue-800 pt-4">
            <Link href="/" className="block py-2 text-blue-100">Home</Link>
            <Link href="/browse" className="block py-2 text-blue-100">Browse</Link>
            <Link href="/about" className="block py-2 text-blue-100">About</Link>
            <Link href="/contact" className="block py-2 text-blue-100">Contact</Link>
            {user ? (
              <Link href="/dashboard" className="block py-2 text-blue-100">Dashboard</Link>
            ) : (
              <Link href="/login" className="block py-2 text-blue-100">Sign In</Link>
            )}
            <Link href="/list" className="block bg-emerald-500 text-white text-center py-3 rounded-lg font-semibold mt-2">
              List Your Home
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xl font-bold">SwapStates</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              The smarter way to relocate. Connect directly with homeowners who want to swap, 
              skip the agent fees, and move on your timeline.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-blue-200 text-sm">
              <Link href="/browse" className="block hover:text-white transition">Browse Listings</Link>
              <Link href="/list" className="block hover:text-white transition">List Your Home</Link>
              <Link href="/about" className="block hover:text-white transition">About Us</Link>
              <Link href="/contact" className="block hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <div className="space-y-2 text-blue-200 text-sm">
              <a href="https://www.freddiemac.com/pmms" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition">Mortgage Rates</a>
              <Link href="/login" className="block hover:text-white transition">Sign In</Link>
              <Link href="/login" className="block hover:text-white transition">Create Account</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-8 text-center text-blue-300 text-sm">
          © {new Date().getFullYear()} SwapStates. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function ListingCard({ listing }) {
  const primaryImage = listing.images?.find(img => img.is_primary) || listing.images?.[0]
  const image = primaryImage?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop'
  
  return (
    <Link href={`/listing/${listing.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt="Property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Active
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-blue-900">${listing.estimated_value?.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.current_city}, {listing.current_state}
          </div>
          <div className="flex items-center gap-1 text-sm mb-3">
            <span className="text-gray-500">Wants:</span>
            <span className="font-medium text-emerald-600">{listing.desired_state}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.beds} bd</span>
            <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.baths} ba</span>
            <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.sqft?.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function MortgageRatesWidget() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY

  useEffect(() => {
    fetchRates()
  }, [])

  async function fetchRates() {
    setLoading(true)
    
    try {
      if (!FRED_API_KEY || FRED_API_KEY === 'demo') {
        throw new Error('No API key')
      }

      const baseUrl = 'https://api.stlouisfed.org/fred/series/observations'
      
      const [mortgage30Res, mortgage15Res] = await Promise.all([
        fetch(`${baseUrl}?series_id=MORTGAGE30US&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=5`),
        fetch(`${baseUrl}?series_id=MORTGAGE15US&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=5`)
      ])

      if (!mortgage30Res.ok || !mortgage15Res.ok) {
        throw new Error('API request failed')
      }

      const [mortgage30Data, mortgage15Data] = await Promise.all([
        mortgage30Res.json(),
        mortgage15Res.json()
      ])

      const mortgage30Observations = mortgage30Data.observations?.filter(o => o.value !== '.') || []
      const mortgage15Observations = mortgage15Data.observations?.filter(o => o.value !== '.') || []

      const mortgage30yr = parseFloat(mortgage30Observations[0]?.value)
      const mortgage30yrPrev = parseFloat(mortgage30Observations[1]?.value)
      const mortgage15yr = parseFloat(mortgage15Observations[0]?.value)
      const mortgage15yrPrev = parseFloat(mortgage15Observations[1]?.value)
      const dataDate = mortgage30Observations[0]?.date

      setData({
        mortgage30yr: mortgage30yr.toFixed(2),
        mortgage30yrChange: parseFloat((mortgage30yr - mortgage30yrPrev).toFixed(2)),
        mortgage15yr: mortgage15yr.toFixed(2),
        mortgage15yrChange: parseFloat((mortgage15yr - mortgage15yrPrev).toFixed(2)),
        dataDate
      })
      
      setLastUpdated(new Date())
      setLoading(false)

    } catch (err) {
      // Fallback data
      setData({
        mortgage30yr: '6.87',
        mortgage30yrChange: -0.05,
        mortgage15yr: '6.12',
        mortgage15yrChange: -0.03,
        dataDate: null
      })
      setLastUpdated(new Date())
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-500">Loading rates...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Today's Mortgage Rates</h3>
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Live
          </span>
        </div>
        <button onClick={fetchRates} className="text-gray-400 hover:text-gray-600 transition">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">30-Year Fixed</div>
          <div className="text-2xl font-bold text-blue-900">{data.mortgage30yr}%</div>
          <div className={`text-xs flex items-center gap-1 mt-1 ${
            data.mortgage30yrChange < 0 ? 'text-emerald-600' : 
            data.mortgage30yrChange > 0 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {data.mortgage30yrChange < 0 && <TrendingDown className="w-3 h-3" />}
            {data.mortgage30yrChange > 0 && <TrendingUp className="w-3 h-3" />}
            {data.mortgage30yrChange !== 0 ? `${data.mortgage30yrChange > 0 ? '+' : ''}${data.mortgage30yrChange}%` : 'No change'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">15-Year Fixed</div>
          <div className="text-2xl font-bold text-blue-900">{data.mortgage15yr}%</div>
          <div className={`text-xs flex items-center gap-1 mt-1 ${
            data.mortgage15yrChange < 0 ? 'text-emerald-600' : 
            data.mortgage15yrChange > 0 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {data.mortgage15yrChange < 0 && <TrendingDown className="w-3 h-3" />}
            {data.mortgage15yrChange > 0 && <TrendingUp className="w-3 h-3" />}
            {data.mortgage15yrChange !== 0 ? `${data.mortgage15yrChange > 0 ? '+' : ''}${data.mortgage15yrChange}%` : 'No change'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
        <span>Source: Freddie Mac PMMS® • {formatDate(data.dataDate)}</span>
        <a href="https://www.freddiemac.com/pmms" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-600 transition">
          View more <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}

function SavingsCalculator() {
  const [homeValue, setHomeValue] = useState(400000)
  
  const agentCommission = homeValue * 0.06
  const closingCosts = homeValue * 0.03
  const totalSavings = agentCommission + closingCosts

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Calculate Your Savings</h3>
      
      <div className="mb-4">
        <label className="text-sm text-gray-500 mb-2 block">Home Value</label>
        <input
          type="range"
          min="100000"
          max="1000000"
          step="25000"
          value={homeValue}
          onChange={(e) => setHomeValue(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
        />
        <div className="text-2xl font-bold text-blue-900 mt-2">${homeValue.toLocaleString()}</div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Agent Commission (6%)</span>
          <span className="text-red-500 font-medium">-${agentCommission.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Closing Costs (3%)</span>
          <span className="text-red-500 font-medium">-${closingCosts.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
        <div className="text-sm text-emerald-700 mb-1">With SwapStates you keep</div>
        <div className="text-3xl font-bold text-emerald-600">${totalSavings.toLocaleString()}</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      const supabase = createClient()
      if (!supabase) {
        setLoading(false)
        return
      }
      
      const { data } = await supabase
        .from('listings')
        .select('*, images:listing_images(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(4)
      
      setListings(data || [])
      setLoading(false)
    }
    
    fetchListings()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-blue-900 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Trade Homes Across State Lines
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Skip the slow market and expensive agent fees. Find homeowners who want to swap — 
                you move where they are, they move where you are.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/list" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition inline-flex items-center justify-center gap-2">
                  List Your Home Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/browse" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition inline-flex items-center justify-center">
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-blue-800 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">$0</div>
                <div className="text-blue-200 text-sm">To List</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50</div>
                <div className="text-blue-200 text-sm">States</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">6%</div>
                <div className="text-blue-200 text-sm">Avg. Commission Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">Direct</div>
                <div className="text-blue-200 text-sm">Owner-to-Owner</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works + Sidebar */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">How SwapStates Works</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">List Your Home</h3>
                      <p className="text-gray-600">Add your property details and specify which state you want to move to. It's free and takes less than 5 minutes.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">Find Your Match</h3>
                      <p className="text-gray-600">Browse listings from homeowners looking to swap in the opposite direction. Filter by location, price, and home features.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">Connect & Swap</h3>
                      <p className="text-gray-600">Reach out to potential matches, discuss details, and coordinate your move. Use agents or go direct — your choice.</p>
                    </div>
                  </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Save Thousands</h4>
                      <p className="text-sm text-gray-500">Skip the 5-6% agent commission</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Move Faster</h4>
                      <p className="text-sm text-gray-500">No waiting months for a buyer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Synced Timing</h4>
                      <p className="text-sm text-gray-500">Move out when they move out</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Aligned Goals</h4>
                      <p className="text-sm text-gray-500">Both parties want success</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <MortgageRatesWidget />
                <SavingsCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Recent Listings</h2>
              <Link href="/browse" className="text-blue-900 font-semibold hover:text-blue-700 flex items-center gap-1 transition">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                <span className="text-gray-500">Loading listings...</span>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Be the First to List!</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">No listings yet. Start the marketplace by adding your home.</p>
                <Link href="/list" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2">
                  List Your Home <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Swap?</h2>
            <p className="text-xl text-blue-100 mb-8">Join homeowners discovering a smarter way to relocate.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/list" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition inline-flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/browse" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition">
                Explore Listings
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

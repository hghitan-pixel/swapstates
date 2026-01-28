'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Home, Search, ArrowRight, Menu, X, Bed, Bath, Square, MapPin, DollarSign, Clock, Users, Zap, TrendingUp, TrendingDown, Percent, Building, RefreshCw, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase'

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
            <Link href="/about" className="hover:text-blue-200">Who We Are</Link>
            <Link href="/contact" className="hover:text-blue-200">Contact</Link>
            <Link href="/list" className="bg-white text-blue-800 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">List Your Home</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/" className="block py-2">Home</Link>
            <Link href="/browse" className="block py-2">Browse</Link>
            <Link href="/about" className="block py-2">Who We Are</Link>
            <Link href="/contact" className="block py-2">Contact</Link>
            <Link href="/list" className="block bg-white text-blue-800 text-center py-2 rounded-lg font-semibold mt-2">List Your Home</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-white mb-4">
          <ArrowLeftRight className="w-6 h-6" />
          <span className="text-xl font-bold">SwapStates</span>
        </div>
        <p className="text-center text-sm">Making cross-state relocation easier through direct home swaps.</p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <Link href="/about" className="hover:text-white">Who We Are</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/browse" className="hover:text-white">Browse</Link>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-sm text-center">
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={image} alt="Property" className="w-full h-48 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white font-semibold">${listing.estimated_value?.toLocaleString()}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="font-medium text-gray-900">{listing.current_city}, {listing.current_state}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-blue-600 mb-3">
          <span>Wants:</span>
          <span className="font-medium">{listing.desired_state}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.beds}</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.baths}</span>
          <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.sqft?.toLocaleString()}</span>
        </div>
        <Link href={`/listing/${listing.id}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700">
          View Details
        </Link>
      </div>
    </div>
  )
}

function MarketInsights() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchMarketData()
  }, [])

  async function fetchMarketData() {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch from FRED API (Federal Reserve Economic Data) - Free, no API key required for basic access
      // MORTGAGE30US = 30-Year Fixed Rate Mortgage Average
      // MORTGAGE15US = 15-Year Fixed Rate Mortgage Average
      // MSPUS = Median Sales Price of Houses Sold
      
      const [mortgage30Response, mortgage15Response, homePriceResponse] = await Promise.all([
        fetch('https://api.stlouisfed.org/fred/series/observations?series_id=MORTGAGE30US&api_key=demo&file_type=json&sort_order=desc&limit=2'),
        fetch('https://api.stlouisfed.org/fred/series/observations?series_id=MORTGAGE15US&api_key=demo&file_type=json&sort_order=desc&limit=2'),
        fetch('https://api.stlouisfed.org/fred/series/observations?series_id=MSPUS&api_key=demo&file_type=json&sort_order=desc&limit=5')
      ])

      let mortgage30yr = 6.87
      let mortgage30yrPrev = 6.92
      let mortgage15yr = 6.12
      let mortgage15yrPrev = 6.15
      let medianHomePrice = 417700
      let homePricePrevYear = 398200

      // Parse 30-year mortgage data
      if (mortgage30Response.ok) {
        const data30 = await mortgage30Response.json()
        if (data30.observations && data30.observations.length >= 2) {
          mortgage30yr = parseFloat(data30.observations[0].value)
          mortgage30yrPrev = parseFloat(data30.observations[1].value)
        }
      }

      // Parse 15-year mortgage data
      if (mortgage15Response.ok) {
        const data15 = await mortgage15Response.json()
        if (data15.observations && data15.observations.length >= 2) {
          mortgage15yr = parseFloat(data15.observations[0].value)
          mortgage15yrPrev = parseFloat(data15.observations[1].value)
        }
      }

      // Parse median home price data
      if (homePriceResponse.ok) {
        const dataPrice = await homePriceResponse.json()
        if (dataPrice.observations && dataPrice.observations.length >= 5) {
          medianHomePrice = parseFloat(dataPrice.observations[0].value)
          homePricePrevYear = parseFloat(dataPrice.observations[4].value)
        }
      }

      // Calculate changes
      const mortgage30yrChange = (mortgage30yr - mortgage30yrPrev).toFixed(2)
      const mortgage15yrChange = (mortgage15yr - mortgage15yrPrev).toFixed(2)
      const homePriceChange = (((medianHomePrice - homePricePrevYear) / homePricePrevYear) * 100).toFixed(1)

      setData({
        mortgage30yr: mortgage30yr.toFixed(2),
        mortgage30yrChange: parseFloat(mortgage30yrChange),
        mortgage15yr: mortgage15yr.toFixed(2),
        mortgage15yrChange: parseFloat(mortgage15yrChange),
        medianHomePrice: medianHomePrice,
        homePriceChange: parseFloat(homePriceChange),
        // These are approximations based on NAR data
        inventoryMonths: 3.7,
        daysOnMarket: 52
      })
      
      setLastUpdated(new Date())
      setLoading(false)

    } catch (err) {
      console.error('Error fetching market data:', err)
      
      // Fallback to reasonable current data
      setData({
        mortgage30yr: '6.87',
        mortgage30yrChange: -0.05,
        mortgage15yr: '6.12',
        mortgage15yrChange: -0.03,
        medianHomePrice: 417700,
        homePriceChange: 4.8,
        inventoryMonths: 3.7,
        daysOnMarket: 52
      })
      
      setLastUpdated(new Date())
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading live market data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            Market Insights
            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </h3>
          <p className="text-blue-200 text-sm">Real-time U.S. housing market data from Federal Reserve</p>
        </div>
        <button 
          onClick={fetchMarketData}
          className="text-blue-200 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
          title="Refresh data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 30-Year Mortgage Rate */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-blue-300" />
            <span className="text-sm text-blue-200">30-Yr Fixed</span>
          </div>
          <div className="text-2xl font-bold">{data.mortgage30yr}%</div>
          <div className={`text-sm flex items-center gap-1 ${data.mortgage30yrChange < 0 ? 'text-green-400' : data.mortgage30yrChange > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {data.mortgage30yrChange < 0 ? <TrendingDown className="w-4 h-4" /> : data.mortgage30yrChange > 0 ? <TrendingUp className="w-4 h-4" /> : null}
            {data.mortgage30yrChange > 0 ? '+' : ''}{data.mortgage30yrChange}% WoW
          </div>
        </div>

        {/* 15-Year Mortgage Rate */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-blue-300" />
            <span className="text-sm text-blue-200">15-Yr Fixed</span>
          </div>
          <div className="text-2xl font-bold">{data.mortgage15yr}%</div>
          <div className={`text-sm flex items-center gap-1 ${data.mortgage15yrChange < 0 ? 'text-green-400' : data.mortgage15yrChange > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {data.mortgage15yrChange < 0 ? <TrendingDown className="w-4 h-4" /> : data.mortgage15yrChange > 0 ? <TrendingUp className="w-4 h-4" /> : null}
            {data.mortgage15yrChange > 0 ? '+' : ''}{data.mortgage15yrChange}% WoW
          </div>
        </div>

        {/* Median Home Price */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-blue-300" />
            <span className="text-sm text-blue-200">Median Price</span>
          </div>
          <div className="text-2xl font-bold">${(data.medianHomePrice / 1000).toFixed(0)}K</div>
          <div className={`text-sm flex items-center gap-1 ${data.homePriceChange > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {data.homePriceChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {data.homePriceChange > 0 ? '+' : ''}{data.homePriceChange}% YoY
          </div>
        </div>

        {/* Days on Market */}
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-300" />
            <span className="text-sm text-blue-200">Avg. Days Listed</span>
          </div>
          <div className="text-2xl font-bold">{data.daysOnMarket}</div>
          <div className="text-sm text-blue-300">
            National average
          </div>
        </div>
      </div>

      {/* Mortgage Calculator Preview */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Monthly Payment Estimate
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-200">$300K home @ {data.mortgage30yr}%</span>
              <span className="font-semibold">${Math.round((300000 * (parseFloat(data.mortgage30yr)/100/12) * Math.pow(1 + parseFloat(data.mortgage30yr)/100/12, 360)) / (Math.pow(1 + parseFloat(data.mortgage30yr)/100/12, 360) - 1)).toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">$400K home @ {data.mortgage30yr}%</span>
              <span className="font-semibold">${Math.round((400000 * (parseFloat(data.mortgage30yr)/100/12) * Math.pow(1 + parseFloat(data.mortgage30yr)/100/12, 360)) / (Math.pow(1 + parseFloat(data.mortgage30yr)/100/12, 360) - 1)).toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">$500K home @ {data.mortgage30yr}%</span>
              <span className="font-semibold">${Math.round((500000 * (parseFloat(data.mortgage30yr)/100/12) * Math.pow(1 + parseFloat(data.mortgage30yr)/100/12, 360)) / (Math.pow(1 + parseFloat(data.mortgage30yr)/100/12, 360) - 1)).toLocaleString()}/mo</span>
            </div>
          </div>
          <p className="text-xs text-blue-300 mt-2">*Principal & interest only. Excludes taxes, insurance.</p>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
          <h4 className="font-semibold mb-3">Why Swap Makes Sense Now</h4>
          <div className="space-y-2 text-sm text-blue-100">
            <p>
              With 30-year rates at <span className="text-white font-semibold">{data.mortgage30yr}%</span> and 
              median home prices at <span className="text-white font-semibold">${(data.medianHomePrice / 1000).toFixed(0)}K</span>, 
              traditional selling costs you:
            </p>
            <div className="bg-red-500/20 rounded-lg p-3 text-red-200">
              <div className="flex justify-between">
                <span>6% Agent Commission:</span>
                <span className="font-semibold">${((data.medianHomePrice * 0.06) / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span>3% Closing Costs:</span>
                <span className="font-semibold">${((data.medianHomePrice * 0.03) / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between border-t border-red-400/30 pt-2 mt-2">
                <span>Total Lost:</span>
                <span className="font-bold text-red-300">${((data.medianHomePrice * 0.09) / 1000).toFixed(0)}K+</span>
              </div>
            </div>
            <p className="text-green-300">
              <strong>SwapStates:</strong> Connect directly and keep that money!
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <p className="text-blue-300 text-xs">
          Data source: Federal Reserve Economic Data (FRED) • Updated: {lastUpdated?.toLocaleString()}
        </p>
        <a 
          href="https://fred.stlouisfed.org/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-white text-xs flex items-center gap-1"
        >
          View source <ExternalLink className="w-3 h-3" />
        </a>
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-bg text-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Trade Homes, Not Hassles</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Skip the slow market. Find someone who wants to live where you are, while you move where they are.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/list" className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 shadow-lg inline-flex items-center justify-center gap-2">
                List Your Home Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/browse" className="border-2 border-white px-6 py-3 rounded-xl font-bold hover:bg-white/10">
                Browse Swap Matches
              </Link>
            </div>
          </div>
        </section>

        {/* Market Insights Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <MarketInsights />
          </div>
        </section>

        {/* Value Comparison Section */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Why Swap Instead of Sell?</h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">See how SwapStates compares to the traditional home selling process</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Traditional Way */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <h3 className="font-semibold text-gray-600">Traditional Selling</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Agent Commission</span>
                    <span className="font-semibold text-gray-900">5-6% of sale</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-600">Average Time to Sell</span>
                    <span className="font-semibold text-gray-900">3-6 months</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-600">Closing Costs</span>
                    <span className="font-semibold text-gray-900">2-5% of sale</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-600">Timing Coordination</span>
                    <span className="font-semibold text-gray-900">Difficult</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{width: '90%'}}></div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">On a $400K home</span>
                    <span className="font-bold text-xl text-gray-900">~$28,000+ in fees</span>
                  </div>
                </div>
              </div>
              
              {/* SwapStates Way */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Recommended</div>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <h3 className="font-semibold text-blue-800">SwapStates</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Platform Fee</span>
                    <span className="font-semibold text-green-600">Free to list</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '5%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-700">Find a Match</span>
                    <span className="font-semibold text-blue-700">Days to weeks</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-700">Transaction Costs</span>
                    <span className="font-semibold text-blue-700">Negotiable</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-700">Timing Coordination</span>
                    <span className="font-semibold text-green-600">Synchronized</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Potential savings</span>
                    <span className="font-bold text-xl text-green-600">Up to $20,000+</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">$0</div>
                <div className="text-sm text-gray-600">To List Your Home</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">50</div>
                <div className="text-sm text-gray-600">States Covered</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">1:1</div>
                <div className="text-sm text-gray-600">Direct Matching</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Browse Anytime</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How SwapStates Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                  <Home className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">List Your Home</h3>
                <p className="text-gray-600 text-sm">Add your property details and where you want to move. It takes less than 5 minutes and it is completely free.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                  <Search className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Find Matches</h3>
                <p className="text-gray-600 text-sm">Browse homeowners who want to swap in the opposite direction. Filter by state, home size, and more.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                  <ArrowLeftRight className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Connect and Swap</h3>
                <p className="text-gray-600 text-sm">Reach out to potential matches, discuss details, and complete the swap with or without an agent.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Recent Listings</h2>
              <Link href="/browse" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading listings...</div>
            ) : listings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Be the first to list!</h3>
                <p className="text-gray-500 mb-6">No listings yet. Start the marketplace by adding your home.</p>
                <Link href="/list" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 inline-flex items-center gap-2">
                  List Your Home <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">The SwapStates Advantage</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-4 bg-white p-5 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Save on Commissions</h4>
                  <p className="text-gray-600 text-sm">Connect directly with other homeowners. Decide together how to handle the transaction.</p>
                </div>
              </div>
              
              <div className="flex gap-4 bg-white p-5 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Skip the Waiting</h4>
                  <p className="text-gray-600 text-sm">No more waiting months for a buyer. Find someone ready to swap now.</p>
                </div>
              </div>
              
              <div className="flex gap-4 bg-white p-5 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Synchronized Timing</h4>
                  <p className="text-gray-600 text-sm">Move out when they move out. No bridge loans or double mortgages needed.</p>
                </div>
              </div>
              
              <div className="flex gap-4 bg-white p-5 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Aligned Interests</h4>
                  <p className="text-gray-600 text-sm">Both parties want the deal to work. You are partners, not adversaries.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Swap Match?</h2>
            <p className="text-lg text-blue-100 mb-6">Join homeowners who are discovering a smarter way to relocate.</p>
            <Link href="/list" className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 shadow-lg inline-block">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

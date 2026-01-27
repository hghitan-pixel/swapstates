'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Search, Menu, X, Bed, Bath, Square, MapPin, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

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
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-white mb-4">
          <ArrowLeftRight className="w-6 h-6" />
          <span className="text-xl font-bold">SwapStates</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} SwapStates. All rights reserved.</p>
      </div>
    </footer>
  )
}

function ListingCard({ listing }) {
  const image = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop'
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
        <div className="text-sm text-blue-600 mb-3">Wants: <span className="font-medium">{listing.desired_state}</span></div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.beds}</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.baths}</span>
          <span className="flex items-center gap-1"><Square className="w-4 h-4" />{listing.sqft?.toLocaleString()}</span>
        </div>
        <Link href={`/listing/${listing.id}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-blue-700">View Details</Link>
      </div>
    </div>
  )
}

export default function BrowsePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ fromState: '', toState: '', minBeds: '' })

  useEffect(() => {
    fetchListings()
  }, [filters])

  async function fetchListings() {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    
    let query = supabase.from('listings').select('*, images:listing_images(*)').eq('status', 'active')
    if (filters.fromState) query = query.eq('current_state', filters.fromState)
    if (filters.toState) query = query.eq('desired_state', filters.toState)
    if (filters.minBeds) query = query.gte('beds', parseInt(filters.minBeds))
    query = query.order('created_at', { ascending: false })
    
    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Browse Swap Opportunities</h1>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">They're In</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={filters.fromState} onChange={(e) => setFilters({...filters, fromState: e.target.value})}>
                <option value="">Any State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">They Want</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={filters.toState} onChange={(e) => setFilters({...filters, toState: e.target.value})}>
                <option value="">Any State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Beds</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={filters.minBeds} onChange={(e) => setFilters({...filters, minBeds: e.target.value})}>
                <option value="">Any</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => setFilters({ fromState: '', toState: '', minBeds: '' })} className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50">Reset</button>
            </div>
          </div>
        </div>

        <div className="mb-4 text-gray-600 text-sm">{loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}</div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading listings...</div>
        ) : listings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

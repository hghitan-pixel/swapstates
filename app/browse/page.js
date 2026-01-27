'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Search, Menu, X, Bed, Bath, Square, MapPin, SlidersHorizontal, Map, List } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

// State coordinates for map centering
const STATE_COORDS = {
  'Alabama': [32.806671, -86.791130],
  'Alaska': [61.370716, -152.404419],
  'Arizona': [33.729759, -111.431221],
  'Arkansas': [34.969704, -92.373123],
  'California': [36.116203, -119.681564],
  'Colorado': [39.059811, -105.311104],
  'Connecticut': [41.597782, -72.755371],
  'Delaware': [39.318523, -75.507141],
  'Florida': [27.766279, -81.686783],
  'Georgia': [33.040619, -83.643074],
  'Hawaii': [21.094318, -157.498337],
  'Idaho': [44.240459, -114.478828],
  'Illinois': [40.349457, -88.986137],
  'Indiana': [39.849426, -86.258278],
  'Iowa': [42.011539, -93.210526],
  'Kansas': [38.526600, -96.726486],
  'Kentucky': [37.668140, -84.670067],
  'Louisiana': [31.169546, -91.867805],
  'Maine': [44.693947, -69.381927],
  'Maryland': [39.063946, -76.802101],
  'Massachusetts': [42.230171, -71.530106],
  'Michigan': [43.326618, -84.536095],
  'Minnesota': [45.694454, -93.900192],
  'Mississippi': [32.741646, -89.678696],
  'Missouri': [38.456085, -92.288368],
  'Montana': [46.921925, -110.454353],
  'Nebraska': [41.125370, -98.268082],
  'Nevada': [38.313515, -117.055374],
  'New Hampshire': [43.452492, -71.563896],
  'New Jersey': [40.298904, -74.521011],
  'New Mexico': [34.840515, -106.248482],
  'New York': [42.165726, -74.948051],
  'North Carolina': [35.630066, -79.806419],
  'North Dakota': [47.528912, -99.784012],
  'Ohio': [40.388783, -82.764915],
  'Oklahoma': [35.565342, -96.928917],
  'Oregon': [44.572021, -122.070938],
  'Pennsylvania': [40.590752, -77.209755],
  'Rhode Island': [41.680893, -71.511780],
  'South Carolina': [33.856892, -80.945007],
  'South Dakota': [44.299782, -99.438828],
  'Tennessee': [35.747845, -86.692345],
  'Texas': [31.054487, -97.563461],
  'Utah': [40.150032, -111.862434],
  'Vermont': [44.045876, -72.710686],
  'Virginia': [37.769337, -78.169968],
  'Washington': [47.400902, -121.490494],
  'West Virginia': [38.491226, -80.954453],
  'Wisconsin': [44.268543, -89.616508],
  'Wyoming': [42.755966, -107.302490]
}

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
            <Link href="/about" className="block py-2">Who We Are</Link>
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
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative">
        <img src={image} alt="Property" className="w-full h-36 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="text-white font-semibold">${listing.estimated_value?.toLocaleString()}</div>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="font-medium text-gray-900 truncate">{listing.current_city}, {listing.current_state}</span>
        </div>
        <div className="text-xs text-blue-600 mb-2">Wants: <span className="font-medium">{listing.desired_state}</span></div>
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{listing.beds}</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{listing.baths}</span>
          <span className="flex items-center gap-1"><Square className="w-3 h-3" />{listing.sqft?.toLocaleString()}</span>
        </div>
        <Link href={`/listing/${listing.id}`} className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">View</Link>
      </div>
    </div>
  )
}

function MapView({ listings, onMarkerClick }) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => setMapLoaded(true)
      document.body.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !window.L) return

    // Remove existing map
    const container = document.getElementById('map')
    if (container._leaflet_id) {
      container._leaflet_id = null
      container.innerHTML = ''
    }

    // Create map centered on US
    const map = window.L.map('map').setView([39.8283, -98.5795], 4)

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Custom marker icon
    const markerIcon = window.L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #2563eb; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏠</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    // Add markers for each listing
    listings.forEach(listing => {
      const coords = STATE_COORDS[listing.current_state]
      if (coords) {
        // Add some randomness to prevent overlapping markers
        const lat = coords[0] + (Math.random() - 0.5) * 2
        const lng = coords[1] + (Math.random() - 0.5) * 2

        const marker = window.L.marker([lat, lng], { icon: markerIcon }).addTo(map)
        
        const popupContent = `
          <div style="min-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${listing.current_city}, ${listing.current_state}</div>
            <div style="color: #2563eb; font-size: 14px; margin-bottom: 4px;">$${listing.estimated_value?.toLocaleString()}</div>
            <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
              ${listing.beds} bed • ${listing.baths} bath • ${listing.sqft?.toLocaleString()} sqft
            </div>
            <div style="font-size: 12px; color: #059669; margin-bottom: 8px;">
              Wants to move to: <strong>${listing.desired_state}</strong>
            </div>
            <a href="/listing/${listing.id}" style="display: block; background: #2563eb; color: white; text-align: center; padding: 8px; border-radius: 6px; text-decoration: none; font-size: 12px;">
              View Details
            </a>
          </div>
        `
        marker.bindPopup(popupContent)
      }
    })

    return () => {
      map.remove()
    }
  }, [mapLoaded, listings])

  return (
    <div id="map" className="w-full h-full rounded-lg" style={{ minHeight: '500px' }}></div>
  )
}

export default function BrowsePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('split') // 'list', 'map', 'split'
  const [filters, setFilters] = useState({ fromState: '', toState: '', minBeds: '' })
  const [selectedListing, setSelectedListing] = useState(null)

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
      
      <main className="flex-1 flex flex-col">
        {/* Header & Filters */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold">Browse Swap Opportunities</h1>
                <p className="text-sm text-gray-500">{loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}</p>
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                  >
                    <List className="w-4 h-4" /> List
                  </button>
                  <button 
                    onClick={() => setViewMode('split')} 
                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${viewMode === 'split' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                  >
                    Split
                  </button>
                  <button 
                    onClick={() => setViewMode('map')} 
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${viewMode === 'map' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}
                  >
                    <Map className="w-4 h-4" /> Map
                  </button>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select 
                className="border rounded-lg px-3 py-1.5 text-sm" 
                value={filters.fromState} 
                onChange={(e) => setFilters({...filters, fromState: e.target.value})}
              >
                <option value="">Any Location</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="border rounded-lg px-3 py-1.5 text-sm" 
                value={filters.toState} 
                onChange={(e) => setFilters({...filters, toState: e.target.value})}
              >
                <option value="">Any Destination</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                className="border rounded-lg px-3 py-1.5 text-sm" 
                value={filters.minBeds} 
                onChange={(e) => setFilters({...filters, minBeds: e.target.value})}
              >
                <option value="">Any Beds</option>
                <option value="2">2+ beds</option>
                <option value="3">3+ beds</option>
                <option value="4">4+ beds</option>
              </select>
              {(filters.fromState || filters.toState || filters.minBeds) && (
                <button 
                  onClick={() => setFilters({ fromState: '', toState: '', minBeds: '' })} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* List View */}
          {(viewMode === 'list' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-full md:w-1/2 lg:w-2/5' : 'w-full'} overflow-y-auto p-4 bg-gray-50`} style={{ maxHeight: 'calc(100vh - 180px)' }}>
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading listings...</div>
              ) : listings.length > 0 ? (
                <div className={`grid ${viewMode === 'list' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                  {listings.map((listing) => (
                    <div key={listing.id} onClick={() => setSelectedListing(listing)}>
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-1">No listings found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}

          {/* Map View */}
          {(viewMode === 'map' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'hidden md:block md:w-1/2 lg:w-3/5' : 'w-full'} bg-gray-200`} style={{ minHeight: 'calc(100vh - 180px)' }}>
              <MapView listings={listings} onMarkerClick={setSelectedListing} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

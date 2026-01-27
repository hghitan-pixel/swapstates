'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Search, Menu, X, Bed, Bath, Square, MapPin, SlidersHorizontal, Map, List } from 'lucide-react'
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
            <Link href="/list" className="block bg-white text-blue-800 text-center py-2 rounded-lg font-semibold mt-2">List Your Home</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function ListingCard({ listing, isSelected, isHovered, onClick, onHover, onLeave }) {
  const image = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop'
  return (
    <div 
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border-2 ${isSelected ? 'border-blue-500' : isHovered ? 'border-blue-300' : 'border-transparent'}`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
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

async function geocodeAddress(address, city, state, zip) {
  const query = encodeURIComponent(`${address}, ${city}, ${state} ${zip}, USA`)
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: { 'User-Agent': 'SwapStates/1.0' }
    })
    const data = await response.json()
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch (error) {
    console.error('Geocoding error:', error)
  }
  return null
}

function MapView({ listings, selectedListing, hoveredListing, onMarkerClick }) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [markers, setMarkers] = useState({})
  const [geocodedListings, setGeocodedListings] = useState([])
  const hoverMarkerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

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
    async function geocodeListings() {
      const supabase = createClient()
      const updated = []

      for (const listing of listings) {
        if (listing.latitude && listing.longitude) {
          updated.push({ ...listing, lat: listing.latitude, lng: listing.longitude })
        } else if (listing.current_address && listing.current_city) {
          const coords = await geocodeAddress(
            listing.current_address,
            listing.current_city,
            listing.current_state,
            listing.current_zip
          )
          if (coords) {
            updated.push({ ...listing, lat: coords.lat, lng: coords.lng })
            if (supabase) {
              await supabase
                .from('listings')
                .update({ latitude: coords.lat, longitude: coords.lng })
                .eq('id', listing.id)
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
      setGeocodedListings(updated)
    }

    if (listings.length > 0) {
      geocodeListings()
    }
  }, [listings])

  useEffect(() => {
    if (!mapLoaded || !window.L) return

    const container = document.getElementById('map')
    if (!container) return

    if (container._leaflet_id) {
      container._leaflet_id = null
      container.innerHTML = ''
    }

    const map = window.L.map('map', {
      center: [39.8283, -98.5795],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18
    })

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO'
    }).addTo(map)

    setMapInstance(map)

    return () => {
      map.remove()
    }
  }, [mapLoaded])

  useEffect(() => {
    if (!mapInstance || !window.L || geocodedListings.length === 0) return

    Object.values(markers).forEach(m => m.remove())

    const newMarkers = {}
    const bounds = []

    geocodedListings.forEach(listing => {
      if (!listing.lat || !listing.lng) return

      bounds.push([listing.lat, listing.lng])

      const isSelected = selectedListing?.id === listing.id
      const isHovered = hoveredListing?.id === listing.id

      const priceLabel = window.L.divIcon({
        className: 'price-marker',
        html: `<div style="
          background: ${isSelected || isHovered ? '#1d4ed8' : '#2563eb'};
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
          transform: scale(${isSelected || isHovered ? '1.2' : '1'});
          transition: transform 0.2s;
          z-index: ${isSelected || isHovered ? '1000' : '1'};
        ">$${(listing.estimated_value / 1000).toFixed(0)}K</div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      })

      const marker = window.L.marker([listing.lat, listing.lng], { icon: priceLabel }).addTo(mapInstance)

      const popupContent = `
        <div style="min-width: 220px; font-family: system-ui, sans-serif;">
          <img src="${listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=200&fit=crop'}" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">$${listing.estimated_value?.toLocaleString()}</div>
          <div style="color: #374151; font-size: 13px; margin-bottom: 4px;">${listing.current_address || ''}</div>
          <div style="color: #374151; font-size: 13px; margin-bottom: 8px;">${listing.current_city}, ${listing.current_state} ${listing.current_zip || ''}</div>
          <div style="display: flex; gap: 12px; font-size: 12px; color: #6b7280; margin-bottom: 8px;">
            <span>${listing.beds} bed</span>
            <span>${listing.baths} bath</span>
            <span>${listing.sqft?.toLocaleString()} sqft</span>
          </div>
          <div style="background: #ecfdf5; color: #059669; padding: 6px 8px; border-radius: 6px; font-size: 12px; margin-bottom: 10px;">
            Wants to move to: <strong>${listing.desired_state}</strong>
          </div>
          <a href="/listing/${listing.id}" style="
            display: block;
            background: #2563eb;
            color: white;
            text-align: center;
            padding: 10px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
          ">View Details</a>
        </div>
      `
      marker.bindPopup(popupContent, { maxWidth: 250 })

      marker.on('click', () => {
        onMarkerClick(listing)
      })

      newMarkers[listing.id] = marker
    })

    setMarkers(newMarkers)

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        mapInstance.setView(bounds[0], 12)
      } else {
        mapInstance.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [mapInstance, geocodedListings, selectedListing, hoveredListing])

  // Handle hover pin marker
  useEffect(() => {
    if (!mapInstance || !window.L) return

    // Remove existing hover marker
    if (hoverMarkerRef.current) {
      hoverMarkerRef.current.remove()
      hoverMarkerRef.current = null
    }

    // Find hovered listing in geocoded listings
    if (hoveredListing) {
      const listing = geocodedListings.find(l => l.id === hoveredListing.id)
      if (listing && listing.lat && listing.lng) {
        // Create pulsing pin marker
        const pulsingIcon = window.L.divIcon({
          className: 'pulsing-marker',
          html: `
            <div style="position: relative;">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                background: rgba(37, 99, 235, 0.3);
                border-radius: 50%;
                animation: pulse 1s ease-out infinite;
              "></div>
              <div style="
                position: relative;
                width: 24px;
                height: 24px;
                background: #2563eb;
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(45deg);
                  width: 8px;
                  height: 8px;
                  background: white;
                  border-radius: 50%;
                "></div>
              </div>
            </div>
            <style>
              @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
              }
            </style>
          `,
          iconSize: [40, 40],
          iconAnchor: [12, 24]
        })

        hoverMarkerRef.current = window.L.marker([listing.lat, listing.lng], { 
          icon: pulsingIcon,
          zIndexOffset: 1000 
        }).addTo(mapInstance)

        // Pan to the marker smoothly
        mapInstance.panTo([listing.lat, listing.lng], { animate: true, duration: 0.3 })
      }
    }
  }, [hoveredListing, mapInstance, geocodedListings])

  useEffect(() => {
    if (!mapInstance || !selectedListing) return
    const listing = geocodedListings.find(l => l.id === selectedListing.id)
    if (listing && listing.lat && listing.lng) {
      mapInstance.setView([listing.lat, listing.lng], 14, { animate: true })
      if (markers[listing.id]) {
        markers[listing.id].openPopup()
      }
    }
  }, [selectedListing, mapInstance, geocodedListings, markers])

  return (
    <div id="map" className="w-full h-full" style={{ minHeight: '100%' }}></div>
  )
}

export default function BrowsePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('split')
  const [filters, setFilters] = useState({ fromState: '', toState: '', minBeds: '' })
  const [selectedListing, setSelectedListing] = useState(null)
  const [hoveredListing, setHoveredListing] = useState(null)

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
    <div className="h-screen flex flex-col">
      <Navigation />

      <div className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">Browse Swap Opportunities</h1>
              <p className="text-sm text-gray-500">{loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}</p>
            </div>

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

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              className="border rounded-lg px-3 py-1.5 text-sm"
              value={filters.fromState}
              onChange={(e) => setFilters({ ...filters, fromState: e.target.value })}
            >
              <option value="">Any Location</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="border rounded-lg px-3 py-1.5 text-sm"
              value={filters.toState}
              onChange={(e) => setFilters({ ...filters, toState: e.target.value })}
            >
              <option value="">Any Destination</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="border rounded-lg px-3 py-1.5 text-sm"
              value={filters.minBeds}
              onChange={(e) => setFilters({ ...filters, minBeds: e.target.value })}
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

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'list' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-2/5 lg:w-1/3' : 'w-full'} overflow-y-auto p-4 bg-gray-50`}>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading listings...</div>
            ) : listings.length > 0 ? (
              <div className={`grid ${viewMode === 'list' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isSelected={selectedListing?.id === listing.id}
                    isHovered={hoveredListing?.id === listing.id}
                    onClick={() => setSelectedListing(listing)}
                    onHover={() => setHoveredListing(listing)}
                    onLeave={() => setHoveredListing(null)}
                  />
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

        {(viewMode === 'map' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'hidden md:block md:w-3/5 lg:w-2/3' : 'w-full'}`}>
            <MapView
              listings={listings}
              selectedListing={selectedListing}
              hoveredListing={hoveredListing}
              onMarkerClick={setSelectedListing}
            />
          </div>
        )}
      </div>
    </div>
  )
}

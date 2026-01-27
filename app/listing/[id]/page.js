'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Bed, Bath, Square, MapPin, Calendar, ArrowLeft, Home, Mail } from 'lucide-react'
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

export default function ListingPage() {
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      const supabase = createClient()
      if (!supabase || !params.id) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('listings')
        .select('*, images:listing_images(*)')
        .eq('id', params.id)
        .single()

      if (data) setListing(data)
      setLoading(false)
    }
    fetchListing()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading listing...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
            <p className="text-gray-600 mb-6">This listing may have been removed.</p>
            <Link href="/browse" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Browse All Listings</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const image = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop'

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/browse" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Browse
          </Link>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="relative h-64 md:h-96">
              <img src={image} alt="Property" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Active</div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.current_city}, {listing.current_state}</h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.current_address || 'Address available upon request'}, {listing.current_zip}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${listing.estimated_value?.toLocaleString()}</div>
                  <div className="text-gray-500 text-sm">Estimated Value</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Currently in</div>
                    <div className="font-bold text-lg">{listing.current_state}</div>
                  </div>
                  <ArrowLeftRight className="w-8 h-8 text-blue-600" />
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Wants to move to</div>
                    <div className="font-bold text-lg text-blue-600">{listing.desired_state}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold">{listing.beds}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold">{listing.baths}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold">{listing.sqft?.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold">{listing.year_built || 'N/A'}</div>
                  <div className="text-sm text-gray-500">Year Built</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Property Details</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between"><span>Property Type</span><span className="font-medium text-gray-900">{listing.property_type}</span></div>
                    <div className="flex justify-between"><span>Monthly HOA</span><span className="font-medium text-gray-900">${listing.hoa_monthly || 0}</span></div>
                  </div>
                </div>
                {listing.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-gray-600">{listing.description}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
                <Link href={`/edit/${params.id}`} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                  Edit Listing
                </Link>
                <button onClick={() => setShowContact(!showContact)} className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  {showContact ? 'Hide Contact Info' : 'Contact Homeowner'}
                </button>
              </div>

              {showContact && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-gray-700">To contact this homeowner, please <Link href="/list" className="text-blue-600 font-semibold hover:underline">list your home first</Link>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

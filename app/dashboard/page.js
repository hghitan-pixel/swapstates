'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Home, Plus, Edit, Trash2, Loader2, LogOut, User, MapPin, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function Navigation({ user, onLogout }) {
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
            <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
            <div className="flex items-center gap-3">
              <span className="text-blue-200 text-sm">{user?.email}</span>
              <button onClick={onLogout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            <Link href="/" className="block py-2">Home</Link>
            <Link href="/browse" className="block py-2">Browse</Link>
            <Link href="/dashboard" className="block py-2">Dashboard</Link>
            <div className="pt-2 border-t border-white/20">
              <p className="text-blue-200 text-sm py-2">{user?.email}</p>
              <button onClick={onLogout} className="w-full bg-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-1">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const supabase = createClient()
    if (!supabase) {
      router.push('/login')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)
    fetchListings(user.id)
  }

  async function fetchListings(userId) {
    const supabase = createClient()
    if (!supabase) return

    const { data } = await supabase
      .from('listings')
      .select('*, images:listing_images(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setListings(data || [])
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  async function handleDelete(listingId) {
    if (!confirm('Are you sure you want to delete this listing?')) return
    
    setDeleting(listingId)
    const supabase = createClient()
    if (!supabase) return

    await supabase.from('listings').delete().eq('id', listingId)
    setListings(listings.filter(l => l.id !== listingId))
    setDeleting(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation user={user} onLogout={handleLogout} />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
              <p className="text-gray-600">Manage your home listings</p>
            </div>
            <Link href="/list" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-5 h-5" /> New Listing
            </Link>
          </div>

          {/* Listings */}
          {listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => {
                const image = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop'
                return (
                  <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                      <img src={image} alt="Property" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.current_city}, {listing.current_state}</h3>
                          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {listing.current_address}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {listing.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>${listing.estimated_value?.toLocaleString()}</span>
                        <span>{listing.beds} bed</span>
                        <span>{listing.baths} bath</span>
                        <span>{listing.sqft?.toLocaleString()} sqft</span>
                      </div>
                      
                      <div className="text-sm text-blue-600 mt-2">
                        Wants to move to: <span className="font-medium">{listing.desired_state}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Link href={`/listing/${listing.id}`} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                          <Eye className="w-4 h-4" /> View
                        </Link>
                        <Link href={`/edit/${listing.id}`} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                          <Edit className="w-4 h-4" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={deleting === listing.id}
                          className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-1 disabled:opacity-50"
                        >
                          {deleting === listing.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
              <p className="text-gray-500 mb-6">Create your first listing to start finding swap matches.</p>
              <Link href="/list" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 inline-flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create Listing
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

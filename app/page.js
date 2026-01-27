'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Home, Search, Check, ArrowRight, Menu, X, Bed, Bath, Square, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// Navigation Component
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

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-2 text-white mb-4">
          <ArrowLeftRight className="w-6 h-6" />
          <span className="text-xl font-bold">SwapStates</span>
        </div>
        <p className="text-center text-sm">Making cross-state relocation easier through direct home swaps.</p>
        <div className="border-t border-gray-700 mt-6 pt-6 text-sm text-center">
          © {new Date().getFullYear()} SwapStates. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// Listing Card Component
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

// Main Homepage
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

        {/* Stats Section */}
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
              t-bold text-blue-800">$45K</div><div className="text-gray-600">Avg. Saved</div></div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How SwapStates Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Home, title: '1. List Your Home', desc: "Add your property details and where you want to move. It's free." },
                { icon: Search, title: '2. Find Matches', desc: 'Our algorithm finds homeowners who want to swap in the opposite direction.' },
                { icon: ArrowLeftRight, title: '3. Swap & Move', desc: 'Connect, negotiate, and complete your swap with our guided process.' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Featured Swap Opportunities</h2>
            
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

        {/* Why Swap */}
        <section className="py-12 bg-blue-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Swap Instead of Sell?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Skip the Slow Market', desc: 'No waiting months for a buyer' },
                { title: 'Save on Commissions', desc: 'Potential to save 5-6% in agent fees' },
                { title: 'Synchronized Timing', desc: 'Move in when they move out' },
                { title: 'No Bridge Loans', desc: 'Avoid carrying two mortgages' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-white p-4 rounded-xl">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Swap Your Way to a New Home?</h2>
            <p className="text-lg text-blue-100 mb-6">Join homeowners who've discovered a smarter way to relocate.</p>
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

 'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Home, DollarSign, Clock, Users, ArrowRight, UserCheck } from 'lucide-react'

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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-bg text-white py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Who We Are</h1>
            <p className="text-lg md:text-xl text-blue-100">Connecting homeowners who want to trade places</p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            
            <div className="text-gray-700 space-y-4 text-lg leading-relaxed">
              <p>
                Hi, I'm Mr. H. I started SwapStates while going through the process of relocating from Indiana to Arizona.
              </p>
              
              <p>
                During that experience, I noticed something interesting. While I was looking to move to Arizona, there were people in Arizona looking to move to places like Indiana. We were essentially looking in opposite directions.
              </p>

              <p>
                That got me thinking. What if homeowners could connect directly with each other? Instead of both parties going through the traditional listing process separately, why not create a space where people could find others heading in the opposite direction?
              </p>

              <p>
                That simple idea became SwapStates. It is a platform where homeowners can list their homes, share where they would like to move, and connect with others who might be a good match.
              </p>
              
              <p>
                It is a straightforward concept. We bring people together who might benefit from knowing each other exist.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Diagram */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How SwapStates Works</h2>
            
            {/* Diagram */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
              
              {/* Traditional Way */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-500 mb-4 text-center">Traditional Way</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 text-center w-full md:w-48">
                    <Home className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="font-semibold">Your Home</p>
                    <p className="text-sm text-gray-600">Indiana</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-2xl">→</span>
                    <span className="text-xs">List with agent</span>
                  </div>
                  
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 text-center w-full md:w-48">
                    <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="font-semibold">Wait for Buyer</p>
                    <p className="text-sm text-gray-600">3 to 12 months</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-gray-400">
                    <span className="text-2xl">→</span>
                    <span className="text-xs">Pay commission</span>
                  </div>
                  
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4 text-center w-full md:w-48">
                    <DollarSign className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="font-semibold">Then Buy</p>
                    <p className="text-sm text-gray-600">Start over in AZ</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 font-medium">vs</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* SwapStates Way */}
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-4 text-center">The SwapStates Way</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-4 text-center w-full md:w-52">
                    <Home className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">You in Indiana</p>
                    <p className="text-sm text-gray-600">Want to move to Arizona</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="bg-green-500 text-white rounded-full p-3">
                      <ArrowLeftRight className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-semibold text-green-600 mt-2">Direct Match</span>
                  </div>
                  
                  <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center w-full md:w-52">
                    <Home className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold">Someone in Arizona</p>
                    <p className="text-sm text-gray-600">Wants to move to Indiana</p>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-gray-600">Connect directly. Explore the possibility. Move forward together.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* After the Connection */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">After You Connect</h2>
            
            <p className="text-gray-700 text-lg text-center mb-8 max-w-2xl mx-auto">
              Once two homeowners find each other on SwapStates, you have options for how to move forward with the transaction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Involve a Real Estate Agent</h3>
                <p className="text-gray-600">
                  After making the connection, you can bring in a real estate agent to handle the paperwork, negotiations, and closing process. The agent helps finalize the transaction while you already have your match lined up.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Complete It Yourselves</h3>
                <p className="text-gray-600">
                  If both parties prefer, you can work directly with real estate attorneys and title companies to complete the transaction on your own. This gives you more control over the process and timeline.
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 text-center mt-8">
              Either way, SwapStates helps you skip the hardest part: finding someone who wants what you have and has what you want.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What SwapStates Offers</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Direct Connections</h3>
                <p className="text-gray-600">A space for homeowners to find and connect with others who are moving in the opposite direction.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Simple Listings</h3>
                <p className="text-gray-600">Share your home details and where you would like to move. Browse others doing the same.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Your Timeline</h3>
                <p className="text-gray-600">No pressure. Explore at your own pace and reach out when you find someone interesting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Interested in Seeing Who is Out There?</h2>
            <p className="text-lg text-blue-100 mb-6">
              Browse current listings or add your own. It is free, and you might find exactly who you are looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/list" className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 inline-flex items-center justify-center gap-2">
                List Your Home <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/browse" className="border-2 border-white px-8 py-4 rounded-xl font-bold hover:bg-white/10">
                Browse Listings
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

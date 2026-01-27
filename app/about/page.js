'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Home, Users, ArrowRight, UserCheck, Clock, FileText, ChevronDown } from 'lucide-react'

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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-bg text-white py-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Who We Are</h1>
            <p className="text-lg text-blue-100">Connecting homeowners who want to trade places</p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-10 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p>
                Hi, I'm Mr. H. I started SwapStates while going through the process of relocating to another state. During that experience, I noticed something interesting. While I was looking to move to a new state, there were people in that state looking to move to where I lived. We were essentially looking in opposite directions.
              </p>

              <p>
                That got me thinking. What if homeowners could connect directly with each other? Instead of both parties going through the traditional listing process separately, why not create a space where people could find others heading in the opposite direction?
              </p>
              
              <p>
                That simple idea became SwapStates. It is a platform where homeowners can list their homes, share where they would like to move, and connect with others who might be a good match.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Diagram - Compact */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6">How SwapStates Works</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              
              {/* Row 1: Two Homeowners + Match */}
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center flex-1">
                  <div className="w-14 h-14 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2 bg-gray-50">
                    <Home className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">Homeowner A</p>
                  <p className="text-xs text-gray-500">State X → State Y</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="w-14 h-14 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2 bg-gray-50">
                    <Home className="w-6 h-6 text-gray-600" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">Homeowner B</p>
                  <p className="text-xs text-gray-500">State Y → State X</p>
                </div>
              </div>
              
              {/* Arrow Down */}
              <div className="flex justify-center my-4">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Row 2: Connection */}
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Direct Connection Made</span>
                </span>
              </div>
              
              {/* Arrow Down */}
              <div className="flex justify-center mb-4">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Row 3: Two Options */}
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 border border-gray-200 rounded-lg p-3 text-center max-w-[140px]">
                  <UserCheck className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-800">With Agent</p>
                </div>
                
                <span className="text-gray-400 text-sm">or</span>
                
                <div className="flex-1 border border-gray-200 rounded-lg p-3 text-center max-w-[140px]">
                  <FileText className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-800">DIY with Attorney</p>
                </div>
              </div>
              
              {/* Arrow Down */}
              <div className="flex justify-center my-4">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
              
              {/* Row 4: Result */}
              <div className="text-center">
                <span className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm">
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Both Relocate</span>
                </span>
              </div>
              
            </div>
          </div>
        </section>

        {/* After the Connection */}
        <section className="py-10 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6">After You Connect</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <UserCheck className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-semibold mb-2">Involve a Real Estate Agent</h3>
                <p className="text-gray-600 text-sm">
                  Bring in an agent to handle paperwork, negotiations, and closing. You already have your match lined up.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-semibold mb-2">Complete It Yourselves</h3>
                <p className="text-gray-600 text-sm">
                  Work directly with real estate attorneys and title companies. More control over process and timeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-10 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6">What SwapStates Offers</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold mb-1">Direct Connections</h3>
                <p className="text-gray-600 text-sm">Find homeowners moving in the opposite direction.</p>
              </div>
              
              <div className="text-center p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold mb-1">Simple Listings</h3>
                <p className="text-gray-600 text-sm">Share your home and where you want to move.</p>
              </div>
              
              <div className="text-center p-5 bg-white rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="font-semibold mb-1">Your Timeline</h3>
                <p className="text-gray-600 text-sm">No pressure. Explore at your own pace.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-3">Interested in Seeing Who is Out There?</h2>
            <p className="text-blue-100 mb-5">
              Browse current listings or add your own. It is free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/list" className="bg-white text-blue-800 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 inline-flex items-center justify-center gap-2">
                List Your Home <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/browse" className="border-2 border-white px-6 py-3 rounded-xl font-bold hover:bg-white/10">
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

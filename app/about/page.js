'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Home, DollarSign, Clock, Users, Heart, ArrowRight } from 'lucide-react'

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
            <p className="text-lg md:text-xl text-blue-100">A platform born from real frustration with the traditional home selling process</p>
          </div>
        </section>

        {/* My Story */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">My Story</h2>
            </div>
            
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                Hi, I'm Hussein, the founder of SwapStates. This platform exists because of my own painful experience trying to relocate from <strong>Indiana to Arizona</strong>.
              </p>
              
              <p>
                Like many homeowners, I dreamed of a change—sunshine, new opportunities, a fresh start in Arizona. What I didn't dream of was the nightmare that followed when I tried to sell my home.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 my-6">
                <p className="font-semibold text-orange-800">It's been over a year now.</p>
                <p className="text-orange-700">A full year of waiting, hoping, and watching my plans stay frozen while the traditional real estate system moved at its own glacial pace. And guess what? I'm still here in Indiana, still wanting to move.</p>
              </div>

              <p>
                The traditional process is broken. Here's what I experienced:
              </p>

              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Months of waiting</strong> for the right buyer to come along</li>
                <li><strong>Endless showings</strong> that disrupted my daily life</li>
                <li><strong>Agent commissions</strong> that would eat up 5-6% of my home's value—tens of thousands of dollars</li>
                <li><strong>The timing problem</strong>—how do you buy a new home when your current one hasn't sold?</li>
                <li><strong>Bridge loans and double mortgages</strong>—expensive band-aids for a broken system</li>
              </ul>

              <p>
                One night, frustrated after another month with no serious offers, I thought: <em>"There has to be someone in Arizona who wants to move to Indiana. Why can't we just... swap?"</em>
              </p>

              <p>
                That simple question became <strong>SwapStates</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* The Problem We're Solving */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">The Problem With Traditional Home Selling</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Painfully Slow</h3>
                <p className="text-gray-600">Average home sits on market for 3-6 months. Meanwhile, your life is on hold and your dream home might sell to someone else.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Expensive Commissions</h3>
                <p className="text-gray-600">Real estate agents take 5-6% of your sale. On a $400,000 home, that's $24,000 gone—before you've even moved.</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Timing Nightmare</h3>
                <p className="text-gray-600">Sell first and be homeless? Buy first and carry two mortgages? There's no good option in the traditional system.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Solution: Direct Home Swaps</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8 mb-8">
              <p className="text-lg text-center text-blue-900">
                SwapStates opens a <strong>direct channel between homeowners</strong> across states—or even within the same state—who want to trade places.
              </p>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                Think about it: Right now, someone in Arizona is sitting in their home, dreaming of moving to Indiana. They're dealing with the same frustrations you are. The same slow market. The same agent fees.
              </p>
              
              <p>
                <strong>What if you could find each other?</strong>
              </p>
              
              <p>
                That's exactly what SwapStates does. We connect homeowners who want to swap locations, cutting out the middlemen and creating a direct path to your new life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">No Waiting for Buyers</h4>
                  <p className="text-gray-600 text-sm">Your swap partner IS your buyer, and you're theirs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">Save on Commissions</h4>
                  <p className="text-gray-600 text-sm">Direct connection means potential to save thousands.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">Perfect Timing</h4>
                  <p className="text-gray-600 text-sm">You move out when they move out. No gap, no overlap.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">Motivated Partners</h4>
                  <p className="text-gray-600 text-sm">Both parties want the deal to work. Aligned incentives.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              To empower homeowners to take control of their relocation journey. No more waiting on a broken system. No more paying massive fees just to move to a new place. 
            </p>
            <p className="text-lg text-gray-700">
              Whether you're moving across the country or across your state, SwapStates gives you a direct line to someone who might be your perfect swap partner.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Swap?</h2>
            <p className="text-lg text-blue-100 mb-6">
              Join me and other homeowners who are tired of waiting. List your home for free and let's find your match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/list" className="bg-white text-blue-800 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 inline-flex items-center justify-center gap-2">
                List Your Home Free <ArrowRight className="w-5 h-5" />
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

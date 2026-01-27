'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Home, MapPin, Upload, Loader2, Image, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
const PROPERTY_TYPES = ['Single Family', 'Townhouse', 'Condo', 'Multi-Family']

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
            <Link href="/list" className="bg-white text-blue-800 px-4 py-2 rounded-lg font-semibold">List Your Home</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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

export default function ListPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  
  const [form, setForm] = useState({
    current_address: '', current_city: '', current_state: 'Indiana', current_zip: '',
    property_type: 'Single Family', beds: '', baths: '', sqft: '', year_built: '',
    estimated_value: '', hoa_monthly: '0', description: '',
    desired_city: '', desired_state: 'Arizona',
    contact_name: '', contact_email: '', contact_phone: ''
  })

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    if (photos.length + files.length > 10) {
      setError('Maximum 10 photos allowed')
      return
    }

    setUploading(true)
    setError('')

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each photo must be under 5MB')
        continue
      }

      const preview = URL.createObjectURL(file)
      setPhotos(prev => [...prev, { file, preview, uploaded: false }])
    }
    
    setUploading(false)
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    const supabase = createClient()
    if (!supabase) {
      setError('Database connection not available')
      setLoading(false)
      return
    }

    // Create listing first
    const { data: listing, error: insertError } = await supabase.from('listings').insert({
      user_id: null,
      status: 'active',
      current_address: form.current_address,
      current_city: form.current_city,
      current_state: form.current_state,
      current_zip: form.current_zip,
      property_type: form.property_type,
      beds: parseInt(form.beds) || 0,
      baths: parseFloat(form.baths) || 0,
      sqft: parseInt(form.sqft) || 0,
      year_built: parseInt(form.year_built) || null,
      estimated_value: parseInt(form.estimated_value.replace(/[^0-9]/g, '')) || 0,
      hoa_monthly: parseInt(form.hoa_monthly) || 0,
      description: form.description,
      desired_city: form.desired_city,
      desired_state: form.desired_state,
      amenities: []
    }).select().single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    // Upload photos
    if (photos.length > 0 && listing) {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        const fileExt = photo.file.name.split('.').pop()
        const fileName = `${listing.id}/${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, photo.file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)

        await supabase.from('listing_images').insert({
          listing_id: listing.id,
          url: publicUrl,
          is_primary: i === 0,
          sort_order: i
        })
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Listing Created!</h1>
            <p className="text-gray-600 mb-6">Your home is now visible to potential swap partners.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/browse" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">Browse Matches</Link>
              <Link href="/" className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50">Go Home</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">List Your Home for Swap</h1>
        <p className="text-gray-600 mb-6">Tell us about your property and where you want to move</p>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{s}</div>
              {s < 4 && <div className={`w-8 h-1 mx-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">{error}</div>}

          {/* Step 1: Property Details */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Home className="w-5 h-5" />Your Current Property</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={form.current_address} onChange={(e) => setForm({...form, current_address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={form.current_city} onChange={(e) => setForm({...form, current_city: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select className="w-full border rounded-lg px-4 py-2" value={form.current_state} onChange={(e) => setForm({...form, current_state: e.target.value})}>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={form.current_zip} onChange={(e) => setForm({...form, current_zip: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select className="w-full border rounded-lg px-4 py-2" value={form.property_type} onChange={(e) => setForm({...form, property_type: e.target.value})}>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" value={form.beds} onChange={(e) => setForm({...form, beds: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input type="number" step="0.5" className="w-full border rounded-lg px-4 py-2" value={form.baths} onChange={(e) => setForm({...form, baths: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" value={form.sqft} onChange={(e) => setForm({...form, sqft: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" value={form.year_built} onChange={(e) => setForm({...form, year_built: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="$375,000" value={form.estimated_value} onChange={(e) => setForm({...form, estimated_value: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly HOA</label>
                  <input type="number" className="w-full border rounded-lg px-4 py-2" value={form.hoa_monthly} onChange={(e) => setForm({...form, hoa_monthly: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full border rounded-lg px-4 py-2 h-24" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Next</button>
              </div>
            </div>
          )}

          {/* Step 2: Desired Location */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><MapPin className="w-5 h-5" />Where Do You Want to Move?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired State</label>
                  <select className="w-full border rounded-lg px-4 py-2" value={form.desired_state} onChange={(e) => setForm({...form, desired_state: e.target.value})}>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City (Optional)</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={form.desired_city} onChange={(e) => setForm({...form, desired_city: e.target.value})} />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-800">← Back</button>
                <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Next</button>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><Image className="w-5 h-5" />Add Photos</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500">Up to 10 photos, max 5MB each</p>
                </label>
              </div>

              {uploading && <p className="text-blue-600 text-center mb-4">Processing...</p>}

              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img src={photo.preview} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      {index === 0 && <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Primary</span>}
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mb-4">{photos.length}/10 photos added</p>

              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(2)} className="text-gray-600 hover:text-gray-800">← Back</button>
                <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Next</button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Your Contact Info</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" value={form.contact_name} onChange={(e) => setForm({...form, contact_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full border rounded-lg px-4 py-2" value={form.contact_email} onChange={(e) => setForm({...form, contact_email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full border rounded-lg px-4 py-2" value={form.contact_phone} onChange={(e) => setForm({...form, contact_phone: e.target.value})} />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button onClick={() => setStep(3)} className="text-gray-600 hover:text-gray-800">← Back</button>
                <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Creating...</> : 'Publish Listing'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftRight, Menu, X, Home, MapPin, Upload, Loader2, Trash2, ArrowLeft, User, Save, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
const PROPERTY_TYPES = ['Single Family', 'Townhouse', 'Condo', 'Multi-Family']

function Navigation({ user }) {
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
            {user ? (
              <Link href="/dashboard" className="hover:text-blue-200 flex items-center gap-1">
                <User className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <Link href="/login" className="hover:text-blue-200 flex items-center gap-1">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}
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
            {user ? (
              <Link href="/dashboard" className="block py-2">Dashboard</Link>
            ) : (
              <Link href="/login" className="block py-2">Sign In / Sign Up</Link>
            )}
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

export default function EditListingPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingPhotos, setExistingPhotos] = useState([])
  const [newPhotos, setNewPhotos] = useState([])
  const [deletingPhoto, setDeletingPhoto] = useState(null)
  const [settingPrimary, setSettingPrimary] = useState(null)
  
  const [form, setForm] = useState({
    current_address: '',
    current_city: '',
    current_state: '',
    current_zip: '',
    property_type: 'Single Family',
    beds: '',
    baths: '',
    sqft: '',
    year_built: '',
    estimated_value: '',
    hoa_monthly: '0',
    description: '',
    desired_city: '',
    desired_state: ''
  })

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      if (!supabase || !params.id) {
        setError('Unable to connect to database')
        setLoading(false)
        return
      }

      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)

      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('*, images:listing_images(*)')
        .eq('id', params.id)
        .maybeSingle()

      if (listingError) {
        setError('Error fetching listing: ' + listingError.message)
        setLoading(false)
        return
      }

      if (!listingData) {
        setError('Listing not found')
        setLoading(false)
        return
      }

      if (listingData.user_id !== currentUser.id) {
        setError('You do not have permission to edit this listing')
        setLoading(false)
        return
      }

      setListing(listingData)
      setForm({
        current_address: listingData.current_address || '',
        current_city: listingData.current_city || '',
        current_state: listingData.current_state || '',
        current_zip: listingData.current_zip || '',
        property_type: listingData.property_type || 'Single Family',
        beds: listingData.beds?.toString() || '',
        baths: listingData.baths?.toString() || '',
        sqft: listingData.sqft?.toString() || '',
        year_built: listingData.year_built?.toString() || '',
        estimated_value: listingData.estimated_value?.toString() || '',
        hoa_monthly: listingData.hoa_monthly?.toString() || '0',
        description: listingData.description || '',
        desired_city: listingData.desired_city || '',
        desired_state: listingData.desired_state || ''
      })
      
      // Sort photos: primary first, then by sort_order
      const sortedPhotos = (listingData.images || []).sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return a.sort_order - b.sort_order
      })
      setExistingPhotos(sortedPhotos)
      setLoading(false)
    }

    fetchData()
  }, [params.id, router])

  function handlePhotoUpload(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    if (existingPhotos.length + newPhotos.length + files.length > 20) {
      setError('Maximum 20 photos allowed')
      return
    }

    setError('')
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each photo must be under 5MB')
        continue
      }
      const preview = URL.createObjectURL(file)
      setNewPhotos(prev => [...prev, { file, preview }])
    }
  }

  async function handleDeleteExistingPhoto(photo) {
    if (photo.is_primary && existingPhotos.length > 1) {
      setError('Please set another photo as primary before deleting this one')
      return
    }
    
    setDeletingPhoto(photo.id)
    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase
      .from('listing_images')
      .delete()
      .eq('id', photo.id)

    if (error) {
      setError('Failed to delete photo: ' + error.message)
      setDeletingPhoto(null)
      return
    }

    setExistingPhotos(prev => prev.filter(p => p.id !== photo.id))
    setDeletingPhoto(null)
  }

  async function handleSetPrimary(photo) {
    setSettingPrimary(photo.id)
    const supabase = createClient()
    if (!supabase) return

    // First, set all photos to non-primary
    await supabase
      .from('listing_images')
      .update({ is_primary: false })
      .eq('listing_id', params.id)

    // Then set the selected photo as primary
    const { error } = await supabase
      .from('listing_images')
      .update({ is_primary: true, sort_order: 0 })
      .eq('id', photo.id)

    if (error) {
      setError('Failed to set primary photo: ' + error.message)
      setSettingPrimary(null)
      return
    }

    // Update local state
    setExistingPhotos(prev => {
      const updated = prev.map(p => ({
        ...p,
        is_primary: p.id === photo.id
      }))
      // Sort: primary first
      return updated.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return a.sort_order - b.sort_order
      })
    })
    
    setSettingPrimary(null)
  }

  function handleRemoveNewPhoto(index) {
    setNewPhotos(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    const supabase = createClient()
    if (!supabase || !user) {
      setError('You must be logged in to edit this listing')
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase
      .from('listings')
      .update({
        current_address: form.current_address,
        current_city: form.current_city,
        current_state: form.current_state,
        current_zip: form.current_zip,
        property_type: form.property_type,
        beds: parseInt(form.beds) || 0,
        baths: parseFloat(form.baths) || 0,
        sqft: parseInt(form.sqft) || 0,
        year_built: parseInt(form.year_built) || null,
        estimated_value: parseInt(form.estimated_value.toString().replace(/[^0-9]/g, '')) || 0,
        hoa_monthly: parseInt(form.hoa_monthly) || 0,
        description: form.description,
        desired_city: form.desired_city,
        desired_state: form.desired_state,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) {
      setError('Failed to update listing: ' + updateError.message)
      setSaving(false)
      return
    }

    // Upload new photos
    if (newPhotos.length > 0) {
      const currentCount = existingPhotos.length
      
      for (let i = 0; i < newPhotos.length; i++) {
        const photo = newPhotos[i]
        const fileExt = photo.file.name.split('.').pop()
        const fileName = `${params.id}/${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, photo.file)

        if (uploadError) {
          console.error('Photo upload error:', uploadError)
          continue
        }

        const { data: urlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(fileName)

        const { error: dbError } = await supabase.from('listing_images').insert({
          listing_id: params.id,
          url: urlData.publicUrl,
          is_primary: currentCount === 0 && i === 0,
          sort_order: currentCount + i + 1
        })

        if (dbError) {
          console.error('Database insert error:', dbError)
        }
      }
    }

    setSuccess(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation user={user} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation user={user} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Cannot Edit Listing</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">Go to Dashboard</Link>
              <Link href="/browse" className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50">Browse Listings</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation user={user} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Listing Updated!</h1>
            <p className="text-gray-600 mb-6">Your changes have been saved successfully.</p>
            <div className="flex gap-4 justify-center">
              <Link href={`/listing/${params.id}`} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">View Listing</Link>
              <Link href="/dashboard" className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50">Go to Dashboard</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation user={user} />
      
      <main className="flex-1 bg-gray-50 py-6">
        <div className="max-w-3xl mx-auto px-4">
          <Link href={`/listing/${params.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Listing
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Your Listing</h1>
          <p className="text-gray-600 mb-6">Update your property details, photos, and description</p>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">Photos</h2>
              <p className="text-sm text-gray-500 mb-4">Click the star icon to set a photo as primary. The primary photo appears first in your listing.</p>
              
              {/* Existing Photos */}
              {existingPhotos.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Photos ({existingPhotos.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPhotos.map((photo, index) => (
                      <div key={photo.id} className="relative group">
                        <img src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        
                        {/* Primary Badge */}
                        {photo.is_primary && (
                          <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Primary
                          </span>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          {/* Set Primary Button */}
                          {!photo.is_primary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(photo)}
                              disabled={settingPrimary === photo.id}
                              className="bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-600 disabled:opacity-50"
                              title="Set as primary"
                            >
                              {settingPrimary === photo.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingPhoto(photo)}
                            disabled={deletingPhoto === photo.id}
                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                            title="Delete photo"
                          >
                            {deletingPhoto === photo.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Photos */}
              {newPhotos.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">New Photos to Add ({newPhotos.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo.preview} alt={`New photo ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">New</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewPhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to add more photos</p>
                  <p className="text-sm text-gray-500">Max 20 photos total, 5MB each</p>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {existingPhotos.length + newPhotos.length}/20 photos
              </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" /> Property Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.current_address}
                    onChange={(e) => setForm({...form, current_address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.current_city}
                    onChange={(e) => setForm({...form, current_city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.current_state}
                    onChange={(e) => setForm({...form, current_state: e.target.value})}
                  >
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.current_zip}
                    onChange={(e) => setForm({...form, current_zip: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.property_type}
                    onChange={(e) => setForm({...form, property_type: e.target.value})}
                  >
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.beds}
                    onChange={(e) => setForm({...form, beds: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    step="0.5"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.baths}
                    onChange={(e) => setForm({...form, baths: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.sqft}
                    onChange={(e) => setForm({...form, sqft: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.year_built}
                    onChange={(e) => setForm({...form, year_built: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value ($)</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.estimated_value}
                    onChange={(e) => setForm({...form, estimated_value: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly HOA ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.hoa_monthly}
                    onChange={(e) => setForm({...form, hoa_monthly: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-lg px-4 py-2 h-32"
                    placeholder="Tell potential swap partners about your home, neighborhood, and what makes it special..."
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Desired Location */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Where Do You Want to Move?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Desired State</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.desired_state}
                    onChange={(e) => setForm({...form, desired_state: e.target.value})}
                  >
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred City (Optional)</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Phoenix"
                    value={form.desired_city}
                    onChange={(e) => setForm({...form, desired_city: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href={`/listing/${params.id}`}
                className="px-8 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function VisitorTracker({ listingId = null }) {
  const pathname = usePathname()

  useEffect(() => {
    async function logVisit() {
      const supabase = createClient()
      if (!supabase) return

      // Don't track if it's the same page within 5 minutes (use sessionStorage)
      const lastVisit = sessionStorage.getItem('lastVisit')
      const lastPath = sessionStorage.getItem('lastPath')
      const now = Date.now()

      if (lastPath === pathname && lastVisit && (now - parseInt(lastVisit)) < 300000) {
        return // Skip if same page visited within 5 minutes
      }

      // Log the visit
      await supabase.from('visitor_logs').insert({
        page: pathname,
        listing_id: listingId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      })

      // Update session storage
      sessionStorage.setItem('lastVisit', now.toString())
      sessionStorage.setItem('lastPath', pathname)
    }

    logVisit()
  }, [pathname, listingId])

  return null // This component doesn't render anything
}

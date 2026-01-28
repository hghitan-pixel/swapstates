'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function VisitorTracker() {
  const pathname = usePathname()

  useEffect(() => {
    async function logVisit() {
      // Don't track admin page
      if (pathname === '/admin') return

      const supabase = createClient()
      if (!supabase) return

      // Rate limit: only log once per page every 5 minutes
      const storageKey = `visit_${pathname}`
      const lastVisit = sessionStorage.getItem(storageKey)
      const now = Date.now()

      if (lastVisit && (now - parseInt(lastVisit)) < 300000) {
        return
      }

      // Log the visit (no email, just database)
      await supabase.from('visitor_logs').insert({
        page: pathname,
        listing_id: pathname.startsWith('/listing/') ? pathname.split('/')[2] : null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      })

      sessionStorage.setItem(storageKey, now.toString())
    }

    logVisit()
  }, [pathname])

  return null
}

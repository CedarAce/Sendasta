// marketing/src/lib/track.js
// Fire-and-forget analytics for the marketing site. POSTs to the same /api/log
// endpoint the Outlook add-in uses; the server infers `source` and persists to
// Supabase + Google Sheets. Never throws, never blocks the UI.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function track(action, props = {}) {
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...props }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* analytics must never break the page */
  }
}

export function usePageView() {
  const location = useLocation()
  useEffect(() => {
    track('page_view', { path: location.pathname, referrer: document.referrer || null })
  }, [location.pathname])
}

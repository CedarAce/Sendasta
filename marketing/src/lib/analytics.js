// marketing/src/lib/analytics.js
// Fetches the org's PII-free usage report from /api/admin/analytics with the
// user's Supabase JWT. Returns the parsed report or throws.
import { supabase } from './supabaseClient'

export async function fetchOrgReport(days = 30) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Please sign in again.')

  const res = await fetch(`/api/admin/analytics?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Something went wrong (HTTP ${res.status}).`)
  }
  return res.json()
}

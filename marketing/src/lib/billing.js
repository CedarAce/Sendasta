// marketing/src/lib/billing.js
// Client helpers that hit the billing endpoints (with the user's Supabase JWT)
// and redirect to the Stripe-hosted page they return.
import { supabase } from './supabaseClient'

async function postBilling(path) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Please sign in again.')

  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Something went wrong (HTTP ${res.status}).`)
  }
  const { url } = await res.json()
  if (url) window.location.href = url
}

export const startCheckout = () => postBilling('/api/billing/create-checkout-session')
export const openPortal = () => postBilling('/api/billing/create-portal-session')

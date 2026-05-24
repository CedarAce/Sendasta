import { useState } from 'react'
import { useOrg } from '../../context/OrgContext'
import { startCheckout, openPortal } from '../../lib/billing'

// Light enforcement: a banner that nudges toward payment. Never blocks the
// console. Shows for an ending trial (<=7 days), an ended trial, or past_due.
export default function TrialBanner() {
  const { trialState } = useOrg()
  const [busy, setBusy] = useState(false)
  const kind = trialState?.kind

  const show =
    kind === 'trial_ended' ||
    kind === 'past_due' ||
    (kind === 'trialing' && trialState.daysLeft <= 7)
  if (!show) return null

  const run = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      alert(e.message)
      setBusy(false)
    }
  }

  let cls, msg, cta, action
  if (kind === 'trialing') {
    cls = 'bg-blue-accent/10 border-blue-accent/30 text-navy'
    msg = `${trialState.daysLeft} day${trialState.daysLeft === 1 ? '' : 's'} left in your free trial.`
    cta = 'Add payment'
    action = startCheckout
  } else if (kind === 'trial_ended') {
    cls = 'bg-amber-50 border-amber-300 text-amber-900'
    msg = 'Your free trial has ended. Add payment to keep your team protected.'
    cta = 'Upgrade to Business'
    action = startCheckout
  } else {
    cls = 'bg-red-50 border-red-300 text-red-900'
    msg = 'Your last payment failed. Update your payment method to avoid interruption.'
    cta = 'Update payment'
    action = openPortal
  }

  return (
    <div className={`mb-6 rounded-lg border px-4 py-3 flex items-center justify-between gap-4 ${cls}`}>
      <span className="text-sm font-medium">{msg}</span>
      <button
        onClick={() => run(action)}
        disabled={busy}
        className="shrink-0 bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {busy ? '…' : cta}
      </button>
    </div>
  )
}

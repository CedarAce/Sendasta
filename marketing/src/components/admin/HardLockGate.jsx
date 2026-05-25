import { useState } from 'react'
import { useOrg } from '../../context/OrgContext'
import { startCheckout, openPortal } from '../../lib/billing'

// Full-content payment gate shown in place of the page when a trial has ended
// or a subscription was canceled. The sidebar stays visible (logout + Billing
// remain reachable) and AdminLayout always lets /admin/billing through.
export default function HardLockGate() {
  const { org, trialState } = useOrg()
  const [busy, setBusy] = useState(false)
  const kind = trialState?.kind

  const run = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      alert(e.message)
      setBusy(false)
    }
  }

  const canceled = kind === 'canceled'
  const title = canceled ? 'Your subscription was canceled' : 'Your free trial has ended'
  const body = canceled
    ? 'Reactivate your Business subscription to keep your team protected and regain access to the admin console.'
    : 'Add payment to keep your team protected. Your policies are saved — paying restores full access instantly.'
  // A canceled org already has a Stripe customer → send them to the portal to
  // reactivate; an ended trial that never paid goes straight to checkout.
  const cta = canceled && org?.stripe_customer_id ? 'Reactivate subscription' : 'Upgrade to Business'
  const action = canceled && org?.stripe_customer_id ? openPortal : startCheckout

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-md w-full p-8 text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3l9 16.5H3L12 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">{title}</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{body}</p>
        <button
          onClick={() => run(action)}
          disabled={busy}
          className="w-full bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          {busy ? '…' : cta}
        </button>
        <p className="text-xs text-gray-400 mt-3">$99/month flat for your whole team. Cancel anytime.</p>
      </div>
    </div>
  )
}

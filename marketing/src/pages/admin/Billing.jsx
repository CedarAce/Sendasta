import { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { useOrg } from '../../context/OrgContext'
import { startCheckout, openPortal } from '../../lib/billing'

export default function Billing() {
  const { org, trialState, loading, refresh } = useOrg()
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [polling, setPolling] = useState(false)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('success')) {
      setToast({ kind: 'ok', msg: 'Welcome to Sendasta Business! Your subscription is active.' })
      setPolling(true)
      refresh()
    } else if (p.get('canceled')) {
      setToast({ kind: 'info', msg: 'Checkout canceled — you can upgrade any time.' })
    }
    if (p.get('success') || p.get('canceled')) {
      window.history.replaceState({}, '', '/admin/billing')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Poll after checkout until current_period_end is populated (webhook fires async)
  useEffect(() => {
    if (!polling) return
    if (org?.current_period_end) { setPolling(false); return }
    let attempts = 0
    const id = setInterval(async () => {
      attempts++
      await refresh()
      if (attempts >= 15) { setPolling(false); clearInterval(id) }
    }, 2000)
    return () => clearInterval(id)
  }, [polling, org?.current_period_end, refresh])

  const kind = trialState?.kind
  const isPaid = kind === 'paid' || kind === 'past_due'

  const planLabel =
    kind === 'paid' ? 'Business'
    : kind === 'past_due' ? 'Business — past due'
    : kind === 'canceled' ? 'Canceled'
    : kind === 'trial_ended' ? 'Trial ended'
    : 'Trial'

  const planHint =
    kind === 'trialing' ? `${trialState.daysLeft} day${trialState.daysLeft === 1 ? '' : 's'} left`
    : kind === 'paid' ? 'active'
    : ''

  const statusValue =
    org?.current_period_end && isPaid
      ? new Date(org.current_period_end).toLocaleDateString()
      : org?.trial_ends_at && (kind === 'trialing' || kind === 'trial_ended')
      ? new Date(org.trial_ends_at).toLocaleDateString()
      : '—'

  const run = async (fn) => {
    setBusy(true)
    try {
      await fn()
    } catch (e) {
      alert(e.message)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-5xl">
      <AdminPageHeader title="Billing" subtitle="Manage your subscription and payment method." />

      {toast && (
        <div
          className={`mb-4 rounded-lg px-4 py-2.5 text-sm border ${
            toast.kind === 'ok'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-gray-50 text-gray-700 border-gray-200'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Current plan" value={loading ? '…' : planLabel} hint={planHint} />
        <Stat label="Price" value="$99/mo" hint="flat rate · billed monthly" />
        <Stat label={isPaid ? 'Renews' : 'Trial'} value={loading || polling ? '…' : statusValue} hint="" />
      </div>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-navy mb-1">Subscription</h2>
        <p className="text-sm text-gray-600 mb-5">
          {isPaid
            ? 'Your Business subscription is active. Update your payment method, view invoices, or cancel anytime.'
            : 'Upgrade to Business — $99/month flat for your whole team, billed monthly. Cancel anytime.'}
        </p>
        {isPaid ? (
          <button
            onClick={() => run(openPortal)}
            disabled={busy}
            className="bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {busy ? '…' : 'Manage subscription'}
          </button>
        ) : (
          <button
            onClick={() => run(startCheckout)}
            disabled={busy}
            className="bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {busy ? '…' : 'Upgrade to Business'}
          </button>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-navy mt-2">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{hint}</div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOrg } from '../../context/OrgContext'
import { supabase } from '../../lib/supabaseClient'
import { fetchOrgReport } from '../../lib/analytics'

export default function Dashboard() {
  const { user } = useAuth()
  const { orgId, loading: orgLoading } = useOrg()
  const fullName = user?.user_metadata?.full_name
  const firstName =
    fullName?.trim().split(/\s+/)[0] || user?.email?.split('@')[0] || 'there'

  const [stats, setStats] = useState({
    activeLicenses: null,
    rulesConfigured: null,
  })
  const [mistakes, setMistakes] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchOrgReport(30)
      .then((r) => { if (!cancelled) setMistakes(r.totals.blocks) })
      .catch(() => { if (!cancelled) setMistakes(0) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (orgLoading || !orgId) return
    let cancelled = false
    Promise.all([
      supabase
        .from('organization_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('status', 'active'),
      supabase
        .from('policies')
        .select('blocked_domains, internal_domains, no_combine_pairs, trusted_pairs')
        .eq('org_id', orgId)
        .maybeSingle(),
    ]).then(([membersRes, policyRes]) => {
      if (cancelled) return
      if (membersRes.error) {
        setError(membersRes.error.message)
        return
      }
      if (policyRes.error) {
        setError(policyRes.error.message)
        return
      }
      const p = policyRes.data
      const rules =
        (p?.blocked_domains?.length ?? 0) +
        (p?.internal_domains?.length ?? 0) +
        (p?.no_combine_pairs?.length ?? 0) +
        (p?.trusted_pairs?.length ?? 0)
      setStats({
        activeLicenses: membersRes.count ?? 0,
        rulesConfigured: rules,
      })
    })
    return () => {
      cancelled = true
    }
  }, [orgId, orgLoading])

  const display = (n) => (n == null ? '—' : String(n))

  const rulesHint =
    stats.rulesConfigured === 0
      ? 'No rules configured yet'
      : stats.rulesConfigured === 1
      ? '1 rule active'
      : `${stats.rulesConfigured} rules active`

  const showGettingStarted =
    !orgLoading && stats.rulesConfigured !== null && stats.rulesConfigured === 0

  return (
    <div className="max-w-5xl">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-navy tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">What Sendasta is doing for your team</p>
      </header>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <KpiCard
          label="Mistakes caught"
          value={mistakes == null ? '…' : String(mistakes)}
          note="last 30 days"
          highlight
        />
        <KpiCard
          label="Active seats"
          value={display(stats.activeLicenses)}
          note="members with access"
        />
        <KpiCard
          label="Rules configured"
          value={display(stats.rulesConfigured)}
          note={stats.rulesConfigured !== null ? rulesHint : 'Loading…'}
        />
      </div>

      {showGettingStarted && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-navy mb-2">Get started in 3 steps</h2>
          <ol className="text-sm text-gray-700 space-y-1.5 list-decimal pl-5">
            <li>
              Configure your <strong>Warning List</strong> and <strong>Bypass List</strong> for
              org-wide policies.
            </li>
            <li>
              Add <strong>Alert Lists</strong> to warn users when they mix sensitive domain pairs.
            </li>
            <li>
              Visit <strong>Downloads</strong> to deploy Sendasta via the Microsoft 365 admin center.
            </li>
          </ol>
        </div>
      )}

      <Link
        to="/admin/reporting"
        className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-accent/40 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy mb-1">Reporting</h2>
          <span className="text-sm text-blue-accent group-hover:underline">View →</span>
        </div>
        <p className="text-sm text-gray-500">
          See how many mistakes Sendasta caught, why emails were blocked, and the trend over time —
          with no personal data ever leaving your team's inbox.
        </p>
      </Link>
    </div>
  )
}

function KpiCard({ label, value, note, highlight }) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-1.5 ${
        highlight
          ? 'bg-navy border-navy text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${
          highlight ? 'text-white/60' : 'text-gray-500'
        }`}
      >
        {label}
      </div>
      <div
        className={`text-4xl font-extrabold tracking-tight leading-none mt-1 ${
          highlight ? 'text-white' : 'text-navy'
        }`}
      >
        {value}
      </div>
      <div className={`text-xs mt-0.5 ${highlight ? 'text-white/50' : 'text-gray-400'}`}>
        {note}
      </div>
    </div>
  )
}

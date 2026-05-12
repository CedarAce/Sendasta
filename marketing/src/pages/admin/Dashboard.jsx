import { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { useAuth } from '../../context/AuthContext'
import { useOrg } from '../../context/OrgContext'
import { supabase } from '../../lib/supabaseClient'

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
  const [error, setError] = useState(null)

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

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's a snapshot of your organization's Sendasta activity."
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat label="Active licenses" value={display(stats.activeLicenses)} hint="seats in use" />
        <Stat label="Blocked sends this month" value="—" hint="Coming soon" />
        <Stat
          label="Rules configured"
          value={display(stats.rulesConfigured)}
          hint="block + bypass + alert"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-base font-semibold text-navy mb-2">Getting started</h2>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
          <li>
            Configure your <strong>Warning List</strong> and <strong>Bypass List</strong> for
            organization-wide policies.
          </li>
          <li>
            Add <strong>Alert Lists</strong> to warn users when they mix sensitive domain pairs.
          </li>
          <li>
            Visit <strong>Downloads</strong> to deploy Sendasta to your users via Microsoft 365
            admin center.
          </li>
        </ol>
      </div>
    </div>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-3xl font-bold text-navy mt-2">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{hint}</div>
    </div>
  )
}

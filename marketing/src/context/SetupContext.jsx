import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useOrg } from './OrgContext'
import { fetchOrgReport } from '../lib/analytics'

const SetupContext = createContext({
  steps: [],
  completedCount: 0,
  total: 0,
  allDone: false,
  loading: true,
  markDeployed: async () => {},
})

// Step definitions. `done` is filled in from live data by the provider.
// `auto` steps complete from a server signal; `manual` steps are marked by the
// admin (no signal exists). `optional` steps don't have to be done for the
// checklist to count as complete.
const STEP_DEFS = [
  {
    id: 'internal_domains',
    title: 'Set your internal domains',
    description: 'Tell Sendasta which domains belong to your organization.',
    to: '/admin/policies',
    cta: 'Set domains',
    hint: '~2 min',
    kind: 'auto',
  },
  {
    id: 'rules',
    title: 'Add protection rules',
    description: 'Blocked domains, conflicting pairs, and trusted pairs.',
    to: '/admin/policies',
    cta: 'Add rules',
    optional: true,
    kind: 'auto',
  },
  {
    id: 'install',
    title: 'Install & test the add-in',
    description: 'Sideload Sendasta in your Outlook and send a test email.',
    to: '/admin/downloads',
    cta: 'Get the add-in',
    hint: 'Auto-checks on first activity',
    kind: 'auto',
  },
  {
    id: 'deploy_m365',
    title: 'Deploy to your organization (M365)',
    description: 'Push Sendasta org-wide from the Microsoft 365 Admin Center.',
    to: '/admin/downloads',
    cta: 'Deployment guide',
    kind: 'manual',
  },
  {
    id: 'invite',
    title: 'Invite your team',
    description: 'Add co-admins to the console.',
    to: '/admin/users',
    cta: 'Invite members',
    optional: true,
    kind: 'auto',
  },
]

export function SetupProvider({ children }) {
  const { orgId, loading: orgLoading } = useOrg()
  const [done, setDone] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!orgId) return
    setLoading(true)

    const [policyRes, membersRes, orgRes, report] = await Promise.all([
      supabase
        .from('policies')
        .select('internal_domains, blocked_domains, no_combine_pairs, trusted_pairs')
        .eq('org_id', orgId)
        .maybeSingle(),
      supabase
        .from('organization_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('status', 'active'),
      supabase.from('organizations').select('setup_state').eq('id', orgId).maybeSingle(),
      fetchOrgReport(90).catch(() => null),
    ])

    const p = policyRes.data || {}
    const t = report?.totals
    const hasActivity = !!t && t.scans + t.allows + t.blocks > 0
    const setupState = orgRes.data?.setup_state || {}

    setDone({
      internal_domains: (p.internal_domains?.length ?? 0) > 0,
      rules:
        (p.blocked_domains?.length ?? 0) +
          (p.no_combine_pairs?.length ?? 0) +
          (p.trusted_pairs?.length ?? 0) >
        0,
      install: hasActivity,
      deploy_m365: !!setupState.deploy_m365,
      invite: (membersRes.count ?? 0) > 1,
    })
    setLoading(false)
  }, [orgId])

  useEffect(() => {
    if (orgLoading) return
    if (!orgId) {
      setLoading(false)
      return
    }
    load()
  }, [orgId, orgLoading, load])

  const markDeployed = useCallback(
    async (value = true) => {
      if (!orgId) return
      setDone((d) => ({ ...d, deploy_m365: value }))
      const { data } = await supabase
        .from('organizations')
        .select('setup_state')
        .eq('id', orgId)
        .maybeSingle()
      const next = { ...(data?.setup_state || {}), deploy_m365: value }
      const { error } = await supabase
        .from('organizations')
        .update({ setup_state: next })
        .eq('id', orgId)
      if (error) setDone((d) => ({ ...d, deploy_m365: !value }))
    },
    [orgId]
  )

  const steps = STEP_DEFS.map((s) => ({ ...s, done: !!done[s.id] }))
  const completedCount = steps.filter((s) => s.done).length
  const allDone = steps.every((s) => s.done)

  return (
    <SetupContext.Provider
      value={{ steps, completedCount, total: steps.length, allDone, loading, markDeployed }}
    >
      {children}
    </SetupContext.Provider>
  )
}

export function useSetup() {
  return useContext(SetupContext)
}

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'
import { computeTrialState } from '../lib/trialState'

const OrgContext = createContext({
  orgId: null,
  role: null,
  org: null,
  trialState: { kind: 'unknown' },
  loading: true,
  error: null,
  refresh: () => {},
})

export function OrgProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState({
    orgId: null,
    role: null,
    org: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    if (!user) {
      setState({ orgId: null, role: null, org: null, loading: false, error: null })
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))

    const { data: member, error: mErr } = await supabase
      .from('organization_members')
      .select('org_id, role')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (mErr) {
      setState({ orgId: null, role: null, org: null, loading: false, error: mErr.message })
      return
    }

    const orgId = member?.org_id ?? null
    let org = null
    if (orgId) {
      const { data } = await supabase
        .from('organizations')
        .select('id, name, subscription_status, trial_ends_at, current_period_end, stripe_customer_id')
        .eq('id', orgId)
        .maybeSingle()
      org = data ?? null
    }

    setState({ orgId, role: member?.role ?? null, org, loading: false, error: null })
  }, [user])

  useEffect(() => {
    if (authLoading) return
    load()
  }, [authLoading, load])

  const value = {
    ...state,
    trialState: computeTrialState(state.org),
    refresh: load,
  }

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>
}

export function useOrg() {
  return useContext(OrgContext)
}

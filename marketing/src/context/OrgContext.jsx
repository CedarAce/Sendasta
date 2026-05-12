import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const OrgContext = createContext({
  orgId: null,
  role: null,
  loading: true,
  error: null,
})

export function OrgProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState({ orgId: null, role: null, loading: true, error: null })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setState({ orgId: null, role: null, loading: false, error: null })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    supabase
      .from('organization_members')
      .select('org_id, role')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setState({ orgId: null, role: null, loading: false, error: error.message })
          return
        }
        setState({
          orgId: data?.org_id ?? null,
          role: data?.role ?? null,
          loading: false,
          error: null,
        })
      })
    return () => {
      cancelled = true
    }
  }, [user, authLoading])

  return <OrgContext.Provider value={state}>{children}</OrgContext.Provider>
}

export function useOrg() {
  return useContext(OrgContext)
}

import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useOrg } from '../context/OrgContext'

const COLUMNS = ['blocked_domains', 'internal_domains', 'no_combine_pairs', 'trusted_pairs']

// Loads the policy row for the current org and exposes a setter that
// optimistically updates local state and persists a single column.
export function usePolicy() {
  const { orgId, role, loading: orgLoading } = useOrg()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orgLoading) return
    if (!orgId) {
      setPolicy(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('policies')
      .select(COLUMNS.join(','))
      .eq('org_id', orgId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) {
          setError(err.message)
          setLoading(false)
          return
        }
        setPolicy(
          data ?? {
            blocked_domains: [],
            internal_domains: [],
            no_combine_pairs: [],
            trusted_pairs: [],
          }
        )
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [orgId, orgLoading])

  const update = useCallback(
    async (column, nextValue) => {
      if (!COLUMNS.includes(column)) throw new Error(`Unknown policy column: ${column}`)
      if (!orgId) return
      const prev = policy
      setPolicy((p) => ({ ...(p ?? {}), [column]: nextValue }))
      const { error: err } = await supabase
        .from('policies')
        .update({ [column]: nextValue })
        .eq('org_id', orgId)
      if (err) {
        setPolicy(prev)
        setError(err.message)
      }
    },
    [orgId, policy]
  )

  return {
    policy,
    update,
    loading: orgLoading || loading,
    error,
    canEdit: role === 'admin',
  }
}

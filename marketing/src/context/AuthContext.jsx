import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { track } from '../lib/track'

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession ?? null)
      // Only real sign-ins fire SIGNED_IN; restored sessions fire
      // INITIAL_SESSION, so this won't double-log on page load.
      if (event === 'SIGNED_IN' && newSession?.user) {
        const u = newSession.user
        const isNew =
          u.created_at && Date.now() - new Date(u.created_at).getTime() < 60_000
        track(isNew ? 'user_signed_up' : 'user_logged_in', { email: u.email })
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

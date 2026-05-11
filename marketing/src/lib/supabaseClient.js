import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  console.warn(
    '[Sendasta] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Marketing pages will still load, but auth + admin pages will not work ' +
      'until these are set in marketing/.env.local (or Vercel env settings).'
  )
}

// Stub used when env vars are missing — keeps marketing pages alive instead of
// crashing the whole app at module load. Auth/admin pages will surface a clear
// error if a user tries to actually sign in.
function makeStub() {
  const notConfigured = (method) => () =>
    Promise.reject(new Error(`Supabase not configured (missing env vars). Called ${method}.`))

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signInWithPassword: notConfigured('signInWithPassword'),
      signInWithOAuth: notConfigured('signInWithOAuth'),
      signUp: notConfigured('signUp'),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: notConfigured('resetPasswordForEmail'),
      updateUser: notConfigured('updateUser'),
    },
  }
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : makeStub()

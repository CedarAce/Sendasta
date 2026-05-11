import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import { supabase } from '../../lib/supabaseClient'

const INPUT =
  'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/15 transition-shadow'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  const onMicrosoftSignIn = async () => {
    setError('')
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
        scopes: 'email openid profile',
      },
    })
    if (err) setError(err.message)
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your Sendasta admin console."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-accent hover:underline font-medium">
            Sign up
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={onMicrosoftSignIn}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors mb-5"
      >
        <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
          <rect x="1" y="1" width="10" height="10" fill="#F25022" />
          <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
          <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
          <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
        </svg>
        Continue with Microsoft
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Work email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <Link to="/forgot-password" className="text-xs text-blue-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT}
          />
        </label>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-accent hover:bg-blue-accent-hover disabled:opacity-60 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors mt-1"
        >
          {submitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  )
}

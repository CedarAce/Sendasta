import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import { supabase } from '../../lib/supabaseClient'

const INPUT =
  'w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/15 transition-shadow'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim(), company_name: companyName },
        emailRedirectTo: window.location.origin + '/auth/callback',
      },
    })
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    setSubmitted(true)
  }

  const onMicrosoftSignUp = async () => {
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

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a verification link to ${email}. Click it to finish setting up your account.`}
        footer={
          <Link to="/login" className="text-blue-accent hover:underline font-medium">
            Back to log in
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Didn't receive it? Check your spam folder, or try signing up again with a different
          email.
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Start your free trial"
      subtitle="30 days free. Cancel anytime before the trial ends to avoid being charged."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-accent hover:underline font-medium">
            Log in
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={onMicrosoftSignUp}
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
          <span className="text-sm font-medium text-gray-700">Full name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={INPUT}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Company name</span>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={INPUT}
          />
        </label>

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
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Confirm password</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

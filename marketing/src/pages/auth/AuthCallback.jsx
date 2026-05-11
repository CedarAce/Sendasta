import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const finish = async () => {
      const { data, error: err } = await supabase.auth.getSession()
      if (cancelled) return
      if (err) {
        setError(err.message)
        return
      }
      if (data.session) {
        navigate('/admin', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }

    finish()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center text-gray-400 text-sm">
      {error ? `Error: ${error}` : 'Signing you in…'}
    </div>
  )
}

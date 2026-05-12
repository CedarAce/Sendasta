import { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { supabase } from '../../lib/supabaseClient'
import { useOrg } from '../../context/OrgContext'

const LANGUAGES = [
  { code: 'en', label: 'English', enabled: true },
  { code: 'es', label: 'Spanish', enabled: false },
  { code: 'fr', label: 'French', enabled: false },
  { code: 'de', label: 'German', enabled: false },
]

export default function Languages() {
  const { orgId, role, loading: orgLoading } = useOrg()
  const [locale, setLocale] = useState('en')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const canEdit = role === 'admin'

  useEffect(() => {
    if (orgLoading) return
    if (!orgId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('organizations')
      .select('locale')
      .eq('id', orgId)
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) setError(err.message)
        else if (data?.locale) setLocale(data.locale)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [orgId, orgLoading])

  const onSelect = async (code) => {
    if (!orgId || code === locale) return
    const prev = locale
    setLocale(code)
    const { error: err } = await supabase
      .from('organizations')
      .update({ locale: code })
      .eq('id', orgId)
    if (err) {
      setLocale(prev)
      setError(err.message)
    }
  }

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Languages"
        subtitle="Set the language for Sendasta's warning messages and admin console."
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <ul className="divide-y divide-gray-100">
          {LANGUAGES.map((lang) => {
            const selectable = lang.enabled && canEdit && !loading
            return (
              <li key={lang.code} className="flex items-center justify-between py-3">
                <label
                  className={`flex items-center gap-3 ${selectable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <input
                    type="radio"
                    name="language"
                    checked={locale === lang.code}
                    onChange={() => onSelect(lang.code)}
                    disabled={!selectable}
                    className="accent-blue-accent"
                  />
                  <span className={`text-sm ${lang.enabled ? 'text-navy' : 'text-gray-400'}`}>
                    {lang.label}
                  </span>
                </label>
                {!lang.enabled && (
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

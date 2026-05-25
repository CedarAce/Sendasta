import { useState, useEffect } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { useAuth } from '../../context/AuthContext'
import { useOrg } from '../../context/OrgContext'
import { supabase } from '../../lib/supabaseClient'

// ── Language ────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French', soon: true },
  { code: 'es', label: 'Spanish', soon: true },
  { code: 'de', label: 'German', soon: true },
]

function LanguageSection({ canEdit }) {
  const { orgId, loading: orgLoading } = useOrg()
  const [locale, setLocale] = useState('en')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (orgLoading || !orgId) return
    supabase.from('organizations').select('locale').eq('id', orgId).maybeSingle()
      .then(({ data }) => { if (data?.locale) setLocale(data.locale) })
  }, [orgId, orgLoading])

  const save = async (val) => {
    if (!canEdit || !orgId) return
    setLocale(val)
    setSaving(true)
    await supabase.from('organizations').update({ locale: val }).eq('id', orgId)
    setSaving(false)
  }

  return (
    <Section title="Language" description="Sets the language for warning dialogs in Outlook and for the admin console.">
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map(({ code, label, soon }) => (
          <button
            key={code}
            type="button"
            disabled={soon || !canEdit || saving}
            onClick={() => save(code)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              locale === code
                ? 'bg-blue-accent text-white border-blue-accent'
                : soon
                ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                : 'text-gray-700 border-gray-200 hover:border-blue-accent hover:text-blue-accent'
            }`}
          >
            {label}{soon ? ' (soon)' : ''}
          </button>
        ))}
      </div>
    </Section>
  )
}

// ── Profile ──────────────────────────────────────────────────────────────────

function ProfileSection() {
  const { user } = useAuth()
  const { org, role, refresh: refreshOrg } = useOrg()

  const [name, setName] = useState('')
  const [orgName, setOrgName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)

  const [newEmail, setNewEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailMsg, setEmailMsg] = useState(null)

  const [curPwd, setCurPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState(null)

  useEffect(() => {
    setName(user?.user_metadata?.full_name ?? '')
  }, [user])

  useEffect(() => {
    setOrgName(org?.name ?? '')
  }, [org])

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg(null)
    const updates = {}
    if (name !== (user?.user_metadata?.full_name ?? '')) updates.data = { full_name: name }
    if (role === 'admin' && orgName && orgName !== org?.name) {
      const { error } = await supabase.from('organizations').update({ name: orgName }).eq('id', org.id)
      if (error) { setProfileMsg({ ok: false, text: error.message }); setSavingProfile(false); return }
      refreshOrg()
    }
    if (updates.data) {
      const { error } = await supabase.auth.updateUser(updates)
      if (error) { setProfileMsg({ ok: false, text: error.message }); setSavingProfile(false); return }
    }
    setProfileMsg({ ok: true, text: 'Saved.' })
    setSavingProfile(false)
  }

  const saveEmail = async (e) => {
    e.preventDefault()
    if (!newEmail) return
    setSavingEmail(true)
    setEmailMsg(null)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) {
      setEmailMsg({ ok: false, text: error.message })
    } else {
      setEmailMsg({ ok: true, text: 'Confirmation sent to your new address — click the link to confirm the change.' })
      setNewEmail('')
    }
    setSavingEmail(false)
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (!newPwd) return
    setSavingPwd(true)
    setPwdMsg(null)
    // Re-authenticate first so Supabase accepts the password change
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: curPwd,
    })
    if (signInErr) {
      setPwdMsg({ ok: false, text: 'Current password is incorrect.' })
      setSavingPwd(false)
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    if (error) {
      setPwdMsg({ ok: false, text: error.message })
    } else {
      setPwdMsg({ ok: true, text: 'Password updated.' })
      setCurPwd('')
      setNewPwd('')
    }
    setSavingPwd(false)
  }

  return (
    <>
      {/* Name + org */}
      <Section title="Profile" description="Your display name and organization name.">
        <form onSubmit={saveProfile} className="flex flex-col gap-3 max-w-sm">
          <Field label="Your name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
            />
          </Field>
          {role === 'admin' && (
            <Field label="Organization name">
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Your company name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
              />
            </Field>
          )}
          {profileMsg && <Msg {...profileMsg} />}
          <div>
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-blue-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-accent-hover disabled:opacity-50 transition-colors"
            >
              {savingProfile ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Section>

      {/* Email */}
      <Section title="Email address" description={`Current: ${user?.email}`}>
        <form onSubmit={saveEmail} className="flex flex-col gap-3 max-w-sm">
          <Field label="New email address">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
            />
          </Field>
          {emailMsg && <Msg {...emailMsg} />}
          <div>
            <button
              type="submit"
              disabled={savingEmail || !newEmail}
              className="bg-blue-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-accent-hover disabled:opacity-50 transition-colors"
            >
              {savingEmail ? 'Sending…' : 'Change email'}
            </button>
          </div>
        </form>
      </Section>

      {/* Password */}
      <Section title="Password" description="Choose a strong password you don't use elsewhere.">
        <form onSubmit={savePassword} className="flex flex-col gap-3 max-w-sm">
          <Field label="Current password">
            <input
              type="password"
              value={curPwd}
              onChange={(e) => setCurPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
            />
          </Field>
          <Field label="New password">
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
            />
          </Field>
          {pwdMsg && <Msg {...pwdMsg} />}
          <div>
            <button
              type="submit"
              disabled={savingPwd || !curPwd || !newPwd}
              className="bg-blue-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-accent-hover disabled:opacity-50 transition-colors"
            >
              {savingPwd ? 'Saving…' : 'Change password'}
            </button>
          </div>
        </form>
      </Section>
    </>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, description, children }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-navy mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  )
}

function Msg({ ok, text }) {
  return (
    <p className={`text-xs ${ok ? 'text-green-700' : 'text-red-600'}`}>{text}</p>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Settings() {
  const { role } = useOrg()
  const canEdit = role === 'admin'

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Settings" subtitle="Manage your profile and organization preferences." />
      <div className="flex flex-col gap-4">
        <ProfileSection />
        <LanguageSection canEdit={canEdit} />
      </div>
    </div>
  )
}

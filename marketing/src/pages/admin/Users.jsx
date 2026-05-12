import { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { supabase } from '../../lib/supabaseClient'
import { useOrg } from '../../context/OrgContext'

const STATUS_LABEL = {
  active: 'Active',
  invited: 'Invited',
  revoked: 'Revoked',
}

const STATUS_CLASS = {
  active: 'bg-green-100 text-green-700',
  invited: 'bg-amber-100 text-amber-700',
  revoked: 'bg-gray-100 text-gray-600',
}

const ROLE_LABEL = {
  admin: 'Admin',
  member: 'Member',
}

function formatLastActive(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString()
}

export default function Users() {
  const { orgId, loading: orgLoading } = useOrg()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (orgLoading) return
    if (!orgId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .rpc('list_org_members', { p_org_id: orgId })
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) setError(err.message)
        else setRows(data ?? [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [orgId, orgLoading])

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Users"
        subtitle="People in your organization with a Sendasta license."
        action={
          <button
            disabled
            title="Coming soon"
            className="bg-blue-accent text-white font-semibold px-4 py-2 rounded-lg opacity-50 cursor-not-allowed text-sm"
          >
            Invite User
          </button>
        }
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Last Active</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <Td className="text-gray-500" colSpan={5}>
                  Loading…
                </Td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <Td className="text-gray-500" colSpan={5}>
                  No users yet.
                </Td>
              </tr>
            )}
            {!loading &&
              rows.map((u) => {
                const displayEmail = u.email ?? u.invited_email ?? '—'
                return (
                  <tr
                    key={u.user_id ?? `invite:${u.invited_email}`}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <Td className="font-medium text-navy">{displayEmail}</Td>
                    <Td className="text-gray-700">{ROLE_LABEL[u.role] ?? u.role}</Td>
                    <Td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[u.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {STATUS_LABEL[u.status] ?? u.status}
                      </span>
                    </Td>
                    <Td className="text-gray-600">{formatLastActive(u.last_active_at)}</Td>
                    <Td className="text-right">
                      <button
                        disabled
                        className="text-xs text-gray-400 cursor-not-allowed"
                        title="Coming soon"
                      >
                        Manage
                      </button>
                    </Td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, className = '' }) {
  return (
    <th className={`text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 ${className}`}>
      {children}
    </th>
  )
}

function Td({ children, className = '', colSpan }) {
  return (
    <td className={`px-4 py-3 ${className}`} colSpan={colSpan}>
      {children}
    </td>
  )
}

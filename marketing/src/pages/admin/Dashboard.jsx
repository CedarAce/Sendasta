import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'
import { useAuth } from '../../context/AuthContext'

const STATS = [
  { label: 'Active licenses', value: '12', hint: 'of 25 seats' },
  { label: 'Blocked sends this month', value: '47', hint: 'across 8 users' },
  { label: 'Rules configured', value: '8', hint: 'block + bypass + alert' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.email?.split('@')[0] || 'there'

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's a snapshot of your organization's Sendasta activity."
      />
      <TodoBanner>TODO: wire to Supabase</TodoBanner>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map(({ label, value, hint }) => (
          <div
            key={label}
            className="bg-white rounded-lg border border-gray-200 p-5"
          >
            <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
            <div className="text-3xl font-bold text-navy mt-2">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{hint}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-base font-semibold text-navy mb-2">Getting started</h2>
        <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
          <li>
            Configure your <strong>Warning List</strong> and <strong>Bypass List</strong> for
            organization-wide policies.
          </li>
          <li>
            Add <strong>Alert Lists</strong> to warn users when they mix sensitive domain pairs.
          </li>
          <li>
            Visit <strong>Downloads</strong> to deploy Sendasta to your users via Microsoft 365
            admin center.
          </li>
        </ol>
      </div>
    </div>
  )
}

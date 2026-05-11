import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'

const MOCK_USERS = [
  { email: 'alice@acme.com', role: 'Admin', status: 'Active', lastActive: '2 hours ago' },
  { email: 'bob@acme.com', role: 'Member', status: 'Active', lastActive: 'Yesterday' },
  { email: 'carol@acme.com', role: 'Member', status: 'Invited', lastActive: '—' },
  { email: 'dan@acme.com', role: 'Member', status: 'Active', lastActive: '5 minutes ago' },
]

const STATUS_CLASS = {
  Active: 'bg-green-100 text-green-700',
  Invited: 'bg-amber-100 text-amber-700',
  Revoked: 'bg-gray-100 text-gray-600',
}

export default function Users() {
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
      <TodoBanner>TODO: wire to Supabase (licenses table)</TodoBanner>

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
            {MOCK_USERS.map((u) => (
              <tr key={u.email} className="border-b border-gray-100 last:border-0">
                <Td className="font-medium text-navy">{u.email}</Td>
                <Td className="text-gray-700">{u.role}</Td>
                <Td>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[u.status]}`}
                  >
                    {u.status}
                  </span>
                </Td>
                <Td className="text-gray-600">{u.lastActive}</Td>
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
            ))}
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

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}

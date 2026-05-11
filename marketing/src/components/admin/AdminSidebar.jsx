import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: HomeIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/alert-lists', label: 'Alert Lists', icon: BellIcon },
  { to: '/admin/warning-list', label: 'Warning List', icon: ShieldIcon },
  { to: '/admin/bypass-list', label: 'Bypass List', icon: CheckIcon },
  { to: '/admin/billing', label: 'Billing', icon: CardIcon },
  { to: '/admin/languages', label: 'Languages', icon: GlobeIcon },
  { to: '/admin/documentation', label: 'Documentation', icon: BookIcon },
  { to: '/admin/downloads', label: 'Downloads', icon: DownloadIcon },
]

export default function AdminSidebar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const onLogOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-navy-700 text-white border-l-2 border-blue-accent pl-[18px]'
        : 'text-gray-400 hover:text-white hover:bg-navy-800 border-l-2 border-transparent'
    }`

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-navy flex flex-col border-r border-white/10">
      <Link
        to="/admin"
        className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10"
      >
        <img src="/assets/logo-sendasta-white.svg" alt="" className="h-7 w-auto" />
        <span className="text-white font-bold text-lg tracking-tight">Sendasta</span>
      </Link>

      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, end, icon: Icon }) => (
          <NavLink key={to} to={to} end={end} className={linkClass}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-5 py-4">
        <div className="text-xs text-gray-400 truncate mb-2" title={user?.email}>
          {user?.email || 'Signed in'}
        </div>
        <button
          type="button"
          onClick={onLogOut}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Log Out
        </button>
      </div>
    </aside>
  )
}

function Icon({ children }) {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      {children}
    </svg>
  )
}

function HomeIcon() {
  return (
    <Icon>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10" />
    </Icon>
  )
}
function UsersIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87a4 4 0 00-8 0M16 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </Icon>
  )
}
function BellIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"
      />
    </Icon>
  )
}
function ShieldIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"
      />
    </Icon>
  )
}
function CheckIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </Icon>
  )
}
function CardIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
      />
    </Icon>
  )
}
function GlobeIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
      />
    </Icon>
  )
}
function BookIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 19V6a2 2 0 012-2h12v15H6a2 2 0 00-2 2zM6 4v15"
      />
    </Icon>
  )
}
function DownloadIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
      />
    </Icon>
  )
}

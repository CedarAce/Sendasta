import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_SECTIONS = [
  {
    items: [
      { to: '/admin', label: 'Overview', end: true, icon: HomeIcon },
      { to: '/admin/users', label: 'Users', icon: UsersIcon },
      { to: '/admin/policies', label: 'Policies', icon: ShieldIcon },
      { to: '/admin/billing', label: 'Billing', icon: CardIcon },
      { to: '/admin/settings', label: 'Settings', icon: GearIcon },
    ],
  },
  {
    label: 'Resources',
    items: [
      { to: '/admin/documentation', label: 'Documentation', icon: BookIcon },
      { to: '/admin/downloads', label: 'Downloads', icon: DownloadIcon },
    ],
  },
]

export default function AdminSidebar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const onLogOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-accent/15 text-white'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-navy flex flex-col border-r border-white/10">
      <Link
        to="/admin"
        className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10"
      >
        <img src="/assets/logo-sendasta-white.svg" alt="" className="h-7 w-auto" />
        <div>
          <div className="text-white font-bold text-base tracking-tight leading-tight">Sendasta</div>
          <div className="text-white/40 text-[10.5px] leading-tight">Admin Console</div>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-3 overflow-y-auto flex flex-col gap-1">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className={section.label ? 'mt-3' : ''}>
            {section.label && (
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/35 px-3 pb-1.5">
                {section.label}
              </div>
            )}
            {section.items.map(({ to, label, end, icon: Icon }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="text-xs text-white/40 truncate mb-2" title={user?.email}>
          {user?.email || 'Signed in'}
        </div>
        <button
          type="button"
          onClick={onLogOut}
          className="text-sm text-white/50 hover:text-white transition-colors"
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
function GearIcon() {
  return (
    <Icon>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </Icon>
  )
}

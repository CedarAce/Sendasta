import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import TrialBanner from './TrialBanner'
import HardLockGate from './HardLockGate'
import { useOrg } from '../../context/OrgContext'
import { SetupProvider } from '../../context/SetupContext'

export default function AdminLayout() {
  const { trialState } = useOrg()
  const { pathname } = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  // Hard lock once the trial has ended or the subscription was canceled.
  // Billing stays reachable so a locked admin can still pay or manage.
  const locked = trialState?.kind === 'trial_ended' || trialState?.kind === 'canceled'
  const allowThrough = pathname === '/admin/billing'

  return (
    <SetupProvider>
      <div
        className="min-h-screen flex bg-gray-50"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />

        {/* Mobile drawer backdrop */}
        {navOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="flex-1 flex flex-col min-w-0 md:ml-60">
          {/* Mobile top bar with hamburger — hidden on desktop */}
          <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 bg-navy px-4 h-14 border-b border-white/10">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="text-white/80 hover:text-white p-1 -ml-1"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/admin" className="flex items-center gap-2">
              <img src="/assets/logo-sendasta-white.svg" alt="" className="h-6 w-auto" />
              <span className="text-white font-bold text-sm tracking-tight">Sendasta</span>
            </Link>
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <TrialBanner />
            {locked && !allowThrough ? <HardLockGate /> : <Outlet />}
          </main>
        </div>
      </div>
    </SetupProvider>
  )
}

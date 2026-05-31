import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import TrialBanner from './TrialBanner'
import HardLockGate from './HardLockGate'
import { useOrg } from '../../context/OrgContext'
import { SetupProvider } from '../../context/SetupContext'

export default function AdminLayout() {
  const { trialState } = useOrg()
  const { pathname } = useLocation()

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
        <AdminSidebar />
        <main className="flex-1 ml-60 p-8">
          <TrialBanner />
          {locked && !allowThrough ? <HardLockGate /> : <Outlet />}
        </main>
      </div>
    </SetupProvider>
  )
}

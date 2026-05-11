import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  return (
    <div
      className="min-h-screen flex bg-gray-50"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <Outlet />
      </main>
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { usePageView } from '../lib/track'

export default function MarketingLayout() {
  usePageView()
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

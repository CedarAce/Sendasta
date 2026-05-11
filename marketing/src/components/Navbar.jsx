import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSectionClick = (id) => (e) => {
    if (pathname === '/') {
      e.preventDefault()
      scrollTo(id)
      setMobileOpen(false)
    }
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
    }`

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-navy border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 relative">
        {/* Spacer for flex balancing on mobile */}
        <div className="w-8 md:hidden"></div>

        {/* Logo + wordmark */}
        <Link to="/" className="flex items-center gap-3 md:gap-2.5 flex-shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <img
            src="/assets/logo-sendasta-white.svg"
            alt=""
            className="h-8 md:h-7 w-auto"
          />
          <span className="text-white font-bold text-xl md:text-lg tracking-tight">
            Sendasta
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/for-it-admins" className={linkClass}>
            Setup Guide
          </NavLink>
          <Link
            to={pathname === '/' ? '#pricing' : '/#pricing'}
            onClick={handleSectionClick('pricing')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <NavLink to="/faq" className={linkClass}>
            FAQ
          </NavLink>
          <Link
            to={pathname === '/' ? '#contact' : '/#contact'}
            onClick={handleSectionClick('contact')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-400 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg transition-colors"
          >
            Log In
          </Link>
          <Link
            to={pathname === '/' ? '#pricing' : '/#pricing'}
            onClick={handleSectionClick('pricing')}
            className="bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-800 border-t border-white/10 px-6 py-5 flex flex-col gap-4">
          <NavLink
            to="/for-it-admins"
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            Setup Guide
          </NavLink>
          <Link
            to={pathname === '/' ? '#pricing' : '/#pricing'}
            onClick={handleSectionClick('pricing')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            to={pathname === '/' ? '#contact' : '/#contact'}
            onClick={handleSectionClick('contact')}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Contact
          </Link>
          <Link
            to={pathname === '/' ? '#pricing' : '/#pricing'}
            onClick={handleSectionClick('pricing')}
            className="mt-2 bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  )
}

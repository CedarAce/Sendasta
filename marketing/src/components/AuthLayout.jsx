import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen bg-navy flex flex-col items-center justify-center px-6 py-12"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <img src="/assets/logo-sendasta-white.svg" alt="" className="h-8 w-auto" />
        <span className="text-white font-bold text-xl tracking-tight">Sendasta</span>
      </Link>

      <div className="w-full max-w-md bg-navy-700 border border-white/10 rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mb-6">{subtitle}</p>}
        {children}
      </div>

      {footer && <div className="mt-6 text-sm text-gray-400 text-center">{footer}</div>}
    </div>
  )
}

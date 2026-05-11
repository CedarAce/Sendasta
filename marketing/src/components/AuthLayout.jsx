import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-navy-700 via-navy to-navy flex flex-col items-center justify-center px-6 py-12"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <img src="/assets/logo-sendasta-white.svg" alt="" className="h-7 w-auto" />
        <span className="text-white font-bold text-xl tracking-tight">Sendasta</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl px-8 py-9 shadow-2xl shadow-black/30 ring-1 ring-white/10">
        <h1 className="text-[26px] leading-tight font-bold text-navy mb-1.5">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mb-7">{subtitle}</p>}
        {children}
      </div>

      {footer && <div className="mt-6 text-sm text-gray-300 text-center">{footer}</div>}
    </div>
  )
}

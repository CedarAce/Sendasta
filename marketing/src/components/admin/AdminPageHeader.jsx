export default function AdminPageHeader({ title, subtitle, action }) {
  return (
    <header className="flex items-start justify-between gap-6 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}

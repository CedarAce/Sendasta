export default function AdminPageHeader({ title, subtitle, action }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}

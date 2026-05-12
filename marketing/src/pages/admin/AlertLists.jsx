import { useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { usePolicy } from '../../lib/usePolicy'

export default function AlertLists() {
  const { policy, update, loading, error, canEdit } = usePolicy()

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Alert Lists"
        subtitle="Rules that warn users when recipients are mixed across sensitive domain pairs."
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <PairSection
          title="No-Combine Pairs"
          description="Block sending an email if both Domain A AND Domain B are in the recipient list."
          pairs={policy?.no_combine_pairs ?? []}
          onChange={(next) => update('no_combine_pairs', next)}
          loading={loading}
          disabled={!canEdit || loading}
        />
        <PairSection
          title="Trusted Pairs"
          description="Whitelist pairs that are always allowed together, even if other rules would block them."
          pairs={policy?.trusted_pairs ?? []}
          onChange={(next) => update('trusted_pairs', next)}
          loading={loading}
          disabled={!canEdit || loading}
        />
      </div>
    </div>
  )
}

function PairSection({ title, description, pairs, onChange, loading, disabled }) {
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const add = (e) => {
    e.preventDefault()
    const aV = a.trim().toLowerCase()
    const bV = b.trim().toLowerCase()
    setA('')
    setB('')
    if (!aV || !bV) return
    const exists = pairs.some(
      (p) =>
        (p.a === aV && p.b === bV) || (p.a === bV && p.b === aV)
    )
    if (exists) return
    onChange?.([...pairs, { a: aV, b: bV }])
  }

  const remove = (i) => onChange?.(pairs.filter((_, idx) => idx !== i))

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <p className="text-sm text-gray-600 mt-1 mb-4">{description}</p>

      <form onSubmit={add} className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="domain-a.com"
          disabled={disabled}
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent disabled:bg-gray-50 disabled:text-gray-400"
        />
        <span className="text-gray-400 text-sm">×</span>
        <input
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="domain-b.com"
          disabled={disabled}
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-blue-accent hover:bg-blue-accent-hover disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-gray-100">
        {loading && <li className="text-sm text-gray-500 py-2">Loading…</li>}
        {!loading && pairs.length === 0 && (
          <li className="text-sm text-gray-500 py-2">No pairs configured.</li>
        )}
        {!loading &&
          pairs.map((p, i) => (
            <li
              key={`${p.a}::${p.b}::${i}`}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <div className="font-mono text-gray-800">
                {p.a} <span className="text-gray-400">×</span> {p.b}
              </div>
              <button
                onClick={() => remove(i)}
                disabled={disabled}
                className="text-xs text-gray-400 hover:text-red-600 disabled:text-gray-300 disabled:hover:text-gray-300"
              >
                Remove
              </button>
            </li>
          ))}
      </ul>
    </section>
  )
}

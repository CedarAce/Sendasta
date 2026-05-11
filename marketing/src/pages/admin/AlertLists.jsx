import { useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'

const INITIAL_NO_COMBINE = [
  { a: 'acme.com', b: 'competitor.com' },
  { a: 'client-a.com', b: 'client-b.com' },
]
const INITIAL_TRUSTED = [
  { a: 'acme.com', b: 'lawfirm.com' },
  { a: 'acme.com', b: 'vendor.com' },
]

export default function AlertLists() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Alert Lists"
        subtitle="Rules that warn users when recipients are mixed across sensitive domain pairs."
      />
      <TodoBanner>TODO: wire to Supabase (policies.no_combine_pairs + policies.trusted_pairs)</TodoBanner>

      <div className="grid grid-cols-1 gap-6">
        <PairSection
          title="No-Combine Pairs"
          description="Block sending an email if both Domain A AND Domain B are in the recipient list."
          initial={INITIAL_NO_COMBINE}
        />
        <PairSection
          title="Trusted Pairs"
          description="Whitelist pairs that are always allowed together, even if other rules would block them."
          initial={INITIAL_TRUSTED}
        />
      </div>
    </div>
  )
}

function PairSection({ title, description, initial }) {
  const [pairs, setPairs] = useState(initial)
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const add = (e) => {
    e.preventDefault()
    if (!a || !b) return
    setPairs([...pairs, { a: a.trim().toLowerCase(), b: b.trim().toLowerCase() }])
    setA('')
    setB('')
  }

  const remove = (i) => setPairs(pairs.filter((_, idx) => idx !== i))

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-navy">{title}</h2>
      <p className="text-sm text-gray-600 mt-1 mb-4">{description}</p>

      <form onSubmit={add} className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="domain-a.com"
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
        />
        <span className="text-gray-400 text-sm">×</span>
        <input
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="domain-b.com"
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
        />
        <button
          type="submit"
          className="bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-gray-100">
        {pairs.length === 0 && (
          <li className="text-sm text-gray-500 py-2">No pairs configured.</li>
        )}
        {pairs.map((p, i) => (
          <li key={i} className="flex items-center justify-between py-2.5 text-sm">
            <div className="font-mono text-gray-800">
              {p.a} <span className="text-gray-400">×</span> {p.b}
            </div>
            <button
              onClick={() => remove(i)}
              className="text-xs text-gray-400 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

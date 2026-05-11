import { useState } from 'react'

export default function DomainListEditor({ initial = [], placeholder = 'example.com' }) {
  const [domains, setDomains] = useState(initial)
  const [input, setInput] = useState('')

  const add = (e) => {
    e.preventDefault()
    const v = input.trim().toLowerCase()
    if (!v || domains.includes(v)) {
      setInput('')
      return
    }
    setDomains([...domains, v])
    setInput('')
  }

  const remove = (d) => setDomains(domains.filter((x) => x !== d))

  return (
    <div>
      <form onSubmit={add} className="flex items-center gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent"
        />
        <button
          type="submit"
          className="bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </form>

      <ul className="divide-y divide-gray-100">
        {domains.length === 0 && (
          <li className="text-sm text-gray-500 py-2">No domains configured.</li>
        )}
        {domains.map((d) => (
          <li key={d} className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-mono text-gray-800">{d}</span>
            <button
              onClick={() => remove(d)}
              className="text-xs text-gray-400 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useState } from 'react'

export default function DomainListEditor({
  value = [],
  onChange,
  placeholder = 'example.com',
  disabled = false,
  loading = false,
}) {
  const [input, setInput] = useState('')

  const add = (e) => {
    e.preventDefault()
    const v = input.trim().toLowerCase()
    setInput('')
    if (!v || value.includes(v)) return
    onChange?.([...value, v])
  }

  const remove = (d) => onChange?.(value.filter((x) => x !== d))

  return (
    <div>
      <form onSubmit={add} className="flex items-center gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-accent disabled:bg-gray-50 disabled:text-gray-400"
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
        {loading && (
          <li className="text-sm text-gray-500 py-2">Loading…</li>
        )}
        {!loading && value.length === 0 && (
          <li className="text-sm text-gray-500 py-2">No domains configured.</li>
        )}
        {!loading &&
          value.map((d) => (
            <li key={d} className="flex items-center justify-between py-2.5 text-sm">
              <span className="font-mono text-gray-800">{d}</span>
              <button
                onClick={() => remove(d)}
                disabled={disabled}
                className="text-xs text-gray-400 hover:text-red-600 disabled:text-gray-300 disabled:hover:text-gray-300"
              >
                Remove
              </button>
            </li>
          ))}
      </ul>
    </div>
  )
}

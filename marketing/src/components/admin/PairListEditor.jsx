import { useState } from 'react'
import BulkImportModal from './BulkImportModal'
import {
  normalizeDomain,
  isValidDomain,
  downloadAsFile,
} from '../../lib/domainValidation'

export default function PairListEditor({
  value = [],
  onChange,
  disabled = false,
  loading = false,
  exportName = 'sendasta-pairs.csv',
  importTitle = 'Import pairs',
}) {
  const [draftA, setDraftA] = useState('')
  const [draftB, setDraftB] = useState('')
  const [error, setError] = useState('')
  const [importOpen, setImportOpen] = useState(false)

  const samePair = (p1, p2) =>
    (p1.a === p2.a && p1.b === p2.b) || (p1.a === p2.b && p1.b === p2.a)

  const commitDraft = () => {
    const a = normalizeDomain(draftA)
    const b = normalizeDomain(draftB)
    setError('')
    if (!a && !b) return
    if (!a || !b) {
      setError('Both domains required')
      return
    }
    if (!isValidDomain(a)) {
      setError(`"${a}" doesn't look like a valid domain`)
      return
    }
    if (!isValidDomain(b)) {
      setError(`"${b}" doesn't look like a valid domain`)
      return
    }
    if (a === b) {
      setError('Pair must be two different domains')
      return
    }
    const next = { a, b }
    if (value.some((p) => samePair(p, next))) {
      setError('Pair already in list')
      return
    }
    onChange?.([...value, next])
    setDraftA('')
    setDraftB('')
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitDraft()
    }
  }

  const remove = (i) => onChange?.(value.filter((_, idx) => idx !== i))

  const onExport = () => {
    const csv = 'domain_a,domain_b\n' + value.map((p) => `${p.a},${p.b}`).join('\n') + '\n'
    downloadAsFile(exportName, csv)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-3 text-sm">
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          disabled={disabled}
          className="text-blue-accent hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          Import
        </button>
        {value.length > 0 && (
          <button
            type="button"
            onClick={onExport}
            className="text-blue-accent hover:underline"
          >
            Export
          </button>
        )}
      </div>

      <ul className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
        {loading && (
          <li className="text-sm text-gray-500 py-2.5 px-3">Loading…</li>
        )}

        {!loading &&
          value.map((p, i) => (
            <li
              key={`${p.a}::${p.b}::${i}`}
              className="flex items-center justify-between py-2.5 px-3 text-sm group bg-white"
            >
              <div className="font-mono text-gray-800 flex items-center gap-2">
                <span>{p.a}</span>
                <span className="text-gray-400">×</span>
                <span>{p.b}</span>
              </div>
              <button
                onClick={() => remove(i)}
                disabled={disabled}
                aria-label={`Remove pair ${p.a} × ${p.b}`}
                className="text-gray-400 hover:text-red-600 disabled:text-gray-300 disabled:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </li>
          ))}

        {/* Inline add row */}
        {!loading && (
          <li className="flex items-center gap-2 py-1 px-2 bg-gray-50">
            <span className="text-gray-400 select-none">+</span>
            <input
              value={draftA}
              onChange={(e) => {
                setDraftA(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={onKey}
              placeholder="domain-a.com"
              disabled={disabled}
              className="flex-1 bg-transparent text-sm font-mono py-1.5 focus:outline-none disabled:text-gray-400 placeholder:font-sans placeholder:text-gray-400 min-w-0"
            />
            <span className="text-gray-400 text-sm">×</span>
            <input
              value={draftB}
              onChange={(e) => {
                setDraftB(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={onKey}
              onBlur={commitDraft}
              placeholder="domain-b.com"
              disabled={disabled}
              className="flex-1 bg-transparent text-sm font-mono py-1.5 focus:outline-none disabled:text-gray-400 placeholder:font-sans placeholder:text-gray-400 min-w-0"
            />
          </li>
        )}
      </ul>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <BulkImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onAdd={(next) => onChange?.(next)}
        existing={value}
        kind="pair"
        title={importTitle}
      />
    </div>
  )
}

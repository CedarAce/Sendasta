import { useState } from 'react'
import BulkImportModal from './BulkImportModal'
import {
  normalizeDomain,
  isValidDomain,
  downloadAsFile,
} from '../../lib/domainValidation'

export default function DomainListEditor({
  value = [],
  onChange,
  placeholder = 'example.com',
  disabled = false,
  loading = false,
  exportName = 'sendasta-domains.csv',
  importTitle = 'Import domains',
}) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [importOpen, setImportOpen] = useState(false)

  const commitDraft = () => {
    const v = normalizeDomain(draft)
    setError('')
    if (!v) {
      setDraft('')
      return
    }
    if (!isValidDomain(v)) {
      setError(`"${v}" doesn't look like a valid domain`)
      return
    }
    if (value.includes(v)) {
      setError(`"${v}" is already in the list`)
      return
    }
    onChange?.([...value, v])
    setDraft('')
  }

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault()
      commitDraft()
    }
  }

  const remove = (d) => onChange?.(value.filter((x) => x !== d))

  const onExport = () => {
    const csv = 'domain\n' + value.join('\n') + '\n'
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
          value.map((d) => (
            <li
              key={d}
              className="flex items-center justify-between py-2.5 px-3 text-sm group bg-white"
            >
              <span className="font-mono text-gray-800">{d}</span>
              <button
                onClick={() => remove(d)}
                disabled={disabled}
                aria-label={`Remove ${d}`}
                className="text-gray-400 hover:text-red-600 disabled:text-gray-300 disabled:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </li>
          ))}

        {/* Always-present inline add row */}
        {!loading && (
          <li className="flex items-center py-1 px-2 bg-gray-50">
            <span className="text-gray-400 mr-2 select-none">+</span>
            <input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (error) setError('')
              }}
              onKeyDown={onKey}
              onBlur={commitDraft}
              placeholder={value.length === 0 ? `e.g. ${placeholder}` : 'Add another'}
              disabled={disabled}
              className="flex-1 bg-transparent text-sm font-mono py-1.5 focus:outline-none disabled:text-gray-400 placeholder:font-sans placeholder:text-gray-400"
            />
          </li>
        )}
      </ul>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      <BulkImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onAdd={(next) => onChange?.(next)}
        existing={value}
        kind="domain"
        title={importTitle}
      />
    </div>
  )
}

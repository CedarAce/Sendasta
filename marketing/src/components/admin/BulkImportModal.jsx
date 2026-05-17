import { useMemo, useRef, useState } from 'react'
import {
  parseDomainBlob,
  parsePairBlob,
  downloadAsFile,
  DOMAIN_TEMPLATE_CSV,
  PAIR_TEMPLATE_CSV,
} from '../../lib/domainValidation'

// kind: 'domain' | 'pair'
export default function BulkImportModal({
  open,
  onClose,
  onAdd,
  existing = [],
  kind = 'domain',
  title,
}) {
  const [text, setText] = useState('')
  const fileInputRef = useRef(null)
  const parser = kind === 'pair' ? parsePairBlob : parseDomainBlob
  const templateCsv = kind === 'pair' ? PAIR_TEMPLATE_CSV : DOMAIN_TEMPLATE_CSV
  const templateName = kind === 'pair' ? 'sendasta-pairs-template.csv' : 'sendasta-domains-template.csv'

  const parsed = useMemo(() => parser(text, existing), [text, existing, parser])

  if (!open) return null

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const content = await file.text()
    setText((prev) => (prev ? prev + '\n' + content : content))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const commit = () => {
    if (parsed.added.length === 0) return
    if (kind === 'pair') {
      onAdd([...existing, ...parsed.added])
    } else {
      onAdd([...existing, ...parsed.added])
    }
    setText('')
    onClose()
  }

  const reset = () => setText('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-navy">{title ?? 'Import'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Upload CSV
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.txt,text/csv,text/plain"
              onChange={onFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => downloadAsFile(templateName, templateCsv)}
              className="text-blue-accent hover:underline"
            >
              Download template
            </button>
            {text && (
              <button type="button" onClick={reset} className="ml-auto text-xs text-gray-500 hover:text-red-600">
                Clear
              </button>
            )}
          </div>

          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {kind === 'pair'
              ? 'Paste pairs (one per line, "domain_a, domain_b")'
              : 'Paste domains (one per line, or comma-separated)'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              kind === 'pair'
                ? 'acme.com, competitor.com\nclient-a.com, client-b.com'
                : 'competitor.com\nold-client.com\npersonal-address.com'
            }
            rows={10}
            className="w-full font-mono text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-accent"
          />

          {text && (
            <div className="mt-3 text-xs flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-green-700">
                <strong>{parsed.added.length}</strong> new
              </span>
              <span className="text-amber-700">
                <strong>{parsed.duplicates.length}</strong> duplicates skipped
              </span>
              <span className="text-red-700">
                <strong>{parsed.invalid.length}</strong> invalid
              </span>
            </div>
          )}

          {parsed.invalid.length > 0 && (
            <div className="mt-3 text-xs bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="font-medium text-red-700 mb-1">Invalid entries (skipped):</p>
              <ul className="font-mono text-red-700 space-y-0.5 max-h-24 overflow-y-auto">
                {parsed.invalid.slice(0, 10).map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
                {parsed.invalid.length > 10 && <li>… and {parsed.invalid.length - 10} more</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={commit}
            disabled={parsed.added.length === 0}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-accent hover:bg-blue-accent-hover text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {parsed.added.length > 0 ? parsed.added.length : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { fetchOrgReport } from '../../lib/analytics'

const RANGES = [
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
  { days: 90, label: '90 days' },
]

const REASON_COLORS = {
  blocked_domain: '#ef4444',
  no_combine: '#f59e0b',
  multi_domain_alert: '#4f8cff',
}

export default function Reporting() {
  const [days, setDays] = useState(30)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchOrgReport(days)
      .then((r) => { if (!cancelled) setReport(r) })
      .catch((e) => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [days])

  const t = report?.totals
  const hasActivity = t && (t.scans > 0 || t.blocks > 0 || t.allows > 0)

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        title="Reporting"
        subtitle="What Sendasta is catching for your team."
        action={
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  days === r.days
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Mistakes caught" value={loading ? '…' : t?.blocks ?? 0} note="emails blocked" highlight />
        <Kpi label="Emails checked" value={loading ? '…' : t?.scans ?? 0} note="send-time scans" />
        <Kpi label="Allowed" value={loading ? '…' : t?.allows ?? 0} note="passed checks" />
        <Kpi label="Block rate" value={loading ? '…' : `${t?.blockRate ?? 0}%`} note="of checked emails" />
      </div>

      {!loading && !error && !hasActivity ? (
        <EmptyState />
      ) : (
        <>
          <TrendCard trend={report?.trend} loading={loading} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <ReasonCard byReason={report?.byReason} blocks={t?.blocks} loading={loading} />
            <DomainsCard topDomains={report?.topDomains} loading={loading} />
          </div>
        </>
      )}
    </div>
  )
}

function Kpi({ label, value, note, highlight }) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-1.5 ${
        highlight ? 'bg-navy border-navy text-white' : 'bg-white border-gray-200'
      }`}
    >
      <div className={`text-[11px] font-semibold uppercase tracking-[0.06em] ${highlight ? 'text-white/60' : 'text-gray-500'}`}>
        {label}
      </div>
      <div className={`text-3xl font-extrabold tracking-tight leading-none mt-1 ${highlight ? 'text-white' : 'text-navy'}`}>
        {value}
      </div>
      <div className={`text-xs mt-0.5 ${highlight ? 'text-white/50' : 'text-gray-400'}`}>{note}</div>
    </div>
  )
}

function TrendCard({ trend, loading }) {
  const data = trend || []
  const max = Math.max(1, ...data.map((d) => d.blocks))
  // Show at most ~30 labelled bars; for 90d the bars stay thin but readable.
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-navy mb-4">Mistakes caught over time</h2>
      {loading ? (
        <div className="h-32 flex items-center justify-center text-sm text-gray-400">Loading…</div>
      ) : (
        <div className="flex items-end gap-1 h-32">
          {data.map((d, i) => {
            const h = Math.max(2, Math.round((d.blocks / max) * 112))
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                <div
                  className="w-full max-w-[18px] rounded-t bg-blue-accent/70 hover:bg-blue-accent transition-colors"
                  style={{ height: `${h}px` }}
                  title={`${d.day}: ${d.blocks} blocked`}
                />
              </div>
            )
          })}
        </div>
      )}
      {!loading && data.length > 0 && (
        <div className="flex justify-between text-[10px] text-gray-400 mt-2">
          <span>{data[0].day}</span>
          <span>{data[data.length - 1].day}</span>
        </div>
      )}
    </div>
  )
}

function ReasonCard({ byReason, blocks, loading }) {
  const data = byReason || []
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-navy mb-4">Why emails were blocked</h2>
      {loading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400">No blocks in this period.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((r) => {
            const pct = blocks ? Math.round((r.count / blocks) * 100) : 0
            return (
              <div key={r.reason}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{r.label}</span>
                  <span className="text-gray-500 tabular-nums">{r.count} · {pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(pct, 3)}%`, background: REASON_COLORS[r.reason] || '#6b7280' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DomainsCard({ topDomains, loading }) {
  const data = topDomains || []
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-navy mb-1">Top flagged recipient domains</h2>
      {loading ? (
        <div className="text-sm text-gray-400 mt-3">Loading…</div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-400 mt-2">
          Recipient-domain breakdown will appear here as your team sends email. (Sendasta records
          only the domain — never the address.)
        </p>
      ) : (
        <table className="w-full mt-2">
          <tbody>
            {data.map((d) => (
              <tr key={d.domain} className="border-b border-gray-100 last:border-0">
                <td className="py-2 text-sm text-gray-700">{d.domain}</td>
                <td className="py-2 text-sm text-gray-500 text-right tabular-nums">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 3 3 5-6" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-navy">No activity yet</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
        Once your team installs Sendasta and starts sending email, you'll see how many mistakes were
        caught, why, and the trend over time — all without any personal data leaving their inbox.
      </p>
    </div>
  )
}

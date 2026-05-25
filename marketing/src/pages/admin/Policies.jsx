import { useState } from 'react'
import DomainListEditor from '../../components/admin/DomainListEditor'
import PairListEditor from '../../components/admin/PairListEditor'
import { usePolicy } from '../../lib/usePolicy'

function Section({ title, description, badge, children }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start gap-3 mb-1">
        <h2 className="text-base font-semibold text-navy">{title}</h2>
        {badge && (
          <span className="text-[10.5px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 mt-0.5">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {children}
    </section>
  )
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

export default function Policies() {
  const { policy, update, loading, error, canEdit } = usePolicy()
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-navy tracking-tight">Policies</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Control which domains and domain combinations Sendasta flags for your team.
        </p>
      </header>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">

        <Section
          title="Your Domains"
          description="Domains belonging to your organization — subsidiaries, sister companies, regional offices. Sendasta treats these as internal and never flags them."
        >
          <DomainListEditor
            value={policy?.internal_domains ?? []}
            onChange={(next) => update('internal_domains', next)}
            placeholder="yourcompany.com"
            loading={loading}
            disabled={!canEdit || loading}
            exportName="sendasta-your-domains.csv"
            importTitle="Import your domains"
          />
        </Section>

        <Section
          title="Blocked Domains"
          description="Sendasta will warn your team before sending to any of these domains — even in a single-recipient email. Use for ex-clients, competitors, or any domain that should always require a second look."
        >
          <DomainListEditor
            value={policy?.blocked_domains ?? []}
            onChange={(next) => update('blocked_domains', next)}
            placeholder="ex-client.com"
            loading={loading}
            disabled={!canEdit || loading}
            exportName="sendasta-blocked-domains.csv"
            importTitle="Import blocked domains"
          />
        </Section>

        <Divider label="Domain pair rules" />

        <Section
          title="Approved Pairs"
          description="Domain combinations your team regularly emails together. Sendasta won't flag these — add pairs here to reduce interruptions for known-safe threads."
        >
          <PairListEditor
            value={policy?.trusted_pairs ?? []}
            onChange={(next) => update('trusted_pairs', next)}
            loading={loading}
            disabled={!canEdit || loading}
            exportName="sendasta-approved-pairs.csv"
            importTitle="Import approved pairs"
          />
        </Section>

        {/* Advanced: Conflict Pairs */}
        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${advancedOpen ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            Advanced — Conflict Pairs
          </button>

          {advancedOpen && (
            <div className="mt-3">
              <Section
                title="Conflict Pairs"
                badge="Advanced"
                description="Domain pairs that must never appear on the same email — Sendasta will always warn, regardless of Approved Pairs. Use for competing clients who must never be on the same thread."
              >
                <PairListEditor
                  value={policy?.no_combine_pairs ?? []}
                  onChange={(next) => update('no_combine_pairs', next)}
                  loading={loading}
                  disabled={!canEdit || loading}
                  exportName="sendasta-conflict-pairs.csv"
                  importTitle="Import conflict pairs"
                />
              </Section>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

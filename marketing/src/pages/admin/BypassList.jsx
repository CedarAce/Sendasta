import AdminPageHeader from '../../components/admin/AdminPageHeader'
import DomainListEditor from '../../components/admin/DomainListEditor'
import { usePolicy } from '../../lib/usePolicy'

export default function BypassList() {
  const { policy, update, loading, error, canEdit } = usePolicy()

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Bypass List"
        subtitle="Your internal domains and trusted sister companies. Recipients in these domains are treated as 'safe' — Sendasta won't flag multi-domain warnings for them."
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <DomainListEditor
          value={policy?.internal_domains ?? []}
          onChange={(next) => update('internal_domains', next)}
          placeholder="your-company.com"
          loading={loading}
          disabled={!canEdit || loading}
        />
      </section>
    </div>
  )
}

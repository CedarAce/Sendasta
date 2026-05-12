import AdminPageHeader from '../../components/admin/AdminPageHeader'
import DomainListEditor from '../../components/admin/DomainListEditor'
import { usePolicy } from '../../lib/usePolicy'

export default function WarningList() {
  const { policy, update, loading, error, canEdit } = usePolicy()

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Warning List"
        subtitle="Domains that trigger a warning. Sendasta will flag any email going to these recipients and ask for confirmation before sending."
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <DomainListEditor
          value={policy?.blocked_domains ?? []}
          onChange={(next) => update('blocked_domains', next)}
          placeholder="domain-to-warn-on.com"
          loading={loading}
          disabled={!canEdit || loading}
        />
      </section>
    </div>
  )
}

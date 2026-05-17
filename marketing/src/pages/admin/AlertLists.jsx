import AdminPageHeader from '../../components/admin/AdminPageHeader'
import PairListEditor from '../../components/admin/PairListEditor'
import { usePolicy } from '../../lib/usePolicy'

export default function AlertLists() {
  const { policy, update, loading, error, canEdit } = usePolicy()

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Alert Lists"
        subtitle="Rules that warn users when recipients are mixed across sensitive domain pairs."
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-navy">No-Combine Pairs</h2>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Block sending an email if both Domain A AND Domain B are in the recipient list.
          </p>
          <PairListEditor
            value={policy?.no_combine_pairs ?? []}
            onChange={(next) => update('no_combine_pairs', next)}
            loading={loading}
            disabled={!canEdit || loading}
            exportName="sendasta-no-combine-pairs.csv"
            importTitle="Import no-combine pairs"
          />
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-navy">Trusted Pairs</h2>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            Whitelist pairs that are always allowed together, even if other rules would block them.
          </p>
          <PairListEditor
            value={policy?.trusted_pairs ?? []}
            onChange={(next) => update('trusted_pairs', next)}
            loading={loading}
            disabled={!canEdit || loading}
            exportName="sendasta-trusted-pairs.csv"
            importTitle="Import trusted pairs"
          />
        </section>
      </div>
    </div>
  )
}

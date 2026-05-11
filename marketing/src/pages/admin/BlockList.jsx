import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'
import DomainListEditor from '../../components/admin/DomainListEditor'

const INITIAL = ['competitor.com', 'restricted-vendor.com', 'old-client.com']

export default function BlockList() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Block List"
        subtitle="Domains that are hard-blocked — Sendasta will prevent any email from being sent to these recipients."
      />
      <TodoBanner>TODO: wire to Supabase (policies.blocked_domains)</TodoBanner>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <DomainListEditor initial={INITIAL} placeholder="domain-to-block.com" />
      </section>
    </div>
  )
}

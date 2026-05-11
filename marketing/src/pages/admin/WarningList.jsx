import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'
import DomainListEditor from '../../components/admin/DomainListEditor'

const INITIAL = ['competitor.com', 'restricted-vendor.com', 'old-client.com']

export default function WarningList() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Warning List"
        subtitle="Domains that trigger a warning. Sendasta will flag any email going to these recipients and ask for confirmation before sending."
      />
      <TodoBanner>TODO: wire to Supabase (policies.blocked_domains)</TodoBanner>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <DomainListEditor initial={INITIAL} placeholder="domain-to-warn-on.com" />
      </section>
    </div>
  )
}

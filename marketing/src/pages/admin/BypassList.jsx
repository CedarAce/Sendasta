import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'
import DomainListEditor from '../../components/admin/DomainListEditor'

const INITIAL = ['acme.com', 'acme-subsidiary.com']

export default function BypassList() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Bypass List"
        subtitle="Your internal domains and trusted sister companies. Recipients in these domains are treated as 'safe' — Sendasta won't flag multi-domain warnings for them."
      />
      <TodoBanner>TODO: wire to Supabase (policies.internal_domains)</TodoBanner>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <DomainListEditor initial={INITIAL} placeholder="your-company.com" />
      </section>
    </div>
  )
}

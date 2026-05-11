import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'

export default function Billing() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Billing"
        subtitle="Manage your subscription, seats, and payment method."
      />
      <TodoBanner>TODO: wire to Stripe</TodoBanner>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Current plan" value="Business" hint="$4 per user / month" />
        <Stat label="Seats" value="12 / 25" hint="13 available" />
        <Stat label="Next renewal" value="Mar 5, 2027" hint="Billed annually" />
      </div>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-navy mb-1">Subscription</h2>
        <p className="text-sm text-gray-600 mb-5">
          Update payment method, change seat count, or download invoices.
        </p>
        <button
          disabled
          className="bg-blue-accent text-white font-semibold px-5 py-2.5 rounded-lg opacity-50 cursor-not-allowed text-sm inline-flex items-center gap-2"
          title="Coming soon"
        >
          Manage Subscription
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Coming soon</span>
        </button>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-base font-semibold text-navy mb-1">Recent invoices</h2>
        <p className="text-sm text-gray-500">No invoices yet.</p>
      </section>
    </div>
  )
}

function Stat({ label, value, hint }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-navy mt-2">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{hint}</div>
    </div>
  )
}

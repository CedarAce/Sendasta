import { Link } from 'react-router-dom'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

const SECTIONS = [
  {
    title: 'Setup Guide for IT Admins',
    body: 'Step-by-step instructions to deploy Sendasta across your Microsoft 365 tenant.',
    to: '/for-it-admins',
    external: false,
  },
  {
    title: 'Frequently Asked Questions',
    body: 'Answers to common questions about how Sendasta works, pricing, and security.',
    to: '/faq',
    external: false,
  },
  {
    title: 'Contact Support',
    body: 'Reach our team for help, custom plans, or feature requests.',
    to: 'mailto:info@sendasta.com',
    external: true,
  },
]

export default function Documentation() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Documentation"
        subtitle="Guides and resources for getting the most out of Sendasta."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <DocCard key={s.title} {...s} />
        ))}
      </div>

      <section className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-base font-semibold text-navy mb-2">What does Sendasta do?</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Sendasta is an Outlook add-in that prevents accidental email leaks. It runs at the
          moment a user clicks Send and checks recipients against your organization's policies:
          blocked domains, no-combine domain pairs, trusted pairs, and bypass (internal) domains.
          If a violation is detected, the send is stopped and the user sees a clear warning.
        </p>
      </section>
    </div>
  )
}

function DocCard({ title, body, to, external }) {
  const className =
    'block bg-white rounded-lg border border-gray-200 hover:border-blue-accent p-5 transition-colors'

  if (external) {
    return (
      <a href={to} className={className}>
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{body}</p>
      </a>
    )
  }

  return (
    <Link to={to} className={className}>
      <h3 className="text-sm font-semibold text-navy">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{body}</p>
    </Link>
  )
}

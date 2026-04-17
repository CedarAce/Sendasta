function Check() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

const FREE_FEATURES = [
  'Real-time wrong-recipient warning',
  'Basic domain filter',
  'Self-install in under 5 minutes',
  'Works on Outlook web, desktop, and Mac',
]

const BUSINESS_FEATURES = [
  'Everything in Free, plus:',
  'Block specific domains for your whole team',
  'Simple settings panel — manage everyone',
  'Automatic rollout via Microsoft 365',
  'Choose which team members get it',
  'Priority email support',
]

const ENTERPRISE_FEATURES = [
  'Everything in Business, plus:',
  'Dedicated onboarding and setup session',
  'We configure your domain policy for you',
  'Priority support — 4-hour response time',
  'Quarterly policy review call',
  'Audit logs and email alert history',
  'Multi-team and department management',
  'Dedicated account contact',
]

function Card({ highlight, children }) {
  if (highlight) {
    return (
      <div className="rounded-xl p-7 flex flex-col h-full relative ring-2 ring-blue-accent" style={{ backgroundColor: '#EEF4FF' }}>
        <div className="absolute top-0 right-0 bg-blue-accent text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Most Popular
        </div>
        {children}
      </div>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-7 flex flex-col h-full">
      {children}
    </div>
  )
}

export default function PricingCards({ onContactClick }) {
  const labelClass = (highlight) =>
    `text-xs font-semibold uppercase tracking-wider ${highlight ? 'text-blue-accent' : 'text-gray-400'}`

  const priceClass = (highlight) =>
    `text-4xl font-bold ${highlight ? 'text-navy' : 'text-gray-900'}`

  const subNoteClass = (highlight) =>
    `mt-1 text-xs ${highlight ? 'text-gray-500' : 'text-gray-400'}`

  const descClass = (highlight) =>
    `mt-3 text-sm leading-relaxed ${highlight ? 'text-gray-700' : 'text-gray-500'}`

  const dividerClass = (highlight) =>
    `my-6 border-t ${highlight ? 'border-blue-accent/20' : 'border-gray-100'}`

  const featureTextClass = (highlight, isHeader) => {
    if (isHeader) return 'text-sm text-blue-accent font-medium'
    return `text-sm ${highlight ? 'text-gray-700' : 'text-gray-600'}`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">

      {/* Free */}
      <Card>
        <span className={labelClass(false)}>Free</span>
        {/* Price row — identical structure across all three cards */}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className={priceClass(false)}>$0</span>
          <span className="text-sm text-gray-400">/ forever</span>
        </div>
        <p className={subNoteClass(false)}>No sign-up. No credit card. Works today.</p>
        <p className={descClass(false)}>
          Protect yourself from autocomplete mistakes — no team setup required.
        </p>

        <div className={dividerClass(false)} />

        <ul className="flex flex-col gap-2.5 flex-1">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check />
              <span className={featureTextClass(false, false)}>{f}</span>
            </li>
          ))}
        </ul>

        <a
          href="https://sendasta.com/manifest-sendasta.xml"
          className="mt-8 block text-center border border-gray-300 hover:border-blue-accent hover:text-blue-accent text-gray-600 font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          Install Free
        </a>
        <p className="text-center text-xs text-gray-400 mt-2.5">No account needed. Works immediately.</p>
      </Card>

      {/* Business */}
      <Card highlight>
        <span className={labelClass(true)}>Business</span>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className={priceClass(true)}>$299</span>
          <span className="text-sm text-gray-500">/yr</span>
        </div>
        <p className={subNoteClass(true)}>Up to 25 people — about $25/month.</p>
        <p className={descClass(true)}>
          Protect your whole team with shared rules and easy rollout via Microsoft 365.
        </p>

        <div className={dividerClass(true)} />

        <ul className="flex flex-col gap-2.5 flex-1">
          {BUSINESS_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check />
              <span className={featureTextClass(true, f.startsWith('Everything'))}>{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onContactClick}
          className="mt-8 w-full bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          Get Started
        </button>
        <p className="text-center text-xs text-gray-500 mt-2.5">No contracts. Cancel anytime.</p>
      </Card>

      {/* Enterprise */}
      <Card>
        <span className={labelClass(false)}>Enterprise</span>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className={priceClass(false)}>Custom</span>
          {/* invisible placeholder keeps this row the same height as the other two */}
          <span className="text-sm text-transparent select-none" aria-hidden="true">/yr</span>
        </div>
        <p className={subNoteClass(false)}>100+ users. Tailored to your team.</p>
        <p className={descClass(false)}>
          Hands-on setup, deeper controls, and a dedicated contact for your organization.
        </p>

        <div className={dividerClass(false)} />

        <ul className="flex flex-col gap-2.5 flex-1">
          {ENTERPRISE_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check />
              <span className={featureTextClass(false, f.startsWith('Everything'))}>{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onContactClick}
          className="mt-8 w-full bg-navy hover:bg-navy-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          Contact Us
        </button>
        <p className="text-center text-xs text-gray-400 mt-2.5">We'll put together a custom quote.</p>
      </Card>

    </div>
  )
}

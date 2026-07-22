import { usePageMeta } from '../hooks/usePageMeta'
import { ScaleIcon, HandshakeIcon, HeartPulseIcon, ReceiptIcon, DraftingCompassIcon } from '../components/industryIcons'

const INDUSTRIES = [
  {
    id: 'law-firms',
    icon: ScaleIcon,
    eyebrow: 'For Law Firms',
    headline: 'The privilege-leak safeguard for law firms handling confidential matters.',
    body: 'Autocomplete doesn’t know the difference between "John Smith, your associate" and "John Smith, opposing counsel" — and it’s the exhausted 9pm filing-deadline sends where it swaps them. That’s not an awkward email, it’s a privilege waiver, a conflict-of-interest problem, and potentially a malpractice claim or bar complaint.',
    ctaLabel: 'Read how it works for law firms',
    ctaHref: '/industries/law-firms',
  },
  {
    id: 'm-and-a-advisors',
    icon: HandshakeIcon,
    eyebrow: 'For M&A Advisors',
    headline: 'The deal-leak safeguard for advisors running live transactions.',
    body: 'A live deal means a dozen "John"s across three data rooms, all needing an update before the deadline. One misdirected term sheet or cap table doesn’t just embarrass you — it can leak pricing to a competing bidder or trigger an NDA breach that costs you the client’s trust for good.',
    ctaLabel: 'Read how it works for M&A advisors',
    ctaHref: '/industries/m-and-a-advisors',
  },
  {
    id: 'healthcare',
    icon: HeartPulseIcon,
    eyebrow: 'For Healthcare Teams',
    headline: 'The HIPAA-safe send check for teams handling patient email.',
    body: 'It’s not negligence — it’s an understaffed clinic rushing between patients with two similarly-named charts open at once. But a misdirected email carrying PHI is a HIPAA violation with real fines, mandatory breach notification, and a possible OCR complaint, not just an awkward apology call.',
    ctaLabel: 'Read how it works for healthcare teams',
    ctaHref: '/industries/healthcare',
  },
  {
    id: 'accounting',
    icon: ReceiptIcon,
    eyebrow: 'For Accounting Firms',
    headline: 'The client-mixup safeguard for firms during tax season.',
    body: 'Tax season means a stack of similarly-named clients and an exhausted preparer at 11pm in April. A tax return or 1099 sent to the wrong client isn’t a typo — it’s an identity-theft liability for your firm and a client relationship you don’t get back.',
    ctaLabel: 'Read how it works for accounting firms',
    ctaHref: '/industries/accounting',
  },
  {
    id: 'engineering-firms',
    icon: DraftingCompassIcon,
    eyebrow: 'For Engineering Firms',
    headline: 'The IP-leak safeguard for engineering firms sharing drawings and specs.',
    body: 'Revision rounds move fast, and autocomplete doesn’t care that "Client Engineering" at the firm across town isn’t who this drawing set is for. Sending proprietary CAD files or project specs to the wrong recipient — or a competing bidder — walks your IP out the door and can cost you the bid entirely.',
    ctaLabel: 'Read how it works for engineering firms',
    ctaHref: '/industries/engineering-firms',
  },
]

export default function Industries() {
  usePageMeta({
    title: 'Industries — Sendasta for Law, M&A, Healthcare, Accounting & Engineering',
    description: 'Sendasta stops misdirected emails before they become a privilege waiver, a HIPAA violation, a blown deal, or a leaked bid — built for the industries where the wrong recipient is a career-ending mistake.',
    canonical: 'https://sendasta.com/industries',
  })

  return (
    <main className="pt-16">

      {/* Header */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Industries</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Built for the industries where the wrong recipient is a career-ending mistake
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            Autocomplete doesn’t know which "John Smith" you meant. For most people that’s an
            embarrassing follow-up email. For these industries, it’s a compliance violation, a
            blown deal, or a leaked bid.
          </p>
        </div>
      </section>

      {/* Niche sections */}
      {INDUSTRIES.map((industry, i) => {
        const Icon = industry.icon
        return (
          <section
            key={industry.id}
            id={industry.id}
            className={`py-20 px-6 scroll-mt-16 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${i < INDUSTRIES.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-accent/10 border-2 border-blue-accent/30 flex items-center justify-center text-blue-accent mb-6">
                <Icon />
              </div>
              <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">
                {industry.eyebrow}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">{industry.headline}</h2>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-2xl">
                {industry.body}
              </p>
              <a
                href={industry.ctaHref || '/#pricing'}
                className="mt-5 inline-flex items-center gap-1.5 text-blue-accent hover:underline font-semibold text-sm"
              >
                {industry.ctaLabel}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </section>
        )
      })}

      {/* Closing CTA */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Don’t see your industry?</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            If a misdirected email could hurt your business, Sendasta can help. Get started free,
            or reach out and we’ll walk you through setting up policies for your team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#pricing"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Get Started
            </a>
            <a
              href="mailto:info@sendasta.com"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/30 hover:border-white text-white font-semibold rounded-lg transition-colors text-sm"
            >
              info@sendasta.com
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}

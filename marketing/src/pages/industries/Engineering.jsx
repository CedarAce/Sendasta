import { usePageMeta } from '../../hooks/usePageMeta'

const FAQS = [
  {
    q: 'Does Sendasta read the CAD files or specs attached to the email?',
    a: "No. Sendasta only checks the addresses in the To, Cc, and Bcc fields against your firm's rules — it never opens the drawing set, the spec sheet, or any attachment. The check happens locally in Outlook the moment someone clicks Send, and nothing about the file's content is ever transmitted anywhere.",
  },
  {
    q: 'Can it stop drawings from going to a competing bidder by accident?',
    a: "Yes — flag a competing bidder's or competing firm's domain as blocked, and any email addressed to it gets paused before it sends, regardless of how the address ended up in the field. You can also flag \"no-combine\" pairs for two clients whose projects should never cross on the same thread.",
  },
  {
    q: 'Will this slow down revision rounds during a tight project schedule?',
    a: "No — the check adds under a second and only interrupts a send when it matches a rule. Every other revision send — the vast majority — goes through exactly as fast as it does today.",
  },
  {
    q: 'Can we set this up per-project instead of firm-wide?',
    a: "Individual engineers can set their own rules for the clients and projects they're personally working on. For baseline protection across every active project, an admin can also push shared blocked-domain policy to the whole firm via the Microsoft 365 Admin Center, and individuals layer their own project-specific rules on top.",
  },
]

export default function EngineeringArticle() {
  usePageMeta({
    title: 'IP-Leak Protection for Engineering Firms — Sendasta',
    description: 'How engineering firms use Sendasta to stop misdirected emails before proprietary CAD files, specs, or bid documents leak to a competing bidder.',
    canonical: 'https://sendasta.com/industries/engineering-firms',
  })

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <main className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Header */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <a href="/industries" className="text-xs font-semibold text-blue-accent uppercase tracking-widest hover:underline">
            ← Industries
          </a>
          <span className="mt-4 block text-xs font-semibold text-blue-accent uppercase tracking-widest">For Engineering Firms</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            One misdirected drawing set can hand a competitor your bid — and your IP.
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            Revision rounds move fast, and autocomplete doesn't care that "Client Engineering" at the
            firm across town isn't who this drawing set is for.
          </p>
        </div>
      </section>

      {/* The villain / stakes */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">The problem</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            It's not carelessness. It's near-identical contact names across competing bidders.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Firms bidding on the same project often deal with contacts who have nearly identical titles
              — "Project Engineer," "Client Rep" — at companies with similar-sounding names. Mid-revision,
              with three redlines open across two bids, autocomplete fills in whichever contact it saw
              most recently. The proprietary drawing set or spec sheet for one client goes to the engineer
              at a competing firm instead.
            </p>
            <p>
              That's not a document you get back. Once a competitor has your drawings, they've seen your
              approach, your specs, and often your pricing structure implied by the scope of work — enough
              to undercut your bid or replicate your design choices without the R&D cost you paid. On a
              public project, it can also trigger a procurement integrity concern if the wrong party gained
              an information advantage before award.
            </p>
            <p>
              Beyond the immediate deal, proprietary designs are IP your firm built over years. A single
              email can put that IP in a competitor's hands permanently, with no way to un-ring that bell.
            </p>
          </div>
        </div>
      </section>

      {/* What firms do today */}
      <section className="py-20 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">What firms already try</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            File-sharing platforms protect the file. They don't protect the notification email.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Many firms route drawings through a project-management or file-sharing platform (Procore,
              PlanGrid, or similar) with access controls — genuinely effective for the files themselves.
              The gap is the notification email, the quick "here's the redline" send, or the cover note
              that goes out through regular Outlook because the platform's workflow is slower than the
              deadline allows.
            </p>
            <p>
              The other standard practice is "double-check before you send during revision rounds." It's
              sound advice that competes directly with the deadline pressure of a live bid — the moment
              staff are moving fastest through revisions is exactly when the check gets skipped.
            </p>
          </div>
        </div>
      </section>

      {/* How Sendasta helps */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How Sendasta helps</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            A guardrail on the Outbox, not just the file-share platform.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Sendasta checks the recipient list — To, Cc, and Bcc — against rules your firm sets, at the
              exact moment someone clicks Send in Outlook. It never opens the drawing set or attachment,
              so your IP stays exactly as protected as it was before the check ran.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-800">Blocked domains</strong> — flag a competing firm's
                domain outright. If it shows up as a recipient, the send is paused before anything goes out.
              </li>
              <li>
                <strong className="text-gray-800">No-combine pairs</strong> — flag two client or bidder
                domains that should never appear on the same thread, useful when your firm is bidding
                against itself indirectly through different teams.
              </li>
              <li>
                <strong className="text-gray-800">Trusted pairs</strong> — mark legitimate multi-party
                combinations (a joint venture partner, a subcontractor) as trusted once, so you're not
                interrupted on routine sends.
              </li>
            </ul>
            <p>
              For firm-wide protection across every active bid, an admin pushes shared blocked-domain
              policy to every engineer's Outlook via the Microsoft 365 Admin Center. Individuals can layer
              their own project-specific rules on top for the bidders and clients on their current work.
            </p>
          </div>
          <a
            href="/#pricing"
            className="mt-6 inline-flex items-center gap-1.5 text-blue-accent hover:underline font-semibold text-sm"
          >
            See pricing for firm-wide deployment
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Questions from firms</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900 mb-6">Frequently asked</h2>
          <div className="border-t border-gray-200">
            {FAQS.map((item) => (
              <div key={item.q} className="border-b border-gray-200 py-5">
                <p className="text-base font-medium text-gray-900 leading-snug">{item.q}</p>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Protect the bid before the send, not after.</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Get started free for personal use, or reach out and we'll walk you through setting up
            firm-wide policy for your team.
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

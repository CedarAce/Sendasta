import { usePageMeta } from '../../hooks/usePageMeta'

const FAQS = [
  {
    q: 'Does Sendasta read the content of deal documents or attachments?',
    a: "No. Sendasta only checks the addresses in the To, Cc, and Bcc fields against your firm's rules. It never opens the term sheet, the cap table, or the data room link itself — the check happens locally in Outlook the moment someone clicks Send. Nothing about the deal's substance is ever transmitted anywhere.",
  },
  {
    q: 'Can it stop a term sheet from reaching a competing bidder by accident?',
    a: "Yes — flag the competing bidder's domain as blocked, and any email addressed to it gets paused before it sends, regardless of who typed it or how it ended up in the To field. You can also flag a \"no-combine\" pair if two bidders should never end up on the same thread together.",
  },
  {
    q: 'Will this slow down a live deal with dozens of emails a day?',
    a: "No — the check adds under a second and only interrupts a send when it actually matches a rule you set. Every other email — the bulk of what goes out during a live deal — sends exactly as fast as it does today.",
  },
  {
    q: 'Can different deal teams have different rules?',
    a: "Each team member's rules are their own — you're not stuck with one blanket policy across every live deal. For firm-wide guardrails (blocking known conflict-of-interest domains across all matters), an admin can push shared policy via the Microsoft 365 Admin Center on top of what individuals set.",
  },
]

export default function MAndAAdvisorsArticle() {
  usePageMeta({
    title: 'Deal-Leak Protection for M&A Advisors — Sendasta',
    description: 'How M&A advisors use Sendasta to stop misdirected emails before pricing, cap tables, or term sheets leak to the wrong bidder mid-deal.',
    canonical: 'https://sendasta.com/industries/m-and-a-advisors',
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
          <span className="mt-4 block text-xs font-semibold text-blue-accent uppercase tracking-widest">For M&A Advisors</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            One wrong recipient can hand your pricing to the bidder you're negotiating against.
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            A live deal means a dozen "John"s across three data rooms, all needing an update before
            the deadline. Autocomplete doesn't know which one you meant — it just picks the last one it saw.
          </p>
        </div>
      </section>

      {/* The villain / stakes */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">The problem</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            It's not the analyst's fault. It's the number of parallel threads.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              A live sell-side process might have three or four bidders running in parallel, each with
              their own advisor, their own John or Sarah on the deal team, and their own thread of near-
              identical subject lines — "Re: Project Falcon — Updated Model." An analyst working two bids
              at once forwards the updated cap table to the wrong "John," and now a competing bidder has
              your client's pricing floor, or worse, sees exactly what the other side is willing to pay.
            </p>
            <p>
              That's not an email you can walk back with an apology. Once a competing bidder has seen
              pricing, they adjust their offer accordingly — and your client just lost negotiating leverage
              they can't get back. If the leak involved a party under an NDA, you're also now looking at
              a breach conversation with legal, not just an awkward one with your client.
            </p>
            <p>
              And it isn't limited to pricing. Cap tables, management presentations, and diligence
              materials sent to the wrong domain can tip off employees, competitors, or the market before
              the deal is ready to be announced — turning a controlled process into a fire drill.
            </p>
          </div>
        </div>
      </section>

      {/* What firms do today */}
      <section className="py-20 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">What advisors already try</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            The data room controls access. It doesn't control your Outbox.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Most deal teams lean on a secure data room (Intralinks, Datasite, etc.) to gate who sees
              what — and it's genuinely effective for the documents that live inside it. The gap is
              everything that travels by email instead: the cover note, the summary deck, the redline
              sent for a quick turnaround because the data room workflow is too slow for an 11pm ask.
              None of that is covered once it leaves the platform.
            </p>
            <p>
              The other standard answer is "slow down and double-check the To field." That's a fine
              instinct and a terrible control during a live process, where a single senior banker might be
              sending 80+ emails a day across multiple simultaneous deals. The people best positioned to
              catch the mistake are also the ones with the least time to look for it.
            </p>
          </div>
        </div>
      </section>

      {/* How Sendasta helps */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How Sendasta helps</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            A guardrail on the Outbox, not just the data room.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Sendasta checks the recipient list — To, Cc, and Bcc — against rules you set, at the exact
              moment you click Send in Outlook. It never reads the body or attachments, so the deck, the
              model, and the cap table stay exactly as confidential as they were before the check ran.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-800">Blocked domains</strong> — flag a competing bidder's
                domain outright. If it appears as a recipient, the send is paused before anything goes out.
              </li>
              <li>
                <strong className="text-gray-800">No-combine pairs</strong> — flag two domains that should
                never appear on the same thread, like two competing bidders. Sendasta blocks the send if
                both show up, however they got there.
              </li>
              <li>
                <strong className="text-gray-800">Trusted pairs</strong> — mark legitimate multi-party
                combinations (co-advisors, lenders) as trusted once, so you're not interrupted on every
                send for a relationship you've already vetted.
              </li>
            </ul>
            <p>
              For firm-wide protection across every active mandate, an admin pushes shared blocked-domain
              rules to the whole deal team via the Microsoft 365 Admin Center. Individual bankers can layer
              their own per-deal rules on top for the parties specific to their current mandate.
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
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Questions from advisors</span>
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
          <h2 className="text-2xl font-bold text-white mb-4">Protect the deal before the send, not after.</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Get started free for personal use, or reach out and we'll walk you through setting up
            firm-wide policy for your deal teams.
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

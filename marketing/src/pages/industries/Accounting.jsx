import { usePageMeta } from '../../hooks/usePageMeta'
import { ReceiptIcon } from '../../components/industryIcons'
import SendDialogMockup from '../../components/SendDialogMockup'

const FAQS = [
  {
    q: 'Does Sendasta read the tax return or financial documents in the email?',
    a: "No. Sendasta only checks the addresses in the To, Cc, and Bcc fields against your firm's rules — it never opens the return, the 1099, or any attachment. The check happens locally in Outlook the moment someone clicks Send, and nothing about the document's contents is ever transmitted anywhere.",
  },
  {
    q: 'Can it stop a return from going to a client with a similar name at a different email?',
    a: "It stops sends to domains and combinations you've flagged, not name-matching within a single domain — so it won't catch two clients at the same company with the same first name. Where it excels is the more common failure: a client's info going to the wrong company domain entirely, which you can block outright, or two client domains that should never end up on the same thread.",
  },
  {
    q: 'Will this slow staff down during tax season crunch?',
    a: "No — the check adds under a second and only interrupts a send when it matches a rule you've set. The other sends — the bulk of what goes out during crunch — go through exactly as fast as they do today.",
  },
  {
    q: 'Can we roll this out to the whole firm before the next filing season?',
    a: "Yes — an admin can push shared policy to every preparer's Outlook via the Microsoft 365 Admin Center in one deployment, with no per-user setup required. It typically takes about five minutes to configure and roll out firm-wide.",
  },
]

export default function AccountingArticle() {
  usePageMeta({
    title: 'Client-Mixup Protection for Accounting Firms — Sendasta',
    description: 'How accounting firms use Sendasta to stop misdirected emails before a tax return or 1099 lands in the wrong client\'s inbox during tax season.',
    canonical: 'https://sendasta.com/industries/accounting',
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
          <div className="mt-6 w-14 h-14 rounded-full bg-blue-accent/10 border-2 border-blue-accent/30 flex items-center justify-center text-blue-accent">
            <ReceiptIcon className="w-7 h-7" />
          </div>
          <span className="mt-4 block text-xs font-semibold text-blue-accent uppercase tracking-widest">For Accounting Firms</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            A tax return sent to the wrong client isn't a typo — it's an identity-theft liability.
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            Tax season means a stack of similarly-named clients and an exhausted preparer at 11pm in
            April. Autocomplete doesn't slow down to check which one you meant.
          </p>
        </div>
      </section>

      {/* The villain / stakes */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">The problem</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            It's not sloppy work. It's 200 clients and one filing deadline.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              A preparer working through a queue of returns at 11pm in April, three weeks from the
              deadline, hits Send on a completed return — and autocomplete fills in a different client
              with a similar name from earlier that day. The return contains a Social Security number,
              income details, and bank routing information for direct deposit. All of it just went to a
              stranger.
            </p>
            <p>
              That's not a correction email away from resolved. Once a full tax return is in someone
              else's inbox, your firm has a genuine identity-theft exposure to report — to the affected
              client, and potentially under state data breach notification laws depending on what was in
              the document and where the client is located. IRS Circular 230 obligations around client
              information don't distinguish between a malicious leak and an autocomplete accident.
            </p>
            <p>
              Beyond the compliance exposure, there's the relationship cost: a client whose SSN and
              financials went to a stranger doesn't stay a client, and word travels fast among the
              referral network that built your book of business in the first place.
            </p>
          </div>
          <div className="mt-10">
            <SendDialogMockup
              heading="Flagged combination detected"
              note="This email is addressed to two client domains that shouldn't appear together:"
              domains={['smithfamilytrust.com', 'jonesenterprises.com']}
            />
            <p className="mt-3 text-center text-xs text-gray-400">
              What the sender sees in Outlook — before the email leaves the outbox.
            </p>
          </div>
        </div>
      </section>

      {/* What firms do today */}
      <section className="py-20 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">What firms already try</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            A second pair of eyes doesn't exist at 11pm in April.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Some firms build in a review step — a second preparer checks the recipient before sending
              anything with SSNs or financials attached. It works when staffing allows for it. During peak
              season, when everyone is buried in their own queue, that second review is usually the first
              thing to get skipped under deadline pressure.
            </p>
            <p>
              Secure client portals solve this for the documents that go through them, but portals add
              friction clients resist, and preparers under time pressure default back to "just email it" for
              anything that feels routine — which is exactly the category of send where the mistake happens.
            </p>
            <p>
              Password-protecting attachments helps if the document is intercepted in transit, but it does
              nothing if the recipient was simply wrong — the wrong person just gets a password-protected
              copy of someone else's tax return instead of an unprotected one.
            </p>
          </div>
        </div>
      </section>

      {/* How Sendasta helps */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How Sendasta helps</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            A check that doesn't get tired at hour twelve of the shift.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Sendasta checks the recipient list — To, Cc, and Bcc — against rules your firm sets, at the
              exact moment someone clicks Send in Outlook. It never opens the return or the attachment, so
              client financials stay exactly as private as they were before the check ran.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-800">Blocked domains</strong> — flag any domain that
                shouldn't be receiving client tax documents. If it appears as a recipient, the send is
                paused before it goes out.
              </li>
              <li>
                <strong className="text-gray-800">No-combine pairs</strong> — flag two client domains that
                should never appear on the same thread, useful when preparers juggle multiple businesses
                under related entities.
              </li>
              <li>
                <strong className="text-gray-800">Trusted pairs</strong> — mark a client's known secondary
                contacts (a spouse, a bookkeeper) as trusted once, so legitimate multi-recipient sends
                aren't interrupted every time.
              </li>
            </ul>
            <p>
              For firm-wide protection ahead of the next filing season, an admin sets policy once and rolls
              it out to every preparer's Outlook via the Microsoft 365 Admin Center — no per-user setup,
              and no relying on a tired preparer to catch it themselves.
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
          <h2 className="text-2xl font-bold text-white mb-4">Get ahead of next filing season.</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Get started free for personal use, or reach out and we'll walk you through setting up
            firm-wide policy before the next deadline crunch.
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

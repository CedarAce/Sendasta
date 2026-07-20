import { usePageMeta } from '../../hooks/usePageMeta'

const FAQS = [
  {
    q: 'Does Sendasta read patient information in the email?',
    a: "No. Sendasta only checks the addresses in the To, Cc, and Bcc fields against your organization's rules — it never opens the body or attachments, so it never sees PHI. The check runs locally in Outlook the moment someone clicks Send, and nothing is transmitted to a server.",
  },
  {
    q: 'Is Sendasta itself HIPAA compliant, since it touches recipient addresses?',
    a: "Sendasta is designed with a minimal data footprint by intent — it doesn't transmit or store email content, and the business tier strips personally identifying fields from the anonymized usage analytics it does send. Because it never processes PHI, it doesn't require a Business Associate Agreement (BAA) to use. If your organization needs a signed BAA for procurement reasons regardless, reach out at info@sendasta.com.",
  },
  {
    q: 'Can it stop PHI from going to a personal email address, like a Gmail account?',
    a: 'Yes — flag personal email domains (gmail.com, yahoo.com, etc.) as blocked, and any email addressed to one is paused before it sends. This catches the common case of a staff member forwarding something to their own personal account "to work on later."',
  },
  {
    q: 'Will this slow down front-desk or clinical staff during a busy shift?',
    a: "No — the check runs in under a second and only interrupts a send when it matches a rule. The other 99% of sends — appointment confirmations, internal notes, routine correspondence — go through exactly as fast as they do today.",
  },
]

export default function HealthcareArticle() {
  usePageMeta({
    title: 'HIPAA-Safe Email Checks for Healthcare Teams — Sendasta',
    description: 'How healthcare teams use Sendasta to stop misdirected emails carrying PHI before they become a HIPAA violation and a breach notification.',
    canonical: 'https://sendasta.com/industries/healthcare',
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
          <span className="mt-4 block text-xs font-semibold text-blue-accent uppercase tracking-widest">For Healthcare Teams</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            One misdirected email carrying PHI is a breach — not an apology call.
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            Two similarly-named patient charts open at once, a rushed send between appointments,
            and autocomplete fills in the wrong recipient. That's not negligence — it's an understaffed
            clinic moving fast. But HIPAA doesn't grade on intent.
          </p>
        </div>
      </section>

      {/* The villain / stakes */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">The problem</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            It's not carelessness. It's volume, understaffing, and identical names.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              A front-desk coordinator or care manager sends dozens of patient-related emails a day —
              referrals, lab result summaries, scheduling notes — often between patients, often with two
              tabs and two nearly identical names open at once. Autocomplete doesn't know that "Jane Doe"
              in one thread isn't the "Jane Doe" you mean in this one. It just fills in whichever name it
              saw most recently.
            </p>
            <p>
              Under HIPAA, an email carrying protected health information (PHI) sent to the wrong recipient
              is a reportable breach in most cases — not a technicality. Depending on scope, that can mean
              mandatory breach notification to the patient, potential notification to HHS Office for Civil
              Rights, and civil penalties that scale with how many records were exposed and whether the
              breach reflects a pattern rather than a one-off.
            </p>
            <p>
              The cost isn't just the fine. It's the OCR complaint process, the corrective action plan, and
              — for a small practice — the reputational hit of a patient finding out their diagnosis or
              treatment details went to a stranger's inbox.
            </p>
          </div>
        </div>
      </section>

      {/* What teams do today */}
      <section className="py-20 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">What teams already try</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Training covers the policy. It doesn't cover the busy Tuesday.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Most practices run annual HIPAA training that includes "double-check the recipient before
              sending PHI." It's good guidance and it doesn't survive contact with a full waiting room —
              the moment staff are most rushed is exactly the moment they're least likely to pause and verify.
            </p>
            <p>
              Encrypted email platforms help with interception in transit, but they don't stop the message
              from reaching the wrong person in the first place — encryption protects the pipe, not the
              address book. If the recipient is simply wrong, encryption faithfully delivers the PHI to
              them anyway.
            </p>
            <p>
              Enterprise DLP tools can scan for PHI-shaped content (patterns like diagnosis codes or
              insurance numbers), but they're expensive to configure for a small or mid-size practice and
              still don't catch the simplest failure mode: the right patient's info sent to the wrong
              similarly-named recipient, where nothing about the content itself looks unusual.
            </p>
          </div>
        </div>
      </section>

      {/* How Sendasta helps */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How Sendasta helps</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            A check on who it's going to — right before it goes.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Sendasta checks the recipient list — To, Cc, and Bcc — against rules your practice sets, at
              the exact moment someone clicks Send in Outlook. It never reads the body or attachments, so
              it never touches PHI — which also means it doesn't add HIPAA exposure of its own.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-800">Blocked domains</strong> — flag personal email domains
                (Gmail, Yahoo, etc.) or known-wrong destinations outright. If one shows up as a recipient,
                the send is paused before it goes out.
              </li>
              <li>
                <strong className="text-gray-800">No-combine pairs</strong> — flag two domains that should
                never appear together on a thread, useful when the same staff member handles correspondence
                for multiple unaffiliated practices or referral partners.
              </li>
              <li>
                <strong className="text-gray-800">Trusted pairs</strong> — mark legitimate recurring
                combinations (a lab partner, a referral network) as trusted once, so routine sends aren't
                interrupted.
              </li>
            </ul>
            <p>
              For a clinic or practice group, an admin sets policy once and rolls it out to every staff
              member's Outlook via the Microsoft 365 Admin Center — no per-user configuration, and no
              relying on each employee to remember to slow down.
            </p>
          </div>
          <a
            href="/#pricing"
            className="mt-6 inline-flex items-center gap-1.5 text-blue-accent hover:underline font-semibold text-sm"
          >
            See pricing for practice-wide deployment
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Questions from healthcare teams</span>
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
          <h2 className="text-2xl font-bold text-white mb-4">Catch it before it becomes a breach report.</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Get started free for personal use, or reach out and we'll walk you through setting up
            practice-wide policy for your team.
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

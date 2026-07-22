import { usePageMeta } from '../../hooks/usePageMeta'
import { ScaleIcon } from '../../components/industryIcons'
import SendDialogMockup from '../../components/SendDialogMockup'

const FAQS = [
  {
    q: 'Does Sendasta read the content of my emails or attachments?',
    a: "No. Sendasta only checks the addresses in the To, Cc, and Bcc fields against your firm's rules. It never opens, scans, or transmits the subject line, body, or attachments — the check happens locally in Outlook at the moment you click Send. Nothing privileged ever leaves your machine.",
  },
  {
    q: "Can Sendasta stop an email to opposing counsel's domain on a matter where they shouldn't be included?",
    a: "Yes — that's what \"no-combine pairs\" are for. You flag two domains that should never appear on the same thread (say, opposing counsel and your client), and if autocomplete or a stray Cc puts both on one email, Sendasta blocks the send until someone reviews it.",
  },
  {
    q: 'Will this slow down associates during a filing deadline?',
    a: "No — the check runs in under a second and only interrupts you when something actually matches a rule. Every other send goes through exactly as fast as it does today. It's designed for the 9pm deadline crunch, not against it.",
  },
  {
    q: 'Do we need firm-wide IT approval to use this, or can one attorney try it first?',
    a: "Either works. Personal use (checking your own To field) is free and installs in minutes with no IT involvement. Firm-wide policy — shared blocked domains, no-combine pairs, and Cc/Bcc checking — is the paid tier and typically gets rolled out by IT or a managing partner across everyone at once.",
  },
]

export default function LawFirmsArticle() {
  usePageMeta({
    title: 'Email Privilege Protection for Law Firms — Sendasta',
    description: 'How law firms use Sendasta to stop misdirected emails before they become a privilege waiver, a conflict-of-interest problem, or a malpractice claim.',
    canonical: 'https://sendasta.com/industries/law-firms',
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
            <ScaleIcon className="w-7 h-7" />
          </div>
          <span className="mt-4 block text-xs font-semibold text-blue-accent uppercase tracking-widest">For Law Firms</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            One misdirected email can waive privilege on a matter you've spent months protecting.
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            Autocomplete doesn't know the difference between "John Smith, your associate" and "John Smith,
            opposing counsel." At a firm, that isn't an awkward correction — it's a disclosure you can't take back.
          </p>
        </div>
      </section>

      {/* The villain / stakes */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">The problem</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            It's not the careless associate. It's the deadline.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              The misdirected email doesn't happen on a slow Tuesday morning. It happens at 8:52pm, eight
              minutes before a filing deadline, when someone is drafting a reply to a client named John Smith
              while a discovery email thread with opposing counsel's John Smith is still open in another window.
              Outlook autocomplete fills in whichever John it saw more recently. Nobody notices until the
              read receipt comes back from the wrong side.
            </p>
            <p>
              At most firms, that single click is the difference between a routine status update and a
              violation of the duty of confidentiality under ABA Model Rule 1.6 — or the functional equivalent
              in your jurisdiction's rules of professional conduct. Once privileged material lands in an
              adversary's inbox, you can't un-send it. Courts have found subject-matter waiver over exactly
              this kind of accident, and even where a "claw-back" or inadvertent-disclosure clause exists in
              a protective order, you're now spending partner hours negotiating around a mistake instead of
              billing the matter.
            </p>
            <p>
              And it's rarely just embarrassment. A privileged email sent to the wrong recipient can trigger a
              conflicts review, a malpractice notification to your carrier, or a bar complaint if the client
              finds out before you tell them. The firm's exposure doesn't scale with how "obvious" the mistake
              was — it scales with what was in the email.
            </p>
          </div>
          <div className="mt-10">
            <SendDialogMockup type="no-combine" domains={['clientco.com', 'opposingcounsel-law.com']} />
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
            "Double-check before you send" doesn't survive a busy Tuesday.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Most firms' answer to this risk is a policy, not a system: review the recipient list before
              you hit Send. That works exactly until the associate is juggling four matters at once and the
              email is the fortieth one that day. Policy that depends on a tired human remembering to slow
              down at the exact moment they're least likely to isn't a control — it's a hope.
            </p>
            <p>
              Enterprise DLP (data loss prevention) tools exist, but they're built for a different problem —
              scanning content for social security numbers or credit card patterns — and they're expensive,
              IT-heavy to configure, and blind to the thing that actually matters at a law firm: <em>who</em>{' '}
              is on the thread, not what's in the body. A DLP rule won't catch "opposing counsel got Cc'd,"
              because nothing in the text looks sensitive. The problem is purely about the recipient list, and
              most tools weren't built to look there.
            </p>
            <p>
              Some firms add a "delay send" rule — a five-minute window to recall a message. It helps
              sometimes. It does nothing if the recipient already has their inbox open, which, at 8:52pm before
              a deadline, is often exactly when they do.
            </p>
          </div>
        </div>
      </section>

      {/* How Sendasta helps */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How Sendasta helps</span>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            A check that runs at the one moment it matters — right before Send.
          </h2>
          <div className="mt-5 text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Sendasta sits inside Outlook and checks the recipient list — To, Cc, and Bcc — against rules
              your firm sets, at the exact moment someone clicks Send. It doesn't read the email body or
              attachments, and nothing is transmitted to a server: the check runs locally, which matters when
              the thing you're protecting is privilege in the first place.
            </p>
            <p>
              Three rule types cover how firms actually get burned:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-gray-800">Blocked domains</strong> — flag a competing firm or an
                adversary's domain outright. If it shows up as a recipient, the send is paused before it
                goes out.
              </li>
              <li>
                <strong className="text-gray-800">No-combine pairs</strong> — the one built specifically for
                the John Smith problem. Flag two domains that should never appear on the same thread (your
                client and opposing counsel, for instance), and Sendasta blocks the send if both are present,
                regardless of how they got there.
              </li>
              <li>
                <strong className="text-gray-800">Trusted pairs</strong> — for the legitimate exceptions
                (co-counsel, a client's outside vendor), mark the combination as trusted once and you won't
                be interrupted again.
              </li>
            </ul>
            <p>
              For firm-wide protection, an admin sets these policies once and pushes them to every attorney's
              Outlook via the Microsoft 365 Admin Center — no per-user setup, no relying on each associate to
              configure it themselves. Personal use (checking just your own To field) is free and takes minutes
              to install if you want to try it before rolling it out firm-wide.
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
          <h2 className="text-2xl font-bold text-white mb-4">Protect privilege before the send, not after.</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Get started free for personal use, or reach out and we'll walk you through setting up firm-wide
            policy for your team.
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

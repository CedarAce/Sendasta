import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQS = [
  {
    category: 'Privacy & Security',
    questions: [
      {
        q: 'Does Sendasta read or store my emails?',
        a: 'No. Sendasta only checks the recipient addresses on an email — it never reads the subject line, body, or attachments. Nothing is sent to Sendasta servers. The check happens locally inside Outlook at the moment you click Send.',
      },
      {
        q: 'Where are my rules and settings stored?',
        a: "Your domain rules and preferences are stored in Microsoft's own roaming settings (Office.context.roamingSettings) — the same place Outlook stores your other add-in preferences. Sendasta does not maintain a copy on its own servers.",
      },
      {
        q: 'Is Sendasta compliant with GDPR and PIPEDA?',
        a: "Yes — by design. Because Sendasta doesn't transmit or store email content or recipient data, it has a minimal data footprint. It's used in environments subject to GDPR, PIPEDA, and attorney-client privilege obligations.",
      },
    ],
  },
  {
    category: 'Compatibility',
    questions: [
      {
        q: 'Which versions of Outlook does Sendasta support?',
        a: 'Sendasta works on Outlook on the web (OWA), Outlook for Windows (desktop), and new Outlook for Mac. It requires a Microsoft 365 account. It does not work with the legacy classic Outlook for Mac or standalone (non-365) Outlook.',
      },
      {
        q: 'Does it work with Gmail or Apple Mail?',
        a: 'No — Sendasta is built specifically for Microsoft Outlook and the Microsoft 365 ecosystem. Gmail and Apple Mail are not supported.',
      },
      {
        q: 'Does it work on mobile?',
        a: "Sendasta runs as an Outlook add-in and is active wherever Outlook's add-in runtime is available — primarily web and desktop. Mobile Outlook apps have limited add-in support from Microsoft and are not currently covered.",
      },
    ],
  },
  {
    category: 'How It Works',
    questions: [
      {
        q: 'What exactly happens when I click Send?',
        a: "Before the email leaves your outbox, Sendasta checks the recipient list against your configured rules. If everything is fine, the email sends normally — you won't notice anything. If a recipient matches a blocked domain or a flagged combination, Sendasta pauses the send and shows you a warning.",
      },
      {
        q: 'Does Sendasta block emails, or just warn?',
        a: 'It warns. When you click Send, Sendasta checks the recipients against your rules and shows a popup if something matches — the wrong domain, a competitor, a mixed thread. You can also configure trusted combinations that are always allowed through without prompting. The decision to send is always yours.',
      },
      {
        q: 'What if I genuinely need to send to a flagged domain?',
        a: "You'll see a confirmation prompt with the recipients and the rule that fired. Review it, and if the warning's a false alarm, choose \"Send Anyway\" to proceed. You can also add the recipient pair to your Trusted list so you're not asked again.",
      },
      {
        q: 'Can I flag combinations of recipients — not just individual domains?',
        a: 'Yes. "No-combine pairs" let you flag situations where two specific domains appear together on the same email — useful when you work with competing clients who should never be on the same thread.',
      },
    ],
  },
  {
    category: 'Setup & Deployment',
    questions: [
      {
        q: 'How long does it take to install?',
        a: "About 5 minutes for a personal install. For a team rollout through Microsoft 365 Admin Center, it's also around 5 minutes — one deployment covers everyone with no per-user action required.",
      },
      {
        q: 'Do I need IT to set it up?',
        a: "Not for personal use — anyone can install it directly from the Microsoft AppSource or via a direct manifest link. For organization-wide deployment, you'll need access to the Microsoft 365 Admin Center, which is typically an IT admin or global admin role.",
      },
      {
        q: 'Do employees need to configure it themselves after the admin deploys it?',
        a: "No. Admins can push a shared set of domain rules to the whole team — employees get Sendasta active in their Outlook with your rules already applied. Individual users can also add their own personal rules on top of the shared ones.",
      },
    ],
  },
  {
    category: 'Pricing & Trial',
    questions: [
      {
        q: 'Is there a free plan?',
        a: 'Yes — Sendasta is free for personal use, forever. The free plan covers real-time recipient warnings and basic domain filtering for a single user with no sign-up required.',
      },
      {
        q: 'What does the paid plan include?',
        a: 'The Business plan adds team-wide shared rules, organization-level domain blocking, Cc/Bcc recipient checking, automatic rollout via Microsoft 365 Admin, and priority support. $5 per user per month, flat.',
      },
      {
        q: 'Is there a free trial for the paid plan?',
        a: "Yes — 30 days, full access. Cancel anytime before the trial ends and you won't be charged. Get in touch at info@sendasta.com and we'll get you set up.",
      },
    ],
  },
]

function Item({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-base font-medium text-gray-900 group-hover:text-navy transition-colors leading-snug">
          {q}
        </span>
        <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${open ? 'bg-blue-accent border-blue-accent' : 'group-hover:border-blue-accent'}`}>
          <svg className={`w-2.5 h-2.5 transition-transform ${open ? 'rotate-180 text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm text-gray-600 leading-relaxed -mt-1">{a}</p>
      )}
    </div>
  )
}

export default function FAQ() {
  usePageMeta({
    title: 'FAQ — Sendasta',
    description: 'Answers to common questions about how Sendasta works, privacy, Outlook compatibility, team setup, and pricing.',
    canonical: 'https://sendasta.com/faq',
  })

  return (
    <main className="pt-24 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">FAQ</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Common questions
          </h1>
          <p className="mt-4 text-gray-500 text-base leading-relaxed">
            Can't find what you're looking for?{' '}
            <a href="mailto:info@sendasta.com" className="text-blue-accent hover:underline">Email us</a> — a real person answers.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-12">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs font-semibold text-blue-accent uppercase tracking-widest mb-1">
                {section.category}
              </h2>
              <div className="border-t border-gray-200">
                {section.questions.map((item) => (
                  <Item key={item.q} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 rounded-xl bg-[#EEF4FF] border border-blue-accent/20 p-8 text-center">
          <p className="text-base font-semibold text-navy">Still have questions?</p>
          <p className="mt-2 text-sm text-gray-600">We're happy to walk you through setup or answer anything specific to your team.</p>
          <a
            href="mailto:info@sendasta.com"
            className="mt-5 inline-block bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Email info@sendasta.com
          </a>
        </div>

      </div>
    </main>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import PricingCards from '../components/PricingCards'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQ_ITEMS = [
  {
    q: 'Do I need to be technical to set this up?',
    a: 'Not at all. Installing Sendasta for yourself takes about 5 minutes and just involves adding it from a URL inside Outlook — no code, no IT knowledge needed. If you want to roll it out to your whole team at once, we have a simple step-by-step guide that walks you through it.',
  },
  {
    q: 'What is the difference between Personal and Business?',
    a: 'Personal is free forever — it gives every individual real-time conflicting-domain warnings in their own inbox, with no account or sign-in required. Business is for teams: a central admin console where you set domain rules once (blocked domains, internal-domain bypass, no-combine pairs, trusted pairs), Cc and Bcc recipient checking, automatic rollout via Microsoft 365 Admin, and priority support.',
  },
  {
    q: 'Does this require the Microsoft AppSource store?',
    a: 'No. Sendasta is installed directly — either by you in Outlook, or across your team via the Microsoft 365 admin settings. No store approval, no waiting, no IT helpdesk ticket.',
  },
  {
    q: 'Can I try Business before paying?',
    a: "Yes — Business comes with a 30-day free trial. You won't be charged until the trial ends, and you can cancel anytime before then. If you have a larger team or specific compliance requirements, email info@sendasta.com and we'll set you up with whatever you need.",
  },
  {
    q: 'What information does Sendasta see?',
    a: "Sendasta only looks at the email domain names of your recipients at the moment you hit send — to check them against your rules. It does not read your email content, store your messages, or share your data with anyone. See our Privacy Policy for full details.",
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-medium text-gray-900 text-sm leading-snug">{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  )
}

export default function Pricing() {
  usePageMeta({
    title: 'Pricing — Sendasta | Free Personal & Business Plans',
    description: 'Free forever for personal use. $4/user/month for teams — central admin console, team-wide domain rules, and Microsoft 365 rollout. No contracts, cancel anytime.',
    canonical: 'https://sendasta.com/pricing',
  })

  const scrollToContact = () => {
    window.location.href = '/#contact'
  }

  return (
    <main className="pt-16">

      {/* Header */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Pricing</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-5 text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
            Free to try on your own. Affordable for your whole team — no contracts, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <PricingCards onContactClick={scrollToContact} />
        </div>
      </section>

      {/* Comparison note */}
      <section className="py-10 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            Personal is free forever — real-time conflicting-domain warnings, no account needed.
            Business adds team-wide domain rules, a central admin console, and Microsoft 365 rollout.{' '}
            <Link to="/for-it-admins" className="text-blue-accent hover:underline">
              View deployment guide
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">FAQ</span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Common questions</h2>
          </div>

          <div className="border border-gray-200 rounded-xl px-6">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}

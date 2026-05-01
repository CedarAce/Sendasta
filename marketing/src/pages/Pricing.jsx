import { useState } from 'react'
import { Link } from 'react-router-dom'
import PricingCards from '../components/PricingCards'
import { usePageMeta } from '../hooks/usePageMeta'

const FAQ_ITEMS = [
  {
    q: 'Do I need to be technical to set this up?',
    a: 'Not at all. Installing Sendasta for yourself takes about 5 minutes and just involves adding it from a URL inside Outlook — no code, no IT knowledge needed. If you want to roll it out to your whole team at once, we have a simple step-by-step guide that walks you through it. Enterprise customers get a dedicated onboarding session where we handle setup for you.',
  },
  {
    q: 'What is the difference between Business and Enterprise?',
    a: 'Business is self-serve — you set up your rules, roll it out to your team (up to 25 people), and manage settings yourself. Enterprise is for larger teams (100+ users) and includes a dedicated onboarding session, we configure your domain policies for you, priority support with a 4-hour response time, quarterly review calls, audit logs, and a named account contact. Pricing is custom based on your team size.',
  },
  {
    q: 'Does this require the Microsoft AppSource store?',
    a: 'No. Sendasta is installed directly — either by you in Outlook, or across your team via the Microsoft 365 admin settings. No store approval, no waiting, no IT helpdesk ticket.',
  },
  {
    q: 'Can I try Business or Enterprise before paying?',
    a: "Yes. Send us a message and we'll set you up with a trial so you can see the full feature set in action before committing to anything.",
  },
  {
    q: 'What information does Sendasta see?',
    a: "Sendasta only looks at the email domain names of your recipients at the moment you hit send — to check them against your rules. It does not read your email content, store your messages, or share your data with anyone. See our Privacy Policy for full details.",
  },
  {
    q: 'What happens if I need more than 25 users but am not sure about Enterprise?',
    a: "Just reach out — we'll have a quick chat and find the right fit. There's no pressure and no hard cutoff.",
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
    title: 'Pricing — Sendasta | Free, Business & Enterprise Plans',
    description: 'Free for personal use. $299/year for teams up to 25 people. Enterprise plans with dedicated onboarding for larger organizations. No contracts, cancel anytime.',
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
            All plans include real-time wrong-recipient warnings. Business adds team-wide rules and rollout.
            Enterprise adds hands-on setup, audit logs, and dedicated support.{' '}
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

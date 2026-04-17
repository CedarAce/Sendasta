import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PricingCards from '../components/PricingCards'

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function InstallIcon() {
  return (
    <svg className="w-7 h-7 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

function ConfigureIcon() {
  return (
    <svg className="w-7 h-7 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="w-7 h-7 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="w-7 h-7 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg className="w-7 h-7 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg className="w-7 h-7 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

function QuoteIcon() {
  return (
    <svg className="w-8 h-8 text-blue-accent/30" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */

function Hero({ onDemoClick }) {
  return (
    <section className="bg-navy pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-blue-accent text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-8">
          Microsoft Outlook Add-in
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Stop the Wrong Email<br className="hidden md:block" /> Before It's Too Late
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          One wrong autocomplete and your client's contract lands in a competitor's inbox.
          Sendasta warns you the moment it spots the wrong recipient — before you hit send.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://sendasta.com/manifest-sendasta.xml"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Install Free — No Sign-up
          </a>
          <button
            onClick={onDemoClick}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/40 hover:border-white text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Contact Us
          </button>
        </div>
        <p className="mt-4 text-gray-500 text-xs">Free forever for personal use. No credit card needed.</p>

        {/* Microsoft 365 trust badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M12 1h10v10H12z"/>
            <path fill="#7fba00" d="M1 12h10v10H1z"/>
            <path fill="#ffb900" d="M12 12h10v10H12z"/>
          </svg>
          <span>Works exclusively with Microsoft 365 &amp; Outlook</span>
        </div>

        {/* Who it's for — industry pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-gray-500 text-xs font-medium">Used by:</span>
          {['Law Firms', 'Accounting', 'Consultancies', 'Recruiters', 'Real Estate', 'Finance'].map(tag => (
            <span key={tag} className="bg-white/10 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Demo video */}
      <div className="mt-16 max-w-3xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <video
          className="w-full"
          src="/assets/videos/video01.mp4"
          poster="/assets/videos/video01_poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </section>
  )
}

/* ─── Social Proof Bar ──────────────────────────────────────────────────── */

function SocialProofBar() {
  const stats = [
    { value: '1 in 3', label: 'employees has sent an email to the wrong person' },
    { value: 'Free', label: 'to try — no credit card, no sign-up, works today' },
    { value: '5 min', label: 'to set up — no IT experience needed' },
  ]

  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-gray-100">
        {stats.map((s) => (
          <div key={s.value} className="text-center md:px-8">
            <p className="text-3xl font-extrabold text-blue-accent">{s.value}</p>
            <p className="mt-2 text-sm text-gray-500 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Problem ───────────────────────────────────────────────────────────── */

function Problem() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#EEF4FF' }}>
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Sound familiar?</span>
        <p className="mt-5 text-2xl md:text-3xl font-semibold text-navy leading-snug">
          Every day, someone at a small business sends a sensitive email to the wrong person —
          a former client, a competitor, or the wrong "John Smith" in their contacts.
          Outlook's autocomplete makes it easy to miss.
        </p>
        <p className="mt-6 text-lg text-blue-accent font-semibold">
          Sendasta catches it before it leaves your outbox.
        </p>
      </div>
    </section>
  )
}

/* ─── How It Works ──────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      icon: <InstallIcon />,
      title: 'Install in minutes — no IT expertise needed',
      desc: 'Add Sendasta to Outlook in a few clicks — for yourself, or for your whole team. Works on Outlook web, desktop, and Mac. No technical knowledge required.',
    },
    {
      icon: <ConfigureIcon />,
      title: 'Tell it who to watch out for',
      desc: 'Add the domains you want Sendasta to flag — a competitor, a personal email address, a client that should never be mixed with another. Takes about 2 minutes to set up.',
    },
    {
      icon: <AlertIcon />,
      title: 'Sendasta quietly checks every email you send',
      desc: 'The moment you click send, Sendasta checks your recipients. If something looks off, it pauses and gives you a chance to review — before the email goes anywhere.',
    },
  ]

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How It Works</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            Simple to set up. Works in the background.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-start md:items-center gap-5 relative">
              {/* Connector line to next step — desktop only */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute h-px bg-gray-200 z-0"
                  style={{ top: '1.75rem', left: '50%', width: 'calc(100% + 2.5rem)' }}
                />
              )}
              {/* Large numbered circle */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-navy text-white font-extrabold text-xl flex-shrink-0">
                {i + 1}
              </div>
              <div className="md:text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Features ──────────────────────────────────────────────────────────── */

function Features() {
  const features = [
    {
      icon: <ShieldIcon />,
      title: 'Catches the wrong recipient instantly',
      desc: "The moment you add someone from the wrong company, Sendasta flags it. A quick popup gives you a chance to double-check before anything is sent — every single time.",
    },
    {
      icon: <ListIcon />,
      title: 'Block specific domains entirely',
      desc: 'Add a list of email domains that should never receive your emails — competitors, personal addresses, or anyone off-limits. Sendasta will alert you or stop the send automatically.',
    },
    {
      icon: <DashboardIcon />,
      title: 'Easy settings for your whole team',
      desc: 'Set your rules once and apply them across everyone on your team. Perfect for a small business where one person handles the tech side — no ongoing maintenance needed.',
    },
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Features</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            Everything you need. Nothing you don't.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow bg-white border-t-4 border-blue-accent">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-accent/10 rounded-xl mb-6">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials placeholder ──────────────────────────────────────────── */

function Testimonials() {
  /* PLACEHOLDER — Replace these three cards with real customer quotes before publishing.
     Aim for quotes from small business owners, office managers, or founders.
     Even one or two lines work: "We almost emailed a client list to the wrong firm. Sendasta caught it." — Jane S., Principal, [Firm Name] */
  const placeholders = [
    {
      quote: '"We almost emailed a confidential proposal to the wrong client. Sendasta caught it immediately — I didn\'t even realise autocomplete had filled in the wrong address."',
      name: 'Add a real customer name here',
      title: 'Owner, [Company]',
    },
    {
      quote: '"Set it up in about 10 minutes. It just runs quietly in the background and I don\'t have to think about it. Worth every penny."',
      name: 'Add a real customer name here',
      title: 'Office Manager, [Company]',
    },
    {
      quote: '"Our team works with competing clients. Sendasta makes sure we never accidentally CC the wrong one. It\'s become part of how we work."',
      name: 'Add a real customer name here',
      title: 'Founder, [Company]',
    },
  ]

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">What customers say</span>
          <h2 className="mt-3 text-3xl font-bold text-gray-900">Used by small businesses every day</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {placeholders.map((t, i) => (
            <div key={i} className="border-l-4 border-blue-accent bg-gray-50 rounded-r-xl p-7 flex flex-col gap-5">
              <QuoteIcon />
              <p className="text-gray-700 text-sm leading-relaxed italic">{t.quote}</p>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reminder for site owner */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Replace the placeholder quotes above with real customer feedback before publishing.
        </p>
      </div>
    </section>
  )
}

/* ─── Pricing Section ───────────────────────────────────────────────────── */

function PricingSection({ onContactClick }) {
  return (
    <section className="py-24 px-6 bg-gray-50" id="pricing">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            Free to try. Affordable for any small business.
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm">
            No contracts. No hidden fees. Cancel anytime.
          </p>
        </div>

        <PricingCards onContactClick={onContactClick} />
      </div>
    </section>
  )
}

/* ─── Setup Callout ─────────────────────────────────────────────────────── */

function SetupCallout() {
  return (
    <section className="bg-navy py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Team Setup</span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white leading-tight">
          Want to roll it out across your whole team?
        </h2>
        <p className="mt-5 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          It takes about 5 minutes to add Sendasta to everyone's Outlook at once — no end-user
          action needed, and no specialist required. We have a simple step-by-step guide.
        </p>
        <div className="mt-8">
          <Link
            to="/for-it-admins"
            className="inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm"
          >
            See the Setup Guide
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Contact Form ──────────────────────────────────────────────────────── */

function ContactForm({ formRef }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('https://formspree.io/f/mvzdzyyj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-24 px-6 bg-navy" id="contact" ref={formRef}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Get in Touch</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">
            Questions? We'd love to hear from you.
          </h2>
          <p className="mt-4 text-gray-400 text-sm">
            We're a small team and respond to every message personally — usually within a day.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
            <svg className="w-10 h-10 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-900 font-semibold text-lg">Message sent — thanks!</p>
            <p className="text-gray-500 text-sm mt-1">We'll get back to you shortly at {form.email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="name">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">Your email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="company">Company (optional)</label>
              <input
                id="company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="What are you trying to solve, or what questions do you have?"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-accent focus:border-transparent transition resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600">Something went wrong. Email us directly at info@sendasta.com.</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-blue-accent hover:bg-blue-accent-hover disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Or email us directly at{' '}
              <a href="mailto:info@sendasta.com" className="text-blue-accent hover:underline">
                info@sendasta.com
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

/* ─── Home page ─────────────────────────────────────────────────────────── */

export default function Home() {
  const formRef = useRef(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main className="pb-20 md:pb-0">
        <Hero onDemoClick={scrollToForm} />
        <SocialProofBar />
        <Problem />
        <HowItWorks />
        <Features />
        <Testimonials />
        <PricingSection onContactClick={scrollToForm} />
        <SetupCallout />
        <ContactForm formRef={formRef} />
      </main>

      {/* Sticky mobile install CTA */}
      <div className="fixed bottom-0 inset-x-0 md:hidden bg-navy border-t border-white/10 px-4 py-3 z-40">
        <a
          href="https://sendasta.com/manifest-sendasta.xml"
          className="block w-full bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-3 rounded-lg text-sm text-center transition-colors"
        >
          Install Free — No Sign-up
        </a>
      </div>
    </>
  )
}

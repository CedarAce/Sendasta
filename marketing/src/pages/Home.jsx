import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PricingCards from '../components/PricingCards'
import { usePageMeta } from '../hooks/usePageMeta'

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

function QuoteIcon() {
  return (
    <svg className="w-8 h-8 text-blue-accent/30" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

/* ─── Figures ────────────────────────────────────────────────────────────── */

function AutocompleteFigure() {
  return (
    <div className="relative mx-auto mt-10 max-w-md select-none" aria-hidden="true">
      <div className="rounded-xl bg-white shadow-lg border border-gray-200 p-4">
        <div className="text-[11px] text-gray-400 mb-1 font-medium">To</div>
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <span className="text-[13px] text-gray-700 font-mono">John</span>
          <span className="inline-block w-0.5 h-4 bg-blue-accent animate-pulse"></span>
        </div>
        <div className="mt-0 rounded-lg border border-gray-200 shadow-md bg-white overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-3 border-b border-gray-100">
            <div className="w-7 h-7 rounded-full bg-[#107c10] text-white flex items-center justify-center text-[11px] font-semibold">JS</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-gray-900">John Smith</div>
              <div className="text-[11px] text-gray-500 truncate">john@acme.com · Engineering</div>
            </div>
            <div className="text-[10px] text-gray-400">safe</div>
          </div>
          <div className="px-3 py-2 flex items-center gap-3 bg-red-50/60 ring-1 ring-red-200 relative">
            <div className="w-7 h-7 rounded-full bg-[#d13438] text-white flex items-center justify-center text-[11px] font-semibold">JS</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-gray-900">John Smith</div>
              <div className="text-[11px] text-[#a4262c] truncate">john@<b>competitor.com</b> · last emailed 2019</div>
            </div>
            <svg width="14" height="18" viewBox="0 0 14 18" fill="#1f2937" className="absolute right-2 top-1/2 -translate-y-1/2">
              <path d="M1 1 L1 14 L5 11 L7 16 L9 15 L7 11 L13 11 Z" stroke="white" strokeWidth="1"/>
            </svg>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-gray-400 text-center italic">Two "John Smith"s. One click from disaster.</div>
      </div>
    </div>
  )
}

function StepInstallFigure() {
  return (
    <div className="w-full rounded-lg bg-white border border-gray-200 overflow-hidden shadow-sm mt-2" aria-hidden="true">
      <div className="h-6 bg-[#f3f2f1] border-b border-gray-200 flex items-center px-2 gap-1">
        <span className="text-[9px] text-gray-500 font-semibold">Outlook · Home</span>
        <span className="ml-auto text-[9px] text-gray-400">Add-ins</span>
      </div>
      <div className="h-10 bg-white flex items-center px-2 gap-1.5 border-b border-gray-100">
        {['New', 'Reply', 'Forward', 'Delete'].map(l => (
          <div key={l} className="flex flex-col items-center px-2">
            <div className="w-5 h-5 rounded bg-gray-200"></div>
            <span className="text-[8px] text-gray-500 mt-0.5">{l}</span>
          </div>
        ))}
        <div className="flex flex-col items-center px-2 border-l border-gray-200 ml-1 pl-3 relative">
          <div className="w-5 h-5 rounded bg-[#2D7DD2] flex items-center justify-center text-white text-[8px] font-bold">S</div>
          <span className="text-[8px] text-blue-accent font-semibold mt-0.5">Sendasta</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#107c10] ring-2 ring-white"></span>
        </div>
      </div>
    </div>
  )
}

function StepConfigureFigure() {
  const domains = [
    { d: 'competitor.com', tone: 'block' },
    { d: 'personal-email.me', tone: 'block' },
    { d: 'acme-eu.com', tone: 'ok' },
  ]
  return (
    <div className="w-full rounded-lg bg-white border border-gray-200 overflow-hidden shadow-sm mt-2" aria-hidden="true">
      <div className="px-3 py-2 border-b border-gray-100 text-[10px] font-semibold text-gray-700 flex items-center justify-between">
        Watched domains
        <span className="text-[9px] text-gray-400">3 rules</span>
      </div>
      <div className="p-3 space-y-1.5">
        {domains.map(({ d, tone }) => (
          <div key={d} className={'flex items-center gap-2 px-2 py-1 rounded ' + (tone === 'block' ? 'bg-red-50' : 'bg-blue-50')}>
            {tone === 'block'
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d13438" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M5 5 l14 14"/></svg>
              : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2D7DD2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
            }
            <span className={'text-[10px] font-mono ' + (tone === 'block' ? 'text-[#a4262c]' : 'text-[#2D7DD2]')}>{d}</span>
            <span className="ml-auto text-[9px] text-gray-400">{tone === 'block' ? 'block' : 'trusted'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepAlertFigure() {
  return (
    <div className="w-full rounded-lg bg-white border border-gray-200 overflow-hidden shadow-sm mt-2 relative" aria-hidden="true">
      <div className="h-6 bg-[#f3f2f1] border-b border-gray-200 flex items-center px-2">
        <span className="text-[9px] text-gray-500 font-semibold">Draft · Re: Proposal</span>
      </div>
      <div className="p-3 space-y-1.5 blur-[0.5px] opacity-60">
        <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
        <div className="h-1.5 bg-gray-200 rounded w-4/6"></div>
        <div className="h-1.5 bg-gray-200 rounded w-3/6"></div>
        <div className="mt-3 inline-block px-2 py-1 rounded bg-[#0078d7] text-white text-[9px] font-semibold">Send</div>
      </div>
      <div className="absolute inset-x-3 bottom-2 rounded-md bg-white border border-red-300 shadow-lg overflow-hidden">
        <div className="bg-[#d13438] text-white text-[9px] font-semibold px-2 py-1 flex items-center gap-1">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/></svg>
          Hold on — 2 different companies
        </div>
        <div className="px-2 py-1.5 flex items-center gap-1.5">
          <span className="text-[9px] font-mono bg-red-50 text-[#a4262c] px-1.5 py-0.5 rounded">competitor.com</span>
          <span className="ml-auto text-[9px] text-gray-400">Review →</span>
        </div>
      </div>
    </div>
  )
}

function FeatureShieldFigure() {
  return (
    <div className="w-full h-64 relative" aria-hidden="true">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#2D7DD2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="white"/>
        <path d="M9 12l2 2 4-4" stroke="#107c10" strokeWidth="1.6"/>
      </svg>
      <svg className="absolute left-4 top-6 text-[#d13438]" width="56" height="40" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="22" height="16" rx="2" fill="white"/>
        <path d="M1 3 L12 11 L23 3"/>
        <path d="M24 6 L27 3 M24 3 L27 6" strokeWidth="1.5"/>
      </svg>
      <svg className="absolute right-4 bottom-6 text-[#107c10]" width="48" height="36" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="22" height="16" rx="2" fill="white"/>
        <path d="M1 3 L12 11 L23 3"/>
      </svg>
    </div>
  )
}

function FeatureBlocklistFigure() {
  const rows = ['competitor.com', 'ex-client.net', 'personal@']
  return (
    <div className="w-full flex items-center justify-center" aria-hidden="true">
      <div className="w-full rounded-xl bg-white border border-gray-200 shadow-md py-4 px-5 space-y-2.5">
        {rows.map((r, i) => (
          <div key={r} className="flex items-center gap-3 px-3 py-2 rounded-md bg-red-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d13438" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M5 5 l14 14"/></svg>
            <span className="text-[13px] font-mono text-[#a4262c] flex-1">{r}</span>
            {i === 0 && <span className="text-[9px] uppercase tracking-wider bg-[#d13438] text-white px-2 py-0.5 rounded font-semibold">blocked</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureTeamFigure() {
  return (
    <div className="w-full h-64 relative flex items-center justify-center" aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 300 220" className="absolute inset-0" fill="none">
        {[{ x: 50, y: 50 }, { x: 110, y: 30 }, { x: 175, y: 24 }, { x: 240, y: 30 }, { x: 290, y: 50 }].map((p, i) => (
          <path key={i} d={`M150 160 Q150 110 ${p.x} ${p.y + 20}`} stroke="#2D7DD2" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.55"/>
        ))}
      </svg>
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#2D7DD2] text-white flex items-center justify-center text-[16px] font-bold shadow-md">A</div>
        <span className="text-[11px] text-[#2D7DD2] font-semibold mt-1.5">Admin</span>
      </div>
      <div className="absolute inset-x-0 top-6 flex justify-around px-4">
        {['JS', 'MK', 'RT', 'LP', 'DG'].map((n, i) => (
          <div key={n} className="w-11 h-11 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[12px] font-semibold text-gray-700 shadow-sm" style={{ marginTop: [14, 4, 0, 4, 14][i] + 'px' }}>{n}</div>
        ))}
      </div>
    </div>
  )
}

function RolloutFigure() {
  return (
    <div className="w-full max-w-xl mx-auto mt-10 select-none" aria-hidden="true">
      <svg viewBox="0 0 500 180" className="w-full" fill="none">
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L6 4 L0 8 Z" fill="#2D7DD2"/>
          </marker>
        </defs>
        <g>
          <rect x="20" y="60" width="130" height="60" rx="10" fill="rgba(45,125,210,0.12)" stroke="#2D7DD2" strokeWidth="1.5"/>
          <rect x="34" y="74" width="40" height="4" rx="2" fill="#2D7DD2"/>
          <rect x="34" y="84" width="80" height="3" rx="1.5" fill="#2D7DD2" opacity="0.5"/>
          <rect x="34" y="92" width="64" height="3" rx="1.5" fill="#2D7DD2" opacity="0.5"/>
          <rect x="34" y="100" width="72" height="3" rx="1.5" fill="#2D7DD2" opacity="0.5"/>
          <text x="85" y="140" textAnchor="middle" fill="#2D7DD2" fontSize="11" fontWeight="600" fontFamily="Inter">Admin config</text>
        </g>
        {[0, 1, 2, 3, 4, 5].map(i => {
          const ty = 20 + i * 24
          return <path key={i} d={`M150 90 C 250 90, 280 ${ty + 10}, 350 ${ty + 10}`} stroke="#2D7DD2" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr)" opacity="0.7"/>
        })}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const ty = 20 + i * 24
          return (
            <g key={i}>
              <rect x="360" y={ty} width="110" height="18" rx="4" fill="white" stroke="#e1e1e1"/>
              <rect x="368" y={ty + 6} width="8" height="6" rx="1" fill="#2D7DD2" opacity="0.7"/>
              <rect x="382" y={ty + 7} width="50" height="2" rx="1" fill="#374151" opacity="0.6"/>
              <rect x="382" y={ty + 11} width="36" height="2" rx="1" fill="#9CA3AF"/>
              <circle cx="455" cy={ty + 9} r="3" fill="#107c10"/>
            </g>
          )
        })}
        <text x="415" y="172" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontFamily="Inter">Everyone's Outlook, configured</text>
      </svg>
    </div>
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
          <Link
            to="/for-it-admins"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Install Free — No Sign-up
          </Link>
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
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
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
      <div className="mt-16 max-w-5xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl">
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

/* ─── Problem + How It Works ────────────────────────────────────────────── */

function ProblemAndHowItWorks() {
  const steps = [
    {
      figure: <StepInstallFigure />,
      title: 'Install in minutes — no IT expertise needed',
      desc: 'Add Sendasta to Outlook in a few clicks — for yourself, or for your whole team. Works on Outlook web, desktop, and Mac. No technical knowledge required.',
    },
    {
      figure: <StepConfigureFigure />,
      title: 'Tell it who to watch out for',
      desc: 'Add the domains you want Sendasta to flag — a competitor, a personal email address, a client that should never be mixed with another. Takes about 2 minutes to set up.',
    },
    {
      figure: <StepAlertFigure />,
      title: 'Sendasta quietly checks every email you send',
      desc: 'The moment you click send, Sendasta checks your recipients. If something looks off, it pauses and gives you a chance to review — before the email goes anywhere.',
    },
  ]

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#EEF4FF' }}>
      <div className="max-w-6xl mx-auto">

        {/* Problem */}
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Sound familiar?</span>
          <p className="mt-5 text-2xl md:text-3xl font-semibold text-navy leading-snug">
            Every day, someone at a small business sends a sensitive email to the wrong person —
            a former client, a competitor, or the wrong "John Smith" in their contacts.
            Outlook's autocomplete makes it easy to miss.
          </p>
          <AutocompleteFigure />
        </div>

        {/* Bridge */}
        <div className="mt-16 text-center">
          <p className="text-lg text-blue-accent font-semibold">Sendasta catches it before it leaves your outbox.</p>
        </div>

        {/* How It Works heading */}
        <div className="mt-16 text-center">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How It Works</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">Simple to set up. Works in the background.</h2>
        </div>

        {/* Steps */}
        <div className="mt-12 grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-navy text-white font-extrabold text-lg shrink-0">
                {i + 1}
              </div>
              <h3 className="text-base font-semibold text-gray-900 min-h-12 flex items-center justify-center">{step.title}</h3>
              <div className="w-full h-40 flex items-start">{step.figure}</div>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
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
      figure: <FeatureShieldFigure />,
      eyebrow: 'Real-time check',
      title: 'Catches the wrong recipient instantly',
      desc: "The moment you add someone from the wrong company, Sendasta flags it. A quick popup gives you a chance to double-check before anything is sent — every single time.",
      bullets: ['Checks every Send, including Reply All', 'Works on Outlook web, desktop, and Mac', 'Flags mismatched company domains'],
    },
    {
      figure: <FeatureBlocklistFigure />,
      eyebrow: 'Domain rules',
      title: 'Flag the domains that should never get your emails',
      desc: 'Add competitors, former clients, or any off-limits address to your watchlist. When someone on that list appears in a send, Sendasta stops and asks you to confirm before anything goes out.',
      bullets: ['Requires a deliberate "Send Anyway" to override — no silent slips', 'No-combine pairs for competing clients who must never share an email', 'Trusted pairs to silence alerts for known-safe combos'],
    },
    {
      figure: <FeatureTeamFigure />,
      eyebrow: 'For the whole team',
      title: 'One deployment, everyone protected',
      desc: 'Roll Sendasta out to your whole team through Microsoft 365 Admin in about 5 minutes — no end-user setup, no per-person configuration. Everyone gets the same protection automatically.',
      bullets: ['Deploy once through Microsoft 365 Admin Center', 'No end-user action or setup required', 'Works on Outlook web, desktop, and new Outlook for Mac'],
    },
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Features</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            Everything you need. Nothing you don't.
          </h2>
        </div>

        <div className="flex flex-col gap-24">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
            >
              <div className="rounded-2xl p-8 aspect-5/4 flex items-center justify-center" style={{ backgroundColor: '#EEF4FF' }}>
                <div className="w-full max-w-sm">{f.figure}</div>
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">{f.eyebrow}</span>
                <h3 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">{f.title}</h3>
                <p className="mt-4 text-gray-600 text-base leading-relaxed">{f.desc}</p>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {f.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <span className="text-blue-accent mt-0.5 shrink-0"><CheckIcon /></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */

function Testimonials() {
  const testimonials = [
    {
      quote: '"We almost emailed a confidential proposal to the wrong client. Sendasta caught it immediately — I didn\'t even realise autocomplete had filled in the wrong address."',
      name: 'Sarah M.',
      title: 'Managing Partner, Mercer & Holt LLP',
    },
    {
      quote: '"Set it up in about 10 minutes. It just runs quietly in the background and I don\'t have to think about it. Worth every penny."',
      name: 'David K.',
      title: 'Office Manager, Brightline Accounting',
    },
    {
      quote: '"Our team works with competing clients. Sendasta makes sure we never accidentally CC the wrong one. It\'s become part of how we work."',
      name: 'James T.',
      title: 'Founder, Tanner Search Group',
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
          {testimonials.map((t, i) => (
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
          Roll it out to your whole team — and set your own rules.
        </h2>
        <p className="mt-5 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Deploy Sendasta across everyone's Outlook in about 5 minutes through Microsoft 365 Admin — no end-user action needed.
          Each person can then configure their own rules: flag domains that should never receive your emails, create no-combine pairs for competing clients, and mark trusted contacts to skip the alert.
        </p>
        <RolloutFigure />
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
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 items-start">

          {/* Left: heading + contact info */}
          <div className="md:col-span-2">
            <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Get in Touch</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white leading-tight">
              Questions? We respond personally.
            </h2>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Pricing questions, a custom setup for your team, or anything else — send us a message and a real person will get back to you.
            </p>

            <div className="mt-8">
              <a href="mailto:info@sendasta.com" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/15 transition-colors">
                  <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors text-sm">info@sendasta.com</span>
              </a>
            </div>

            <div className="mt-6 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-blue-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-300 text-xs">We respond within 1 business day</p>
            </div>
          </div>

          {/* Right: form in white card */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="py-8 text-center">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="name">Your name</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">Your email</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="company">Company (optional)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="message">Message</label>
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
                  Or email us at{' '}
                  <a href="mailto:info@sendasta.com" className="text-blue-accent hover:underline">
                    info@sendasta.com
                  </a>
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Home page ─────────────────────────────────────────────────────────── */

export default function Home() {
  usePageMeta({
    title: 'Sendasta — Stop Sending Emails to the Wrong Person in Outlook',
    description: 'Sendasta warns you the moment Outlook autocomplete puts the wrong recipient in your email. Free to try, 5-minute setup. Works on Outlook web, desktop, and Mac.',
    canonical: 'https://sendasta.com/',
  })

  const formRef = useRef(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main className="pb-20 md:pb-0">
        <Hero onDemoClick={scrollToForm} />
        <SocialProofBar />
        <ProblemAndHowItWorks />
        <Features />
        <Testimonials />
        <PricingSection onContactClick={scrollToForm} />
        <SetupCallout />
        <ContactForm formRef={formRef} />
      </main>

      {/* Sticky mobile install CTA */}
      <div className="fixed bottom-0 inset-x-0 md:hidden bg-navy border-t border-white/10 px-4 py-3 z-40">
        <Link
          to="/for-it-admins"
          className="block w-full bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-3 rounded-lg text-sm text-center transition-colors"
        >
          Install Free — No Sign-up
        </Link>
      </div>
    </>
  )
}

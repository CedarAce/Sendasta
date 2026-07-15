import { useState, useRef, useEffect, useLayoutEffect } from 'react'
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

/* ─── Hero animation (ported from Claude Design: upgrades/hero_animation.html) ─ */

const heroAnimStyles = `
.hero-anim {
  --navy: #0A1628; --navy-800: #0d1e38;
  --blue-accent: #2D7DD2; --blue-accent-hover: #2569b8;
  --office-blue: #0078d7;
  --danger: #d13438; --danger-bg: #fde7e9;
  --success: #107c10; --success-bg: #dff6dd;
  --ease: cubic-bezier(.4,0,.2,1); --ease-out: cubic-bezier(.16,1,.3,1);
}
.hero-anim *, .hero-anim *::before, .hero-anim *::after { box-sizing: border-box; }

/* ── Animation stage ──────────────────────────────────────── */
/* Fixed design canvas; scaled down to fit narrow viewports via
   transform in JS so every element shrinks proportionally instead
   of reflowing/clipping. */
.hero-anim-wrap { width: 100%; max-width: 1140px; overflow: hidden; }
.hero-anim .stage {
  width: 1140px; height: 654px;
  transform-origin: top left;
  background: transparent; border: none;
  overflow: visible; position: relative; isolation: isolate;
}
.hero-anim .stage::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(45,125,210,0.18) 0%, transparent 60%); z-index: 0;
}

/* ── Outlook compose ──────────────────────────────────────── */
.hero-anim .compose {
  position: absolute; inset: 3% 3.5%;
  background: #fff; border-radius: 12px; box-shadow: 0 20px 60px -10px rgba(0,0,0,0.4);
  color: #1f1f1f; overflow: hidden; z-index: 1; display: flex; flex-direction: column;
}
.hero-anim .compose-ribbon {
  height: 36px; background: #f3f2f1; border-bottom: 1px solid #e1e1e1;
  display: flex; align-items: center; padding: 0 14px; gap: 8px; flex-shrink: 0;
}
.hero-anim .ribbon-dot { width: 9px; height: 9px; border-radius: 50%; }
.hero-anim .ribbon-dot.red { background: #ff5f57; }
.hero-anim .ribbon-dot.yellow { background: #febc2e; }
.hero-anim .ribbon-dot.green { background: #28c840; }
.hero-anim .ribbon-title { margin-left: 14px; font-size: 11.5px; font-weight: 600; color: #605e5c; }

.hero-anim .compose-body { padding: 16px 22px; flex: 1; display: flex; flex-direction: column; }
.hero-anim .field { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #edebe9; min-height: 48px; position: relative; }
.hero-anim .field-label { width: 56px; color: #605e5c; font-size: 11.5px; font-weight: 600; flex-shrink: 0; }
.hero-anim .field-value { flex: 1; min-width: 0; display: inline-flex; align-items: center; gap: 8px; position: relative; }

/* ── Chips ─────────────────────────────────────────────────── */
.hero-anim .chip { display: inline-flex; align-items: center; gap: 8px; background: #edebe9; border-radius: 16px; padding: 4px 12px 4px 4px; font-size: 11.5px; transform-origin: left center; }
.hero-anim .chip-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--office-blue); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.hero-anim .chip-text { display: inline-flex; flex-direction: column; line-height: 1.15; gap: 1px; }
.hero-anim .chip-name { font-size: 12px; font-weight: 600; color: #1f1f1f; }
.hero-anim .chip-email { font-size: 10.5px; color: #605e5c; }
.hero-anim .chip.danger { background: var(--danger-bg); box-shadow: 0 0 0 1.5px var(--danger); }
.hero-anim .chip.danger .chip-avatar { background: var(--danger); }
.hero-anim .chip.danger .chip-name, .hero-anim .chip.danger .chip-email { color: var(--danger); }
.hero-anim .chip.danger .chip-email b { font-weight: 800; }
.hero-anim .chip.success { background: var(--success-bg); }
.hero-anim .chip.success .chip-avatar { background: var(--success); }
.hero-anim .chip.success .chip-name { color: var(--success); }

/* ── Recipient slot ────────────────────────────────────────── */
.hero-anim .recipient-slot { position: relative; min-width: 240px; height: 32px; display: inline-flex; align-items: center; }
.hero-anim .recipient-slot > * { position: absolute; left: 0; top: 50%; transform: translateY(-50%); }
.hero-anim .typing-display { display: inline-flex; align-items: center; font-size: 13px; color: #1f1f1f; opacity: 0; transition: opacity 220ms var(--ease); }
.hero-anim .typing-display.show { opacity: 1; }
.hero-anim .typed-text { white-space: nowrap; display: inline-block; }
.hero-anim .caret { display: inline-block; width: 1.5px; height: 16px; background: var(--office-blue); margin-left: 1px; animation: haBlink 1s infinite step-end; }
@keyframes haBlink { 50% { background: transparent; } }

.hero-anim .wrong-chip { opacity: 0; transform: translateY(-50%) scale(0.9); transition: opacity 260ms var(--ease-out), transform 260ms var(--ease-out); pointer-events: none; }
.hero-anim .wrong-chip.in { opacity: 1; transform: translateY(-50%) scale(1); }

/* ── Autocomplete dropdown ────────────────────────────────── */
.hero-anim .dropdown {
  position: absolute; top: 56px; left: 56px; width: 320px;
  background: #fff; border: 1px solid #d2d0ce; box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  border-radius: 6px; z-index: 5;
  opacity: 0; transform: translateY(-6px); pointer-events: none;
  transition: opacity 200ms var(--ease), transform 220ms var(--ease-out);
}
.hero-anim .dropdown.open { opacity: 1; transform: translateY(0); }
.hero-anim .dd-row { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-bottom: 1px solid #f3f2f1; font-size: 12px; background: transparent; transition: background 160ms var(--ease); }
.hero-anim .dd-row:last-child { border-bottom: none; }
.hero-anim .dd-row.hot { background: rgba(209,52,56,0.10); }
.hero-anim .dd-row .av { width: 26px; height: 26px; border-radius: 50%; color: #fff; font-size: 10px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hero-anim .dd-row .av.green { background: var(--success); }
.hero-anim .dd-row .av.red { background: var(--danger); }
.hero-anim .dd-row .meta { flex: 1; min-width: 0; }
.hero-anim .dd-row .name { font-weight: 600; color: #1f1f1f; font-size: 12.5px; }
.hero-anim .dd-row .email { color: #605e5c; font-size: 11px; margin-top: 1px; }

/* ── Subject + body ───────────────────────────────────────── */
.hero-anim .subject-text { white-space: nowrap; display: inline-block; color: #1f1f1f; font-size: 13px; }
.hero-anim .body-area { padding: 16px 0 0; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.hero-anim .body-line { height: 8px; background: #f3f2f1; border-radius: 4px; opacity: 0; transform: translateY(4px); transition: opacity 320ms var(--ease-out), transform 320ms var(--ease-out); }
.hero-anim .body-line.in { opacity: 1; transform: translateY(0); }

/* ── Send bar ─────────────────────────────────────────────── */
.hero-anim .send-bar { border-top: 1px solid #edebe9; padding: 12px 22px; background: #faf9f8; }
.hero-anim .send-btn { font: 600 12.5px 'Inter', sans-serif; background: var(--office-blue); color: #fff; border: none; padding: 8px 22px; border-radius: 3px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background 120ms var(--ease), transform 120ms var(--ease); }
.hero-anim .send-btn svg { width: 13px; height: 13px; }
.hero-anim .send-btn.press { background: #005a9e; transform: scale(0.95); }

/* ── Sendasta dialog (Fluent, light mode) — matches real add-in ── */
.hero-anim .warning {
  position: absolute; left: 50%; top: 50%;
  width: 66%; max-width: 480px; background: #fff; border-radius: 4px;
  box-shadow: 0 25.6px 57.6px rgba(0,0,0,0.22), 0 4.8px 14.4px rgba(0,0,0,0.18);
  overflow: hidden; z-index: 15; color: #1f1f1f;
  font-family: 'Segoe UI', system-ui, sans-serif;
  opacity: 0; transform: translate(-50%, -46%) scale(0.94);
  transition: opacity 300ms var(--ease-out), transform 380ms var(--ease-out);
}
.hero-anim .warning.in { opacity: 1; transform: translate(-50%, -50%) scale(1); }
.hero-anim .dlg-title { display: flex; align-items: center; justify-content: space-between; padding: 15px 20px 6px; font-size: 17px; font-weight: 600; color: #1b1a19; }
.hero-anim .dlg-close { color: #605e5c; display: inline-flex; }
.hero-anim .dlg-close svg { width: 13px; height: 13px; }
.hero-anim .dlg-body { display: flex; gap: 14px; padding: 8px 20px 4px; }
.hero-anim .dlg-x { flex-shrink: 0; padding-top: 2px; }
.hero-anim .dlg-x svg { width: 26px; height: 26px; }
.hero-anim .dlg-content { font-size: 14px; line-height: 1.45; color: #1f1f1f; }
.hero-anim .dlg-heading { font-size: 14.5px; margin-bottom: 12px; }
.hero-anim .dlg-content p { margin: 12px 0; }
.hero-anim .dlg-content ul { margin: 8px 0; padding-left: 20px; list-style: disc outside; }
.hero-anim .dlg-content li { margin: 3px 0; display: list-item; }
.hero-anim .dlg-content li::marker { color: var(--danger); }
.hero-anim .dlg-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 20px 20px; }
.hero-anim .dlg-btn { min-width: 118px; font: 600 14px 'Segoe UI', system-ui, sans-serif; padding: 8px 16px; border-radius: 2px; cursor: pointer; transition: box-shadow 200ms var(--ease), background 120ms var(--ease); }
.hero-anim .dlg-btn.secondary { background: #fff; border: 1px solid #8a8886; color: #201f1e; }
.hero-anim .dlg-btn.primary { background: #f4959b; border: 1px solid #f4959b; color: #201f1e; box-shadow: 0 0 0 0 rgba(209,52,56,0); }
.hero-anim .dlg-btn.primary.hot { background: #ef7f88; box-shadow: 0 0 0 4px rgba(209,52,56,0.25); }

/* ── Cursor ───────────────────────────────────────────────── */
.hero-anim .cursor {
  position: absolute; width: 16px; height: 22px; z-index: 20; left: 30%; top: 40%;
  opacity: 0; pointer-events: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  transition: left 560ms var(--ease), top 560ms var(--ease), opacity 200ms var(--ease), transform 110ms var(--ease);
}
.hero-anim .cursor.show { opacity: 1; }
.hero-anim .cursor.down { transform: scale(0.82); }
`

const STAGE_W = 1140
const STAGE_H = 654

function HeroAnimation() {
  const rootRef = useRef(null)
  const wrapRef = useRef(null)

  // Scale the fixed-size stage to fit the wrapper's width (mobile included)
  // so every element inside shrinks proportionally instead of clipping.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const stage = rootRef.current?.querySelector('.stage')
    if (!wrap || !stage) return

    function applyScale() {
      const scale = Math.min(1, wrap.clientWidth / STAGE_W)
      stage.style.transform = 'scale(' + scale + ')'
      wrap.style.height = (STAGE_H * scale) + 'px'
    }

    applyScale()
    const ro = new ResizeObserver(applyScale)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const $ = (sel) => root.querySelector(sel)
    const stage = $('.stage')
    const els = {
      typing: $('#ha-typing'), typed: $('#ha-typed'), wrongChip: $('#ha-wrongChip'),
      dropdown: $('#ha-dropdown'), wrongRow: $('#ha-wrongRow'), subject: $('#ha-subject'),
      bodyLines: root.querySelectorAll('.body-line'), sendBtn: $('#ha-sendBtn'),
      warning: $('#ha-warning'), dontSend: $('#ha-dontSend'), cursor: $('#ha-cursor'),
    }
    const SPEED = 1.25
    let timers = []
    const after = (ms, fn) => { timers.push(setTimeout(fn, ms / SPEED)) }
    const clearAll = () => { timers.forEach(clearTimeout); timers = [] }

    // Cursor target as % of the stage, computed from the actual rendered
    // position of `el` so the cursor lands exactly on it regardless of layout/scale.
    function targetOf(el) {
      const s = stage.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return {
        x: ((r.left + r.width / 2 - s.left) / s.width) * 100,
        y: ((r.top + r.height / 2 - s.top) / s.height) * 100,
      }
    }

    // Smooth cursor move: coords are % of the stage.
    function moveCursor(x, y, dur) {
      if (dur != null) {
        const d = dur / SPEED
        els.cursor.style.transitionDuration = d + 'ms, ' + d + 'ms, 200ms, 110ms'
      }
      els.cursor.style.left = x + '%'
      els.cursor.style.top = y + '%'
    }
    function click(cb) {
      els.cursor.classList.add('down')
      after(120, function () { els.cursor.classList.remove('down'); if (cb) cb() })
    }

    // Real character typing into an element; each char is its own timer.
    function type(el, text, perChar, done) {
      let i = 0
      ;(function step() {
        if (i > text.length) { if (done) done(); return }
        el.textContent = text.slice(0, i)
        i++
        after(perChar, step)
      })()
    }

    function reset() {
      els.typing.classList.remove('show')
      els.typed.textContent = ''
      els.wrongChip.classList.remove('in')
      els.dropdown.classList.remove('open')
      els.wrongRow.classList.remove('hot')
      els.subject.textContent = ''
      els.bodyLines.forEach(function (l) { l.classList.remove('in') })
      els.sendBtn.classList.remove('press')
      els.warning.classList.remove('in')
      els.dontSend.classList.remove('hot')
      els.cursor.classList.remove('show', 'down')
      els.cursor.style.transitionDuration = '0ms'
      moveCursor(30, 22)
    }

    function run() {
      reset()

      // 1. Cursor drifts in, start typing "John"
      after(500, function () {
        els.cursor.classList.add('show')
        moveCursor(33, 17, 400)
        els.typing.classList.add('show')
        type(els.typed, 'John', 130)
      })

      // 2. Autocomplete opens
      after(1250, function () { els.dropdown.classList.add('open') })

      // 3. Cursor glides down to the wrong row
      after(1650, function () { moveCursor(32, 35, 620) })
      after(2350, function () { els.wrongRow.classList.add('hot') })

      // 4. Click the wrong recipient → chip lands, dropdown & typing clear
      after(2650, function () {
        click(function () {
          els.dropdown.classList.remove('open')
          els.wrongRow.classList.remove('hot')
          els.typing.classList.remove('show')
          els.wrongChip.classList.add('in')
        })
      })

      // 5. Fill subject + body
      after(3150, function () { type(els.subject, 'Q2 renewal — final pricing', 55) })
      after(4300, function () {
        els.bodyLines.forEach(function (l, i) {
          after(i * 130, function () { l.classList.add('in') })
        })
      })

      // 6. Move to Send and press
      after(4900, function () { els.cursor.classList.add('show'); const p = targetOf(els.sendBtn); moveCursor(p.x, p.y, 600) })
      after(5600, function () { click(function () { els.sendBtn.classList.add('press') }) })
      after(5850, function () { els.sendBtn.classList.remove('press') })

      // 7. Warning intervenes
      after(5950, function () { els.warning.classList.add('in') })

      // 8. Cursor moves in to "Don't send" and hovers — the payoff, held
      after(6550, function () { const p = targetOf(els.dontSend); moveCursor(p.x, p.y, 640) })
      after(7250, function () { els.dontSend.classList.add('hot') })

      // 9. Fade out for a clean loop
      after(9600, function () {
        els.warning.classList.remove('in')
        els.dontSend.classList.remove('hot')
        els.wrongChip.classList.remove('in')
        els.cursor.classList.remove('show')
      })
      after(10200, run)
    }

    run()
    return () => clearAll()
  }, [])

  return (
    <div ref={rootRef} className="hero-anim mt-16 max-w-6xl flex justify-center -mx-6 px-2 w-[calc(100%+3rem)] sm:mx-auto sm:px-0 sm:w-full">
      <style>{heroAnimStyles}</style>
      <div ref={wrapRef} className="hero-anim-wrap">
      <div className="stage" aria-label="Animated Sendasta demo">
        <div className="compose">
          <div className="compose-ribbon">
            <span className="ribbon-dot red"></span>
            <span className="ribbon-dot yellow"></span>
            <span className="ribbon-dot green"></span>
            <span className="ribbon-title">New message</span>
          </div>

          <div className="compose-body">
            <div className="field">
              <span className="field-label">To</span>
              <div className="field-value">
                <span className="chip success">
                  <span className="chip-avatar">MC</span>
                  <span className="chip-text">
                    <span className="chip-name">Maya Chen</span>
                    <span className="chip-email">maya@acme.com</span>
                  </span>
                </span>

                <span className="recipient-slot">
                  <span className="typing-display" id="ha-typing">
                    <span className="typed-text" id="ha-typed"></span>
                    <span className="caret"></span>
                  </span>
                  <span className="chip danger wrong-chip" id="ha-wrongChip">
                    <span className="chip-avatar">JS</span>
                    <span className="chip-text">
                      <span className="chip-name">John Smith</span>
                      <span className="chip-email">john@<b>competitor.com</b></span>
                    </span>
                  </span>
                </span>
              </div>

              <div className="dropdown" id="ha-dropdown">
                <div className="dd-row">
                  <span className="av green">JS</span>
                  <div className="meta">
                    <div className="name">John Smith</div>
                    <div className="email">john@acme.com · Engineering</div>
                  </div>
                </div>
                <div className="dd-row" id="ha-wrongRow">
                  <span className="av red">JS</span>
                  <div className="meta">
                    <div className="name">John Smith</div>
                    <div className="email">john@competitor.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <span className="field-label">Subject</span>
              <span className="subject-text" id="ha-subject"></span>
            </div>

            <div className="body-area">
              <div className="body-line" style={{ width: '88%' }}></div>
              <div className="body-line" style={{ width: '72%' }}></div>
              <div className="body-line" style={{ width: '58%' }}></div>
            </div>
          </div>

          <div className="send-bar">
            <button className="send-btn" id="ha-sendBtn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send
            </button>
          </div>
        </div>

        <div className="warning" id="ha-warning" role="alertdialog">
          <div className="dlg-title">
            <span>Message from Add-in: Sendasta</span>
            <span className="dlg-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg></span>
          </div>
          <div className="dlg-body">
            <div className="dlg-x">
              <svg viewBox="0 0 24 24" fill="none" stroke="#d13438" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
            </div>
            <div className="dlg-content">
              <div className="dlg-heading">Multiple external domains detected</div>
              <p>This email is addressed to 2 external organizations:</p>
              <ul>
                <li>acme.com</li>
                <li>competitor.com</li>
              </ul>
              <p>Confirm this is intentional.</p>
            </div>
          </div>
          <div className="dlg-actions">
            <button className="dlg-btn secondary">Send anyway</button>
            <button className="dlg-btn primary" id="ha-dontSend">Don't send</button>
          </div>
        </div>

        <svg className="cursor" id="ha-cursor" viewBox="0 0 14 18" fill="#1f2937">
          <path d="M1 1 L1 14 L5 11 L7 16 L9 15 L7 11 L13 11 Z" stroke="white" strokeWidth="1"/>
        </svg>
      </div>
      </div>
    </div>
  )
}


/* ─── Hero ──────────────────────────────────────────────────────────────── */

function Hero({ onDemoClick }) {
  return (
    <section className="bg-navy pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-blue-accent text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-8">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M12 1h10v10H12z"/>
            <path fill="#7fba00" d="M1 12h10v10H1z"/>
            <path fill="#ffb900" d="M12 12h10v10H12z"/>
          </svg>
          Microsoft Outlook Add-in
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
          The wrong recipient is one autocomplete away.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Sendasta catches every email going to the wrong person — the competitor, the former client, the John Smith nobody meant to email — and warns you the moment before it lands. One last check, so you can catch the mistake yourself.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/for-it-admins"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Try Free Now
          </Link>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-8 py-3.5 border border-white/40 hover:border-white text-white font-semibold rounded-lg transition-colors text-sm"
          >
            See how it works
          </button>
        </div>
        <p className="mt-4 text-gray-500 text-xs">Free for personal use · No credit card · Works on Outlook web, desktop, and Mac</p>
      </div>

      {/* Animated demo */}
      <HeroAnimation />
    </section>
  )
}


/* ─── Problem + How It Works ────────────────────────────────────────────── */

function ProblemAndHowItWorks() {
  const steps = [
    {
      figure: <StepInstallFigure />,
      title: 'Install',
      desc: 'Add Sendasta to your own Outlook in a few clicks, or roll it out to your whole team through Microsoft 365 Admin. Works on Outlook web, desktop, and Mac. No technical knowledge required.',
    },
    {
      figure: <StepConfigureFigure />,
      title: 'Set your rules',
      desc: 'Tell Sendasta which domains to flag — competitors, former clients, personal addresses, anything that should never receive your work email. Add no-combine pairs for clients who must stay separated. Takes about two minutes.',
    },
    {
      figure: <StepAlertFigure />,
      title: 'Send normally',
      desc: "When you click Send, Sendasta checks your recipients against your rules. If something looks off, it pauses and shows you why. If everything checks out, the email goes. You won't notice it most days. The day you do, it's worth it.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-6" style={{ backgroundColor: '#EEF4FF' }}>
      <div className="max-w-6xl mx-auto">

        {/* Problem */}
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Sound familiar?</span>
          <p className="mt-5 text-2xl md:text-3xl font-semibold text-navy leading-snug">
            You start typing a name. Outlook fills in the rest. You attach the file, hit send, and a second later realize the autocomplete grabbed the wrong contact — the one with the similar last name, the old client, the personal address. By then it's gone.
          </p>
          <AutocompleteFigure />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['GDPR', 'PIPEDA', 'Attorney-Client Privilege'].map(badge => (
              <span key={badge} className="text-xs font-medium text-blue-accent bg-blue-accent/10 border border-blue-accent/20 px-3 py-1.5 rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Bridge */}
        <div className="mt-16 text-center">
          <p className="text-lg text-blue-accent font-semibold">Sendasta catches it before it leaves your outbox.</p>
        </div>

        {/* How It Works heading */}
        <div className="mt-16 text-center">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">How It Works</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">Three steps. Five minutes.</h2>
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
      title: "Catches recipients that don't belong",
      desc: "When the recipients on an email don't match — a competitor's domain mixed with your client's, a personal address mixed with a corporate one — Sendasta pauses the send and asks you to confirm. Works on every Send and every Reply All.",
      bullets: ['Checks every Send, including Reply All', 'Works on Outlook web, desktop, and Mac', 'Flags mismatched company domains'],
    },
    {
      figure: <FeatureBlocklistFigure />,
      eyebrow: 'Domain rules',
      title: 'Enforces a rule, not a hope',
      desc: "Add the domains you don't want emails going to, ever. Competitors. Former clients. The journalist's address you accidentally added six months ago. Sendasta requires a deliberate \"Send Anyway\" — no silent slips.",
      bullets: ['Requires a deliberate "Send Anyway" to override — no silent slips', 'No-combine pairs for competing clients who must never share an email', 'Trusted pairs to silence alerts for known-safe combos'],
    },
    {
      figure: <FeatureTeamFigure />,
      eyebrow: 'For the whole team',
      title: 'One deployment, whole team',
      desc: 'Roll out through Microsoft 365 Admin in about five minutes. No per-user setup, no end-user action. Everyone protected automatically.',
      bullets: ['Deploy once through Microsoft 365 Admin Center', 'No end-user action or setup required', 'Works on Outlook web, desktop, and new Outlook for Mac'],
    },
  ]

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Features</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            What it actually does
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
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

/* ─── Stats Section ─────────────────────────────────────────────────────── */

function StatsSection() {
  const stats = [
    { value: '65%', label: 'of organizations had data leave through email by employee mistake in the past year.' },
    { value: '1 in 3', label: 'employees has sent an email to the wrong person.' },
    { value: '27%', label: 'of data protection incidents involve misdirected emails.' },
    { value: '47%', label: 'of misdirected emails are discovered by the recipient, not by security tools.' },
    { value: '$4.45M', label: 'average cost of a data breach involving misdirected email.' },
  ]

  return (
    <section className="py-20 px-6 bg-navy">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-white">The numbers nobody likes to talk about</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="text-3xl font-extrabold text-blue-accent">{s.value}</p>
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center border-t border-white/10 pt-10">
          <p className="text-xl md:text-2xl font-bold text-white">One click is all it takes.</p>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto">One misdirected email can end a client relationship that took years to build. Sendasta protects your whole team for $99 per month.</p>
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
            Simple, fair pricing.
          </h2>
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
          For IT and admins
        </h2>
        <p className="mt-5 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Deploy Sendasta to everyone's Outlook in about five minutes through Microsoft 365 Admin Center — no end-user action, no per-person configuration. Each person can configure their own watched domains, no-combine pairs, and trusted contacts after install.
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

/* ─── FAQ Section ───────────────────────────────────────────────────────── */

const HOME_FAQS = [
  {
    q: 'Does Sendasta read or store my emails?',
    a: 'No. Sendasta only checks recipient addresses against your rules at the moment you click Send — it never reads the subject line, body, or attachments. Nothing is sent to Sendasta servers.',
  },
  {
    q: 'Which versions of Outlook does it support?',
    a: 'Sendasta works on Outlook on the web, Outlook for Windows, and new Outlook for Mac. It requires a Microsoft 365 account.',
  },
  {
    q: 'Does it block emails, or just warn?',
    a: 'It warns. When you click Send, Sendasta checks the recipients against your rules and shows a popup if something matches — the wrong domain, a competitor, a mixed thread. You can fix the recipients, or send anyway if it\'s a false alarm. The decision is always yours.',
  },
  {
    q: 'Do employees need to set it up themselves after an admin deploys it?',
    a: 'No. Admins push shared rules to the whole team automatically. Sendasta is active in everyone\'s Outlook from day one, with your rules already applied.',
  },
  {
    q: 'Is there a free trial for the paid plan?',
    a: '14 days, full access. Cancel anytime before the trial ends and you won\'t be charged. Email info@sendasta.com and we\'ll get you set up.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium text-gray-900 group-hover:text-navy transition-colors leading-snug">{q}</span>
        <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${open ? 'bg-blue-accent border-blue-accent' : 'border-gray-300 group-hover:border-blue-accent'}`}>
          <svg className={`w-2.5 h-2.5 transition-transform ${open ? 'rotate-180 text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && <p className="pb-5 text-sm text-gray-600 leading-relaxed -mt-1">{a}</p>}
    </div>
  )
}

function FAQSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">FAQ</span>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">Common questions</h2>
        </div>
        <div className="border-t border-gray-200">
          {HOME_FAQS.map(item => <FAQItem key={item.q} {...item} />)}
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          More questions?{' '}
          <Link to="/faq" className="text-blue-accent hover:underline">See the full FAQ</Link>
          {' '}or{' '}
          <a href="mailto:info@sendasta.com" className="text-blue-accent hover:underline">email us directly</a>.
        </p>
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
              Questions? A real person answers.
            </h2>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Pricing questions, custom setup, integration questions — send a message and you'll hear back within one business day.
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
    <main>
      <Hero onDemoClick={scrollToForm} />
      <ProblemAndHowItWorks />
      <Features />
      <StatsSection />
      <PricingSection onContactClick={scrollToForm} />
      <FAQSection />
      <SetupCallout />
      <ContactForm formRef={formRef} />
    </main>
  )
}

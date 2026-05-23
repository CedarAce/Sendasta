# Sendasta HQ — Founder Analytics Dashboard

**Status:** Design approved, pending implementation plan
**Date:** 2026-05-22
**Author:** Mohamed Siblini (with Claude)

## Problem

Sendasta usage data currently lands in a Google Sheet (via the `/api/log`
webhook fan-out) and in three third-party trackers on the marketing site
(GA4 `G-HQVYFJ2HQ4`, Microsoft Clarity `washcixp6m`, HubSpot `343271870`).
There is no single place where the founder can see, at a glance:

- Which **companies** (sender domains) are actually using the add-in, and
  whether emails are being blocked vs allowed.
- A **funnel** tying anonymous traffic → signup → add-in install → active use.
- A **daily/7-day overview** of activity without opening a spreadsheet.

The existing customer-facing React admin (`marketing/src/pages/admin/*`) is
**org-scoped** — it shows a single customer their own policies/users/billing.
It is the wrong surface for cross-customer founder analytics and must not be
modified or overloaded.

## Goal

A standalone, password-gated **founder analytics dashboard at `/hq`** on the
existing Sendasta Vercel app, modeled on the FlyBnB `/admin` dashboard
(single static HTML+JS file + a few JSON endpoints, no React build), reading
from a new first-party event table in the existing Supabase project.

## Non-goals (explicitly cut)

- **No live per-event stream.** (FlyBnB has one; not wanted here.)
- **No changes to the customer `/admin` React pages.** They stay org-scoped.
  (Later, their "Blocked sends this month — coming soon" tile *could* read
  real numbers from the new table, but that is out of scope for this work.)
- **No replacement of GA4 / Clarity / HubSpot.** HQ does not ingest them.
  Raw web analytics, heatmaps, and CRM stay in those tools and are linked
  from HQ, not duplicated.
- **No GA Data API / GA MCP integration in this phase.** Deferred by user
  decision. HQ is self-sufficient on first-party data so it works without it.
- **No per-event PII scrubbing yet.** The table holds sender/recipient emails
  and IPs, same as today's Sheet. It is protected by the password wall.
  Hashing/truncation can be added later if the data is ever exposed more widely.

## Architecture

A single append-only firehose table in Supabase, fed by the existing
`/api/log` endpoint, read by a standalone `/hq` page. Six parts:

1. **`sendasta_events`** table (Supabase) — every event, every source.
2. **`api/log.js`** (updated) — keeps console + Sheets fan-out, **adds** a
   Supabase insert via the service-role key.
3. **First-party tracker** (`marketing/src/lib/track.js`) — `track(action,
   props)` POSTs to `/api/log`; a `usePageView()` hook fires `page_view` on
   route change; key CTA buttons fire `cta_click`; Supabase
   `onAuthStateChange` fires `user_signed_up` / `user_logged_in`.
4. **`/hq` page + `/api/hq/*` endpoints** — standalone HTML+JS dashboard;
   `overview`, `companies`, `funnel` JSON endpoints run Supabase aggregations.
5. **Password gate** — one shared `HQ_PASSWORD` guards the page and every
   `/api/hq/*` endpoint.
6. **Third-party trackers** (GA4/Clarity/HubSpot) — unchanged, linked from HQ.

### Why this shape

- Vercel's serverless model rules out FlyBnB's long-lived in-memory ring
  buffer, so events must persist. Supabase is already in the project
  (`me.js` uses the service-role key today), so a "table + 3 aggregation
  endpoints + static page" pattern is the natural fit.
- Routing the client tracker through `/api/log` (server-side, service-role)
  instead of writing to Supabase directly from the browser keeps the table
  fully locked down (RLS on, zero policies) and reuses one pipeline for both
  add-in and web events.

## Data flow

```
add-in (Outlook)  ─┐
marketing site    ─┤── POST /api/log ──> console.log
auth state change ─┘                  ├─> Google Sheets webhook (existing, kept)
                                      └─> supabase.insert("sendasta_events")  [service role]

/hq (HTML) ──poll 30s──> /api/hq/overview  ─┐
                         /api/hq/companies  ─┤── supabase.select/aggregate [service role]
                         /api/hq/funnel     ─┘   (all behind HQ_PASSWORD)
```

## Data model — `sendasta_events`

```sql
create table public.sendasta_events (
  id             bigint generated always as identity primary key,
  at             timestamptz not null default now(),
  source         text not null,          -- 'addin' | 'web' | 'auth'
  action         text not null,          -- see taxonomy below
  reason         text,                   -- block/allow reason
  company_domain text,                   -- sender's domain = "the company"
  sender_email   text,
  email          text,                   -- auth/identity events
  org_id         uuid,                   -- when known
  path           text,                   -- web events (route)
  country        text,
  city           text,
  ip             text,
  user_agent     text,
  props          jsonb not null default '{}'::jsonb,  -- overflow
  created_date   date generated always as ((at at time zone 'utc')::date) stored
);

alter table public.sendasta_events enable row level security;
-- No policies: anon/auth client keys cannot read or write.
-- Only the service-role key (server functions) bypasses RLS.

create index sendasta_events_at_idx          on public.sendasta_events (at desc);
create index sendasta_events_company_idx     on public.sendasta_events (company_domain);
create index sendasta_events_action_idx      on public.sendasta_events (action);
create index sendasta_events_source_idx      on public.sendasta_events (source);
create index sendasta_events_created_date_idx on public.sendasta_events (created_date);
```

**Retention:** keep forever (revisit if the table approaches Supabase storage
limits; a prune job can be added later).

### `props` (jsonb) overflow examples

- block/allow: `{ "recipientEmails": [...], "recipientCount": 3 }`
- web cta_click: `{ "label": "begin_checkout", "plan": "business", "referrer": "..." }`
- page_view: `{ "referrer": "...", "title": "Pricing" }`
- auth: `{ "provider": "google" }`

## Event taxonomy

| source | action | when | key fields |
|--------|--------|------|-----------|
| addin | `scan_started` | user runs a scan | company_domain, sender_email |
| addin | `email_blocked` | send blocked | reason, company_domain, sender_email, props.recipientEmails |
| addin | `email_allowed` | send allowed | reason, company_domain, sender_email |
| addin | `addin_activated` | **new** — first add-in load per email | email, company_domain |
| web | `page_view` | React route change | path, country, city, props.referrer |
| web | `cta_click` | key conversion buttons | props.label, props.plan |
| auth | `user_signed_up` | first Supabase session for a user | email, org_id |
| auth | `user_logged_in` | subsequent logins | email, org_id |

Existing add-in events (`scan_started`, `email_blocked`, `email_allowed`) are
already emitted by `src/commands/commands.js` and `src/commands-v2/commands.js`
via their `log()` helper POSTing to `https://sendasta.com/api/log`. They need
**no client change** — they simply gain a database behind the endpoint.

## Components / file changes

### 1. Supabase migration (new)
- Create `sendasta_events` table + indexes + RLS as above.

### 2. `api/log.js` (modify)
- Add a Supabase admin client (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`,
  same env vars `me.js` already uses).
- After the existing console + Sheets logic, insert a normalized row into
  `sendasta_events`. Map known top-level fields (action, reason,
  companyDomain→company_domain, senderEmail→sender_email, email, path,
  country, city, ip, user_agent) to columns; everything else → `props`.
- Insert must be best-effort and non-blocking: wrap in try/catch, never fail
  the request if Supabase is down (same fail-open posture as the Sheets
  fan-out today).
- Only persist events that carry an `action` (matches the existing Sheets
  guard that ignores raw debug strings).

### 3. `marketing/src/lib/track.js` (new)
- `track(action, props)`: `fetch('/api/log', { method:'POST', keepalive:true,
  body: JSON.stringify({ source, action, ...props }) })`. Fire-and-forget;
  swallow errors.
- `usePageView()` hook: on `useLocation()` change, `track('page_view', {
  path, source:'web' })`.
- Helper to fire `cta_click` from buttons.

### 4. `marketing/src/components/MarketingLayout.jsx` (modify)
- Call `usePageView()` so every marketing route logs a `page_view`.
  (Admin routes can be excluded or tagged; founder cares about marketing
  traffic.)

### 5. CTA wiring (modify)
- `marketing/src/components/PricingCards.jsx` already calls `trackEvent` →
  `window.gtag` (GA). Add a parallel `track('cta_click', {label, plan})` so the
  conversion clicks also land in `sendasta_events` for the funnel.
- Wire Get Started / Download CTAs similarly.

### 6. Auth events (modify)
- In the marketing auth context (`AuthContext`), on `onAuthStateChange`, fire
  `user_signed_up` (first session) / `user_logged_in`. Use a flag to
  distinguish first signup from repeat login.

### 7. Add-in activation (modify)
- On first add-in load per email (guarded by a localStorage/roaming-settings
  flag), `log({ action:'addin_activated', email, companyDomain })`.

### 8. `api/hq/index.js` (new) — the page
- Returns the standalone HTML+JS dashboard (FlyBnB pattern). Dark UI.
- Behind `requireHqAuth`.

### 9. `api/hq/overview.js`, `api/hq/companies.js`, `api/hq/funnel.js` (new)
- JSON aggregation endpoints (see contracts below). Behind `requireHqAuth`.

### 10. `api/_hqAuth.js` (new) — shared guard
- `requireHqAuth(req, res)`: HTTP Basic auth checking `HQ_PASSWORD` env var.
  Returns true if authorized, else sets `WWW-Authenticate` + 401 and returns
  false. Used by the page and all `/api/hq/*` endpoints.

### 11. `vercel.json` (modify)
- Add rewrite `{ "source": "/hq", "destination": "/api/hq" }` (rewrites are an
  explicit allowlist today). `/api/hq/*` endpoints are served automatically by
  Vercel's filesystem routing.

## Endpoint contracts

### `GET /api/hq/overview`
```json
{
  "today": {
    "visitors": 0, "pageViews": 0, "scans": 0, "blocks": 0,
    "allows": 0, "signups": 0, "activations": 0
  },
  "totals": { "companies": 0, "activeCompanies7d": 0 },
  "weeklyChart": [ { "day": "Mon May 19", "scans": 0, "visitors": 0 } ],
  "now": "ISO"
}
```

### `GET /api/hq/companies`
```json
{
  "companies": [
    { "domain": "acme.com", "scans": 0, "blocks": 0, "allows": 0,
      "uniqueSenders": 0, "lastSeen": "ISO" }
  ],
  "now": "ISO"
}
```

### `GET /api/hq/funnel`
```json
{
  "stages": [
    { "key": "visited",     "label": "Visited",        "count": 0 },
    { "key": "pricing",     "label": "Pricing intent", "count": 0 },
    { "key": "signed_up",   "label": "Signed up",      "count": 0 },
    { "key": "activated",   "label": "Add-in activated","count": 0 },
    { "key": "active",      "label": "Active",         "count": 0 }
  ],
  "rangeDays": 30,
  "now": "ISO"
}
```

## The `/hq` page — panels

1. **Overview** — stat cards (visitors today, scans today, blocks today, new
   signups, total companies, active companies 7d) + a 7-day bar chart.
   Polls `/api/hq/overview` every ~30s.
2. **Per-company breakdown** — table grouped by `company_domain`: scans /
   blocks / allows / unique senders / last seen, sortable.
3. **Funnel** — Visited → Pricing intent → Signed up → Add-in activated →
   Active, with counts and drop-off %.
4. Footer links out to GA4, Clarity, and HubSpot dashboards.

Dark, FlyBnB-style single HTML file. No live event stream.

## Access control

- One shared password in env `HQ_PASSWORD`.
- `requireHqAuth` enforces HTTP Basic auth on the page and every `/api/hq/*`
  endpoint. Browser shows a native auth prompt; credentials cached by the
  browser for the session.
- No Supabase login required (kept separate from the customer auth system).

## Environment variables

| var | where | purpose | status |
|-----|-------|---------|--------|
| `SUPABASE_URL` | Vercel (server) | Supabase project | exists (used by `me.js`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (server) | service-role insert/read | exists (used by `me.js`) |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Vercel (server) | Sheets fan-out | exists |
| `HQ_PASSWORD` | Vercel (server) | HQ basic-auth password | **new** |

## Build order

1. **Data spine** — `sendasta_events` migration + `api/log.js` insert. Events
   start flowing immediately (add-in events first, since they already POST).
2. **First-party tracker** — `track.js`, `usePageView()`, CTA wiring, auth
   events, add-in activation ping.
3. **HQ surface** — `api/_hqAuth.js`, `/hq` page, the 3 JSON endpoints,
   `vercel.json` rewrite, `HQ_PASSWORD`.
4. **(Deferred)** GA Data API / GA MCP — optional later tile for richer
   anonymous web metrics.

## Open questions / future

- Funnel attribution is count-based per time window (not per-user journey
  joins) in v1 — sufficient for trend visibility; per-user stitching later if
  needed.
- `addin_activated` "first load per email" relies on a client-side flag; if it
  proves unreliable in the Outlook sandbox, derive activation server-side as
  "first `scan_started` per email" instead.
- Consider a future `daily_rollups` table if raw-event aggregation gets slow at
  scale (not needed at current volumes).

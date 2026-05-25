# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Sendasta is

Sendasta is a Microsoft Outlook add-in that intercepts the **Send** event and warns/blocks emails going to unintended recipients (blocked domains, conflicting domain combinations, or multiple external organizations). It ships in two tiers:

- **Personal** (free): checks the `To` field only, no server policy.
- **Business** (paid): admin-managed policies stored in Supabase, Cc/Bcc checking, PII-stripped analytics, billed via Stripe.

## Repository layout — one repo, three deployables, one Vercel project

This is a monorepo where **three independent builds all emit into the single `public/` directory**, which Vercel serves as one site at `sendasta.com`:

1. **Outlook add-in** (`src/`, built by **webpack**) → `public/taskpane*.html`, `public/commands*.js`, etc.
2. **Marketing + admin SPA** (`marketing/`, built by **Vite + React + Tailwind v4**) → `public/index.html`, `public/assets/*`.
3. **Serverless API** (`api/`, Vercel Node functions) — not built; deployed as-is, shares the **root** `package.json` (separate from `marketing/package.json`).

Because both bundlers target `public/`, neither is allowed to clean it: webpack uses `clean: false` (see the comment in `webpack.config.js`) and Vite uses `emptyOutDir: false`. **Do not "fix" these to clean the output dir** — doing so wipes the other build's files. `vercel.json` rewrites SPA routes (`/pricing`, `/admin/*`, etc.) to `index.html` and `/hq` to the `/api/hq` function.

### Hosting vs. add-in distribution (two different things)
All three builds are **hosted** together on the single Vercel project at `sendasta.com`. But the Outlook add-in reaches users through a **separate distribution channel**: the add-in code is served from `sendasta.com`, while the **manifest XML** (`public/sendasta-manifest.xml`, served from `public-static/`) is what users install. Distribution paths: end users sideload the manifest in Outlook; IT admins push it org-wide via the Microsoft 365 Admin Center (Integrated Apps → Upload custom apps); the long-term goal is the Microsoft AppSource store. So a code change ships the moment Vercel deploys, but a **manifest** change only reaches existing users when they (or their admin) re-install — change the manifest sparingly and bump versions deliberately.

## Common commands

Add-in (root `package.json`):
```bash
npm run build:addin     # webpack production build of the add-in → public/
npm run build:dev       # webpack development build
npm run dev-server      # webpack dev server, HTTPS on :3000 (needs office-addin-dev-certs)
npm run start           # sideload + debug the add-in in Outlook desktop
npm run validate        # validate public/manifest-sendasta.xml
npm run lint            # office-addin-lint (ESLint for the add-in src)
npm run lint:fix
npm test                # node --test lib/*.test.mjs  (the ONLY automated tests)
```

Marketing/admin SPA (run from `marketing/`):
```bash
cd marketing && npm run dev       # Vite dev server on :5173
cd marketing && npm run build     # vite build → ../public, then postbuild prerenders
```
Or from the root, `npm run dev:marketing` copies the logo/favicon into `public/` first, then runs the Vite dev server.

The root `npm run build` does the full production build: add-in webpack build, then (when not on Vercel) `marketing` install + build.

### Running a single test
Tests are plain Node test files. Run one with:
```bash
node --test lib/aggregate.test.mjs
```
Only `lib/*.test.mjs` are covered by automated tests — the add-in client, React app, and API handlers have **no test suite**; verify those manually (sideload in Outlook / run the dev servers).

## Architecture (the parts that span multiple files)

### Tier detection bridges the add-in to Supabase
The add-in stores policy in **Outlook roaming settings** (local, per-mailbox), but admins edit policy in **Supabase** via the SPA. `api/me.js` is the bridge: on load, `src/taskpane-v2/taskpane.js` calls `Office.auth.getAccessToken()` and POSTs the SSO token to `/api/me`, which verifies the Microsoft JWT (via `jose`), looks up the user's org membership + `policies` row in Supabase, and returns `{ tier, orgId, policy, ... }`. The taskpane then writes that policy into roaming settings so the send-time handler can read it locally. **Any failure → `personal` tier** (the endpoint never errors to the client).

### Send-time enforcement: `src/commands-v2/commands.js`
`onMessageSendHandler` is the core product logic, registered via `Office.actions.associate` both at module top-level (classic Outlook fires events before `Office.onReady`) and inside `onReady` (new Outlook/WebView). Evaluation order in `evaluateRecipients`:
1. Blocked domains → block
2. No-combine pairs (both domains present together) → block
3. ≤1 external domain → allow
4. All external domains form allowed pairs → allow
5. Otherwise (multiple unrelated external domains) → alert/block

Cc/Bcc are only read for the **business** tier.

### v2 is live; v1 is legacy
The production manifest (`public-static/sendasta-manifest.xml`) points at `taskpane-v2.html` / `commands-v2.js`. The `src/taskpane/` and `src/commands/` (v1) entry points still build but are **not** what production loads. Make changes in the `*-v2` directories unless explicitly working on v1. `*_backup.js` files are dead.

### Analytics pipeline — everything funnels through `/api/log`
Both the add-in (`commands-v2.js` `log()`) and the SPA (`marketing/src/lib/track.js`) POST events to `/api/log`. The handler (`api/log.js`):
1. logs to the Vercel console,
2. forwards to a Google Sheets webhook if `GOOGLE_SHEETS_WEBHOOK_URL` is set,
3. persists to the Supabase `sendasta_events` table via `normalizeEvent` (`lib/events.cjs`).

`normalizeEvent` maps camelCase (legacy add-in) and snake_case keys onto known columns, drops everything else into a `props` JSON blob, infers `source` (addin/auth/web), and only fills geo fields from Vercel headers when the body didn't supply them. **Business-tier clients strip PII** (`senderEmail`, `recipientEmails`) before sending — see `PII_FIELDS` in `commands-v2.js`; domain-level fields are kept so admin analytics still work.

### HQ founder dashboard — `/hq`
`api/hq/index.js` serves a self-contained HTML+JS dashboard, gated by **HTTP Basic auth** against `HQ_PASSWORD` (`lib/hqAuth.cjs`). It fetches `/api/hq/{overview,companies,funnel,recent}`, which aggregate `sendasta_events` rows using the pure functions in `lib/aggregate.cjs`. This is separate from the customer-facing `/admin` SPA.

### Billing — Stripe, trial state computed in JS
`api/billing/{create-checkout-session,create-portal-session,webhook}.js`. The webhook **requires the raw body** (`export const config = { api: { bodyParser: false } }`) for signature verification. Subscription state lives on the `organizations` row (`subscription_status`, `trial_ends_at`, `stripe_*`). Trial soft/hard-lock cutoffs are computed at runtime in JS (`marketing/src/lib/trialState.js`), not in SQL. `marketing/TRIAL_BILLING_PLAN.md` is the full design doc for this flow.

### Why `lib/*.cjs` is CommonJS (don't convert to ESM)
Vercel compiles the ESM `api/*.js` handlers down to CommonJS. A compiled `require()` **cannot load an ESM `.mjs` module**, so shared helpers consumed by handlers are written as `.cjs`. Two recurring workarounds you'll see and should preserve:
- **`jose` is ESM-only**: `api/me.js` loads it via dynamic `import()` inside the handler and caches the JWKS, because a static import becomes `require()` → `ERR_REQUIRE_ESM` at load.
- **`supabase-js` needs a WebSocket transport on Node 20**: Vercel's Node 20 has no native `WebSocket`, and supabase-js inits its realtime layer at construction. The clients pass `realtime: { transport: ws }` (the `ws` package) or `createClient` throws. See `lib/supabaseAdmin.cjs`.

`lib/getUserFromRequest.cjs` validates a Supabase user JWT (`Authorization: Bearer`); `lib/supabaseAdmin.cjs` is the lazy service-role singleton (bypasses RLS, server-only).

### Supabase data model
Migrations live in `supabase/migrations/`. Core tables: `organizations`, `organization_members` (or `profiles` in older setup), `policies` (one row per org: `blocked_domains`, `internal_domains`, `no_combine_pairs`, `trusted_pairs`), `licenses`, `policy_suggestions`, and `sendasta_events`. RLS scopes reads/writes to the user's org; admins get write. `handle_new_user()` is a `SECURITY DEFINER` trigger on `auth.users` that auto-provisions an org + policy row + admin membership on signup (and stamps the trial). `marketing/SETUP.md` documents the full schema, RLS policies, and the Supabase/Azure dashboard setup.

### SPA structure
React Router app (`marketing/src/App.jsx`) with three route groups: marketing pages (`MarketingLayout`), auth pages (no chrome), and protected `/admin/*` pages (`ProtectedRoute` → `AdminLayout`). Auth/org state come from `context/AuthContext.jsx` and `context/OrgContext.jsx`; `hooks`/`lib` hold the Supabase client and the optimistic `usePolicy` hook. Marketing pages are **prerendered** at build time by `marketing/prerender.js` (puppeteer + `@sparticuz/chromium`) for SEO — it boots a static server, renders `/` and `/for-it-admins`, and writes the resulting HTML back into `public/`.

## Go-to-market (context for marketing/copy work)

- **Positioning**: prevent costly, irreversible email mistakes (wrong recipient via auto-complete, leaking confidential docs to a competitor). Pain-led messaging — "stop sending emails to the wrong person."
- **Tiers**: free **Personal** (To-field check, no signup needed — drives top-of-funnel) → paid **Business** (admin policies, Cc/Bcc, analytics, Stripe). The free version is the acquisition wedge; conversion happens on the value of org-wide policy + analytics.
- **Target niches** (where a leak is catastrophic): law firms, M&A advisors, healthcare, accounting.
- **Distribution**: self-serve sideload + IT-admin push via Microsoft 365 Admin Center (the "side-loading secret" — no AppSource gatekeeping needed to start); Product Hunt launch planned.
- When asked to write or critique **copy** (headlines, landing pages, ads, emails), invoke the `marketing` skill — it's the methodology to apply; this section is the product/audience context to apply it to. Full detail in `marketing_and_tracking_guide.md`.

## Environment variables

- **Client-exposed** (Vite, must be prefixed `VITE_`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Set in `marketing/.env.local` (gitignored).
- **Server-only** (Vercel project env, no prefix): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AZURE_AAD_AUDIENCE`, `HQ_PASSWORD`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` (single flat $99/mo price), `GOOGLE_SHEETS_WEBHOOK_URL`, plus the legacy `GUMROAD_PRODUCT_ID` for `api/validate.js`.

## Reference docs in this repo

- `marketing/SETUP.md` — Supabase schema + RLS + Azure SSO dashboard setup.
- `marketing/TRIAL_BILLING_PLAN.md` — full Stripe trial→paid conversion design.
- `docs/superpowers/plans/` and `docs/superpowers/specs/` — HQ analytics and billing design specs.
- `marketing_and_tracking_guide.md`, `SENDASTA_CHANGES_v3.md` — marketing/tracking notes and changelog.

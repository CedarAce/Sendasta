# Sendasta Billing — Flat $99/mo — Design Spec

**Status:** Approved (decisions settled in conversation), ready to build
**Date:** 2026-05-24
**Base:** Adapts `marketing/TRIAL_BILLING_PLAN.md` (2026-05-11) to the new flat pricing + light enforcement. Where this spec is silent, the base plan applies.

## What changed from the base plan (the deltas)

| Topic | Base plan (old) | This spec (new) |
|---|---|---|
| Price | Per-seat, $48/yr or $5/mo, 5-seat min, annual+monthly prices | **One flat price: $99/mo per org** (`STRIPE_PRICE_ID`), `quantity: 1`, no seat sync |
| Trial | 30 days | **14 days** |
| Enforcement | trial → soft-lock (view-only) → hard-lock (full-screen gate) | **Banner + Upgrade prompt only.** Console stays fully usable. No soft-lock, no HardLockGate |
| Plan picker | Monthly vs Annual chooser | None — single plan |
| Pricing CTA | (to wire) | **Already done** — Business card → `/signup` |
| `seats` column | yes | **not needed** |
| Marketplace sync apps | n/a | **Skip** — minimal custom webhook |

## Account model (unchanged, confirmed)
- **Personal (free):** no account, installs add-in. Never hits signup.
- **Business:** `/signup` → creates Supabase user + org → 14-day trial → admin console. Pays from `/admin/billing`.

## DB changes (`organizations`)
```sql
alter table organizations
  add column if not exists trial_ends_at        timestamptz,
  add column if not exists stripe_customer_id   text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status  text default 'trialing',
  add column if not exists current_period_end   timestamptz;
```
- Update `handle_new_user()` (or whatever creates the org on signup) to set `trial_ends_at = now() + interval '14 days'`, `subscription_status = 'trialing'`.
- Backfill existing orgs: `trial_ends_at = created_at + interval '14 days'`, `subscription_status = 'trialing'` where null.
- `subscription_status` values: `trialing | active | past_due | canceled`.

## Trial state (simplified — `marketing/src/lib/trialState.js`)
```js
export function computeTrialState(org) {
  if (!org) return { kind: 'unknown' }
  if (org.subscription_status === 'active')   return { kind: 'paid' }
  if (org.subscription_status === 'past_due') return { kind: 'past_due' }
  if (org.subscription_status === 'canceled') return { kind: 'canceled' }
  const end = new Date(org.trial_ends_at).getTime()
  if (Date.now() < end) return { kind: 'trialing', daysLeft: Math.ceil((end - Date.now()) / 86400000) }
  return { kind: 'trial_ended' }
}
```
No soft/hard lock states. The console is never blocked.

## Backend (Vercel functions; shared libs are `.cjs` — Vercel compiles handlers ESM→CJS)
- **`lib/getUserFromRequest.cjs`** — reads `Authorization: Bearer <jwt>`, validates via `supabase.auth.getUser`, returns `{ user, orgId }` (orgId from `organization_members`). Reuses `lib/supabaseAdmin.cjs` (already built; has the `ws` transport fix).
- **`api/billing/create-checkout-session.js`** — POST, auth. Ensures a Stripe customer (create if `stripe_customer_id` null; store it; `metadata.org_id`). Creates Checkout Session: `mode:'subscription'`, `line_items:[{ price: STRIPE_PRICE_ID, quantity: 1 }]`, `subscription_data:{ trial_period_days: 14 }`, `customer`, `metadata.org_id`, success `/admin/billing?success=1`, cancel `/admin/billing?canceled=1`. **Also inserts a `checkout_started` event** into `sendasta_events` (source `web`, the org's domain/email). Returns `{ url }`.
- **`api/billing/create-portal-session.js`** — POST, auth. Billing Portal session, `return_url=/admin/billing`. Returns `{ url }`.
- **`api/billing/webhook.js`** — POST, no auth, **raw body** (`export const config = { api: { bodyParser: false } }`), verify with `STRIPE_WEBHOOK_SECRET`. Handle:
  - `customer.subscription.created|updated` → update org by `stripe_customer_id`: `subscription_status`, `stripe_subscription_id`, `current_period_end`. On transition to `active`, **insert a `subscription_active` event** into `sendasta_events`.
  - `customer.subscription.deleted` → `subscription_status='canceled'`.
  - Always 200 on unhandled events.
- **`api/me.js` fix** — add `import ws from "ws"` + `realtime: { transport: ws }` to its `createClient` so business-tier detection actually works (currently throws → silently personal). Business tier remains available for any active org membership (trialing or active) — we do **not** gate the add-in on payment (light enforcement).

## Frontend (`marketing/`)
- **`src/context/OrgContext.jsx`** — fetches the user's org row, exposes `{ org, trialState, refresh }`. Mounted in `App.jsx` inside `<AuthProvider>`.
- **`src/components/admin/TrialBanner.jsx`** — shown atop `AdminLayout` when `trialing` (≤7 days left), `trial_ended`, or `past_due`. Button → POST `/api/billing/create-checkout-session` (trial/ended) or `/api/billing/create-portal-session` (past_due), then `window.location = url`.
- **`src/pages/admin/Billing.jsx`** — rewrite: real plan/trial/renewal from `useOrg()`; **"Upgrade to Business"** (→ checkout) when not active; **"Manage subscription"** (→ portal) when active/past_due; one-time success/canceled toast from `?success`/`?canceled`.
- **`AdminLayout.jsx`** — render `<TrialBanner />` above `<Outlet />`. No gate.

## Env vars (you set in Vercel, Production + Preview)
- `STRIPE_SECRET_KEY` = `sk_test_…` (then `sk_live_…` later)
- `STRIPE_PRICE_ID` = `price_…`
- `STRIPE_WEBHOOK_SECRET` = `whsec_…` (after the endpoint is deployed + webhook created)
- (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` already set)

## Deploy / test sequence
1. Build all code (no keys needed). 2. You set `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID`. 3. Deploy. 4. You create the Stripe webhook → `https://sendasta.com/api/billing/webhook`, set `STRIPE_WEBHOOK_SECRET`, redeploy. 5. Test with `4242 4242 4242 4242`: signup → trial banner → Upgrade → checkout → webhook flips org to `active` → banner gone → `subscription_active` shows in HQ → `me.js` reports business.

## Non-goals
- No per-seat billing, no annual plan, no hard-lock gate, no add-in payment enforcement, no marketplace sync apps, no dunning emails (Stripe handles retries).

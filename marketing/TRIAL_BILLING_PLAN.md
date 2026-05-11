# Sendasta — Trial → Paid Conversion with Stripe

> Saved plan for later implementation. Drafted 2026-05-11.

## Context

Sendasta already has signup/login (Supabase) and a scaffolded admin console. Today, the pricing card CTA "Start 30-day free trial" opens an email modal asking customers to email `info@sendasta.com` to get set up. There's no automated trial-to-paid path: no Stripe integration, no trial countdown, no payment UI, and no trial fields in the DB beyond `created_at` on `organizations`.

This plan describes the full conversion flow so a Business signup can become a paying customer without anyone emailing anyone:

- DB schema additions for trial + subscription tracking on `organizations`
- Stripe products (created in dashboard by user) + 3 backend API endpoints (Checkout, Customer Portal, Webhook)
- Frontend wiring: real Billing page, trial countdown banner in admin, hard-lock gate after grace period
- Pricing card CTA rename + route to `/signup`

**Decisions captured:**
- **Trial expiry**: soft lock for 14 days after day 30 (banner only), then hard lock (full-screen "add payment" gate)
- **Seat pricing**: per-seat exact count (Stripe `quantity` = active licenses), 5-seat minimum
- **Stripe state**: account exists, products not created yet — plan includes dashboard setup steps
- **Scope**: full conversion flow end-to-end

The Outlook add-in itself (`src/taskpane/`) is **not changed** in this PR. It still reads policies from local Outlook roaming settings. Subscription-aware enforcement in the add-in is a future task.

## Architecture overview

```
Signup (no CC)
  → org row created with subscription_status='trialing', trial_ends_at = now + 30 days
  → 30 days: full access, banner appears days 25-30
  → days 30-44: soft lock — banner says "Trial ended. Add payment within X days"
                policy edits disabled, viewing still allowed
  → day 44+:   hard lock — full-screen payment gate, admin pages unreachable

Payment path (any time):
  Admin → Billing → "Upgrade" button
    → POST /api/billing/create-checkout-session
    → Redirect to Stripe Checkout (hosted)
    → After pay: Stripe → /api/billing/webhook → DB updated to 'active'
    → User returns to /admin/billing?success=1

Manage active subscription:
  Admin → Billing → "Manage Subscription"
    → POST /api/billing/create-portal-session
    → Redirect to Stripe Customer Portal (hosted)
```

## DB schema additions

New columns on `organizations`:

```sql
alter table organizations
  add column trial_ends_at timestamptz default (now() + interval '30 days'),
  add column stripe_customer_id text,
  add column stripe_subscription_id text,
  add column subscription_status text default 'trialing',
  -- values: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
  add column current_period_end timestamptz,
  add column seats integer default 5;
```

Update `handle_new_user()` trigger to set `trial_ends_at = now() + interval '30 days'` and `subscription_status = 'trialing'` on the new org (current trigger only inserts `name` — add these two fields).

Backfill existing rows: any pre-existing org gets `trial_ends_at = created_at + 30 days`.

**Trial state is computed in JS** (not SQL), since the soft/hard cutoff depends on `now()`. Helper at `marketing/src/lib/trialState.js`:

```js
export function computeTrialState(org) {
  if (org.subscription_status === 'active') return { kind: 'paid' }
  if (org.subscription_status === 'past_due') return { kind: 'past_due' }
  if (org.subscription_status === 'canceled') return { kind: 'canceled' }

  const now = Date.now()
  const trialEnd = new Date(org.trial_ends_at).getTime()
  const softLockEnd = trialEnd + 14 * 24 * 60 * 60 * 1000

  if (now < trialEnd) {
    return { kind: 'trialing', daysLeft: Math.ceil((trialEnd - now) / 86400000) }
  }
  if (now < softLockEnd) {
    return { kind: 'soft_locked', daysLeft: Math.ceil((softLockEnd - now) / 86400000) }
  }
  return { kind: 'hard_locked' }
}
```

## Stripe dashboard setup (one-time)

1. **Products → Add product**: name "Sendasta Business".
2. **Add two prices** under that product:
   - **Annual**: $48/year per seat, recurring yearly, "Per seat" billing (Stripe's quantity-based recurring price).
   - **Monthly**: $5/month per seat, recurring monthly, same per-seat shape.
   - Copy both **Price IDs** (`price_xxx`) into env vars.
3. **Developers → API keys**: copy the **Secret key** (`sk_live_...` or `sk_test_...`).
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://sendasta.com/api/billing/webhook`
   - Events to send: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
   - Copy the **Signing secret** (`whsec_...`).
5. **Customer Portal → Activate**: turn on the hosted Customer Portal so the "Manage Subscription" button has something to send users to. Enable payment method updates, plan switching (monthly ↔ annual), seat quantity edits, invoice history, cancellation.

## Env vars needed

In Vercel (Production + Preview). Stripe vars are server-only, no `VITE_` prefix:

```
STRIPE_SECRET_KEY=sk_test_xxx          # server only, sensitive
STRIPE_WEBHOOK_SECRET=whsec_xxx        # server only, sensitive
STRIPE_PRICE_ANNUAL=price_xxx          # server only
STRIPE_PRICE_MONTHLY=price_xxx         # server only
```

Already exist (used by the new backend routes):
- `SUPABASE_URL` (set by the Vercel-Supabase integration)
- `SUPABASE_SERVICE_ROLE_KEY` (set by the integration — required for webhooks to bypass RLS)

## Backend API endpoints (new files in `api/`)

`@supabase/supabase-js` and `stripe` need to be installed at the repo root (`api/` runs as Vercel Node functions and uses root `package.json`, separate from `marketing/package.json`).

### `api/_lib/supabaseAdmin.js`
Singleton server-side Supabase client using the service-role key. Bypasses RLS. Only used inside `/api/` routes — never bundled to the client.

### `api/_lib/getUserFromRequest.js`
Helper: reads `Authorization: Bearer <jwt>` from request, validates with Supabase, returns `{ user, orgId }`. Returns 401 if missing/invalid.

### `api/billing/create-checkout-session.js`
- **POST**, auth required.
- Body: `{ plan: 'annual' | 'monthly' }`.
- Looks up the org for the authenticated user.
- Counts `licenses` rows for that org → `seats = max(5, count)`.
- If `org.stripe_customer_id` is null, creates a Stripe Customer (email = user.email, metadata.org_id) and stores it.
- Creates Checkout Session: mode `subscription`, line_items `[{ price: STRIPE_PRICE_*, quantity: seats }]`, `customer = stripe_customer_id`, `metadata.org_id`, success_url `https://sendasta.com/admin/billing?success=1`, cancel_url `https://sendasta.com/admin/billing?canceled=1`.
- Returns `{ url: session.url }`.

### `api/billing/create-portal-session.js`
- **POST**, auth required.
- Looks up the org's `stripe_customer_id`.
- Creates Stripe Billing Portal session with `return_url = https://sendasta.com/admin/billing`.
- Returns `{ url: session.url }`.

### `api/billing/webhook.js`
- **POST**, no auth (Stripe signs).
- Verifies the signature with `STRIPE_WEBHOOK_SECRET`.
- **Important**: Vercel functions need `export const config = { api: { bodyParser: false } }` and the raw body to verify Stripe signatures.
- Event handlers:
  - `customer.subscription.created` / `updated`: pull `customer`, `status`, `current_period_end`, `id`. Look up org by `stripe_customer_id`. Update `subscription_status`, `stripe_subscription_id`, `current_period_end`.
  - `customer.subscription.deleted`: set `subscription_status = 'canceled'`.
  - `invoice.payment_succeeded`: optional log (no DB state change).
  - `invoice.payment_failed`: optional log + future email trigger (deferred).
- Returns 200 to Stripe even on non-handled events (to prevent retries).

## Frontend changes

### 1. Pricing card CTA — `marketing/src/components/PricingCards.jsx`
- Replace `STRIPE_BUSINESS_URL` logic (lines 4-6) and the contact-modal trigger.
- CTA text: `Start 30-day free trial` → **`Sign up`**.
- Make it a `<Link to="/signup">` instead of a button that opens a modal.
- The Contact Modal piece may still be referenced from elsewhere — if not, remove it.

### 2. Signup page subtitle — `marketing/src/pages/auth/Signup.jsx`
- Keep "30 days free. No credit card required." — still accurate.

### 3. New: OrgContext — `marketing/src/context/OrgContext.jsx`
- Sibling to `AuthContext`. Lives inside `<AuthProvider>`.
- On session change, fetches the user's `profiles → org_id → organizations` row.
- Computes `trialState` via `computeTrialState(org)`.
- Exposes `{ org, trialState, refresh }`.
- Used by Billing.jsx, TrialBanner.jsx, AdminLayout.jsx.

### 4. New: TrialBanner — `marketing/src/components/admin/TrialBanner.jsx`
- Rendered at the top of `<AdminLayout>` content area (above the page).
- Renders only when `trialState.kind` is `trialing` (with ≤7 days left), `soft_locked`, or `past_due`.
- Trialing (≤7 days): blue banner "X days left in your trial · Add payment now".
- Soft locked: amber banner "Your trial ended. Add payment within Y days to keep editing policies".
- Past due: red banner "Last payment failed · Update payment method".
- Each banner has a button that POSTs to `/api/billing/create-checkout-session` (trialing/soft_locked) or `/api/billing/create-portal-session` (past_due).

### 5. New: HardLockGate — `marketing/src/components/admin/HardLockGate.jsx`
- Rendered inside `<AdminLayout>` instead of `<Outlet />` when `trialState.kind === 'hard_locked'`.
- Centered card on gray-50: "Your trial has ended. Add payment to continue using Sendasta."
- Single CTA: "Add payment" → Stripe Checkout.
- Sidebar nav stays visible (so they can log out), but every page redirects to this gate.

### 6. AdminLayout integration — `marketing/src/components/admin/AdminLayout.jsx`
- Wrap children with `<OrgProvider>` (or move provider to App.jsx, alongside AuthProvider — cleaner).
- If `trialState.kind === 'hard_locked'`: render `<HardLockGate />` in place of `<Outlet />`.
- Otherwise: render `<TrialBanner />` + `<Outlet />`.

### 7. Billing page rewrite — `marketing/src/pages/admin/Billing.jsx`
- Replace mocked stats with real values from `useOrg()`:
  - **Current plan**: "Trial" / "Business — Monthly" / "Business — Annual" / "Canceled".
  - **Seats**: `count(licenses where org_id = ...)` — fetch via Supabase query.
  - **Renewal**: `current_period_end` if subscribed, or "Trial ends MM/DD" if trialing.
- Buttons:
  - State `trialing` / `soft_locked` / `hard_locked` / `canceled`: **"Upgrade to Business"** → opens a small inline plan-picker (Monthly vs Annual) → POSTs `/api/billing/create-checkout-session`.
  - State `active`: **"Manage Subscription"** → POSTs `/api/billing/create-portal-session`.
  - State `past_due`: same as `active` (portal).
- "Recent invoices" section can stay empty / placeholder for now — Stripe Portal handles invoice history.

### 8. Success/canceled URL handling
After Checkout, Stripe redirects to `/admin/billing?success=1` or `/admin/billing?canceled=1`. In `Billing.jsx`, read the query param and show a one-time toast:
- `success=1`: "Welcome to Sendasta Business! Your subscription is active." (call `refresh()` from useOrg to re-fetch the row in case webhook is fast enough)
- `canceled=1`: "Checkout canceled. You can try again any time."

## Marketing copy that needs adjusting

Several places mention "email info@sendasta.com" to start a trial — should now point users to `/signup` directly:
- `marketing/src/pages/Pricing.jsx` FAQ
- `marketing/src/pages/FAQ.jsx` trial question
- `marketing/src/pages/Home.jsx` trial-related FAQ
- `marketing/src/components/PricingCards.jsx` modal copy

Replace "Email info@sendasta.com and we'll get you set up" with "Sign up at /signup — 30 days free, no credit card."

## Sequenced milestones

**M1 — Pricing card CTA + copy sweep**
1. Replace pricing card CTA button with `<Link to="/signup">Sign up</Link>`.
2. Update FAQ / pricing copy mentions to point at /signup instead of email.
3. Build clean, ship to prod. No backend dependency.

**M2 — DB schema + trigger updates**
4. Run migration on Supabase (alter table, update trigger, backfill existing rows).

**M3 — Stripe dashboard setup (user does)**
5. Create product + 2 prices in Stripe.
6. Create webhook endpoint pointing at `/api/billing/webhook`.
7. Activate Customer Portal.
8. Set env vars in Vercel.

**M4 — Backend endpoints**
9. Install `stripe` and `@supabase/supabase-js` at repo root.
10. Build `api/_lib/supabaseAdmin.js`, `api/_lib/getUserFromRequest.js`.
11. Build the three `/api/billing/*` routes.
12. Local test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/billing/webhook`.

**M5 — Frontend org context + trial banner + hard-lock gate**
13. Build `marketing/src/lib/trialState.js`, `marketing/src/context/OrgContext.jsx`.
14. Build `TrialBanner.jsx`, `HardLockGate.jsx`.
15. Wire into `AdminLayout.jsx`.

**M6 — Wire Billing page**
16. Replace mocked Billing.jsx with real `useOrg()` data + Checkout/Portal buttons.
17. Handle `?success=1` / `?canceled=1` query params.

**M7 — End-to-end verification**
18. Walk through full flow with Stripe test card.

## Files modified vs created

**Modify**:
- `marketing/src/components/PricingCards.jsx`
- `marketing/src/pages/admin/Billing.jsx`
- `marketing/src/components/admin/AdminLayout.jsx`
- `marketing/src/App.jsx` (add OrgProvider)
- `marketing/src/pages/Pricing.jsx`, `FAQ.jsx`, `Home.jsx` (FAQ copy)
- `marketing/SETUP.md` (Stripe section + schema update)
- `package.json` (root — add `stripe`, `@supabase/supabase-js`)

**Create**:
- `marketing/src/lib/trialState.js`
- `marketing/src/context/OrgContext.jsx`
- `marketing/src/components/admin/TrialBanner.jsx`
- `marketing/src/components/admin/HardLockGate.jsx`
- `api/_lib/supabaseAdmin.js`
- `api/_lib/getUserFromRequest.js`
- `api/billing/create-checkout-session.js`
- `api/billing/create-portal-session.js`
- `api/billing/webhook.js`

## Explicitly NOT in this scope

- **Email reminders** (X days left, trial ended). Can be added later via a Supabase Edge Function on a cron, or Stripe `customer.subscription.trial_will_end` webhook event.
- **Outlook add-in subscription check** — add-in still works regardless of subscription status because it doesn't read from Supabase yet.
- **Multi-currency / VAT / tax**.
- **Discounts / coupons / promo codes**.
- **Annual commitment with monthly invoicing**.
- **Migration of existing trial users** — none exist yet.
- **Webhook retry / dead letter** — Stripe handles retries on non-200 responses; we just need to return 200 reliably.
- **Updating `api/validate.js`** (legacy Lemon Squeezy / Gumroad code, untouched).

## Verification plan

**After M1**: Pricing card's "Sign up" button routes to `/signup` (no modal). Build passes.

**After M2**: New signup creates a row in `organizations` with `trial_ends_at` ≈ now + 30 days and `subscription_status = 'trialing'`.

**After M3**: Stripe dashboard shows the product + 2 prices. Webhook endpoint visible. Customer Portal previewable from the dashboard.

**After M4**: `curl -X POST http://localhost:3000/api/billing/create-checkout-session -H "Authorization: Bearer <user-jwt>" -d '{"plan":"monthly"}'` returns a Stripe Checkout URL. Stripe CLI shows webhook events being received and signed correctly.

**After M5**: New signup → admin → trial banner shows "30 days left in your trial". Manually set `trial_ends_at` to 7 days ago in Supabase → reload `/admin` → soft-lock banner shows "Trial ended. Add payment within 7 days". Set to 15 days ago → reload → `HardLockGate` covers content area, sidebar still visible.

**After M6**: Log in fresh user → /admin/billing shows trial countdown. Click "Upgrade", pick Monthly, redirect to Stripe Checkout. Enter test card `4242 4242 4242 4242`. Returns to `/admin/billing?success=1`, banner gone, plan shows "Business — Monthly", "Manage Subscription" button enabled. Click it → Stripe Portal opens. Cancel subscription in portal → webhook fires → `subscription_status = 'canceled'` in DB → admin Billing reflects "Canceled" + Upgrade button reappears.

**Full E2E smoke after M7**:
1. Incognito → sign up new org → 30-day trial active.
2. Manually invite 6 mock licenses in Supabase Table Editor.
3. /admin/billing → "Upgrade Monthly" → Stripe Checkout shows quantity 6 × $5 = $30/mo → pay with `4242 4242 4242 4242` → return → status = active.
4. Open Stripe portal → change quantity to 10 → webhook updates DB → admin shows 10 seats.
5. Cancel subscription → status = canceled → soft-lock banner re-appears (since trial expired during paid period — actually no, trial_ends_at is past so it'd be `hard_locked` immediately). Confirm hard lock works.
6. Reactivate via portal → status = active → admin unlocks.

## Critical files reference

- `marketing/src/components/PricingCards.jsx` — CTA target
- `marketing/src/pages/admin/Billing.jsx` — main wiring target
- `marketing/src/components/admin/AdminLayout.jsx` — banner + gate insertion
- `marketing/SETUP.md` — append Stripe section + schema migration
- `api/` — new `billing/` subfolder
- `package.json` — root, add `stripe` + `@supabase/supabase-js`

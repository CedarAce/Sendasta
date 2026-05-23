# Sendasta HQ — Founder Analytics Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone, password-gated `/hq` analytics dashboard on the existing Sendasta Vercel app, reading first-party events from a new Supabase `sendasta_events` table fed via the existing `/api/log` endpoint.

**Architecture:** Pure logic lives in ESM `lib/*.mjs` modules (unit-tested with Node's built-in `node --test`). Thin Vercel serverless handlers in `api/` import those libs. The Outlook add-in already POSTs events to `/api/log`; we add a Supabase insert there so data flows immediately. The marketing React site gets a tiny `track()` helper for page views, CTA clicks, and auth events. The dashboard is a single static HTML+JS file served by a serverless function.

**Tech Stack:** Vercel serverless functions (Node, ESM `export default` handlers), Supabase (`@supabase/supabase-js`, already a dep, service-role key), React + Vite (marketing site), Node built-in test runner.

**Working branch:** `main` (user works directly on main — no feature branches). Commit after every task.

**Spec:** `docs/superpowers/specs/2026-05-22-sendasta-hq-founder-analytics-design.md`

---

## File structure

**New files (repo-root serverless side):**
- `supabase/migrations/20260522_sendasta_events.sql` — table + indexes + RLS
- `lib/events.mjs` — `normalizeEvent(body, geo)`: raw payload → table row
- `lib/events.test.mjs` — tests
- `lib/supabaseAdmin.mjs` — lazy service-role client
- `lib/hqAuth.mjs` — `checkBasicAuth` + `requireHqAuth`
- `lib/hqAuth.test.mjs` — tests
- `lib/aggregate.mjs` — `buildOverview` / `buildCompanies` / `buildFunnel`
- `lib/aggregate.test.mjs` — tests
- `api/hq/index.js` — the dashboard HTML page (password-gated)
- `api/hq/overview.js`, `api/hq/companies.js`, `api/hq/funnel.js` — JSON endpoints

**Modified files:**
- `api/log.js` — add best-effort Supabase insert
- `vercel.json` — add `/hq` rewrite
- `package.json` (root) — add `test` script
- `marketing/src/lib/track.js` (new) — `track()` + `usePageView()`
- `marketing/src/components/MarketingLayout.jsx` — call `usePageView()`
- `marketing/src/components/PricingCards.jsx` — fan CTA clicks to `track()`
- `marketing/src/context/AuthContext.jsx` — fire auth events

**Deliberate cuts (vs spec):**
- `addin_activated` event + its funnel stage — dropped (needs unreliable in-Outlook install telemetry). Funnel is 4 stages. Revisit later by deriving activation server-side from first business event per domain.
- Get Started / Download CTAs — only the pricing CTAs are wired in v1 (they drive the "pricing intent" funnel stage). Others can be added later with the same `track('cta_click', …)` call.

---

## Phase A — Data spine (events start flowing)

### Task 1: Create the `sendasta_events` table

**Files:**
- Create: `supabase/migrations/20260522_sendasta_events.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/20260522_sendasta_events.sql
-- First-party event firehose for the Sendasta HQ founder dashboard.
create table if not exists public.sendasta_events (
  id             bigint generated always as identity primary key,
  at             timestamptz not null default now(),
  source         text not null,
  action         text not null,
  reason         text,
  company_domain text,
  sender_email   text,
  email          text,
  org_id         uuid,
  path           text,
  country        text,
  city           text,
  ip             text,
  user_agent     text,
  props          jsonb not null default '{}'::jsonb,
  created_date   date generated always as ((at at time zone 'utc')::date) stored
);

alter table public.sendasta_events enable row level security;
-- No policies: only the service-role key (server functions) can read/write.

create index if not exists sendasta_events_at_idx           on public.sendasta_events (at desc);
create index if not exists sendasta_events_company_idx       on public.sendasta_events (company_domain);
create index if not exists sendasta_events_action_idx        on public.sendasta_events (action);
create index if not exists sendasta_events_source_idx        on public.sendasta_events (source);
create index if not exists sendasta_events_created_date_idx  on public.sendasta_events (created_date);
```

- [ ] **Step 2: Apply the migration**

Apply via the Supabase MCP `apply_migration` tool (name `sendasta_events`, the SQL above) OR paste the SQL into the Supabase dashboard SQL editor and run it.

- [ ] **Step 3: Verify the table exists**

Via Supabase MCP `list_tables`, or in the dashboard, confirm `public.sendasta_events` exists with RLS enabled and the 5 indexes.
Expected: table present, `rls_enabled = true`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260522_sendasta_events.sql
git commit -m "feat(hq): add sendasta_events table migration"
```

---

### Task 2: `normalizeEvent` — raw payload → table row (TDD)

**Files:**
- Create: `lib/events.mjs`
- Test: `lib/events.test.mjs`

- [ ] **Step 1: Add the test script to package.json**

In root `package.json`, replace the `"test"` script (currently `echo "Error: no test specified" && exit 1`) with:

```json
    "test": "node --test lib/*.test.mjs",
```

- [ ] **Step 2: Write the failing test**

```js
// lib/events.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeEvent } from "./events.mjs";

test("returns null when there is no action", () => {
  assert.equal(normalizeEvent({ foo: "bar" }, {}), null);
  assert.equal(normalizeEvent(null, {}), null);
});

test("maps an add-in block event (camelCase) and infers source=addin", () => {
  const row = normalizeEvent(
    {
      action: "email_blocked",
      reason: "blocked_domain",
      companyDomain: "acme.com",
      senderEmail: "joe@acme.com",
      recipientEmails: ["x@evil.com"],
    },
    { ip: "1.2.3.4", country: "US", city: "NYC" }
  );
  assert.equal(row.source, "addin");
  assert.equal(row.action, "email_blocked");
  assert.equal(row.reason, "blocked_domain");
  assert.equal(row.company_domain, "acme.com");
  assert.equal(row.sender_email, "joe@acme.com");
  assert.deepEqual(row.props, { recipientEmails: ["x@evil.com"] });
  assert.equal(row.ip, "1.2.3.4");
  assert.equal(row.country, "US");
  assert.equal(row.city, "NYC");
});

test("infers source=web for page_view and source=auth for user_* actions", () => {
  assert.equal(normalizeEvent({ action: "page_view", path: "/pricing" }, {}).source, "web");
  assert.equal(normalizeEvent({ action: "user_signed_up", email: "a@b.com" }, {}).source, "auth");
});

test("explicit source wins; unknown keys go to props; geo only fills gaps", () => {
  const row = normalizeEvent(
    { action: "cta_click", source: "web", label: "begin_checkout", ip: "9.9.9.9" },
    { ip: "1.1.1.1", country: "CA" }
  );
  assert.equal(row.source, "web");
  assert.equal(row.ip, "9.9.9.9"); // body ip preserved, geo does NOT override
  assert.equal(row.country, "CA"); // geo fills missing
  assert.deepEqual(row.props, { label: "begin_checkout" });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './events.mjs'`.

- [ ] **Step 4: Write the implementation**

```js
// lib/events.mjs
// Maps a raw /api/log POST body + Vercel geo headers into a sendasta_events
// row. Returns null for payloads with no `action` (matches the Sheets fan-out
// guard that ignores raw debug strings). Accepts camelCase (legacy add-in
// payloads) and snake_case.

export const ADDIN_ACTIONS = new Set([
  "scan_started",
  "email_blocked",
  "email_allowed",
]);

const COLUMN_KEYS = new Set([
  "reason", "company_domain", "sender_email", "email",
  "org_id", "path", "country", "city", "ip", "user_agent",
]);

const ALIASES = {
  companyDomain: "company_domain",
  senderEmail: "sender_email",
  orgId: "org_id",
  userAgent: "user_agent",
};

export function normalizeEvent(body, geo = {}) {
  if (!body || typeof body !== "object") return null;
  const action = typeof body.action === "string" ? body.action.trim() : "";
  if (!action) return null;

  const row = { action, props: {} };

  row.source =
    typeof body.source === "string" && body.source
      ? body.source
      : ADDIN_ACTIONS.has(action)
      ? "addin"
      : action.startsWith("user_")
      ? "auth"
      : "web";

  for (const [k, v] of Object.entries(body)) {
    if (k === "action" || k === "source") continue;
    const col = ALIASES[k] || k;
    if (COLUMN_KEYS.has(col)) row[col] = v;
    else row.props[k] = v;
  }

  if (geo.ip && row.ip == null) row.ip = geo.ip;
  if (geo.country && row.country == null) row.country = geo.country;
  if (geo.city && row.city == null) row.city = geo.city;

  return row;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — all `events.test.mjs` tests green.

- [ ] **Step 6: Commit**

```bash
git add lib/events.mjs lib/events.test.mjs package.json
git commit -m "feat(hq): add event normalizer + tests"
```

---

### Task 3: `supabaseAdmin` — lazy service-role client

**Files:**
- Create: `lib/supabaseAdmin.mjs`

- [ ] **Step 1: Write the module**

```js
// lib/supabaseAdmin.mjs
// Lazy singleton Supabase client using the service-role key (bypasses RLS).
// Returns null if env vars are missing so callers can fail open.
import { createClient } from "@supabase/supabase-js";

let client = null;

export function getSupabaseAdmin() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}
```

- [ ] **Step 2: Verify it imports without error**

Run: `node -e "import('./lib/supabaseAdmin.mjs').then(m => console.log(typeof m.getSupabaseAdmin))"`
Expected: prints `function`.

- [ ] **Step 3: Commit**

```bash
git add lib/supabaseAdmin.mjs
git commit -m "feat(hq): add lazy service-role supabase client"
```

---

### Task 4: Wire the Supabase insert into `api/log.js`

**Files:**
- Modify: `api/log.js`

- [ ] **Step 1: Add imports at the top of `api/log.js`**

Add after the existing first line (the file currently starts with `export default async function handler`). Insert these imports **above** that line:

```js
import { getSupabaseAdmin } from "../lib/supabaseAdmin.mjs";
import { normalizeEvent } from "../lib/events.mjs";
```

- [ ] **Step 2: Add the insert after the Google Sheets fan-out block**

In `api/log.js`, immediately after the existing `if (process.env.GOOGLE_SHEETS_WEBHOOK_URL && payload.action) { … }` block and before `res.status(200).json({ ok: true });`, add:

```js
  // 3. Persist to Supabase (best-effort — never fail the request if it errors).
  if (payload.action) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const row = normalizeEvent(entry, { ip, country, city });
        if (row) await supabase.from("sendasta_events").insert(row);
      }
    } catch (e) {
      console.error("[SENDASTA] Supabase insert failed:", e);
    }
  }
```

(Note: `entry` is the raw `req.body` without the added `at`/geo; geo is passed separately. The table's `at` default handles timestamps.)

- [ ] **Step 3: Verify the file parses**

Run: `node --check api/log.js`
Expected: no output (syntax OK). If `node --check` rejects ESM, instead run `node -e "import('./api/log.js').then(()=>console.log('ok'))"` — Expected: `ok`.

- [ ] **Step 4: Manual end-to-end verification (after deploy or via Supabase MCP)**

Either deploy a preview and POST a test event:
```bash
curl -s -X POST https://<preview-url>/api/log \
  -H 'Content-Type: application/json' \
  -d '{"action":"scan_started","companyDomain":"test.com","senderEmail":"me@test.com"}'
```
Then confirm a row exists via Supabase MCP `execute_sql`:
`select source, action, company_domain from sendasta_events order by at desc limit 1;`
Expected: one row, `source=addin`, `action=scan_started`, `company_domain=test.com`.

- [ ] **Step 5: Commit**

```bash
git add api/log.js
git commit -m "feat(hq): persist /api/log events to sendasta_events"
```

---

## Phase B — HQ backend (the dashboard reads the data)

### Task 5: `hqAuth` — Basic-auth guard (TDD)

**Files:**
- Create: `lib/hqAuth.mjs`
- Test: `lib/hqAuth.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// lib/hqAuth.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkBasicAuth } from "./hqAuth.mjs";

const header = (user, pass) =>
  "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

test("accepts the correct password regardless of username", () => {
  assert.equal(checkBasicAuth(header("admin", "s3cret"), "s3cret"), true);
  assert.equal(checkBasicAuth(header("", "s3cret"), "s3cret"), true);
});

test("rejects wrong password, missing header, and unset password", () => {
  assert.equal(checkBasicAuth(header("admin", "nope"), "s3cret"), false);
  assert.equal(checkBasicAuth(undefined, "s3cret"), false);
  assert.equal(checkBasicAuth("Bearer xyz", "s3cret"), false);
  assert.equal(checkBasicAuth(header("admin", "s3cret"), ""), false);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './hqAuth.mjs'`.

- [ ] **Step 3: Write the implementation**

```js
// lib/hqAuth.mjs
// Shared HTTP Basic auth guard for the /hq dashboard and /api/hq/* endpoints.

export function checkBasicAuth(authHeader, password) {
  if (!password) return false; // not configured → deny
  if (typeof authHeader !== "string") return false;
  const m = authHeader.match(/^Basic\s+(.+)$/i);
  if (!m) return false;
  let decoded;
  try {
    decoded = Buffer.from(m[1], "base64").toString("utf8");
  } catch {
    return false;
  }
  const pass = decoded.slice(decoded.indexOf(":") + 1);
  return pass === password;
}

export function requireHqAuth(req, res) {
  const ok = checkBasicAuth(req.headers.authorization, process.env.HQ_PASSWORD);
  if (!ok) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Sendasta HQ"');
    res.status(401).send("Authentication required");
    return false;
  }
  return true;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/hqAuth.mjs lib/hqAuth.test.mjs
git commit -m "feat(hq): add basic-auth guard + tests"
```

---

### Task 6: `aggregate` — overview/companies/funnel builders (TDD)

**Files:**
- Create: `lib/aggregate.mjs`
- Test: `lib/aggregate.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
// lib/aggregate.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildOverview, buildCompanies, buildFunnel } from "./aggregate.mjs";

const NOW = "2026-05-22T12:00:00.000Z";
const day = (n) => new Date(Date.parse(NOW) - n * 864e5).toISOString();

const rows = [
  { at: NOW, action: "page_view", ip: "1.1.1.1", path: "/" },
  { at: NOW, action: "page_view", ip: "1.1.1.1", path: "/pricing" }, // same visitor
  { at: NOW, action: "page_view", ip: "2.2.2.2", path: "/" },
  { at: NOW, action: "cta_click", ip: "2.2.2.2" },
  { at: NOW, action: "user_signed_up", email: "a@acme.com" },
  { at: NOW, action: "scan_started", company_domain: "acme.com", sender_email: "a@acme.com" },
  { at: NOW, action: "email_blocked", company_domain: "acme.com", sender_email: "a@acme.com" },
  { at: day(3), action: "scan_started", company_domain: "beta.com", sender_email: "b@beta.com" },
];

test("buildOverview counts today + totals + 7-day chart", () => {
  const o = buildOverview(rows, NOW);
  assert.equal(o.today.visitors, 2);       // distinct ips with page_view
  assert.equal(o.today.pageViews, 3);
  assert.equal(o.today.scans, 1);
  assert.equal(o.today.blocks, 1);
  assert.equal(o.today.signups, 1);
  assert.equal(o.totals.companies, 2);     // acme + beta
  assert.equal(o.totals.activeCompanies7d, 2);
  assert.equal(o.weeklyChart.length, 7);
  assert.equal(o.weeklyChart[6].scans, 1); // today is last bucket
});

test("buildCompanies groups by domain, newest first", () => {
  const c = buildCompanies(rows).companies;
  assert.equal(c.length, 2);
  assert.equal(c[0].domain, "acme.com");   // most recent lastSeen
  assert.equal(c[0].scans, 1);
  assert.equal(c[0].blocks, 1);
  assert.equal(c[0].uniqueSenders, 1);
});

test("buildFunnel returns 4 stages with distinct-identity counts", () => {
  const f = buildFunnel(rows, 30, NOW);
  const by = Object.fromEntries(f.stages.map((s) => [s.key, s.count]));
  assert.equal(by.visited, 2);    // distinct ips with page_view
  assert.equal(by.pricing, 1);    // distinct ips with cta_click
  assert.equal(by.signed_up, 1);  // distinct emails with user_signed_up
  assert.equal(by.active, 2);     // distinct company_domains with business actions
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './aggregate.mjs'`.

- [ ] **Step 3: Write the implementation**

```js
// lib/aggregate.mjs
// Pure aggregation helpers for the HQ dashboard. Each takes an array of
// sendasta_events rows (snake_case columns) and returns JSON-able objects.

const BUSINESS_ACTIONS = ["scan_started", "email_blocked", "email_allowed"];

function utcDateStr(ts) {
  return new Date(ts).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function uniq(rows, key, filterFn) {
  const s = new Set();
  for (const r of rows) {
    if (filterFn && !filterFn(r)) continue;
    const v = r[key];
    if (v != null && v !== "") s.add(v);
  }
  return s.size;
}

function countAction(rows, action) {
  return rows.filter((r) => r.action === action).length;
}

export function buildOverview(rows, nowISO = new Date().toISOString()) {
  const today = utcDateStr(nowISO);
  const todayRows = rows.filter((r) => utcDateStr(r.at) === today);
  const sevenDaysAgo = Date.parse(nowISO) - 7 * 864e5;

  const weeklyChart = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.parse(nowISO) - i * 864e5);
    const ds = d.toISOString().slice(0, 10);
    const dayRows = rows.filter((r) => utcDateStr(r.at) === ds);
    weeklyChart.push({
      day: d.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
      }),
      scans: dayRows.filter((r) => r.action === "scan_started").length,
      visitors: uniq(dayRows, "ip", (r) => r.action === "page_view"),
    });
  }

  return {
    today: {
      visitors: uniq(todayRows, "ip", (r) => r.action === "page_view"),
      pageViews: countAction(todayRows, "page_view"),
      scans: countAction(todayRows, "scan_started"),
      blocks: countAction(todayRows, "email_blocked"),
      allows: countAction(todayRows, "email_allowed"),
      signups: countAction(todayRows, "user_signed_up"),
    },
    totals: {
      companies: uniq(rows, "company_domain"),
      activeCompanies7d: uniq(rows, "company_domain",
        (r) => BUSINESS_ACTIONS.includes(r.action) && Date.parse(r.at) >= sevenDaysAgo),
    },
    weeklyChart,
    now: nowISO,
  };
}

export function buildCompanies(rows) {
  const map = new Map();
  for (const r of rows) {
    if (!r.company_domain) continue;
    let c = map.get(r.company_domain);
    if (!c) {
      c = { domain: r.company_domain, scans: 0, blocks: 0, allows: 0,
            senders: new Set(), lastSeen: r.at };
      map.set(r.company_domain, c);
    }
    if (r.action === "scan_started") c.scans++;
    if (r.action === "email_blocked") c.blocks++;
    if (r.action === "email_allowed") c.allows++;
    if (r.sender_email) c.senders.add(r.sender_email);
    if (Date.parse(r.at) > Date.parse(c.lastSeen)) c.lastSeen = r.at;
  }
  return {
    companies: [...map.values()]
      .map((c) => ({
        domain: c.domain, scans: c.scans, blocks: c.blocks, allows: c.allows,
        uniqueSenders: c.senders.size, lastSeen: c.lastSeen,
      }))
      .sort((a, b) => Date.parse(b.lastSeen) - Date.parse(a.lastSeen)),
  };
}

export function buildFunnel(rows, rangeDays = 30, nowISO = new Date().toISOString()) {
  const since = Date.parse(nowISO) - rangeDays * 864e5;
  const inRange = rows.filter((r) => Date.parse(r.at) >= since);
  const stage = (key, label, idKey, filterFn) => ({
    key, label, count: uniq(inRange, idKey, filterFn),
  });
  return {
    stages: [
      stage("visited", "Visited", "ip", (r) => r.action === "page_view"),
      stage("pricing", "Pricing intent", "ip", (r) => r.action === "cta_click"),
      stage("signed_up", "Signed up", "email", (r) => r.action === "user_signed_up"),
      stage("active", "Active", "company_domain", (r) => BUSINESS_ACTIONS.includes(r.action)),
    ],
    rangeDays,
    now: nowISO,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — all three suites green.

- [ ] **Step 5: Commit**

```bash
git add lib/aggregate.mjs lib/aggregate.test.mjs
git commit -m "feat(hq): add overview/companies/funnel aggregators + tests"
```

---

### Task 7: HQ JSON endpoints

**Files:**
- Create: `api/hq/overview.js`, `api/hq/companies.js`, `api/hq/funnel.js`

- [ ] **Step 1: Write `api/hq/overview.js`**

```js
// api/hq/overview.js
import { requireHqAuth } from "../../lib/hqAuth.mjs";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.mjs";
import { buildOverview } from "../../lib/aggregate.mjs";

export default async function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const { data, error } = await supabase
    .from("sendasta_events")
    .select("at,action,ip,company_domain")
    .gte("at", since)
    .limit(50000);
  if (error) return res.status(502).json({ error: error.message });
  res.json(buildOverview(data || []));
}
```

- [ ] **Step 2: Write `api/hq/companies.js`**

```js
// api/hq/companies.js
import { requireHqAuth } from "../../lib/hqAuth.mjs";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.mjs";
import { buildCompanies } from "../../lib/aggregate.mjs";

export default async function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const { data, error } = await supabase
    .from("sendasta_events")
    .select("at,action,company_domain,sender_email")
    .not("company_domain", "is", null)
    .gte("at", since)
    .limit(50000);
  if (error) return res.status(502).json({ error: error.message });
  res.json(buildCompanies(data || []));
}
```

- [ ] **Step 3: Write `api/hq/funnel.js`**

```js
// api/hq/funnel.js
import { requireHqAuth } from "../../lib/hqAuth.mjs";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.mjs";
import { buildFunnel } from "../../lib/aggregate.mjs";

export default async function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const { data, error } = await supabase
    .from("sendasta_events")
    .select("at,action,ip,email,company_domain")
    .gte("at", since)
    .limit(50000);
  if (error) return res.status(502).json({ error: error.message });
  res.json(buildFunnel(data || [], 30));
}
```

- [ ] **Step 4: Verify all three parse**

Run: `for f in api/hq/overview.js api/hq/companies.js api/hq/funnel.js; do node -e "import('./$f').then(()=>console.log('ok $f'))"; done`
Expected: `ok` for each.

- [ ] **Step 5: Commit**

```bash
git add api/hq/overview.js api/hq/companies.js api/hq/funnel.js
git commit -m "feat(hq): add overview/companies/funnel JSON endpoints"
```

---

### Task 8: Routing + password env var

**Files:**
- Modify: `vercel.json`
- Env: `HQ_PASSWORD` (Vercel project settings)

- [ ] **Step 1: Add the `/hq` rewrite**

In `vercel.json`, add this object to the `rewrites` array (after the existing `/admin/:path*` entry):

```json
    { "source": "/hq", "destination": "/api/hq" }
```

- [ ] **Step 2: Set the `HQ_PASSWORD` env var**

In Vercel project settings → Environment Variables (Production + Preview), add `HQ_PASSWORD` with a strong value. (Via Vercel MCP, or the dashboard, or `vercel env add HQ_PASSWORD`.)

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8')); console.log('valid')"`
Expected: `valid`.

- [ ] **Step 4: Commit**

```bash
git add vercel.json
git commit -m "feat(hq): route /hq to the dashboard function"
```

---

### Task 9: The `/hq` dashboard page

**Files:**
- Create: `api/hq/index.js`

- [ ] **Step 1: Write the page handler**

```js
// api/hq/index.js
// Standalone HQ dashboard (HTML+JS). Password-gated. Reads /api/hq/* endpoints.
import { requireHqAuth } from "../../lib/hqAuth.mjs";

export default function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(HTML);
}

const HTML = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sendasta · HQ</title>
<style>
  :root{--bg:#0a0c11;--panel:#13161e;--border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.13);
    --text:#e9eaee;--muted:#6c727f;--accent:#4f8cff;--ok:#22c55e;--warn:#f59e0b;--err:#ef4444;}
  *{box-sizing:border-box} html,body{margin:0;background:var(--bg);color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;font-size:13px;min-height:100vh}
  header{position:sticky;top:0;z-index:5;backdrop-filter:blur(12px);background:rgba(10,12,17,.72);
    border-bottom:1px solid var(--border);padding:12px 24px;display:flex;justify-content:space-between;align-items:center}
  .brand{font-weight:800;letter-spacing:-.02em} .brand .l{color:var(--muted);font-weight:600}
  .container{max-width:1280px;margin:0 auto;padding:24px 24px 80px}
  h2{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:28px 4px 12px}
  .stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
  .stat{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:14px 16px}
  .stat .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:700}
  .stat .val{font-size:26px;font-weight:800;margin-top:6px;font-variant-numeric:tabular-nums}
  .panel{background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-top:14px}
  .panel .ph{padding:12px 16px;border-bottom:1px solid var(--border);font-weight:700;font-size:12px;
    text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
  table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
  th{text-align:left;padding:8px 14px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;
    color:var(--muted);border-bottom:1px solid var(--border)}
  td{padding:9px 14px;border-bottom:1px solid var(--border);font-size:12.5px}
  td.num{text-align:right;font-variant-numeric:tabular-nums}
  tr:last-child td{border-bottom:0}
  .chart{display:flex;align-items:flex-end;gap:8px;height:120px;padding:16px}
  .bar{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
  .bar .f{width:100%;max-width:42px;border-radius:4px 4px 0 0;background:rgba(79,140,255,.35)}
  .bar.today .f{background:linear-gradient(180deg,var(--accent),#2f6fe0)}
  .bar .c{font-size:11px;color:var(--muted);font-weight:700} .bar .d{font-size:10px;color:var(--muted)}
  .funnel{padding:16px;display:flex;flex-direction:column;gap:10px}
  .fstage{display:flex;align-items:center;gap:12px}
  .fstage .name{width:120px;color:var(--muted);font-size:12px}
  .ftrack{flex:1;background:rgba(255,255,255,.05);border-radius:8px;height:30px;position:relative;overflow:hidden}
  .ffill{height:100%;background:linear-gradient(90deg,#2f6fe0,var(--accent));display:flex;align-items:center;
    padding:0 10px;font-weight:700;font-size:12px;min-width:42px}
  .drop{width:70px;text-align:right;color:var(--muted);font-size:11px}
  .links{margin-top:28px;color:var(--muted);font-size:12px}
  .links a{color:var(--accent);text-decoration:none;margin-right:16px}
  .err{color:var(--err);padding:12px 16px}
  .muted{color:var(--muted)}
</style></head>
<body>
<header><div class="brand">Sendasta <span class="l">· HQ</span></div>
  <div class="muted"><span id="clock"></span> · auto 30s</div></header>
<div class="container" id="root"><div class="muted" style="padding:40px">Loading…</div></div>
<script>
(()=>{
  const root=document.getElementById("root"), clock=document.getElementById("clock");
  setInterval(()=>clock.textContent=new Date().toLocaleTimeString(),1000);
  const esc=s=>String(s??"—").replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const fmtAgo=iso=>{if(!iso)return "—";const s=Math.round((Date.now()-new Date(iso))/1000);
    if(s<60)return s+"s ago";if(s<3600)return Math.round(s/60)+"m ago";
    if(s<86400)return Math.round(s/3600)+"h ago";return Math.round(s/86400)+"d ago";};
  async function api(p){const r=await fetch(p);if(!r.ok)throw new Error(p+" → "+r.status);return r.json();}

  function statCards(o){const s=o.today,t=o.totals;
    const c=(l,v)=>'<div class="stat"><div class="lbl">'+l+'</div><div class="val">'+v+'</div></div>';
    return '<div class="stats">'+c("Visitors today",s.visitors)+c("Scans today",s.scans)+
      c("Blocks today",s.blocks)+c("Signups today",s.signups)+c("Companies",t.companies)+
      c("Active (7d)",t.activeCompanies7d)+'</div>';}

  function chart(o){const max=Math.max(1,...o.weeklyChart.map(w=>w.scans));
    const bars=o.weeklyChart.map((w,i)=>{const h=Math.max(4,Math.round(w.scans/max*80));
      const today=i===o.weeklyChart.length-1;
      return '<div class="bar'+(today?' today':'')+'"><div class="c">'+w.scans+
        '</div><div class="f" style="height:'+h+'px"></div><div class="d">'+esc(w.day)+'</div></div>';}).join("");
    return '<div class="panel"><div class="ph">Scans · last 7 days</div><div class="chart">'+bars+'</div></div>';}

  function companies(c){const rows=(c.companies||[]).slice(0,100).map(x=>
    '<tr><td>'+esc(x.domain)+'</td><td class="num">'+x.scans+'</td><td class="num">'+x.blocks+
    '</td><td class="num">'+x.allows+'</td><td class="num">'+x.uniqueSenders+
    '</td><td class="num muted">'+fmtAgo(x.lastSeen)+'</td></tr>').join("")||
    '<tr><td colspan="6" class="muted" style="padding:24px;text-align:center">No company activity yet</td></tr>';
    return '<div class="panel"><div class="ph">Companies · last 30 days</div><table>'+
      '<thead><tr><th>Domain</th><th class="num">Scans</th><th class="num">Blocks</th>'+
      '<th class="num">Allows</th><th class="num">Senders</th><th class="num">Last seen</th></tr></thead>'+
      '<tbody>'+rows+'</tbody></table></div>';}

  function funnel(f){const top=Math.max(1,f.stages[0].count);let prev=null;
    const rows=f.stages.map(s=>{const w=Math.round(s.count/top*100);
      const drop=prev==null||prev===0?"":("−"+Math.round((1-s.count/prev)*100)+"%");prev=s.count;
      return '<div class="fstage"><div class="name">'+esc(s.label)+'</div><div class="ftrack">'+
        '<div class="ffill" style="width:'+Math.max(w,4)+'%">'+s.count+'</div></div>'+
        '<div class="drop">'+drop+'</div></div>';}).join("");
    return '<div class="panel"><div class="ph">Funnel · last '+f.rangeDays+' days</div>'+
      '<div class="funnel">'+rows+'</div></div>';}

  async function load(){try{
    const [o,c,f]=await Promise.all([api("/api/hq/overview"),api("/api/hq/companies"),api("/api/hq/funnel")]);
    root.innerHTML='<h2>Overview</h2>'+statCards(o)+chart(o)+
      '<h2>Funnel</h2>'+funnel(f)+'<h2>Companies</h2>'+companies(c)+
      '<div class="links">↗ <a href="https://analytics.google.com" target="_blank">GA4</a>'+
      '<a href="https://clarity.microsoft.com" target="_blank">Clarity</a>'+
      '<a href="https://app.hubspot.com" target="_blank">HubSpot</a></div>';
  }catch(e){root.innerHTML='<div class="err">Error: '+esc(e.message)+'</div>';}}
  load(); setInterval(()=>{if(document.visibilityState==="visible")load();},30000);
})();
</script></body></html>`;
```

- [ ] **Step 2: Verify it parses**

Run: `node -e "import('./api/hq/index.js').then(()=>console.log('ok'))"`
Expected: `ok`.

- [ ] **Step 3: Manual verification (after deploy)**

Visit `https://<preview-url>/hq` in a browser. Expected: a Basic-auth prompt; entering any username + the `HQ_PASSWORD` shows the dark dashboard with Overview / Funnel / Companies. With no data yet, cards show 0 and tables show empty states (no JS errors in console). Hitting `/api/hq/overview` without auth returns 401.

- [ ] **Step 4: Commit**

```bash
git add api/hq/index.js
git commit -m "feat(hq): add the /hq dashboard page"
```

---

## Phase C — Marketing-site instrumentation (fills the web + funnel data)

### Task 10: `track()` + `usePageView()` helper

**Files:**
- Create: `marketing/src/lib/track.js`

- [ ] **Step 1: Write the helper**

```js
// marketing/src/lib/track.js
// Fire-and-forget analytics for the marketing site. POSTs to the same /api/log
// endpoint the Outlook add-in uses; the server infers `source` and persists to
// Supabase + Google Sheets. Never throws, never blocks the UI.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function track(action, props = {}) {
  try {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...props }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* analytics must never break the page */
  }
}

export function usePageView() {
  const location = useLocation()
  useEffect(() => {
    track('page_view', { path: location.pathname, referrer: document.referrer || null })
  }, [location.pathname])
}
```

- [ ] **Step 2: Verify the build still compiles**

Run: `cd marketing && npm run build`
Expected: build succeeds (no import errors). (The file isn't imported yet, so this just confirms it's valid.)

- [ ] **Step 3: Commit**

```bash
git add marketing/src/lib/track.js
git commit -m "feat(hq): add marketing track() + usePageView helper"
```

---

### Task 11: Fire `page_view` on every marketing route

**Files:**
- Modify: `marketing/src/components/MarketingLayout.jsx`

- [ ] **Step 1: Add the import + hook call**

Replace the top of `marketing/src/components/MarketingLayout.jsx` so it reads:

```jsx
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { usePageView } from '../lib/track'

export default function MarketingLayout() {
  usePageView()
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd marketing && npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual verification (dev or preview)**

Load the site, open DevTools → Network, navigate between Home/Pricing/FAQ. Expected: one `POST /api/log` per navigation with `{"action":"page_view","path":"/pricing",…}`. (On `vite dev` the POST 404s locally — that's fine; verify payload shape. On a Vercel preview the row lands in `sendasta_events`.)

- [ ] **Step 4: Commit**

```bash
git add marketing/src/components/MarketingLayout.jsx
git commit -m "feat(hq): log page_view on marketing route changes"
```

---

### Task 12: Fan pricing CTA clicks to `track()`

**Files:**
- Modify: `marketing/src/components/PricingCards.jsx`

- [ ] **Step 1: Add the import**

At the top of `marketing/src/components/PricingCards.jsx`, add:

```jsx
import { track } from '../lib/track'
```

- [ ] **Step 2: Tap the existing `trackEvent` function**

The file already defines (around line 7):

```js
function trackEvent(eventName, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}
```

Replace it with:

```js
function trackEvent(eventName, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
  // Also record first-party so the HQ funnel's "pricing intent" stage fills.
  track('cta_click', { label: eventName, ...params });
}
```

(Every pricing CTA already calls `trackEvent`, so this single change covers `select_plan` and `begin_checkout`.)

- [ ] **Step 3: Verify build**

Run: `cd marketing && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual verification**

Click a pricing CTA, watch Network. Expected: a `POST /api/log` with `{"action":"cta_click","label":"begin_checkout","plan":"business",…}`.

- [ ] **Step 5: Commit**

```bash
git add marketing/src/components/PricingCards.jsx
git commit -m "feat(hq): log pricing CTA clicks as cta_click events"
```

---

### Task 13: Fire auth events on sign-in / signup

**Files:**
- Modify: `marketing/src/context/AuthContext.jsx`

- [ ] **Step 1: Add the import**

At the top of `marketing/src/context/AuthContext.jsx`, add after the existing imports:

```jsx
import { track } from '../lib/track'
```

- [ ] **Step 2: Fire the event inside `onAuthStateChange`**

Replace the existing listener block:

```jsx
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
    })
```

with:

```jsx
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession ?? null)
      // Only real sign-ins fire SIGNED_IN; restored sessions fire
      // INITIAL_SESSION, so this won't double-log on page load.
      if (event === 'SIGNED_IN' && newSession?.user) {
        const u = newSession.user
        const isNew =
          u.created_at && Date.now() - new Date(u.created_at).getTime() < 60_000
        track(isNew ? 'user_signed_up' : 'user_logged_in', { email: u.email })
      }
    })
```

- [ ] **Step 3: Verify build**

Run: `cd marketing && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual verification**

Log in on a preview deploy. Expected: a `POST /api/log` with `{"action":"user_logged_in","email":"…"}` (or `user_signed_up` within 60s of account creation), and a matching row in `sendasta_events`.

- [ ] **Step 5: Commit**

```bash
git add marketing/src/context/AuthContext.jsx
git commit -m "feat(hq): log signup/login auth events"
```

---

## Final verification

- [ ] **Run the full test suite**

Run: `npm test`
Expected: all `events` / `hqAuth` / `aggregate` suites PASS.

- [ ] **Deploy and smoke-test `/hq`**

Deploy. Visit `/hq`, authenticate, confirm Overview / Funnel / Companies render and update as you generate test events (navigate the marketing site, run an add-in scan). Confirm `/api/hq/*` return 401 without the password.

---

## Self-review (completed during planning)

**Spec coverage:** table ✓ (T1), `/api/log` insert ✓ (T4), event taxonomy ✓ (T2 normalizer, minus the deliberately-cut `addin_activated`), first-party tracker / page_view / cta_click / auth ✓ (T10–13), `/hq` page + 3 panels ✓ (T7, T9), password gate ✓ (T5, T8), `vercel.json` rewrite ✓ (T8), keep-forever + Sheets fan-out ✓ (T4 leaves Sheets untouched). **Cut & noted:** `addin_activated` and its 5th funnel stage; non-pricing CTAs.

**Placeholder scan:** none — every code step has complete code; every run step has an expected result.

**Type/name consistency:** `normalizeEvent`, `getSupabaseAdmin`, `checkBasicAuth`/`requireHqAuth`, `buildOverview`/`buildCompanies`/`buildFunnel` are defined once and imported with matching names/signatures across handlers and tests. Endpoint JSON shapes (`today`, `totals`, `weeklyChart`, `companies`, `stages`) match what the `/hq` page JS reads.

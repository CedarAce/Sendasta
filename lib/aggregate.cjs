// lib/aggregate.cjs
// Pure aggregation helpers for the HQ dashboard. Each takes an array of
// sendasta_events rows (snake_case columns) and returns JSON-able objects.
// CommonJS (.cjs): see note in events.cjs.

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

function buildOverview(rows, nowISO = new Date().toISOString()) {
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

function buildCompanies(rows) {
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

function buildFunnel(rows, rangeDays = 30, nowISO = new Date().toISOString()) {
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

module.exports = { buildOverview, buildCompanies, buildFunnel };

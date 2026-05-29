// lib/orgReport.cjs
// Pure aggregation for the customer-facing Reporting tab. Takes sendasta_events
// rows already scoped to a single org and returns JSON-able report objects.
// CommonJS (.cjs): see note in events.cjs — Vercel compiles api/* handlers to
// CJS and a compiled require() cannot load an ESM .mjs module.
//
// Business-tier events carry no PII (sender/recipient emails are stripped on the
// client), so every metric here is derived from action, reason, at, and the
// non-PII recipientDomains kept in props.

const REASON_LABELS = {
  blocked_domain: "Blocked domain",
  no_combine: "Conflicting domains",
  multi_domain_alert: "Multiple recipients",
};

function utcDateStr(ts) {
  return new Date(ts).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function buildOrgReport(rows, { days = 30, nowISO = new Date().toISOString() } = {}) {
  const sinceMs = Date.parse(nowISO) - days * 864e5;
  const inRange = (rows || []).filter((r) => Date.parse(r.at) >= sinceMs);

  let scans = 0;
  let blocks = 0;
  let allows = 0;
  const reasonCounts = {};
  const domainCounts = {};

  for (const r of inRange) {
    if (r.action === "scan_started") scans++;
    else if (r.action === "email_allowed") allows++;
    else if (r.action === "email_blocked") {
      blocks++;
      if (r.reason) reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
      const domains = r.props && Array.isArray(r.props.recipientDomains)
        ? r.props.recipientDomains
        : [];
      for (const d of domains) {
        if (d) domainCounts[d] = (domainCounts[d] || 0) + 1;
      }
    }
  }

  // Daily trend buckets across the full range, oldest first, newest last.
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.parse(nowISO) - i * 864e5);
    const ds = d.toISOString().slice(0, 10);
    const dayRows = inRange.filter((r) => utcDateStr(r.at) === ds);
    trend.push({
      day: d.toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", timeZone: "UTC",
      }),
      date: ds,
      blocks: dayRows.filter((r) => r.action === "email_blocked").length,
      scans: dayRows.filter((r) => r.action === "scan_started").length,
    });
  }

  const byReason = Object.entries(reasonCounts)
    .map(([reason, count]) => ({ reason, label: REASON_LABELS[reason] || reason, count }))
    .sort((a, b) => b.count - a.count);

  const topDomains = Object.entries(domainCounts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    range: { days, since: new Date(sinceMs).toISOString(), now: nowISO },
    totals: {
      scans,
      blocks,
      allows,
      blockRate: scans ? Math.round((blocks / scans) * 100) : 0,
    },
    trend,
    byReason,
    topDomains,
  };
}

module.exports = { buildOrgReport, REASON_LABELS };

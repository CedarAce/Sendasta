import { test } from "node:test";
import assert from "node:assert/strict";
import { buildOrgReport, REASON_LABELS } from "./orgReport.cjs";

const NOW = "2026-05-28T12:00:00.000Z";
const day = (n) => new Date(Date.parse(NOW) - n * 864e5).toISOString();

const rows = [
  { at: NOW, action: "scan_started", reason: null },
  { at: NOW, action: "email_blocked", reason: "blocked_domain", props: { recipientDomains: ["evil.com"] } },
  { at: NOW, action: "email_allowed", reason: "single_external_domain" },
  { at: NOW, action: "scan_started" },
  { at: NOW, action: "email_blocked", reason: "no_combine", props: { recipientDomains: ["evil.com", "rival.com"] } },
  { at: day(3), action: "scan_started" },
  { at: day(3), action: "email_blocked", reason: "blocked_domain", props: { recipientDomains: ["evil.com"] } },
  { at: day(40), action: "email_blocked", reason: "blocked_domain" }, // outside 30d range
];

test("totals count scans/blocks/allows within range and compute block rate", () => {
  const r = buildOrgReport(rows, { days: 30, nowISO: NOW });
  assert.equal(r.totals.scans, 3);
  assert.equal(r.totals.blocks, 3); // day(40) excluded
  assert.equal(r.totals.allows, 1);
  // blockRate = blocks / scans, rounded to a percentage
  assert.equal(r.totals.blockRate, Math.round((3 / 3) * 100));
});

test("byReason only counts blocked events, labelled, sorted desc", () => {
  const r = buildOrgReport(rows, { days: 30, nowISO: NOW });
  const map = Object.fromEntries(r.byReason.map((x) => [x.reason, x.count]));
  assert.equal(map.blocked_domain, 2);
  assert.equal(map.no_combine, 1);
  assert.equal(r.byReason[0].count >= r.byReason[r.byReason.length - 1].count, true);
  assert.equal(r.byReason[0].label, REASON_LABELS[r.byReason[0].reason]);
});

test("trend has one bucket per day across the range, newest last", () => {
  const r = buildOrgReport(rows, { days: 30, nowISO: NOW });
  assert.equal(r.trend.length, 30);
  const last = r.trend[r.trend.length - 1];
  assert.equal(last.blocks, 2); // two blocks today
  assert.equal(last.scans, 2);
});

test("topDomains aggregates recipientDomains from blocked events", () => {
  const r = buildOrgReport(rows, { days: 30, nowISO: NOW });
  const map = Object.fromEntries(r.topDomains.map((x) => [x.domain, x.count]));
  assert.equal(map["evil.com"], 3); // appears in 3 blocked events within range
  assert.equal(map["rival.com"], 1);
  assert.equal(r.topDomains[0].domain, "evil.com"); // sorted desc
});

test("handles empty input without throwing", () => {
  const r = buildOrgReport([], { days: 7, nowISO: NOW });
  assert.equal(r.totals.scans, 0);
  assert.equal(r.totals.blockRate, 0);
  assert.equal(r.trend.length, 7);
  assert.deepEqual(r.byReason, []);
  assert.deepEqual(r.topDomains, []);
});

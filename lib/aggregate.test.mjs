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

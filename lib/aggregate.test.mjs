// lib/aggregate.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildOverview, buildCompanies, buildFunnel } from "./aggregate.cjs";

const NOW = "2026-05-22T12:00:00.000Z";
const day = (n) => new Date(Date.parse(NOW) - n * 864e5).toISOString();

const rows = [
  { at: NOW, action: "page_view", ip: "1.1.1.1", path: "/", country: "US", city: "New York", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
  { at: NOW, action: "page_view", ip: "1.1.1.1", path: "/pricing", country: "US", city: "New%20York", user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }, // same visitor
  { at: NOW, action: "page_view", ip: "2.2.2.2", path: "/", country: "CA", city: "Toronto", user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15" },
  { at: NOW, action: "cta_click", ip: "2.2.2.2", country: "CA", city: "Toronto" },
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

  // Geo breakdowns assertions
  assert.equal(o.topCountries[0].name, "US");
  assert.equal(o.topCountries[0].count, 2);
  assert.equal(o.topCountries[1].name, "CA");
  assert.equal(o.topCountries[1].count, 2);

  assert.equal(o.topCities[0].name, "New York, US");
  assert.equal(o.topCities[0].count, 2);
  assert.equal(o.topCities[1].name, "Toronto, CA");
  assert.equal(o.topCities[1].count, 2);

  // Platform and browser assertions
  assert.equal(o.topPlatforms.find(p => p.name === "Windows").count, 2);
  assert.equal(o.topPlatforms.find(p => p.name === "macOS").count, 1);
  assert.equal(o.topBrowsers.find(b => b.name === "Chrome").count, 2);
  assert.equal(o.topBrowsers.find(b => b.name === "Safari").count, 1);
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

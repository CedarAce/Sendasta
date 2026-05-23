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

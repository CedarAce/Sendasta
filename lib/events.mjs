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

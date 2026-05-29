// api/admin/analytics.js
// GET (auth required). Returns aggregated, PII-free Sendasta usage analytics for
// the caller's org. Events are scoped by org_id, with a fallback to
// company_domain ∈ the org's internal_domains for older rows that predate
// org_id stamping. Never returns raw event rows.
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.cjs";
import { getUserFromRequest } from "../../lib/getUserFromRequest.cjs";
import { buildOrgReport } from "../../lib/orgReport.cjs";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

const ALLOWED_DAYS = new Set([7, 30, 90]);

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const auth = await getUserFromRequest(req);
  if (!auth || !auth.orgId) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  let days = parseInt(req.query?.days, 10);
  if (!ALLOWED_DAYS.has(days)) days = 30;

  const since = new Date(Date.now() - days * 864e5).toISOString();

  try {
    // Fallback scope: events whose company_domain is one of the org's internal
    // domains (covers rows logged before org_id was stamped).
    const { data: policy } = await supabase
      .from("policies")
      .select("internal_domains")
      .eq("org_id", auth.orgId)
      .maybeSingle();
    const internalDomains = Array.isArray(policy?.internal_domains)
      ? policy.internal_domains.filter(Boolean)
      : [];

    const orClauses = [`org_id.eq.${auth.orgId}`];
    if (internalDomains.length) {
      const list = internalDomains.map((d) => `"${d}"`).join(",");
      orClauses.push(`company_domain.in.(${list})`);
    }

    const { data, error } = await supabase
      .from("sendasta_events")
      .select("at,action,reason,props")
      .or(orClauses.join(","))
      .gte("at", since)
      .limit(50000);
    if (error) return res.status(502).json({ error: error.message });

    res.json(buildOrgReport(data || [], { days }));
  } catch (e) {
    console.error("[admin/analytics] error:", e);
    res.status(502).json({ error: e.message });
  }
}

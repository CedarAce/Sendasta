// api/hq/companies.js
import { requireHqAuth } from "../../lib/hqAuth.cjs";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.cjs";
import { buildCompanies } from "../../lib/aggregate.cjs";

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

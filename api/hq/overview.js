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

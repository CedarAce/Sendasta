// api/hq/recent.js
import { requireHqAuth } from "../../lib/hqAuth.cjs";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.cjs";

export default async function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });

  const { data, error } = await supabase
    .from("sendasta_events")
    .select("id,at,source,action,reason,company_domain,sender_email,email,org_id,path,country,city,ip,user_agent,props")
    .order("at", { ascending: false })
    .limit(100);

  if (error) return res.status(502).json({ error: error.message });
  res.json(data || []);
}

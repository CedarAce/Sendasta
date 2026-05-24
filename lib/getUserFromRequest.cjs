// lib/getUserFromRequest.cjs
// Validates the Supabase JWT from `Authorization: Bearer <jwt>` and returns
// { user, orgId } (orgId = the user's active org membership), or null.
const { getSupabaseAdmin } = require("./supabaseAdmin.cjs");

async function getUserFromRequest(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return null;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;

  const { data: membership } = await supabase
    .from("organization_members")
    .select("org_id")
    .eq("user_id", data.user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  return { user: data.user, orgId: membership?.org_id || null };
}

module.exports = { getUserFromRequest };

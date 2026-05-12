import { createRemoteJWKSet, jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

const JWKS = createRemoteJWKSet(
  new URL("https://login.microsoftonline.com/common/discovery/v2.0/keys")
);

const ISSUER_PATTERNS = [
  /^https:\/\/login\.microsoftonline\.com\/[0-9a-f-]+\/v2\.0$/i,
  /^https:\/\/sts\.windows\.net\/[0-9a-f-]+\/?$/i,
];

function send(res, body, status = 200) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return send(res, {}, 200);
  if (req.method !== "POST") return send(res, { ok: false }, 405);

  try {
    const { ssoToken, orgId, suggested_blocked, suggested_internal, suggested_pairs } =
      req.body || {};
    if (!ssoToken || !orgId) return send(res, { ok: false }, 400);

    const audience = process.env.AZURE_AAD_AUDIENCE;
    if (!audience) return send(res, { ok: false }, 500);

    const { payload } = await jwtVerify(ssoToken, JWKS, { audience });
    const iss = String(payload.iss || "");
    if (!ISSUER_PATTERNS.some((re) => re.test(iss))) {
      return send(res, { ok: false }, 401);
    }

    const email = String(
      payload.preferred_username || payload.upn || payload.email || ""
    ).toLowerCase();
    if (!email) return send(res, { ok: false }, 401);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the user is actually a member of the org they're submitting to.
    const { data: userRow } = await supabase
      .schema("auth")
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!userRow) return send(res, { ok: false }, 401);

    const { data: membership } = await supabase
      .from("organization_members")
      .select("org_id")
      .eq("user_id", userRow.id)
      .eq("org_id", orgId)
      .eq("status", "active")
      .maybeSingle();
    if (!membership) return send(res, { ok: false }, 403);

    const { error: insertErr } = await supabase.from("policy_suggestions").insert({
      org_id: orgId,
      user_id: userRow.id,
      user_email: email,
      suggested_blocked: Array.isArray(suggested_blocked) ? suggested_blocked : [],
      suggested_internal: Array.isArray(suggested_internal) ? suggested_internal : [],
      suggested_pairs: Array.isArray(suggested_pairs) ? suggested_pairs : [],
    });
    if (insertErr) {
      console.error("[policy-suggestions] insert error:", insertErr);
      return send(res, { ok: false }, 500);
    }

    return send(res, { ok: true });
  } catch (err) {
    console.warn("[policy-suggestions] error:", err?.message || err);
    return send(res, { ok: false }, 400);
  }
}

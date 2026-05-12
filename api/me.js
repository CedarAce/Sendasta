import { createRemoteJWKSet, jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

// Microsoft's common JWKS endpoint covers AAD work/school accounts AND consumer MSA.
const JWKS = createRemoteJWKSet(
  new URL("https://login.microsoftonline.com/common/discovery/v2.0/keys")
);

// Issuers we accept:
//   - https://login.microsoftonline.com/{tid}/v2.0   (AAD tenant)
//   - https://sts.windows.net/{tid}/                 (v1 tokens; some hosts still emit these)
//   - https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0  (consumer MSA)
const ISSUER_PATTERNS = [
  /^https:\/\/login\.microsoftonline\.com\/[0-9a-f-]+\/v2\.0$/i,
  /^https:\/\/sts\.windows\.net\/[0-9a-f-]+\/?$/i,
];

const PERSONAL = { tier: "personal" };

function send(res, body, status = 200) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return send(res, {}, 200);
  if (req.method !== "POST") return send(res, PERSONAL, 200);

  // Never error to the client: any failure → personal tier.
  try {
    const { ssoToken } = req.body || {};
    if (!ssoToken || typeof ssoToken !== "string") return send(res, PERSONAL);

    const audience = process.env.AZURE_AAD_AUDIENCE;
    if (!audience) {
      console.error("[me] AZURE_AAD_AUDIENCE not set");
      return send(res, PERSONAL);
    }

    const { payload } = await jwtVerify(ssoToken, JWKS, {
      audience,
      // Verify issuer ourselves below — jose's issuer option is string-equality,
      // but we accept multiple formats.
    });

    const iss = String(payload.iss || "");
    if (!ISSUER_PATTERNS.some((re) => re.test(iss))) {
      console.warn("[me] rejected issuer:", iss);
      return send(res, PERSONAL);
    }

    const email = String(
      payload.preferred_username || payload.upn || payload.email || ""
    ).toLowerCase();
    if (!email) return send(res, PERSONAL);

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error("[me] Supabase env vars missing");
      return send(res, PERSONAL);
    }
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Look up the user by email in auth.users, then find their org membership.
    const { data: userRow, error: userErr } = await supabase
      .schema("auth")
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (userErr || !userRow) return send(res, PERSONAL);

    const { data: membership, error: memErr } = await supabase
      .from("organization_members")
      .select("org_id, role, organizations:org_id (name), policies:org_id (blocked_domains, internal_domains, no_combine_pairs, trusted_pairs, version)")
      .eq("user_id", userRow.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (memErr || !membership) return send(res, PERSONAL);

    return send(res, {
      tier: "business",
      orgId: membership.org_id,
      orgName: membership.organizations?.name ?? null,
      role: membership.role,
      policyVersion: membership.policies?.version ?? 0,
      policy: {
        blocked_domains: membership.policies?.blocked_domains ?? [],
        internal_domains: membership.policies?.internal_domains ?? [],
        no_combine_pairs: membership.policies?.no_combine_pairs ?? [],
        trusted_pairs: membership.policies?.trusted_pairs ?? [],
      },
    });
  } catch (err) {
    console.warn("[me] returning personal due to error:", err?.message || err);
    return send(res, PERSONAL);
  }
}

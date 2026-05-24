// api/billing/create-checkout-session.js
// POST (auth required). Creates a Stripe Checkout Session for the flat $99/mo
// Business plan tied to the caller's org, and logs a checkout_started event.
import Stripe from "stripe";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.cjs";
import { getUserFromRequest } from "../../lib/getUserFromRequest.cjs";

const SITE = "https://sendasta.com";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  if (!secret || !price) return res.status(500).json({ error: "Stripe not configured" });

  const auth = await getUserFromRequest(req);
  if (!auth || !auth.orgId) return res.status(401).json({ error: "Unauthorized" });

  const stripe = new Stripe(secret);
  const supabase = getSupabaseAdmin();

  try {
    const { data: org } = await supabase
      .from("organizations")
      .select("id, name, stripe_customer_id")
      .eq("id", auth.orgId)
      .maybeSingle();
    if (!org) return res.status(404).json({ error: "Organization not found" });

    let customerId = org.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: auth.user.email,
        name: org.name,
        metadata: { org_id: org.id },
      });
      customerId = customer.id;
      await supabase
        .from("organizations")
        .update({ stripe_customer_id: customerId })
        .eq("id", org.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      subscription_data: { metadata: { org_id: org.id } },
      metadata: { org_id: org.id },
      allow_promotion_codes: true,
      success_url: `${SITE}/admin/billing?success=1`,
      cancel_url: `${SITE}/admin/billing?canceled=1`,
    });

    // HQ funnel event (best-effort).
    try {
      const domain = (auth.user.email || "").split("@")[1] || null;
      await supabase.from("sendasta_events").insert({
        source: "web",
        action: "checkout_started",
        company_domain: domain,
        email: auth.user.email,
        org_id: org.id,
        props: {},
      });
    } catch (e) {
      console.error("[billing] checkout_started log failed:", e?.message || e);
    }

    res.json({ url: session.url });
  } catch (e) {
    console.error("[billing] create-checkout-session error:", e);
    res.status(502).json({ error: e.message });
  }
}

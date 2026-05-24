// api/billing/create-portal-session.js
// POST (auth required). Opens the Stripe Billing Portal for the caller's org so
// they can update payment method, view invoices, or cancel.
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
  if (!secret) return res.status(500).json({ error: "Stripe not configured" });

  const auth = await getUserFromRequest(req);
  if (!auth || !auth.orgId) return res.status(401).json({ error: "Unauthorized" });

  const stripe = new Stripe(secret);
  const supabase = getSupabaseAdmin();

  try {
    const { data: org } = await supabase
      .from("organizations")
      .select("stripe_customer_id")
      .eq("id", auth.orgId)
      .maybeSingle();
    if (!org?.stripe_customer_id) {
      return res.status(400).json({ error: "No subscription to manage yet" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripe_customer_id,
      return_url: `${SITE}/admin/billing`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error("[billing] create-portal-session error:", e);
    res.status(502).json({ error: e.message });
  }
}

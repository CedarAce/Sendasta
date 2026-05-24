// api/billing/webhook.js
// Stripe webhook (no auth — Stripe signs). Verifies the signature against
// STRIPE_WEBHOOK_SECRET using the RAW body, then syncs subscription state onto
// the org and logs a subscription_active event when a sub first goes active.
import Stripe from "stripe";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin.cjs";

// Stripe signature verification needs the raw, unparsed body.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function mapStatus(stripeStatus) {
  if (stripeStatus === "active" || stripeStatus === "trialing") return "active";
  if (stripeStatus === "past_due" || stripeStatus === "unpaid") return "past_due";
  if (stripeStatus === "canceled") return "canceled";
  return stripeStatus;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) return res.status(500).send("Stripe not configured");

  const stripe = new Stripe(secret);

  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, req.headers["stripe-signature"], whSecret);
  } catch (e) {
    console.error("[billing] webhook signature failed:", e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  const supabase = getSupabaseAdmin();
  try {
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const sub = event.data.object;
      const mapped = mapStatus(sub.status);
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

      const { data: org } = await supabase
        .from("organizations")
        .select("id, subscription_status")
        .eq("stripe_customer_id", sub.customer)
        .maybeSingle();

      if (org) {
        const wasActive = org.subscription_status === "active";
        await supabase
          .from("organizations")
          .update({
            subscription_status: mapped,
            stripe_subscription_id: sub.id,
            current_period_end: periodEnd,
          })
          .eq("id", org.id);

        if (mapped === "active" && !wasActive) {
          try {
            await supabase.from("sendasta_events").insert({
              source: "web",
              action: "subscription_active",
              org_id: org.id,
              props: {},
            });
          } catch (e) {
            console.error("[billing] subscription_active log failed:", e?.message || e);
          }
        }
      }
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      await supabase
        .from("organizations")
        .update({ subscription_status: "canceled" })
        .eq("stripe_customer_id", sub.customer);
    }

    res.status(200).json({ received: true });
  } catch (e) {
    // Ack anyway so Stripe doesn't hammer retries; the error is logged.
    console.error("[billing] webhook handler error:", e);
    res.status(200).json({ received: true });
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const entry = req.body || {};
  
  // Extract geolocation from Vercel headers
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || "";
  const country = req.headers['x-vercel-ip-country'] || "";
  const city = req.headers['x-vercel-ip-city'] || "";
  
  const payload = { 
    ...entry, 
    ip,
    country,
    city,
    at: new Date().toISOString() 
  };
  
  // 1. Log to Vercel console
  console.log("[SENDASTA]", JSON.stringify(payload));

  // 2. Forward to Google Sheets Webhook (Zapier / Make / GAS) if configured
  // Only forward structured events (ones with an 'action' field), ignore the raw debug strings.
  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL && payload.action) {
    try {
      await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Failed to forward to webhook:", e);
    }
  }

  res.status(200).json({ ok: true });
}

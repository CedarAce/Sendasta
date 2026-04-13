async function validateLemonSqueezy(licenseKey) {
  const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ license_key: licenseKey }),
  });
  const data = await response.json();
  if (data.valid) {
    return { valid: true, email: data.meta?.customer_email ?? null };
  }
  return null;
}

async function validateGumroad(licenseKey) {
  const productId = process.env.GUMROAD_PRODUCT_ID;
  if (!productId) return null;

  const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      product_id: productId,
      license_key: licenseKey,
      increment_uses_count: "false",
    }),
  });
  const data = await response.json();
  if (data.success) {
    return { valid: true, email: data.purchase?.email ?? null };
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { licenseKey } = req.body;
  if (!licenseKey || typeof licenseKey !== "string") {
    return res.status(400).json({ valid: false, error: "No license key provided." });
  }

  try {
    const key = licenseKey.trim();

    const result =
      (await validateLemonSqueezy(key)) ??
      (await validateGumroad(key));

    if (result) {
      return res.status(200).json({ valid: true, email: result.email });
    }

    return res.status(200).json({ valid: false, error: "Invalid license key." });
  } catch {
    return res.status(500).json({ valid: false, error: "Could not reach the license server. Please try again." });
  }
}

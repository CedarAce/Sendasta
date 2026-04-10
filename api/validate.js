export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { licenseKey } = req.body;
  if (!licenseKey || typeof licenseKey !== "string") {
    return res.status(400).json({ valid: false, error: "No license key provided." });
  }

  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        license_key: licenseKey.trim(),
      }),
    });

    const data = await response.json();

    if (data.valid) {
      return res.status(200).json({
        valid: true,
        email: data.meta?.customer_email ?? null,
        activationLimit: data.license_key?.activation_limit ?? null,
        activationsCount: data.license_key?.activations_count ?? null,
      });
    } else {
      return res.status(200).json({ valid: false, error: data.error ?? "Invalid license key." });
    }
  } catch {
    return res.status(500).json({ valid: false, error: "Could not reach the license server. Please try again." });
  }
}

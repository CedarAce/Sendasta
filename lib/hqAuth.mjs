// lib/hqAuth.mjs
// Shared HTTP Basic auth guard for the /hq dashboard and /api/hq/* endpoints.

export function checkBasicAuth(authHeader, password) {
  if (!password) return false; // not configured → deny
  if (typeof authHeader !== "string") return false;
  const m = authHeader.match(/^Basic\s+(.+)$/i);
  if (!m) return false;
  let decoded;
  try {
    decoded = Buffer.from(m[1], "base64").toString("utf8");
  } catch {
    return false;
  }
  const pass = decoded.slice(decoded.indexOf(":") + 1);
  return pass === password;
}

export function requireHqAuth(req, res) {
  const ok = checkBasicAuth(req.headers.authorization, process.env.HQ_PASSWORD);
  if (!ok) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Sendasta HQ"');
    res.status(401).send("Authentication required");
    return false;
  }
  return true;
}

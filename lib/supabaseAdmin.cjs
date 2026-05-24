// lib/supabaseAdmin.cjs
// Lazy singleton Supabase client using the service-role key (bypasses RLS).
// Returns null if env vars are missing so callers can fail open.
// CommonJS (.cjs): see note in events.cjs.
const { createClient } = require("@supabase/supabase-js");

let client = null;

function getSupabaseAdmin() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return client;
}

module.exports = { getSupabaseAdmin };

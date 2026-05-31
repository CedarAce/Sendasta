-- supabase/migrations/20260530_org_setup_state.sql
-- Setup Center progress. Most steps are auto-detected from existing data
-- (internal domains, policy rules, add-in activity, member count). The only
-- step with no server signal is "Deploy org-wide (M365)" — admins mark it done
-- manually, persisted here. The existing "org admin update" RLS policy already
-- lets admins write their org row, and setup_state is not in the revoked
-- billing-column list, so the client can update it directly.
alter table public.organizations
  add column if not exists setup_state jsonb not null default '{}'::jsonb;

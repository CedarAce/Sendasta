-- supabase/migrations/20260524_lock_billing_columns.sql
-- Billing columns are written only by the service role (Stripe webhook).
-- org_admins_can_update_org lets admins update their org row; without this
-- revoke they could self-set subscription_status='active' and bypass payment.
revoke update (trial_ends_at, stripe_customer_id, stripe_subscription_id, subscription_status, current_period_end)
  on public.organizations from anon, authenticated;

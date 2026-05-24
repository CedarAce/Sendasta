-- supabase/migrations/20260524_org_billing.sql
-- Billing/trial state on organizations + stamp trial on signup.

alter table public.organizations
  add column if not exists trial_ends_at          timestamptz,
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status    text default 'trialing',
  add column if not exists current_period_end     timestamptz;

-- Backfill any existing orgs onto a trial relative to their creation.
update public.organizations
set trial_ends_at       = coalesce(trial_ends_at, created_at + interval '14 days'),
    subscription_status = coalesce(subscription_status, 'trialing')
where trial_ends_at is null or subscription_status is null;

-- Stamp the 14-day trial on newly-created orgs at signup. Identical to the
-- existing function except the organizations insert now sets trial fields.
create or replace function public.handle_new_user()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public', 'pg_temp'
as $function$
declare
  v_org_id   uuid;
  v_org_name text;
  v_email    text := new.email;
  v_meta     jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if exists (select 1 from public.organization_members where user_id = new.id) then
    return new;
  end if;

  v_org_name := nullif(trim(v_meta->>'company_name'), '');
  if v_org_name is null then
    v_org_name := nullif(trim(v_meta->>'full_name'), '');
  end if;
  if v_org_name is null and v_email is not null and position('@' in v_email) > 0 then
    v_org_name := split_part(v_email, '@', 2);
  end if;
  v_org_name := coalesce(v_org_name, 'My organization');

  select org_id into v_org_id
  from public.organization_members
  where invited_email is not null
    and lower(invited_email) = lower(v_email)
    and status = 'invited'
  limit 1;

  if v_org_id is not null then
    update public.organization_members
       set user_id = new.id,
           status = 'active',
           invited_email = null,
           last_active_at = now()
     where org_id = v_org_id
       and lower(invited_email) = lower(v_email);
  else
    insert into public.organizations (name, trial_ends_at, subscription_status)
      values (v_org_name, now() + interval '14 days', 'trialing')
      returning id into v_org_id;
    insert into public.policies (org_id) values (v_org_id);
    insert into public.organization_members (org_id, user_id, role, status, last_active_at)
      values (v_org_id, new.id, 'admin', 'active', now());
  end if;

  return new;
end$function$;

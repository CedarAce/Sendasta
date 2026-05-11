# Sendasta Marketing — Auth & Admin Console Setup

This guide walks you through everything you need to do **in the Supabase and Azure dashboards** to make the new login/signup + admin console pages actually work.

The code is already in place. You just need to:
1. Create a Supabase project
2. Run the schema migration
3. (Optional, but recommended) Configure Microsoft 365 SSO via Azure
4. Add the env vars to `.env.local`
5. Restart `npm run dev`

---

## 1. Create the Supabase project

1. Go to https://supabase.com → **New project**.
2. Pick a name (e.g. `sendasta-prod`), set a strong DB password, pick a region close to you, click **Create**.
3. Wait ~2 minutes for provisioning.
4. Open **Project Settings → API** and copy:
   - `Project URL` → this is your `VITE_SUPABASE_URL`
   - `anon public` key → this is your `VITE_SUPABASE_ANON_KEY`

## 2. Add env vars

In `marketing/`, copy `.env.example` to `.env.local` and paste the two values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://abcdefg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

`.env.local` is already in `.gitignore`, so it won't be committed.

## 3. Enable email auth

Supabase dashboard → **Authentication → Providers → Email**:
- Enable
- Toggle **Confirm email** ON

## 4. Configure auth URLs

Supabase dashboard → **Authentication → URL Configuration**:
- **Site URL**: `https://sendasta.com`
- **Redirect URLs** — add both:
  - `http://localhost:5173/auth/callback`
  - `https://sendasta.com/auth/callback`

## 5. Run the schema migration

Supabase dashboard → **SQL Editor → New query**, paste this, then **Run**:

```sql
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'business',
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete set null,
  email text not null,
  role text not null default 'admin',
  created_at timestamptz default now()
);

create table licenses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  email text not null,
  status text not null default 'active',
  created_at timestamptz default now()
);

create table policies (
  org_id uuid primary key references organizations(id) on delete cascade,
  master_enabled boolean default true,
  include_cc_bcc boolean default true,
  internal_domains text[] default '{}',
  blocked_domains text[] default '{}',
  no_combine_pairs jsonb default '[]',
  trusted_pairs jsonb default '[]',
  updated_at timestamptz default now()
);

-- Row-Level Security
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table licenses enable row level security;
alter table policies enable row level security;

create policy "own profile" on profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "org read" on organizations for select
  using (id in (select org_id from profiles where id = auth.uid()));
create policy "org admin update" on organizations for update
  using (id in (select org_id from profiles where id = auth.uid() and role = 'admin'));

create policy "licenses read" on licenses for select
  using (org_id in (select org_id from profiles where id = auth.uid()));
create policy "licenses admin write" on licenses for all
  using (org_id in (select org_id from profiles where id = auth.uid() and role = 'admin'))
  with check (org_id in (select org_id from profiles where id = auth.uid() and role = 'admin'));

create policy "policies read" on policies for select
  using (org_id in (select org_id from profiles where id = auth.uid()));
create policy "policies admin write" on policies for all
  using (org_id in (select org_id from profiles where id = auth.uid() and role = 'admin'))
  with check (org_id in (select org_id from profiles where id = auth.uid() and role = 'admin'));

-- Auto-provision profile + org when a new user signs up
create or replace function handle_new_user() returns trigger as $$
declare new_org_id uuid;
begin
  insert into organizations(name)
    values (coalesce(new.raw_user_meta_data->>'company_name', new.email))
    returning id into new_org_id;
  insert into profiles(id, org_id, email, role)
    values (new.id, new_org_id, new.email, 'admin');
  insert into policies(org_id) values (new_org_id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
```

## 6. (Optional) Microsoft 365 SSO via Azure

This lets users click "Sign in with Microsoft" instead of using email/password. You can skip this initially and add it later.

### 6a. Register the Azure AD app

1. Go to https://portal.azure.com → search **App registrations** → **New registration**.
2. **Name**: `Sendasta` (or whatever).
3. **Supported account types**: choose **Accounts in any organizational directory (Multi-tenant)** — this lets ANY company's Microsoft 365 users sign in.
4. **Redirect URI**: select **Web** and paste your Supabase callback URL:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - (You can find this URL in Supabase → Authentication → Providers → Azure)
5. Click **Register**.

### 6b. Create a client secret

1. In the app you just created → **Certificates & secrets → New client secret**.
2. Set expiry to 24 months → **Add**.
3. **Copy the secret VALUE immediately** (not the Secret ID) — you can't see it again.

### 6c. Add API permissions

1. **API permissions → Add a permission → Microsoft Graph → Delegated permissions**.
2. Check `email`, `openid`, `profile`, `User.Read` → **Add permissions**.

### 6d. Configure Supabase

1. Supabase dashboard → **Authentication → Providers → Azure** → toggle **Enable**.
2. Paste:
   - **Application (client) ID** (from the Azure app's Overview page)
   - **Client Secret** (the value you copied in 6b)
   - **Azure Tenant URL**: `https://login.microsoftonline.com/common/v2.0`
3. Save.

Now the "Sign in with Microsoft" button on `/login` and `/signup` will work.

---

## 7. Verify everything works

1. `cd marketing && npm run dev`
2. Open http://localhost:5173 — site loads as before.
3. Click **Log In** in the navbar → you land on `/login` with a centered card on navy background.
4. Test signup:
   - Click **Sign up** → fill in Company Name = "Acme Co", a work email, password
   - Submit → "Check your email" screen appears
   - Click the verification link in your email → you land on `/admin`
   - In Supabase → **Table Editor** → confirm new rows in `organizations`, `profiles`, `policies`
5. Click through every sidebar item — all 9 admin pages should render with mocked data and an amber "TODO: wire to Supabase" banner.
6. Click **Log Out** at the bottom of the sidebar → back at `/login`.
7. In an incognito window, try to visit http://localhost:5173/admin → you should be redirected to `/login`.

---

## What's NOT wired up yet (deferred)

The plan ([../../.claude/plans/ok-for-sendasta-in-squishy-stearns.md](../../.claude/plans/ok-for-sendasta-in-squishy-stearns.md)) lists these as follow-ups:

- The Outlook add-in (`src/taskpane/`) still reads policies from local Outlook roaming settings — not from Supabase. Wire that up next.
- Stripe billing — "Manage Subscription" button is disabled.
- User invites by email — "Invite User" button is disabled (needs service-role key + a server route).
- Audit logs — Dashboard stats are mocked.
- Language switching (i18n).
- Mobile-responsive admin sidebar (currently desktop-first).

Each of the admin pages has a `TODO: wire to Supabase` banner pointing at the exact table/column to query.

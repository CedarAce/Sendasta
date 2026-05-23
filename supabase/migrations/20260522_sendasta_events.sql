-- supabase/migrations/20260522_sendasta_events.sql
-- First-party event firehose for the Sendasta HQ founder dashboard.
create table if not exists public.sendasta_events (
  id             bigint generated always as identity primary key,
  at             timestamptz not null default now(),
  source         text not null,
  action         text not null,
  reason         text,
  company_domain text,
  sender_email   text,
  email          text,
  org_id         uuid,
  path           text,
  country        text,
  city           text,
  ip             text,
  user_agent     text,
  props          jsonb not null default '{}'::jsonb,
  created_date   date generated always as ((at at time zone 'utc')::date) stored
);

alter table public.sendasta_events enable row level security;
-- No policies: only the service-role key (server functions) can read/write.

create index if not exists sendasta_events_at_idx           on public.sendasta_events (at desc);
create index if not exists sendasta_events_company_idx       on public.sendasta_events (company_domain);
create index if not exists sendasta_events_action_idx        on public.sendasta_events (action);
create index if not exists sendasta_events_source_idx        on public.sendasta_events (source);
create index if not exists sendasta_events_created_date_idx  on public.sendasta_events (created_date);

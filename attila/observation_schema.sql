-- Run in a dedicated Supabase project, or explicitly approve sharing the existing BNH instance.
create table if not exists public.toile_dor_events (
 id bigint generated always as identity primary key,
 occurred_at timestamptz not null default now(),
 event_name text not null check (event_name in ('page_view','vinted_outbound_click')),
 poster text check (poster is null or poster in ('freud','bob-marley')),
 source text not null default '',
 medium text not null default '',
 campaign text not null default '',
 referrer_host text not null default '',
 test_event boolean not null default false
);
alter table public.toile_dor_events enable row level security;
revoke all on public.toile_dor_events from anon, authenticated;
create index if not exists toile_dor_events_time_idx on public.toile_dor_events (occurred_at desc);
create index if not exists toile_dor_events_event_idx on public.toile_dor_events (event_name,poster,occurred_at desc);
-- Only the server-side service role can insert/read; do not publish this table to visitors.
-- Reporting example (exclude test events):
-- select date_trunc('day',occurred_at) as day,event_name,poster,count(*) as events
-- from public.toile_dor_events where not test_event
-- group by 1,2,3 order by 1 desc;

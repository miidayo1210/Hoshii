create table if not exists public.leapday_actions(
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  phase text not null check (phase in ('before','day'))
);

create table if not exists public.leapday_participations(
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  action_key text not null references public.leapday_actions(key),
  comment text,
  created_at timestamptz default now()
);

alter table public.leapday_actions enable row level security;
alter table public.leapday_participations enable row level security;
-- v0: simple open read, insert by anon is ok if you want public; otherwise keep authenticated.
create policy "public read actions" on public.leapday_actions for select using (true);
create policy "public insert participation" on public.leapday_participations for insert with check (true);
create policy "public read participation count" on public.leapday_participations for select using (true);






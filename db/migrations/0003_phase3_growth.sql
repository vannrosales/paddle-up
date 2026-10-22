-- 0003_phase3_growth.sql
-- Pickleball Players Profiling, Achievements, and Role (PaddleUp)
-- Phase 3 Growth Schema: Matches, Tournaments, Partner Finder & Moderation

-- 1. ADD PARTNER FINDER FIELDS TO PROFILES
alter table public.profiles
  add column if not exists looking_for_partner boolean default false,
  add column if not exists preferred_play_times text,
  add column if not exists play_preference text check (play_preference in ('casual', 'competitive', 'drills', 'all'));

create index if not exists idx_profiles_partner on public.profiles(looking_for_partner) where looking_for_partner = true;

-- 2. MATCH LOGS TABLE (Feature 16)
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  partner_id uuid references public.profiles(id) on delete set null,
  partner_name text,
  opponents text not null,
  score text not null,
  result text not null check (result in ('win', 'loss')),
  match_type text not null default 'doubles' check (match_type in ('singles', 'doubles', 'mixed')),
  notes text,
  played_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_matches_profile on public.matches(profile_id);
create index if not exists idx_matches_played_at on public.matches(played_at desc);

alter table public.matches enable row level security;

create policy "read matches of visible profiles"
  on public.matches for select
  using (exists (
    select 1 from public.profiles p
    where p.id = matches.profile_id
      and (p.visibility in ('public', 'unlisted') or p.user_id = auth.uid())
  ));

create policy "owner manages own matches"
  on public.matches for all
  using (exists (
    select 1 from public.profiles p
    where p.id = matches.profile_id
      and p.user_id = auth.uid()
  ));

-- 3. TOURNAMENT PAGES TABLE (Feature 18)
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text not null,
  country text not null default 'Philippines',
  start_date date not null,
  end_date date,
  division text not null,
  status text not null default 'completed' check (status in ('upcoming', 'in_progress', 'completed')),
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  results jsonb not null default '[]'::jsonb,
  banner_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tournaments_slug on public.tournaments(slug);

alter table public.tournaments enable row level security;

create policy "tournaments are readable by everyone"
  on public.tournaments for select
  using (true);

create policy "organizers can create and update tournaments"
  on public.tournaments for all
  using (
    organizer_id in (select id from public.profiles where user_id = auth.uid())
    or exists (
      select 1 from public.user_roles ur
      where ur.user_id = auth.uid() and ur.role in ('organizer', 'admin')
    )
  );

-- 4. REPORTS / MODERATION QUEUE (Feature 23)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('profile', 'achievement', 'match')),
  target_id text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "authenticated users can submit reports"
  on public.reports for insert
  with check (auth.role() = 'authenticated');

create policy "moderators and admins can read and update reports"
  on public.reports for all
  using (exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid() and ur.role in ('moderator', 'admin')
  ));


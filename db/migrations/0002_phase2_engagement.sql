-- 0002_phase2_engagement.sql
-- Pickleball Players Profiling, Achievements, and Role (PaddleUp)
-- Phase 2 Engagement Schema with Row Level Security (RLS)

-- 1. BADGES TABLE
create table if not exists public.badges (
  id text primary key,
  key text unique not null,
  label text not null,
  description text not null,
  icon text not null,
  category text not null default 'milestone',
  created_at timestamptz not null default now()
);

alter table public.badges enable row level security;
create policy "badges are readable by everyone"
  on public.badges for select
  using (true);

-- 2. PROFILE BADGES (Many-to-Many)
create table if not exists public.profile_badges (
  profile_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text references public.badges(id) on delete cascade not null,
  awarded_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

alter table public.profile_badges enable row level security;

create policy "read profile badges for visible profiles"
  on public.profile_badges for select
  using (exists (
    select 1 from public.profiles p
    where p.id = profile_badges.profile_id
      and (p.visibility in ('public', 'unlisted') or p.user_id = auth.uid())
  ));

-- 3. PEER ENDORSEMENTS TABLE
create table if not exists public.endorsements (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid references public.profiles(id) on delete cascade not null,
  to_profile_id uuid references public.profiles(id) on delete cascade not null,
  kind text not null check (kind in ('skill', 'role', 'sportsmanship', 'general')),
  target_value text,
  note text,
  created_at timestamptz not null default now(),
  constraint check_cannot_endorse_self check (from_profile_id <> to_profile_id)
);

create index if not exists idx_endorsements_to_profile on public.endorsements(to_profile_id);
create index if not exists idx_endorsements_from_profile on public.endorsements(from_profile_id);

alter table public.endorsements enable row level security;

create policy "read endorsements for visible profiles"
  on public.endorsements for select
  using (exists (
    select 1 from public.profiles p
    where p.id = endorsements.to_profile_id
      and (p.visibility in ('public', 'unlisted') or p.user_id = auth.uid())
  ));

create policy "users can insert endorsements"
  on public.endorsements for insert
  with check (
    from_profile_id in (select id from public.profiles where user_id = auth.uid())
    and from_profile_id <> to_profile_id
  );

create policy "users can delete their given endorsements"
  on public.endorsements for delete
  using (
    from_profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- 4. CLUBS TABLE
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  city text not null,
  country text not null default 'Philippines',
  description text,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  logo_url text,
  banner_url text,
  member_count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clubs_slug on public.clubs(slug);
create index if not exists idx_clubs_city on public.clubs(city);

alter table public.clubs enable row level security;

create policy "clubs are readable by everyone"
  on public.clubs for select
  using (true);

create policy "authenticated users can create a club"
  on public.clubs for insert
  with check (
    owner_id in (select id from public.profiles where user_id = auth.uid())
  );

create policy "club owners can update their club"
  on public.clubs for update
  using (
    owner_id in (select id from public.profiles where user_id = auth.uid())
  );

-- 5. CLUB MEMBERS (Many-to-Many)
create table if not exists public.club_members (
  club_id uuid references public.clubs(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('owner', 'manager', 'member')) default 'member',
  joined_at timestamptz not null default now(),
  primary key (club_id, profile_id)
);

alter table public.club_members enable row level security;

create policy "club members are readable by everyone"
  on public.club_members for select
  using (true);

create policy "users can join clubs"
  on public.club_members for insert
  with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

create policy "users can leave clubs or managers can remove"
  on public.club_members for delete
  using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
    or exists (
      select 1 from public.clubs c
      where c.id = club_members.club_id
        and c.owner_id in (select id from public.profiles where user_id = auth.uid())
    )
  );

-- 6. FOLLOWS TABLE
create table if not exists public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint check_cannot_follow_self check (follower_id <> following_id)
);

create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

alter table public.follows enable row level security;

create policy "follows are readable by everyone"
  on public.follows for select
  using (true);

create policy "users can follow others"
  on public.follows for insert
  with check (
    follower_id in (select id from public.profiles where user_id = auth.uid())
    and follower_id <> following_id
  );

create policy "users can unfollow"
  on public.follows for delete
  using (
    follower_id in (select id from public.profiles where user_id = auth.uid())
  );

-- 7. SEED INITIAL BADGES
insert into public.badges (id, key, label, description, icon, category)
values
  ('badge_podium', 'podium_finisher', 'Podium Finisher', 'Won gold, silver, or bronze medal in an open or sanctioned tournament', 'Medal', 'tournament'),
  ('badge_club_reg', 'club_regular', 'Club Regular', 'Active roster member of a verified pickleball club', 'Users', 'community'),
  ('badge_endorsed', 'endorsed_player', 'Peer Endorsed', 'Vouched for by 3 or more pickleball players for skill or sportsmanship', 'Award', 'social'),
  ('badge_century', 'century_club', 'Century Club', 'Logged 100+ lifetime career pickleball games or matches', 'Zap', 'milestone'),
  ('badge_certified', 'coach_certified', 'Certified Instructor', 'Holds accredited coaching credentials (IPTPA or PPR)', 'ShieldCheck', 'certification'),
  ('badge_kitchen', 'kitchen_master', 'Kitchen Master', 'Praised for premier soft-game dinking and defensive third-shot drops', 'Flame', 'skill'),
  ('badge_founding', 'founding_member', 'Founding Member', 'Early adopter and pioneer of the PaddleUp community', 'Sparkles', 'special')
on conflict (id) do nothing;


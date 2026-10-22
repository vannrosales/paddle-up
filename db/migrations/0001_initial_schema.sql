-- 0001_initial_schema.sql
-- Pickleball Players Profiling, Achievements, and Role (PaddleUp)
-- Phase 1 Schema with Row Level Security (RLS)

-- 1. ROLES LOOKUP TABLE
create table if not exists public.roles (
  id text primary key,
  key text unique not null,
  label text not null,
  category text not null check (category in ('playing_style', 'court_position', 'off_court')),
  description text,
  icon_name text
);

alter table public.roles enable row level security;
create policy "roles are readable by everyone"
  on public.roles for select
  using (true);

-- 2. USER ACCESS ROLES (RBAC)
create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('guest', 'player', 'verified', 'club_manager', 'organizer', 'moderator', 'admin')),
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;
create policy "users can read their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  city text,
  country text,
  dominant_hand text check (dominant_hand in ('right', 'left', 'ambidextrous')),
  years_playing numeric(4,1),
  skill_level numeric(3,1) check (skill_level >= 1.0 and skill_level <= 7.0),
  visibility text not null default 'public' check (visibility in ('public', 'unlisted', 'private')),
  paddle_brand text,
  home_club text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_city on public.profiles(city);
create index if not exists idx_profiles_skill on public.profiles(skill_level);
create index if not exists idx_profiles_visibility on public.profiles(visibility);

alter table public.profiles enable row level security;

-- Public and unlisted profiles are readable by anyone; private readable by owner
create policy "public or unlisted profiles readable"
  on public.profiles for select
  using (visibility in ('public', 'unlisted') or auth.uid() = user_id);

-- Authenticated users can insert their own profile
create policy "users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Owners can update their own profile
create policy "owners can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owners can delete their own profile
create policy "owners can delete own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- 4. PROFILE ROLES (Many-to-Many)
create table if not exists public.profile_roles (
  profile_id uuid references public.profiles(id) on delete cascade not null,
  role_id text references public.roles(id) on delete cascade not null,
  is_primary boolean not null default false,
  primary key (profile_id, role_id)
);

alter table public.profile_roles enable row level security;

create policy "read profile roles for visible profiles"
  on public.profile_roles for select
  using (exists (
    select 1 from public.profiles p
    where p.id = profile_roles.profile_id
      and (p.visibility in ('public', 'unlisted') or p.user_id = auth.uid())
  ));

create policy "owners can manage profile roles"
  on public.profile_roles for all
  using (exists (
    select 1 from public.profiles p
    where p.id = profile_roles.profile_id
      and p.user_id = auth.uid()
  ));

-- 5. ACHIEVEMENTS TABLE
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null check (type in ('tournament', 'milestone', 'certification', 'award')),
  event_name text,
  event_date date,
  division text,
  placement text,
  partner_name text,
  proof_url text,
  status text not null default 'self_reported' check (status in ('self_reported', 'endorsed', 'verified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_achievements_profile on public.achievements(profile_id);
create index if not exists idx_achievements_type on public.achievements(type);

alter table public.achievements enable row level security;

create policy "read achievements of visible profiles"
  on public.achievements for select
  using (exists (
    select 1 from public.profiles p
    where p.id = achievements.profile_id
      and (p.visibility in ('public', 'unlisted') or p.user_id = auth.uid())
  ));

create policy "owner manages own achievements"
  on public.achievements for all
  using (exists (
    select 1 from public.profiles p
    where p.id = achievements.profile_id
      and p.user_id = auth.uid()
  ));

-- Storage Bucket for Avatars & Certificates
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');


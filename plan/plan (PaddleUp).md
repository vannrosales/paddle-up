# Pickleball Players Profiling, Achievements, and Role

## App Name

| | |
|---|---|
| **Official app name** | **Pickleball Players Profiling, Achievements, and Role** |
| **Short display name** (logo, tab title, home-screen icon; see section 15.1) | To be chosen: PaddleUp, Dinkr, KitchenPass, or PickleCard |
| **Tagline** | Your pickleball profile, achievements, and role in one place. |
| **Page title template** | `%s | Pickleball Players Profiling, Achievements, and Role` |
| **Repo / project slug** | `pickleball-players-profiling` |
| **Default free URL** | `pickleball-players-profiling.vercel.app` |

The official name is used in the page `<title>`, Open Graph metadata, the README, and the web manifest `name` field. The short display name goes in the manifest `short_name`, the logo, and the app icon label.

---

A free web app where pickleball players create a profile, declare their playing role, log achievements, and get discovered by other players, clubs, and organizers.

**Primary goal:** run the whole thing at **$0/month** using generous free tiers.

---

## 1. Goals & Non-Goals

**Goals**
- Players can sign up, build a profile, and share it via a public link.
- Players can declare a skill level and a playing role (e.g. Dinker, Power player, Coach).
- Players can record achievements (tournament results, medals, milestones) and earn badges.
- Anyone can browse/search players and see leaderboards.
- Zero hosting cost, minimal maintenance.

**Non-Goals (v1)**
- Official rating calculation (we are not DUPR). Ratings are self-assessed or peer-endorsed.
- Payments, tournament registration, or live scoring.
- Native mobile apps (we ship a responsive, installable PWA instead).

---

## 2. Tech Stack (all free tier)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSR/SSG for SEO-friendly public profiles, API routes in one repo |
| UI | **Tailwind CSS + shadcn/ui** | Fast, accessible, no licensing cost |
| Hosting | **Vercel (Hobby plan)** | Zero-config Next.js hosting, free `*.vercel.app` domain |
| Database | **Supabase (Postgres)** | Free Postgres with row-level security, built-in auth and storage |
| Auth | **Supabase Auth** (email magic link + Google OAuth) | No separate auth service needed |
| File storage | **Supabase Storage** | Avatars, achievement photos, certificates |
| ORM / queries | **Drizzle ORM** (or Supabase JS client) | Type-safe, lightweight |
| Validation | **Zod** | Shared schemas for forms and API |
| Forms / state | **React Hook Form + TanStack Query** | Simple data fetching and caching |
| Social cards | **`next/og`** (Vercel OG) | Auto-generated share images for profiles |
| Email (optional) | **Resend** free tier | Notifications, endorsement requests |
| Analytics | **Vercel Web Analytics** (free tier) or Umami self-host | Basic traffic insight |
| CI/CD | **GitHub + GitHub Actions** | Auto-deploy on push, lint and tests on PR |
| Testing | **Vitest + Playwright** | Unit and end-to-end tests |
| Monitoring | **Sentry** free tier | Error tracking |

**Alternatives if limits become a problem**
- Hosting: Cloudflare Pages (very generous free bandwidth) or Netlify.
- Database: Neon (serverless Postgres) or Turso (SQLite).
- Images: Cloudinary free tier.

> **Free-tier caveats (verify current limits before building):**
> - Vercel Hobby is intended for non-commercial/personal use. If the site ever earns money (ads, sponsors), move to Cloudflare Pages or upgrade.
> - Supabase free projects can **pause after about a week of inactivity**. Mitigate with a free scheduled GitHub Action that pings the database every few days.
> - Free storage and bandwidth are limited, so compress images client-side before upload.

---

## 3. Core Concepts

### Player Profile
Display name, username (unique slug), photo, bio, city/country, dominant hand, years playing, home club, paddle brand (optional), social links.

### Skill Level
Self-assessed rating on a 2.0 to 5.5+ scale with short descriptions per band, plus optional **peer endorsements** to add credibility.

### Roles
A player picks one **primary** and up to two **secondary** roles:

- **Playing style:** Dinker / Soft-game specialist, Power hitter ("banger"), All-court player, Lob/defensive specialist, Third-shot-drop specialist
- **Court position:** Left-side, Right-side, Flexible
- **Off-court:** Coach, Referee, Tournament organizer, Club manager, Casual/social player

### Achievements
- **Tournament results:** event name, date, division, placement, partner.
- **Milestones:** first tournament, 100 matches logged, 1-year playing anniversary.
- **Certifications:** coaching or referee credentials (with optional document upload).
- **Auto-awarded badges:** e.g. "Podium Finisher", "Club Regular", "Endorsed by 10 players".
- Each achievement has a **verification status**: self-reported, endorsed, or admin-verified.

---

## 4. Feature List

### MVP (Phase 1)
1. Sign up / log in (magic link + Google).
2. Create and edit profile with avatar upload.
3. Role and skill-level selection.
4. Add, edit, and delete achievements.
5. Public profile page at `/p/[username]` with SEO metadata.
6. Player directory with search and filters (city, role, skill level).
7. Responsive, mobile-first UI with dark mode.
8. Basic privacy toggle (public / unlisted / private).

### Phase 2: Engagement
9. **Shareable profile card** (auto-generated OG image) for Facebook, Instagram, and messaging apps.
10. **Peer endorsements:** players vouch for another player's skill level or role.
11. **Badges system** with auto-awarded and manual badges.
12. **Leaderboards:** most achievements, most endorsed, by city/club.
13. **Clubs:** create or join a club, club roster page, club achievements.
14. **Follow players** and a simple activity feed.
15. Email notifications for endorsements and new followers.

### Phase 3: Nice-to-have
16. **Match log:** record casual matches (partner, opponent, score) with simple win/loss stats.
17. **Partner finder:** filter by skill, role, and availability, with a "looking to play" flag.
18. **Tournament pages:** organizers publish results that auto-link to player profiles.
19. **Player comparison** (head-to-head profile view).
20. **Printable/PDF player resume** and QR code linking to the profile.
21. **PWA install** with offline-friendly profile viewing.
22. **Multi-language support** (English, Filipino, Chinese, etc.).
23. **Admin dashboard:** moderation queue, achievement verification, reports.

---

## 5. Data Model (initial)

```
profiles        id, user_id, username, display_name, bio, avatar_url, city, country,
                dominant_hand, years_playing, skill_level, visibility, created_at
roles           id, key, label, category            -- seeded lookup table
profile_roles   profile_id, role_id, is_primary
achievements    id, profile_id, title, type, event_name, event_date, division,
                placement, partner_name, proof_url, status, created_at
badges          id, key, label, description, icon
profile_badges  profile_id, badge_id, awarded_at
endorsements    id, from_profile_id, to_profile_id, kind, note, created_at
clubs           id, name, slug, city, description, owner_id
club_members    club_id, profile_id, role, joined_at
follows         follower_id, following_id, created_at
matches         id, profile_id, partner_id, opponents, score, played_at   -- phase 3
```

Security: enable **Row-Level Security** on every table. Public reads only for `visibility = 'public'`; writes only by the owner.

---

## 6. Pages / Routes

| Route | Purpose |
|---|---|
| `/` | Landing page, featured players, search |
| `/players` | Directory with filters |
| `/p/[username]` | Public player profile |
| `/dashboard` | Own profile, achievements, endorsements |
| `/dashboard/achievements/new` | Add achievement |
| `/clubs`, `/clubs/[slug]` | Club list and detail (phase 2) |
| `/leaderboard` | Rankings (phase 2) |
| `/login`, `/signup` | Auth |
| `/admin` | Moderation (phase 3) |

---

## 7. Project Structure

```
pickleball-profiles/
├─ app/                 # Next.js routes
├─ components/          # UI + feature components
├─ lib/                 # supabase client, utils, zod schemas
├─ db/                  # drizzle schema + migrations + seed (roles, badges)
├─ public/
├─ tests/               # vitest + playwright
├─ .github/workflows/   # CI + keep-alive ping
└─ plan.md
```

---

## 8. Roadmap

| Phase | Scope | Rough effort |
|---|---|---|
| 0: Setup | Repo, Vercel + Supabase projects, auth, CI | 1 to 2 days |
| 1: MVP | Profiles, roles, achievements, directory | 2 to 3 weeks |
| 2: Engagement | Share cards, endorsements, badges, clubs, leaderboard | 3 to 4 weeks |
| 3: Growth | Match log, partner finder, tournaments, admin | Ongoing |

---

## 9. Deployment Checklist ($0)

1. Push the repo to GitHub.
2. Create a Supabase project, run migrations, seed roles and badges, and enable RLS.
3. Import the repo into Vercel and add env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Configure Google OAuth redirect URLs for the Vercel domain.
5. Add the scheduled GitHub Action that pings Supabase to prevent auto-pause.
6. Add Sentry and Vercel Analytics.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Supabase free project pauses | Scheduled keep-alive ping; consider Neon as a fallback |
| Storage/bandwidth limits | Client-side image compression, size caps, lazy loading |
| Fake or inflated achievements | Verification status, endorsements, report button |
| Spam accounts | Email verification, rate limiting, optional CAPTCHA (Cloudflare Turnstile, free) |
| Privacy concerns | Visibility controls, no exact location, delete-account option |
| Vercel Hobby non-commercial terms | Stay non-commercial or migrate to Cloudflare Pages |

---

## 11. Success Metrics

- Number of registered players and profile completion rate
- Achievements added per active player
- Endorsements given per week
- Share-link clicks and visits to public profiles

---

## 12. Authentication

**Provider:** Supabase Auth (free tier), using `@supabase/ssr` so sessions live in secure cookies and work in Server Components, Route Handlers, and middleware.

### 12.1 Sign-in methods
| Method | Notes |
|---|---|
| **Email magic link / OTP** | Default. Passwordless, nothing to leak or reset |
| **Google OAuth** | One-tap sign-in for most players |
| **Facebook OAuth** (phase 2) | Many pickleball communities live on Facebook |
| **Apple Sign In** (optional) | Needs a paid Apple Developer account, so skip for the $0 goal |
| **Email + password** | Optional fallback, with minimum length and breached-password check |

### 12.2 Flows
1. **Sign up:** enter email (or tap Google) → verify email → redirect to `/onboarding`.
2. **Onboarding (3 steps):** username and photo → skill level → primary role. The profile row is created at the end.
3. **Log in:** magic link or OAuth → `/auth/callback` exchanges the code for a session → redirect to `/dashboard`.
4. **Log out:** clears cookies and revokes the refresh token.
5. **Change email:** requires re-confirmation on both addresses.
6. **Delete account:** typed confirmation, then removes profile, storage files, and auth user (cascade).

### 12.3 Session handling
- Access token (short-lived, about 1 hour) plus rotating refresh token, stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies.
- `middleware.ts` refreshes the session on each request and protects `/dashboard/*`, `/admin/*`, and `/onboarding`.
- Server-side checks always use `supabase.auth.getUser()` (verifies with the auth server), never trust a client-supplied session.
- Redirect URLs are allow-listed in Supabase for `localhost` and the production domain, plus Vercel preview domains.

### 12.4 Auth routes
| Route | Purpose |
|---|---|
| `/login`, `/signup` | Entry screens (sheet-style on mobile) |
| `/auth/callback` | OAuth / magic-link code exchange |
| `/auth/confirm` | Email OTP confirmation |
| `/onboarding` | First-run profile setup |
| `/settings/account` | Email, linked providers, sessions, delete account |

---

## 13. Authorization

Two different "roles" exist in this app and must not be mixed up:

- **Playing roles** (Dinker, Coach, etc.) are *profile data* shown to others, with no effect on permissions.
- **Access roles** (below) control what a user is *allowed to do*.

### 13.1 Access roles (RBAC)
| Access role | Who | How assigned |
|---|---|---|
| `guest` | Not signed in | Default |
| `player` | Any signed-in user | Automatic on sign-up |
| `verified` | Email-verified player with a complete profile | Automatic |
| `club_manager` | Owner or admin of a specific club | Per-club membership row |
| `organizer` | Can publish tournament results | Granted by admin (phase 3) |
| `moderator` | Reviews reports and verifies achievements | Granted by admin |
| `admin` | Full control | Set manually in the database |

Storage: a `user_roles` table (`user_id`, `role`, `granted_by`, `granted_at`), with the role mirrored into the JWT as a custom claim (via a Supabase auth hook) so RLS can read it without a join. Club-level roles live in `club_members.role` (`owner`, `manager`, `member`).

### 13.2 Permission matrix
| Action | Guest | Player | Verified | Club mgr | Organizer | Moderator | Admin |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| View public profiles / directory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View unlisted profile (with link) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own profile / achievements | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Follow players | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Give endorsements | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create a club | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage own club roster | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Publish tournament results | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Verify achievements / hide content | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Grant roles / delete any user | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 13.3 Enforcement layers (defense in depth)
1. **Postgres Row-Level Security (the source of truth).** Every table has RLS enabled and no policy means no access.
2. **Server-side checks** in Server Actions and Route Handlers using a small `requireRole()` helper.
3. **Middleware** for coarse route gating.
4. **UI hiding** of buttons for convenience only, never as security.

### 13.4 Example RLS policies
```sql
-- Profiles: public ones readable by anyone, owners can read/write their own
alter table profiles enable row level security;

create policy "public profiles are readable"
  on profiles for select
  using (visibility in ('public','unlisted') or user_id = auth.uid());

create policy "owners update own profile"
  on profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Achievements: owner manages, everyone reads those on visible profiles
create policy "read achievements of visible profiles"
  on achievements for select
  using (exists (
    select 1 from profiles p
    where p.id = achievements.profile_id
      and (p.visibility = 'public' or p.user_id = auth.uid())
  ));

create policy "owner manages achievements"
  on achievements for all
  using (exists (select 1 from profiles p
                 where p.id = achievements.profile_id and p.user_id = auth.uid()));

-- Only moderators/admins may change verification status
create policy "moderators verify"
  on achievements for update
  using ((auth.jwt() ->> 'app_role') in ('moderator','admin'));

-- Endorsements: verified users only, cannot endorse yourself
create policy "verified users endorse others"
  on endorsements for insert
  with check (
    (auth.jwt() ->> 'app_role') in ('verified','admin')
    and from_profile_id <> to_profile_id
    and from_profile_id in (select id from profiles where user_id = auth.uid())
  );
```
Owners must not be able to edit their own `status` (verification) field. Enforce with a column-level restriction or a trigger.

### 13.5 Security hardening
- **Rate limiting** on sign-in, endorsements, and reports (Upstash Redis free tier or Supabase edge limits).
- **CAPTCHA** (Cloudflare Turnstile, free) on sign-up and magic-link requests.
- **Uploads:** validate type and size, strip EXIF/GPS data, and use private buckets with signed URLs for certificates and public buckets only for avatars.
- **Input validation** with Zod on every server entry point.
- **Secrets:** service-role key is server-only and never exposed with `NEXT_PUBLIC_`.
- **Security headers:** CSP, `X-Frame-Options`, `Referrer-Policy` via `next.config.js`.
- **Admin protections:** MFA (TOTP) required for `admin` and `moderator`.
- **Audit log:** `audit_log` table recording role grants, verifications, deletions, and moderation actions.
- **Privacy:** visibility setting (`public`, `unlisted`, `private`), no exact addresses, data export and delete on request.

### 13.6 Auth/authz test checklist
- Guest cannot reach `/dashboard` or `/admin` (redirects to `/login`).
- Player A cannot edit Player B's profile or achievements (RLS blocks it even with a forged request).
- Unverified user cannot endorse; nobody can endorse themselves.
- Owner cannot change their own achievement `status`.
- Private profile never appears in the directory, search, OG image, or sitemap.
- Deleted user's files and rows are gone.

---

## 14. Design System: "Court Glass"

**Direction:** Apple-inspired (iOS on mobile, macOS on desktop), tied to the sport through colour, motion, and metaphors borrowed from pickleball. Clean, spacious, tactile, and friendly.

> Note: we borrow the *design language* only. We do not use Apple logos, icons, or the proprietary SF Pro font file. Fonts fall back through the system stack so Apple devices naturally render SF.

### 14.1 Principles
1. **Clarity:** big titles, lots of whitespace, one primary action per screen.
2. **Depth:** translucent "glass" layers, soft shadows, layered sheets.
3. **Deference:** UI stays quiet so player photos and achievements stand out.
4. **Delight:** springy motion and small celebratory moments (badge unlocks).

### 14.2 Colour tokens
| Token | Light | Dark | Inspiration |
|---|---|---|---|
| `--bg` | `#F2F2F7` | `#000000` | iOS grouped background |
| `--surface` | `#FFFFFF` | `#1C1C1E` | iOS card |
| `--surface-glass` | `rgba(255,255,255,.72)` | `rgba(28,28,30,.72)` | Blur + saturate |
| `--text` | `#1C1C1E` | `#F2F2F7` | |
| `--text-muted` | `#6C6C70` | `#8E8E93` | |
| `--accent` (Ball) | `#C8F31D` | `#D4FF3A` | Pickleball optic yellow-green |
| `--accent-ink` | `#1C2A00` | `#1C2A00` | Text on accent |
| `--court` (Blue) | `#0A84FF` | `#0A84FF` | Links, selection, focus |
| `--court-green` | `#34C759` | `#30D158` | Success, verified |
| `--kitchen` (Red) | `#FF453A` | `#FF453A` | Destructive, errors |
| `--separator` | `rgba(60,60,67,.18)` | `rgba(84,84,88,.6)` | Hairlines |

Use the yellow-green ball colour sparingly (primary buttons, rings, active tab indicators) so it feels like an accent, not a theme-wide wash. Always keep text on it dark for contrast.

### 14.3 Typography
- **Font stack:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", system-ui, sans-serif`. Inter (via `next/font`, free) is the fallback on Windows and Android.
- **Scale:** Large Title 34/41 bold, Title 28, Headline 17 semibold, Body 17, Callout 16, Footnote 13, Caption 12.
- Tight tracking on titles (`-0.02em`), tabular numbers for ratings and scores.

### 14.4 Shape, depth, and material
- **Corner radii:** cards 20px, sheets 28px, buttons and inputs 12px, avatars as continuous "squircle" rounding (CSS `border-radius` plus `corner-shape` where supported).
- **Glass:** `backdrop-filter: blur(24px) saturate(180%)` for nav bars, tab bars, and sheets.
- **Shadows:** soft and low-contrast, e.g. `0 8px 30px rgba(0,0,0,.08)`.
- **Hairline borders:** 0.5px separators like iOS lists.

### 14.5 Layout patterns
| Platform | Pattern |
|---|---|
| **Mobile (iOS-like)** | Bottom **tab bar** (Home, Players, Clubs, Profile), large collapsing titles, swipe-down **bottom sheets** for forms and filters, inset grouped lists |
| **Desktop (macOS-like)** | Left **sidebar** with sections, top toolbar with search (⌘K command palette), content in a centred column, modals as centred sheets |
| **Tablet** | Sidebar collapses to icons; two-pane list/detail for the directory |

```
MOBILE                          DESKTOP
┌───────────────────┐           ┌────────┬───────────────────────────┐
│  ◀ Players   ⌕    │           │ ● ● ●  │  ⌕ Search players  ⌘K     │
│  Players          │           ├────────┼───────────────────────────┤
│ ┌───────────────┐ │           │ Home   │  Maria Santos             │
│ │ (o) Maria S.  │ │           │ Players│  Right-side · Dinker      │
│ │ 4.0 · Dinker  │ │           │ Clubs  │  ◯ 4.0   🏅 12   ★ 38     │
│ └───────────────┘ │           │ Board  │  ─────────────────────    │
│ ┌───────────────┐ │           │ ────── │  Achievements             │
│ │ (o) Jun R.    │ │           │ You    │  ▸ Cebu Open · Gold       │
│ └───────────────┘ │           │        │  ▸ Club Champs · Silver   │
├───────────────────┤           └────────┴───────────────────────────┘
│ 🏠  👥  🏟  👤    │
└───────────────────┘
```

### 14.6 Pickleball-connected UI ideas
- **Skill ring:** an Apple-Activity-style circular ring showing skill level (2.0 to 5.5+), filled with the ball-yellow accent.
- **Achievement badges:** rounded "app icon" tiles with gradient backgrounds and a subtle paddle or ball glyph. Locked badges are greyscale (like Game Center awards).
- **Profile card as a "Wallet pass":** shareable card with avatar, name, role chips, skill ring, QR code, and the OG image uses the same layout.
- **Role chips:** pill tags with SF-Symbol-style line icons (paddle, dink, lightning for power, whistle for referee).
- **Ball-hole pattern:** very subtle dotted texture on hero areas and empty states, echoing the pickleball's perforations.
- **Court lines motif:** thin white court-line dividers in hero banners, with a kitchen-zone accent stripe.
- **Verified checkmark:** a green seal beside names for admin-verified achievements.
- **Segmented controls** for Singles / Doubles / Mixed and Left / Right / Flexible.
- **Empty states** with friendly paddle-and-ball illustrations ("No achievements yet. Add your first win!").
- **Celebration moment:** confetti plus haptic-style scale pop when a badge is earned.

### 14.7 Core components
Navigation bar (large title, glass), tab bar, sidebar, segmented control, toggle switch, inset grouped list, bottom sheet / modal sheet, action sheet, search field with token filters, player card, skill ring, badge tile, role chip, avatar stack (club members), toast, skeleton loaders, command palette.

### 14.8 Motion
- Spring easing (`stiffness ≈ 300, damping ≈ 30`) for sheets, taps, and list reordering.
- Press feedback: scale to 0.97 on tap.
- Page transitions: subtle slide and fade, shared-element transition from directory card to profile page.
- Respect `prefers-reduced-motion`.

### 14.9 Accessibility
- WCAG AA contrast (dark text on the yellow-green accent, never white).
- Minimum 44×44px touch targets, visible focus rings in `--court` blue.
- Full keyboard navigation and ARIA roles from Radix primitives.
- Support dynamic type (rem-based sizing), dark mode, and reduced motion.

### 14.10 Design tooling (all free)
| Need | Tool |
|---|---|
| Component primitives | shadcn/ui + Radix UI |
| Bottom sheets / drawers | Vaul |
| Animation | Framer Motion (`motion`) |
| Icons | Lucide (line style close to SF Symbols) |
| Command palette | cmdk |
| Theming | Tailwind CSS variables + `next-themes` |
| Fonts | System stack + Inter via `next/font` |
| Design mock-ups | Figma free tier |

### 14.11 Design deliverables per phase
- **Phase 1:** tokens, light/dark themes, tab bar + sidebar shell, profile page, directory, forms in sheets.
- **Phase 2:** skill ring, badge tiles, wallet-style share card, celebration animations.
- **Phase 3:** command palette, two-pane tablet layout, club pages, illustrations.

---

## 15. Branding & Brand Assets (logo, favicon, icons, social images)

Goal: a small, original, free-to-produce brand kit that matches the "Court Glass" design (Apple-style app icon feel, ball-yellow accent) and works from a 16px browser tab up to a 1200px share image.

### 15.1 Brand name
The working title ("Pickleball Players Profiling, Achievements, and Role") is descriptive but too long for a logo. Pick a short display name and keep the long one as the tagline or SEO title.

| Option | Idea |
|---|---|
| **PaddleUp** | Friendly, action-oriented |
| **Dinkr** | Short, memorable, plays on "dink" |
| **KitchenPass** | Pickleball "kitchen" plus a player pass/profile card |
| **PickleCard** | Matches the Wallet-pass profile card concept |

Before committing: check domain and social handle availability, and search trademark databases for conflicts. The free `*.vercel.app` domain works until a custom domain is worth buying.

### 15.2 Logo concept
- **Mark (symbol):** a pickleball (circle with a few perforation dots) merged with a profile/avatar silhouette, or a ball sitting inside a paddle outline. One shape, one accent colour, readable at tiny sizes.
- **Wordmark:** lowercase or title-case in a rounded, friendly geometric sans (Inter, Manrope, or Nunito, all free under the SIL Open Font License), tight tracking, semibold weight.
- **Lockups:** (1) mark + wordmark horizontal, (2) mark + wordmark stacked, (3) mark only (app icon / favicon), (4) wordmark only.
- **Colours:** ball yellow-green `#C8F31D` on near-black `#1C1C1E`, with a white version and a one-colour black version. Keep text on yellow dark for contrast.
- **App-icon style:** mark centred on a rounded-square ("squircle") tile with a subtle top-to-bottom gradient and soft inner highlight, like an iOS icon.
- **Originality:** draw it from scratch (no trademarked paddle brands, no stock clip-art or copied logos) so it can be used freely.

### 15.3 Logo rules
- **Clear space:** at least the height of the ball hole-dot × 2 around the mark.
- **Minimum size:** mark 16px, horizontal lockup 96px wide.
- **Do:** use approved colour variants, keep proportions, place on high-contrast backgrounds.
- **Don't:** stretch, rotate, add shadows or outlines, recolour outside the palette, or place on busy photos without a scrim.

### 15.4 Asset checklist
| Asset | Size / format | Used for |
|---|---|---|
| Master logo | `logo.svg` (mark + wordmark, light and dark variants) | Source of truth, header, README |
| Mark only | `mark.svg` | App icon source, avatars |
| Favicon (modern) | `icon.svg` with `prefers-color-scheme` dark/light styling | Browser tabs |
| Favicon (legacy) | `favicon.ico` (16, 32, 48 multi-size) | Older browsers, bookmarks |
| Apple touch icon | `apple-icon.png`, 180×180, no transparency | iOS home screen |
| Android / PWA icons | `icon-192.png`, `icon-512.png` | PWA install, Android |
| Maskable icon | `icon-maskable-512.png` (mark inside the 80% safe zone) | Android adaptive icons |
| Open Graph image | 1200×630 PNG | Link previews (default share image) |
| Twitter/X card | 1200×600 (can reuse OG) | Link previews |
| Per-player share card | Generated at runtime with `next/og` | Profile sharing |
| Social avatars | 400×400 PNG (mark on tile) | Facebook / Instagram page |
| Social cover | 1640×624 (Facebook), 1500×500 (X) | Page banners |
| Web manifest | `manifest.webmanifest` (name, short_name, icons, `theme_color`, `background_color`) | PWA |
| Theme colour | `<meta name="theme-color">` light `#F2F2F7`, dark `#000000` | Mobile browser bar |
| Empty-state illustrations | SVG set (paddle + ball scenes) | No-results, no-achievements screens |
| Badge icon set | SVG tiles (see design section) | Achievements |

### 15.5 Next.js file conventions (free, built in)
```
app/
├─ icon.svg                 # modern favicon
├─ favicon.ico              # legacy favicon
├─ apple-icon.png           # 180x180
├─ opengraph-image.png      # default 1200x630 share image
├─ manifest.ts              # PWA manifest
public/
├─ brand/
│  ├─ logo.svg  logo-dark.svg  logo-mono.svg
│  ├─ mark.svg
│  ├─ icon-192.png  icon-512.png  icon-maskable-512.png
│  └─ social/ (avatar, covers)
```
Next.js picks up `icon`, `apple-icon`, and `opengraph-image` files in `app/` automatically and adds the right `<link>` and `<meta>` tags. Set `metadataBase`, title template, and default Open Graph/Twitter metadata in the root `layout.tsx`.

### 15.6 How to produce them at $0
1. **Sketch and refine** the mark in Figma (free tier) or Inkscape (free, open source). Build it on a pixel grid so it stays crisp at 16px.
2. **Export the master SVG**, clean it with SVGOMG (free), and keep it as the single source.
3. **Generate raster sizes** with a small script using `sharp` (`npm i -D sharp`) or `pwa-asset-generator`, so all PNG icons are reproducible from `mark.svg` with one command.
4. **Make the .ico** with `png-to-ico` or RealFaviconGenerator (free).
5. **Test** the favicon on light and dark browser themes, in an iOS "Add to Home Screen" install, and in a Facebook/Messenger link preview (Facebook Sharing Debugger).
6. **Version the kit** in the repo under `public/brand/` and add a short `brand.md` with colours, fonts, and logo rules.

### 15.7 Brand voice (for copy, share cards, and empty states)
Friendly, encouraging, a little playful, and sport-aware. Short sentences. Celebrate progress ("Nice dink! Add your first achievement."). Avoid hype and jargon.

### 15.8 Branding roadmap
| Phase | Deliverables |
|---|---|
| **Phase 0** | Final name, domain/handle check, rough logo sketch, temporary text wordmark, placeholder favicon |
| **Phase 1** | Final logo kit, favicon set, apple/PWA icons, default OG image, manifest, theme-colour meta tags |
| **Phase 2** | Per-player share-card template, badge icon set, social avatar and covers |
| **Phase 3** | Illustration set, brand guideline page, optional sticker/merch-ready variants |

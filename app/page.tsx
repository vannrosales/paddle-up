import Link from "next/link";
import { getPlayers } from "@/lib/services/player-service";
import { PlayerCard } from "@/components/player-card";
import { DEFAULT_ROLES } from "@/lib/constants/roles";
import { RoleChip } from "@/components/role-chip";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  Trophy,
  UserCheck,
  ArrowLeftRight,
} from "lucide-react";

export default async function HomePage() {
  const players = await getPlayers();
  const featuredPlayers = players.slice(0, 3);
  const playingRoles = DEFAULT_ROLES.filter((r) => r.category === "playing_style");

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-8 md:py-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 max-w-6xl mx-auto w-full text-center">
        {/* Pickleball perforations subtle visual background */}
        <div className="absolute inset-0 -top-10 pickle-ball-pattern pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-200 mb-6 border border-black/5 dark:border-white/5">
          <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-[#C8F31D]" />
          <span>The Open Player Passport for Pickleball</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white max-w-4xl mx-auto leading-[1.08]">
          Pickleball Profiling, Achievements &amp; Playing Role.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Create your verified player identity, declare your court role, record medals and tournament milestones, log casual matches, earn community badges, and find doubles partners.
        </p>

        {/* Hero Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#C8F31D] text-[#1C2A00] font-bold text-base hover:bg-[#b8e214] active:scale-95 transition-all shadow-md"
          >
            <span>Create Your Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-semibold text-base hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-lime-600 dark:text-[#C8F31D]" />
            <span>Find a Partner</span>
          </Link>
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-semibold text-base hover:bg-amber-500/20 active:scale-95 transition-all shadow-xs"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tournaments</span>
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-semibold text-base hover:bg-blue-500/20 active:scale-95 transition-all shadow-xs"
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-500" />
            <span>Compare</span>
          </Link>
        </div>

        {/* Search quick bar */}
        <div className="mt-12 max-w-xl mx-auto">
          <form action="/players" method="GET" className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              name="q"
              placeholder="Search players by name, username, or city..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold text-xs transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </form>
        </div>

        {/* Highlights Row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-lime-600 dark:text-[#C8F31D]" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Skill Rated</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">2.0 to 5.5+ self-assessed &amp; peer-endorsed.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Declared Roles</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Dinker, Power banger, Drop specialist, or Coach.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Achievements</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Tournament podium finishes and Game Center badges.</p>
          </div>

          <Link
            href="/partners"
            className="p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-lime-500 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-lime-600 dark:text-[#C8F31D] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">Partner Finder</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Match by schedule, location, and playing style.</p>
          </Link>
        </div>
      </section>

      {/* Featured Players Showcase */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Featured Players
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Explore active players and their verified tournament track records.
            </p>
          </div>
          <Link
            href="/players"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span>View all players</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </section>

      {/* Playing Roles Matrix */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="rounded-[32px] bg-white/90 dark:bg-[#1C1C1E]/90 border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-3">
              Define Your Signature Court Identity
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
              Pickleball partnerships thrive on complementary styles. Declare whether you excel at patient soft-game dinks, baseline drives, or court leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {playingRoles.map((role) => (
              <div
                key={role.id}
                className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-2">
                    <RoleChip role={role} isPrimary={role.key === "dinker"} size="sm" />
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

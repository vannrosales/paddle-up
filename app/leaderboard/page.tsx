import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPlayers } from "@/lib/services/player-service";
import { RoleChip } from "@/components/role-chip";
import { SkillBadge } from "@/components/skill-badge";
import { Trophy, Award, TrendingUp, MapPin, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Leaderboards & Rankings",
  description:
    "Explore top ranked pickleball players by tournament achievements, peer endorsements, and competitive skill ladder on PaddleUp.",
};

interface LeaderboardPageProps {
  searchParams: Promise<{
    tab?: string;
    city?: string;
  }>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const { tab = "achievements", city = "all" } = await searchParams;

  const players = await getPlayers({
    city: city !== "all" ? city : undefined,
  });

  // Unique cities for filtering
  const allPlayers = await getPlayers();
  const cities = Array.from(
    new Set(allPlayers.map((p) => p.city).filter(Boolean) as string[])
  ).sort();

  // Sorting based on active tab
  const sortedPlayers = [...players].sort((a, b) => {
    if (tab === "endorsed") {
      const countA = a.endorsements?.length || 0;
      const countB = b.endorsements?.length || 0;
      return countB - countA;
    }
    if (tab === "skill") {
      const skillA = a.skillLevel || 0;
      const skillB = b.skillLevel || 0;
      return skillB - skillA;
    }
    // Default: achievements count
    const achA = a.achievements?.length || 0;
    const achB = b.achievements?.length || 0;
    return achB - achA;
  });

  const top3 = sortedPlayers.slice(0, 3);
  const rest = sortedPlayers.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
          <Trophy className="w-3.5 h-3.5" />
          <span>PaddleUp Community Rankings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          Pickleball Leaderboards
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Recognizing the most accomplished competitors, vouched community leaders, and top-rated tacticians.
        </p>
      </div>

      {/* Tabs & City Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-2 sm:p-3 rounded-2xl shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "achievements", label: "Most Medals", icon: Trophy },
            { id: "endorsed", label: "Most Endorsed", icon: Award },
            { id: "skill", label: "Skill Ladder", icon: TrendingUp },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <Link
                key={t.id}
                href={`/leaderboard?tab=${t.id}${city !== "all" ? `&city=${city}` : ""}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#C8F31D] text-[#1C2A00] shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2 px-2">
          <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <span className="text-xs text-neutral-500 font-medium">City:</span>
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <Link
              href={`/leaderboard?tab=${tab}&city=all`}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                city === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              All
            </Link>
            {cities.map((c) => (
              <Link
                key={c}
                href={`/leaderboard?tab=${tab}&city=${encodeURIComponent(c)}`}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  city.toLowerCase() === c.toLowerCase()
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {top3.map((player, idx) => {
            const rank = idx + 1;
            const primaryRole = player.roles?.find((r) => r.isPrimary);
            const medalsColor =
              rank === 1
                ? "from-amber-400 to-yellow-500 text-amber-950 border-amber-400"
                : rank === 2
                ? "from-slate-300 to-neutral-400 text-neutral-900 border-slate-300"
                : "from-amber-700 to-amber-800 text-amber-100 border-amber-700";

            return (
              <Link
                key={player.id}
                href={`/p/${player.username}`}
                className={`group relative rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 ${
                  rank === 1 ? "ring-2 ring-[#C8F31D]" : ""
                }`}
              >
                {/* Rank Badge */}
                <div
                  className={`absolute -top-3.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r border shadow-xs ${medalsColor}`}
                >
                  #{rank} {rank === 1 ? "Champion" : rank === 2 ? "Runner-Up" : "Third"}
                </div>

                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 mt-2 mb-3 shadow-md group-hover:scale-105 transition-transform">
                  {player.avatarUrl ? (
                    <Image
                      src={player.avatarUrl}
                      alt={player.displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-2xl text-neutral-500">
                      {player.displayName.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-[#C8F31D] transition-colors">
                  {player.displayName}
                </h3>
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                  @{player.username}
                </p>

                {player.city && (
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{player.city}</span>
                  </p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <SkillBadge level={player.skillLevel} size="sm" />
                  {primaryRole && <RoleChip role={primaryRole.role} size="sm" />}
                </div>

                {/* Stat Display Box */}
                <div className="w-full pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-400">
                      Medals
                    </span>
                    <span className="font-extrabold text-neutral-900 dark:text-white">
                      {player.achievements?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-400">
                      Vouches
                    </span>
                    <span className="font-extrabold text-neutral-900 dark:text-white">
                      {player.endorsements?.length || 0}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Ranked Table for Position 4+ */}
      {rest.length > 0 && (
        <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Ranked Ladder
            </h3>
            <span className="text-xs text-neutral-500">
              Showing {sortedPlayers.length} competitors
            </span>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {rest.map((player, idx) => {
              const rank = idx + 4;
              const primaryRole = player.roles?.find((r) => r.isPrimary);

              return (
                <Link
                  key={player.id}
                  href={`/p/${player.username}`}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-7 text-center font-black text-sm text-neutral-400 dark:text-neutral-500">
                      #{rank}
                    </span>

                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                      {player.avatarUrl ? (
                        <Image
                          src={player.avatarUrl}
                          alt={player.displayName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                          {player.displayName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-950 dark:text-white group-hover:text-lime-600 dark:group-hover:text-[#C8F31D] transition-colors">
                          {player.displayName}
                        </span>
                        <span className="text-xs font-mono text-neutral-500">
                          @{player.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {primaryRole && <RoleChip role={primaryRole.role} size="sm" />}
                        {player.city && (
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            • {player.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <span className="block text-xs font-extrabold text-neutral-900 dark:text-white">
                        {tab === "endorsed"
                          ? `${player.endorsements?.length || 0} Vouches`
                          : tab === "skill"
                          ? `${player.skillLevel?.toFixed(1) || "3.0"} Rating`
                          : `${player.achievements?.length || 0} Medals`}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase">
                        {tab === "endorsed"
                          ? "Endorsements"
                          : tab === "skill"
                          ? "Self & Vouched"
                          : "Podiums & Wins"}
                      </span>
                    </div>

                    <SkillBadge level={player.skillLevel} size="sm" />
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

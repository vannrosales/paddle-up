import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPlayers, getPlayerByUsername } from "@/lib/services/player-service";
import { getMatchStats } from "@/lib/services/match-service";
import { SkillBadge } from "@/components/skill-badge";
import { RoleChip } from "@/components/role-chip";
import { ArrowLeftRight, Check, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Player Comparison (Head-to-Head)",
  description:
    "Compare pickleball players head-to-head by skill ratings, playing styles, win rates, and tournament records on PaddleUp.",
};

interface ComparePageProps {
  searchParams: Promise<{
    p1?: string;
    p2?: string;
  }>;
}

export default async function PlayerComparisonPage({ searchParams }: ComparePageProps) {
  const { p1 = "marias", p2 = "junr" } = await searchParams;

  const allPlayers = await getPlayers();
  const player1 = await getPlayerByUsername(p1) || allPlayers[0];
  const player2 = await getPlayerByUsername(p2) || allPlayers[1];

  const stats1 = await getMatchStats(player1.id);
  const stats2 = await getMatchStats(player2.id);

  const primaryRole1 = player1.roles?.find((r) => r.isPrimary);
  const primaryRole2 = player2.roles?.find((r) => r.isPrimary);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-500/20">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Head-to-Head Scouting</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          Player Comparison
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Side-by-side analysis of court roles, skill ratings, medals, and match statistics.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 mb-8 shadow-xs">
        <form method="GET" action="/compare" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Player 1
            </label>
            <select
              name="p1"
              defaultValue={player1.username}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-950 dark:text-white"
            >
              {allPlayers.map((p) => (
                <option key={p.id} value={p.username}>
                  {p.displayName} (@{p.username}) - {p.skillLevel?.toFixed(1) || "Active"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Player 2
            </label>
            <div className="flex items-center gap-2">
              <select
                name="p2"
                defaultValue={player2.username}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-950 dark:text-white"
              >
                {allPlayers.map((p) => (
                  <option key={p.id} value={p.username}>
                    {p.displayName} (@{p.username}) - {p.skillLevel?.toFixed(1) || "Active"}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 flex-shrink-0"
              >
                Compare
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Player 1 Card */}
        <div className="rounded-[30px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-lime-400 to-[#C8F31D]" />

          <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 mb-4 shadow-md mt-2">
            {player1.avatarUrl ? (
              <Image src={player1.avatarUrl} alt={player1.displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-neutral-500">
                {player1.displayName.charAt(0)}
              </div>
            )}
          </div>

          <h3 className="font-extrabold text-xl text-neutral-950 dark:text-white">
            {player1.displayName}
          </h3>
          <p className="text-xs font-mono text-neutral-500 mb-2">@{player1.username}</p>

          {player1.city && (
            <p className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{player1.city}</span>
            </p>
          )}

          <div className="mb-4">
            <SkillBadge level={player1.skillLevel} size="md" showLabel />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {primaryRole1 && <RoleChip role={primaryRole1.role} isPrimary size="sm" />}
          </div>

          <Link
            href={`/p/${player1.username}`}
            className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            View Full Passport
          </Link>
        </div>

        {/* Player 2 Card */}
        <div className="rounded-[30px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />

          <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 mb-4 shadow-md mt-2">
            {player2.avatarUrl ? (
              <Image src={player2.avatarUrl} alt={player2.displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-neutral-500">
                {player2.displayName.charAt(0)}
              </div>
            )}
          </div>

          <h3 className="font-extrabold text-xl text-neutral-950 dark:text-white">
            {player2.displayName}
          </h3>
          <p className="text-xs font-mono text-neutral-500 mb-2">@{player2.username}</p>

          {player2.city && (
            <p className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{player2.city}</span>
            </p>
          )}

          <div className="mb-4">
            <SkillBadge level={player2.skillLevel} size="md" showLabel />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {primaryRole2 && <RoleChip role={primaryRole2.role} isPrimary size="sm" />}
          </div>

          <Link
            href={`/p/${player2.username}`}
            className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            View Full Passport
          </Link>
        </div>
      </div>

      {/* Head-to-Head Stat Comparison Table */}
      <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-neutral-500">
            Attribute &amp; Track Record Comparison
          </h3>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
          {[
            {
              label: "Self & Peer Rating",
              val1: player1.skillLevel ? `${player1.skillLevel.toFixed(1)} rating` : "3.0",
              val2: player2.skillLevel ? `${player2.skillLevel.toFixed(1)} rating` : "3.0",
              winner: (player1.skillLevel || 0) >= (player2.skillLevel || 0) ? 1 : 2,
            },
            {
              label: "Experience Playing",
              val1: `${player1.yearsPlaying || 1} years`,
              val2: `${player2.yearsPlaying || 1} years`,
              winner: (player1.yearsPlaying || 0) >= (player2.yearsPlaying || 0) ? 1 : 2,
            },
            {
              label: "Logged Medals & Podiums",
              val1: `${player1.achievements?.length || 0} medals`,
              val2: `${player2.achievements?.length || 0} medals`,
              winner: (player1.achievements?.length || 0) >= (player2.achievements?.length || 0) ? 1 : 2,
            },
            {
              label: "Community Endorsements",
              val1: `${player1.endorsements?.length || 0} vouches`,
              val2: `${player2.endorsements?.length || 0} vouches`,
              winner: (player1.endorsements?.length || 0) >= (player2.endorsements?.length || 0) ? 1 : 2,
            },
            {
              label: "Casual Match Win Rate",
              val1: stats1.totalMatches > 0 ? `${stats1.winRate}% (${stats1.wins}W / ${stats1.losses}L)` : "75% (3W / 1L)",
              val2: stats2.totalMatches > 0 ? `${stats2.winRate}% (${stats2.wins}W / ${stats2.losses}L)` : "100% (2W / 0L)",
              winner: stats1.winRate >= stats2.winRate ? 1 : 2,
            },
            {
              label: "Dominant Hand",
              val1: player1.dominantHand || "Right-handed",
              val2: player2.dominantHand || "Right-handed",
              winner: 0,
            },
            {
              label: "Home Club",
              val1: player1.homeClub || "Independent",
              val2: player2.homeClub || "Independent",
              winner: 0,
            },
            {
              label: "Looking For Partner",
              val1: player1.lookingForPartner ? "Yes (Active)" : "No",
              val2: player2.lookingForPartner ? "Yes (Active)" : "No",
              winner: 0,
            },
          ].map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 p-4 items-center hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
            >
              <div className="text-left font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                {row.winner === 1 && <Check className="w-3.5 h-3.5 text-lime-600 dark:text-[#C8F31D]" />}
                <span>{row.val1}</span>
              </div>

              <div className="text-center font-bold uppercase text-[10px] tracking-wider text-neutral-400">
                {row.label}
              </div>

              <div className="text-right font-semibold text-neutral-900 dark:text-white flex items-center justify-end gap-1.5">
                <span>{row.val2}</span>
                {row.winner === 2 && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

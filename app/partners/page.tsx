import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { findPartners } from "@/lib/services/partner-service";
import { getPlayers } from "@/lib/services/player-service";
import { SkillBadge } from "@/components/skill-badge";
import { RoleChip } from "@/components/role-chip";
import { PlayPreference } from "@/lib/types";
import {
  UserCheck,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pickleball Partner Finder",
  description:
    "Find compatible doubles partners and singles opponents by skill rating, preferred schedule, and court style on PaddleUp.",
};

interface PartnersPageProps {
  searchParams: Promise<{
    city?: string;
    pref?: PlayPreference;
    minSkill?: string;
    maxSkill?: string;
  }>;
}

export default async function PartnerFinderPage({ searchParams }: PartnersPageProps) {
  const { city = "all", pref = "all", minSkill, maxSkill } = await searchParams;

  const minRating = minSkill ? parseFloat(minSkill) : undefined;
  const maxRating = maxSkill ? parseFloat(maxSkill) : undefined;

  const partners = await findPartners({
    city: city !== "all" ? city : undefined,
    preference: pref !== "all" ? pref : undefined,
    minSkill: minRating,
    maxSkill: maxRating,
  });

  const allPlayers = await getPlayers();
  const cities = Array.from(new Set(allPlayers.map((p) => p.city).filter(Boolean) as string[])).sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-500/10 text-lime-700 dark:text-[#C8F31D] text-xs font-bold mb-3 border border-lime-500/20">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Active Partner Exchange</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          Find a Pickleball Partner
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Discover players in your city actively looking for doubles partners, drilling sessions, or casual round-robins.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 mb-8 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        {/* Preference Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-neutral-400 font-bold uppercase text-[10px] mr-1">Style:</span>
          {[
            { id: "all", label: "All Styles" },
            { id: "competitive", label: "Competitive" },
            { id: "casual", label: "Casual / Social" },
            { id: "drills", label: "Drills & Practice" },
          ].map((item) => (
            <Link
              key={item.id}
              href={`/partners?pref=${item.id}&city=${city}`}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                pref === item.id
                  ? "bg-[#C8F31D] text-[#1C2A00] font-bold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400 font-bold uppercase text-[10px]">City:</span>
          <div className="flex items-center gap-1 overflow-x-auto">
            <Link
              href={`/partners?pref=${pref}&city=all`}
              className={`px-2.5 py-1 rounded-lg ${
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
                href={`/partners?pref=${pref}&city=${encodeURIComponent(c)}`}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${
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

      {/* Partners Grid */}
      {partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((player) => {
            const primaryRole = player.roles?.find((r) => r.isPrimary);

            return (
              <div
                key={player.id}
                className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Looking to Play
                    </span>
                    <span className="text-[11px] font-bold capitalize px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {player.playPreference || "All play"}
                    </span>
                  </div>

                  {/* Player Info */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                      {player.avatarUrl ? (
                        <Image src={player.avatarUrl} alt={player.displayName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xl text-neutral-500">
                          {player.displayName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-neutral-950 dark:text-white">
                        {player.displayName}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500">@{player.username}</p>
                      {player.city && (
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-blue-500" />
                          <span>{player.city}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skill & Role */}
                  <div className="flex items-center justify-between py-3 border-y border-neutral-100 dark:border-neutral-800 mb-4">
                    <SkillBadge level={player.skillLevel} size="sm" showLabel />
                    {primaryRole && <RoleChip role={primaryRole.role} size="sm" />}
                  </div>

                  {/* Availability */}
                  {player.preferredPlayTimes && (
                    <div className="mb-4 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-neutral-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>Preferred Play Schedule</span>
                      </div>
                      <p className="font-medium text-[11px] leading-tight">
                        {player.preferredPlayTimes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/p/${player.username}`}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs text-center hover:opacity-90 transition-opacity"
                  >
                    View Passport
                  </Link>
                  <Link
                    href={`/compare?p1=marias&p2=${player.username}`}
                    className="py-2.5 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors"
                    title="Compare stats"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-950 dark:text-white mb-1">
            No partners matching this filter
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Try choosing &ldquo;All Styles&rdquo; or explore other cities.
          </p>
          <Link
            href="/partners?pref=all&city=all"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}

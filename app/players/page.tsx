"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlayerCard } from "@/components/player-card";
import { DEFAULT_ROLES } from "@/lib/constants/roles";
import { Search, RotateCcw, Users } from "lucide-react";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";

function DirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQuery);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedMinSkill, setSelectedMinSkill] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    MOCK_PLAYERS.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set).sort();
  }, []);

  // Filter players
  const filteredPlayers = useMemo(() => {
    return MOCK_PLAYERS.filter((player) => {
      // Visibility check
      if (player.visibility !== "public") return false;

      // Search match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = player.displayName.toLowerCase().includes(q);
        const matchesUser = player.username.toLowerCase().includes(q);
        const matchesCity = player.city?.toLowerCase().includes(q);
        const matchesClub = player.homeClub?.toLowerCase().includes(q);
        const matchesPaddle = player.paddleBrand?.toLowerCase().includes(q);
        if (!matchesName && !matchesUser && !matchesCity && !matchesClub && !matchesPaddle) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== "all") {
        const hasRole = player.roles?.some((r) => r.roleId === selectedRole || r.role.key === selectedRole);
        if (!hasRole) return false;
      }

      // Skill filter
      if (selectedMinSkill !== "all") {
        const minVal = parseFloat(selectedMinSkill);
        if (!player.skillLevel || player.skillLevel < minVal) return false;
      }

      // City filter
      if (selectedCity !== "all") {
        if (player.city?.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      return true;
    });
  }, [search, selectedRole, selectedMinSkill, selectedCity]);

  const resetFilters = () => {
    setSearch("");
    setSelectedRole("all");
    setSelectedMinSkill("all");
    setSelectedCity("all");
  };

  const isFiltered =
    search.trim() !== "" ||
    selectedRole !== "all" ||
    selectedMinSkill !== "all" ||
    selectedCity !== "all";

  return (
    <>
      {/* Directory Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          Player Directory
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1.5">
          Discover local pickleball partners, dinking specialists, tournament competitors, and certified coaches.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-4 sm:p-6 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by player name, @username, or paddle..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          {/* Role Filter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="all">All Playing Roles</option>
              {DEFAULT_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>

            {/* Minimum Skill Filter */}
            <select
              value={selectedMinSkill}
              onChange={(e) => setSelectedMinSkill(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="all">Any Skill Level</option>
              <option value="3.0">3.0+ (Intermediate)</option>
              <option value="3.5">3.5+ (Adv. Interm.)</option>
              <option value="4.0">4.0+ (Advanced)</option>
              <option value="4.5">4.5+ (Expert)</option>
              <option value="5.0">5.0+ (Pro / Elite)</option>
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Reset button */}
            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter and Active Filter status */}
        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>
              Showing <strong className="text-neutral-900 dark:text-white">{filteredPlayers.length}</strong> {filteredPlayers.length === 1 ? "player" : "players"}
            </span>
          </div>

          {isFiltered && (
            <span className="font-semibold text-[#0A84FF]">
              Filters active
            </span>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-12 text-center max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center mb-4 text-3xl">
            🏓
          </div>
          <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-2">No players found</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
            We couldn&apos;t find any player matching your current filters. Try resetting your search or widening the skill range.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}

export default function PlayersDirectoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Suspense fallback={<div className="p-12 text-center text-xs text-[var(--text-muted)]">Loading players directory...</div>}>
        <DirectoryContent />
      </Suspense>
    </div>
  );
}

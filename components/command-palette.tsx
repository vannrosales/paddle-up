"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { MOCK_CLUBS } from "@/lib/data/mock-engagement";
import { MOCK_TOURNAMENTS } from "@/lib/data/mock-phase3";
import {
  Search,
  Users,
  Shield,
  Trophy,
  UserCheck,
  PlusCircle,
  X,
  Sparkles,
  Command,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  const q = query.toLowerCase().trim();

  const filteredPlayers = q
    ? MOCK_PLAYERS.filter(
        (p) =>
          p.displayName.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q) ||
          (p.city && p.city.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  const filteredClubs = q
    ? MOCK_CLUBS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredTournaments = q
    ? MOCK_TOURNAMENTS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, clubs, tournaments, or jump to..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none font-medium"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Shortcuts */}
          {!q && (
            <div>
              <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-neutral-400">
                Quick Navigation
              </p>
              <div className="space-y-1">
                {[
                  { label: "Find Pickleball Partner", href: "/partners", icon: UserCheck },
                  { label: "Tournaments & Brackets", href: "/tournaments", icon: Trophy },
                  { label: "Player Comparison (Head-to-Head)", href: "/compare", icon: Sparkles },
                  { label: "Community Leaderboard", href: "/leaderboard", icon: Trophy },
                  { label: "Pickleball Clubs Directory", href: "/clubs", icon: Shield },
                  { label: "Log Match or Win", href: "/dashboard/matches/new", icon: PlusCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleSelect(item.href)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-lime-600 dark:text-[#C8F31D]" />
                      <span className="font-semibold text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Player Results */}
          {filteredPlayers.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-neutral-400">
                Players
              </p>
              <div className="space-y-1">
                {filteredPlayers.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => handleSelect(`/p/${player.username}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {player.displayName}
                        </span>
                        <span className="text-neutral-400 ml-1.5 font-mono">
                          @{player.username}
                        </span>
                      </div>
                    </div>
                    {player.skillLevel && (
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-lime-500/15 text-lime-700 dark:text-[#C8F31D] text-[10px]">
                        {player.skillLevel.toFixed(1)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Club Results */}
          {filteredClubs.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-neutral-400">
                Clubs
              </p>
              <div className="space-y-1">
                {filteredClubs.map((club) => (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => handleSelect(`/clubs/${club.slug}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {club.name}
                      </span>
                    </div>
                    <span className="text-neutral-400 text-[11px]">{club.city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tournament Results */}
          {filteredTournaments.length > 0 && (
            <div>
              <p className="px-3 py-1 font-bold uppercase tracking-wider text-[10px] text-neutral-400">
                Tournaments
              </p>
              <div className="space-y-1">
                {filteredTournaments.map((tourn) => (
                  <button
                    key={tourn.id}
                    type="button"
                    onClick={() => handleSelect(`/tournaments/${tourn.slug}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {tourn.name}
                      </span>
                    </div>
                    <span className="text-neutral-400 text-[11px]">{tourn.city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && filteredPlayers.length === 0 && filteredClubs.length === 0 && filteredTournaments.length === 0 && (
            <div className="py-6 text-center text-neutral-500">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span>Press ESC to close</span>
          <span className="flex items-center gap-1 font-mono">
            <Command className="w-3 h-3" /> K
          </span>
        </div>
      </div>
    </div>
  );
}


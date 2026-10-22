"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logMatch } from "@/lib/services/match-service";
import { MatchResult, MatchType } from "@/lib/types";
import { Trophy, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

export default function NewMatchLogPage() {
  const router = useRouter();
  const [matchType, setMatchType] = useState<MatchType>("doubles");
  const [partnerName, setPartnerName] = useState("");
  const [opponents, setOpponents] = useState("");
  const [result, setResult] = useState<MatchResult>("win");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [playedAt, setPlayedAt] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Retrieve active demo user
    const match = typeof document !== "undefined" ? document.cookie.match(/paddleup_demo_user=([^;]+)/) : null;
    const currentUsername = match ? decodeURIComponent(match[1]) : "marias";
    const profileId = currentUsername === "carlosm" ? "prof_004" : "prof_001";

    const res = await logMatch({
      profileId,
      matchType,
      partnerName: matchType === "singles" ? undefined : partnerName,
      opponents,
      result,
      score,
      notes,
      playedAt,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to log match.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </Link>
      </div>

      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-lime-500/10 text-lime-600 dark:text-[#C8F31D] flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Log Match Record
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Track casual or rec match scores, doubles partners, and win rates.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Match Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Match Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "doubles" as MatchType, label: "Doubles" },
                { id: "mixed" as MatchType, label: "Mixed Doubles" },
                { id: "singles" as MatchType, label: "Singles" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMatchType(opt.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    matchType === opt.id
                      ? "bg-[#C8F31D] text-[#1C2A00] border-lime-500 shadow-xs"
                      : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome Result */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Match Result
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResult("win")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  result === "win"
                    ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                Victory (Win)
              </button>
              <button
                type="button"
                onClick={() => setResult("loss")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  result === "loss"
                    ? "bg-neutral-900 text-white dark:bg-neutral-700 border-neutral-800 shadow-xs"
                    : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                Defeat (Loss)
              </button>
            </div>
          </div>

          {/* Partner Name (if doubles) */}
          {matchType !== "singles" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Doubles Partner Name
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. Elena Garcia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          )}

          {/* Opponents */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Opponent(s) *
            </label>
            <input
              type="text"
              required
              value={opponents}
              onChange={(e) => setOpponents(e.target.value)}
              placeholder="e.g. Tan & Lim or Marcus Lee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
          </div>

          {/* Score & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Game Score *
              </label>
              <input
                type="text"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 11-8, 11-6"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Date Played
              </label>
              <input
                type="date"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-500 font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Tactical Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Solid third shot drops; good kitchen defense against heavy drives."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#C8F31D] hover:bg-[#b8e214] text-[#1C2A00] font-bold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? "Recording..." : "Save Match"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

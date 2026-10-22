"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTournament } from "@/lib/services/tournament-service";
import { Trophy, ArrowLeft, AlertCircle, PlusCircle } from "lucide-react";

export default function CreateTournamentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [division, setDivision] = useState("Open & 4.0 Doubles");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const match = typeof document !== "undefined" ? document.cookie.match(/paddleup_demo_user=([^;]+)/) : null;
    const currentUsername = match ? decodeURIComponent(match[1]) : "marias";
    const organizerId = currentUsername === "carlosm" ? "prof_004" : "prof_001";

    const res = await createTournament({
      name,
      city,
      division,
      startDate,
      organizerId,
      organizerName: "Tournament Director",
      description,
    });

    setLoading(false);

    if (!res.success || !res.tournament) {
      setError(res.error || "Failed to create tournament.");
      return;
    }

    router.push(`/tournaments/${res.tournament.slug}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tournaments directory</span>
        </Link>
      </div>

      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Publish Tournament Results
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Certify official division brackets and link medals to player passports.
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
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Tournament Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Visayas Pickleball Open 2024"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Cebu City"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Divisions Included *
            </label>
            <input
              type="text"
              required
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              placeholder="e.g. Women's Doubles 4.0, Men's Open Singles"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Event Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide event details, participating clubs, or court notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-medium"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <Link
              href="/tournaments"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#C8F31D] hover:bg-[#b8e214] text-[#1C2A00] font-bold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? "Publishing..." : "Publish Tournament"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAchievement } from "@/lib/services/achievement-service";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { Trophy, ArrowLeft, ArrowRight } from "lucide-react";

export default function NewAchievementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"tournament" | "milestone" | "certification" | "award">("tournament");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [division, setDivision] = useState("");
  const [placement, setPlacement] = useState("Gold");
  const [partnerName, setPartnerName] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide an achievement title");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentProfileId = MOCK_PLAYERS[0].id;

      await createAchievement({
        profileId: currentProfileId,
        title: title.trim(),
        type,
        eventName: eventName.trim() || undefined,
        eventDate: eventDate || undefined,
        division: division.trim() || undefined,
        placement: placement.trim() || undefined,
        partnerName: partnerName.trim() || undefined,
        proofUrl: proofUrl.trim() || undefined,
        status: "self_reported",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to record achievement";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 md:py-14">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </Link>
      </div>

      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Log Achievement
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Record a tournament placement, credential, or career milestone.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Achievement Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Visayas Open Men's 4.0 Champions"
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "tournament" | "milestone" | "certification" | "award")}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                <option value="tournament">Tournament Result</option>
                <option value="certification">Coaching/Ref Credential</option>
                <option value="milestone">Milestone / Anniversary</option>
                <option value="award">Club / Community Award</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Medal / Placement
              </label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              >
                <option value="Gold">Gold Medal / 1st Place</option>
                <option value="Silver">Silver Medal / 2nd Place</option>
                <option value="Bronze">Bronze Medal / 3rd Place</option>
                <option value="Finalist">Finalist</option>
                <option value="Semifinalist">Semifinalist</option>
                <option value="Certified">Certified</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Event Name / Tournament
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. 2024 Philippine Pickleball Open"
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Division / Bracket
              </label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                placeholder="e.g. Mixed Doubles 4.0"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Doubles Partner (Optional)
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. Jun Reyes"
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Proof URL / Bracket Link (Optional)
            </label>
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://pickleballbrackets.com/..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs disabled:opacity-50"
            >
              <span>{loading ? "Saving..." : "Save Achievement"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

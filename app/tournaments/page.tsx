import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllTournaments } from "@/lib/services/tournament-service";
import { Trophy, Calendar, MapPin, ChevronRight, PlusCircle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tournaments & Sanctioned Opens",
  description:
    "Explore upcoming pickleball tournaments, division schedules, and published official results on PaddleUp.",
};

interface TournamentsPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
  }>;
}

export default async function TournamentsPage({ searchParams }: TournamentsPageProps) {
  const { q = "", city = "all" } = await searchParams;
  const tournaments = await getAllTournaments(q, city);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive Events</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Tournaments &amp; Results
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
            Official division results auto-link directly to player profiles, certifying tournament medals and national ratings.
          </p>
        </div>

        <Link
          href="/tournaments/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C8F31D] text-[#1C2A00] font-extrabold text-xs shadow-xs hover:bg-[#b8e214] active:scale-95 transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Tournament Results</span>
        </Link>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tourn) => (
          <Link
            key={tourn.id}
            href={`/tournaments/${tourn.slug}`}
            className="group rounded-[30px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Banner */}
              <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                {tourn.bannerUrl ? (
                  <Image
                    src={tourn.bannerUrl}
                    alt={tourn.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-amber-600 to-yellow-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 backdrop-blur-md bg-black/60 border border-white/10 uppercase tracking-wider">
                  {tourn.status === "completed" ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>Results Verified</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-lime-400" />
                      <span>Upcoming</span>
                    </>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                    {tourn.name}
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono mt-0.5">
                    {tourn.division}
                  </p>
                </div>
              </div>

              {/* Tournament Meta */}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-3 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {tourn.city}{tourn.country ? `, ${tourn.country}` : ""}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {new Date(tourn.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                  {tourn.description || "Official tournament sanctioned results and bracket placements."}
                </p>

                {tourn.results.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {tourn.results.length} Placements recorded
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>View Tournament Bracket &amp; Results</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllClubs } from "@/lib/services/club-service";
import { Users, MapPin, Plus, ShieldCheck, ChevronRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Pickleball Clubs Directory",
  description:
    "Find and join local pickleball clubs, competitive teams, and community court groups on PaddleUp.",
};

interface ClubsPageProps {
  searchParams: Promise<{
    q?: string;
    city?: string;
  }>;
}

export default async function ClubsPage({ searchParams }: ClubsPageProps) {
  const { q = "", city = "all" } = await searchParams;
  const clubs = await getAllClubs(q, city);

  // Extract cities
  const allClubs = await getAllClubs();
  const cities = Array.from(new Set(allClubs.map((c) => c.city))).sort();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>Community Hubs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Pickleball Clubs
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
            Connect with home courts, join weekly open-play rosters, and compete as a team under a verified club banner.
          </p>
        </div>

        <Link
          href="/clubs/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C8F31D] text-[#1C2A00] font-extrabold text-xs shadow-xs hover:bg-[#b8e214] active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create a Club</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 mb-8 shadow-xs flex flex-col sm:flex-row gap-3">
        <form method="GET" action="/clubs" className="flex-1 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search clubs by name or court location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <Link
            href={`/clubs?q=${q}&city=all`}
            className={`px-3 py-2 rounded-xl transition-colors ${
              city === "all"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            All Cities
          </Link>
          {cities.map((c) => (
            <Link
              key={c}
              href={`/clubs?q=${q}&city=${encodeURIComponent(c)}`}
              className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
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

      {/* Clubs Grid */}
      {clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubs.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              className="group rounded-[30px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
            >
              {/* Club Banner */}
              <div className="relative h-36 w-full bg-neutral-800 overflow-hidden">
                {club.bannerUrl ? (
                  <Image
                    src={club.bannerUrl}
                    alt={club.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Member count pill */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1 border border-white/10">
                  <Users className="w-3.5 h-3.5 text-[#C8F31D]" />
                  <span>{club.memberCount} Members</span>
                </div>
              </div>

              {/* Club Content */}
              <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-extrabold text-lg text-neutral-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {club.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-[#34C759] flex-shrink-0" />
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mb-3 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {club.city}
                      {club.country ? `, ${club.country}` : ""}
                    </span>
                  </p>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                    {club.description || "Active community pickleball club with weekly open play sessions."}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    View Club Roster &amp; Ladder
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-950 dark:text-white mb-1">
            No clubs found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Try adjusting your search criteria or register your court crew as an official club.
          </p>
          <Link
            href="/clubs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Club</span>
          </Link>
        </div>
      )}
    </div>
  );
}


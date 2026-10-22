import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTournamentBySlug } from "@/lib/services/tournament-service";
import { Trophy, Calendar, MapPin, ArrowLeft, ShieldCheck, ExternalLink } from "lucide-react";

interface TournamentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TournamentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tourn = await getTournamentBySlug(slug);

  if (!tourn) return { title: "Tournament Not Found" };

  return {
    title: `${tourn.name} | Results & Placements`,
    description: `Official division results and medal winners for ${tourn.name} in ${tourn.city}.`,
  };
}

export default async function TournamentDetailPage({ params }: TournamentDetailPageProps) {
  const { slug } = await params;
  const tourn = await getTournamentBySlug(slug);

  if (!tourn) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/tournaments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tournaments directory</span>
        </Link>
      </div>

      {/* Hero Card */}
      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs mb-8">
        <div className="relative h-56 w-full bg-neutral-900">
          {tourn.bannerUrl ? (
            <Image src={tourn.bannerUrl} alt={tourn.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-amber-700 to-yellow-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-5 left-6 right-6">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider mb-2">
              Official Tournament
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {tourn.name}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-4">
            <span className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 font-bold">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {tourn.city}{tourn.country ? `, ${tourn.country}` : ""}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              {new Date(tourn.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span>•</span>
            <span className="text-lime-600 dark:text-[#C8F31D] font-bold">
              Division: {tourn.division}
            </span>
          </div>

          {tourn.description && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 pt-4">
              {tourn.description}
            </p>
          )}
        </div>
      </div>

      {/* Official Placements Results Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Official Medal Placements
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#34C759] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Results</span>
          </span>
        </div>

        {tourn.results.length > 0 ? (
          <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {tourn.results.map((res, idx) => (
              <div
                key={idx}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-wider flex-shrink-0 shadow-xs border ${
                      res.placement === "Gold"
                        ? "bg-amber-400 text-amber-950 border-amber-300"
                        : res.placement === "Silver"
                        ? "bg-slate-300 text-neutral-900 border-slate-200"
                        : res.placement === "Bronze"
                        ? "bg-amber-700 text-amber-100 border-amber-600"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {res.placement}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      {res.playerUsername ? (
                        <Link
                          href={`/p/${res.playerUsername}`}
                          className="font-bold text-sm text-neutral-950 dark:text-white hover:underline flex items-center gap-1"
                        >
                          <span>{res.playerName}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-400" />
                        </Link>
                      ) : (
                        <span className="font-bold text-sm text-neutral-950 dark:text-white">
                          {res.playerName}
                        </span>
                      )}

                      {res.partnerName && (
                        <span className="text-xs text-neutral-500">
                          &amp;{" "}
                          {res.partnerUsername ? (
                            <Link
                              href={`/p/${res.partnerUsername}`}
                              className="font-bold text-neutral-900 dark:text-neutral-100 hover:underline"
                            >
                              {res.partnerName}
                            </Link>
                          ) : (
                            res.partnerName
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{res.division}</p>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    Linked to Passport
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 text-center text-xs text-neutral-500">
            Tournament has concluded or brackets are being compiled by the tournament director.
          </div>
        )}
      </div>
    </div>
  );
}

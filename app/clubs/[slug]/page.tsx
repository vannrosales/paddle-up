import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getClubBySlug } from "@/lib/services/club-service";
import { ClubActions } from "@/components/club-actions";
import { SkillBadge } from "@/components/skill-badge";
import { RoleChip } from "@/components/role-chip";
import {
  Users,
  MapPin,
  ArrowLeft,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface ClubPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ClubPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) {
    return {
      title: "Club Not Found",
    };
  }

  return {
    title: `${club.name} | Pickleball Club Roster`,
    description: `${club.name} based in ${club.city}. ${club.description || "View player roster and club achievements on PaddleUp."}`,
  };
}

export default async function ClubDetailPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) {
    notFound();
  }

  const members = club.members || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/clubs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all clubs</span>
        </Link>
      </div>

      {/* Club Hero Card */}
      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs mb-8">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-neutral-900">
          {club.bannerUrl ? (
            <Image
              src={club.bannerUrl}
              alt={club.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Club Details Header */}
        <div className="p-6 sm:p-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-5">
              {/* Logo */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-neutral-800 border-4 border-white dark:border-[#1C1C1E] shadow-xl flex-shrink-0">
                {club.logoUrl ? (
                  <Image
                    src={club.logoUrl}
                    alt={club.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-3xl text-neutral-400">
                    {club.name.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    {club.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-[#34C759]" />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {club.city}{club.country ? `, ${club.country}` : ""}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-lime-600 dark:text-[#C8F31D]" />
                    {club.memberCount} Members
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Est. {new Date(club.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Join / Leave Component */}
            <div className="self-stretch sm:self-auto">
              <ClubActions club={club} />
            </div>
          </div>

          {/* Description */}
          {club.description && (
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 pt-5">
              {club.description}
            </p>
          )}
        </div>
      </div>

      {/* Roster & Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Official Club Roster
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {members.length} registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => {
            const player = member.profile;
            const primaryRole = player?.roles?.find((r) => r.isPrimary);

            return (
              <div
                key={`${member.clubId}_${member.profileId}`}
                className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex-shrink-0">
                    {player?.avatarUrl ? (
                      <Image
                        src={player.avatarUrl}
                        alt={player.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                        {player?.displayName.charAt(0) || "P"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/p/${player?.username || "marias"}`}
                        className="font-bold text-sm text-neutral-950 dark:text-white hover:underline truncate"
                      >
                        {player?.displayName || "Club Member"}
                      </Link>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          member.role === "owner"
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                            : member.role === "manager"
                            ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      {primaryRole && <RoleChip role={primaryRole.role} size="sm" />}
                      <span className="text-[11px] font-mono text-neutral-400">
                        @{player?.username}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <SkillBadge level={player?.skillLevel} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

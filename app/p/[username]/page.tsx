import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPlayerByUsername } from "@/lib/services/player-service";
import { RoleChip } from "@/components/role-chip";
import { SkillBadge } from "@/components/skill-badge";
import { AchievementItem } from "@/components/achievement-item";
import { BadgeTile } from "@/components/badge-tile";
import { ProfileActions } from "@/components/profile-actions";
import { DEFAULT_BADGES } from "@/lib/constants/badges";
import {
  MapPin,
  Trophy,
  ShieldCheck,
  ArrowLeft,
  Award,
  Sparkles,
} from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const player = await getPlayerByUsername(username);

  if (!player || player.visibility === "private") {
    return {
      title: "Player Not Found",
    };
  }

  const primaryRole = player.roles?.find((r) => r.isPrimary)?.role.label || "Pickleball Player";
  const ratingText = player.skillLevel ? `Rating: ${player.skillLevel.toFixed(1)}` : "";

  return {
    title: `${player.displayName} (@${player.username})`,
    description: `${player.displayName} - ${primaryRole}. ${ratingText}. ${player.bio || "View achievements, endorsements, and badges on PaddleUp."}`,
    openGraph: {
      title: `${player.displayName} | Pickleball Profile`,
      description: `${primaryRole} · ${player.city || "Pickleballer"} · ${player.achievements?.length || 0} Achievements`,
      type: "profile",
      images: [
        {
          url: `/p/${player.username}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${player.displayName} Pickleball Passport Card`,
        },
      ],
    },
  };
}

export default async function PlayerProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const player = await getPlayerByUsername(username);

  if (!player || player.visibility === "private") {
    notFound();
  }

  const primaryRole = player.roles?.find((r) => r.isPrimary);
  const secondaryRoles = player.roles?.filter((r) => !r.isPrimary) || [];
  const achievements = player.achievements || [];
  const endorsements = player.endorsements || [];
  const unlockedBadgesMap = new Map((player.badges || []).map((b) => [b.badge.id, b]));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      {/* Back to Directory & Quick Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/players"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to directory</span>
        </Link>

        <ProfileActions player={player} />
      </div>

      {/* Profile Header Card ("Court Glass" style) */}
      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 mb-8 relative overflow-hidden shadow-xs">
        {/* Optic accent glow banner */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#C8F31D] via-lime-400 to-[#0A84FF]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
          {/* Avatar + Main Info */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 shadow-md flex-shrink-0">
              {player.avatarUrl ? (
                <Image
                  src={player.avatarUrl}
                  alt={player.displayName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-black text-3xl text-neutral-500">
                  {player.displayName.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  {player.displayName}
                </h1>
                <span title="Verified Profile">
                  <ShieldCheck className="w-5 h-5 text-[#34C759]" />
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">@{player.username}</p>
                <span className="text-xs text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  {player.followersCount || 0} followers
                </span>
              </div>

              {(player.city || player.country) && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    {player.city}
                    {player.city && player.country ? ", " : ""}
                    {player.country}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skill Ring Display */}
          <div className="self-end sm:self-center">
            <SkillBadge level={player.skillLevel} size="lg" showLabel />
          </div>
        </div>

        {/* Bio */}
        {player.bio && (
          <p className="mt-6 text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-5">
            {player.bio}
          </p>
        )}

        {/* Role Chips */}
        <div className="mt-6 flex flex-wrap gap-2 items-center">
          {primaryRole && <RoleChip role={primaryRole.role} isPrimary size="md" />}
          {secondaryRoles.map((sr) => (
            <RoleChip key={sr.roleId} role={sr.role} size="md" />
          ))}
        </div>

        {/* Hardware & Details Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider text-[10px] font-bold">
              Dominant Hand
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 capitalize block">
              {player.dominantHand || "Not specified"}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider text-[10px] font-bold">
              Years Playing
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
              {player.yearsPlaying ? `${player.yearsPlaying} yrs` : "Not specified"}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider text-[10px] font-bold">
              Paddle Choice
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block truncate">
              {player.paddleBrand || "Not listed"}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider text-[10px] font-bold">
              Home Court / Club
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block truncate">
              {player.homeClub || "Independent"}
            </span>
          </div>
        </div>
      </div>

      {/* Badges System Showcase (Feature 11) */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lime-600 dark:text-[#C8F31D]" />
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Badges &amp; Accolades
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-500/10 text-lime-700 dark:text-[#C8F31D]">
            {unlockedBadgesMap.size} of {DEFAULT_BADGES.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {DEFAULT_BADGES.map((badge) => {
            const unlocked = unlockedBadgesMap.get(badge.id);
            return (
              <BadgeTile
                key={badge.id}
                badge={badge}
                isUnlocked={Boolean(unlocked)}
                awardedAt={unlocked?.awardedAt}
              />
            );
          })}
        </div>
      </div>

      {/* Peer Endorsements Section (Feature 10) */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Peer Endorsements
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {endorsements.length} vouches
          </span>
        </div>

        {endorsements.length > 0 ? (
          <div className="grid gap-3.5">
            {endorsements.map((end) => (
              <div
                key={end.id}
                className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex-shrink-0">
                    {end.fromProfile?.avatarUrl ? (
                      <Image
                        src={end.fromProfile.avatarUrl}
                        alt={end.fromProfile.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500 text-sm">
                        {end.fromProfile?.displayName.charAt(0) || "P"}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/p/${end.fromProfile?.username || "marias"}`}
                        className="text-xs font-bold text-neutral-950 dark:text-white hover:underline"
                      >
                        {end.fromProfile?.displayName || "Fellow Pickleballer"}
                      </Link>
                      {end.fromProfile?.skillLevel && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-lime-500/15 text-lime-700 dark:text-[#C8F31D]">
                          {end.fromProfile.skillLevel.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">
                      Vouched for: <span className="text-lime-700 dark:text-[#C8F31D] font-bold">{end.targetValue || "Skill & Role"}</span>
                    </p>

                    {end.note && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 italic">
                        &ldquo;{end.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 self-end sm:self-center">
                  {new Date(end.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 shadow-xs">
            No peer endorsements yet. Be the first to vouch for {player.displayName}!
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Achievements &amp; Medals
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {achievements.length} recorded
          </span>
        </div>

        {achievements.length > 0 ? (
          <div className="grid gap-3">
            {achievements.map((ach) => (
              <AchievementItem key={ach.id} achievement={ach} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 shadow-xs">
            No achievements logged yet.
          </div>
        )}
      </div>
    </div>
  );
}

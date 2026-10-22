import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayerProfile } from "@/lib/types";
import { RoleChip } from "@/components/role-chip";
import { SkillBadge } from "@/components/skill-badge";
import { MapPin, Trophy, ShieldCheck } from "lucide-react";

interface PlayerCardProps {
  player: PlayerProfile;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const primaryRole = player.roles?.find((r) => r.isPrimary);
  const secondaryRoles = player.roles?.filter((r) => !r.isPrimary) || [];
  const achievementsCount = player.achievements?.length || 0;

  return (
    <Link
      href={`/p/${player.username}`}
      className="group block rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-neutral-200/90 dark:border-neutral-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden shadow-xs"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
            {player.avatarUrl ? (
              <Image
                src={player.avatarUrl}
                alt={player.displayName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-lg text-neutral-500">
                {player.displayName.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-blue-500 transition-colors">
                {player.displayName}
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#34C759]" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">@{player.username}</p>
            {(player.city || player.country) && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>
                  {player.city}
                  {player.city && player.country ? ", " : ""}
                  {player.country}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skill rating */}
        <SkillBadge level={player.skillLevel} size="sm" />
      </div>

      {/* Bio snippet */}
      {player.bio && (
        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
          {player.bio}
        </p>
      )}

      {/* Roles Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {primaryRole && <RoleChip role={primaryRole.role} isPrimary size="sm" />}
        {secondaryRoles.slice(0, 2).map((sr) => (
          <RoleChip key={sr.roleId} role={sr.role} size="sm" />
        ))}
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>{achievementsCount} {achievementsCount === 1 ? "achievement" : "achievements"}</span>
        </div>
        {player.homeClub && (
          <span className="truncate max-w-[140px] text-[11px] font-medium text-neutral-700 dark:text-neutral-300">
            {player.homeClub}
          </span>
        )}
      </div>
    </Link>
  );
}

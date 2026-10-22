import React from "react";
import { Badge } from "@/lib/types";
import {
  Medal,
  Users,
  Award,
  Zap,
  ShieldCheck,
  Flame,
  Sparkles,
  Lock,
  Trophy,
} from "lucide-react";

interface BadgeTileProps {
  badge: Badge;
  isUnlocked?: boolean;
  awardedAt?: string;
  size?: "sm" | "md" | "lg";
}

const ICON_MAP: Record<string, React.ElementType> = {
  Medal,
  Users,
  Award,
  Zap,
  ShieldCheck,
  Flame,
  Sparkles,
  Trophy,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  tournament: "from-amber-500/20 via-yellow-500/10 to-amber-600/5 text-amber-500 border-amber-500/30",
  community: "from-blue-500/20 via-sky-500/10 to-indigo-600/5 text-blue-500 border-blue-500/30",
  social: "from-purple-500/20 via-pink-500/10 to-rose-600/5 text-purple-500 border-purple-500/30",
  milestone: "from-lime-500/20 via-emerald-500/10 to-green-600/5 text-lime-500 border-lime-500/30",
  certification: "from-teal-500/20 via-cyan-500/10 to-emerald-600/5 text-teal-500 border-teal-500/30",
  skill: "from-orange-500/20 via-amber-500/10 to-red-600/5 text-orange-500 border-orange-500/30",
  special: "from-[#C8F31D]/25 via-lime-400/15 to-emerald-500/5 text-lime-600 dark:text-[#C8F31D] border-[#C8F31D]/40",
};

export function BadgeTile({
  badge,
  isUnlocked = true,
  awardedAt,
  size = "md",
}: BadgeTileProps) {
  const IconComponent = ICON_MAP[badge.icon] || Trophy;
  const gradientClass =
    CATEGORY_GRADIENTS[badge.category || "milestone"] ||
    CATEGORY_GRADIENTS.milestone;

  if (size === "sm") {
    return (
      <div
        className={`group relative flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all ${
          isUnlocked
            ? "bg-white dark:bg-[#1C1C1E] border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-lime-500/50"
            : "bg-neutral-100/60 dark:bg-neutral-900/60 border-neutral-200/50 dark:border-neutral-800/50 opacity-60"
        }`}
        title={`${badge.label}: ${badge.description}`}
      >
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
            isUnlocked
              ? gradientClass
              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border border-neutral-300 dark:border-neutral-700"
          }`}
        >
          {isUnlocked ? (
            <IconComponent className="w-3.5 h-3.5" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
            {badge.label}
          </p>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
            {badge.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex flex-col items-center text-center p-4 rounded-3xl border transition-all ${
        isUnlocked
          ? "bg-white dark:bg-[#1C1C1E] border-neutral-200 dark:border-neutral-800 shadow-xs hover:shadow-md hover:-translate-y-0.5"
          : "bg-neutral-100/50 dark:bg-neutral-900/50 border-neutral-200/40 dark:border-neutral-800/40 opacity-60 grayscale hover:grayscale-0"
      }`}
    >
      {/* Apple Game Center-style App Squircle Icon */}
      <div
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-3 bg-gradient-to-br border shadow-xs transition-transform group-hover:scale-105 ${
          isUnlocked
            ? gradientClass
            : "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-400"
        }`}
      >
        {isUnlocked ? (
          <IconComponent className="w-7 h-7" />
        ) : (
          <Lock className="w-6 h-6 text-neutral-400" />
        )}

        {isUnlocked && (
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-500 rounded-full border-2 border-white dark:border-[#1C1C1E]" />
        )}
      </div>

      <h4 className="text-xs font-extrabold text-neutral-950 dark:text-white tracking-tight mb-1">
        {badge.label}
      </h4>

      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight line-clamp-2 max-w-[140px]">
        {badge.description}
      </p>

      {awardedAt && isUnlocked && (
        <span className="mt-2.5 text-[9px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded-full">
          Earned {new Date(awardedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
        </span>
      )}
    </div>
  );
}


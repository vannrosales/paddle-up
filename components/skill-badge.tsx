import React from "react";
import { formatSkillLevel } from "@/lib/utils";

interface SkillBadgeProps {
  level: number | null | undefined;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function SkillBadge({ level, size = "md", showLabel = false }: SkillBadgeProps) {
  const formatted = formatSkillLevel(level);

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#C8F31D] bg-white dark:bg-neutral-900 shadow-md">
          <span className="text-2xl font-black tracking-tight text-neutral-950 dark:text-[#C8F31D]">
            {formatted}
          </span>
        </div>
        {showLabel && (
          <span className="mt-1.5 text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Skill Rating
          </span>
        )}
      </div>
    );
  }

  if (size === "sm") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-lime-100 text-lime-900 dark:bg-neutral-900 dark:text-[#C8F31D] border border-lime-300 dark:border-[#C8F31D]/40 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-600 dark:bg-[#C8F31D]" />
        {formatted}
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-extrabold bg-white text-neutral-900 dark:bg-neutral-900 dark:text-[#C8F31D] border border-neutral-300 dark:border-[#C8F31D]/30 shadow-xs">
      <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-[#C8F31D] animate-pulse" />
      <span>{formatted}</span>
      {showLabel && <span className="text-xs font-normal text-neutral-500 dark:text-white/70 ml-0.5">Rating</span>}
    </div>
  );
}

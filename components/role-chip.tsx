import React from "react";
import { Role } from "@/lib/types";
import {
  Shield,
  Zap,
  Compass,
  Target,
  Sparkles,
  ArrowLeftRight,
  ArrowRight,
  Repeat,
  Award,
  Volume2,
  Calendar,
  Home,
  Smile,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  Zap,
  Compass,
  Target,
  Sparkles,
  ArrowLeftRight,
  ArrowRight,
  Repeat,
  Award,
  Volume2,
  Calendar,
  Home,
  Smile,
};

interface RoleChipProps {
  role: Role;
  isPrimary?: boolean;
  size?: "sm" | "md";
}

export function RoleChip({ role, isPrimary = false, size = "md" }: RoleChipProps) {
  const IconComponent = role.iconName ? ICON_MAP[role.iconName] || Compass : Compass;

  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium transition-all ${
        isSmall ? "text-xs px-2.5 py-1 rounded-lg" : "text-sm px-3 py-1.5 rounded-xl"
      } ${
        isPrimary
          ? "bg-[#C8F31D] text-[#1C2A00] font-bold shadow-xs border border-lime-400"
          : "bg-neutral-200/80 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-neutral-700"
      }`}
    >
      <IconComponent className={isSmall ? "w-3 h-3 text-current" : "w-3.5 h-3.5 text-current"} />
      <span>{role.label}</span>
      {isPrimary && (
        <span className="text-[10px] uppercase font-extrabold tracking-wider px-1 py-0.2 bg-black/15 text-[#1C2A00] rounded">
          Primary
        </span>
      )}
    </span>
  );
}

import React from "react";
import { Achievement } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Trophy, Award, Milestone, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

interface AchievementItemProps {
  achievement: Achievement;
  onDelete?: (id: string) => void;
  canManage?: boolean;
}

export function AchievementItem({
  achievement,
  onDelete,
  canManage = false,
}: AchievementItemProps) {
  const getIcon = () => {
    switch (achievement.type) {
      case "tournament":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "certification":
        return <Award className="w-5 h-5 text-blue-500" />;
      case "milestone":
        return <Milestone className="w-5 h-5 text-emerald-500" />;
      default:
        return <Trophy className="w-5 h-5 text-lime-500" />;
    }
  };

  const getPlacementColor = (placement?: string | null) => {
    if (!placement) return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    const p = placement.toLowerCase();
    if (p.includes("gold") || p.includes("1st") || p.includes("champion")) {
      return "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300";
    }
    if (p.includes("silver") || p.includes("2nd") || p.includes("runner")) {
      return "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 border-slate-300";
    }
    if (p.includes("bronze") || p.includes("3rd")) {
      return "bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300";
    }
    return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200";
  };

  return (
    <div className="group relative flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs transition-all hover:shadow-md">
      <div className="flex-shrink-0 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
            {achievement.title}
          </h4>
          {achievement.placement && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getPlacementColor(
                achievement.placement
              )}`}
            >
              {achievement.placement}
            </span>
          )}
          {achievement.status === "verified" ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          ) : achievement.status === "endorsed" ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Endorsed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              <Clock className="w-3 h-3" /> Self-Reported
            </span>
          )}
        </div>

        {achievement.eventName && (
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            {achievement.eventName}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {achievement.division && (
            <span>
              Division: <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{achievement.division}</strong>
            </span>
          )}
          {achievement.partnerName && (
            <span>
              Partner: <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{achievement.partnerName}</strong>
            </span>
          )}
          {achievement.eventDate && <span>Date: {formatDate(achievement.eventDate)}</span>}
        </div>
      </div>

      {canManage && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(achievement.id)}
          className="text-xs font-semibold text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
          title="Delete achievement"
        >
          Remove
        </button>
      )}
    </div>
  );
}

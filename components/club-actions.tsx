"use client";

import React, { useState } from "react";
import { Club } from "@/lib/types";
import { joinClub, leaveClub } from "@/lib/services/club-service";
import { ConfettiCelebration } from "@/components/confetti-celebration";
import { UserPlus, Shield } from "lucide-react";

interface ClubActionsProps {
  club: Club;
  initialIsMember?: boolean;
  initialRole?: string;
}

export function ClubActions({
  club,
  initialIsMember = false,
  initialRole,
}: ClubActionsProps) {
  const [isMember, setIsMember] = useState(initialIsMember);
  const [memberRole, setMemberRole] = useState(initialRole || "member");
  const [loading, setLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // Derive demo user
  const match = typeof document !== "undefined" ? document.cookie.match(/paddleup_demo_user=([^;]+)/) : null;
  const currentUsername = match ? decodeURIComponent(match[1]) : "carlosm";
  const profileId = currentUsername === "carlosm" ? "prof_004" : "prof_001";

  const handleToggleMembership = async () => {
    setLoading(true);
    if (isMember) {
      if (memberRole === "owner") {
        alert("The club owner cannot leave the club.");
        setLoading(false);
        return;
      }
      await leaveClub(club.id, profileId);
      setIsMember(false);
    } else {
      await joinClub(club.id, profileId, "member");
      setIsMember(true);
      setMemberRole("member");
      setCelebrate(true);
    }
    setLoading(false);
  };

  return (
    <>
      <ConfettiCelebration trigger={celebrate} onComplete={() => setCelebrate(false)} />
      <div className="flex items-center gap-2.5">
        {isMember ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-lime-500/15 text-lime-700 dark:text-[#C8F31D] text-xs font-bold border border-lime-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span className="capitalize">{memberRole}</span>
            </span>

            {memberRole !== "owner" && (
              <button
                type="button"
                onClick={handleToggleMembership}
                disabled={loading}
                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors"
              >
                Leave Club
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleToggleMembership}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C8F31D] hover:bg-[#b8e214] text-[#1C2A00] font-extrabold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Joining..." : "Join Club Roster"}</span>
          </button>
        )}
      </div>
    </>
  );
}

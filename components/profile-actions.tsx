"use client";

import React, { useState } from "react";
import { PlayerProfile } from "@/lib/types";
import { EndorseModal } from "@/components/endorse-modal";
import { ShareCardModal } from "@/components/share-card-modal";
import { followPlayer, unfollowPlayer } from "@/lib/services/follow-service";
import { UserPlus, UserCheck, Award, Share2, Printer } from "lucide-react";
import Link from "next/link";

interface ProfileActionsProps {
  player: PlayerProfile;
  initialFollowing?: boolean;
}

export function ProfileActions({
  player,
  initialFollowing = false,
}: ProfileActionsProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(player.followersCount || 0);
  const [endorseOpen, setEndorseOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [togglingFollow, setTogglingFollow] = useState(false);

  // Check demo user
  const match = typeof document !== "undefined" ? document.cookie.match(/paddleup_demo_user=([^;]+)/) : null;
  const currentUsername = match ? decodeURIComponent(match[1]) : "carlosm";
  const isOwnProfile = currentUsername.toLowerCase() === player.username.toLowerCase();
  const currentProfileId = player.username === "carlosm" ? "prof_001" : "prof_004";

  const handleFollowToggle = async () => {
    if (isOwnProfile || togglingFollow) return;
    setTogglingFollow(true);

    if (isFollowing) {
      await unfollowPlayer(currentProfileId, player.id);
      setIsFollowing(false);
      setFollowerCount((prev) => Math.max(0, prev - 1));
    } else {
      await followPlayer(currentProfileId, player.id);
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }

    setTogglingFollow(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Follow Button (if not own profile) */}
        {!isOwnProfile && (
          <button
            type="button"
            onClick={handleFollowToggle}
            disabled={togglingFollow}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-xs ${
              isFollowing
                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                : "bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90"
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-lime-500" />
                <span>Following ({followerCount})</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Follow ({followerCount})</span>
              </>
            )}
          </button>
        )}

        {/* Endorse Button */}
        {!isOwnProfile && (
          <button
            type="button"
            onClick={() => setEndorseOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold transition-colors active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Endorse Player</span>
          </button>
        )}

        {/* Share Wallet Pass Button */}
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold transition-colors active:scale-95 shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-lime-600 dark:text-[#C8F31D]" />
          <span>Share Pass</span>
        </button>

        {/* Printable Resume Link */}
        <Link
          href={`/p/${player.username}/resume`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors"
          title="Print official player resume"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Resume</span>
        </Link>
      </div>

      {/* Modals */}
      <EndorseModal
        player={player}
        isOpen={endorseOpen}
        onClose={() => setEndorseOpen(false)}
        onEndorsementAdded={() => {
          // Refresh window or update state
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }}
      />

      <ShareCardModal
        player={player}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}


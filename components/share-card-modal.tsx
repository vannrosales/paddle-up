"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PlayerProfile } from "@/lib/types";
import { SkillBadge } from "@/components/skill-badge";
import { RoleChip } from "@/components/role-chip";
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  QrCode,
  ShieldCheck,
} from "lucide-react";

interface ShareCardModalProps {
  player: PlayerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCardModal({
  player,
  isOpen,
  onClose,
}: ShareCardModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://paddleup.app";
  const profileUrl = `${origin}/p/${player.username}`;
  const ogImageUrl = `${origin}/p/${player.username}/opengraph-image`;
  const primaryRole = player.roles?.find((r) => r.isPrimary);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${player.displayName} | Pickleball Profile on PaddleUp`,
          text: `Check out ${player.displayName}'s verified pickleball rating (${player.skillLevel?.toFixed(1) || "Active"}) and tournament achievements on PaddleUp!`,
          url: profileUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const shareText = encodeURIComponent(
    `Check out ${player.displayName}'s pickleball profile and achievements on PaddleUp! 🏓`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
    profileUrl
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    profileUrl
  )}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(
    profileUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-6 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-lime-600 dark:text-[#C8F31D]" />
          <h3 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Share Player Pass
          </h3>
        </div>

        {/* Wallet Pass Visual Card */}
        <div className="relative rounded-[26px] bg-gradient-to-b from-neutral-900 to-black text-white p-6 shadow-xl border border-neutral-800 mb-5 overflow-hidden">
          {/* Subtle Pickleball Dot Texture */}
          <div className="absolute inset-0 pickle-ball-pattern opacity-15 pointer-events-none" />

          {/* Accent top stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#C8F31D] via-lime-400 to-[#0A84FF]" />

          {/* Pass Top Branding */}
          <div className="flex items-center justify-between mb-5 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#C8F31D] text-[#1C2A00] flex items-center justify-center font-black text-xs">
                P
              </div>
              <span className="font-extrabold text-xs tracking-tight text-white uppercase">
                Paddle<span className="text-[#C8F31D]">Up</span> Pass
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              #{(player.id || "001").slice(-5).toUpperCase()}
            </span>
          </div>

          {/* Pass Player Info */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-neutral-700 flex-shrink-0">
                {player.avatarUrl ? (
                  <Image
                    src={player.avatarUrl}
                    alt={player.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-neutral-400">
                    {player.displayName.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-base tracking-tight text-white">
                    {player.displayName}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-[#34C759]" />
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  @{player.username}
                </p>
                {player.city && (
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                    {player.city}
                  </p>
                )}
              </div>
            </div>

            {/* Skill Ring */}
            <div className="flex-shrink-0">
              <SkillBadge level={player.skillLevel} size="md" />
            </div>
          </div>

          {/* Roles & Pass Details */}
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex flex-wrap gap-1.5">
              {primaryRole && (
                <RoleChip role={primaryRole.role} isPrimary size="sm" />
              )}
            </div>

            {/* Visual QR Code Mockup */}
            <div
              className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shadow-xs"
              title="Scan to view profile"
            >
              <QrCode className="w-8 h-8 text-neutral-950" />
            </div>
          </div>
        </div>

        {/* Copy Link Bar */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
            Passport URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                copied
                  ? "bg-lime-500 text-neutral-950"
                  : "bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-98 transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to Apps (AirDrop, Messages, Stories)</span>
          </button>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-center rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              X / Twitter
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-center rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              Facebook
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-center rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Dynamic OG Link */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center">
          <a
            href={ogImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <span>Preview auto-generated social share image</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}


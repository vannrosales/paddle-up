"use client";

import React, { useState } from "react";
import { PlayerProfile, EndorsementKind } from "@/lib/types";
import { createEndorsement } from "@/lib/services/endorsement-service";
import { ConfettiCelebration } from "@/components/confetti-celebration";
import { Award, Check, AlertCircle, X, ThumbsUp, ShieldCheck } from "lucide-react";

interface EndorseModalProps {
  player: PlayerProfile;
  isOpen: boolean;
  onClose: () => void;
  onEndorsementAdded?: () => void;
}

export function EndorseModal({
  player,
  isOpen,
  onClose,
  onEndorsementAdded,
}: EndorseModalProps) {
  const [kind, setKind] = useState<EndorsementKind>("skill");
  const [targetValue, setTargetValue] = useState<string>(
    player.skillLevel ? `${player.skillLevel.toFixed(1)} Skill Rating & Touch` : "Court Consistency"
  );
  const [note, setNote] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Derive active logged-in user profile id from cookie or fallback to demo Carlos / Maria
  const match = typeof document !== "undefined" ? document.cookie.match(/paddleup_demo_user=([^;]+)/) : null;
  const currentUsername = match ? decodeURIComponent(match[1]) : "carlosm";
  // Carlos (prof_004) or Jun (prof_002) if player is Maria
  const fromProfileId = player.username === "carlosm" ? "prof_001" : "prof_004";

  const handleKindSelect = (selectedKind: EndorsementKind) => {
    setKind(selectedKind);
    if (selectedKind === "skill") {
      setTargetValue(player.skillLevel ? `${player.skillLevel.toFixed(1)} Skill Rating & Control` : "Ball Control & Resets");
    } else if (selectedKind === "role") {
      const primaryRole = player.roles?.find((r) => r.isPrimary)?.role.label || "Tactical Specialist";
      setTargetValue(primaryRole);
    } else if (selectedKind === "sportsmanship") {
      setTargetValue("Fair Line Calling & Great Court Etiquette");
    } else {
      setTargetValue("All-Around Exceptional Player");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Self-endorse check
    if (currentUsername.toLowerCase() === player.username.toLowerCase()) {
      setError("You cannot endorse your own player profile.");
      setSubmitting(false);
      return;
    }

    const res = await createEndorsement({
      fromProfileId,
      toProfileId: player.id,
      kind,
      targetValue,
      note,
    });

    setSubmitting(false);

    if (!res.success) {
      setError(res.error || "Failed to submit endorsement.");
      return;
    }

    setCelebrate(true);
    setSuccess(true);
    onEndorsementAdded?.();

    setTimeout(() => {
      onClose();
      setSuccess(false);
      setCelebrate(false);
    }, 2200);
  };

  return (
    <>
      <ConfettiCelebration trigger={celebrate} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-[28px] p-6 sm:p-8 shadow-2xl">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-lime-500/20 text-lime-600 dark:text-[#C8F31D] flex items-center justify-center mx-auto scale-110 transition-transform">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-neutral-950 dark:text-white">
                Endorsement Recorded!
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto">
                Your peer vouch has been added to {player.displayName}&apos;s profile card and activity feed.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    Endorse {player.displayName}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Vouch for this player&apos;s verified skill, role specialty, or court etiquette.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Kind Picker */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                    What are you endorsing?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "skill" as EndorsementKind, label: "Skill Rating" },
                      { id: "role" as EndorsementKind, label: "Playing Role" },
                      { id: "sportsmanship" as EndorsementKind, label: "Sportsmanship" },
                      { id: "general" as EndorsementKind, label: "All-Court" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleKindSelect(opt.id)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          kind === opt.id
                            ? "bg-[#C8F31D] text-[#1C2A00] border-lime-500 font-bold shadow-xs"
                            : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Value Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Endorsement Focus / Claim
                  </label>
                  <input
                    type="text"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    required
                    placeholder="e.g. 4.0 Soft Dinking, Firefight Reflexes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500 font-medium"
                  />
                </div>

                {/* Personal Note */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Personal Recommendation Note (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Share what makes this player a formidable partner or opponent..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-950 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none font-medium"
                  />
                </div>

                {/* Verification Notice */}
                <div className="flex items-start gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-[#C8F31D] flex-shrink-0 mt-0.5" />
                  <span>
                    Endorsements add verified credibility to player ratings and count toward community badges.
                  </span>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C8F31D] hover:bg-[#b8e214] text-[#1C2A00] font-bold text-xs shadow-xs active:scale-95 transition-all disabled:opacity-50"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{submitting ? "Vouching..." : "Submit Endorsement"}</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}


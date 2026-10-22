"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_ROLES, SKILL_LEVEL_GUIDE } from "@/lib/constants/roles";
import { savePlayerProfile } from "@/lib/services/player-service";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [skillLevel, setSkillLevel] = useState<number>(3.5);
  const [yearsPlaying, setYearsPlaying] = useState<number>(2);
  const [dominantHand, setDominantHand] = useState<"right" | "left" | "ambidextrous">("right");
  const [paddleBrand, setPaddleBrand] = useState("");
  const [homeClub, setHomeClub] = useState("");
  const [primaryRoleId, setPrimaryRoleId] = useState("role_all_court");
  const [secondaryRoleIds, setSecondaryRoleIds] = useState<string[]>([]);

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!displayName.trim()) {
        setError("Please enter your display name");
        return;
      }
      if (!username.trim() || username.length < 3) {
        setError("Username must be at least 3 characters");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinish = async () => {
    setError(null);
    setLoading(true);

    try {
      await savePlayerProfile({
        displayName: displayName.trim(),
        username: username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, ""),
        avatarUrl: avatarUrl.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        skillLevel,
        yearsPlaying,
        dominantHand,
        paddleBrand: paddleBrand.trim() || undefined,
        homeClub: homeClub.trim() || undefined,
        primaryRoleId,
        secondaryRoleIds,
        visibility: "public",
      });

      // Set cookie for local demo session
      document.cookie = `paddleup_demo_user=${encodeURIComponent(username)}; path=/; max-age=604800; SameSite=Lax`;

      router.push(`/dashboard`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to complete onboarding";
      setError(message);
      setLoading(false);
    }
  };

  const toggleSecondaryRole = (roleId: string) => {
    if (roleId === primaryRoleId) return;
    if (secondaryRoleIds.includes(roleId)) {
      setSecondaryRoleIds(secondaryRoleIds.filter((id) => id !== roleId));
    } else {
      if (secondaryRoleIds.length >= 2) return;
      setSecondaryRoleIds([...secondaryRoleIds, roleId]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
      {/* Progress header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-3">
          <span>Step {step} of 3</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
          {step === 1 && "Create Your Player Profile"}
          {step === 2 && "Skill Level & Equipment"}
          {step === 3 && "Declare Your Signature Roles"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {step === 1 && "Start with your public identity and court presence."}
          {step === 2 && "Help other players understand your game level and preferences."}
          {step === 3 && "Select your primary playing style and up to two secondary roles."}
        </p>
      </div>

      {/* Stepper indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step
                ? "w-10 bg-[#C8F31D]"
                : s < step
                ? "w-6 bg-neutral-900 dark:bg-white"
                : "w-6 bg-black/10 dark:bg-white/10"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs text-center font-semibold">
          {error}
        </div>
      )}

      {/* Card Content */}
      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 shadow-lg">
        {/* STEP 1: Basic Profile */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Display Name *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Username (@slug) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-mono">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="marias"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                />
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Your public URL will be /p/{username || "username"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Avatar Photo (Image URL)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Cebu City"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Philippines"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Skill & Gear */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                  Skill Level (2.0 to 5.5+)
                </label>
                <span className="text-sm font-extrabold text-lime-600 dark:text-[#C8F31D]">
                  {skillLevel.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.5"
                step="0.5"
                value={skillLevel}
                onChange={(e) => setSkillLevel(parseFloat(e.target.value))}
                className="w-full accent-lime-500 cursor-pointer"
              />
              <div className="mt-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                <strong className="text-neutral-950 dark:text-white">{SKILL_LEVEL_GUIDE.find((g) => g.level === skillLevel)?.label}</strong>:{" "}
                {SKILL_LEVEL_GUIDE.find((g) => g.level === skillLevel)?.description}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                  Dominant Hand
                </label>
                <select
                  value={dominantHand}
                  onChange={(e) => setDominantHand(e.target.value as "right" | "left" | "ambidextrous")}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                >
                  <option value="right">Right-handed</option>
                  <option value="left">Left-handed</option>
                  <option value="ambidextrous">Ambidextrous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                  Years Playing
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.5"
                  value={yearsPlaying}
                  onChange={(e) => setYearsPlaying(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Current Paddle Choice
              </label>
              <input
                type="text"
                value={paddleBrand}
                onChange={(e) => setPaddleBrand(e.target.value)}
                placeholder="e.g. JOOLA Perseus 16mm / Selkirk Invikta"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Home Court or Club
              </label>
              <input
                type="text"
                value={homeClub}
                onChange={(e) => setHomeClub(e.target.value)}
                placeholder="e.g. Cebu Smash Club / BGC Kitchen Crew"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Roles Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
                1. Select Your Primary Role (Pick 1) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEFAULT_ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setPrimaryRoleId(role.id);
                      setSecondaryRoleIds(secondaryRoleIds.filter((id) => id !== role.id));
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      primaryRoleId === role.id
                        ? "bg-lime-50 dark:bg-lime-950/40 border-lime-500 shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-neutral-900 dark:text-white">{role.label}</span>
                      {primaryRoleId === role.id && (
                        <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-[#C8F31D]" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {role.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-1">
                2. Select Secondary Roles (Optional, max 2)
              </label>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3">
                Selected: {secondaryRoleIds.length} / 2
              </p>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_ROLES.filter((r) => r.id !== primaryRoleId).map((role) => {
                  const isSelected = secondaryRoleIds.includes(role.id);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleSecondaryRole(role.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:text-neutral-950 dark:hover:text-white"
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2 | 3)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs disabled:opacity-50"
            >
              <span>{loading ? "Creating Profile..." : "Complete Setup"}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

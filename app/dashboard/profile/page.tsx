"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { DEFAULT_ROLES } from "@/lib/constants/roles";
import { savePlayerProfile } from "@/lib/services/player-service";
import { ProfileVisibility } from "@/lib/types";
import { ArrowLeft, Save, Eye, EyeOff, Lock } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPlayer, setCurrentPlayer] = useState(MOCK_PLAYERS[0]);

  // Form Fields
  const [displayName, setDisplayName] = useState(MOCK_PLAYERS[0].displayName);
  const [bio, setBio] = useState(MOCK_PLAYERS[0].bio || "");
  const [avatarUrl, setAvatarUrl] = useState(MOCK_PLAYERS[0].avatarUrl || "");
  const [city, setCity] = useState(MOCK_PLAYERS[0].city || "");
  const [country, setCountry] = useState(MOCK_PLAYERS[0].country || "");
  const [skillLevel, setSkillLevel] = useState<number>(MOCK_PLAYERS[0].skillLevel || 3.5);
  const [yearsPlaying, setYearsPlaying] = useState<number>(MOCK_PLAYERS[0].yearsPlaying || 2);
  const [dominantHand, setDominantHand] = useState<"right" | "left" | "ambidextrous">(
    MOCK_PLAYERS[0].dominantHand || "right"
  );
  const [paddleBrand, setPaddleBrand] = useState(MOCK_PLAYERS[0].paddleBrand || "");
  const [homeClub, setHomeClub] = useState(MOCK_PLAYERS[0].homeClub || "");
  const [visibility, setVisibility] = useState<ProfileVisibility>(
    MOCK_PLAYERS[0].visibility
  );

  const [primaryRoleId, setPrimaryRoleId] = useState(
    MOCK_PLAYERS[0].roles?.find((r) => r.isPrimary)?.roleId || "role_all_court"
  );
  const [secondaryRoleIds, setSecondaryRoleIds] = useState<string[]>(
    MOCK_PLAYERS[0].roles?.filter((r) => !r.isPrimary).map((r) => r.roleId) || []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const match = document.cookie.match(/paddleup_demo_user=([^;]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        const found = MOCK_PLAYERS.find(
          (p) =>
            p.username.toLowerCase() === decoded.toLowerCase() ||
            p.userId === decoded ||
            (p.username && decoded.includes(p.username))
        );
        if (found) {
          setCurrentPlayer(found);
          setDisplayName(found.displayName);
          setBio(found.bio || "");
          setAvatarUrl(found.avatarUrl || "");
          setCity(found.city || "");
          setCountry(found.country || "");
          setSkillLevel(found.skillLevel || 3.5);
          setYearsPlaying(found.yearsPlaying || 2);
          setDominantHand(found.dominantHand || "right");
          setPaddleBrand(found.paddleBrand || "");
          setHomeClub(found.homeClub || "");
          setVisibility(found.visibility);
          setPrimaryRoleId(found.roles?.find((r) => r.isPrimary)?.roleId || "role_all_court");
          setSecondaryRoleIds(found.roles?.filter((r) => !r.isPrimary).map((r) => r.roleId) || []);
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSecondary = (roleId: string) => {
    if (roleId === primaryRoleId) return;
    if (secondaryRoleIds.includes(roleId)) {
      setSecondaryRoleIds(secondaryRoleIds.filter((id) => id !== roleId));
    } else {
      if (secondaryRoleIds.length >= 2) return;
      setSecondaryRoleIds([...secondaryRoleIds, roleId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await savePlayerProfile({
        id: currentPlayer.id,
        userId: currentPlayer.userId,
        username: currentPlayer.username,
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        skillLevel,
        yearsPlaying,
        dominantHand,
        paddleBrand: paddleBrand.trim() || undefined,
        homeClub: homeClub.trim() || undefined,
        visibility,
        primaryRoleId,
        secondaryRoleIds,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </Link>
      </div>

      <div className="rounded-[32px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Edit Player Profile
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
            Update your court stats, roles, and privacy visibility.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            Profile updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Privacy Toggle Section */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2">
              Profile Privacy
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  visibility === "public"
                    ? "bg-[#C8F31D] text-[#1C2A00] shadow-xs"
                    : "bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Public</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("unlisted")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  visibility === "unlisted"
                    ? "bg-[#0A84FF] text-white shadow-xs"
                    : "bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Unlisted</span>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  visibility === "private"
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black shadow-xs"
                    : "bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
              {visibility === "public" && "Visible in public directory and search engines."}
              {visibility === "unlisted" && "Hidden from directory, accessible only via direct link."}
              {visibility === "private" && "Only visible to you."}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Bio / Playing Philosophy
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about your style, favorite shots, or goals..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
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
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200">
                Skill Level Rating: {skillLevel.toFixed(1)}
              </label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Paddle Model
              </label>
              <input
                type="text"
                value={paddleBrand}
                onChange={(e) => setPaddleBrand(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1.5">
                Home Club
              </label>
              <input
                type="text"
                value={homeClub}
                onChange={(e) => setHomeClub(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
          </div>

          {/* Roles Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-2">
              Primary Role
            </label>
            <select
              value={primaryRoleId}
              onChange={(e) => {
                setPrimaryRoleId(e.target.value);
                setSecondaryRoleIds(secondaryRoleIds.filter((id) => id !== e.target.value));
              }}
              className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
            >
              {DEFAULT_ROLES.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label} ({role.category.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 mb-1">
              Secondary Roles (Max 2)
            </label>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
              Selected: {secondaryRoleIds.length} / 2
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_ROLES.filter((r) => r.id !== primaryRoleId).map((role) => {
                const isSelected = secondaryRoleIds.includes(role.id);
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleToggleSecondary(role.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent"
                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

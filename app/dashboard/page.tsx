"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayerProfile, Achievement, ActivityItem, Endorsement, Match, MatchStats } from "@/lib/types";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { RoleChip } from "@/components/role-chip";
import { SkillBadge } from "@/components/skill-badge";
import { AchievementItem } from "@/components/achievement-item";
import { BadgeTile } from "@/components/badge-tile";
import { ShareCardModal } from "@/components/share-card-modal";
import { deleteAchievement } from "@/lib/services/achievement-service";
import { getActivityFeed } from "@/lib/services/follow-service";
import { getEndorsementsForPlayer } from "@/lib/services/endorsement-service";
import { evaluateAndAwardBadges } from "@/lib/services/badge-service";
import { getMatchesByProfileId, getMatchStats } from "@/lib/services/match-service";
import { signOutUser } from "@/lib/auth/auth-service";
import { DEFAULT_BADGES } from "@/lib/constants/badges";
import {
  Trophy,
  PlusCircle,
  ExternalLink,
  Edit3,
  LogOut,
  MapPin,
  Sparkles,
  Award,
  Activity,
  Share2,
  Flame,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Printer,
  UserCheck,
} from "lucide-react";

export default function DashboardPage() {
  const [player, setPlayer] = useState<PlayerProfile>(MOCK_PLAYERS[0]);
  const [achievements, setAchievements] = useState<Achievement[]>(
    MOCK_PLAYERS[0].achievements || []
  );
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [feed, setFeed] = useState<ActivityItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchStats, setMatchStats] = useState<MatchStats>({
    totalMatches: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "achievements" | "matches" | "feed" | "endorsements" | "badges"
  >("achievements");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const match = document.cookie.match(/paddleup_demo_user=([^;]+)/);
      let active = MOCK_PLAYERS[0];
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        const found = MOCK_PLAYERS.find(
          (p) =>
            p.username.toLowerCase() === decoded.toLowerCase() ||
            p.userId === decoded ||
            (p.username && decoded.includes(p.username))
        );
        if (found) {
          active = found;
        }
      }

      setPlayer(active);
      setAchievements(active.achievements || []);

      // Load endorsements, badges, activity feed, and matches
      const [endList, actFeed, awardedBadges, matchHistory, stats] = await Promise.all([
        getEndorsementsForPlayer(active.id),
        getActivityFeed(active.id),
        evaluateAndAwardBadges(active),
        getMatchesByProfileId(active.id),
        getMatchStats(active.id),
      ]);

      setEndorsements(endList);
      setFeed(actFeed);
      setMatches(matchHistory);
      setMatchStats(stats);
      active.badges = awardedBadges;
      setPlayer({ ...active, badges: awardedBadges });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Are you sure you want to remove this achievement?")) return;
    await deleteAchievement(id, player.id);
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  const primaryRole = player.roles?.find((r) => r.isPrimary);
  const secondaryRoles = player.roles?.filter((r) => !r.isPrimary) || [];
  const unlockedBadgesMap = new Map((player.badges || []).map((b) => [b.badge.id, b]));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Player Dashboard
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#C8F31D] text-[#1C2A00]">
              Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your public presence, match log, verified skills, and tournament credentials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8F31D] text-[#1C2A00] text-xs font-bold hover:bg-[#b8e214] transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Pass</span>
          </button>

          <Link
            href={`/p/${player.username}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>View Public</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => signOutUser()}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Passport Card
              </span>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                {player.avatarUrl ? (
                  <Image
                    src={player.avatarUrl}
                    alt={player.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xl text-neutral-500">
                    {player.displayName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-neutral-950 dark:text-white">
                  {player.displayName}
                </h3>
                <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400">@{player.username}</p>
                {player.city && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{player.city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Follower Stats Bar */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 dark:border-neutral-800 text-center text-xs">
              <div>
                <span className="block font-black text-sm text-neutral-900 dark:text-white">
                  {player.followersCount || 142}
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  Followers
                </span>
              </div>
              <div>
                <span className="block font-black text-sm text-neutral-900 dark:text-white">
                  {matchStats.winRate}%
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  Win Rate
                </span>
              </div>
              <div>
                <span className="block font-black text-sm text-neutral-900 dark:text-white">
                  {matchStats.currentStreak > 0 ? `+${matchStats.currentStreak}W` : `${matchStats.currentStreak}L`}
                </span>
                <span className="text-[10px] uppercase font-bold text-neutral-400">
                  Streak
                </span>
              </div>
            </div>

            {/* Skill and Roles */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">Skill Rating:</span>
                <SkillBadge level={player.skillLevel} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600 dark:text-neutral-400">Partner Seeking:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  player.lookingForPartner
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                }`}>
                  {player.lookingForPartner ? "Looking to play" : "Not seeking"}
                </span>
              </div>

              <div className="pt-2">
                <span className="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                  Active Roles
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {primaryRole && <RoleChip role={primaryRole.role} isPrimary size="sm" />}
                  {secondaryRoles.map((sr) => (
                    <RoleChip key={sr.roleId} role={sr.role} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Quick Shortcuts
            </h4>
            <div className="grid gap-2">
              <Link
                href="/dashboard/matches/new"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:border-lime-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-lime-600 dark:text-[#C8F31D]" />
                  <span>Log Match Record</span>
                </div>
                <span className="text-lime-700 dark:text-[#C8F31D]">+ Log</span>
              </Link>

              <Link
                href="/partners"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <span>Find Playing Partner</span>
                </div>
                <span className="text-blue-500">Search</span>
              </Link>

              <Link
                href={`/p/${player.username}/resume`}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:border-amber-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-amber-500" />
                  <span>Print Player Resume (PDF)</span>
                </div>
                <span className="text-amber-500">PDF</span>
              </Link>

              <Link
                href="/admin"
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-900 dark:text-white hover:border-red-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>Moderator Console</span>
                </div>
                <span className="text-red-500">Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Management */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-x-auto">
            {[
              { id: "achievements" as const, label: `Medals (${achievements.length})`, icon: Trophy },
              { id: "matches" as const, label: `Match Log (${matches.length})`, icon: Flame },
              { id: "feed" as const, label: "Activity Feed", icon: Activity },
              { id: "endorsements" as const, label: `Endorsements (${endorsements.length})`, icon: Award },
              { id: "badges" as const, label: `Badges (${unlockedBadgesMap.size})`, icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#C8F31D] text-[#1C2A00] shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Achievements */}
          {activeTab === "achievements" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    Logged Achievements
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Tournament podiums, certifications, and career milestones.
                  </p>
                </div>

                <Link
                  href="/dashboard/achievements/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Achievement</span>
                </Link>
              </div>

              {achievements.length > 0 ? (
                <div className="grid gap-3">
                  {achievements.map((ach) => (
                    <AchievementItem
                      key={ach.id}
                      achievement={ach}
                      canManage
                      onDelete={handleDeleteAchievement}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-10 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white mb-1">
                    No achievements recorded yet
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto mb-5 leading-relaxed">
                    Log your first tournament podium medal or coaching certification to showcase on your profile.
                  </p>
                  <Link
                    href="/dashboard/achievements/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Log First Win</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Matches Log (Feature 16) */}
          {activeTab === "matches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                    Match Record &amp; Win Rate
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Casual and competitive matches logged with partners and opponents.
                  </p>
                </div>

                <Link
                  href="/dashboard/matches/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] active:scale-95 transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Log Match</span>
                </Link>
              </div>

              {/* Match Stats Banner */}
              <div className="rounded-2xl bg-neutral-900 text-white p-5 grid grid-cols-4 gap-2 text-center border border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Total</span>
                  <span className="text-lg font-black">{matchStats.totalMatches}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Wins</span>
                  <span className="text-lg font-black text-emerald-400">{matchStats.wins}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Losses</span>
                  <span className="text-lg font-black text-neutral-400">{matchStats.losses}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Win %</span>
                  <span className="text-lg font-black text-[#C8F31D]">{matchStats.winRate}%</span>
                </div>
              </div>

              {/* Match List */}
              {matches.length > 0 ? (
                <div className="grid gap-3">
                  {matches.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase flex-shrink-0 ${
                            m.result === "win"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {m.result === "win" ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-neutral-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px]">
                              {m.matchType}
                            </span>
                            <span className="font-bold text-sm text-neutral-950 dark:text-white">
                              vs {m.opponents}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                            {m.partnerName ? `Partner: ${m.partnerName} · ` : ""}
                            Score: <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{m.score}</span>
                          </p>

                          {m.notes && (
                            <p className="text-xs text-neutral-500 mt-1 italic">
                              &ldquo;{m.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-neutral-400">
                        {m.playedAt}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 text-center text-xs text-neutral-500">
                  No casual matches logged yet. Tap &ldquo;Log Match&rdquo; to start recording wins!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Activity Feed */}
          {activeTab === "feed" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  Pickleball Activity Feed
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Recent achievements, endorsements, and club joins across your network.
                </p>
              </div>

              <div className="grid gap-3">
                {feed.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs flex items-start gap-3.5"
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex-shrink-0">
                      {item.profileAvatar ? (
                        <Image
                          src={item.profileAvatar}
                          alt={item.profileName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-neutral-500">
                          {item.profileName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/p/${item.profileUsername}`}
                          className="font-bold text-xs text-neutral-950 dark:text-white hover:underline"
                        >
                          {item.profileName}
                        </Link>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 mt-0.5">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Endorsements */}
          {activeTab === "endorsements" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  Received Endorsements
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Peer player vouches supporting your declared skill rating and playing roles.
                </p>
              </div>

              {endorsements.length > 0 ? (
                <div className="grid gap-3">
                  {endorsements.map((end) => (
                    <div
                      key={end.id}
                      className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-neutral-950 dark:text-white">
                            {end.fromProfile?.displayName || "Peer Player"}
                          </span>
                          {end.fromProfile?.skillLevel && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-lime-500/15 text-lime-700 dark:text-[#C8F31D]">
                              {end.fromProfile.skillLevel.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {new Date(end.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        Vouched for: <span className="text-lime-700 dark:text-[#C8F31D] font-bold">{end.targetValue}</span>
                      </p>
                      {end.note && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 italic">
                          &ldquo;{end.note}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 text-center text-xs text-neutral-500">
                  No endorsements received yet. Share your profile pass with doubles partners to get vouched!
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Badges */}
          {activeTab === "badges" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
                  Badges &amp; Accolades
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Milestones and community awards earned through tournament play and peer vouches.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {DEFAULT_BADGES.map((badge) => {
                  const unlocked = unlockedBadgesMap.get(badge.id);
                  return (
                    <BadgeTile
                      key={badge.id}
                      badge={badge}
                      isUnlocked={Boolean(unlocked)}
                      awardedAt={unlocked?.awardedAt}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareCardModal
        player={player}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}

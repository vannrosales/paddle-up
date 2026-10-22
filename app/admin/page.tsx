"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getModerationReports,
  resolveReport,
  getPendingAchievements,
  verifyAchievement,
  getAdminPlatformStats,
} from "@/lib/services/admin-service";
import { ModerationReport, Achievement } from "@/lib/types";
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Users,
  Trophy,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [pendingAchs, setPendingAchs] = useState<
    { achievement: Achievement; playerName: string; playerUsername: string }[]
  >([]);
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalClubs: 0,
    totalAchievements: 0,
    pendingReportsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [reps, achs, st] = await Promise.all([
        getModerationReports(),
        getPendingAchievements(),
        getAdminPlatformStats(),
      ]);
      setReports(reps);
      setPendingAchs(achs);
      setStats(st);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleResolve = async (id: string, action: "resolved" | "dismissed") => {
    await resolveReport(id, action);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const handleVerifyAchievement = async (id: string) => {
    await verifyAchievement(id);
    setPendingAchs((prev) => prev.filter((item) => item.achievement.id !== id));
    alert("Achievement verified and green seal awarded to player!");
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-neutral-500">
        Loading admin moderation console...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold mb-2 border border-red-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin &amp; Moderation Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            Moderation &amp; Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Review reported community items, certify tournament results, and inspect platform metrics.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <span>Return to Player Dashboard</span>
        </Link>
      </div>

      {/* Platform Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Registered Players</span>
          </div>
          <span className="text-2xl font-black text-neutral-950 dark:text-white">{stats.totalPlayers}</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Achievements Logged</span>
          </div>
          <span className="text-2xl font-black text-neutral-950 dark:text-white">{stats.totalAchievements}</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Verified Clubs</span>
          </div>
          <span className="text-2xl font-black text-neutral-950 dark:text-white">{stats.totalClubs}</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-400 text-xs mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="font-bold uppercase tracking-wider text-[10px]">Reports Queue</span>
          </div>
          <span className="text-2xl font-black text-red-600 dark:text-red-400">{stats.pendingReportsCount} Pending</span>
        </div>
      </div>

      <div className="space-y-10">
        {/* Section 1: Moderation Reports Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>Community Reports Queue</span>
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {reports.length} total
            </span>
          </div>

          <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
            {reports.map((report) => (
              <div key={report.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {report.targetType}
                    </span>
                    <span className="text-xs font-bold text-neutral-950 dark:text-white">
                      {report.targetTitle || report.targetId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        report.status === "pending"
                          ? "bg-amber-500/15 text-amber-600"
                          : report.status === "resolved"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    &ldquo;{report.reason}&rdquo;
                  </p>

                  <p className="text-[11px] text-neutral-400 font-mono">
                    Reported by {report.reporterName || "Anonymous"} on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {report.status === "pending" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleResolve(report.id, "resolved")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Take Action</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolve(report.id, "dismissed")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Achievement Verification Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Self-Reported Achievements Pending Verification</span>
            </h2>
          </div>

          {pendingAchs.length > 0 ? (
            <div className="rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
              {pendingAchs.map((item) => (
                <div
                  key={item.achievement.id}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-950 dark:text-white">
                        {item.achievement.title}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700">
                        {item.achievement.placement || "Milestone"}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mt-0.5">
                      Player: <Link href={`/p/${item.playerUsername}`} className="font-bold text-blue-500 hover:underline">{item.playerName}</Link> · {item.achievement.eventName || "Event finish"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyAchievement(item.achievement.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8F31D] text-[#1C2A00] font-bold text-xs hover:bg-[#b8e214] transition-all shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify &amp; Award Green Seal</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 p-8 text-center text-xs text-neutral-500">
              All player achievements are up to date and verified!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

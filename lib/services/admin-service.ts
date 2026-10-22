import { ModerationReport, Achievement } from "@/lib/types";
import { MOCK_REPORTS } from "@/lib/data/mock-phase3";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { MOCK_CLUBS } from "@/lib/data/mock-engagement";

const inMemoryReports: ModerationReport[] = [...MOCK_REPORTS];

export async function getModerationReports(): Promise<ModerationReport[]> {
  return inMemoryReports;
}

export async function resolveReport(
  reportId: string,
  newStatus: "resolved" | "dismissed"
): Promise<{ success: boolean }> {
  const report = inMemoryReports.find((r) => r.id === reportId);
  if (report) {
    report.status = newStatus;
  }
  return { success: true };
}

export async function getPendingAchievements(): Promise<{ achievement: Achievement; playerName: string; playerUsername: string }[]> {
  const pending: { achievement: Achievement; playerName: string; playerUsername: string }[] = [];

  for (const player of MOCK_PLAYERS) {
    for (const ach of player.achievements || []) {
      if (ach.status === "self_reported") {
        pending.push({
          achievement: ach,
          playerName: player.displayName,
          playerUsername: player.username,
        });
      }
    }
  }

  return pending;
}

export async function verifyAchievement(
  achievementId: string
): Promise<{ success: boolean }> {
  for (const player of MOCK_PLAYERS) {
    const ach = (player.achievements || []).find((a) => a.id === achievementId);
    if (ach) {
      ach.status = "verified";
      return { success: true };
    }
  }
  return { success: false };
}

export async function getAdminPlatformStats() {
  const totalPlayers = MOCK_PLAYERS.length;
  const totalClubs = MOCK_CLUBS.length;
  const totalAchievements = MOCK_PLAYERS.reduce(
    (acc, p) => acc + (p.achievements?.length || 0),
    0
  );
  const pendingReportsCount = inMemoryReports.filter((r) => r.status === "pending").length;

  return {
    totalPlayers,
    totalClubs,
    totalAchievements,
    pendingReportsCount,
  };
}


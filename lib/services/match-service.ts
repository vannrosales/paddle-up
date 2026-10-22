import { Match, MatchStats, MatchResult, MatchType } from "@/lib/types";
import { MOCK_MATCHES } from "@/lib/data/mock-phase3";
import { createClient } from "@/lib/supabase/client";

const inMemoryMatches: Match[] = [...MOCK_MATCHES];

interface SupabaseMatchRow {
  id: string;
  profile_id: string;
  partner_id?: string | null;
  partner_name?: string | null;
  opponents: string;
  score: string;
  result: MatchResult;
  match_type: MatchType;
  notes?: string | null;
  played_at: string;
  created_at: string;
}

export async function getMatchesByProfileId(profileId: string): Promise<Match[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("profile_id", profileId)
        .order("played_at", { ascending: false });

      if (!error && data) {
        const rows = data as unknown as SupabaseMatchRow[];
        return rows.map((m) => ({
          id: m.id,
          profileId: m.profile_id,
          partnerId: m.partner_id,
          partnerName: m.partner_name,
          opponents: m.opponents,
          score: m.score,
          result: m.result,
          matchType: m.match_type,
          notes: m.notes,
          playedAt: m.played_at,
          createdAt: m.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  return inMemoryMatches
    .filter((m) => m.profileId === profileId)
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
}

export async function getMatchStats(profileId: string): Promise<MatchStats> {
  const matches = await getMatchesByProfileId(profileId);
  const totalMatches = matches.length;
  if (totalMatches === 0) {
    return {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      currentStreak: 0,
    };
  }

  const wins = matches.filter((m) => m.result === "win").length;
  const losses = totalMatches - wins;
  const winRate = Math.round((wins / totalMatches) * 100);

  // Calculate current streak from newest to oldest
  let streak = 0;
  if (matches.length > 0) {
    const firstResult = matches[0].result;
    for (const m of matches) {
      if (m.result === firstResult) {
        streak += firstResult === "win" ? 1 : -1;
      } else {
        break;
      }
    }
  }

  return {
    totalMatches,
    wins,
    losses,
    winRate,
    currentStreak: streak,
  };
}

export interface LogMatchInput {
  profileId: string;
  partnerName?: string;
  opponents: string;
  score: string;
  result: MatchResult;
  matchType?: MatchType;
  notes?: string;
  playedAt?: string;
}

export async function logMatch(input: LogMatchInput): Promise<{ success: boolean; match?: Match; error?: string }> {
  if (!input.opponents.trim()) {
    return { success: false, error: "Opponents are required." };
  }
  if (!input.score.trim()) {
    return { success: false, error: "Match score is required." };
  }

  const newMatch: Match = {
    id: `match_${Date.now()}`,
    profileId: input.profileId,
    partnerName: input.partnerName?.trim() || null,
    opponents: input.opponents.trim(),
    score: input.score.trim(),
    result: input.result,
    matchType: input.matchType || "doubles",
    notes: input.notes?.trim() || null,
    playedAt: input.playedAt || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("matches")
        .insert({
          profile_id: input.profileId,
          partner_name: input.partnerName,
          opponents: input.opponents,
          score: input.score,
          result: input.result,
          match_type: input.matchType || "doubles",
          notes: input.notes,
          played_at: newMatch.playedAt,
        })
        .select()
        .single();

      if (!error && data) {
        newMatch.id = data.id;
      }
    } catch {
      // fallback
    }
  }

  inMemoryMatches.unshift(newMatch);
  return { success: true, match: newMatch };
}


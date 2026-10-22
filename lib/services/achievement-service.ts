import { createClient } from "@/lib/supabase/client";
import { Achievement, AchievementType, AchievementStatus } from "@/lib/types";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";

interface SupabaseAchievementRow {
  id: string;
  profile_id: string;
  title: string;
  type: AchievementType;
  event_name?: string | null;
  event_date?: string | null;
  division?: string | null;
  placement?: string | null;
  partner_name?: string | null;
  proof_url?: string | null;
  status: AchievementStatus;
  created_at: string;
  updated_at?: string;
}

export async function getAchievementsByProfileId(profileId: string): Promise<Achievement[]> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const rows = data as unknown as SupabaseAchievementRow[];
        return rows.map((row) => ({
          id: row.id,
          profileId: row.profile_id,
          title: row.title,
          type: row.type,
          eventName: row.event_name,
          eventDate: row.event_date,
          division: row.division,
          placement: row.placement,
          partnerName: row.partner_name,
          proofUrl: row.proof_url,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch achievements failed, falling back:", e);
    }
  }

  const foundPlayer = MOCK_PLAYERS.find((p) => p.id === profileId);
  return foundPlayer?.achievements || [];
}

export async function createAchievement(
  data: Omit<Achievement, "id" | "createdAt">
): Promise<Achievement> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from("achievements")
        .insert({
          profile_id: data.profileId,
          title: data.title,
          type: data.type,
          event_name: data.eventName,
          event_date: data.eventDate || null,
          division: data.division,
          placement: data.placement,
          partner_name: data.partnerName,
          proof_url: data.proofUrl,
          status: data.status || "self_reported",
        })
        .select()
        .single();

      if (!error && inserted) {
        const row = inserted as unknown as SupabaseAchievementRow;
        return {
          id: row.id,
          profileId: row.profile_id,
          title: row.title,
          type: row.type,
          eventName: row.event_name,
          eventDate: row.event_date,
          division: row.division,
          placement: row.placement,
          partnerName: row.partner_name,
          proofUrl: row.proof_url,
          status: row.status,
          createdAt: row.created_at,
        };
      }
    } catch (e) {
      console.warn("Supabase insert achievement failed, falling back:", e);
    }
  }

  // Local fallback
  const newAchievement: Achievement = {
    ...data,
    id: `ach_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const player = MOCK_PLAYERS.find((p) => p.id === data.profileId);
  if (player) {
    if (!player.achievements) player.achievements = [];
    player.achievements.unshift(newAchievement);
  }

  return newAchievement;
}

export async function deleteAchievement(id: string, profileId?: string): Promise<boolean> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase.from("achievements").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete achievement failed, falling back:", e);
    }
  }

  if (profileId) {
    const player = MOCK_PLAYERS.find((p) => p.id === profileId);
    if (player && player.achievements) {
      player.achievements = player.achievements.filter((a) => a.id !== id);
      return true;
    }
  }

  for (const p of MOCK_PLAYERS) {
    if (p.achievements) {
      const idx = p.achievements.findIndex((a) => a.id === id);
      if (idx !== -1) {
        p.achievements.splice(idx, 1);
        return true;
      }
    }
  }

  return true;
}


import { PlayerProfile, PlayPreference } from "@/lib/types";
import { getPlayers } from "@/lib/services/player-service";
import { createClient } from "@/lib/supabase/client";

export interface PartnerSearchFilters {
  city?: string;
  minSkill?: number;
  maxSkill?: number;
  preference?: PlayPreference;
  roleId?: string;
}

export async function findPartners(filters: PartnerSearchFilters = {}): Promise<PlayerProfile[]> {
  const allPlayers = await getPlayers({
    city: filters.city,
    minSkill: filters.minSkill,
    maxSkill: filters.maxSkill,
    roleId: filters.roleId,
  });

  // Filter only those looking for partner
  let results = allPlayers.filter((p) => p.lookingForPartner);

  if (filters.preference && filters.preference !== "all") {
    results = results.filter(
      (p) => p.playPreference === "all" || p.playPreference === filters.preference
    );
  }

  return results;
}

export async function updatePartnerPreferences(
  profileId: string,
  data: {
    lookingForPartner: boolean;
    playPreference?: PlayPreference;
    preferredPlayTimes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase
        .from("profiles")
        .update({
          looking_for_partner: data.lookingForPartner,
          play_preference: data.playPreference,
          preferred_play_times: data.preferredPlayTimes,
        })
        .eq("id", profileId);
    } catch {
      // fallback
    }
  }

  return { success: true };
}


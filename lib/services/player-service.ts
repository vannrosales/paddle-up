import { createClient } from "@/lib/supabase/client";
import { PlayerProfile, Role, Achievement } from "@/lib/types";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { DEFAULT_ROLES } from "@/lib/constants/roles";
import { getEndorsementsForPlayer } from "@/lib/services/endorsement-service";
import { evaluateAndAwardBadges } from "@/lib/services/badge-service";
import { getFollowerCounts } from "@/lib/services/follow-service";

// In-memory runtime cache for development / mock mode
const localPlayers: PlayerProfile[] = [...MOCK_PLAYERS];

export interface PlayerFilterOptions {
  query?: string;
  city?: string;
  roleId?: string;
  minSkill?: number;
  maxSkill?: number;
  country?: string;
}

interface SupabaseProfileRow {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  bio?: string | null;
  avatar_url?: string | null;
  city?: string | null;
  country?: string | null;
  dominant_hand?: "right" | "left" | "ambidextrous" | null;
  years_playing?: number | null;
  skill_level?: number | null;
  visibility: "public" | "unlisted" | "private";
  paddle_brand?: string | null;
  home_club?: string | null;
  created_at: string;
  profile_roles?: Array<{
    role_id: string;
    is_primary: boolean;
    roles: Role;
  }>;
  achievements?: Achievement[];
}

export async function getPlayers(filters: PlayerFilterOptions = {}): Promise<PlayerProfile[]> {
  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase
        .from("profiles")
        .select(`
          *,
          profile_roles (
            role_id,
            is_primary,
            roles (*)
          ),
          achievements (*)
        `)
        .eq("visibility", "public");

      if (filters.city) {
        query = query.ilike("city", `%${filters.city}%`);
      }
      if (filters.minSkill) {
        query = query.gte("skill_level", filters.minSkill);
      }
      if (filters.maxSkill) {
        query = query.lte("skill_level", filters.maxSkill);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const rows = data as unknown as SupabaseProfileRow[];
        let results: PlayerProfile[] = rows.map((row) => ({
          id: row.id,
          userId: row.user_id,
          username: row.username,
          displayName: row.display_name,
          bio: row.bio,
          avatarUrl: row.avatar_url,
          city: row.city,
          country: row.country,
          dominantHand: row.dominant_hand,
          yearsPlaying: row.years_playing,
          skillLevel: row.skill_level,
          visibility: row.visibility,
          paddleBrand: row.paddle_brand,
          homeClub: row.home_club,
          createdAt: row.created_at,
          roles: row.profile_roles?.map((pr) => ({
            roleId: pr.role_id,
            role: pr.roles,
            isPrimary: pr.is_primary,
          })) || [],
          achievements: row.achievements || [],
        }));

        if (filters.query) {
          const q = filters.query.toLowerCase();
          results = results.filter(
            (p) =>
              p.displayName.toLowerCase().includes(q) ||
              p.username.toLowerCase().includes(q) ||
              (p.city && p.city.toLowerCase().includes(q))
          );
        }

        if (filters.roleId) {
          results = results.filter((p) =>
            p.roles?.some((r) => r.roleId === filters.roleId)
          );
        }

        return results;
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to mock dataset:", e);
    }
  }

  // Fallback to local / mock dataset
  let results = [...localPlayers].filter((p) => p.visibility === "public");

  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.homeClub && p.homeClub.toLowerCase().includes(q))
    );
  }

  if (filters.city) {
    results = results.filter((p) => p.city?.toLowerCase() === filters.city?.toLowerCase());
  }

  if (filters.minSkill !== undefined) {
    results = results.filter((p) => (p.skillLevel ?? 0) >= (filters.minSkill ?? 0));
  }

  if (filters.maxSkill !== undefined) {
    results = results.filter((p) => (p.skillLevel ?? 7.0) <= (filters.maxSkill ?? 7.0));
  }

  if (filters.roleId) {
    results = results.filter((p) =>
      p.roles?.some((r) => r.roleId === filters.roleId)
    );
  }

  return results;
}

export async function getPlayerByUsername(username: string): Promise<PlayerProfile | null> {
  const cleanUsername = username.toLowerCase().trim();
  const supabase = createClient();
  let player: PlayerProfile | null = null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          profile_roles (
            role_id,
            is_primary,
            roles (*)
          ),
          achievements (*)
        `)
        .eq("username", cleanUsername)
        .single();

      if (!error && data) {
        const row = data as unknown as SupabaseProfileRow;
        player = {
          id: row.id,
          userId: row.user_id,
          username: row.username,
          displayName: row.display_name,
          bio: row.bio,
          avatarUrl: row.avatar_url,
          city: row.city,
          country: row.country,
          dominantHand: row.dominant_hand,
          yearsPlaying: row.years_playing,
          skillLevel: row.skill_level,
          visibility: row.visibility,
          paddleBrand: row.paddle_brand,
          homeClub: row.home_club,
          createdAt: row.created_at,
          roles: row.profile_roles?.map((pr) => ({
            roleId: pr.role_id,
            role: pr.roles,
            isPrimary: pr.is_primary,
          })) || [],
          achievements: row.achievements || [],
        };
      }
    } catch (e) {
      console.warn("Supabase fetch failed for username, falling back to mock:", e);
    }
  }

  if (!player) {
    player = localPlayers.find((p) => p.username.toLowerCase() === cleanUsername) || null;
  }

  if (player) {
    // Enrich with dynamic Phase 2 engagement data
    const [endorsements, counts] = await Promise.all([
      getEndorsementsForPlayer(player.id),
      getFollowerCounts(player.id),
    ]);

    player.endorsements = endorsements;
    player.followersCount = counts.followers || player.followersCount || 0;
    player.followingCount = counts.following || player.followingCount || 0;

    // Evaluate badges
    const badges = await evaluateAndAwardBadges(player);
    player.badges = badges;
  }

  return player;
}

export async function savePlayerProfile(
  profileData: Partial<PlayerProfile> & {
    primaryRoleId?: string;
    secondaryRoleIds?: string[];
  }
): Promise<PlayerProfile> {
  const supabase = createClient();

  if (supabase && profileData.userId) {
    try {
      const payload: Record<string, unknown> = {
        username: profileData.username,
        display_name: profileData.displayName,
        bio: profileData.bio,
        avatar_url: profileData.avatarUrl,
        city: profileData.city,
        country: profileData.country,
        dominant_hand: profileData.dominantHand,
        years_playing: profileData.yearsPlaying,
        skill_level: profileData.skillLevel,
        visibility: profileData.visibility ?? "public",
        paddle_brand: profileData.paddleBrand,
        home_club: profileData.homeClub,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert({ user_id: profileData.userId, ...payload })
        .select()
        .single();

      if (!error && data) {
        if (profileData.primaryRoleId) {
          await supabase
            .from("profile_roles")
            .delete()
            .eq("profile_id", data.id);

          const roleInserts = [
            {
              profile_id: data.id,
              role_id: profileData.primaryRoleId,
              is_primary: true,
            },
            ...(profileData.secondaryRoleIds || []).map((rid) => ({
              profile_id: data.id,
              role_id: rid,
              is_primary: false,
            })),
          ];

          await supabase.from("profile_roles").insert(roleInserts);
        }
      }
    } catch (e) {
      console.warn("Supabase upsert failed, updating local state:", e);
    }
  }

  // Update in-memory local state
  const existingIndex = localPlayers.findIndex(
    (p) => p.id === profileData.id || p.username === profileData.username
  );

  const primaryRole = DEFAULT_ROLES.find((r) => r.id === profileData.primaryRoleId);
  const secondaryRoles = (profileData.secondaryRoleIds || [])
    .map((id) => DEFAULT_ROLES.find((r) => r.id === id))
    .filter(Boolean);

  const formattedRoles = [
    ...(primaryRole ? [{ roleId: primaryRole.id, role: primaryRole, isPrimary: true }] : []),
    ...secondaryRoles.map((r) => ({ roleId: r!.id, role: r!, isPrimary: false })),
  ];

  if (existingIndex >= 0) {
    localPlayers[existingIndex] = {
      ...localPlayers[existingIndex],
      ...profileData,
      roles: formattedRoles.length ? formattedRoles : localPlayers[existingIndex].roles,
      updatedAt: new Date().toISOString(),
    } as PlayerProfile;
    return localPlayers[existingIndex];
  } else {
    const newProfile: PlayerProfile = {
      id: profileData.id || `prof_${Date.now()}`,
      userId: profileData.userId || `usr_${Date.now()}`,
      username: profileData.username || "player",
      displayName: profileData.displayName || "New Player",
      bio: profileData.bio || "",
      avatarUrl: profileData.avatarUrl || "",
      city: profileData.city || "",
      country: profileData.country || "",
      dominantHand: profileData.dominantHand || "right",
      yearsPlaying: profileData.yearsPlaying || 1,
      skillLevel: profileData.skillLevel || 3.0,
      visibility: profileData.visibility || "public",
      paddleBrand: profileData.paddleBrand || "",
      homeClub: profileData.homeClub || "",
      roles: formattedRoles,
      achievements: [],
      createdAt: new Date().toISOString(),
    };
    localPlayers.unshift(newProfile);
    return newProfile;
  }
}

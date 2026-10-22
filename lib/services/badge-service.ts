import { Badge, ProfileBadge, PlayerProfile } from "@/lib/types";
import { DEFAULT_BADGES } from "@/lib/constants/badges";
import { createClient } from "@/lib/supabase/client";

// Fallback in-memory badge records
const inMemoryProfileBadges = new Map<string, ProfileBadge[]>();

interface SupabaseBadgeRow {
  badge_id: string;
  awarded_at: string;
  badges: {
    id: string;
    key: string;
    label: string;
    description: string;
    icon: string;
    category?: string;
  };
}

export async function getAllBadges(): Promise<Badge[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("badges").select("*");
      if (!error && data && data.length > 0) {
        return data.map((b) => ({
          id: b.id,
          key: b.key,
          label: b.label,
          description: b.description,
          icon: b.icon,
          category: b.category,
        }));
      }
    } catch {
      // fallback
    }
  }
  return DEFAULT_BADGES;
}

export async function getPlayerBadges(profileId: string): Promise<ProfileBadge[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profile_badges")
        .select("badge_id, awarded_at, badges(*)")
        .eq("profile_id", profileId);

      if (!error && data && data.length > 0) {
        const rows = data as unknown as SupabaseBadgeRow[];
        return rows.map((item) => ({
          badgeId: item.badge_id,
          awardedAt: item.awarded_at,
          badge: {
            id: item.badges.id,
            key: item.badges.key,
            label: item.badges.label,
            description: item.badges.description,
            icon: item.badges.icon,
            category: item.badges.category,
          },
        }));
      }
    } catch {
      // fallback
    }
  }

  // Return in-memory or empty
  return inMemoryProfileBadges.get(profileId) || [];
}

/**
 * Checks rules and auto-awards eligible badges for a profile
 */
export async function evaluateAndAwardBadges(
  profile: PlayerProfile
): Promise<ProfileBadge[]> {
  const currentBadges = profile.badges || [];
  const currentKeys = new Set(currentBadges.map((b) => b.badge.key));
  const newBadges: ProfileBadge[] = [...currentBadges];

  const award = (badgeKey: string) => {
    if (currentKeys.has(badgeKey)) return;
    const badgeDef = DEFAULT_BADGES.find((b) => b.key === badgeKey);
    if (!badgeDef) return;

    const awarded: ProfileBadge = {
      badgeId: badgeDef.id,
      badge: badgeDef,
      awardedAt: new Date().toISOString(),
    };
    newBadges.push(awarded);
    currentKeys.add(badgeKey);
  };

  // Rule 1: Tournament podium finish (Gold, Silver, or Bronze)
  const hasPodium = profile.achievements?.some((a) =>
    ["gold", "silver", "bronze", "champion", "runner-up"].some((p) =>
      a.placement?.toLowerCase().includes(p)
    )
  );
  if (hasPodium) award("podium_finisher");

  // Rule 2: Club Regular
  if (profile.homeClub && profile.homeClub.trim().length > 0) {
    award("club_regular");
  }

  // Rule 3: Peer Endorsed (3+ endorsements)
  if ((profile.endorsements?.length || 0) >= 3) {
    award("endorsed_player");
  }

  // Rule 4: Century Club (100 matches milestone or 3+ years playing)
  const has100Matches = profile.achievements?.some(
    (a) =>
      a.type === "milestone" &&
      (a.title.includes("100") || (a.placement && a.placement.includes("100")))
  );
  if (has100Matches || (profile.yearsPlaying && profile.yearsPlaying >= 4)) {
    award("century_club");
  }

  // Rule 5: Certified Instructor
  const hasCert = profile.achievements?.some((a) => a.type === "certification");
  if (hasCert) award("coach_certified");

  // Rule 6: Kitchen Master (Dinker role or 4.0+ rating)
  const isDinker = profile.roles?.some((r) => r.role.key === "dinker");
  if (isDinker && (profile.skillLevel || 0) >= 4.0) {
    award("kitchen_master");
  }

  // Rule 7: Founding Member
  if (profile.username === "marias" || profile.username === "junr") {
    award("founding_member");
  }

  inMemoryProfileBadges.set(profile.id, newBadges);
  return newBadges;
}


import { Club, ClubMember, ClubRole } from "@/lib/types";
import { MOCK_CLUBS } from "@/lib/data/mock-engagement";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { createClient } from "@/lib/supabase/client";

// In-memory clubs store
const inMemoryClubs: Club[] = [...MOCK_CLUBS];

// In-memory club membership store
const inMemoryMembers: ClubMember[] = [
  { clubId: "club_001", profileId: "prof_001", role: "owner", joinedAt: "2023-11-15T08:00:00Z" },
  { clubId: "club_001", profileId: "prof_002", role: "member", joinedAt: "2024-01-10T09:00:00Z" },
  { clubId: "club_001", profileId: "prof_004", role: "member", joinedAt: "2024-02-12T10:00:00Z" },
  { clubId: "club_002", profileId: "prof_002", role: "owner", joinedAt: "2023-09-10T09:00:00Z" },
  { clubId: "club_002", profileId: "prof_001", role: "member", joinedAt: "2023-10-01T10:00:00Z" },
  { clubId: "club_003", profileId: "prof_003", role: "owner", joinedAt: "2023-06-20T10:00:00Z" },
  { clubId: "club_004", profileId: "prof_004", role: "owner", joinedAt: "2024-01-05T12:00:00Z" },
];

interface SupabaseClubRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  country?: string;
  description?: string;
  owner_id: string;
  logo_url?: string;
  banner_url?: string;
  member_count?: number;
  created_at: string;
  updated_at?: string;
}

export async function getAllClubs(query?: string, city?: string): Promise<Club[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      let q = supabase.from("clubs").select("*").order("created_at", { ascending: false });

      if (city && city !== "all") {
        q = q.ilike("city", `%${city}%`);
      }
      if (query) {
        q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        const rows = data as unknown as SupabaseClubRow[];
        return rows.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          city: c.city,
          country: c.country,
          description: c.description,
          ownerId: c.owner_id,
          logoUrl: c.logo_url,
          bannerUrl: c.banner_url,
          memberCount: c.member_count || 1,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  let filtered = [...inMemoryClubs];
  if (city && city !== "all") {
    filtered = filtered.filter((c) => c.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(qLower) ||
        (c.description && c.description.toLowerCase().includes(qLower)) ||
        c.city.toLowerCase().includes(qLower)
    );
  }
  return filtered;
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const club = inMemoryClubs.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  if (!club) return null;

  // Hydrate members
  const members = inMemoryMembers
    .filter((m) => m.clubId === club.id)
    .map((m) => {
      const player = MOCK_PLAYERS.find((p) => p.id === m.profileId);
      return {
        ...m,
        profile: player,
      };
    });

  return {
    ...club,
    memberCount: members.length || club.memberCount,
    members,
  };
}

export interface CreateClubInput {
  name: string;
  city: string;
  country?: string;
  description?: string;
  ownerId: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export async function createClub(
  input: CreateClubInput
): Promise<{ success: boolean; club?: Club; error?: string }> {
  if (!input.name.trim()) {
    return { success: false, error: "Club name is required." };
  }

  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = inMemoryClubs.find((c) => c.slug === slug);
  if (existing) {
    return { success: false, error: "A club with a similar name already exists." };
  }

  const newClub: Club = {
    id: `club_${Date.now()}`,
    name: input.name.trim(),
    slug,
    city: input.city.trim(),
    country: input.country?.trim() || "Philippines",
    description: input.description?.trim() || null,
    ownerId: input.ownerId,
    logoUrl: input.logoUrl || "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=300&auto=format&fit=crop&q=80",
    bannerUrl: input.bannerUrl || "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=1200&auto=format&fit=crop&q=80",
    memberCount: 1,
    createdAt: new Date().toISOString(),
  };

  inMemoryClubs.unshift(newClub);
  inMemoryMembers.push({
    clubId: newClub.id,
    profileId: input.ownerId,
    role: "owner",
    joinedAt: new Date().toISOString(),
  });

  return { success: true, club: newClub };
}

export async function joinClub(
  clubId: string,
  profileId: string,
  role: ClubRole = "member"
): Promise<{ success: boolean; error?: string }> {
  const existing = inMemoryMembers.find((m) => m.clubId === clubId && m.profileId === profileId);
  if (existing) {
    return { success: false, error: "You are already a member of this club." };
  }

  inMemoryMembers.push({
    clubId,
    profileId,
    role,
    joinedAt: new Date().toISOString(),
  });

  const club = inMemoryClubs.find((c) => c.id === clubId);
  if (club) {
    club.memberCount += 1;
  }

  return { success: true };
}

export async function leaveClub(
  clubId: string,
  profileId: string
): Promise<{ success: boolean; error?: string }> {
  const index = inMemoryMembers.findIndex((m) => m.clubId === clubId && m.profileId === profileId);
  if (index === -1) {
    return { success: false, error: "You are not a member of this club." };
  }

  inMemoryMembers.splice(index, 1);
  const club = inMemoryClubs.find((c) => c.id === clubId);
  if (club && club.memberCount > 1) {
    club.memberCount -= 1;
  }

  return { success: true };
}


import { Tournament, TournamentResultEntry } from "@/lib/types";
import { MOCK_TOURNAMENTS } from "@/lib/data/mock-phase3";
import { createClient } from "@/lib/supabase/client";

const inMemoryTournaments: Tournament[] = [...MOCK_TOURNAMENTS];

interface SupabaseTournamentRow {
  id: string;
  name: string;
  slug: string;
  city: string;
  country?: string;
  start_date: string;
  end_date?: string | null;
  division: string;
  status: "upcoming" | "in_progress" | "completed";
  organizer_id: string;
  results: TournamentResultEntry[];
  banner_url?: string | null;
  created_at: string;
}

export async function getAllTournaments(query?: string, city?: string): Promise<Tournament[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      let q = supabase.from("tournaments").select("*").order("start_date", { ascending: false });

      if (city && city !== "all") {
        q = q.ilike("city", `%${city}%`);
      }
      if (query) {
        q = q.or(`name.ilike.%${query}%,division.ilike.%${query}%`);
      }

      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        const rows = data as unknown as SupabaseTournamentRow[];
        return rows.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          city: t.city,
          country: t.country,
          startDate: t.start_date,
          endDate: t.end_date,
          division: t.division,
          status: t.status,
          organizerId: t.organizer_id,
          results: t.results || [],
          bannerUrl: t.banner_url,
          createdAt: t.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }

  let filtered = [...inMemoryTournaments];
  if (city && city !== "all") {
    filtered = filtered.filter((t) => t.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (query) {
    const qLower = query.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(qLower) ||
        t.division.toLowerCase().includes(qLower) ||
        t.city.toLowerCase().includes(qLower)
    );
  }
  return filtered;
}

export async function getTournamentBySlug(slug: string): Promise<Tournament | null> {
  const found = inMemoryTournaments.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

export interface CreateTournamentInput {
  name: string;
  city: string;
  country?: string;
  startDate: string;
  endDate?: string;
  division: string;
  organizerId: string;
  organizerName?: string;
  description?: string;
  bannerUrl?: string;
}

export async function createTournament(
  input: CreateTournamentInput
): Promise<{ success: boolean; tournament?: Tournament; error?: string }> {
  if (!input.name.trim()) {
    return { success: false, error: "Tournament name is required." };
  }

  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const newTourn: Tournament = {
    id: `tourn_${Date.now()}`,
    name: input.name.trim(),
    slug,
    city: input.city.trim(),
    country: input.country?.trim() || "Philippines",
    startDate: input.startDate,
    endDate: input.endDate || null,
    division: input.division.trim(),
    status: "upcoming",
    organizerId: input.organizerId,
    organizerName: input.organizerName || "Tournament Director",
    description: input.description?.trim() || null,
    bannerUrl: input.bannerUrl || "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80",
    results: [],
    createdAt: new Date().toISOString(),
  };

  inMemoryTournaments.unshift(newTourn);
  return { success: true, tournament: newTourn };
}

export async function publishTournamentResult(
  slug: string,
  entry: TournamentResultEntry
): Promise<{ success: boolean; error?: string }> {
  const tourn = inMemoryTournaments.find((t) => t.slug.toLowerCase() === slug.toLowerCase());
  if (!tourn) {
    return { success: false, error: "Tournament not found." };
  }

  tourn.results.push(entry);
  tourn.status = "completed";
  return { success: true };
}


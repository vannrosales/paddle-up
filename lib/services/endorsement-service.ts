import { Endorsement, EndorsementKind } from "@/lib/types";
import { MOCK_ENDORSEMENTS } from "@/lib/data/mock-engagement";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { createClient } from "@/lib/supabase/client";
import { sendEmailNotification } from "@/lib/services/notification-service";

// In-memory store for endorsements in demo / fallback mode
const inMemoryEndorsements: Endorsement[] = [...MOCK_ENDORSEMENTS];

interface SupabaseEndorsementRow {
  id: string;
  from_profile_id: string;
  to_profile_id: string;
  kind: EndorsementKind;
  target_value?: string | null;
  note?: string | null;
  created_at: string;
  from_profile?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string | null;
    skill_level?: number | null;
  } | null;
}

export async function getEndorsementsForPlayer(toProfileId: string): Promise<Endorsement[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("endorsements")
        .select(`
          id,
          from_profile_id,
          to_profile_id,
          kind,
          target_value,
          note,
          created_at,
          from_profile:profiles!from_profile_id(id, username, display_name, avatar_url, skill_level)
        `)
        .eq("to_profile_id", toProfileId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const rows = data as unknown as SupabaseEndorsementRow[];
        return rows.map((d) => ({
          id: d.id,
          fromProfileId: d.from_profile_id,
          toProfileId: d.to_profile_id,
          kind: d.kind,
          targetValue: d.target_value,
          note: d.note,
          createdAt: d.created_at,
          fromProfile: d.from_profile
            ? {
                id: d.from_profile.id,
                username: d.from_profile.username,
                displayName: d.from_profile.display_name,
                avatarUrl: d.from_profile.avatar_url,
                skillLevel: d.from_profile.skill_level,
              }
            : undefined,
        }));
      }
    } catch {
      // fallback
    }
  }

  return inMemoryEndorsements
    .filter((e) => e.toProfileId === toProfileId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface CreateEndorsementInput {
  fromProfileId: string;
  toProfileId: string;
  kind: EndorsementKind;
  targetValue?: string;
  note?: string;
}

export async function createEndorsement(
  input: CreateEndorsementInput
): Promise<{ success: boolean; endorsement?: Endorsement; error?: string }> {
  // Validation: cannot endorse self
  if (input.fromProfileId === input.toProfileId) {
    return { success: false, error: "You cannot endorse your own profile." };
  }

  // Prevent duplicate endorsements of the same kind from the same person
  const existing = inMemoryEndorsements.find(
    (e) =>
      e.fromProfileId === input.fromProfileId &&
      e.toProfileId === input.toProfileId &&
      e.kind === input.kind
  );
  if (existing) {
    return {
      success: false,
      error: `You have already given an endorsement of type '${input.kind}' to this player.`,
    };
  }

  const fromPlayer = MOCK_PLAYERS.find((p) => p.id === input.fromProfileId);
  const toPlayer = MOCK_PLAYERS.find((p) => p.id === input.toProfileId);

  const newEndorsement: Endorsement = {
    id: `end_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    fromProfileId: input.fromProfileId,
    toProfileId: input.toProfileId,
    kind: input.kind,
    targetValue: input.targetValue || "Skill & Sportsmanship",
    note: input.note?.trim() || null,
    createdAt: new Date().toISOString(),
    fromProfile: fromPlayer
      ? {
          id: fromPlayer.id,
          username: fromPlayer.username,
          displayName: fromPlayer.displayName,
          avatarUrl: fromPlayer.avatarUrl,
          skillLevel: fromPlayer.skillLevel,
        }
      : undefined,
  };

  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("endorsements")
        .insert({
          from_profile_id: input.fromProfileId,
          to_profile_id: input.toProfileId,
          kind: input.kind,
          target_value: input.targetValue,
          note: input.note,
        })
        .select()
        .single();

      if (!error && data) {
        newEndorsement.id = data.id;
      }
    } catch {
      // fallback
    }
  }

  inMemoryEndorsements.unshift(newEndorsement);

  // Trigger email notification stub
  if (toPlayer && fromPlayer) {
    await sendEmailNotification({
      recipientName: toPlayer.displayName,
      senderName: fromPlayer.displayName,
      type: "endorsement",
      detail: input.note || input.targetValue,
    });
  }

  return { success: true, endorsement: newEndorsement };
}


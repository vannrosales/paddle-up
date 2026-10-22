import { Badge } from "@/lib/types";

export const DEFAULT_BADGES: Badge[] = [
  {
    id: "badge_podium",
    key: "podium_finisher",
    label: "Podium Finisher",
    description: "Won gold, silver, or bronze medal in a tournament",
    icon: "Medal",
    category: "tournament",
  },
  {
    id: "badge_club_reg",
    key: "club_regular",
    label: "Club Regular",
    description: "Active roster member of a verified pickleball club",
    icon: "Users",
    category: "community",
  },
  {
    id: "badge_endorsed",
    key: "endorsed_player",
    label: "Peer Endorsed",
    description: "Vouched for by fellow players for skill & sportsmanship",
    icon: "Award",
    category: "social",
  },
  {
    id: "badge_century",
    key: "century_club",
    label: "Century Club",
    description: "Logged 100+ lifetime career pickleball games or matches",
    icon: "Zap",
    category: "milestone",
  },
  {
    id: "badge_certified",
    key: "coach_certified",
    label: "Certified Instructor",
    description: "Holds accredited coaching credentials (IPTPA or PPR)",
    icon: "ShieldCheck",
    category: "certification",
  },
  {
    id: "badge_kitchen",
    key: "kitchen_master",
    label: "Kitchen Master",
    description: "Praised for premier soft-game dinking and resets",
    icon: "Flame",
    category: "skill",
  },
  {
    id: "badge_founding",
    key: "founding_member",
    label: "Founding Member",
    description: "Early adopter and pioneer of the PaddleUp community",
    icon: "Sparkles",
    category: "special",
  },
];


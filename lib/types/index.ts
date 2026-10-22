export type DominantHand = "right" | "left" | "ambidextrous";

export type ProfileVisibility = "public" | "unlisted" | "private";

export type RoleCategory = "playing_style" | "court_position" | "off_court";

export interface Role {
  id: string;
  key: string;
  label: string;
  category: RoleCategory;
  description?: string;
  iconName?: string;
}

export interface ProfileRole {
  roleId: string;
  role: Role;
  isPrimary: boolean;
}

export type AchievementType = "tournament" | "milestone" | "certification" | "award";

export type AchievementStatus = "self_reported" | "endorsed" | "verified";

export interface Achievement {
  id: string;
  profileId: string;
  title: string;
  type: AchievementType;
  eventName?: string | null;
  eventDate?: string | null;
  division?: string | null;
  placement?: string | null;
  partnerName?: string | null;
  proofUrl?: string | null;
  status: AchievementStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  city?: string | null;
  country?: string | null;
  dominantHand?: DominantHand | null;
  yearsPlaying?: number | null;
  skillLevel?: number | null;
  visibility: ProfileVisibility;
  homeClub?: string | null;
  paddleBrand?: string | null;
  roles?: ProfileRole[];
  achievements?: Achievement[];
  createdAt: string;
  updatedAt?: string;
}

export type AccessRole =
  | "guest"
  | "player"
  | "verified"
  | "club_manager"
  | "organizer"
  | "moderator"
  | "admin";

export interface UserRoleRecord {
  userId: string;
  role: AccessRole;
  grantedBy?: string | null;
  grantedAt: string;
}


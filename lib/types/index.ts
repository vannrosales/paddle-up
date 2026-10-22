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

export interface Badge {
  id: string;
  key: string;
  label: string;
  description: string;
  icon: string;
  category?: string;
  createdAt?: string;
}

export interface ProfileBadge {
  badgeId: string;
  badge: Badge;
  awardedAt: string;
}

export type EndorsementKind = "skill" | "role" | "sportsmanship" | "general";

export interface Endorsement {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  kind: EndorsementKind;
  targetValue?: string | null;
  note?: string | null;
  createdAt: string;
  fromProfile?: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    skillLevel?: number | null;
  };
}

export type ClubRole = "owner" | "manager" | "member";

export interface ClubMember {
  clubId: string;
  profileId: string;
  role: ClubRole;
  joinedAt: string;
  profile?: PlayerProfile;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  city: string;
  country?: string;
  description?: string | null;
  ownerId: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  memberCount: number;
  members?: ClubMember[];
  createdAt: string;
  updatedAt?: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export type ActivityType = "achievement" | "endorsement" | "badge" | "club_join";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  profileId: string;
  profileName: string;
  profileUsername: string;
  profileAvatar?: string | null;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
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
  badges?: ProfileBadge[];
  endorsements?: Endorsement[];
  followersCount?: number;
  followingCount?: number;
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

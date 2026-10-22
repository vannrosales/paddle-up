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

export type ActivityType = "achievement" | "endorsement" | "badge" | "club_join" | "match_logged";

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

export type PlayPreference = "casual" | "competitive" | "drills" | "all";

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
  // Phase 3 Partner Finder
  lookingForPartner?: boolean;
  preferredPlayTimes?: string | null;
  playPreference?: PlayPreference | null;
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

// Phase 3: Match Logs (Feature 16)
export type MatchResult = "win" | "loss";
export type MatchType = "singles" | "doubles" | "mixed";

export interface Match {
  id: string;
  profileId: string;
  partnerId?: string | null;
  partnerName?: string | null;
  opponents: string;
  score: string;
  result: MatchResult;
  matchType: MatchType;
  notes?: string | null;
  playedAt: string;
  createdAt: string;
}

export interface MatchStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number; // percentage, e.g. 72.5
  currentStreak: number; // positive for win streak, negative for loss streak
}

// Phase 3: Tournament Pages (Feature 18)
export type TournamentStatus = "upcoming" | "in_progress" | "completed";

export interface TournamentResultEntry {
  placement: "Gold" | "Silver" | "Bronze" | "Participant" | string;
  division: string;
  playerName: string;
  playerUsername?: string;
  partnerName?: string;
  partnerUsername?: string;
}

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  city: string;
  country?: string;
  startDate: string;
  endDate?: string | null;
  division: string;
  status: TournamentStatus;
  organizerId: string;
  organizerName?: string;
  bannerUrl?: string | null;
  description?: string | null;
  results: TournamentResultEntry[];
  createdAt: string;
}

// Phase 3: Moderation & Reports (Feature 23)
export type ReportTargetType = "profile" | "achievement" | "match";
export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle?: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

// Phase 3: Multi-language (Feature 22)
export type SupportedLanguage = "en" | "fil" | "zh";

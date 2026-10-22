import { Role } from "@/lib/types";

export const DEFAULT_ROLES: Role[] = [
  // Playing style
  {
    id: "role_dinker",
    key: "dinker",
    label: "Dinker / Soft-Game Specialist",
    category: "playing_style",
    description: "Masters the non-volley zone, patient reset dinks, and unforced error forcing.",
    iconName: "Shield",
  },
  {
    id: "role_power_hitter",
    key: "power_hitter",
    label: "Power Hitter (Banger)",
    category: "playing_style",
    description: "Aggressive pace, driving third shots, quick hands at the kitchen line.",
    iconName: "Zap",
  },
  {
    id: "role_all_court",
    key: "all_court",
    label: "All-Court Player",
    category: "playing_style",
    description: "Fluidly balances power drives, resets, drops, and speed-ups based on match flow.",
    iconName: "Compass",
  },
  {
    id: "role_drop_specialist",
    key: "drop_specialist",
    label: "Third-Shot-Drop Specialist",
    category: "playing_style",
    description: "Consistently transitions from baseline to kitchen with textbook soft drops.",
    iconName: "Target",
  },
  {
    id: "role_defensive",
    key: "defensive",
    label: "Lob & Defensive Specialist",
    category: "playing_style",
    description: "Exceptional court coverage, resets slams, neutralizes aggressive attacks.",
    iconName: "Sparkles",
  },

  // Court position
  {
    id: "role_left_side",
    key: "left_side",
    label: "Left-Side Player",
    category: "court_position",
    description: "Covers the middle with forehand dominance in standard right-handed pairs.",
    iconName: "ArrowLeftRight",
  },
  {
    id: "role_right_side",
    key: "right_side",
    label: "Right-Side Player",
    category: "court_position",
    description: "Steady setup, cross-court dinking, and rock-solid defense.",
    iconName: "ArrowRight",
  },
  {
    id: "role_flexible_side",
    key: "flexible_side",
    label: "Flexible (Either Side)",
    category: "court_position",
    description: "Equally comfortable playing from deuce or ad side.",
    iconName: "Repeat",
  },

  // Off-court
  {
    id: "role_coach",
    key: "coach",
    label: "Coach / Instructor",
    category: "off_court",
    description: "Provides clinics, private lessons, and mechanical diagnostics.",
    iconName: "Award",
  },
  {
    id: "role_referee",
    key: "referee",
    label: "Referee / Official",
    category: "off_court",
    description: "Certified rules official, scorekeeper, and line caller.",
    iconName: "Volume2",
  },
  {
    id: "role_organizer",
    key: "organizer",
    label: "Tournament Organizer",
    category: "off_court",
    description: "Runs round robins, brackets, scrambles, and club leagues.",
    iconName: "Calendar",
  },
  {
    id: "role_club_manager",
    key: "club_manager",
    label: "Club / Court Manager",
    category: "off_court",
    description: "Oversees court scheduling, open play queues, and memberships.",
    iconName: "Home",
  },
  {
    id: "role_social",
    key: "social",
    label: "Casual / Social Player",
    category: "off_court",
    description: "Plays for fitness, camaraderie, and weekend community fun.",
    iconName: "Smile",
  },
];

export const SKILL_LEVEL_GUIDE = [
  { level: 2.0, label: "Beginner", description: "Learning court positioning, rules, and fundamental contact." },
  { level: 2.5, label: "Novice", description: "Sustains short rallies, knows scoring and kitchen rules." },
  { level: 3.0, label: "Intermediate", description: "Good control over medium-paced shots, developing third-shot drop." },
  { level: 3.5, label: "Advanced Intermediate", description: "Anticipates ball trajectory, directional control, consistent dinking." },
  { level: 4.0, label: "Advanced", description: "High consistency, limits unforced errors, executes speed-ups strategically." },
  { level: 4.5, label: "Expert", description: "Mastery of soft game and power transition, elite court awareness." },
  { level: 5.0, label: "Master / Semi-Pro", description: "Tournament-tested elite player with near-flawless mechanics." },
  { level: 5.5, label: "Pro / Touring", description: "National/international competitive professional standard." },
];


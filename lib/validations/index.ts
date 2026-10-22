import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be 24 characters or less")
    .regex(/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or less"),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional().or(z.literal("")),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  city: z.string().max(60, "City must be 60 characters or less").optional().or(z.literal("")),
  country: z.string().max(60, "Country must be 60 characters or less").optional().or(z.literal("")),
  dominantHand: z.enum(["right", "left", "ambidextrous"]).optional(),
  yearsPlaying: z.coerce.number().min(0, "Years playing cannot be negative").max(60, "Enter valid years").optional(),
  skillLevel: z.coerce.number().min(2.0, "Skill level starts at 2.0").max(7.0, "Skill level capped at 7.0").optional(),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  paddleBrand: z.string().max(60).optional().or(z.literal("")),
  homeClub: z.string().max(80).optional().or(z.literal("")),
  primaryRoleId: z.string().min(1, "Please select a primary role"),
  secondaryRoleIds: z.array(z.string()).max(2, "You can select at most 2 secondary roles").default([]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const achievementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or less"),
  type: z.enum(["tournament", "milestone", "certification", "award"]),
  eventName: z.string().max(100).optional().or(z.literal("")),
  eventDate: z.string().optional().or(z.literal("")),
  division: z.string().max(60).optional().or(z.literal("")),
  placement: z.string().max(50).optional().or(z.literal("")),
  partnerName: z.string().max(60).optional().or(z.literal("")),
  proofUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;


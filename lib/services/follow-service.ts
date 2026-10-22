import { Follow, ActivityItem } from "@/lib/types";
import { MOCK_FOLLOWS, MOCK_ACTIVITY_FEED } from "@/lib/data/mock-engagement";
import { MOCK_PLAYERS } from "@/lib/data/mock-players";
import { sendEmailNotification } from "@/lib/services/notification-service";

// In-memory follow store
const inMemoryFollows: Follow[] = [...MOCK_FOLLOWS];
const inMemoryFeed: ActivityItem[] = [...MOCK_ACTIVITY_FEED];

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  return inMemoryFollows.some(
    (f) => f.followerId === followerId && f.followingId === followingId
  );
}

export async function followPlayer(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> {
  if (followerId === followingId) {
    return { success: false, error: "You cannot follow your own profile." };
  }

  const existing = inMemoryFollows.find(
    (f) => f.followerId === followerId && f.followingId === followingId
  );
  if (existing) {
    return { success: true };
  }

  const newFollow: Follow = {
    followerId,
    followingId,
    createdAt: new Date().toISOString(),
  };

  inMemoryFollows.push(newFollow);

  // Update mock players counts
  const target = MOCK_PLAYERS.find((p) => p.id === followingId);
  const follower = MOCK_PLAYERS.find((p) => p.id === followerId);
  if (target) {
    target.followersCount = (target.followersCount || 0) + 1;
  }
  if (follower) {
    follower.followingCount = (follower.followingCount || 0) + 1;
  }

  // Add to activity feed
  if (follower && target) {
    inMemoryFeed.unshift({
      id: `act_${Date.now()}`,
      type: "achievement",
      profileId: follower.id,
      profileName: follower.displayName,
      profileUsername: follower.username,
      profileAvatar: follower.avatarUrl,
      title: "Started Following a Player",
      description: `Began following ${target.displayName} (@${target.username}).`,
      timestamp: "Just now",
    });

    // Send email notification stub
    await sendEmailNotification({
      recipientName: target.displayName,
      senderName: follower.displayName,
      type: "new_follower",
    });
  }

  return { success: true };
}

export async function unfollowPlayer(
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> {
  const index = inMemoryFollows.findIndex(
    (f) => f.followerId === followerId && f.followingId === followingId
  );
  if (index === -1) {
    return { success: true };
  }

  inMemoryFollows.splice(index, 1);

  const target = MOCK_PLAYERS.find((p) => p.id === followingId);
  const follower = MOCK_PLAYERS.find((p) => p.id === followerId);
  if (target && target.followersCount && target.followersCount > 0) {
    target.followersCount -= 1;
  }
  if (follower && follower.followingCount && follower.followingCount > 0) {
    follower.followingCount -= 1;
  }

  return { success: true };
}

export async function getFollowerCounts(profileId: string): Promise<{ followers: number; following: number }> {
  const followers = inMemoryFollows.filter((f) => f.followingId === profileId).length;
  const following = inMemoryFollows.filter((f) => f.followerId === profileId).length;
  return { followers, following };
}

export async function getActivityFeed(profileId?: string): Promise<ActivityItem[]> {
  if (!profileId) {
    return inMemoryFeed;
  }

  const followedIds = new Set(
    inMemoryFollows.filter((f) => f.followerId === profileId).map((f) => f.followingId)
  );

  const filtered = inMemoryFeed.filter(
    (item) => item.profileId === profileId || followedIds.has(item.profileId)
  );

  return filtered.length > 0 ? filtered : inMemoryFeed;
}


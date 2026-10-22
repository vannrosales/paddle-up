import { ImageResponse } from "next/og";
import { getPlayerByUsername } from "@/lib/services/player-service";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const player = await getPlayerByUsername(username);

  const displayName = player ? player.displayName : "Pickleball Player";
  const userHandle = player ? `@${player.username}` : `@${username}`;
  const skillLevel = player?.skillLevel ? player.skillLevel.toFixed(1) : "3.5";
  const primaryRole =
    player?.roles?.find((r) => r.isPrimary)?.role.label || "Pickleball Competitor";
  const city = player?.city || "PaddleUp Community";
  const achievementsCount = player?.achievements?.length || 0;
  const badgesCount = player?.badges?.length || 0;
  const followersCount = player?.followersCount || 100;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0F1012",
          padding: "50px 60px",
          color: "#FFFFFF",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        {/* Top Court Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "10px",
            backgroundColor: "#C8F31D",
            display: "flex",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#C8F31D",
                color: "#1C2A00",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 900,
              }}
            >
              <span>P</span>
            </div>
            <div style={{ display: "flex", flexDirection: "row", fontSize: "28px", fontWeight: 800 }}>
              <span style={{ color: "#FFFFFF" }}>Paddle</span>
              <span style={{ color: "#C8F31D" }}>Up</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#34C759",
            }}
          >
            <span>Verified Player Passport</span>
          </div>
        </div>

        {/* Center Main Card Profile */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 48px",
            borderRadius: "32px",
            backgroundColor: "rgba(28, 28, 30, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "32px" }}>
            {/* Avatar Squircle */}
            <div
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "32px",
                backgroundColor: "#2C2C2E",
                border: "3px solid #3A3A3C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "52px",
                fontWeight: 800,
                color: "#C8F31D",
              }}
            >
              <span>{displayName.charAt(0)}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <span style={{ fontSize: "40px", fontWeight: 800 }}>
                  {displayName}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span style={{ fontSize: "20px", color: "#8E8E93" }}>
                  {userHandle} · {city}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}>
                <div
                  style={{
                    backgroundColor: "#C8F31D",
                    color: "#1C2A00",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "15px",
                    fontWeight: 700,
                    display: "flex",
                  }}
                >
                  <span>{primaryRole}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Ring Badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "140px",
              height: "140px",
              borderRadius: "999px",
              border: "6px solid #C8F31D",
              backgroundColor: "rgba(200, 243, 29, 0.1)",
            }}
          >
            <span style={{ fontSize: "44px", fontWeight: 900, color: "#C8F31D", lineHeight: 1 }}>
              {skillLevel}
            </span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#8E8E93", textTransform: "uppercase" }}>
              Rating
            </span>
          </div>
        </div>

        {/* Bottom Bar: Stats and CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "36px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF" }}>
                {achievementsCount}
              </span>
              <span style={{ fontSize: "13px", color: "#8E8E93", textTransform: "uppercase", fontWeight: 600 }}>
                Achievements &amp; Medals
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF" }}>
                {badgesCount}
              </span>
              <span style={{ fontSize: "13px", color: "#8E8E93", textTransform: "uppercase", fontWeight: 600 }}>
                Badges Unlocked
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "#FFFFFF" }}>
                {followersCount}+
              </span>
              <span style={{ fontSize: "13px", color: "#8E8E93", textTransform: "uppercase", fontWeight: 600 }}>
                Followers &amp; Endorsers
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "16px",
              color: "#8E8E93",
              fontWeight: 500,
            }}
          >
            <span>paddleup.app/p/{username}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


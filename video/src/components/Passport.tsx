import React from "react";
import { Img, staticFile } from "remotion";
import { display, inter, mono, C } from "../theme";
import { backOut, ip, expoOut } from "../lib/anim";
import { ShieldCheck, MapPin, Feather, Zap, GradCap, Paddle, Trophy, Users, Calendar } from "./Icons";

export const Avatar: React.FC<{ name: string; s: number; r?: number; ring?: string; style?: React.CSSProperties }> = ({ name, s, r, ring, style }) => (
  <div
    style={{
      width: s,
      height: s,
      borderRadius: r ?? s * 0.28,
      overflow: "hidden",
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 ${Math.max(2, s * 0.035)}px ${ring}` : "0 0 0 1.5px rgba(255,255,255,0.14)",
      ...style,
    }}
  >
    <Img src={staticFile(`avatars/${name}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

/** PaddleUp mark: lime rounded-xl tile with a dark pickleball 'P' (matches components/navbar.tsx) */
export const LogoMark: React.FC<{ s: number; p?: number; style?: React.CSSProperties }> = ({ s, p = 1, style }) => {
  const sc = ip(p, [0, 1], [0.3, 1], backOut);
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: s * 0.28,
        background: "#C8F31D",
        boxShadow: `0 4px 18px rgba(200,243,29,${0.35 * p})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${sc})`,
        opacity: Math.min(1, p * 2),
        fontFamily: display,
        fontWeight: 900,
        fontSize: s * 0.56,
        color: "#1C2A00",
        ...style,
      }}
    >
      P
    </div>
  );
};

export const Wordmark: React.FC<{ size: number; color?: string; reveal?: number }> = ({ size, color = "#F2F2F7", reveal = 1 }) => {
  const letters = "PaddleUp".split("");
  return (
    <div style={{ display: "flex", fontFamily: display, fontWeight: 800, fontSize: size, letterSpacing: "-0.04em", lineHeight: 1, color }}>
      {letters.map((l, i) => {
        const p = ip(reveal * 10, [i * 0.7, i * 0.7 + 3], [0, 1], expoOut);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * size * 0.4}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
              color: i >= 6 ? "#C8F31D" : undefined,
            }}
          >
            {l}
          </span>
        );
      })}
    </div>
  );
};

/** Pickleball with holes. */
export const Pickleball: React.FC<{ s: number; rot?: number; style?: React.CSSProperties }> = ({ s, rot = 0, style }) => {
  const holes = [] as React.ReactNode[];
  const pts = [
    [50, 22],
    [27, 38],
    [73, 38],
    [36, 64],
    [64, 64],
    [50, 50],
    [50, 82],
    [18, 60],
    [82, 60],
    [30, 16],
    [70, 16],
  ];
  pts.forEach(([x, y], i) => holes.push(<circle key={i} cx={x} cy={y} r={5.2} fill="#7FA00E" opacity={0.85} />));
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        background: "radial-gradient(circle at 32% 28%, #F4FFB0, #C8F31D 40%, #9CC400 85%)",
        boxShadow: `0 0 ${s * 0.45}px rgba(200,243,29,0.5), inset -${s * 0.08}px -${s * 0.1}px ${s * 0.2}px rgba(0,0,0,0.25)`,
        overflow: "hidden",
        transform: `rotate(${rot}deg)`,
        ...style,
      }}
    >
      <svg viewBox="0 0 100 100" width={s} height={s}>
        {holes}
      </svg>
    </div>
  );
};

/** macOS/app-style pointer with calibrated hotspot and click pulse */
export const Cursor: React.FC<{ x: number; y: number; press?: number; o?: number; s?: number; hand?: boolean }> = ({ x, y, press = 0, o = 1, s = 1, hand }) => {
  const hx = hand ? 18.4 : 3.8;
  const hy = hand ? 5.3 : 2.9;
  return (
    <div
      style={{
        position: "absolute",
        left: x - hx * s,
        top: y - hy * s,
        opacity: o,
        transform: `scale(${s * (1 - press * 0.16)})`,
        transformOrigin: `${hx}px ${hy}px`,
        zIndex: 90,
        filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.55))",
        pointerEvents: "none",
      }}
    >
      {press > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: hx - 28,
            top: hy - 28,
            width: 56,
            height: 56,
            borderRadius: 28,
            border: `3px solid rgba(200,243,29,${1 - press})`,
            transform: `scale(${0.4 + press * 1.5})`,
          }}
        />
      )}
      {hand ? (
        <svg width="42" height="46" viewBox="0 0 24 26">
          <path
            d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v1.5m0-.5a1.5 1.5 0 0 1 3 0V16a7 7 0 0 1-7 7h-1.5c-2 0-3.3-.8-4.5-2.2L4.3 17.2a1.6 1.6 0 0 1 2.3-2.2L9 17"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="38" height="46" viewBox="0 0 20 24">
          <path d="M2 1.5v18.2l4.6-4.3 3 7 3.2-1.4-3-6.8 6.4-.3z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

/**
 * Exact App Navbar + Browser Chrome wrapper (matches components/navbar.tsx)
 * Gives the video the authentic SaaS browser walkthrough look from the reference video.
 */
export const AppNavbar: React.FC<{
  activeNav?: "Players" | "Leaderboard" | "Clubs" | "Tournaments" | "Find Partner" | "Dashboard";
  route?: string;
  light?: boolean;
}> = ({ activeNav = "Players", route = "paddleup.app/p/marias", light }) => {
  const navs = ["Players", "Leaderboard", "Clubs", "Tournaments", "Find Partner"] as const;
  return (
    <div style={{ width: "100%", fontFamily: inter }}>
      {/* Sleek macOS Browser Top Chrome */}
      <div
        style={{
          height: 44,
          background: light ? "#E5E5EA" : "#111214",
          borderBottom: `1px solid ${light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F56" }} />
          <span style={{ width: 12, height: 12, borderRadius: 6, background: "#FFBD2E" }} />
          <span style={{ width: 12, height: 12, borderRadius: 6, background: "#27C93F" }} />
        </div>
        <div
          style={{
            padding: "5px 28px",
            borderRadius: 9,
            background: light ? "#FFFFFF" : "#1C1C1E",
            border: `1px solid ${light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
            fontFamily: mono,
            fontSize: 13,
            fontWeight: 600,
            color: light ? "#3A3A3C" : "#A1A1AA",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 4, background: "#30D158" }} />
          {route}
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Real PaddleUp Sticky Header (components/navbar.tsx) */}
      <div
        style={{
          height: 64,
          background: light ? "rgba(255,255,255,0.9)" : "rgba(18,18,20,0.92)",
          borderBottom: `1px solid ${light ? "#E5E5EA" : "#27272A"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark s={34} />
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.03em", color: light ? "#111" : "#fff" }}>
              Paddle<span style={{ color: "#84CC16" }}>Up</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {navs.map((n) => {
              const on = activeNav === n;
              return (
                <div
                  key={n}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    background: on ? (light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)") : "transparent",
                    color: on ? (light ? "#000" : "#C8F31D") : light ? "#636366" : "#A1A1AA",
                  }}
                >
                  {n}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              background: light ? "#F4F4F5" : "#27272A",
              border: `1px solid ${light ? "#E4E4E7" : "#3F3F46"}`,
              fontSize: 12,
              fontWeight: 600,
              color: "#A1A1AA",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Search players...</span>
            <span style={{ padding: "1px 5px", borderRadius: 4, background: light ? "#fff" : "#18181B", fontFamily: mono, fontSize: 10 }}>⌘K</span>
          </div>
          <div
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              background: activeNav === "Dashboard" ? "#C8F31D" : light ? "#F4F4F5" : "#27272A",
              color: activeNav === "Dashboard" ? "#1C2A00" : light ? "#18181B" : "#F4F4F5",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Dashboard
          </div>
          <div
            style={{
              padding: "7px 16px",
              borderRadius: 12,
              background: "#C8F31D",
              color: "#1C2A00",
              fontSize: 13,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>Coming Soon · Waitlist</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- Skill badge / ring (matches components/skill-badge.tsx + animated ring) ----------------
export const SkillRing: React.FC<{ s: number; p: number; level?: number; light?: boolean }> = ({ s, p, level = 4.0, light }) => {
  const r = s / 2 - s * 0.065;
  const circ = 2 * Math.PI * r;
  const shown = 2 + (level - 2) * p;
  const label = level >= 5.0 ? "Pro / Master" : level >= 4.5 ? "Expert" : level >= 4.0 ? "Advanced" : "Intermediate";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: s * 0.06 }}>
      <div
        style={{
          position: "relative",
          width: s,
          height: s,
          borderRadius: "50%",
          background: light ? "#FFFFFF" : "#141416",
          boxShadow: `0 0 ${s * 0.22}px rgba(200,243,29,0.28)`,
        }}
      >
        <svg width={s} height={s} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
          <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke={light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"} strokeWidth={s * 0.075} />
          <circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            fill="none"
            stroke="#C8F31D"
            strokeWidth={s * 0.075}
            strokeDasharray={`${circ * p} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: display,
          }}
        >
          <div
            style={{
              fontSize: s * 0.34,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: light ? C.lightText : "#fff",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
            }}
          >
            {shown.toFixed(1)}
          </div>
          <div
            style={{
              fontSize: s * 0.09,
              fontWeight: 800,
              letterSpacing: "0.1em",
              color: "#8E8E93",
              marginTop: s * 0.03,
              textTransform: "uppercase",
            }}
          >
            SKILL
          </div>
        </div>
      </div>
      <span
        style={{
          fontSize: Math.max(11, s * 0.11),
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: `${s * 0.03}px ${s * 0.1}px`,
          borderRadius: 999,
          background: "rgba(200,243,29,0.14)",
          color: "#C8F31D",
          opacity: ip(p, [0.5, 1], [0, 1]),
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ---------------- Role chip (matches components/role-chip.tsx) ----------------
const ROLE_ICON: Record<string, React.FC<any>> = {
  "Dinker / Soft-Game Specialist": Feather,
  Dinker: Feather,
  "Right-Side Player": Zap,
  "Left-Side Player": Zap,
  "Power Hitter (Banger)": Zap,
  "Power Hitter": Zap,
  "Coach / Instructor": GradCap,
  Coach: GradCap,
  "All-Court Player": Zap,
};
export const RoleChip: React.FC<{ role: string; primary?: boolean; p?: number; size?: number }> = ({ role, primary, p = 1, size = 16 }) => {
  const Icon = ROLE_ICON[role] ?? Zap;
  const sc = ip(p, [0, 1], [0.5, 1], backOut);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: size * 0.75,
        fontFamily: inter,
        fontWeight: primary ? 700 : 600,
        fontSize: size,
        background: primary ? "#C8F31D" : "#27272A",
        color: primary ? "#1C2A00" : "#E4E4E7",
        border: primary ? "1px solid #A3E635" : "1px solid #3F3F46",
        transform: `scale(${sc})`,
        opacity: Math.min(1, p * 2.5),
      }}
    >
      <Icon s={size * 1.05} c={primary ? "#1C2A00" : "#C8F31D"} />
      <span>{role}</span>
      {primary && (
        <span
          style={{
            fontSize: size * 0.68,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: 5,
            background: "rgba(0,0,0,0.16)",
            color: "#1C2A00",
          }}
        >
          Primary
        </span>
      )}
    </div>
  );
};

/**
 * Exact Player Profile View (matches app/p/[username]/page.tsx + components/profile-actions.tsx)
 * Shows Maria Santos (@marias) or Jun Reyes (@junr) with real action buttons, 4-col hardware bar, and tournament achievements.
 */
export type PassportP = {
  avatar: number;
  ring: number;
  chips: number;
  specs: number;
  podium: number;
  endorseHover?: number;
  shareHover?: number;
};

export const PassportCard: React.FC<{ p: PassportP; w?: number }> = ({ p, w = 1360 }) => {
  const k = w / 1360;
  const specs = [
    ["Dominant Hand", "Right-handed"],
    ["Years Playing", "3.5 years"],
    ["Paddle Choice", "JOOLA Perseus CFS 16"],
    ["Home Court / Club", "Cebu Smash Pickleball Club"],
  ];
  const achievements = [
    {
      title: "Women's Doubles 4.0 Champions",
      badge: "Gold",
      badgeBg: "rgba(245,158,11,0.18)",
      badgeCol: "#FCD34D",
      status: "Verified",
      event: "Visayas Pickleball Open 2024",
      meta: "Division: Women's Doubles 4.0  ·  Partner: Elena Garcia",
    },
    {
      title: "Mixed Doubles Runner-Up",
      badge: "Silver",
      badgeBg: "rgba(148,163,184,0.2)",
      badgeCol: "#E2E8F0",
      status: "Endorsed",
      event: "Cebu Island Summer Slam",
      meta: "Division: Mixed Doubles Open  ·  Partner: Jun Reyes",
    },
    {
      title: "IPTPA Level 1 Certified Teaching Pro",
      badge: "Certified",
      badgeBg: "rgba(10,132,255,0.18)",
      badgeCol: "#60A5FA",
      status: "Verified",
      event: "IPTPA Coaching Accreditation",
      meta: "Division: Instruction  ·  Accredited Coach",
    },
  ];

  const endorseSc = 1 - (p.endorseHover ?? 0) * 0.06;
  const shareSc = 1 - (p.shareHover ?? 0) * 0.06;

  return (
    <div style={{ width: w, fontFamily: inter, color: "#FFFFFF" }}>
      {/* Top Action Bar (matches app/p/[username]/page.tsx lines 41-59 + components/profile-actions.tsx) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18 * k,
        }}
      >
        <div style={{ fontSize: 16 * k, fontWeight: 600, color: "#A1A1AA", display: "flex", alignItems: "center", gap: 8 * k }}>
          <span>←</span>
          <span>Back to directory</span>
        </div>

        {/* ProfileActions buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
          <div
            style={{
              padding: `${9 * k}px ${16 * k}px`,
              borderRadius: 14 * k,
              background: "#1C1C1E",
              border: "1px solid #27272A",
              fontSize: 14 * k,
              fontWeight: 700,
              color: "#F4F4F5",
              display: "flex",
              alignItems: "center",
              gap: 8 * k,
            }}
          >
            <Users s={16 * k} c="#A1A1AA" />
            <span>Follow</span>
            <span style={{ padding: "2px 6px", borderRadius: 99, background: "#27272A", fontSize: 12 * k }}>142</span>
          </div>

          <div
            style={{
              padding: `${9 * k}px ${18 * k}px`,
              borderRadius: 14 * k,
              background: (p.endorseHover ?? 0) > 0.05 ? "#C8F31D" : "rgba(245,158,11,0.14)",
              border: `1.5px solid ${(p.endorseHover ?? 0) > 0.05 ? "#C8F31D" : "rgba(245,158,11,0.4)"}`,
              fontSize: 14 * k,
              fontWeight: 800,
              color: (p.endorseHover ?? 0) > 0.05 ? "#1C2A00" : "#FBBF24",
              display: "flex",
              alignItems: "center",
              gap: 8 * k,
              transform: `scale(${endorseSc})`,
              boxShadow: (p.endorseHover ?? 0) > 0.05 ? "0 0 28px rgba(200,243,29,0.55)" : "none",
            }}
          >
            <Trophy s={16 * k} c={(p.endorseHover ?? 0) > 0.05 ? "#1C2A00" : "#FBBF24"} />
            <span>Endorse Player</span>
          </div>

          <div
            style={{
              padding: `${9 * k}px ${18 * k}px`,
              borderRadius: 14 * k,
              background: (p.shareHover ?? 0) > 0.05 ? "#C8F31D" : "#1C1C1E",
              border: `1.5px solid ${(p.shareHover ?? 0) > 0.05 ? "#C8F31D" : "#27272A"}`,
              fontSize: 14 * k,
              fontWeight: 800,
              color: (p.shareHover ?? 0) > 0.05 ? "#1C2A00" : "#F4F4F5",
              display: "flex",
              alignItems: "center",
              gap: 8 * k,
              transform: `scale(${shareSc})`,
              boxShadow: (p.shareHover ?? 0) > 0.05 ? "0 0 28px rgba(200,243,29,0.55)" : "none",
            }}
          >
            <span>Share Pass</span>
          </div>
        </div>
      </div>

      {/* Main Profile Header Card (matches rounded-[32px] bg-[#1C1C1E] in app/p/[username]/page.tsx) */}
      <div
        style={{
          borderRadius: 32 * k,
          background: "#1C1C1E",
          border: "1.5px solid #27272A",
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top optic accent bar */}
        <div style={{ height: 10 * k, background: "linear-gradient(90deg,#C8F31D,#A3E635,#0A84FF)" }} />

        <div style={{ padding: `${32 * k}px ${38 * k}px` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 28 * k }}>
            {/* Left: Avatar + Name + Bio */}
            <div
              style={{
                display: "flex",
                 gap: 26 * k,
                alignItems: "flex-start",
                opacity: p.avatar,
                transform: `translateY(${(1 - p.avatar) * 20}px)`,
                flex: 1,
              }}
            >
              <Avatar name="maya" s={122 * k} r={28 * k} ring="rgba(200,243,29,0.85)" />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
                  <span style={{ fontFamily: display, fontSize: 40 * k, fontWeight: 800, letterSpacing: "-0.03em" }}>Maria Santos</span>
                  <ShieldCheck s={28 * k} c="#34C759" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 * k, marginTop: 4 * k, fontSize: 15 * k, color: "#A1A1AA" }}>
                  <span style={{ fontFamily: mono }}>@marias</span>
                  <span>•</span>
                  <span>
                    <strong style={{ color: "#fff" }}>142</strong> followers
                  </span>
                  <span>•</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 * k }}>
                    <MapPin s={15 * k} c="#0A84FF" /> Cebu City, Philippines
                  </span>
                </div>
                <p style={{ fontSize: 16 * k, color: "#D4D4D8", marginTop: 12 * k, lineHeight: 1.45, marginBottom: 0 }}>
                  Passionate pickleball competitor, soft-game tactician, and weekend open-play ambassador at Cebu Smash Club.
                </p>

                {/* Roles section */}
                <div style={{ marginTop: 18 * k }}>
                  <div
                    style={{
                      fontSize: 11 * k,
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#71717A",
                      marginBottom: 8 * k,
                    }}
                  >
                    PLAYING ROLES &amp; COURT STYLE
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 * k }}>
                    {(
                      [
                        ["Dinker / Soft-Game Specialist", true],
                        ["Right-Side Player", false],
                        ["Coach / Instructor", false],
                      ] as const
                    ).map(([r, pr], i) => (
                      <RoleChip key={r} role={r} primary={pr} p={Math.max(0, Math.min(1, p.chips - i * 0.6))} size={14.5 * k} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Skill Badge */}
            <div style={{ paddingLeft: 24 * k, borderLeft: "1px solid #27272A" }}>
              <SkillRing s={128 * k} p={p.ring} level={4.0} />
            </div>
          </div>

          {/* 4-column Hardware & Details Bar (matches lines 142-194 of app/p/[username]/page.tsx) */}
          <div
            style={{
              marginTop: 26 * k,
              paddingTop: 20 * k,
              borderTop: "1px solid #27272A",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16 * k,
            }}
          >
            {specs.map(([label, val], i) => {
              const q = ip(p.specs * 4, [i * 0.6, i * 0.6 + 1.4], [0, 1]);
              return (
                <div
                  key={label}
                  style={{
                    padding: `${12 * k}px ${16 * k}px`,
                    borderRadius: 16 * k,
                    background: "#141416",
                    border: "1px solid #27272A",
                    opacity: q,
                    transform: `translateY(${(1 - q) * 14}px)`,
                  }}
                >
                  <div style={{ fontSize: 11 * k, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#71717A" }}>{label}</div>
                  <div style={{ fontSize: 15 * k, fontWeight: 700, color: "#F4F4F5", marginTop: 4 * k }}>{val}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements & Medals Section (matches AchievementItem in components/achievement-item.tsx) */}
      {p.podium > 0.01 && (
        <div style={{ marginTop: 20 * k }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 * k }}>
            <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 800, letterSpacing: "-0.02em" }}>Achievements &amp; Medals</div>
            <div style={{ fontSize: 13 * k, fontWeight: 600, color: "#A1A1AA" }}>3 records</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 * k }}>
            {achievements.map((ach, i) => {
              const q = ip(p.podium * 3, [i * 0.6, i * 0.6 + 1.2], [0, 1], expoOut);
              return (
                <div
                  key={ach.title}
                  style={{
                    padding: 18 * k,
                    borderRadius: 22 * k,
                    background: "#1C1C1E",
                    border: "1px solid #27272A",
                    opacity: q,
                    transform: `translateY(${(1 - q) * 22}px)`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 8 * k,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 * k, marginBottom: 6 * k }}>
                      <span
                        style={{
                          padding: `${3 * k}px ${10 * k}px`,
                          borderRadius: 99,
                          background: ach.badgeBg,
                          color: ach.badgeCol,
                          fontSize: 12 * k,
                          fontWeight: 800,
                        }}
                      >
                        {ach.badge}
                      </span>
                      <span style={{ fontSize: 12 * k, fontWeight: 700, color: "#34C759", display: "inline-flex", alignItems: "center", gap: 4 * k }}>
                        <ShieldCheck s={14 * k} c="#34C759" /> {ach.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 16 * k, fontWeight: 800, color: "#fff", lineHeight: 1.25 }}>{ach.title}</div>
                    <div style={{ fontSize: 13.5 * k, fontWeight: 600, color: "#A1A1AA", marginTop: 4 * k }}>{ach.event}</div>
                  </div>
                  <div style={{ fontSize: 12 * k, color: "#71717A", borderTop: "1px solid #27272A", paddingTop: 8 * k }}>{ach.meta}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

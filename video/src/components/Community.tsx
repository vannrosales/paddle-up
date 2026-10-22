import React from "react";
import { display, inter, mono, C } from "../theme";
import { ip, rand, backOut, expoOut } from "../lib/anim";
import { Avatar, SkillRing, RoleChip } from "./Passport";
import { Check, Trophy, Users, Star, Flame, Heart, Calendar, MapPin, Zap, Feather, GradCap, Paddle, ShieldCheck } from "./Icons";
import { ShaderButton } from "./LimeShader";

// ---------- Interactive EndorseModal (matches components/endorse-modal.tsx 1:1!) ----------
export const EndorseModalView: React.FC<{
  w?: number;
  selectedKind?: "skill" | "role" | "sportsmanship" | "general";
  claimText?: string;
  noteText?: string;
  submitPress?: number;
  successP?: number; // 0 = form, 1 = "Endorsement Recorded!" screen
}> = ({
  w = 600,
  selectedKind = "skill",
  claimText = "4.0 Dinking & Soft Resets",
  noteText = "Steadiest backhand dink in Cebu. Unshakeable in kitchen fire-fights.",
  submitPress = 0,
  successP = 0,
}) => {
  const k = w / 600;
  const kinds = [
    { id: "skill", label: "Skill Rating" },
    { id: "role", label: "Playing Role" },
    { id: "sportsmanship", label: "Sportsmanship" },
    { id: "general", label: "All-Court" },
  ] as const;

  return (
    <div
      style={{
        width: w,
        borderRadius: 32 * k,
        background: "#1C1C1E",
        border: "1.5px solid #27272A",
        boxShadow: "0 50px 120px rgba(0,0,0,0.78)",
        padding: 32 * k,
        fontFamily: inter,
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 * k }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 * k }}>
          <div
            style={{
              width: 44 * k,
              height: 44 * k,
              borderRadius: 14 * k,
              background: "rgba(245,158,11,0.14)",
              color: "#FBBF24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trophy s={22 * k} c="#FBBF24" />
          </div>
          <div>
            <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 800 }}>Endorse Maria Santos</div>
            <div style={{ fontSize: 13 * k, color: "#A1A1AA" }}>Vouch for @marias&apos;s on-court skill &amp; roles</div>
          </div>
        </div>
        <div
          style={{
            width: 32 * k,
            height: 32 * k,
            borderRadius: 16 * k,
            background: "#27272A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15 * k,
            color: "#A1A1AA",
          }}
        >
          ✕
        </div>
      </div>

      {successP < 0.5 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 * k }}>
          {/* What are you vouching for? */}
          <div>
            <div style={{ fontSize: 11 * k, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 8 * k }}>
              What are you vouching for?
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 * k }}>
              {kinds.map((opt) => {
                const active = opt.id === selectedKind;
                return (
                  <div
                    key={opt.id}
                    style={{
                      padding: `${10 * k}px ${14 * k}px`,
                      borderRadius: 12 * k,
                      fontSize: 13.5 * k,
                      fontWeight: 800,
                      textAlign: "center",
                      background: active ? "#C8F31D" : "#141416",
                      color: active ? "#1C2A00" : "#D4D4D8",
                      border: `1px solid ${active ? "#84CC16" : "#27272A"}`,
                    }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Endorsement Focus / Claim */}
          <div>
            <div style={{ fontSize: 11 * k, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 6 * k }}>
              Endorsement Focus / Claim *
            </div>
            <div
              style={{
                padding: `${11 * k}px ${14 * k}px`,
                borderRadius: 12 * k,
                background: "#141416",
                border: "1.5px solid #C8F31D",
                fontSize: 15 * k,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              {claimText}
            </div>
          </div>

          {/* Personal Recommendation Note */}
          <div>
            <div style={{ fontSize: 11 * k, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 6 * k }}>
              Personal Recommendation Note
            </div>
            <div
              style={{
                minHeight: 68 * k,
                padding: `${11 * k}px ${14 * k}px`,
                borderRadius: 12 * k,
                background: "#141416",
                border: "1px solid #27272A",
                fontSize: 14 * k,
                color: "#E4E4E7",
                lineHeight: 1.4,
              }}
            >
              {noteText}
              <span style={{ display: "inline-block", width: 2, height: 15 * k, background: "#C8F31D", marginLeft: 3, verticalAlign: "middle" }} />
            </div>
          </div>

          {/* Submit Button (Signature Shader) */}
          <div style={{ marginTop: 4 * k }}>
            <ShaderButton
              w={w - 64 * k}
              h={50 * k}
              r={14 * k}
              press={submitPress}
              glow={0.7}
              fontSize={16 * k}
              label={<span>Submit Endorsement</span>}
            />
          </div>
        </div>
      ) : (
        /* Success State (matches lines 93-102 of components/endorse-modal.tsx) */
        <div
          style={{
            padding: `${40 * k}px ${20 * k}px`,
            textAlign: "center",
            transform: `scale(${ip(successP, [0.5, 1], [0.85, 1], backOut)})`,
          }}
        >
          <div
            style={{
              width: 68 * k,
              height: 68 * k,
              borderRadius: 34 * k,
              background: "rgba(52,199,89,0.16)",
              color: "#34C759",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 0 32px rgba(52,199,89,0.35)",
            }}
          >
            <Check s={36 * k} c="#34C759" />
          </div>
          <div style={{ fontFamily: display, fontSize: 28 * k, fontWeight: 800, color: "#FFFFFF" }}>Endorsement Recorded!</div>
          <div style={{ fontSize: 15 * k, color: "#A1A1AA", marginTop: 8 * k }}>
            Your peer vouch has been added to Maria Santos&apos;s public Player Passport.
          </div>
          <div
            style={{
              marginTop: 20 * k,
              display: "inline-flex",
              alignItems: "center",
              gap: 8 * k,
              padding: `${8 * k}px ${18 * k}px`,
              borderRadius: 99,
              background: "rgba(200,243,29,0.14)",
              border: "1px solid rgba(200,243,29,0.45)",
              color: "#C8F31D",
              fontSize: 14 * k,
              fontWeight: 800,
            }}
          >
            <span>+1 Peer Vouch · Unlocked &ldquo;Peer Endorsed&rdquo; Badge</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Endorsement row (matches Received Endorsements on Profile/Dashboard) ----------
export const EndorseRow: React.FC<{ who: string; name: string; skill?: string; what: string; tag: string; p: number; light?: boolean; w?: number }> = ({
  who,
  name,
  skill = "4.5",
  what,
  tag,
  p,
  light,
  w = 700,
}) => (
  <div
    style={{
      width: w,
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "18px 22px",
      borderRadius: 24,
      background: light ? "#fff" : "#1C1C1E",
      border: light ? "1px solid rgba(60,60,67,0.14)" : "1px solid #27272A",
      boxShadow: light ? "0 16px 40px rgba(0,0,0,0.06)" : "0 20px 50px rgba(0,0,0,0.45)",
      fontFamily: inter,
      opacity: Math.min(1, p * 2),
      transform: `translateY(${(1 - p) * 40}px) scale(${0.95 + 0.05 * p})`,
    }}
  >
    <Avatar name={who} s={58} r={18} />
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: light ? C.lightText : "#fff" }}>{name}</span>
        <span
          style={{
            padding: "2px 8px",
            borderRadius: 6,
            background: "rgba(200,243,29,0.16)",
            color: light ? "#3F6212" : "#C8F31D",
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {skill}
        </span>
      </div>
      <div style={{ fontSize: 15, color: light ? "#52525B" : "#A1A1AA", marginTop: 4, fontStyle: "italic" }}>&ldquo;{what}&rdquo;</div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#C8F31D",
        color: "#1C2A00",
        borderRadius: 12,
        padding: "8px 14px",
        fontWeight: 800,
        fontSize: 14,
        transform: `scale(${ip(p, [0.4, 1], [0, 1], backOut)})`,
      }}
    >
      <Check s={16} /> {tag}
    </div>
  </div>
);

// ---------- Badge tile (matches components/badge-tile.tsx 1:1!) ----------
const BADGE_ICONS: Record<string, React.FC<any>> = {
  trophy: Trophy,
  users: Users,
  star: Star,
  flame: Flame,
  heart: Heart,
  paddle: Paddle,
  zap: Zap,
  shield: ShieldCheck,
};

export const BadgeTile: React.FC<{
  title: string;
  desc?: string;
  earned?: string;
  icon: string;
  g: [string, string];
  p: number;
  s?: number;
  locked?: boolean;
  light?: boolean;
  shine?: number;
}> = ({ title, desc = "Verified tournament & peer milestone", earned = "Earned Aug 2024", icon, g, p, s = 260, locked, light }) => {
  const Icon = BADGE_ICONS[icon] ?? Star;
  const sc = ip(p, [0, 1], [0.65, 1], backOut);
  const k = s / 260;
  return (
    <div
      style={{
        width: s,
        padding: 22 * k,
        borderRadius: 26 * k,
        background: light ? "#FFFFFF" : "#1C1C1E",
        border: `1.5px solid ${locked ? "#27272A" : "rgba(200,243,29,0.38)"}`,
        boxShadow: locked ? "none" : "0 24px 50px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        fontFamily: inter,
        opacity: Math.min(1, p * 2),
        transform: `scale(${sc})`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Game Center Squircle Icon (matches w-14 h-14 rounded-2xl in components/badge-tile.tsx) */}
      <div
        style={{
          position: "relative",
          width: 68 * k,
          height: 68 * k,
          borderRadius: 20 * k,
          background: locked ? "#27272A" : `linear-gradient(135deg, ${g[0]}33, ${g[1]}22)`,
          border: `1.5px solid ${locked ? "#3F3F46" : g[0]}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14 * k,
          boxShadow: locked ? "none" : `0 10px 24px ${g[0]}33`,
        }}
      >
        <Icon s={32 * k} c={locked ? "#71717A" : g[0]} w={2.2} />
        {!locked && (
          <span
            style={{
              position: "absolute",
              top: -4 * k,
              right: -4 * k,
              width: 14 * k,
              height: 14 * k,
              borderRadius: 7 * k,
              background: "#C8F31D",
              border: `2px solid ${light ? "#fff" : "#1C1C1E"}`,
            }}
          />
        )}
      </div>

      <div style={{ fontSize: 17 * k, fontWeight: 800, color: light ? C.lightText : "#FFFFFF", letterSpacing: "-0.01em" }}>{title}</div>
      <div style={{ fontSize: 12.5 * k, color: "#A1A1AA", marginTop: 6 * k, lineHeight: 1.35 }}>{desc}</div>
      <div
        style={{
          marginTop: 12 * k,
          padding: `${4 * k}px ${10 * k}px`,
          borderRadius: 99,
          background: locked ? "#27272A" : "rgba(200,243,29,0.14)",
          color: locked ? "#71717A" : "#C8F31D",
          fontFamily: mono,
          fontSize: 11 * k,
          fontWeight: 700,
        }}
      >
        {locked ? "Locked" : earned}
      </div>
    </div>
  );
};

// ---------- Confetti ----------
export const Confetti: React.FC<{ f: number; start: number; x: number; y: number; n?: number; power?: number; colors?: string[] }> = ({
  f,
  start,
  x,
  y,
  n = 90,
  power = 1,
  colors = ["#C8F31D", "#0A84FF", "#30D158", "#FF453A", "#FFC93C", "#ffffff"],
}) => {
  const t = (f - start) / 30;
  if (t < 0 || t > 3.2) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, pointerEvents: "none", zIndex: 90 }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = rand(i + 1) * Math.PI * 2;
        const sp = (500 + rand(i + 7) * 1100) * power;
        const vx = Math.cos(a) * sp,
          vy = Math.sin(a) * sp - 500 * power;
        const drag = Math.exp(-t * 1.6);
        const px = x + (vx * (1 - drag)) / 1.6 + Math.sin(t * 6 + i) * 20 * t;
        const py = y + (vy * (1 - drag)) / 1.6 + 420 * t * t;
        const rot = t * (300 + rand(i + 3) * 700) * (i % 2 ? 1 : -1);
        const w = 10 + rand(i + 5) * 14,
          h = i % 3 === 0 ? w : w * 0.45;
        const o = t > 2.4 ? 1 - (t - 2.4) / 0.8 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: h,
              borderRadius: i % 3 === 0 ? "50%" : 2,
              background: colors[i % colors.length],
              transform: `rotate(${rot}deg) rotateX(${rot * 1.3}deg)`,
              opacity: o,
            }}
          />
        );
      })}
    </div>
  );
};

// ---------- Partner Finder Filter Bar + Cards (matches app/partners/page.tsx 1:1!) ----------
export const Segmented: React.FC<{ options: string[]; active: number; s?: number }> = ({ options, active, s = 1 }) => {
  const w = 175 * s;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        background: "#141416",
        border: "1px solid #27272A",
        borderRadius: 14 * s,
        padding: 5 * s,
        fontFamily: inter,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5 * s,
          left: 5 * s + active * w,
          width: w,
          bottom: 5 * s,
          borderRadius: 10 * s,
          background: "#C8F31D",
        }}
      />
      {options.map((o, i) => {
        const on = Math.max(0, 1 - Math.abs(active - i));
        return (
          <div
            key={o}
            style={{
              position: "relative",
              width: w,
              textAlign: "center",
              padding: `${9 * s}px 0`,
              fontSize: 15 * s,
              fontWeight: 800,
              color: on > 0.5 ? "#1C2A00" : "#A1A1AA",
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
};

export const FilterChip: React.FC<{ icon?: "pin" | "cal" | "lvl"; label: string; p: number; on?: boolean }> = ({ icon, label, p, on }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 18px",
      borderRadius: 12,
      background: on ? "#FFFFFF" : "#141416",
      border: `1px solid ${on ? "#FFFFFF" : "#27272A"}`,
      color: on ? "#09090B" : "#A1A1AA",
      fontFamily: inter,
      fontWeight: 700,
      fontSize: 15,
      opacity: Math.min(1, p * 2),
      transform: `scale(${ip(p, [0, 1], [0.7, 1], backOut)})`,
    }}
  >
    {icon === "pin" && <MapPin s={16} c={on ? "#09090B" : "#71717A"} />}
    {icon === "cal" && <Calendar s={16} c={on ? "#09090B" : "#71717A"} />}
    {icon === "lvl" && <Zap s={16} c={on ? "#09090B" : "#71717A"} />}
    {label}
  </div>
);

/**
 * Exact Partner Finder Card (matches app/partners/page.tsx lines 112-215)
 */
export const FinderCard: React.FC<{
  who: string;
  name: string;
  handle?: string;
  city?: string;
  lvl: string;
  role: string;
  when: string;
  style: string;
  looking?: boolean;
  pulse?: number;
  w?: number;
  invite?: number;
}> = ({ who, name, handle = "@junr", city = "Manila, PH", lvl, role, when, style, looking = true, pulse = 0, w = 430, invite = 0 }) => {
  const k = w / 430;
  return (
    <div
      style={{
        width: w,
        borderRadius: 28 * k,
        padding: 24 * k,
        background: "#1C1C1E",
        border: `1.5px solid ${invite > 0.5 ? "#C8F31D" : "#27272A"}`,
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
        fontFamily: inter,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Status Pill + Style Tag (matches lines 116-127 of app/partners/page.tsx) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 * k }}>
          {looking && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8 * k,
                padding: `${5 * k}px ${12 * k}px`,
                borderRadius: 99,
                background: "rgba(16,185,129,0.14)",
                color: "#34D399",
                fontSize: 11.5 * k,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              <span style={{ position: "relative", width: 8 * k, height: 8 * k }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: 99, background: "#10B981" }} />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 99,
                    border: "2px solid #10B981",
                    transform: `scale(${1 + pulse * 1.6})`,
                    opacity: 1 - pulse,
                  }}
                />
              </span>
              Looking to Play
            </div>
          )}
          <span
            style={{
              padding: `${4 * k}px ${10 * k}px`,
              borderRadius: 8 * k,
              background: "#27272A",
              color: "#D4D4D8",
              fontSize: 11 * k,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {style}
          </span>
        </div>

        {/* Player Identity + SkillBadge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 * k }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
            <Avatar name={who} s={60 * k} r={16 * k} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 * k, fontFamily: display, fontWeight: 800, fontSize: 21 * k }}>
                {name} <ShieldCheck s={17 * k} c="#34C759" />
              </div>
              <div style={{ fontFamily: mono, fontSize: 13 * k, color: "#A1A1AA" }}>{handle}</div>
              <div style={{ fontSize: 12.5 * k, color: "#71717A", display: "flex", alignItems: "center", gap: 4 * k, marginTop: 2 * k }}>
                <MapPin s={13 * k} c="#71717A" /> {city}
              </div>
            </div>
          </div>
          <SkillRing s={62 * k} p={1} level={parseFloat(lvl)} />
        </div>

        {/* Primary Role */}
        <div style={{ marginBottom: 14 * k }}>
          <RoleChip role={role} primary size={12.5 * k} />
        </div>

        {/* Preferred Play Schedule Box (matches lines 179-192 of app/partners/page.tsx) */}
        <div
          style={{
            padding: 13 * k,
            borderRadius: 16 * k,
            background: "#141416",
            border: "1px solid #27272A",
            marginBottom: 18 * k,
          }}
        >
          <div
            style={{
              fontSize: 10.5 * k,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#71717A",
              display: "flex",
              alignItems: "center",
              gap: 6 * k,
              marginBottom: 4 * k,
            }}
          >
            <Calendar s={12 * k} c="#C8F31D" /> Preferred Play Schedule
          </div>
          <div style={{ fontSize: 13.5 * k, fontWeight: 600, color: "#E4E4E7" }}>{when}</div>
        </div>
      </div>

      {/* Footer Actions: View Passport + Compare */}
      <div style={{ display: "flex", gap: 8 * k, paddingTop: 14 * k, borderTop: "1px solid #27272A" }}>
        <div
          style={{
            flex: 1,
            height: 42 * k,
            borderRadius: 12 * k,
            background: invite > 0.5 ? "#C8F31D" : "#FFFFFF",
            color: invite > 0.5 ? "#1C2A00" : "#09090B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6 * k,
            fontWeight: 800,
            fontSize: 13.5 * k,
            transform: `scale(${1 - Math.sin(Math.min(1, invite * 2) * Math.PI) * 0.05})`,
          }}
        >
          {invite > 0.5 ? (
            <>
              <Check s={16 * k} c="#1C2A00" />
              <span>Partner Request Sent</span>
            </>
          ) : (
            <span>View Passport →</span>
          )}
        </div>
        <div
          style={{
            padding: `0 ${14 * k}px`,
            height: 42 * k,
            borderRadius: 12 * k,
            background: "#141416",
            border: "1px solid #27272A",
            color: "#D4D4D8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13 * k,
            fontWeight: 700,
          }}
        >
          Compare
        </div>
      </div>
    </div>
  );
};

// ---------- Dashboard Match Log & Win Rate (matches app/dashboard/page.tsx TAB 2 lines 405-504) ----------
export const MatchLog: React.FC<{ p: number; streak: number; w?: number }> = ({ p, streak, w = 1320 }) => {
  const k = w / 1320;
  const total = Math.round(ip(p, [0, 0.7], [24, 28]));
  const wins = Math.round(ip(p, [0, 0.7], [17, 21]));
  const rate = Math.round(ip(p, [0, 0.8], [71, 75]));

  const matches = [
    {
      type: "DOUBLES",
      opponents: "Chloe Tan & Mei Lin",
      partner: "Jun Reyes",
      score: "11-7, 11-9",
      notes: "Solid third-shot drops; neutralized power drives at the kitchen line.",
      date: "Today · BGC Court 2",
      win: true,
      isNew: true,
    },
    {
      type: "MIXED",
      opponents: "Carlos Mendoza & Sofia Lim",
      partner: "Jun Reyes",
      score: "11-5, 11-6",
      notes: "High percentage cross-court dinking and backhand roll resets.",
      date: "2 days ago · Cebu Smash",
      win: true,
      isNew: false,
    },
    {
      type: "DOUBLES",
      opponents: "Marcus Lee & Kenji Tanaka",
      partner: "Elena Garcia",
      score: "11-8, 9-11, 11-7",
      notes: "Won fire-fight exchanges in game 3 after switching sides.",
      date: "5 days ago · Visayas Open",
      win: true,
      isNew: false,
    },
  ];

  return (
    <div style={{ width: w, fontFamily: inter, color: "#fff", display: "grid", gridTemplateColumns: "380px 1fr", gap: 24 * k }}>
      {/* Left Column: Dashboard Passport Summary Card (matches app/dashboard/page.tsx lines 180-262) */}
      <div
        style={{
          borderRadius: 28 * k,
          background: "#1C1C1E",
          border: "1.5px solid #27272A",
          padding: 26 * k,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 * k, marginBottom: 20 * k }}>
            <Avatar name="maya" s={68 * k} r={18 * k} ring="#C8F31D" />
            <div>
              <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 800 }}>Maria Santos</div>
              <div style={{ fontFamily: mono, fontSize: 13 * k, color: "#A1A1AA" }}>@marias · 4.0 Advanced</div>
            </div>
          </div>

          {/* 3-col Quick Stats Grid (Followers | Win Rate | Streak) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8 * k,
              padding: `${14 * k}px 0`,
              borderTop: "1px solid #27272A",
              borderBottom: "1px solid #27272A",
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 900 }}>142</div>
              <div style={{ fontSize: 10 * k, fontWeight: 800, color: "#71717A", textTransform: "uppercase" }}>Followers</div>
            </div>
            <div style={{ borderLeft: "1px solid #27272A", borderRight: "1px solid #27272A" }}>
              <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 900, color: "#34D399" }}>{rate}%</div>
              <div style={{ fontSize: 10 * k, fontWeight: 800, color: "#71717A", textTransform: "uppercase" }}>Win Rate</div>
            </div>
            <div>
              <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 900, color: "#C8F31D" }}>+{Math.max(1, Math.round(streak))}W</div>
              <div style={{ fontSize: 10 * k, fontWeight: 800, color: "#71717A", textTransform: "uppercase" }}>Streak</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 * k }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 * k, marginBottom: 8 * k }}>
            <span style={{ color: "#A1A1AA" }}>Partner Status</span>
            <span style={{ color: "#34D399", fontWeight: 700 }}>● Looking to play</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 * k }}>
            <span style={{ color: "#A1A1AA" }}>Home Club</span>
            <span style={{ color: "#fff", fontWeight: 700 }}>Cebu Smash Club</span>
          </div>
        </div>
      </div>

      {/* Right Column: Match Record & Win Rate Tab (matches lines 405-498 of app/dashboard/page.tsx) */}
      <div
        style={{
          borderRadius: 28 * k,
          background: "#1C1C1E",
          border: "1.5px solid #27272A",
          padding: 26 * k,
        }}
      >
        {/* Tab Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 * k }}>
          <div>
            <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 800 }}>Match Record &amp; Win Rate</div>
            <div style={{ fontSize: 13 * k, color: "#A1A1AA" }}>Casual and competitive matches logged with partners and opponents.</div>
          </div>
          <div
            style={{
              padding: `${9 * k}px ${18 * k}px`,
              borderRadius: 12 * k,
              background: "#C8F31D",
              color: "#1C2A00",
              fontSize: 13.5 * k,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 6 * k,
            }}
          >
            <span>+ Log Match</span>
          </div>
        </div>

        {/* 4-column Match Stats Banner */}
        <div
          style={{
            borderRadius: 18 * k,
            background: "#121214",
            border: "1px solid #27272A",
            padding: `${14 * k}px ${20 * k}px`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            textAlign: "center",
            marginBottom: 16 * k,
          }}
        >
          <div>
            <div style={{ fontSize: 10.5 * k, fontWeight: 800, textTransform: "uppercase", color: "#71717A" }}>Total</div>
            <div style={{ fontFamily: display, fontSize: 24 * k, fontWeight: 900 }}>{total}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5 * k, fontWeight: 800, textTransform: "uppercase", color: "#71717A" }}>Wins</div>
            <div style={{ fontFamily: display, fontSize: 24 * k, fontWeight: 900, color: "#34D399" }}>{wins}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5 * k, fontWeight: 800, textTransform: "uppercase", color: "#71717A" }}>Losses</div>
            <div style={{ fontFamily: display, fontSize: 24 * k, fontWeight: 900, color: "#A1A1AA" }}>7</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5 * k, fontWeight: 800, textTransform: "uppercase", color: "#71717A" }}>Win %</div>
            <div style={{ fontFamily: display, fontSize: 24 * k, fontWeight: 900, color: "#C8F31D" }}>{rate}%</div>
          </div>
        </div>

        {/* Match List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 * k }}>
          {matches.map((m, i) => {
            const q = ip(p * 3, [i * 0.5, i * 0.5 + 1.2], [0, 1], expoOut);
            return (
              <div
                key={i}
                style={{
                  padding: `${13 * k}px ${18 * k}px`,
                  borderRadius: 18 * k,
                  background: m.isNew ? "rgba(200,243,29,0.06)" : "#141416",
                  border: `1px solid ${m.isNew ? "rgba(200,243,29,0.45)" : "#27272A"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: q,
                  transform: `translateY(${(1 - q) * 18}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
                  <div
                    style={{
                      width: 38 * k,
                      height: 38 * k,
                      borderRadius: 12 * k,
                      background: "rgba(16,185,129,0.16)",
                      color: "#34D399",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                    }}
                  >
                    <Check s={20 * k} c="#34D399" />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 * k }}>
                      <span
                        style={{
                          padding: "2px 7px",
                          borderRadius: 5,
                          background: "#27272A",
                          color: "#D4D4D8",
                          fontSize: 10.5 * k,
                          fontWeight: 800,
                        }}
                      >
                        {m.type}
                      </span>
                      <span style={{ fontSize: 15 * k, fontWeight: 800, color: "#fff" }}>vs {m.opponents}</span>
                      <span
                        style={{
                          fontFamily: mono,
                          fontSize: 13.5 * k,
                          fontWeight: 800,
                          color: "#C8F31D",
                          marginLeft: 6 * k,
                        }}
                      >
                        {m.score}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5 * k, color: "#A1A1AA", marginTop: 3 * k }}>
                      Partner: <strong style={{ color: "#E4E4E7" }}>{m.partner}</strong> · &ldquo;{m.notes}&rdquo;
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: mono, fontSize: 11.5 * k, color: "#71717A" }}>{m.date}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

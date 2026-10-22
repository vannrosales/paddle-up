import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, inter, mono } from "../theme";
import { ip, lin, expoOut, expoIn, expoInOut, backOut, shake, smooth } from "../lib/anim";
import { Stage, CourtFloor, LightSweep } from "../components/Stage";
import { Kinetic, SectionTag } from "../components/Kinetic";
import { LimeShader } from "../components/LimeShader";
import { Pickleball, PassportCard, AppNavbar, Avatar, SkillRing, RoleChip, Cursor } from "../components/Passport";
import { ShieldCheck, MapPin, Trophy } from "../components/Icons";

/**
 * =============== SCENE 1 — PLAYER DIRECTORY SEARCH & CLICK (global 0–100) =================
 * Instead of a generic marketing slogan, we open immediately on the live PaddleUp Player Directory (`/players`)
 * as a pickleball player searches `@marias · 4.0+ Dinker` and clicks into Maria Santos's verified Passport!
 */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const sk = shake(f, 3, 12, 16);
  const skClick = shake(f, 52, 10, 12);

  // Instant frame-0 impact: pickleball smashes into the directory search bar at f=3
  const flash = ip(f, [1, 4, 12], [0, 0.55, 0], (t) => t);
  const ring = ip(f, [2, 20], [0, 1], expoOut);

  // Typing query inside real Directory search bar
  const fullQuery = "Maria Santos · 4.0 Dinker · Cebu";
  const typedLen = Math.round(fullQuery.length * ip(f, [4, 34], [0.25, 1]));
  const query = fullQuery.slice(0, typedLen);

  // Cursor moves to Maria Santos's card center and clicks at f=53
  const cursorX = ip(f, [18, 50], [1360, 411], expoOut);
  const cursorY = ip(f, [18, 50], [320, 520], expoOut);
  const click = ip(f, [50, 53, 58], [0, 1, 0], smooth);

  // Camera dives into Maria's card after click
  const dive = ip(f, [54, 72], [0, 1], expoIn);

  const directoryPlayers = [
    {
      who: "maya",
      name: "Maria Santos",
      handle: "@marias",
      city: "Cebu City, PH",
      lvl: 4.0,
      role: "Dinker / Soft-Game Specialist",
      secRole: "Coach / Instructor",
      club: "Cebu Smash Pickleball Club",
      medals: "3 achievements",
      bio: "Soft-game tactician, 3rd-shot drop specialist & Visayas Open 4.0 Gold.",
    },
    {
      who: "kenji",
      name: "Jun Reyes",
      handle: "@junr",
      city: "Manila, PH",
      lvl: 4.5,
      role: "Power Hitter (Banger)",
      secRole: "Left-Side Player",
      club: "BGC Kitchen Crew",
      medals: "2 achievements",
      bio: "Middle-hunter, driving forehand speed-ups and fast kitchen fire-fights.",
    },
    {
      who: "ama",
      name: "Chloe Tan",
      handle: "@chloet",
      city: "Singapore",
      lvl: 5.0,
      role: "All-Court Player",
      secRole: "Coach / Instructor",
      club: "Marina Bay Pickleballers",
      medals: "1 achievement",
      bio: "Precision drops and resets. Asia Pacific Pro Doubles Gold Medalist.",
    },
  ];

  return (
    <Stage f={f} glow={0.95 + flash}>
      <AbsoluteFill
        style={{
          transform: `translate(${sk.x + skClick.x}px, ${sk.y + skClick.y}px) scale(${1 + dive * 0.65})`,
          transformOrigin: "30% 65%",
          opacity: 1 - ip(f, [62, 72], [0, 1]),
        }}
      >
        <CourtFloor f={f} o={0.32} speed={2.2} />

        {/* 3D Tilted Browser Window showing `/players` (Player Directory) */}
        <AbsoluteFill style={{ perspective: 1800, justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: 1680,
              height: 940,
              borderRadius: 28,
              background: "#0B0C0E",
              border: "1.5px solid rgba(255,255,255,0.14)",
              boxShadow: "0 50px 130px rgba(0,0,0,0.75)",
              overflow: "hidden",
              transform: `rotateX(${ip(f, [0, 45], [12, 3], expoOut)}deg) rotateY(${ip(f, [0, 45], [-8, 0], expoOut)}deg)`,
            }}
          >
            <AppNavbar activeNav="Players" route="paddleup.app/players?role=dinker&skill=4.0" />

            <div style={{ padding: "28px 44px", fontFamily: inter, color: "#fff" }}>
              {/* Directory Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 99,
                        background: "rgba(200,243,29,0.15)",
                        color: "#C8F31D",
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      LIVE APP DEMO · PLAYER DIRECTORY
                    </span>
                  </div>
                  <div style={{ fontFamily: display, fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em", marginTop: 6 }}>
                    Player Directory
                  </div>
                  <div style={{ fontSize: 15, color: "#A1A1AA", marginTop: 2 }}>
                    Discover verified pickleball partners, dinking specialists, tournament medalists, and IPTPA coaches.
                  </div>
                </div>
                <div style={{ fontFamily: mono, fontSize: 14, color: "#C8F31D", fontWeight: 700 }}>
                  Showing 3 verified players
                </div>
              </div>

              {/* Filter & Search Bar (matches app/players/page.tsx lines 94-164) */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 22,
                  background: "#1C1C1E",
                  border: "1.5px solid #27272A",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "12px 18px",
                    borderRadius: 14,
                    background: "#121214",
                    border: "1.5px solid #C8F31D",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    🔍 {query}
                    <span style={{ display: "inline-block", width: 2, height: 18, background: "#C8F31D", marginLeft: 3, verticalAlign: "middle" }} />
                  </span>
                  <span style={{ fontFamily: mono, fontSize: 12, color: "#C8F31D" }}>Filter Active</span>
                </div>
                {["Role: Dinker / Soft-Game", "Skill: 4.0+ (Advanced)", "City: All Cities"].map((pill, idx) => (
                  <div
                    key={pill}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 14,
                      background: idx < 2 ? "rgba(200,243,29,0.14)" : "#121214",
                      border: `1px solid ${idx < 2 ? "rgba(200,243,29,0.5)" : "#27272A"}`,
                      color: idx < 2 ? "#C8F31D" : "#D4D4D8",
                      fontSize: 13.5,
                      fontWeight: 700,
                    }}
                  >
                    {pill}
                  </div>
                ))}
              </div>

              {/* 3-Column PlayerCard Grid (matches components/player-card.tsx) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {directoryPlayers.map((pl, i) => {
                  const cardIn = ip(f, [2 + i * 4, 16 + i * 4], [0, 1], backOut);
                  const isTarget = i === 0;
                  const highlight = isTarget && f >= 42;
                  return (
                    <div
                      key={pl.handle}
                      style={{
                        padding: 24,
                        borderRadius: 24,
                        background: "#1C1C1E",
                        border: `2px solid ${highlight ? "#C8F31D" : "#27272A"}`,
                        boxShadow: highlight ? "0 0 40px rgba(200,243,29,0.3)" : "0 20px 50px rgba(0,0,0,0.4)",
                        opacity: cardIn,
                        transform: `translateY(${(1 - cardIn) * 30}px) scale(${highlight ? 1.02 - click * 0.04 : 1})`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <Avatar name={pl.who} s={64} r={16} ring={highlight ? "#C8F31D" : undefined} />
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: display, fontSize: 21, fontWeight: 800 }}>
                                {pl.name} <ShieldCheck s={18} c="#34C759" />
                              </div>
                              <div style={{ fontFamily: mono, fontSize: 13, color: "#A1A1AA" }}>{pl.handle}</div>
                              <div style={{ fontSize: 12.5, color: "#71717A", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                                <MapPin s={13} c="#71717A" /> {pl.city}
                              </div>
                            </div>
                          </div>
                          <SkillRing s={64} p={1} level={pl.lvl} />
                        </div>

                        <p style={{ fontSize: 13.5, color: "#D4D4D8", lineHeight: 1.45, marginBottom: 14 }}>{pl.bio}</p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                          <RoleChip role={pl.role} primary size={12} />
                          <RoleChip role={pl.secRole} size={12} />
                        </div>
                      </div>

                      <div
                        style={{
                          paddingTop: 12,
                          borderTop: "1px solid #27272A",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 12.5,
                          color: "#A1A1AA",
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Trophy s={14} c="#F59E0B" /> {pl.medals}
                        </span>
                        <span style={{ fontWeight: 700, color: "#E4E4E7" }}>{pl.club}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AbsoluteFill>

        {/* Shockwave & Pickleball on initial frame-0 entry */}
        {f >= 2 && f < 20 && (
          <div
            style={{
              position: "absolute",
              left: 520,
              top: 280,
              width: 180,
              height: 180,
              marginLeft: -90,
              marginTop: -90,
              borderRadius: "50%",
              border: `${8 * (1 - ring)}px solid rgba(200,243,29,${1 - ring})`,
              transform: `scale(${1 + ring * 8})`,
              pointerEvents: "none",
            }}
          />
        )}
        {f < 14 && (
          <div
            style={{
              position: "absolute",
              left: ip(f, [0, 4, 14], [180, 520, 1420]),
              top: ip(f, [0, 4, 14], [140, 280, 120]),
              transform: `translate(-50%,-50%) scale(${ip(f, [0, 4, 14], [0.9, 1.25, 0.3])})`,
              pointerEvents: "none",
            }}
          >
            <Pickleball s={150} rot={f * 32} />
          </div>
        )}

        {f >= 16 && f <= 66 && <Cursor x={cursorX} y={cursorY} press={click} hand />}
      </AbsoluteFill>
    </Stage>
  );
};

// =============== SCENE 2 — SHADER PILL ROUTE TRANSITION → `/p/marias` (global 60–165) =================
export const S2Logo: React.FC = () => {
  const g = useCurrentFrame();
  const land = ip(g, [0, 8], [0, 1], expoIn);
  const bx = (1 - land) * 600,
    by = (1 - land) * -360;
  const squash = ip(g, [8, 11, 16], [0, 1, 0], smooth);
  const m = ip(g, [9, 26], [0, 1], expoOut);
  let w = 150 + m * (1080 - 150),
    h = 150 + m * (185 - 150);
  const ex = ip(g, [76, 92], [0, 1], expoInOut);
  w = w + ex * (2400 - w);
  h = h + ex * (1400 - h);
  const r = (1 - ex) * (h / 2) + ex * 0;
  const rt = ip(g, [92, 105], [0, 1], expoInOut);
  const hFinal = h * (1 - rt) + 10 * rt;
  const yOff = rt * (540 - 5);
  const logoIn = ip(g, [16, 34], [0, 1]);
  const contentOut = ip(g, [72, 82], [0, 1], expoIn);
  const glint = ip(g, [44, 70], [0, 1], smooth);
  const sk = shake(g, 8, 10, 12);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px)` }}>
        {g < 14 && (
          <div
            style={{
              position: "absolute",
              left: 960 + bx,
              top: 540 + by,
              transform: `translate(-50%,-50%) scale(${1 + squash * 0.25}, ${1 - squash * 0.25})`,
              opacity: ip(g, [10, 14], [1, 0]),
            }}
          >
            <Pickleball s={140} rot={g * 30} />
          </div>
        )}
        {g >= 9 && (
          <div style={{ position: "absolute", left: 960 - w / 2, top: 540 - hFinal / 2 + yOff, width: w, height: hFinal }}>
            <LimeShader w={w} h={hFinal} r={Math.min(r, hFinal / 2)} pad={ex > 0.2 ? 0 : 220} glow={(1 - ex) * 0.85} glint={glint} flow={1.4} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                opacity: logoIn * (1 - contentOut),
                transform: `scale(${0.88 + logoIn * 0.12 + contentOut * 0.25})`,
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 26,
                  background: "#1C2A00",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: display,
                  fontWeight: 900,
                  fontSize: 56,
                  color: "#C8F31D",
                }}
              >
                P
              </div>
              <div style={{ fontFamily: display, fontWeight: 900, fontSize: 108, letterSpacing: "-0.05em", color: "#1C2A00", lineHeight: 1 }}>
                PaddleUp
              </div>
            </div>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: 685, opacity: 1 - contentOut, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 28px",
              borderRadius: 99,
              background: "rgba(24,24,27,0.92)",
              border: "1.5px solid rgba(200,243,29,0.5)",
              fontFamily: mono,
              fontSize: 26,
              fontWeight: 700,
              color: "#C8F31D",
              opacity: ip(g, [30, 44], [0, 1]),
            }}
          >
            <span>Opening paddleup.app/p/marias · Coming Soon 2026</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =============== SCENE 3 — PLAYER PASSPORT WALKTHROUGH (`/p/marias`, global 145–400) =================
export const S3Passport: React.FC = () => {
  const p = useCurrentFrame();
  const enter = ip(p, [0, 32], [0, 1], expoOut);
  const drift = lin(p, [30, 225], [0, 1]);
  const focusSpecs = ip(p, [98, 126], [0, 1], expoInOut);
  const focusMedals = ip(p, [145, 172], [0, 1], expoInOut);
  const clickShare = ip(p, [210, 232], [0, 1], expoInOut);

  // Smooth 3D browser camera movement inspecting the real Profile page
  const rx = (1 - enter) * 26 + 5 - focusSpecs * 2 + focusMedals * 4;
  const ry = (1 - enter) * -28 - 8 + drift * 14 - clickShare * 10;
  const tz = (1 - enter) * -650 + focusSpecs * 80 - focusMedals * 40;
  const ty = (1 - enter) * 90 - focusSpecs * 50 - focusMedals * 95 + clickShare * 110;

  // Cursor moves directly to the center of "Share Pass" button at top right
  const cursorX = ip(p, [195, 224], [1100, 1680], expoOut);
  const cursorY = ip(p, [195, 224], [580, 210], expoOut);
  const sharePress = ip(p, [222, 226, 232], [0, 1, 0], smooth);

  const cardP = {
    avatar: ip(p, [8, 24], [0, 1]),
    ring: ip(p, [18, 64], [0, 1], (t) => 1 - Math.pow(1 - t, 3)),
    chips: lin(p, [58, 96], [0, 3]),
    specs: lin(p, [96, 136], [0, 1]),
    podium: lin(p, [138, 182], [0, 1]),
    shareHover: ip(p, [214, 226], [0, 1]),
  };

  return (
    <Stage f={p + 145} glow={1} glowY={110}>
      <CourtFloor f={p} o={0.26} speed={0.6} />
      <LightSweep p={lin(p, [0, 60], [0, 1])} o={0.45} />

      <AbsoluteFill style={{ perspective: 1900, justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 1620,
            borderRadius: 28,
            background: "#0B0C0E",
            border: "1.5px solid rgba(255,255,255,0.14)",
            boxShadow: "0 55px 135px rgba(0,0,0,0.78)",
            overflow: "hidden",
            transformStyle: "preserve-3d",
            transform: `translate3d(0px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
          }}
        >
          <AppNavbar activeNav="Players" route="paddleup.app/p/marias" />
          <div style={{ padding: "26px 46px 38px" }}>
            <PassportCard p={cardP} w={1528} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Clean top header banner outside browser window so NOTHING overlaps the card text */}
      <div style={{ position: "absolute", left: 70, top: 44, zIndex: 40 }}>
        <SectionTag f={p} start={6} label="Player Passport · /p/marias" num="01" />
      </div>

      <div style={{ position: "absolute", right: 70, top: 44, display: "flex", gap: 10, zIndex: 40 }}>
        <div
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(24,24,27,0.92)",
            border: "1px solid rgba(200,243,29,0.5)",
            fontFamily: mono,
            fontSize: 13,
            fontWeight: 700,
            color: "#C8F31D",
            opacity: ip(p, [30, 44], [0, 1]),
          }}
        >
          4.0 Advanced · Dinker Primary
        </div>
        <div
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(24,24,27,0.92)",
            border: "1px solid rgba(245,158,11,0.5)",
            fontFamily: mono,
            fontSize: 13,
            fontWeight: 700,
            color: "#FBBF24",
            opacity: ip(p, [130, 144], [0, 1]),
          }}
        >
          Visayas Open Gold Verified
        </div>
      </div>

      {p >= 195 && <Cursor x={cursorX} y={cursorY} press={sharePress} hand />}
    </Stage>
  );
};

export const Callout: React.FC<{ x: number; y: number; p: number; label: string; light?: boolean }> = ({ x, y, p, label, light }) => {
  if (p <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) scale(${0.92 + 0.08 * p})`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 22px",
        borderRadius: 999,
        background: light ? "rgba(255,255,255,0.94)" : "rgba(18,18,20,0.92)",
        border: `1.5px solid ${light ? "rgba(0,0,0,0.12)" : "rgba(200,243,29,0.55)"}`,
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 20,
        color: light ? "#1C1C1E" : "#E8FF9A",
        boxShadow: "0 20px 45px rgba(0,0,0,0.5)",
        pointerEvents: "none",
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: 5, background: "#C8F31D", boxShadow: "0 0 12px #C8F31D" }} />
      {label}
    </div>
  );
};

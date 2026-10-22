import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, inter, mono } from "../theme";
import { ip, lin, expoOut, expoIn, expoInOut, backOut, shake, smooth } from "../lib/anim";
import { Stage, CourtFloor, LightSweep } from "../components/Stage";
import { Kinetic, SectionTag } from "../components/Kinetic";
import { ShaderButton } from "../components/LimeShader";
import { Cursor, AppNavbar, PassportCard } from "../components/Passport";
import { SharePassModalView, AddToWallet, OGCard, Dimension, ChatThread } from "../components/Share";
import { EndorseModalView, EndorseRow, BadgeTile, Confetti } from "../components/Community";
import { Trophy } from "../components/Icons";
import { Callout } from "./A";

/** Signature 4-point star burst transition (inspired by reference 23.5s) */
export const StarBurstWipe: React.FC<{ p: number; color?: string }> = ({ p, color = "#C8F31D" }) => {
  if (p <= 0 || p >= 1) return null;
  const sc = ip(p, [0, 0.5, 1], [0.05, 18, 45], expoInOut);
  const op = ip(p, [0, 0.25, 0.65, 1], [0, 1, 1, 0]);
  const rot = p * 90;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none", opacity: op, zIndex: 100 }}>
      <svg width={260} height={260} viewBox="-100 -100 200 200" style={{ transform: `scale(${sc}) rotate(${rot}deg)` }}>
        <path d="M 0 -95 Q 0 0 95 0 Q 0 0 0 95 Q 0 0 -95 0 Q 0 0 0 -95 Z" fill={color} />
      </svg>
    </AbsoluteFill>
  );
};

// =============== SCENE 4 — SHARE PASS MODAL & DYNAMIC OG CARDS (global 385–630, len 245) =================
export const S4Share: React.FC = () => {
  const f = useCurrentFrame();
  const modalIn = ip(f, [0, 20], [0, 1], backOut);
  const qrReveal = ip(f, [6, 34], [0, 1], expoOut);
  const scan = f >= 20 && f <= 60 ? lin(f, [20, 60], [0, 1]) : -1;

  const toOG = ip(f, [82, 106], [0, 1], expoInOut);
  const toChat = ip(f, [146, 170], [0, 1], expoInOut);
  const exitWipe = ip(f, [222, 245], [0, 1]);

  // Interactive cursor inside ShareCardModal: clicks "Copy" at f=48 (812, 746), then "Share to Apps" at f=76 (587, 796)
  const copyPress = ip(f, [44, 48, 54], [0, 1, 0], smooth);
  const sharePress = ip(f, [71, 76, 82], [0, 1, 0], smooth);
  const cursorX = ip(f, [22, 48, 62, 76], [1420, 812, 812, 587], expoOut);
  const cursorY = ip(f, [22, 48, 62, 76], [300, 746, 746, 796], expoOut);

  return (
    <Stage f={f + 385} glow={1} hue="blue" glowY={108}>
      <CourtFloor f={f} o={0.24} speed={0.8} />
      <LightSweep p={lin(f, [80, 130], [0, 1])} color="rgba(10,132,255,0.32)" o={0.65} />

      <div style={{ position: "absolute", left: 70, top: 44, zIndex: 40 }}>
        <SectionTag f={f} start={2} label="Share Pass Modal · QR & 1200×630 OG" num="02" />
      </div>

      {/* PHASE 1: ShareCardModal opened over the Profile App Window */}
      <AbsoluteFill
        style={{
          perspective: 1800,
          opacity: 1 - toOG,
          transform: `translateX(${-toOG * 420}px) scale(${1 - toOG * 0.12})`,
          pointerEvents: "none",
        }}
      >
        {/* Dimmed background app viewport */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 0.28, filter: "blur(6px)" }}>
          <div style={{ width: 1600, borderRadius: 28, overflow: "hidden", background: "#0B0C0E" }}>
            <AppNavbar activeNav="Players" route="paddleup.app/p/marias" />
            <div style={{ padding: 36 }}>
              <PassportCard p={{ avatar: 1, ring: 1, chips: 3, specs: 1, podium: 1 }} w={1520} />
            </div>
          </div>
        </AbsoluteFill>

        {/* Left: Live ShareCardModal popup */}
        <div
          style={{
            position: "absolute",
            left: 590,
            top: 550,
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * modalIn}) rotateY(${(1 - modalIn) * -18 + Math.sin(f / 28) * 4}deg) rotateX(4deg)`,
          }}
        >
          <SharePassModalView w={620} qr={qrReveal} scan={scan} copied={f >= 48} copyPress={copyPress} sharePress={sharePress} />
        </div>

        {/* Right: Court QR Check-in + Apple Wallet */}
        <div style={{ position: "absolute", left: 1000, top: 230, width: 780 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 14px",
              borderRadius: 99,
              background: "rgba(200,243,29,0.14)",
              color: "#C8F31D",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            OPEN-PLAY COURT CHECK-IN
          </div>
          <Kinetic f={f} start={8} stagger={4} size={74} align="left" words={["Scan", "at", "the", { t: "kitchen.", color: C.lime }]} />
          <div style={{ fontFamily: inter, fontSize: 24, color: "#D4D4D8", marginTop: 16, lineHeight: 1.45, maxWidth: 680 }}>
            Every player gets a shareable QR Pass with verified skill rating, primary role, paddle setup, and club roster.
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 18, alignItems: "center" }}>
            <AddToWallet s={1.0} press={0} />
            <div
              style={{
                padding: "14px 22px",
                borderRadius: 16,
                background: "#1C1C1E",
                border: "1px solid #27272A",
                fontFamily: mono,
                fontSize: 16,
                color: "#C8F31D",
                fontWeight: 700,
              }}
            >
              ✓ Instant QR Club Check-In
            </div>
          </div>
        </div>

        {f >= 20 && f <= 84 && <Cursor x={cursorX} y={cursorY} press={Math.max(copyPress, sharePress)} hand />}
      </AbsoluteFill>

      {/* PHASE 2: Runtime 1200x630 Open Graph Card (`app/p/[username]/opengraph-image.tsx`) */}
      {f >= 78 && f <= 178 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: toOG * (1 - toChat),
            transform: `scale(${0.86 + toOG * 0.14 - toChat * 0.2}) translateY(${toChat * -140}px)`,
          }}
        >
          <div style={{ position: "absolute", top: 96, textAlign: "center" }}>
            <div style={{ fontFamily: mono, fontSize: 18, color: "#C8F31D", fontWeight: 700, marginBottom: 6 }}>
              /p/marias/opengraph-image · Generated at runtime
            </div>
            <Kinetic f={f} start={84} stagger={4} size={56} words={["Dynamic", { t: "1200×630", color: C.lime }, "Social Preview Card"]} />
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 145,
              boxShadow: "0 55px 135px rgba(0,0,0,0.78), 0 0 0 2px rgba(200,243,29,0.45)",
              borderRadius: 28,
            }}
          >
            <OGCard w={960} p={ip(f, [88, 112], [0, 1])} />
            <Dimension w={960} h={960 * (630 / 1200)} p={ip(f, [94, 120], [0, 1])} label="1200 px · next/og runtime" labelH="630 px" />
          </div>
        </AbsoluteFill>
      )}

      {/* PHASE 3: Direct Social Sharing in Open-Play Group Chat */}
      {f >= 142 && (
        <AbsoluteFill
          style={{
            opacity: toChat,
            transform: `translateY(${(1 - toChat) * 70}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 95, top: 290, width: 720 }}>
            <div
              style={{
                display: "inline-flex",
                padding: "6px 14px",
                borderRadius: 99,
                background: "rgba(10,132,255,0.18)",
                color: "#60A5FA",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              DOUBLES GROUP CHAT PREVIEW
            </div>
            <Kinetic f={f} start={150} stagger={4} size={72} align="left" words={["Drop", "your", "link", "in"]} />
            <div style={{ height: 10 }} />
            <Kinetic f={f} start={160} stagger={4} size={72} align="left" words={[{ t: "open-play", color: C.lime }, { t: "chat.", color: C.lime }]} />
            <div style={{ fontFamily: inter, fontSize: 22, color: "#A1A1AA", marginTop: 20, lineHeight: 1.45, maxWidth: 620 }}>
              Paste your URL into WhatsApp, iMessage, Viber, or Messenger — your 4.0 rating, primary role, and verified medals unfurl automatically.
            </div>
          </div>
          <div style={{ position: "absolute", left: 930, top: 140 }}>
            <ChatThread f={f} start={148} w={860} />
          </div>
        </AbsoluteFill>
      )}

      {/* 4-point star morph wipe into Scene 5 */}
      <StarBurstWipe p={exitWipe} color="#C8F31D" />
    </Stage>
  );
};

// =============== SCENE 5 — INTERACTIVE ENDORSE MODAL & BADGE UNLOCK (global 615–860, len 245) =================
export const S5Badges: React.FC = () => {
  const f = useCurrentFrame();
  const toBadges = ip(f, [112, 132], [0, 1], expoInOut);
  const sk = shake(f, 68, 12, 12);
  const sk2 = shake(f, 124, 14, 14);
  const exit = ip(f, [230, 245], [0, 1], expoIn);

  // Typed note inside EndorseModal
  const fullNote = "Maria has the steadiest backhand dink in Cebu. Unshakeable in kitchen fire-fights!";
  const typedChars = Math.round(fullNote.length * ip(f, [10, 48], [0.2, 1]));
  const submitPress = ip(f, [58, 63, 69], [0, 1, 0], smooth);
  const successP = ip(f, [64, 78], [0, 1], expoOut);

  // Cursor moves precisely to center of "Submit Endorsement" button at (435, 654)
  const cursorX = ip(f, [18, 56], [780, 435], expoOut);
  const cursorY = ip(f, [18, 56], [340, 654], expoOut);

  const endorsements = [
    {
      who: "kenji",
      name: "Jun Reyes",
      skill: "4.5",
      what: "Steadiest backhand dink in Cebu. Always calm in fire-fights.",
      tag: "4.0 Dinking & Resets",
      start: 8,
    },
    {
      who: "ama",
      name: "Chloe Tan",
      skill: "5.0",
      what: "Her positioning tips transformed my transition-zone footwork.",
      tag: "Dinker & Coach",
      start: 24,
    },
    {
      who: "rob",
      name: "Carlos Mendoza",
      skill: "3.5",
      what: "Calls line shots with 100% honesty. True ambassador of the sport.",
      tag: "Court Etiquette",
      start: 40,
    },
  ];

  // Exact 5 badges from lib/constants/badges.ts
  const badges: Array<{ title: string; desc: string; earned: string; icon: string; g: [string, string] }> = [
    {
      title: "Podium Finisher",
      desc: "Won gold, silver, or bronze medal in a tournament",
      earned: "Earned Aug 2024",
      icon: "trophy",
      g: ["#FBBF24", "#D97706"],
    },
    {
      title: "Peer Endorsed",
      desc: "Vouched for by fellow players for skill & sportsmanship",
      earned: "Just Unlocked!",
      icon: "star",
      g: ["#C8F31D", "#65A30D"],
    },
    {
      title: "Kitchen Master",
      desc: "Praised for premier soft-game dinking and resets",
      earned: "Earned Feb 2024",
      icon: "flame",
      g: ["#F87171", "#DC2626"],
    },
    {
      title: "Certified Instructor",
      desc: "Holds accredited coaching credentials (IPTPA Level 1)",
      earned: "Earned Nov 2023",
      icon: "shield",
      g: ["#60A5FA", "#2563EB"],
    },
    {
      title: "Club Regular",
      desc: "Active roster member of Cebu Smash Pickleball Club",
      earned: "Earned Jan 2024",
      icon: "users",
      g: ["#34D399", "#059669"],
    },
  ];

  return (
    <Stage f={f + 615} glow={1}>
      <AbsoluteFill
        style={{
          transform: `translate(${sk.x + sk2.x}px, ${sk.y + sk2.y}px) scale(${1 + exit * 0.2})`,
          opacity: 1 - exit,
        }}
      >
        <CourtFloor f={f} o={0.28} speed={0.9} />

        <div style={{ position: "absolute", left: 70, top: 44, zIndex: 40 }}>
          <SectionTag f={f} start={2} label="Peer Endorsements & Badges · EndorseModal" num="03" />
        </div>

        {/* PART A (0–122): Live Interactive EndorseModal + Received Peer Endorsements */}
        <AbsoluteFill
          style={{
            opacity: 1 - toBadges,
            transform: `translateY(${-toBadges * 80}px) scale(${1 - toBadges * 0.08})`,
          }}
        >
          {/* Left: Real EndorseModal */}
          <div style={{ position: "absolute", left: 110, top: 150 }}>
            <EndorseModalView
              w={680}
              selectedKind="skill"
              claimText="4.0 Dinking & Soft Resets"
              noteText={fullNote.slice(0, typedChars)}
              submitPress={submitPress}
              successP={successP}
            />
          </div>

          {/* Right: Received Endorsements Feed */}
          <div style={{ position: "absolute", left: 860, top: 155, width: 950 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: display, fontSize: 34, fontWeight: 900, color: "#fff" }}>
                  Peer-Vouched Skill &amp; Roles
                </div>
                <div style={{ fontSize: 16, color: "#A1A1AA", marginTop: 2 }}>
                  Doubles partners and opponents verify your actual court level and kitchen control.
                </div>
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: 16,
                  background: "rgba(200,243,29,0.14)",
                  border: "1.5px solid rgba(200,243,29,0.45)",
                  fontFamily: display,
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#C8F31D",
                }}
              >
                +{f >= 66 ? 24 : 23} Vouches
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {endorsements.map((e, i) => (
                <EndorseRow key={i} {...e} p={ip(f, [e.start, e.start + 16], [0, 1], backOut)} w={940} />
              ))}
            </div>
          </div>

          {f >= 18 && f <= 74 && <Cursor x={cursorX} y={cursorY} press={submitPress} hand />}
          <Confetti f={f} start={65} x={435} y={654} n={85} power={0.95} />
        </AbsoluteFill>

        {/* Star burst on transition to Badges & Accolades Grid */}
        <StarBurstWipe p={ip(f, [110, 130], [0, 1])} color="#C8F31D" />

        {/* PART B (115–245): Game Center-Style Badges & Accolades Grid (`components/badge-tile.tsx`) */}
        {f >= 112 && (
          <AbsoluteFill style={{ opacity: toBadges }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 135, textAlign: "center" }}>
              <Kinetic f={f} start={118} stagger={4} size={74} words={["Badges", "&", { t: "Court Accolades", color: C.lime }]} />
              <div style={{ fontFamily: inter, fontSize: 22, color: "#A1A1AA", marginTop: 10 }}>
                Unlocked automatically from verified tournament podiums, coaching credentials, and peer vouches.
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 330,
                display: "flex",
                justifyContent: "center",
                gap: 28,
              }}
            >
              {badges.map((b, i) => {
                const p = ip(f, [122 + i * 6, 140 + i * 6], [0, 1], backOut);
                return (
                  <div key={b.title} style={{ transform: `translateY(${Math.sin((f + i * 14) / 15) * 6}px)` }}>
                    <BadgeTile title={b.title} desc={b.desc} earned={b.earned} icon={b.icon} g={b.g} p={p} s={310} />
                  </div>
                );
              })}
            </div>

            {/* Celebratory Unlock Pill */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 78,
                transform: `translateX(-50%) scale(${ip(f, [144, 162], [0.7, 1], backOut)})`,
                opacity: ip(f, [144, 158], [0, 1]),
              }}
            >
              <ShaderButton
                w={680}
                h={82}
                fontSize={24}
                glint={lin(f, [160, 210], [0, 1])}
                label={
                  <>
                    <Trophy s={28} c="#1C2A00" />
                    <span>5 / 7 BADGES UNLOCKED · KITCHEN MASTER</span>
                  </>
                }
              />
            </div>

            <Confetti f={f} start={124} x={960} y={500} n={110} power={1.15} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </Stage>
  );
};

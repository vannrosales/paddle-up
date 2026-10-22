import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, inter, mono } from "../theme";
import { ip, lin, expoOut, expoIn, expoInOut, backOut, shake, smooth } from "../lib/anim";
import { Stage, CourtFloor, LightSweep } from "../components/Stage";
import { Kinetic, SectionTag } from "../components/Kinetic";
import { ShaderButton } from "../components/LimeShader";
import { LogoMark, Wordmark, Pickleball, PassportCard, Cursor, AppNavbar } from "../components/Passport";
import { SharePassModalView, OGCard, Dimension } from "../components/Share";
import { Segmented, FilterChip, FinderCard, MatchLog, BadgeTile, EndorseModalView, Confetti } from "../components/Community";
import { Zap } from "../components/Icons";

// =============== SCENE 6 — PARTNER FINDER (`/partners`) & DASHBOARD MATCH LOG (`/dashboard`) (global 845–1070, len 225) =================
export const S6Finder: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 14], [0, 1], expoOut);
  const toLog = ip(f, [106, 132], [0, 1], expoInOut);
  const exit = ip(f, [210, 225], [0, 1], expoIn);
  const segActive = ip(f, [12, 28], [0, 1], expoOut);
  const inviteP = ip(f, [64, 80], [0, 1], expoOut);
  const pulse = (f % 36) / 36;

  // Real players from lib/data/mock-players.ts
  const players = [
    {
      who: "kenji",
      name: "Jun Reyes",
      handle: "@junr",
      city: "Manila, PH",
      lvl: "4.5",
      role: "Power Hitter (Banger)",
      style: "Competitive",
      when: "Tue & Thu evenings (6 PM - 9 PM)",
    },
    {
      who: "maya",
      name: "Maria Santos",
      handle: "@marias",
      city: "Cebu City, PH",
      lvl: "4.0",
      role: "Dinker / Soft-Game Specialist",
      style: "Competitive",
      when: "Sat & Sun mornings (6 AM - 10 AM)",
    },
    {
      who: "rob",
      name: "Carlos Mendoza",
      handle: "@carlosm",
      city: "Davao City, PH",
      lvl: "3.5",
      role: "All-Court Player",
      style: "Casual / Round-Robin",
      when: "Saturday afternoons & Sunday RR",
    },
  ];

  const cursorX = ip(f, [38, 62], [1400, 365], expoOut);
  const cursorY = ip(f, [38, 62], [280, 815], expoOut);
  const click = ip(f, [61, 65, 71], [0, 1, 0], smooth);

  return (
    <Stage f={f + 845} glow={1} hue="mix">
      <CourtFloor f={f} o={0.28} speed={0.9} />
      <LightSweep p={lin(f, [105, 150], [0, 1])} o={0.5} />

      <div style={{ position: "absolute", left: 70, top: 44, zIndex: 40 }}>
        <SectionTag
          f={f}
          start={0}
          label={toLog > 0.5 ? "Player Dashboard · /dashboard (Match Log)" : "Partner Finder · /partners"}
          num="04"
        />
      </div>

      {/* PART A: Partner Finder (`/partners`) inside App Browser Window */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: enter * (1 - toLog),
          transform: `translateY(${(1 - enter) * 40 - toLog * 140}px) scale(${0.94 + enter * 0.06 - toLog * 0.1})`,
        }}
      >
        <div
          style={{
            width: 1680,
            borderRadius: 28,
            background: "#0B0C0E",
            border: "1.5px solid rgba(255,255,255,0.14)",
            boxShadow: "0 50px 130px rgba(0,0,0,0.75)",
            overflow: "hidden",
            marginTop: 34,
          }}
        >
          <AppNavbar activeNav="Find Partner" route="paddleup.app/partners?style=competitive" />

          <div style={{ padding: "24px 42px 32px", fontFamily: inter }}>
            {/* Header + Filter Bar (matches app/partners/page.tsx lines 41-106) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: display, fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
                  Find a Pickleball Partner
                </div>
                <div style={{ fontSize: 15, color: "#A1A1AA" }}>
                  Connect with players actively looking for doubles partners, drilling buddies, or open-play groups.
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <FilterChip icon="pin" label="Manila & Cebu" p={ip(f, [2, 14], [0, 1])} on />
                <Segmented options={["All Styles", "Competitive", "Drills"]} active={segActive} s={0.92} />
              </div>
            </div>

            {/* 3-Column Partner Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
              {players.map((pl, i) => {
                const p = ip(f, [4 + i * 5, 20 + i * 5], [0, 1], backOut);
                return (
                  <div
                    key={pl.handle}
                    style={{
                      opacity: p,
                      transform: `translateY(${(1 - p) * 40}px)`,
                    }}
                  >
                    <FinderCard {...pl} looking pulse={pulse} w={514} invite={i === 0 ? inviteP : 0} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {f >= 38 && f <= 88 && <Cursor x={cursorX} y={cursorY} press={click} hand />}
      </AbsoluteFill>

      {/* PART B: Player Dashboard Match Log (`/dashboard`) */}
      {f >= 104 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: toLog * (1 - exit),
            transform: `translateY(${(1 - toLog) * 120}px) scale(${0.92 + toLog * 0.08 + exit * 0.14})`,
          }}
        >
          <div
            style={{
              width: 1680,
              borderRadius: 28,
              background: "#0B0C0E",
              border: "1.5px solid rgba(255,255,255,0.14)",
              boxShadow: "0 50px 130px rgba(0,0,0,0.75)",
              overflow: "hidden",
              marginTop: 34,
            }}
          >
            <AppNavbar activeNav="Dashboard" route="paddleup.app/dashboard?tab=matches" />
            <div style={{ padding: "26px 42px 34px" }}>
              <MatchLog p={ip(f, [114, 170], [0, 1], expoOut)} streak={ip(f, [136, 180], [1, 5], expoOut)} w={1596} />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </Stage>
  );
};

// =============== SCENE 7 — FINALE LOCKUP & SIGNATURE SHADER CTA (global 1055–1200, len 145) =================
export const S7Finale: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 22], [0, 1], expoOut);
  const btnIn = ip(f, [18, 42], [0, 1], backOut);
  const glint = lin(f, [38, 94], [0, 1]);
  const press = ip(f, [71, 75, 81], [0, 1, 0], smooth);
  const sk = shake(f, 75, 10, 10);

  return (
    <Stage f={f + 1055} glow={1.15} glowY={105}>
      <AbsoluteFill style={{ transform: `translate(${sk.x}px, ${sk.y}px)` }}>
        <CourtFloor f={f} o={0.32} speed={0.5} />
        <LightSweep p={lin(f, [15, 85], [0, 1])} o={0.65} />

        {/* Concentric geometric 4-point star lines */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none", opacity: enter * 0.34 }}>
          <svg width={1920} height={1080} viewBox="-960 -540 1920 1080">
            {[1, 1.45, 2.0, 2.7].map((s, i) => {
              const r = 340 * s * (0.85 + 0.15 * enter);
              return (
                <path
                  key={i}
                  d={`M 0 ${-r} Q 0 0 ${r} 0 Q 0 0 0 ${r} Q 0 0 ${-r} 0 Q 0 0 0 ${-r} Z`}
                  fill="none"
                  stroke={i % 2 === 0 ? "#C8F31D" : "#0A84FF"}
                  strokeWidth={2}
                  opacity={0.5 - i * 0.1}
                  transform={`rotate(${f * 0.12 * (i % 2 ? 1 : -1)})`}
                />
              );
            })}
          </svg>
        </AbsoluteFill>

        {/* Feature summary pills in corners */}
        {[
          { t: "Player Passport · Coming Soon", x: 120, y: 150, d: 6 },
          { t: "QR Wallet Pass + 1200×630 OG", x: 1420, y: 150, d: 10 },
          { t: "+24 Peer Vouches & Badges", x: 120, y: 850, d: 14 },
          { t: "Partner Matchmaker · Coming Soon", x: 1420, y: 850, d: 18 },
        ].map((pill, i) => {
          const p = ip(f, [pill.d, pill.d + 16], [0, 1], backOut);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pill.x,
                top: pill.y + Math.sin((f + i * 20) / 18) * 6,
                opacity: p * 0.92,
                transform: `scale(${p})`,
                padding: "13px 24px",
                borderRadius: 999,
                background: "#1C1C1E",
                border: "1.5px solid rgba(200,243,29,0.45)",
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 700,
                color: "#E8FF9A",
                boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
              }}
            >
              {pill.t}
            </div>
          );
        })}

        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              padding: "6px 20px",
              borderRadius: 99,
              background: "rgba(200,243,29,0.14)",
              border: "1.5px solid rgba(200,243,29,0.5)",
              fontFamily: mono,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#C8F31D",
              marginBottom: 18,
              opacity: enter,
            }}
          >
            COMING SOON · 2026
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: enter, transform: `translateY(${(1 - enter) * 36}px)` }}>
            <LogoMark s={118} p={enter} />
            <Wordmark size={130} reveal={ip(f, [2, 24], [0, 1])} />
          </div>

          <div style={{ marginTop: 22 }}>
            <Kinetic
              f={f}
              start={10}
              stagger={4}
              size={56}
              weight={700}
              words={["The", "pickleball", "player", "identity.", { t: "Coming soon.", color: C.lime }]}
            />
          </div>

          {/* Signature Liquid-Glass Shader CTA Button */}
          <div style={{ marginTop: 46, opacity: btnIn, transform: `scale(${0.75 + btnIn * 0.25})` }}>
            <ShaderButton
              w={660}
              h={110}
              press={press}
              glow={1.15}
              glint={glint}
              fontSize={34}
              label={
                <>
                  <Zap s={34} c="#1C2A00" />
                  <span>Join Early Access Waitlist</span>
                </>
              }
            />
          </div>

          <div
            style={{
              marginTop: 28,
              fontFamily: mono,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#A1A1AA",
              opacity: ip(f, [30, 48], [0, 1]),
            }}
          >
            paddleup.app · Early Access Coming Soon
          </div>
        </AbsoluteFill>

        {f >= 46 && f <= 96 && (
          <Cursor
            x={ip(f, [46, 73], [1200, 960], expoOut)}
            y={ip(f, [46, 73], [840, 630], expoOut)}
            press={press}
            hand
          />
        )}

        <Confetti f={f} start={75} x={960} y={630} n={90} power={1.0} />
      </AbsoluteFill>
    </Stage>
  );
};

// ====================================================================================================
// 10-SECOND INTERACTIVE APP DEMO HERO CUT (300 frames @ 30fps)
// Meets all criteria:
// - 0.0–0.5s instant hook: Live Player Passport `/p/marias` already on screen with 4.0 Skill Ring + roles + medals
// - 0.0–2.0s impact: Cursor clicks "Endorse Player" -> EndorseModal pops open & unlocks "Peer Endorsed" badge
// - Every <2.5s a new interactive app flow happens:
//   * 0.0s–2.6s (f 0–78): `/p/marias` Player Passport + roles + hardware + medals
//   * 2.4s–5.0s (f 72–150): Click "Share Pass" -> ShareCardModal QR Pass + live 1200x630 Open Graph preview
//   * 4.8s–7.5s (f 144–225): EndorseModal + Badges unlock + Partner Finder (`/partners`) & Match Log (`75% Win Rate`)
//   * 7.3s–10.0s (f 218–300): PaddleUp lockup + Signature Liquid-Glass Shader CTA
// ====================================================================================================
export const Hero10: React.FC = () => {
  const f = useCurrentFrame();
  const sk1 = shake(f, 2, 10, 14);
  const sk2 = shake(f, 148, 10, 12);

  const flash = ip(f, [1, 3, 10], [0, 0.55, 0], (t) => t);
  const toShare = ip(f, [72, 86], [0, 1], expoInOut);
  const toCommunity = ip(f, [142, 156], [0, 1], expoInOut);
  const toFinale = ip(f, [220, 234], [0, 1], expoInOut);

  // Cursor in Beat 1 clicks "Share Pass" at f=70 (1667, 229)
  const c1x = ip(f, [36, 68], [960, 1667], expoOut);
  const c1y = ip(f, [36, 68], [560, 229], expoOut);
  const c1Press = ip(f, [66, 70, 75], [0, 1, 0], smooth);

  // Cursor in Beat 2 clicks "Copy" at f=104 (574, 625)
  const c2x = ip(f, [78, 102], [1667, 574], expoOut);
  const c2y = ip(f, [78, 102], [229, 625], expoOut);
  const c2Press = ip(f, [101, 104, 109], [0, 1, 0], smooth);

  return (
    <Stage f={f} glow={1.05}>
      <AbsoluteFill style={{ transform: `translate(${sk1.x + sk2.x}px, ${sk1.y + sk2.y}px)` }}>
        <CourtFloor f={f} o={0.3} speed={1.4} />
        <LightSweep p={lin(f % 90, [0, 90], [0, 1])} o={0.45} />

        {/* -------- BEAT 1 (0.0s – 2.8s, f 0–86): LIVE `/p/marias` PLAYER PASSPORT (Impactful from Frame 0!) -------- */}
        {f < 86 && (
          <AbsoluteFill
            style={{
              perspective: 1850,
              justifyContent: "center",
              alignItems: "center",
              opacity: 1 - toShare,
              transform: `scale(${1 + toShare * 0.18})`,
            }}
          >
            <div
              style={{
                width: 1640,
                borderRadius: 28,
                background: "#0B0C0E",
                border: "1.5px solid rgba(255,255,255,0.16)",
                boxShadow: "0 50px 130px rgba(0,0,0,0.78)",
                overflow: "hidden",
                transform: `rotateX(${ip(f, [0, 24], [10, 3], expoOut)}deg) rotateY(${ip(f, [0, 24], [-8, 0], expoOut)}deg)`,
              }}
            >
              <AppNavbar activeNav="Players" route="paddleup.app/p/marias" />
              <div style={{ padding: "24px 42px 32px" }}>
                <PassportCard
                  w={1556}
                  p={{
                    avatar: 1,
                    ring: ip(f, [0, 22], [0.45, 1], expoOut),
                    chips: lin(f, [2, 24], [1, 3]),
                    specs: ip(f, [6, 28], [0.4, 1]),
                    podium: ip(f, [14, 38], [0.2, 1]),
                    shareHover: ip(f, [58, 68], [0, 1]),
                  }}
                />
              </div>
            </div>

            {/* Pickleball flash on frame 0–12 */}
            {f < 12 && (
              <div
                style={{
                  position: "absolute",
                  left: ip(f, [0, 4, 12], [240, 560, 1380]),
                  top: ip(f, [0, 4, 12], [180, 260, 110]),
                  transform: `translate(-50%,-50%) scale(${ip(f, [0, 4, 12], [0.95, 1.25, 0.35])})`,
                  pointerEvents: "none",
                }}
              >
                <Pickleball s={140} rot={f * 36} />
              </div>
            )}

            {f >= 36 && <Cursor x={c1x} y={c1y} press={c1Press} hand />}
          </AbsoluteFill>
        )}

        {/* -------- BEAT 2 (2.4s – 5.2s, f 72–156): SHARE PASS MODAL + 1200×630 OPEN GRAPH CARD -------- */}
        {f >= 72 && f < 156 && (
          <AbsoluteFill
            style={{
              opacity: toShare * (1 - toCommunity),
              transform: `scale(${0.92 + toShare * 0.08 - toCommunity * 0.1})`,
            }}
          >
            <div style={{ position: "absolute", left: 70, top: 42 }}>
              <SectionTag f={f} start={74} label="Share Pass Modal · QR & Dynamic 1200×630 OG" num="02" />
            </div>

            {/* Left: Live ShareCardModal */}
            <div
              style={{
                position: "absolute",
                left: 80,
                top: 105,
                transform: `scale(${ip(f, [74, 90], [0.88, 0.96], backOut)})`,
                transformOrigin: "top left",
              }}
            >
              <SharePassModalView
                w={600}
                qr={1}
                scan={lin(f, [82, 136], [0, 1])}
                copied={f >= 104}
                copyPress={ip(f, [100, 104, 109], [0, 1, 0], smooth)}
              />
            </div>

            {/* Right: Auto-generated 1200x630 Open Graph preview card (`app/p/[username]/opengraph-image.tsx`) */}
            <div style={{ position: "absolute", left: 730, top: 105, width: 1100 }}>
              <div style={{ fontFamily: mono, fontSize: 17, color: "#C8F31D", fontWeight: 700, marginBottom: 6 }}>
                /p/marias/opengraph-image · Auto-generated social card
              </div>
              <div style={{ fontFamily: display, fontSize: 38, fontWeight: 900, color: "#fff", marginBottom: 92 }}>
                Drop your link in open-play group chats
              </div>
              <div
                style={{
                  position: "relative",
                  width: 980,
                  borderRadius: 26,
                  boxShadow: "0 45px 110px rgba(0,0,0,0.75), 0 0 0 2px rgba(200,243,29,0.45)",
                }}
              >
                <OGCard w={980} p={ip(f, [80, 102], [0, 1])} />
                <Dimension w={980} h={980 * (630 / 1200)} p={ip(f, [84, 108], [0, 1])} label="1200×630 px · next/og runtime" labelH="630 px" />
              </div>
            </div>

            {f >= 76 && f <= 130 && <Cursor x={c2x} y={c2y} press={c2Press} hand />}
          </AbsoluteFill>
        )}

        {/* -------- BEAT 3 (4.7s – 7.8s, f 142–234): ENDORSEMENTS & BADGES + PARTNER FINDER & MATCH LOG -------- */}
        {f >= 142 && f < 234 && (
          <AbsoluteFill
            style={{
              opacity: toCommunity * (1 - toFinale),
              transform: `scale(${0.92 + toCommunity * 0.08 - toFinale * 0.1})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 70,
                right: 70,
                top: 40,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SectionTag f={f} start={144} label="Peer Vouches · Badges · Partner Finder · Match Log" num="03–04" />
              <div style={{ fontFamily: mono, fontSize: 18, color: "#C8F31D", fontWeight: 800 }}>
                +24 Peer Endorsements · 75% Win Rate (+5W Streak)
              </div>
            </div>

            {/* Top-left: 3 Game Center BadgeTiles (`components/badge-tile.tsx`) */}
            <div style={{ position: "absolute", left: 70, top: 105, display: "flex", gap: 18 }}>
              {[
                {
                  title: "Podium Finisher",
                  desc: "Won gold medal in tournament play",
                  earned: "Earned Aug 2024",
                  icon: "trophy",
                  g: ["#FBBF24", "#D97706"] as [string, string],
                },
                {
                  title: "Peer Endorsed",
                  desc: "Vouched by fellow players for skill",
                  earned: "Just Unlocked!",
                  icon: "star",
                  g: ["#C8F31D", "#65A30D"] as [string, string],
                },
                {
                  title: "Kitchen Master",
                  desc: "Premier soft-game dinking & resets",
                  earned: "Earned Feb 2024",
                  icon: "flame",
                  g: ["#F87171", "#DC2626"] as [string, string],
                },
              ].map((b, i) => (
                <BadgeTile
                  key={b.title}
                  {...b}
                  p={ip(f, [146 + i * 4, 160 + i * 4], [0, 1], backOut)}
                  s={248}
                />
              ))}
            </div>

            {/* Right: Partner Finder Card (`app/partners/page.tsx`) */}
            <div
              style={{
                position: "absolute",
                right: 70,
                top: 105,
                transform: `scale(${ip(f, [148, 164], [0.88, 0.96], backOut)})`,
                transformOrigin: "top right",
              }}
            >
              <FinderCard
                who="kenji"
                name="Jun Reyes"
                handle="@junr"
                city="Manila, PH"
                lvl="4.5"
                role="Power Hitter (Banger)"
                style="Competitive"
                when="Tue & Thu evenings (6 PM - 9 PM)"
                looking
                pulse={(f % 30) / 30}
                w={500}
                invite={ip(f, [178, 192], [0, 1])}
              />
            </div>

            {/* Bottom-left: Dashboard Match Log (`app/dashboard/page.tsx`) */}
            <div style={{ position: "absolute", left: 70, bottom: 28, transform: "scale(0.78)", transformOrigin: "bottom left" }}>
              <MatchLog p={ip(f, [152, 190], [0, 1])} streak={ip(f, [164, 200], [1, 5])} w={1420} />
            </div>

            <Confetti f={f} start={150} x={460} y={260} n={85} power={0.95} />
          </AbsoluteFill>
        )}

        {/* -------- BEAT 4 (7.3s – 10.0s, f 220–300): CLEAN LOCKUP + SIGNATURE SHADER CTA -------- */}
        {f >= 220 && (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              opacity: toFinale,
              transform: `scale(${0.9 + toFinale * 0.1})`,
            }}
          >
            <div
              style={{
                padding: "6px 20px",
                borderRadius: 99,
                background: "rgba(200,243,29,0.14)",
                border: "1.5px solid rgba(200,243,29,0.5)",
                fontFamily: mono,
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#C8F31D",
                marginBottom: 16,
              }}
            >
              COMING SOON · 2026
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <LogoMark s={114} p={toFinale} />
              <Wordmark size={126} reveal={ip(f, [222, 242], [0, 1])} />
            </div>
            <div style={{ marginTop: 22 }}>
              <Kinetic
                f={f}
                start={224}
                stagger={3}
                size={54}
                words={["The", "pickleball", "player", "identity.", { t: "Coming soon.", color: C.lime }]}
              />
            </div>
            <div style={{ marginTop: 42 }}>
              <ShaderButton
                w={640}
                h={106}
                glow={1.15}
                glint={lin(f, [238, 286], [0, 1])}
                press={ip(f, [264, 269, 275], [0, 1, 0], smooth)}
                fontSize={34}
                label={
                  <>
                    <Zap s={34} c="#1C2A00" />
                    <span>Join Early Access Waitlist</span>
                  </>
                }
              />
            </div>
            <div style={{ marginTop: 24, fontFamily: mono, fontSize: 23, color: "#A1A1AA", fontWeight: 700 }}>
              paddleup.app · Early Access Coming Soon
            </div>
            {f >= 244 && f <= 286 && (
              <Cursor
                x={ip(f, [244, 268], [1180, 960], expoOut)}
                y={ip(f, [244, 268], [820, 630], expoOut)}
                press={ip(f, [265, 269, 275], [0, 1, 0], smooth)}
                hand
              />
            )}
            <Confetti f={f} start={269} x={960} y={630} n={80} power={0.95} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#F4FFD0", opacity: flash * 0.55, mixBlendMode: "screen", pointerEvents: "none" }} />
    </Stage>
  );
};

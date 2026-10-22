import React from "react";
import { display, inter, mono, C } from "../theme";
import { ip, rand, expoOut, backOut } from "../lib/anim";
import { Avatar, LogoMark, SkillRing, RoleChip } from "./Passport";
import { ShieldCheck, Wallet, Share, Check, Trophy } from "./Icons";
import { ShaderButton } from "./LimeShader";

/** deterministic QR-looking matrix with finder patterns; `p` reveals modules */
export const QR: React.FC<{ s: number; p?: number; scan?: number }> = ({ s, p = 1, scan }) => {
  const n = 25;
  const cell = s / n;
  const finder = (x: number, y: number) => {
    const inF = (fx: number, fy: number) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7;
    for (const [fx, fy] of [
      [0, 0],
      [n - 7, 0],
      [0, n - 7],
    ]) {
      if (inF(fx, fy)) {
        const dx = x - fx,
          dy = y - fy;
        const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return ring || core ? 1 : 0;
      }
      if (x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7) return 0;
    }
    return -1;
  };
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const fv = finder(x, y);
      const on = fv === -1 ? rand(x * 31 + y * 17 + 3) > 0.52 : fv === 1;
      if (!on) continue;
      const order = (x + y) / (2 * n);
      const o = fv === 1 ? 1 : ip(p, [order * 0.8, order * 0.8 + 0.2], [0, 1]);
      if (o <= 0) continue;
      rects.push(
        <rect
          key={`${x}-${y}`}
          x={x * cell}
          y={y * cell}
          width={cell + 0.4}
          height={cell + 0.4}
          rx={fv === 1 ? 0 : cell * 0.25}
          fill="#0A0A0A"
          opacity={o}
        />
      );
    }
  return (
    <div style={{ position: "relative", width: s, height: s }}>
      <svg width={s} height={s}>
        {rects}
      </svg>
      {scan != null && scan > 0 && scan < 1 && (
        <div
          style={{
            position: "absolute",
            left: -6,
            right: -6,
            top: scan * s - 2,
            height: 4,
            background: "#C8F31D",
            boxShadow: "0 0 18px 4px rgba(200,243,29,0.75)",
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
};

/**
 * Exact Wallet Pass Card inside ShareCardModal (matches components/share-card-modal.tsx lines 91-174)
 */
export const WalletPass: React.FC<{ w?: number; qr?: number; scan?: number; f?: number }> = ({ w = 520, qr = 1, scan }) => {
  const k = w / 520;
  return (
    <div
      style={{
        width: w,
        borderRadius: 28 * k,
        background: "linear-gradient(145deg,#18181B,#09090B)",
        border: "1.5px solid #27272A",
        boxShadow: "0 40px 80px rgba(0,0,0,0.65)",
        color: "#fff",
        fontFamily: inter,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ height: 8 * k, background: "linear-gradient(90deg,#C8F31D,#A3E635,#0A84FF)" }} />
      <div style={{ padding: 28 * k, position: "relative" }}>
        {/* Pass Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 * k }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 * k }}>
            <LogoMark s={30 * k} />
            <span style={{ fontWeight: 800, fontSize: 15 * k, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D4D4D8" }}>
              PaddleUp Pass
            </span>
          </div>
          <span style={{ fontFamily: mono, fontSize: 13 * k, color: "#71717A" }}>#001</span>
        </div>

        {/* Player Identity */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 * k }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 * k }}>
            <Avatar name="maya" s={76 * k} r={20 * k} ring="rgba(200,243,29,0.5)" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 * k, fontFamily: display, fontWeight: 800, fontSize: 26 * k, letterSpacing: "-0.02em" }}>
                Maria Santos <ShieldCheck s={20 * k} c="#34C759" />
              </div>
              <div style={{ fontFamily: mono, fontSize: 14 * k, color: "#A1A1AA", marginTop: 2 * k }}>@marias</div>
              <div style={{ fontSize: 13 * k, color: "#71717A", marginTop: 2 * k }}>Cebu City, Philippines</div>
            </div>
          </div>
          <SkillRing s={84 * k} p={1} level={4.0} />
        </div>

        {/* Role + QR Code Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #27272A",
            paddingTop: 20 * k,
          }}
        >
          <div>
            <div style={{ fontSize: 11 * k, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717A", marginBottom: 8 * k }}>
              Primary Court Role
            </div>
            <RoleChip role="Dinker / Soft-Game Specialist" primary size={12.5 * k} />
            <div style={{ fontSize: 12 * k, color: "#A1A1AA", marginTop: 12 * k }}>
              Paddle: <strong style={{ color: "#fff" }}>JOOLA Perseus CFS 16</strong>
            </div>
            <div style={{ fontSize: 12 * k, color: "#A1A1AA", marginTop: 3 * k }}>
              Club: <strong style={{ color: "#C8F31D" }}>Cebu Smash Pickleball Club</strong>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16 * k, padding: 10 * k, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
            <QR s={96 * k} p={qr} scan={scan} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Exact ShareCardModal UI (matches components/share-card-modal.tsx)
 * Shows the modal popup with WalletPass, Passport URL Copy bar, Share to Apps button, X/Facebook/WhatsApp buttons, and OG preview link.
 */
export const SharePassModalView: React.FC<{
  w?: number;
  qr?: number;
  scan?: number;
  copied?: boolean;
  sharePress?: number;
  copyPress?: number;
}> = ({ w = 580, qr = 1, scan, copied = false, sharePress = 0, copyPress = 0 }) => {
  const k = w / 580;
  return (
    <div
      style={{
        width: w,
        borderRadius: 32 * k,
        background: "#1C1C1E",
        border: "1.5px solid #27272A",
        boxShadow: "0 50px 120px rgba(0,0,0,0.78)",
        padding: 28 * k,
        fontFamily: inter,
        color: "#FFFFFF",
      }}
    >
      {/* Modal Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 * k }}>
        <div style={{ fontFamily: display, fontSize: 22 * k, fontWeight: 800 }}>Share Player Pass</div>
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

      {/* Embedded Wallet Pass */}
      <WalletPass w={w - 56 * k} qr={qr} scan={scan} />

      {/* Copy Link Box */}
      <div style={{ marginTop: 18 * k }}>
        <div style={{ fontSize: 11 * k, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#A1A1AA", marginBottom: 6 * k }}>
          Passport URL
        </div>
        <div style={{ display: "flex", gap: 8 * k }}>
          <div
            style={{
              flex: 1,
              padding: `${10 * k}px ${14 * k}px`,
              borderRadius: 12 * k,
              background: "#141416",
              border: "1px solid #27272A",
              fontFamily: mono,
              fontSize: 13 * k,
              color: "#E4E4E7",
            }}
          >
            https://paddleup.app/p/marias
          </div>
          <div
            style={{
              padding: `${10 * k}px ${18 * k}px`,
              borderRadius: 12 * k,
              background: copied ? "#C8F31D" : "#FFFFFF",
              color: copied ? "#1C2A00" : "#09090B",
              fontSize: 13 * k,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: 6 * k,
              transform: `scale(${1 - copyPress * 0.06})`,
            }}
          >
            {copied ? (
              <>
                <Check s={15 * k} c="#1C2A00" />
                <span>Copied!</span>
              </>
            ) : (
              <span>Copy</span>
            )}
          </div>
        </div>
      </div>

      {/* Native Share to Apps Button (signature shader) */}
      <div style={{ marginTop: 14 * k }}>
        <ShaderButton
          w={w - 56 * k}
          h={48 * k}
          r={14 * k}
          press={sharePress}
          glow={0.55}
          fontSize={14.5 * k}
          label={
            <>
              <Share s={17 * k} c="#1C2A00" />
              <span>Share to Apps (AirDrop, Messages, Stories)</span>
            </>
          }
        />
      </div>

      {/* Social Quick Share Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 * k, marginTop: 10 * k }}>
        {["X / Twitter", "Facebook", "WhatsApp"].map((net) => (
          <div
            key={net}
            style={{
              padding: `${9 * k}px 0`,
              borderRadius: 12 * k,
              background: "#141416",
              border: "1px solid #27272A",
              textAlign: "center",
              fontSize: 12.5 * k,
              fontWeight: 700,
              color: "#D4D4D8",
            }}
          >
            {net}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AddToWallet: React.FC<{ s?: number; press?: number }> = ({ s = 1, press = 0 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14 * s,
      background: "#000",
      color: "#fff",
      border: "1.5px solid rgba(255,255,255,0.28)",
      borderRadius: 16 * s,
      padding: `${14 * s}px ${26 * s}px`,
      fontFamily: inter,
      fontWeight: 600,
      fontSize: 22 * s,
      transform: `scale(${1 - press * 0.07})`,
      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    }}
  >
    <Wallet s={26 * s} c="#fff" />
    <span>
      Add to <b>Apple Wallet</b>
    </span>
  </div>
);

/**
 * Exact Runtime 1200x630 Open Graph Card (matches app/p/[username]/opengraph-image.tsx 1:1!)
 */
export const OGCard: React.FC<{ w?: number; p?: number }> = ({ w = 720, p = 1 }) => {
  const k = w / 1200;
  const h = 630 * k;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 28 * k,
        overflow: "hidden",
        position: "relative",
        background: "#121214",
        fontFamily: inter,
        color: "#fff",
        border: "1.5px solid rgba(255,255,255,0.14)",
      }}
    >
      {/* Top gradient bar */}
      <div style={{ width: "100%", height: 16 * k, background: "linear-gradient(90deg, #C8F31D 0%, #0A84FF 100%)" }} />

      <div style={{ padding: `${48 * k}px ${64 * k}px`, height: h - 16 * k, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 * k }}>
            <LogoMark s={52 * k} />
            <span style={{ fontSize: 34 * k, fontWeight: 900, letterSpacing: "-0.03em" }}>
              Paddle<span style={{ color: "#C8F31D" }}>Up</span>
            </span>
            <span
              style={{
                marginLeft: 12 * k,
                fontSize: 16 * k,
                fontWeight: 700,
                color: "#8E8E93",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                padding: `${6 * k}px ${14 * k}px`,
                background: "#1C1C1E",
                borderRadius: 99,
              }}
            >
              Player Passport
            </span>
          </div>
          <div style={{ fontSize: 22 * k, color: "#8E8E93", fontWeight: 600 }}>Cebu City, Philippines</div>
        </div>

        {/* Center Identity Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: p,
            transform: `translateY(${(1 - p) * 28 * k}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 34 * k }}>
            <Avatar name="maya" s={160 * k} r={38 * k} ring="#C8F31D" />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 * k }}>
                <span style={{ fontFamily: display, fontSize: 64 * k, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>Maria Santos</span>
                <span
                  style={{
                    width: 34 * k,
                    height: 34 * k,
                    borderRadius: 17 * k,
                    background: "#34C759",
                    color: "#000",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20 * k,
                    fontWeight: 900,
                  }}
                >
                  ✓
                </span>
              </div>
              <div style={{ fontFamily: mono, fontSize: 26 * k, color: "#8E8E93", marginTop: 6 * k }}>@marias</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 * k, marginTop: 18 * k }}>
                <span
                  style={{
                    padding: `${10 * k}px ${22 * k}px`,
                    borderRadius: 16 * k,
                    background: "#C8F31D",
                    color: "#1C2A00",
                    fontSize: 22 * k,
                    fontWeight: 800,
                  }}
                >
                  Dinker / Soft-Game Specialist
                </span>
                <span
                  style={{
                    padding: `${10 * k}px ${20 * k}px`,
                    borderRadius: 16 * k,
                    background: "#1C1C1E",
                    border: "1px solid #2C2C2E",
                    color: "#E5E5EA",
                    fontSize: 20 * k,
                    fontWeight: 700,
                  }}
                >
                  JOOLA Perseus CFS 16
                </span>
              </div>
            </div>
          </div>

          {/* Right Skill Circle */}
          <div
            style={{
              width: 172 * k,
              height: 172 * k,
              borderRadius: 86 * k,
              border: `${8 * k}px solid #C8F31D`,
              background: "#1C1C1E",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(200,243,29,0.22)",
            }}
          >
            <span style={{ fontFamily: display, fontSize: 64 * k, fontWeight: 900, lineHeight: 1 }}>4.0</span>
            <span style={{ fontSize: 15 * k, fontWeight: 800, color: "#C8F31D", letterSpacing: "0.14em", marginTop: 6 * k }}>SKILL</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #2C2C2E",
            paddingTop: 22 * k,
          }}
        >
          <div style={{ display: "flex", gap: 40 * k, fontSize: 22 * k, color: "#D1D1D6" }}>
            <span>
              <strong style={{ color: "#C8F31D" }}>3</strong> Verified Medals
            </span>
            <span>
              <strong style={{ color: "#C8F31D" }}>3</strong> Peer Endorsements
            </span>
            <span>
              Club: <strong style={{ color: "#fff" }}>Cebu Smash Pickleball Club</strong>
            </span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 20 * k, color: "#8E8E93", fontWeight: 700 }}>paddleup.app/p/marias</div>
        </div>
      </div>
    </div>
  );
};

/** Dimension annotation drawn around a box */
export const Dimension: React.FC<{ w: number; h: number; p: number; label: string; labelH?: string }> = ({ w, h, p, label, labelH }) => {
  const c = "#C8F31D";
  const lw = w * ip(p, [0, 0.7], [0, 1]);
  const lh = h * ip(p, [0.2, 0.9], [0, 1]);
  const o = ip(p, [0.5, 1], [0, 1]);
  return (
    <>
      <div style={{ position: "absolute", left: (w - lw) / 2, top: -36, width: lw, height: 2, background: c }} />
      <div style={{ position: "absolute", left: 0, top: -44, width: 2, height: 18, background: c, opacity: o }} />
      <div style={{ position: "absolute", right: 0, top: -44, width: 2, height: 18, background: c, opacity: o }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -72,
          transform: "translateX(-50%)",
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 20,
          color: c,
          background: "#090B08",
          padding: "2px 12px",
          borderRadius: 6,
          opacity: o,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div style={{ position: "absolute", right: -36, top: (h - lh) / 2, width: 2, height: lh, background: c }} />
      <div style={{ position: "absolute", right: -44, top: 0, width: 18, height: 2, background: c, opacity: o }} />
      <div style={{ position: "absolute", right: -44, bottom: 0, width: 18, height: 2, background: c, opacity: o }} />
      {labelH && (
        <div
          style={{
            position: "absolute",
            right: -110,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 20,
            color: c,
            opacity: o,
          }}
        >
          {labelH}
        </div>
      )}
    </>
  );
};

/** Pickleball Open-Play Group Chat Thread with live 1200x630 OG preview */
export const ChatThread: React.FC<{ f: number; start?: number; w?: number }> = ({ f, start = 0, w = 780 }) => {
  const b1 = ip(f, [start, start + 12], [0, 1], expoOut);
  const b2 = ip(f, [start + 12, start + 26], [0, 1], expoOut);
  const b3 = ip(f, [start + 42, start + 54], [0, 1], expoOut);
  return (
    <div
      style={{
        width: w,
        padding: 28,
        borderRadius: 32,
        background: "#18181B",
        border: "1.5px solid #27272A",
        boxShadow: "0 40px 90px rgba(0,0,0,0.65)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        fontFamily: inter,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272A", paddingBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#34C759" }} />
          <span style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>BGC Kitchen Crew · 4.0+ Open Play</span>
        </div>
        <span style={{ fontFamily: mono, fontSize: 13, color: "#71717A" }}>WhatsApp / iMessage</span>
      </div>

      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          opacity: b1,
          transform: `translateY(${(1 - b1) * 24}px)`,
        }}
      >
        <Avatar name="kenji" s={44} r={22} />
        <div
          style={{
            background: "#27272A",
            color: "#F4F4F5",
            borderRadius: 22,
            borderBottomLeftRadius: 6,
            padding: "13px 20px",
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Need a 4th for 4.0+ doubles Sat 7AM. Drop your PaddleUp pass 👇
        </div>
      </div>

      <div
        style={{
          alignSelf: "flex-end",
          opacity: b2,
          transform: `translateY(${(1 - b2) * 24}px)`,
        }}
      >
        <div
          style={{
            background: "#2563EB",
            color: "#fff",
            borderRadius: 24,
            borderBottomRightRadius: 6,
            overflow: "hidden",
            width: 580,
            padding: 6,
          }}
        >
          <OGCard w={568} p={ip(f, [start + 16, start + 34], [0, 1])} />
          <div style={{ padding: "10px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17 }}>Maria Santos (@marias) · 4.0 Verified</div>
              <div style={{ fontSize: 14, opacity: 0.8, fontFamily: mono }}>paddleup.app/p/marias</div>
            </div>
            <span style={{ padding: "4px 10px", borderRadius: 99, background: "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 700 }}>1200×630 OG</span>
          </div>
        </div>
      </div>

      <div
        style={{
          alignSelf: "flex-start",
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          opacity: b3,
          transform: `translateY(${(1 - b3) * 24}px)`,
        }}
      >
        <Avatar name="kenji" s={44} r={22} />
        <div
          style={{
            background: "#27272A",
            color: "#F4F4F5",
            borderRadius: 22,
            borderBottomLeftRadius: 6,
            padding: "13px 20px",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Visayas Open Gold + JOOLA Perseus?! Court 2 is yours 🏓🔥
        </div>
      </div>
    </div>
  );
};

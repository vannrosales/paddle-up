import React from "react";
import { AbsoluteFill } from "remotion";

/** Dark stage with organic circular radial light bed + vignette + grain. No rectangular bars. */
export const Stage: React.FC<{ f: number; glow?: number; hue?: "lime" | "blue" | "mix"; light?: boolean; children?: React.ReactNode; glowY?: number }> = ({ f, glow = 1, hue = "mix", light, children, glowY = 105 }) => {
  const drift = Math.sin(f / 48) * 7;
  const c1 = hue === "blue" ? "rgba(10,132,255,0.42)" : "rgba(200,243,29,0.32)";
  const c2 = hue === "lime" ? "rgba(200,243,29,0.16)" : "rgba(10,132,255,0.22)";
  if (light) {
    return (
      <AbsoluteFill style={{ background: "#F4F5F7", overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle 750px at ${32 + drift}% 95%, rgba(200,243,29,0.38), transparent 72%), radial-gradient(circle 680px at ${78 - drift}% 18%, rgba(10,132,255,0.16), transparent 72%)`,
            opacity: glow,
          }}
        />
        {children}
        <Grain o={0.04} f={f} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#060806", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 920px at ${50 + drift}% ${glowY}%, ${c1}, transparent 72%), radial-gradient(circle 680px at ${16 - drift}% ${glowY - 25}%, ${c2}, transparent 72%), radial-gradient(circle 640px at ${86 + drift}% 18%, ${c2}, transparent 72%)`,
          opacity: glow,
        }}
      />
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(circle 1250px at 50% 48%, transparent 58%, rgba(0,0,0,0.72) 100%)", pointerEvents: "none" }} />
      <Grain o={0.055} f={f} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ o?: number; f: number }> = ({ o = 0.05, f }) => (
  <AbsoluteFill style={{ opacity: o, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id={`g${f % 4}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 4} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${f % 4})`} />
    </svg>
  </AbsoluteFill>
);

/** Perspective pickleball court floor (lines recede), with soft circular mask (no hard horizontal bands). */
export const CourtFloor: React.FC<{ f: number; o?: number; speed?: number; tilt?: number; y?: number; light?: boolean }> = ({ f, o = 0.4, speed = 1, tilt = 72, y = 540, light }) => {
  const line = light ? "rgba(28,28,30,0.14)" : "rgba(200,243,29,0.14)";
  const off = (f * 3.5 * speed) % 220;
  return (
    <AbsoluteFill style={{ perspective: 950, perspectiveOrigin: "50% 32%", opacity: o, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: y,
          width: 3600,
          height: 3000,
          marginLeft: -1800,
          transform: `rotateX(${tilt}deg)`,
          transformOrigin: "50% 0%",
          backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`,
          backgroundSize: "220px 220px",
          backgroundPosition: `0px ${off}px`,
          maskImage: "radial-gradient(ellipse 45% 42% at 50% 35%, black 15%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 45% 42% at 50% 35%, black 15%, transparent 75%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Directional (x) motion blur via SVG filter. */
export const MotionBlur: React.FC<{ id: string; x?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ id, x = 0, y = 0, children, style }) => {
  const on = x > 0.3 || y > 0.3;
  return (
    <div style={{ position: "absolute", inset: 0, filter: on ? `url(#${id})` : undefined, ...style }}>
      {on && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={`${x} ${y}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};

/** Soft elliptical ambient light orb (replaces hard rectangular light bar) */
export const LightSweep: React.FC<{ p: number; angle?: number; color?: string; width?: number; o?: number }> = ({ p, color = "rgba(200,243,29,0.28)", o = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  const fade = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: o * fade,
        background: `radial-gradient(circle 620px at ${-10 + p * 120}% 48%, ${color}, transparent 70%)`,
      }}
    />
  );
};

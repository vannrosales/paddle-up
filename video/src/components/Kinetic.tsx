import React from "react";
import { display } from "../theme";
import { expoOut, ip } from "../lib/anim";

export type Word = { t: string; color?: string; grad?: string; weight?: number; italic?: boolean };

/**
 * Word-by-word kinetic reveal: blur→sharp, rise, slight scale; optional exit.
 * f = local frame. Each word starts at start + i*stagger.
 */
export const Kinetic: React.FC<{
  words: (Word | string)[];
  f: number;
  start?: number;
  stagger?: number;
  dur?: number;
  size?: number;
  exitAt?: number;
  exitDur?: number;
  color?: string;
  weight?: number;
  align?: "center" | "left" | "right";
  tracking?: string;
  style?: React.CSSProperties;
  rise?: number;
  blur?: number;
  gap?: number;
}> = ({ words, f, start = 0, stagger = 4, dur = 14, size = 120, exitAt, exitDur = 10, color = "#F2F2F7", weight = 800, align = "center", tracking = "-0.045em", style, rise = 0.45, blur = 18, gap = 0.26 }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        alignItems: "baseline",
        gap: `0 ${size * gap}px`,
        fontFamily: display,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: tracking,
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {words.map((w0, i) => {
        const w: Word = typeof w0 === "string" ? { t: w0 } : w0;
        const s = start + i * stagger;
        const p = ip(f, [s, s + dur], [0, 1], expoOut);
        let o = ip(f, [s, s + dur * 0.6], [0, 1]);
        let b = (1 - p) * blur;
        let y = (1 - p) * size * rise;
        let sc = 0.92 + 0.08 * p;
        if (exitAt != null) {
          const es = exitAt + i * Math.max(1, stagger * 0.5);
          const e = ip(f, [es, es + exitDur], [0, 1], (t) => t * t);
          o *= 1 - e;
          b += e * blur;
          y -= e * size * 0.35;
          sc *= 1 + e * 0.04;
        }
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: o,
              filter: b > 0.2 ? `blur(${b}px)` : undefined,
              transform: `translateY(${y}px) scale(${sc})`,
              color: w.color,
              fontWeight: w.weight,
              fontStyle: w.italic ? "italic" : undefined,
              background: w.grad,
              WebkitBackgroundClip: w.grad ? "text" : undefined,
              WebkitTextFillColor: w.grad ? "transparent" : undefined,
              paddingBottom: size * 0.08,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

/** small uppercase section label with lime dot, like "PLAYER PASSPORT" */
export const SectionTag: React.FC<{ label: string; f: number; start?: number; num?: string; light?: boolean }> = ({ label, f, start = 0, num, light }) => {
  const p = ip(f, [start, start + 16], [0, 1]);
  const chars = Math.round(label.length * ip(f, [start + 4, start + 22], [0, 1], (t) => t));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: display,
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: light ? "#1C1C1E" : "#F2F2F7",
        opacity: p,
        transform: `translateX(${(1 - p) * -30}px)`,
      }}
    >
      {num && (
        <span style={{ fontVariantNumeric: "tabular-nums", color: light ? "#6C6C70" : "#8E8E93", letterSpacing: "0.1em" }}>{num}</span>
      )}
      <span style={{ width: 10, height: 10, borderRadius: 5, background: "#D4FF3A", boxShadow: "0 0 18px #D4FF3A" }} />
      <span>{label.slice(0, chars)}</span>
    </div>
  );
};


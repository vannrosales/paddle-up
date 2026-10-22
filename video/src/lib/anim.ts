import { Easing, interpolate, spring } from "remotion";

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const expoIn = Easing.bezier(0.7, 0, 0.84, 0);
export const expoInOut = Easing.bezier(0.87, 0, 0.13, 1);
export const quintOut = Easing.bezier(0.22, 1, 0.36, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);
export const smooth = Easing.bezier(0.45, 0, 0.55, 1);

/** clamped interpolate */
export const ip = (
  f: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = expoOut,
) => interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const lin = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const spr = (f: number, fps: number, delay = 0, damping = 14, stiffness = 160, mass = 0.9) =>
  spring({ frame: f - delay, fps, config: { damping, stiffness, mass } });

/** deterministic pseudo-random */
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** smooth camera shake */
export const shake = (f: number, start: number, dur: number, amp: number) => {
  if (f < start || f > start + dur) return { x: 0, y: 0, r: 0 };
  const k = 1 - (f - start) / dur;
  const e = k * k;
  return {
    x: Math.sin(f * 2.7) * amp * e + Math.sin(f * 7.3) * amp * 0.4 * e,
    y: Math.cos(f * 3.1) * amp * e,
    r: Math.sin(f * 4.1) * amp * 0.05 * e,
  };
};

/** progress window helper: 0 before a, 1 after b */
export const win = (f: number, a: number, b: number, e = expoOut) => ip(f, [a, b], [0, 1], e);


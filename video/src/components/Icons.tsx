import React from "react";

type IP = { s?: number; c?: string; w?: number; style?: React.CSSProperties };
const base = (s: number, c: string, w: number, style?: React.CSSProperties) => ({ width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style });

export const ShieldCheck: React.FC<IP> = ({ s = 24, c = "#30D158", w = 2.2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={c} fillOpacity={0.15} /><path d="m9 12 2 2 4-4" /></svg>
);
export const MapPin: React.FC<IP> = ({ s = 24, c = "#8E8E93", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const Trophy: React.FC<IP> = ({ s = 24, c = "#FFC93C", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill={c} fillOpacity={0.2} /></svg>
);
export const Feather: React.FC<IP> = ({ s = 24, c = "#1C2A00", w = 2.2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><path d="M16 8 2 22" /><path d="M17.5 15H9" /></svg>
);
export const Zap: React.FC<IP> = ({ s = 24, c = "#D4FF3A", w = 2.2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill={c} fillOpacity={0.2} /></svg>
);
export const GradCap: React.FC<IP> = ({ s = 24, c = "#D4FF3A", w = 2.2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
);
export const Share: React.FC<IP> = ({ s = 24, c = "#fff", w = 2.2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
);
export const Check: React.FC<IP> = ({ s = 24, c = "#1C2A00", w = 3, style }) => (
  <svg {...base(s, c, w, style)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const Calendar: React.FC<IP> = ({ s = 24, c = "#F2F2F7", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
);
export const Flame: React.FC<IP> = ({ s = 24, c = "#FF453A", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill={c} fillOpacity={0.35} /></svg>
);
export const Paddle: React.FC<IP> = ({ s = 24, c = "#D4FF3A", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><rect x="5" y="2" width="12" height="13" rx="6" transform="rotate(-30 11 8.5)" /><path d="m13.5 15 4.5 7" /></svg>
);
export const Users: React.FC<IP> = ({ s = 24, c = "#F2F2F7", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
export const Star: React.FC<IP> = ({ s = 24, c = "#FFC93C", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={c} /></svg>
);
export const Heart: React.FC<IP> = ({ s = 24, c = "#FF453A", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill={c} /></svg>
);
export const Send: React.FC<IP> = ({ s = 24, c = "#fff", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
);
export const Wallet: React.FC<IP> = ({ s = 24, c = "#fff", w = 2, style }) => (
  <svg {...base(s, c, w, style)}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
);


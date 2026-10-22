"use client";

import React, { useEffect, useState } from "react";

interface ConfettiCelebrationProps {
  trigger?: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  vx: number;
  vy: number;
  vr: number;
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = [
  "#C8F31D", // Pickleball optic yellow
  "#0A84FF", // Court blue
  "#34C759", // Court green
  "#FF9500", // Gold
  "#FF2D55", // Pink
  "#AF52DE", // Purple
];

function generateParticles(): Particle[] {
  return Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    x: 50 + (Math.random() * 20 - 10),
    y: 20,
    size: Math.random() * 8 + 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    vx: (Math.random() - 0.5) * 45,
    vy: Math.random() * 30 + 20,
    vr: (Math.random() - 0.5) * 360,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
}

export function ConfettiCelebration({
  trigger = true,
  onComplete,
}: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const frame = requestAnimationFrame(() => {
      setParticles(generateParticles());
      setActive(true);
    });

    const timer = setTimeout(() => {
      setActive(false);
      setParticles([]);
      onComplete?.();
    }, 2800);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [trigger, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-confetti-fall"
          style={
            {
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              width: `${p.size}px`,
              height: `${p.size * (p.shape === "rect" ? 1.5 : 1)}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "9999px" : "2px",
              "--confetti-vx": `${p.vx}vw`,
              "--confetti-vy": `${p.vy + 70}vh`,
              "--confetti-vr": `${p.vr}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}


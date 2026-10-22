// 10-second standalone interactive app demo audio score & SFX cues (300 frames @ 30fps, 120 BPM)
const cues = [
  // Beat 1 (0.0s–2.6s): Instant `/p/marias` Player Passport hook + Skill Ring + Roles + Click "Share Pass"
  ["whoosh", 0, 0.22, 1.1, -0.7, 0.0, 500, 5800],
  ["pock", 3, 1.25, 0.0, 1.0],
  ["impact", 3, 1.15],
  ["subDrop", 3, 1.05],
  ...Array.from({ length: 6 }, (_, i) => ["tick", 6 + i * 3, 0.8, -0.2 + i * 0.06]),
  ["pop", 10, 0.9, -0.3, 540],
  ["pop", 16, 0.9, 0.0, 620],
  ["pop", 22, 0.9, 0.3, 720],
  ["chime", 28, 81, 0.95, 0.2],
  // Click "Share Pass" at f=70
  ["pock", 70, 1.05, 0.35, 1.15],

  // Beat 2 (2.4s–5.0s): ShareCardModal opens + QR scan + Copy link + 1200x630 Open Graph preview
  ["whoosh", 72, 0.42, 1.12, 0.5, -0.5, 500, 5600],
  ["scanSweep", 84, 0.85, 0.95],
  ["pock", 104, 0.95, -0.3, 1.18],
  ["bleep", 105, 1800, 0.05, 0.85, -0.2],
  ["bleep", 109, 2500, 0.07, 0.9, 0.2],

  // Beat 3 (4.7s–7.5s): Badges unlock + Confetti + Partner Finder (`@junr`) + Match Log (`75% Win Rate`)
  ["whoosh", 142, 0.45, 1.15, -0.6, 0.6, 400, 5400],
  ["impact", 148, 1.15],
  ["confettiSparkle", 150, 1.2, 1.15],
  ["chime", 150, 76, 0.9, -0.4],
  ["chime", 154, 79, 0.9, 0.0],
  ["chime", 158, 84, 1.0, 0.4],
  ["pock", 182, 1.0, 0.4, 1.18],
  ...Array.from({ length: 5 }, (_, i) => ["pop", 162 + i * 5, 0.75, -0.3 + i * 0.1, 500 + i * 45]),

  // Beat 4 (7.3s–10.0s): Finale Lockup + Signature Liquid-Glass Shader CTA
  ["riser", 204, 0.55, 1.05],
  ["impact", 222, 1.22],
  ["subDrop", 222, 1.12],
  ["whoosh", 240, 0.5, 1.0, -0.6, 0.6, 500, 5200],
  ["pock", 269, 1.15, 0.0, 1.05],
  ["confettiSparkle", 269, 1.1, 1.05],
  ["chime", 269, 69, 1.0, -0.3],
  ["chime", 271, 76, 1.0, 0.3],
  ["chime", 273, 81, 1.2, 0.0],
];

module.exports = {
  frames: 300,
  musicGain: 0.8,
  sfxGain: 1.08,
  music: {
    bpm: 120,
    offset: 0.13,
    stopFrame: 268,
    sections: [
      { fromBar: 0, toBar: 5, kick: 1.05, clap: 0.9, hat: 0.85, hat16: true, bass: 1.0, pad: 0.95, arp: 0.95 },
    ],
    filter: [],
    duck: [{ f0: 0, f1: 8, g: 0.5 }],
  },
  cues,
};

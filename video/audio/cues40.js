// 40-second interactive product demo audio score & frame-locked SFX cues (1200 frames @ 30fps, 120 BPM)
const cues = [
  // --- SCENE 1: PLAYER DIRECTORY SEARCH & CLICK (`/players`, 0–100) ---
  ["whoosh", 0, 0.25, 1.0, -0.8, 0.0, 400, 5200],
  ["pock", 4, 1.25, 0.0, 1.0],
  ["impact", 4, 1.15],
  ["subDrop", 4, 1.0],
  // typing query in search bar
  ...Array.from({ length: 10 }, (_, i) => ["typeKey", 6 + i * 3, 0.85, -0.2 + (i % 3) * 0.15]),
  ["pop", 10, 0.8, -0.4, 520],
  ["pop", 14, 0.8, 0.0, 580],
  ["pop", 18, 0.85, 0.4, 640],
  // clicking Maria Santos card at f=53
  ["pock", 53, 1.1, -0.3, 1.15],
  ["chime", 54, 79, 0.9, -0.2],
  ["riser", 44, 1.1, 0.95],

  // --- SCENE 2: SHADER PILL ROUTE TRANSITION -> `/p/marias` (60–165) ---
  ["pock", 68, 1.15, 0.0, 0.95],
  ["impact", 68, 1.0],
  ["whoosh", 70, 0.55, 1.0, -0.6, 0.6, 500, 4800],
  ["chime", 78, 69, 0.85, -0.2],
  ["chime", 82, 76, 0.85, 0.2],
  ["chime", 86, 81, 0.95, 0.0],
  ["scanSweep", 104, 0.85, 0.9],
  ["riser", 125, 0.95, 0.9],
  ["whoosh", 136, 0.6, 1.15, -0.7, 0.7, 300, 5500],
  ["impact", 152, 1.05],

  // --- SCENE 3: PLAYER PASSPORT WALKTHROUGH (`/p/marias`, 145–400) ---
  ["whoosh", 150, 0.7, 1.0, -0.5, 0.4, 350, 4200],
  // skill ring ticks (165 to 210)
  ...Array.from({ length: 14 }, (_, i) => ["tick", 166 + i * 3, 0.75, -0.3 + i * 0.04]),
  ["chime", 210, 81, 1.0, 0.25],
  // role chips pop
  ["pop", 206, 0.9, -0.4, 520],
  ["pop", 218, 0.9, 0.0, 620],
  ["pop", 230, 0.9, 0.4, 740],
  // camera pan to 4-col hardware bar & tournament achievements
  ["whoosh", 246, 0.65, 0.95, 0.4, -0.4, 400, 3800],
  ["tick", 252, 0.8, -0.3],
  ["tick", 260, 0.8, -0.1],
  ["tick", 268, 0.8, 0.1],
  ["tick", 276, 0.8, 0.3],
  // podium medals chime
  ["chime", 290, 76, 0.85, -0.3],
  ["chime", 302, 79, 0.85, 0.0],
  ["chime", 314, 84, 1.0, 0.3],
  // cursor clicks "Share Pass" at f=371 (p=226)
  ["pock", 371, 1.05, 0.4, 1.15],
  ["whoosh", 374, 0.55, 1.15, 0.7, -0.7, 500, 6000],

  // --- SCENE 4: SHARE PASS MODAL & DYNAMIC OG (385–630) ---
  ["pop", 390, 0.95, -0.2, 540],
  ["scanSweep", 408, 1.1, 1.0],
  // click "Copy" at f=433 (local f=48)
  ["pock", 433, 0.95, -0.1, 1.2],
  ["bleep", 434, 1800, 0.06, 0.85, -0.1],
  // click "Share to Apps" at f=461 (local f=76)
  ["pock", 461, 1.05, -0.2, 1.12],
  ["whoosh", 468, 0.65, 1.1, 0.5, -0.5, 400, 5000],
  // 1200x630 OG dimension ticks
  ["tick", 482, 0.85, -0.4],
  ["tick", 488, 0.85, 0.4],
  ["chime", 495, 79, 0.85, 0.0],
  // transition to Open-Play group chat bubbles
  ["whoosh", 532, 0.6, 1.0, -0.5, 0.5, 400, 4600],
  ["pop", 540, 0.95, -0.3, 480],
  ["pop", 554, 1.0, 0.35, 640],
  ["chime", 564, 84, 0.9, 0.3],
  ["pop", 582, 0.95, -0.3, 720],
  ["riser", 595, 0.65, 1.0],
  ["impact", 615, 1.1],

  // --- SCENE 5: INTERACTIVE ENDORSE MODAL & BADGE UNLOCK (615–860) ---
  // typing endorsement note inside EndorseModal (local f 10..48 => global 625..663)
  ...Array.from({ length: 12 }, (_, i) => ["typeKey", 626 + i * 3, 0.8, -0.35]),
  ["pop", 630, 0.9, 0.3, 540],
  ["pop", 646, 0.9, 0.3, 600],
  ["pop", 662, 0.95, 0.3, 680],
  // click "Submit Endorsement" at local f=63 (global 678) -> Endorsement Recorded! + confetti
  ["pock", 678, 1.1, -0.3, 1.12],
  ["chime", 680, 84, 1.0, -0.3],
  ["confettiSparkle", 680, 1.2, 1.0],
  ["riser", 705, 0.8, 1.05],
  // StarBurstWipe into Badges & Accolades Grid (local f=124 => global 739)
  ["impact", 737, 1.25],
  ["subDrop", 737, 1.1],
  ["confettiSparkle", 739, 1.5, 1.2],
  ["chime", 740, 72, 0.9, -0.5],
  ["chime", 746, 76, 0.9, -0.25],
  ["chime", 752, 79, 0.9, 0.0],
  ["chime", 758, 84, 0.95, 0.25],
  ["chime", 764, 88, 1.05, 0.5],
  ["whoosh", 840, 0.6, 1.05, 0.6, -0.6, 350, 5000],

  // --- SCENE 6: PARTNER FINDER (`/partners`) & DASHBOARD MATCH LOG (`/dashboard`) (845–1070) ---
  ["pop", 856, 0.85, 0.2, 540],
  ["pop", 862, 0.85, 0.3, 600],
  ["pock", 868, 0.95, 0.4, 1.1],
  ["pop", 872, 0.85, -0.4, 500],
  ["pop", 879, 0.85, 0.0, 560],
  ["pop", 886, 0.85, 0.4, 620],
  // partner request click
  ["pock", 910, 1.05, -0.35, 1.2],
  ["chime", 912, 81, 0.9, -0.35],
  // transition to `/dashboard` Match Log
  ["whoosh", 952, 0.7, 1.1, -0.5, 0.5, 300, 4800],
  ...Array.from({ length: 8 }, (_, i) => ["pop", 966 + i * 4, 0.78, -0.2 + i * 0.06, 480 + i * 40]),
  ["chime", 1006, 84, 1.05, 0.0],
  ["riser", 1030, 0.9, 1.05],

  // --- SCENE 7: FINALE LOCKUP (1055–1200) ---
  ["impact", 1058, 1.25],
  ["subDrop", 1058, 1.15],
  ["whoosh", 1080, 0.7, 1.0, -0.6, 0.6, 500, 5400],
  ["pock", 1130, 1.15, 0.0, 1.05],
  ["confettiSparkle", 1130, 1.4, 1.1],
  ["chime", 1130, 69, 1.0, -0.3],
  ["chime", 1132, 76, 1.0, 0.3],
  ["chime", 1134, 81, 1.15, 0.0],
];

module.exports = {
  frames: 1200,
  musicGain: 0.78,
  sfxGain: 1.05,
  music: {
    bpm: 120,
    offset: 0.2,
    stopFrame: 1135,
    sections: [
      { fromBar: 0, toBar: 2, kick: 0.7, clap: 0, hat: 0.5, bass: 0.6, pad: 0.8, arp: 0.5 },
      { fromBar: 2, toBar: 6, kick: 1.0, clap: 0.85, hat: 0.8, hat16: true, bass: 0.95, pad: 0.9, arp: 0.85 },
      { fromBar: 6, toBar: 10, kick: 0.95, clap: 0.8, hat: 0.75, bass: 0.9, pad: 1.0, arp: 0.7 },
      { fromBar: 10, toBar: 14, kick: 1.0, clap: 0.9, hat: 0.85, hat16: true, bass: 1.0, pad: 0.95, arp: 0.95, padOct: 1 },
      { fromBar: 14, toBar: 20, kick: 1.05, clap: 0.95, hat: 0.9, hat16: true, bass: 1.0, pad: 1.0, arp: 1.0 },
    ],
    filter: [
      { f0: 250, f1: 315, c0: 16000, c1: 1100 },
      { f0: 315, f1: 345, c0: 1100, c1: 16000 },
      { f0: 615, f1: 695, c0: 2400, c1: 14000 },
    ],
    duck: [
      { f0: 0, f1: 10, g: 0.45 },
      { f0: 730, f1: 745, g: 0.55 },
    ],
  },
  cues,
};

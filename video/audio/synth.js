// PaddleUp procedural audio engine — music bed + SFX, rendered to 48k stereo WAV.
// Usage: node synth.js <cuefile.js> <out.wav>
// All timing in frames @30fps. 120 BPM => 1 beat = 15 frames, 1 bar = 60 frames.
const fs = require('fs');
const path = require('path');
const SR = 48000;
const FPS = 30;
const f2s = (f) => f / FPS;

// ---------- deterministic RNG ----------
let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const nz = () => rnd() * 2 - 1;

// ---------- buses ----------
function makeBus(n) { return { L: new Float32Array(n), R: new Float32Array(n) }; }

// ---------- primitive helpers ----------
function addS(bus, i, l, r) { if (i >= 0 && i < bus.L.length) { bus.L[i] += l; bus.R[i] += r; } }
const panLR = (p) => [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];

// state-variable filter
function svf() { let lp = 0, bp = 0; return (x, fc, q) => { const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR); const hp = x - lp - q * bp; bp += f * hp; lp += f * bp; return { lp, bp, hp }; }; }

// ---------- instruments ----------
function kick(bus, t, g = 1) {
  const s = Math.floor(t * SR), n = Math.floor(0.45 * SR); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; const f = 45 + 120 * Math.exp(-tt * 28); ph += 2 * Math.PI * f / SR; const env = Math.exp(-tt * 7.5); const click = i < 120 ? nz() * 0.3 * (1 - i / 120) : 0; const v = (Math.tanh(Math.sin(ph) * 1.6) * env + click) * 0.85 * g; addS(bus, s + i, v, v); }
}
function clap(bus, t, g = 1) {
  const s = Math.floor(t * SR), n = Math.floor(0.3 * SR); const f = svf();
  for (let i = 0; i < n; i++) { const tt = i / SR; let env = Math.exp(-tt * 22); [0.0, 0.011, 0.022].forEach((o) => { if (tt >= o && tt < o + 0.01) env = Math.max(env, 1 - (tt - o) / 0.01); }); const v = f(nz(), 1400, 0.9).bp * env * 0.9 * g; addS(bus, s + i, v * 0.9, v); }
}
function hat(bus, t, g = 1, open = false) {
  const s = Math.floor(t * SR), n = Math.floor((open ? 0.22 : 0.05) * SR); const f = svf();
  for (let i = 0; i < n; i++) { const tt = i / SR; const env = Math.exp(-tt * (open ? 14 : 70)); const v = f(nz(), 9000, 0.5).hp * env * 0.22 * g; addS(bus, s + i, v * 0.7, v); }
}
// pickleball "pock": hollow plastic ball on composite paddle
function pock(bus, t, g = 1, pan = 0, pitch = 1) {
  const s = Math.floor(t * SR), n = Math.floor(0.18 * SR); const f = svf(), f2 = svf(); const [pl, pr] = panLR(pan);
  let p1 = 0, p2 = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; p1 += 2 * Math.PI * 1150 * pitch * (1 + 0.15 * Math.exp(-tt * 60)) / SR; p2 += 2 * Math.PI * 620 * pitch / SR; const body = Math.sin(p1) * Math.exp(-tt * 55) * 0.6 + Math.sin(p2) * Math.exp(-tt * 38) * 0.45; const crack = f(nz(), 2600 * pitch, 0.6).bp * Math.exp(-tt * 160) * 1.4; const thud = f2(nz(), 300, 0.7).lp * Math.exp(-tt * 40) * 0.8; const v = Math.tanh((body + crack + thud) * 1.3) * 0.8 * g; addS(bus, s + i, v * pl, v * pr); }
}
function tick(bus, t, g = 1, pan = 0) {
  const s = Math.floor(t * SR), n = Math.floor(0.025 * SR); const f = svf(); const [pl, pr] = panLR(pan);
  for (let i = 0; i < n; i++) { const tt = i / SR; const v = (f(nz(), 4500, 0.4).bp * 1.5 + Math.sin(2 * Math.PI * 3200 * tt) * 0.4) * Math.exp(-tt * 260) * 0.35 * g; addS(bus, s + i, v * pl, v * pr); }
}
function pop(bus, t, g = 1, pan = 0, base = 500) {
  const s = Math.floor(t * SR), n = Math.floor(0.12 * SR); const [pl, pr] = panLR(pan); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; const fr = base + base * 1.4 * (1 - Math.exp(-tt * 70)); ph += 2 * Math.PI * fr / SR; const v = Math.sin(ph) * Math.exp(-tt * 30) * 0.42 * g; addS(bus, s + i, v * pl, v * pr); }
}
function whoosh(bus, t, dur = 0.6, g = 1, panFrom = -0.7, panTo = 0.7, fLo = 300, fHi = 4500) {
  const s = Math.floor(t * SR), n = Math.floor(dur * SR); const f = svf(), f2 = svf();
  for (let i = 0; i < n; i++) { const x = i / n; const env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.7)), 2); const fc = fLo + (fHi - fLo) * Math.sin(Math.PI * x); const v = (f(nz(), fc, 0.35).bp * 1.2 + f2(nz(), fc * 0.5, 0.8).lp * 0.4) * env * 0.55 * g; const [pl, pr] = panLR(panFrom + (panTo - panFrom) * x); addS(bus, s + i, v * pl, v * pr); }
}
function riser(bus, t, dur = 1.5, g = 1) {
  const s = Math.floor(t * SR), n = Math.floor(dur * SR); const f = svf(); let ph = 0, ph2 = 0;
  for (let i = 0; i < n; i++) { const x = i / n; const env = Math.pow(x, 2.2); const fc = 400 + 9000 * Math.pow(x, 2); const fr = 180 + 900 * Math.pow(x, 2); ph += 2 * Math.PI * fr / SR; ph2 += 2 * Math.PI * fr * 1.007 / SR; const v = (f(nz(), fc, 0.5).bp * 0.7 + (Math.sin(ph) + Math.sin(ph2)) * 0.12) * env * 0.5 * g; addS(bus, s + i, v * (1 - 0.3 * Math.sin(x * 40)), v * (1 + 0.3 * Math.sin(x * 40))); }
}
function revCym(bus, t, dur = 0.8, g = 1) { // ends at t
  const s = Math.floor((t - dur) * SR), n = Math.floor(dur * SR); const f = svf();
  for (let i = 0; i < n; i++) { const x = i / n; const v = f(nz(), 7000, 0.6).hp * Math.pow(x, 3) * 0.45 * g; addS(bus, s + i, v * 0.8, v); }
}
function impact(bus, t, g = 1) {
  const s = Math.floor(t * SR), n = Math.floor(1.6 * SR); const f = svf(); let ph = 0;
  for (let i = 0; i < n; i++) { const tt = i / SR; const fr = 32 + 70 * Math.exp(-tt * 9); ph += 2 * Math.PI * fr / SR; const sub = Math.sin(ph) * Math.exp(-tt * 2.2) * 1.0; const crack = f(nz(), 1800, 0.5).bp * Math.exp(-tt * 18) * 1.1; const v = Math.tanh((sub + crack) * 1.4) * 0.8 * g; addS(bus, s + i, v, v); }
}
function subDrop(bus, t, g = 1) { const s = Math.floor(t * SR), n = Math.floor(1.2 * SR); let ph = 0; for (let i = 0; i < n; i++) { const tt = i / SR; ph += 2 * Math.PI * (90 * Math.exp(-tt * 2.5) + 28) / SR; const v = Math.sin(ph) * Math.min(1, tt * 60) * Math.exp(-tt * 2) * 0.9 * g; addS(bus, s + i, v, v); } }
function chime(bus, t, midi, g = 1, pan = 0) { // FM bell
  const s = Math.floor(t * SR), n = Math.floor(1.4 * SR); const fr = 440 * Math.pow(2, (midi - 69) / 12); const [pl, pr] = panLR(pan);
  for (let i = 0; i < n; i++) { const tt = i / SR; const mod = Math.sin(2 * Math.PI * fr * 3.5 * tt) * 2.2 * Math.exp(-tt * 6); const v = Math.sin(2 * Math.PI * fr * tt + mod) * Math.exp(-tt * 3.2) * 0.22 * g; addS(bus, s + i, v * pl, v * pr); }
}
function bleep(bus, t, fr = 1800, dur = 0.05, g = 1, pan = 0) { const s = Math.floor(t * SR), n = Math.floor(dur * SR); const [pl, pr] = panLR(pan); for (let i = 0; i < n; i++) { const tt = i / SR; const v = (Math.sin(2 * Math.PI * fr * tt) > 0 ? 1 : -1) * 0.06 * g * Math.min(1, (n - i) / 200); addS(bus, s + i, v * pl, v * pr); } }
function scanSweep(bus, t, dur = 0.8, g = 1) { const s = Math.floor(t * SR), n = Math.floor(dur * SR); let ph = 0; for (let i = 0; i < n; i++) { const x = i / n; ph += 2 * Math.PI * (800 + 2400 * x) / SR; const v = Math.sin(ph) * Math.sin(Math.PI * x) * 0.07 * g * (0.6 + 0.4 * Math.sin(2 * Math.PI * 30 * x)); const [pl, pr] = panLR(-0.6 + 1.2 * x); addS(bus, s + i, v * pl, v * pr); } }
function glitch(bus, t, dur = 0.15, g = 1) { const s = Math.floor(t * SR), n = Math.floor(dur * SR); let hold = 0, cnt = 0; for (let i = 0; i < n; i++) { if (cnt-- <= 0) { hold = nz(); cnt = 20 + Math.floor(rnd() * 200); } const v = hold * 0.25 * g * (rnd() > 0.3 ? 1 : 0); addS(bus, s + i, v, -v); } }
function confettiSparkle(bus, t, dur = 1.2, g = 1) { for (let k = 0; k < 26; k++) { const tt = t + rnd() * dur * Math.pow(rnd(), 0.6); const fr = 3000 + rnd() * 5000; const s = Math.floor(tt * SR), n = Math.floor(0.04 * SR); const p = nz(); const [pl, pr] = panLR(p); for (let i = 0; i < n; i++) { const v = Math.sin(2 * Math.PI * fr * i / SR) * Math.exp(-i / SR * 90) * 0.07 * g; addS(bus, s + i, v * pl, v * pr); } } }
function typeKey(bus, t, g = 1) { tick(bus, t, 0.6 * g, nz() * 0.3); }

// ---------- music ----------
// A minor-ish: Am – F – C – G  (one chord per bar)
const PROG = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 55, 60, 64], [55, 59, 62, 67]];
const ROOT = [45, 41, 48, 43];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function renderMusic(N, plan) {
  // plan: { bpm, sections: [{fromBar,toBar, kick,clap,hat,bass,pad,arp}], filter: [{f0,f1, cutoff0,cutoff1}], stopFrame }
  const music = makeBus(N); const pad = makeBus(N); const bass = makeBus(N);
  const beat = 60 / plan.bpm; const bar = beat * 4;
  const totalBars = Math.ceil(N / SR / bar);
  const sec = (b) => plan.sections.find((s) => b >= s.fromBar && b < s.toBar) || {};
  const stopT = plan.stopFrame ? f2s(plan.stopFrame) : 1e9;
  for (let b = 0; b < totalBars; b++) {
    const S = sec(b); const t0 = b * bar + (plan.offset || 0); const ci = b % 4;
    for (let q = 0; q < 4; q++) {
      const tq = t0 + q * beat; if (tq >= stopT) continue;
      if (S.kick) kick(music, tq, S.kick);
      if (S.clap && (q === 1 || q === 3)) clap(music, tq, S.clap);
      if (S.hat) { hat(music, tq + beat / 2, S.hat, q === 3); if (S.hat16) { hat(music, tq + beat / 4, S.hat * 0.45); hat(music, tq + 3 * beat / 4, S.hat * 0.45); } }
    }
    // pad chord (detuned saws), 1 bar
    if (S.pad) {
      const s = Math.floor(t0 * SR), n = Math.floor(bar * SR);
      for (const m of PROG[ci]) {
        const fr = mtof(m + 12 * (S.padOct || 0)); const phs = [0, 0, 0];
        for (let i = 0; i < n; i++) { const tt = i / SR; if (t0 + tt >= stopT) break; let v = 0; [-0.12, 0, 0.11].forEach((d, k) => { phs[k] += fr * Math.pow(2, d / 12) / SR; v += ((phs[k] % 1) * 2 - 1); }); const env = Math.min(1, tt * 8) * Math.min(1, (bar - tt) * 10); addS(pad, s + i, v * env * 0.035 * S.pad, v * env * 0.035 * S.pad * (k => 1)(0)); }
      }
    }
    // bass: offbeat pumping 8ths
    if (S.bass) {
      for (let e = 0; e < 8; e++) {
        const te = t0 + e * beat / 2; if (te >= stopT) continue; const s = Math.floor(te * SR), n = Math.floor(beat / 2 * SR * 0.9); const fr = mtof(ROOT[ci] - 12 + (e % 2 ? 12 : 0)); let ph = 0;
        for (let i = 0; i < n; i++) { const tt = i / SR; ph += fr / SR; const saw = (ph % 1) * 2 - 1; const sine = Math.sin(2 * Math.PI * ph); const env = Math.min(1, tt * 200) * Math.exp(-tt * 6); const v = (sine * 0.7 + saw * 0.18) * env * 0.42 * S.bass; addS(bass, s + i, v, v); }
      }
    }
    // pluck arp 16ths
    if (S.arp) {
      const notes = PROG[ci]; for (let k = 0; k < 16; k++) {
        const tk = t0 + k * beat / 4; if (tk >= stopT) continue; const m = notes[[0, 2, 1, 3, 2, 0, 3, 1][k % 8]] + 12; const s = Math.floor(tk * SR), n = Math.floor(0.22 * SR); const fr = mtof(m); const p = Math.sin(k) * 0.5; const [pl, pr] = panLR(p); const fl = svf();
        for (let i = 0; i < n; i++) { const tt = i / SR; const sq = (Math.sin(2 * Math.PI * fr * tt) > 0 ? 1 : -1) * 0.5 + Math.sin(2 * Math.PI * fr * 2 * tt) * 0.3; const v = fl(sq, 600 + 4000 * Math.exp(-tt * 25), 0.6).lp * Math.exp(-tt * 14) * 0.12 * S.arp; addS(music, s + i, v * pl, v * pr); }
      }
    }
  }
  // sidechain pump on pad+bass from kick grid
  const pumpAt = (t) => { const ph = ((t - (plan.offset || 0)) % beat) / beat; return 0.35 + 0.65 * Math.min(1, ph * 3.2); };
  const lpL = svf(), lpR = svf();
  for (let i = 0; i < N; i++) {
    const t = i / SR; const fr = t * FPS; const pmp = pumpAt(t);
    let L = music.L[i] + (pad.L[i] + bass.L[i]) * pmp, R = music.R[i] + (pad.R[i] + bass.R[i]) * pmp;
    // filter automation
    let cut = 18000; for (const a of plan.filter || []) { if (fr >= a.f0 && fr <= a.f1) { const x = (fr - a.f0) / (a.f1 - a.f0); cut = Math.exp(Math.log(a.c0) + (Math.log(a.c1) - Math.log(a.c0)) * x); } }
    if (cut < 17000) { L = lpL(L, cut, 0.7).lp; R = lpR(R, cut, 0.7).lp; } else { lpL(L, 18000, 0.7); lpR(R, 18000, 0.7); }
    // duck & stop
    let duck = 1; for (const d of plan.duck || []) { if (fr >= d.f0 && fr <= d.f1) duck = Math.min(duck, d.g); }
    if (t >= stopT) duck = 0;
    music.L[i] = L * duck; music.R[i] = R * duck;
  }
  return music;
}

// ---------- reverb (Schroeder) ----------
function reverb(bus, mix = 0.25) {
  const N = bus.L.length; const out = makeBus(N);
  const combs = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116].map((d) => Math.floor(d * SR / 44100));
  const aps = [225, 556, 441, 341].map((d) => Math.floor(d * SR / 44100));
  for (const ch of ['L', 'R']) {
    const x = bus[ch]; const y = new Float32Array(N); const sp = ch === 'R' ? 23 : 0;
    for (const d0 of combs) { const d = d0 + sp; const buf = new Float32Array(d); let idx = 0, lp = 0; for (let i = 0; i < N; i++) { const o = buf[idx]; lp = o * 0.8 + lp * 0.2; buf[idx] = x[i] + lp * 0.84; idx = (idx + 1) % d; y[i] += o * 0.125; } }
    for (const d0 of aps) { const d = d0 + sp; const buf = new Float32Array(d); let idx = 0; for (let i = 0; i < N; i++) { const b = buf[idx]; const o = -y[i] + b; buf[idx] = y[i] + b * 0.5; idx = (idx + 1) % d; y[i] = o; } }
    for (let i = 0; i < N; i++) out[ch][i] = x[i] + y[i] * mix;
  }
  return out;
}

// ---------- main ----------
const cueFile = process.argv[2]; const outFile = process.argv[3];
const cfg = require(path.resolve(cueFile));
const N = Math.floor(f2s(cfg.frames) * SR) + SR; // +1s tail
const music = renderMusic(N, cfg.music);
const sfx = makeBus(N);
const api = { kick, clap, hat, pock, tick, pop, whoosh, riser, revCym, impact, subDrop, chime, bleep, scanSweep, glitch, confettiSparkle, typeKey };
for (const c of cfg.cues) { const [name, frame, ...args] = c; api[name](sfx, f2s(frame), ...args); }
const sfxW = reverb(sfx, 0.3);
const musW = reverb(music, 0.12);
// master: sum, glue compress, limiter
const L = new Float32Array(N), R = new Float32Array(N);
let env = 0; const total = Math.floor(f2s(cfg.frames) * SR);
for (let i = 0; i < N; i++) {
  let l = musW.L[i] * (cfg.musicGain || 0.8) + sfxW.L[i] * (cfg.sfxGain || 1.0); let r = musW.R[i] * (cfg.musicGain || 0.8) + sfxW.R[i] * (cfg.sfxGain || 1.0);
  const pk = Math.max(Math.abs(l), Math.abs(r)); env = pk > env ? pk : env * 0.9997 + pk * 0.0003; const gr = env > 0.7 ? 0.7 / env : 1;
  l = Math.tanh(l * gr * 1.15) * 0.95; r = Math.tanh(r * gr * 1.15) * 0.95;
  const fade = i > total ? Math.max(0, 1 - (i - total) / (SR * 0.5)) : 1;
  L[i] = l * fade; R[i] = r * fade;
}
const outN = total; const data = Buffer.alloc(44 + outN * 4);
data.write('RIFF', 0); data.writeUInt32LE(36 + outN * 4, 4); data.write('WAVE', 8); data.write('fmt ', 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22); data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34); data.write('data', 36); data.writeUInt32LE(outN * 4, 40);
for (let i = 0; i < outN; i++) { data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * 32767))), 44 + i * 4); data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * 32767))), 46 + i * 4); }
fs.mkdirSync(path.dirname(outFile), { recursive: true }); fs.writeFileSync(outFile, data);
console.log('wrote', outFile, (outN / SR).toFixed(2) + 's');


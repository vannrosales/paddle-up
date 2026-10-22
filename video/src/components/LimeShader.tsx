import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * PaddleUp signature look: lime liquid-glass.
 * Domain-warped flowing lime "liquid", iridescent thin-film fresnel rim,
 * sweeping specular glint, inner shadow, film grain, and smooth radial outer glow
 * that feathers cleanly to 0.0 before the canvas border (zero rectangular clipping).
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;      // canvas px
uniform vec2 uBox;      // box half-size px
uniform float uR;       // corner radius px
uniform float uPad;     // padding px around box
uniform float uT;       // time s
uniform float uGlow;    // glow amount
uniform float uGlint;   // glint sweep phase (-1..2)
uniform float uFlow;    // flow intensity
uniform float uSeed;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
float sdRoundBox(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+r; return length(max(q,0.))+min(max(q.x,q.y),0.)-r; }

void main(){
  vec2 px = gl_FragCoord.xy - uRes*0.5;
  float d = sdRoundBox(px, uBox, uR);
  float minDim = min(uBox.x, uBox.y);
  vec2 uv = px / max(uBox.x, uBox.y);
  vec2 nuv = px / uBox; // -1..1 inside box

  // liquid domain warp
  float t = uT*0.35*uFlow + uSeed;
  vec2 q = vec2(fbm(uv*1.6 + vec2(0., t)), fbm(uv*1.6 + vec2(5.2, -t*0.8)));
  vec2 r = vec2(fbm(uv*1.9 + 3.0*q + vec2(1.7, 9.2) + t*0.6), fbm(uv*1.9 + 3.0*q + vec2(8.3, 2.8) - t*0.5));
  float liquid = fbm(uv*1.4 + 3.2*r);

  vec3 limeDeep = vec3(0.62, 0.86, 0.05);
  vec3 lime = vec3(0.831, 1.0, 0.227);
  vec3 limeHot = vec3(0.95, 1.0, 0.62);
  vec3 col = mix(limeDeep, lime, smoothstep(0.25, 0.7, liquid));
  col = mix(col, limeHot, smoothstep(0.62, 0.9, liquid)*0.7);

  // edge factor (fresnel-ish), 1 at rim
  float e = 1.0 - clamp(-d / (minDim*0.55), 0.0, 1.0);
  float e2 = pow(e, 2.6);
  // iridescent thin film
  vec3 film = 0.5 + 0.5*cos(6.2831*(vec3(0.0, 0.33, 0.67) + e*1.3 + liquid*0.8 + uT*0.12 + nuv.x*0.25));
  col = mix(col, col*0.55 + film*0.75, e2*0.75);

  // top specular band
  col += vec3(1.0)*smoothstep(0.55, 1.0, nuv.y)*0.18*(1.-e2);
  // bottom inner shadow
  col *= 1.0 - smoothstep(-0.2, -1.0, nuv.y)*0.22;
  // sweeping glint
  float gx = nuv.x*0.5 + nuv.y*0.22 - (uGlint*2.0-1.0)*1.2;
  float glint = exp(-pow(gx*7.0, 2.0)) * 0.85 + exp(-pow((gx-0.09)*22.0, 2.0))*0.5;
  col += vec3(1.0, 1.0, 0.92) * glint * (1.0 - e*0.4);
  // rim highlight line
  float rim = smoothstep(2.5, 0.0, abs(d + 1.5));
  col += vec3(1.0)*rim*0.55*(0.5+0.5*nuv.y);

  // grain
  float g = hash(gl_FragCoord.xy + fract(uT*7.0)*100.0) - 0.5;
  col += g*0.05;

  float inside = smoothstep(1.0, -1.0, d);
  // Smooth radial window that reaches 0.0 well before uPad so there is NEVER a rectangular border
  float maxReach = max(1.0, uPad * 0.88);
  float edgeWindow = smoothstep(maxReach, 0.0, max(d, 0.0));
  edgeWindow = edgeWindow * edgeWindow;
  float glow = exp(-max(d,0.0)/(minDim*0.75)) * edgeWindow * uGlow * (1.0-inside);
  vec3 glowCol = mix(vec3(0.83,1.0,0.23), vec3(0.04,0.52,1.0), 0.35+0.35*sin(uT*0.8 + atan(px.y,px.x)))*0.9;
  float a = inside + glow*0.50;
  vec3 outc = col*inside + glowCol*glow*0.50;
  gl_FragColor = vec4(outc, a);
}`;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

type Props = {
  w: number;
  h: number;
  r?: number;
  pad?: number;
  glow?: number;
  glint?: number; // 0..1 sweep progress
  flow?: number;
  seed?: number;
  timeOffset?: number;
  style?: React.CSSProperties;
};

export const LimeShader: React.FC<Props> = ({ w, h, r, pad = 0, glow = 0, glint = -1, flow = 1, seed = 0, timeOffset = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram } | null>(null);
  const cw = Math.max(2, Math.round(w + pad * 2));
  const ch = Math.max(2, Math.round(h + pad * 2));

  useLayoutEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (!glRef.current) {
      const gl = c.getContext("webgl", { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true, alpha: true });
      if (!gl) return;
      const sh = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      glRef.current = { gl, prog };
    }
    const { gl, prog } = glRef.current;
    gl.viewport(0, 0, cw, ch);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    gl.uniform2f(u("uRes"), cw, ch);
    gl.uniform2f(u("uBox"), w / 2, h / 2);
    gl.uniform1f(u("uR"), Math.min(r ?? h / 2, Math.min(w, h) / 2));
    gl.uniform1f(u("uPad"), pad);
    gl.uniform1f(u("uT"), frame / fps + timeOffset);
    gl.uniform1f(u("uGlow"), glow);
    gl.uniform1f(u("uGlint"), glint);
    gl.uniform1f(u("uFlow"), flow);
    gl.uniform1f(u("uSeed"), seed);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });

  return (
    <canvas
      ref={ref}
      width={cw}
      height={ch}
      style={{ position: "absolute", left: -pad, top: -pad, width: cw, height: ch, pointerEvents: "none", ...style }}
    />
  );
};

/** Signature button: lime liquid-glass pill with label. */
export const ShaderButton: React.FC<{
  w: number;
  h: number;
  label?: React.ReactNode;
  glow?: number;
  glint?: number;
  press?: number; // 0..1
  fontSize?: number;
  style?: React.CSSProperties;
  r?: number;
}> = ({ w, h, label, glow = 0.8, glint = -1, press = 0, fontSize, style, r }) => {
  return (
    <div style={{ position: "relative", width: w, height: h, transform: `scale(${1 - press * 0.06})`, ...style }}>
      <LimeShader w={w} h={h} r={r} pad={Math.round(h * 1.35)} glow={glow} glint={glint} />
      {label != null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: h * 0.16,
            color: "#1C2A00",
            fontWeight: 800,
            fontSize: fontSize ?? h * 0.36,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            textShadow: "0 1px 0 rgba(255,255,255,0.35)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

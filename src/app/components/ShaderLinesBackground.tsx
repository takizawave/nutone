/**
 * Rhizomatiks-style hero background: spectrum bars, waveforms, grid,
 * glitch rects, particles, data readout. #020204 base.
 */
import { useEffect, useRef } from "react";

function hash(n: number): number {
  const s = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise1D(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hash(i) * (1 - u) + hash(i + 1) * u;
}

function fbm(x: number, oct = 5): number {
  let v = 0,
    a = 0.5,
    f = 1;
  for (let i = 0; i < oct; i++) {
    v += noise1D(x * f) * a;
    a *= 0.45;
    f *= 2.13;
  }
  return v;
}

export interface ShaderLinesBackgroundProps {
  reducedMotion?: boolean;
}

export function ShaderLinesBackground({ reducedMotion = false }: ShaderLinesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const offA = document.createElement("canvas");
    const ctxA = offA.getContext("2d");
    if (!ctxA) return;

    let w = 0,
      h = 0;
    let barCount = 0;
    let barX: Float32Array;
    let barW: Float32Array;
    let barPhase: Float32Array;
    let barFreq: Float32Array;
    let barReact: Float32Array;

    const glitchRects: {
      x: number;
      y: number;
      w: number;
      h: number;
      life: number;
      maxLife: number;
      bright: number;
    }[] = [];

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
    }[] = [];
    const MAX_PARTICLES = 80;

    const resize = () => {
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offA.width = Math.floor(w * 0.35);
      offA.height = Math.floor(h * 0.35);

      barCount = Math.floor(w / 1.6);
      barX = new Float32Array(barCount);
      barW = new Float32Array(barCount);
      barPhase = new Float32Array(barCount);
      barFreq = new Float32Array(barCount);
      barReact = new Float32Array(barCount);
      for (let i = 0; i < barCount; i++) {
        const nx = i / barCount;
        const r = hash(i * 7.31);
        const r2 = hash(i * 13.77 + 3.1);
        barX[i] = nx * w;
        barW[i] = 0.3 + r * 1.8;
        barPhase[i] = r * Math.PI * 2;
        barFreq[i] = nx;
        barReact[i] = 0.2 + r2 * 0.8;
      }
    };

    let beat = 0,
      beatTarget = 0,
      beatClock = 0;
    let kickFlash = 0,
      snareFlash = 0;

    const draw = (time: number) => {
      if (!w) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      const t = reducedMotion ? 0 : time * 0.001;
      const dt = reducedMotion ? 0 : 0.016;

      beatClock -= dt;
      if (beatClock <= 0) {
        beatTarget = 0.4 + hash(Math.floor(t * 3.1)) * 0.6;
        beatClock = 0.25 + hash(Math.floor(t * 2.7)) * 0.5;
        if (hash(Math.floor(t * 5.3)) > 0.5) kickFlash = 1;
        if (hash(Math.floor(t * 7.1 + 1)) > 0.65) snareFlash = 1;
      }
      beat += (beatTarget - beat) * 0.12;
      kickFlash *= 0.88;
      snareFlash *= 0.9;

      if (!reducedMotion && (hash(t * 11.3) > 0.92 || kickFlash > 0.5)) {
        const count = kickFlash > 0.5 ? 3 : 1;
        for (let g = 0; g < count; g++) {
          glitchRects.push({
            x: hash(t * 17 + g) * w,
            y: hash(t * 23 + g * 7) * h,
            w: 20 + hash(t * 31 + g) * 200,
            h: 1 + hash(t * 37 + g) * 8,
            life: 0.05 + hash(t * 41 + g) * 0.12,
            maxLife: 0.05 + hash(t * 41 + g) * 0.12,
            bright: 0.3 + hash(t * 43 + g) * 0.7,
          });
        }
      }

      if (
        !reducedMotion &&
        particles.length < MAX_PARTICLES &&
        hash(t * 19) > 0.7
      ) {
        particles.push({
          x: hash(t * 29) * w,
          y: hash(t * 33) * h,
          vx: (hash(t * 37) - 0.5) * 20,
          vy: -10 - hash(t * 41) * 30,
          life: 1,
          size: 0.5 + hash(t * 47) * 1.5,
        });
      }

      const midY = h * 0.5;
      const gw = offA.width,
        gh = offA.height;
      const sx = gw / w;
      const gMid = gh * 0.5;

      ctxA.fillStyle = "#020204";
      ctxA.fillRect(0, 0, gw, gh);

      for (let i = 0; i < barCount; i += 3) {
        const freq = barFreq[i];
        const n = fbm(barPhase[i] + t * 0.2 + freq * 4, 3);
        const lowBoost = freq < 0.25 ? 1.8 : 1;
        const highDetail =
          freq > 0.7 ? 0.3 + 0.7 * Math.sin(t * 4 + barPhase[i]) : 1;
        const amp =
          (0.03 + n * 0.2 + beat * barReact[i] * 0.25) * lowBoost * highDetail;
        const barH = amp * gh;
        if (barH < 1) continue;
        const bx = barX[i] * sx;
        const bw = Math.max(1, barW[i] * sx * 2);
        const alpha = Math.min(1, amp * 3);
        ctxA.fillStyle = `rgba(220,225,240,${alpha * 0.7})`;
        ctxA.fillRect(bx, gMid - barH, bw, barH * 2);
      }

      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(255,255,255,0.018)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.5;
      ctx.filter = "blur(16px)";
      ctx.drawImage(offA, 0, 0, w, h);
      ctx.filter = "blur(45px)";
      ctx.globalAlpha = 0.3;
      ctx.drawImage(offA, 0, 0, w, h);
      ctx.filter = "none";
      ctx.globalAlpha = 1;

      for (let i = 0; i < barCount; i++) {
        const freq = barFreq[i];
        const n = fbm(barPhase[i] + t * 0.2 + freq * 4, 4);
        const lowBoost = freq < 0.25 ? 1.8 : 1;
        const midBoost = freq > 0.3 && freq < 0.6 ? 1.2 : 1;
        const highDetail =
          freq > 0.7 ? 0.3 + 0.7 * Math.sin(t * 4 + barPhase[i]) : 1;
        const kickImpact = freq < 0.2 ? kickFlash * 0.5 : 0;
        const snareImpact = freq > 0.5 ? snareFlash * 0.3 : 0;
        const amp =
          (0.02 +
            n * 0.18 +
            beat * barReact[i] * 0.2 +
            kickImpact +
            snareImpact) *
          lowBoost *
          midBoost *
          highDetail;
        const barH = amp * h;
        if (barH < 0.5) continue;
        const bw = barW[i] * (0.6 + n * 0.5);
        const alpha = Math.min(1, amp * 2.5);
        const r = Math.floor(200 + (1 - freq) * 55);
        const g = Math.floor(205 + freq * 30);
        const b = Math.floor(210 + freq * 45);
        const grad = ctx.createLinearGradient(
          0,
          midY - barH,
          0,
          midY + barH
        );
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.15, `rgba(${r},${g},${b},${alpha * 0.15})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.7})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.7})`);
        grad.addColorStop(0.85, `rgba(${r},${g},${b},${alpha * 0.15})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(barX[i], midY - barH, bw, barH * 2);
      }

      const waveforms = [
        {
          freq: 0.006,
          amp: 0.1,
          speed: 0.7,
          lw: 1.2,
          alpha: 0.25,
          harmonics: 4,
        },
        {
          freq: 0.015,
          amp: 0.04,
          speed: 1.8,
          lw: 0.7,
          alpha: 0.15,
          harmonics: 3,
        },
        {
          freq: 0.003,
          amp: 0.18,
          speed: 0.25,
          lw: 2,
          alpha: 0.08,
          harmonics: 5,
        },
        {
          freq: 0.025,
          amp: 0.015,
          speed: 3.5,
          lw: 0.5,
          alpha: 0.2,
          harmonics: 2,
        },
      ];

      for (const wf of waveforms) {
        const pulseAmp =
          wf.amp * (1 + beat * 0.6 + (reducedMotion ? 0 : kickFlash * 0.4));
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${wf.alpha})`;
        ctx.lineWidth = wf.lw;
        for (let px = 0; px <= w; px += 2) {
          let y = midY;
          for (let harm = 1; harm <= wf.harmonics; harm++) {
            const hf = wf.freq * harm * 1.3;
            const ha = pulseAmp / (harm * 0.7);
            y +=
              Math.sin(
                px * hf + t * wf.speed * harm * 0.6 + harm * 1.3
              ) *
              ha *
              h;
          }
          const nx = px / w;
          y += (fbm(nx * 8 + t * 0.1, 3) - 0.5) * h * 0.015;
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.save();
        ctx.filter = "blur(6px)";
        ctx.globalAlpha = wf.alpha * 0.3;
        ctx.lineWidth = wf.lw * 5;
        ctx.strokeStyle = `rgba(200,210,240,${wf.alpha * 0.2})`;
        ctx.beginPath();
        for (let px = 0; px <= w; px += 4) {
          let y = midY;
          for (let harm = 1; harm <= wf.harmonics; harm++) {
            y +=
              Math.sin(
                px * wf.freq * harm * 1.3 +
                  t * wf.speed * harm * 0.6 +
                  harm * 1.3
              ) *
              (pulseAmp / (harm * 0.7)) *
              h;
          }
          if (px === 0) ctx.moveTo(px, y);
          else ctx.lineTo(px, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      const lineAlpha = 0.06 + beat * 0.04 + kickFlash * 0.08;
      const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
      lineGrad.addColorStop(0, `rgba(255,255,255,0)`);
      lineGrad.addColorStop(0.1, `rgba(255,255,255,${lineAlpha * 0.5})`);
      lineGrad.addColorStop(0.5, `rgba(255,255,255,${lineAlpha})`);
      lineGrad.addColorStop(0.9, `rgba(255,255,255,${lineAlpha * 0.5})`);
      lineGrad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, midY - 0.3, w, 0.6);

      if (!reducedMotion) {
        const scanY = ((t * 0.08) % 1) * h;
        const scanGrad = ctx.createLinearGradient(
          0,
          scanY - 30,
          0,
          scanY + 30
        );
        scanGrad.addColorStop(0, `rgba(255,255,255,0)`);
        scanGrad.addColorStop(0.5, `rgba(255,255,255,0.03)`);
        scanGrad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 30, w, 60);
      }

      for (let i = glitchRects.length - 1; i >= 0; i--) {
        const gr = glitchRects[i];
        gr.life -= dt;
        if (gr.life <= 0) {
          glitchRects.splice(i, 1);
          continue;
        }
        const lifeRatio = gr.life / gr.maxLife;
        ctx.fillStyle = `rgba(255,255,255,${gr.bright * lifeRatio * 0.25})`;
        ctx.fillRect(gr.x, gr.y, gr.w, gr.h);
        if (hash(i + t) > 0.7) {
          ctx.fillStyle = `rgba(0,0,0,${gr.bright * lifeRatio * 0.4})`;
          ctx.fillRect(gr.x + 2, gr.y + gr.h + 1, gr.w * 0.7, gr.h);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 5 * dt;
        p.life -= dt * 0.5;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255,255,255,${p.life * 0.4})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.font = "9px 'IBM Plex Mono', monospace";
      for (let i = 0; i < 8; i++) {
        const fx = w * 0.08 + (w * 0.84) * (i / 7);
        const freqVal = [20, 50, 100, 250, 500, 1000, 5000, 20000][i];
        const alpha = 0.12 + Math.sin(t * 0.5 + i) * 0.04;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillText(
          `${freqVal >= 1000 ? freqVal / 1000 + "k" : freqVal}Hz`,
          fx,
          midY + h * 0.22
        );
      }
      for (let i = 0; i < 5; i++) {
        const dy = midY - h * 0.15 + (h * 0.3) * (i / 4);
        ctx.fillStyle = `rgba(255,255,255,0.08)`;
        ctx.fillText(
          [0, -6, -12, -24, -48][i] + "dB",
          w * 0.03,
          dy
        );
      }
      const timeStr = new Date().toISOString().slice(11, 23);
      ctx.fillStyle = `rgba(255,255,255,0.1)`;
      ctx.fillText(`T: ${timeStr}`, w * 0.03, h * 0.06);
      ctx.fillText(`SR: 48000 | BIT: 24 | CH: 2`, w * 0.03, h * 0.06 + 14);
      ctx.fillText(
        `BPM: ${(120 + Math.floor(beat * 20)).toString()}`,
        w * 0.03,
        h * 0.06 + 28
      );
      const rmsVal = (beat * 0.7 + 0.2).toFixed(3);
      const peakVal = (beat * 0.9 + kickFlash * 0.3).toFixed(3);
      ctx.fillStyle = `rgba(255,255,255,0.08)`;
      ctx.textAlign = "right";
      ctx.fillText(`RMS: ${rmsVal}`, w * 0.97, h * 0.06);
      ctx.fillText(`PEAK: ${peakVal}`, w * 0.97, h * 0.06 + 14);
      ctx.fillText(
        `LAT: ${(2.1 + noise1D(t * 0.3) * 0.5).toFixed(1)}ms`,
        w * 0.97,
        h * 0.06 + 28
      );
      ctx.textAlign = "left";
      ctx.font = "7px 'IBM Plex Mono', monospace";
      ctx.fillStyle = `rgba(255,255,255,0.04)`;
      let binStr = "";
      for (let bi = 0; bi < 120; bi++) {
        binStr += hash(bi + Math.floor(t * 8)) > 0.5 ? "1" : "0";
        if (bi % 8 === 7) binStr += " ";
      }
      ctx.fillText(binStr, w * 0.05, h * 0.94);
      let hexStr = "";
      for (let hi = 0; hi < 40; hi++) {
        hexStr += Math.floor(hash(hi + Math.floor(t * 6)) * 16)
          .toString(16)
          .toUpperCase();
        if (hi % 2 === 1) hexStr += " ";
      }
      ctx.fillText(hexStr, w * 0.05, h * 0.94 + 11);

      if (kickFlash > 0.1) {
        ctx.fillStyle = `rgba(255,255,255,${kickFlash * 0.03})`;
        ctx.fillRect(0, 0, w, h);
      }

      const gp = 0.04 + Math.sin(t * 0.12) * 0.015 + beat * 0.02;
      const g1 = ctx.createRadialGradient(
        w * 0.45,
        midY,
        0,
        w * 0.45,
        midY,
        Math.min(w, h) * 0.6
      );
      g1.addColorStop(0, `rgba(200,210,240,${gp})`);
      g1.addColorStop(0.3, `rgba(180,185,200,${gp * 0.3})`);
      g1.addColorStop(1, `rgba(0,0,0,0)`);
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const edgeT = ctx.createLinearGradient(0, 0, 0, h * 0.25);
      edgeT.addColorStop(0, `rgba(2,2,4,0.75)`);
      edgeT.addColorStop(1, `rgba(2,2,4,0)`);
      ctx.fillStyle = edgeT;
      ctx.fillRect(0, 0, w, h * 0.25);
      const edgeB = ctx.createLinearGradient(0, h * 0.78, 0, h);
      edgeB.addColorStop(0, `rgba(2,2,4,0)`);
      edgeB.addColorStop(1, `rgba(2,2,4,0.8)`);
      ctx.fillStyle = edgeB;
      ctx.fillRect(0, h * 0.78, w, h * 0.22);
      const edgeL = ctx.createLinearGradient(0, 0, w * 0.12, 0);
      edgeL.addColorStop(0, `rgba(2,2,4,0.6)`);
      edgeL.addColorStop(1, `rgba(2,2,4,0)`);
      ctx.fillStyle = edgeL;
      ctx.fillRect(0, 0, w * 0.12, h);
      const edgeR = ctx.createLinearGradient(w * 0.88, 0, w, 0);
      edgeR.addColorStop(0, `rgba(2,2,4,0)`);
      edgeR.addColorStop(1, `rgba(2,2,4,0.6)`);
      ctx.fillStyle = edgeR;
      ctx.fillRect(w * 0.88, 0, w * 0.12, h);
      const vig = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        Math.min(w, h) * 0.25,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.7
      );
      vig.addColorStop(0, `rgba(0,0,0,0)`);
      vig.addColorStop(0.5, `rgba(0,0,0,0.1)`);
      vig.addColorStop(1, `rgba(0,0,0,0.5)`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = `rgba(0,0,0,0.04)`;
      for (let sl = 0; sl < h; sl += 3) {
        ctx.fillRect(0, sl, w, 1);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

import { useRef, useEffect, useCallback, useState } from "react";
import { useRaf } from "../../hooks/useRaf";
import { useResizeObserver } from "../../hooks/useResizeObserver";
import {
  getDemoEnergy,
  createMicAnalyser,
  hash,
  type AudioAnalyserResult,
} from "../lib/audio";

export interface BarSmoothing {
  attack: number;
  release: number;
}

export interface PixelAudioRibbonBackgroundProps {
  density?: number;
  ribbonThickness?: number;
  speed?: number;
  noiseAmount?: number;
  barCount?: number;
  barMaxLen?: number;
  barMinLen?: number;
  barSmoothing?: BarSmoothing;
  audioMode?: "demo" | "mic";
  opacity?: number;
  seed?: number;
  reducedMotionBehavior?: "freeze" | "slow";
  reducedMotion?: boolean;
}

const DEFAULT_SMOOTHING: BarSmoothing = { attack: 0.35, release: 0.08 };

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function PixelAudioRibbonBackground({
  density = 8,
  ribbonThickness = 80,
  speed = 0.6,
  noiseAmount = 0.4,
  barCount = 48,
  barMaxLen = 70,
  barMinLen = 4,
  barSmoothing = DEFAULT_SMOOTHING,
  audioMode = "demo",
  opacity = 0.5,
  seed = 0,
  reducedMotionBehavior = "freeze",
  reducedMotion = false,
}: PixelAudioRibbonBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [setContainerRef, size] = useResizeObserver<HTMLDivElement>();
  const analyserRef = useRef<AudioAnalyserResult | null>(null);
  const smoothedEnergyRef = useRef<Float32Array>(new Float32Array(barCount));
  const tRef = useRef(0);

  const frozen = reducedMotion && reducedMotionBehavior === "freeze";
  const effectiveSpeed = reducedMotion
    ? reducedMotionBehavior === "slow"
      ? speed * 0.15
      : 0
    : speed;

  const { attack, release } = barSmoothing;

  useEffect(() => {
    if (audioMode !== "mic") return;
    let mounted = true;
    createMicAnalyser().then((result) => {
      if (!mounted) {
        result?.dispose();
        return;
      }
      analyserRef.current = result;
    });
    return () => {
      mounted = false;
      analyserRef.current?.dispose();
      analyserRef.current = null;
    };
  }, [audioMode]);

  const getEnergy = useCallback(
    (binCount: number): Float32Array => {
      const t = tRef.current;
      if (audioMode === "mic" && analyserRef.current) {
        return analyserRef.current.getEnergy(binCount);
      }
      return getDemoEnergy(binCount, t, seed);
    },
    [audioMode, seed]
  );

  const draw = useCallback(
    (elapsed: number, delta: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !size) return;

      const dpr = Math.min(2, window.devicePixelRatio);
      const w = size.width * dpr;
      const h = size.height * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      if (!frozen) tRef.current = elapsed * 0.001;

      const t = tRef.current;
      const midY = h / 2;
      const freq = 0.012;
      const A = h * 0.12;
      const A2 = h * 0.06;

      const centerline = (x: number) =>
        midY +
        A * Math.sin(x * freq + t * effectiveSpeed) +
        A2 * Math.sin(x * freq * 0.7 - t * effectiveSpeed * 0.8);

      const tangent = (x: number, dx: number = 4) => {
        const y1 = centerline(x - dx);
        const y2 = centerline(x + dx);
        const tx = 2 * dx;
        const ty = y2 - y1;
        const len = Math.sqrt(tx * tx + ty * ty) || 1;
        return { tx: tx / len, ty: ty / len };
      };

      const normal = (x: number) => {
        const { tx, ty } = tangent(x);
        return { nx: -ty, ny: tx };
      };

      ctx.clearRect(0, 0, w, h);

      const cell = Math.max(2, Math.floor(w / (80 * density)));
      const thick = (ribbonThickness / 100) * h;

      for (let gx = 0; gx < w; gx += cell) {
        for (let gy = 0; gy < h; gy += cell) {
          const cx = gx + cell / 2;
          const cy = gy + cell / 2;
          const yc = centerline(cx);
          const dist = Math.abs(cy - yc);
          const falloff = 1 - dist / thick;
          const n = hash(gx / cell, gy / cell, seed);
          const p = Math.max(0, Math.min(1, falloff + (n - 0.5) * noiseAmount));
          const drawCell = hash(gx / cell + 1, gy / cell + 1, seed + 0.1);
          if (drawCell < p) {
            const alpha = 0.08 + 0.12 * (0.5 + 0.5 * Math.sin(gx * 0.02 + t));
            ctx.fillStyle = `rgba(255,255,255,${alpha * opacity})`;
            ctx.fillRect(gx, gy, cell, cell);
          }
        }
      }

      const raw = getEnergy(barCount);
      const smoothed = smoothedEnergyRef.current;
      for (let i = 0; i < barCount; i++) {
        const target = raw[i];
        const diff = target - smoothed[i];
        smoothed[i] += diff * (diff > 0 ? attack : release);
      }

      const barStrokeWidth = Math.max(1, Math.floor(1.5 * dpr));
      const minLen = barMinLen;
      const maxLen = barMaxLen;

      for (let i = 0; i < barCount; i++) {
        const u = (i + 0.5) / barCount;
        const x = u * w;
        const yc = centerline(x);
        const { nx, ny } = normal(x);
        let e = smoothed[i];
        const jitter = hash(i, Math.floor(t * 6), seed);
        e = Math.max(0, Math.min(1, e + (jitter - 0.5) * 0.15));
        const eased = easeOutQuad(e);
        let len = minLen + (maxLen - minLen) * eased;
        const quant = 4;
        len = Math.floor(len / quant) * quant;
        len *= 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(x * 0.01 + seed));
        const barOpacity = 0.25 + 0.4 * eased;
        ctx.fillStyle = `rgba(255,255,255,${barOpacity * opacity})`;
        const ex = x + nx * len;
        const ey = yc + ny * len;
        ctx.beginPath();
        const perpX = -ny * barStrokeWidth * 0.5;
        const perpY = nx * barStrokeWidth * 0.5;
        ctx.moveTo(x + perpX, yc + perpY);
        ctx.lineTo(x - perpX, yc - perpY);
        ctx.lineTo(ex - perpX, ey - perpY);
        ctx.lineTo(ex + perpX, ey + perpY);
        ctx.closePath();
        ctx.fill();
      }
    },
    [
      size,
      frozen,
      effectiveSpeed,
      density,
      ribbonThickness,
      noiseAmount,
      barCount,
      barMinLen,
      barMaxLen,
      attack,
      release,
      opacity,
      seed,
      getEnergy,
    ]
  );

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useRaf(draw, !!size && visible);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      setContainerRef(node);
    },
    [setContainerRef]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#050505", zIndex: 0 }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block", pointerEvents: "none" }}
        aria-hidden
      />
    </div>
  );
}

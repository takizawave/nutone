/**
 * DAW-style hero background: grid (CSS) + vertical level meters (canvas, throttled).
 * Light: 30fps, fewer meters, no per-frame allocations.
 */
import { useRef, useEffect, useCallback, useState } from "react";
import { useRaf } from "../../hooks/useRaf";
import { useResizeObserver } from "../../hooks/useResizeObserver";

export interface DAWStyleBackgroundProps {
  meterCount?: number;
  gridLineInterval?: number;
  opacity?: number;
  reducedMotion?: boolean;
}

const METER_ATTACK = 0.35;
const METER_RELEASE = 0.07;
const FPS_THROTTLE = 2; // draw every N frames (~30fps when N=2)

export function DAWStyleBackground({
  meterCount = 20,
  gridLineInterval = 56,
  opacity = 0.5,
  reducedMotion = false,
}: DAWStyleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [setContainerRef, size] = useResizeObserver<HTMLDivElement>();
  const smoothedRef = useRef<Float32Array>(new Float32Array(meterCount));
  const tRef = useRef(0);
  const frameRef = useRef(0);

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const draw = useCallback(
    (elapsed: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !size) return;

      if (!reducedMotion) tRef.current = elapsed * 0.001;
      const t = tRef.current;

      // Throttle: draw every N frames
      frameRef.current += 1;
      if (frameRef.current % FPS_THROTTLE !== 0) return;

      const dpr = Math.min(2, window.devicePixelRatio);
      const w = size.width * dpr;
      const h = size.height * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);

      // Lightweight energy: single sin per meter, reuse smoothed array (no allocation)
      const smoothed = smoothedRef.current;
      for (let i = 0; i < meterCount; i++) {
        const target = reducedMotion
          ? 0.3
          : Math.max(0, Math.min(1, 0.5 + 0.45 * Math.sin(t * 1.1 + i * 0.2)));
        const d = target - smoothed[i];
        smoothed[i] += d * (d > 0 ? METER_ATTACK : METER_RELEASE);
      }

      const totalSlot = w / meterCount;
      const meterW = Math.max(2, Math.floor(totalSlot * 0.45));
      const meterMaxH = h * 0.32;
      const fillStyleBase = 0.2 * opacity;

      for (let i = 0; i < meterCount; i++) {
        const x = (i + 0.5) * totalSlot - meterW / 2;
        const level = Math.max(0, Math.min(1, smoothed[i]));
        const barH = level * meterMaxH;
        const y = h - barH;

        ctx.fillStyle = `rgba(255,255,255,${0.1 * opacity})`;
        ctx.fillRect(x, h - 1, meterW, 1);
        ctx.fillStyle = `rgba(255,255,255,${fillStyleBase + level * 0.28})`;
        ctx.fillRect(x, y, meterW, barH);
      }
    },
    [size, meterCount, opacity, reducedMotion]
  );

  useRaf(draw, !!size && visible);

  const gridOpacity = 0.06 * opacity;
  const gridStyle = {
    background: `repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent ${gridLineInterval - 1}px,
      rgba(255,255,255,${gridOpacity}) ${gridLineInterval - 1}px,
      rgba(255,255,255,${gridOpacity}) ${gridLineInterval}px
    )`,
  };

  return (
    <div
      ref={setContainerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: "#050505", zIndex: 0, ...gridStyle }}
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

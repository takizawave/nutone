/**
 * Shared visual primitives — minimal, scientific, monochrome.
 * Texture, reveal animation, and waveform/music accents.
 */
import { motion } from "motion/react";

/* ── Waveform divider — subtle sine wave line (music nuance) ── */
export function WaveformDivider({
  className = "",
  height = 24,
  opacity = 0.5,
}: {
  className?: string;
  height?: number;
  opacity?: number;
}) {
  const w = 1200;
  const h = height;
  const path = Array.from({ length: Math.ceil(w / 4) + 1 }, (_, i) => {
    const x = (i / (w / 4)) * w;
    const y = h / 2 + (h / 2 - 2) * Math.sin((x / w) * Math.PI * 4);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  return (
    <svg
      className={`w-full overflow-visible ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      style={{ height: 4, opacity }}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke="var(--line-soft)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ── Section top wave (replaces or sits above 1px border) ── */
export function SectionWaveTop({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute left-0 right-0 top-0 overflow-hidden pointer-events-none ${className}`}
      style={{ height: 6, zIndex: 1 }}
    >
      <WaveformDivider height={12} opacity={0.6} />
    </div>
  );
}

/* ── Very subtle waveform background (music nuance, section bg) ── */
export function WaveformBg({ className = "" }: { className?: string }) {
  const w = 800;
  const lines = 5;
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <svg className="w-full h-full" viewBox={`0 0 ${w} 400`} preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: lines }, (_, i) => {
          const amp = 8 + i * 4;
          const freq = 0.008 + i * 0.002;
          const offset = 60 + i * 70;
          const d = Array.from({ length: 100 }, (__, j) => {
            const x = (j / 99) * w;
            const y = offset + amp * Math.sin(x * freq);
            return `${j === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" ");
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="var(--line-soft)"
              strokeWidth="0.5"
              opacity={0.15 - i * 0.02}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ── Noise Texture — analog grain, barely perceptible ── */
export function NoiseOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ── TV static / no-signal grain (昔のテレビの繋がらない時) — coarser, visible ── */
export function TVStaticOverlay({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='tv'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch' result='n'/%3E%3CfeColorMatrix type='saturate' values='0' in='n'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23tv)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        mixBlendMode: "overlay",
      }}
      aria-hidden
    />
  );
}

/* ── Company-style: intertwined wave fan (sound/oscilloscope feel) ── */
export function SoundWaveFanBg({ className = "" }: { className?: string }) {
  const w = 1200;
  const h = 400;
  const lines = 12;
  const paths = Array.from({ length: lines }, (_, i) => {
    const step = 80;
    const points = Array.from({ length: 120 }, (__, j) => {
      const t = j / 119;
      const x = t * w;
      const centerNorm = Math.sin(t * Math.PI);
      const amp = 35 * centerNorm + 4;
      const freq = 0.018 + (i / lines) * 0.012;
      const phase = (i / lines) * Math.PI * 2;
      const y = h / 2 + amp * Math.sin(x * freq + phase);
      return `${j === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    return points;
  });
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <svg className="w-full h-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--line-soft)"
            strokeWidth="0.6"
            opacity={0.08 + (i % 3) * 0.03}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Company-style: dashed curve + vertical dashes (subtle geometric) ── */
export function DashedCurveBg({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <path
          d="M 0 8 Q 25 30 50 50 T 100 92"
          fill="none"
          stroke="var(--line-soft)"
          strokeWidth="0.4"
          strokeDasharray="2 1.5"
          opacity={0.2}
        />
        {[18, 42, 68].map((x) => (
          <line
            key={x}
            x1={x}
            y1={5}
            x2={x}
            y2={20}
            stroke="var(--line-soft)"
            strokeWidth="0.35"
            strokeDasharray="1 1"
            opacity={0.15}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Horizontal reveal line ── */
export function RevealLine({
  delay = 0.1,
  maxWidth = 40,
  className = "",
}: {
  delay?: number;
  maxWidth?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`h-px bg-[var(--line-soft)] origin-left ${className}`}
      style={{ maxWidth }}
    />
  );
}

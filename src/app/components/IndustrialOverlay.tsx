/**
 * Shared visual primitives — minimal, scientific, monochrome.
 * Only two components: texture + reveal animation.
 * Everything else is content.
 */
import { motion } from "motion/react";

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

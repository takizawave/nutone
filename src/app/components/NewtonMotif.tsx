import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/* Seeded RNG for deterministic per-mount values (mulberry32) */
function createSeededRandom(seed: number) {
  let s = seed | 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t >>> 0) / 4294967296) as number;
  };
}

function randomBetween(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

export interface NewtonMotifProps {
  /** SVG component to render (e.g. apple motif) */
  Motif: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Seed for deterministic random values (default: 0) */
  seed?: number;
  /** Inline position (absolute). Default: top/left 0 */
  style?: React.CSSProperties;
  /** When true, sway amplitude is increased by ~20% (e.g. from Hero hover) */
  heroHovered?: boolean;
  /** Optional class for the wrapper */
  className?: string;
}

export function NewtonMotif({
  Motif,
  seed = 0,
  style = {},
  heroHovered = false,
  className = "",
}: NewtonMotifProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const randRef = useRef(createSeededRandom(seed));
  const idleRef = useRef<{ rotationTween: gsap.core.Tween; swayAmplitude: number; swayDuration: number } | null>(null);
  const dropTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const rand = randRef.current;

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      if (prefersReducedMotion) {
        gsap.set(wrapper, { opacity: 0 });
        gsap.to(wrapper, { opacity: 1, duration: 0.6, ease: "power2.out" });
        return;
      }

      const swayAmplitude = 4 + rand() * 3;
      const swayDuration = 2.5 + rand() * 1.5;
      const yBobAmount = 2 + rand() * 4;
      const yBobDuration = 3 + rand() * 2;
      const scaleMax = 1.02;
      const scaleDuration = 4 + rand() * 2;
      const driftX = 3 + rand() * 6;
      const driftDuration = 5 + rand() * 3;

      const mult = heroHovered ? 1.2 : 1;
      const currentSway = swayAmplitude * mult;

      gsap.set(wrapper, { rotation: -currentSway });
      const rotationTween = gsap.to(wrapper, {
        rotation: currentSway,
        duration: swayDuration / 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      idleRef.current = { rotationTween, swayAmplitude, swayDuration };

      gsap.to(wrapper, {
        y: yBobAmount,
        duration: yBobDuration / 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(wrapper, {
        scale: scaleMax,
        duration: scaleDuration / 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const driftVal = driftX * (rand() > 0.5 ? 1 : -1);
      gsap.to(wrapper, {
        x: driftVal,
        duration: driftDuration / 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      return () => {
        idleRef.current?.rotationTween.kill();
        idleRef.current = null;
        if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
      };
    },
    { scope: wrapperRef, dependencies: [seed, prefersReducedMotion] }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion || !idleRef.current) return;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const { rotationTween, swayAmplitude, swayDuration } = idleRef.current;
      const mult = heroHovered ? 1.2 : 1;
      const currentSway = swayAmplitude * mult;
      rotationTween.kill();
      gsap.to(wrapper, { rotation: currentSway, duration: 0.3, ease: "power2.out" });
      const tween = gsap.to(wrapper, {
        rotation: -currentSway,
        duration: swayDuration / 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      idleRef.current = { ...idleRef.current, rotationTween: tween };
    },
    { scope: wrapperRef, dependencies: [heroHovered] }
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const runDrop = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const startY = (gsap.getProperty(wrapper, "y") as number) || 0;
      const dropPx = randomBetween(rand, 24, 64);
      const tl = gsap.timeline({
        onComplete: () => {
          dropTimeoutRef.current = setTimeout(
            runDrop,
            randomBetween(rand, 6, 12) * 1000
          );
        },
      });
      tl.to(wrapper, {
        y: startY + dropPx,
        duration: 0.35,
        ease: "power2.in",
        overwrite: "auto",
      }).to(wrapper, {
        y: startY,
        duration: 0.7,
        ease: "bounce.out",
        overwrite: "auto",
      });
    };

    dropTimeoutRef.current = setTimeout(runDrop, randomBetween(rand, 6, 12) * 1000);
    return () => {
      if (dropTimeoutRef.current) clearTimeout(dropTimeoutRef.current);
    };
  }, [prefersReducedMotion, rand]);

  return (
    <div
      ref={wrapperRef}
      className={`newton-motif ${className}`.trim()}
      style={{
        position: "absolute",
        pointerEvents: "none",
        willChange: "transform",
        transformOrigin: "50% 0",
        ...style,
      }}
      aria-hidden
    >
      <Motif />
    </div>
  );
}

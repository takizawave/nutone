import { useState, useRef } from "react";
import { NewtonMotif } from "./NewtonMotif";
import { AppleMotif } from "./AppleMotif";
import "./newton-motif.css";

/**
 * Example Hero that decorates with multiple Newton-style apple motifs.
 * Hovering the hero container increases sway amplitude by ~20%.
 */
export function Hero() {
  const [heroHovered, setHeroHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-[var(--void)] overflow-hidden"
      onMouseEnter={() => setHeroHovered(true)}
      onMouseLeave={() => setHeroHovered(false)}
    >
      {/* Main hero content (placeholder) */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-white">Hero</h1>
      </div>

      {/* Decorative motifs: absolute, pointer-events none */}
      <NewtonMotif
        Motif={AppleMotif}
        seed={1}
        heroHovered={heroHovered}
        style={{ top: "12%", left: "8%", width: 80, height: 96, color: "rgba(255,255,255,0.4)" }}
        className="opacity-60"
      />
      <NewtonMotif
        Motif={AppleMotif}
        seed={2}
        heroHovered={heroHovered}
        style={{ top: "60%", right: "12%", left: "auto", width: 120, height: 144, color: "rgba(255,255,255,0.25)" }}
        className="opacity-50"
      />
      <NewtonMotif
        Motif={AppleMotif}
        seed={3}
        heroHovered={heroHovered}
        style={{ bottom: "20%", left: "15%", top: "auto", width: 64, height: 77, color: "rgba(255,255,255,0.3)" }}
        className="opacity-40"
      />
    </section>
  );
}

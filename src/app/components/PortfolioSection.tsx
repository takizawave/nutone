import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NoiseOverlay, RevealLine, SectionWaveTop, WaveformBg } from "./IndustrialOverlay";
import { NutoneLogoBackground } from "./NutoneLogoBackground";
import { PortfolioGrid } from "./PortfolioGrid";
import { portfolioItems } from "../data/portfolio";

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const items = portfolioItems;

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;
      const label = scope.querySelector(".works-label");
      const title = scope.querySelector(".works-title");
      const grid = scope.querySelector(".works-grid");
      const note = scope.querySelector(".works-note");
      if (label) gsap.from(label, { y: 8, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (title) gsap.from(title, { y: 20, opacity: 0, duration: 0.7, delay: 0.08, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (grid) gsap.from(grid, { y: 24, opacity: 0, duration: 0.7, delay: 0.12, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (note) gsap.from(note, { opacity: 0, duration: 0.7, delay: 0.15, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
    },
    { scope: sectionRef }
  );

  return (
    <section id="works" ref={sectionRef} className="bg-[var(--panel)] relative overflow-hidden py-16 md:py-[7.5rem]" style={{ borderTop: "var(--section-divider)" }}>
      <NutoneLogoBackground />
      <SectionWaveTop />
      <WaveformBg />
      <NoiseOverlay />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
        <p
          className="works-label text-[var(--text-secondary)]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--section-label-size)",
            letterSpacing: "var(--section-label-spacing)",
            textTransform: "uppercase",
          }}
        >
          Works —
        </p>

        <RevealLine className="mt-4 mb-4" />

        <h2
          className="works-title text-[var(--text-strong)] mb-16"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.6,
            letterSpacing: "var(--headline-spacing)",
          }}
        >
          制作実績
        </h2>

        <div className="works-grid">
          <PortfolioGrid items={items} />
        </div>

        <p
          className="works-note text-[var(--text-secondary)] mt-8 text-center"
          style={{ fontSize: "0.8125rem", letterSpacing: "0.04em", fontWeight: 300 }}
        >
          掲載できない制作実績が多数ありますので、直接お問い合わせいただけますと幸いです。
        </p>
      </div>
    </section>
  );
}

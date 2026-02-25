import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { NoiseOverlay, RevealLine, SectionWaveTop, WaveformBg } from "./IndustrialOverlay";
import { PortfolioGrid } from "./PortfolioGrid";
import { portfolioItems } from "../data/portfolio";

const PREVIEW_COUNT = 3;

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewItems = portfolioItems.slice(0, PREVIEW_COUNT);

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;
      const label = scope.querySelector(".works-label");
      const title = scope.querySelector(".works-title");
      const grid = scope.querySelector(".works-grid");
      const cta = scope.querySelector(".works-cta");
      const note = scope.querySelector(".works-note");
      if (label) gsap.from(label, { y: 8, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (title) gsap.from(title, { y: 20, opacity: 0, duration: 0.7, delay: 0.08, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (grid) gsap.from(grid, { y: 24, opacity: 0, duration: 0.7, delay: 0.12, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (cta) gsap.from(cta, { y: 12, opacity: 0, duration: 0.7, delay: 0.15, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (note) gsap.from(note, { opacity: 0, duration: 0.7, delay: 0.2, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
    },
    { scope: sectionRef }
  );

  return (
    <section id="works" ref={sectionRef} className="bg-[var(--panel)] relative overflow-hidden" style={{ padding: "120px 0", borderTop: "var(--section-divider)" }}>
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
          <PortfolioGrid items={previewItems} />
        </div>

        <div className="works-cta mt-16 flex justify-center">
          <Link
            to="/works"
            className="nutone-pill group inline-flex items-center gap-2 rounded-full border border-[var(--ghost-border)] bg-transparent px-5 py-2.5 text-[0.75rem] uppercase tracking-wider text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--ghost-border-hover)] hover:bg-[var(--hover-bg)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            View All Works
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
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

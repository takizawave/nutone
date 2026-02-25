import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { AppleMotif } from "./AppleMotif";
import { NoiseOverlay, RevealLine, SectionWaveTop, TVStaticOverlay, WaveformBg } from "./IndustrialOverlay";
import { NewtonMotif } from "./NewtonMotif";
import { NutoneLogoBackground } from "./NutoneLogoBackground";
import { ThinLargeLogoBackground } from "./ThinLargeLogoBackground";

export function PromiseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;
      const label = scope.querySelector(".promise-label");
      const title = scope.querySelector(".promise-title");
      const body = scope.querySelector(".promise-body");
      const cta = scope.querySelector(".promise-cta");
      if (label) gsap.from(label, { y: 8, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (title) gsap.from(title, { y: 20, opacity: 0, duration: 0.7, delay: 0.08, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (body) gsap.from(body, { y: 20, opacity: 0, duration: 0.7, delay: 0.12, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (cta) gsap.from(cta, { opacity: 0, duration: 0.7, delay: 0.2, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[var(--surface)] relative overflow-hidden py-12 sm:py-16 md:py-[7.5rem] overflow-x-hidden">
      {/* Hero / Promise boundary: diagonal strip overlapping upward */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: 0,
          height: "clamp(4rem, 12vw, 7rem)",
          background: "var(--surface)",
          clipPath: "polygon(0 100%, 0 15%, 100% 0, 100% 100%)",
          zIndex: 1,
        }}
        aria-hidden
      />
      {/* Diagonal edge line (along the cut) */}
      <svg
        className="absolute left-0 right-0 w-full pointer-events-none"
        style={{ top: 0, height: "clamp(4rem, 12vw, 7rem)", zIndex: 2 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <line x1="0" y1="15" x2="100" y2="0" stroke="var(--line-highlight)" strokeWidth="0.4" strokeOpacity="0.8" />
      </svg>
      <NutoneLogoBackground />
      <ThinLargeLogoBackground />
      <SectionWaveTop />
      <WaveformBg />
      <NoiseOverlay />
      <TVStaticOverlay opacity={0.06} />

      {/* Newton apple: 吊られて揺れて → たまに落ちてバウンド */}
      <NewtonMotif
        Motif={AppleMotif}
        seed={10}
        style={{
          top: "10%",
          right: "5%",
          width: 28,
          height: 34,
          color: "rgba(255,255,255,0.1)",
          zIndex: 4,
        }}
      />

      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-12 relative" style={{ zIndex: 5 }}>
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
          <p
            className="promise-label text-[var(--text-secondary)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--section-label-size)",
              letterSpacing: "var(--section-label-spacing)",
              textTransform: "uppercase",
            }}
          >
            Promise —
          </p>

          <RevealLine className="mt-4 mb-4" />

          <h2
            className="promise-title text-[var(--text-strong)] italic sm:whitespace-nowrap"
            style={{
              fontFamily: "var(--font-display-italic)",
              fontSize: "clamp(1.5rem, 5.5vw, 3.5rem)",
              fontWeight: 600,
              lineHeight: 1.4,
              letterSpacing: "0.02em",
              fontStyle: "italic",
            }}
          >
            爆発を、 スタンダードへ。
          </h2>

          <p
            className="promise-body text-[var(--text-primary)] italic"
            style={{
              fontFamily: "var(--font-display-italic)",
              fontSize: "clamp(0.9375rem, 1.4vw, 1.25rem)",
              lineHeight: 2,
              letterSpacing: "0.04em",
              fontWeight: 400,
              fontStyle: "italic",
            }}
          >
            突き刺さる、剥き出しのエネルギーを。慣習や技法に安住せず、常に「表現の原液」を追い求める。それが私たちのスタイルです。自社アーティストの活動から企業のサウンドデザインまで、私たちが提供するのは「整った音」ではなく「心を動かす熱狂」です。表現が持つ真の力を解放し、新しい時代の基準を共に創り上げます。
          </p>

          <div className="promise-cta">
            <Link
              to="/philosophy"
              className="nutone-pill group inline-flex items-center gap-2 rounded-full border border-[var(--ghost-border)] bg-transparent px-5 py-2.5 text-[0.75rem] uppercase tracking-wider text-[var(--text-primary)] transition-all duration-300 hover:border-[var(--ghost-border-hover)] hover:bg-[var(--hover-bg)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Philosophy
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

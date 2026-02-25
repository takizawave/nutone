import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { NoiseOverlay, RevealLine } from "./IndustrialOverlay";

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
    <section ref={sectionRef} className="bg-[var(--surface)] relative overflow-hidden" style={{ padding: "120px 0" }}>
      <NoiseOverlay />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          <div className="md:w-5/12">
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
              className="promise-title text-[var(--text-strong)]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: "var(--headline-spacing)",
              }}
            >
              爆発を、
              <br />
              スタンダードへ。
            </h2>
          </div>

          <div className="md:w-7/12 flex flex-col justify-end gap-8">
            <p
              className="promise-body text-[var(--text-primary)]"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 2.2,
                letterSpacing: "0.04em",
                fontWeight: 300,
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
      </div>
    </section>
  );
}

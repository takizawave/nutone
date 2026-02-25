import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NoiseOverlay, RevealLine } from "./IndustrialOverlay";

const features = [
  {
    number: "01",
    title: "豊富な制作実績",
    titleEn: "Track Record",
    description:
      "長年にわたる経験と専門知識を活かし、高品質なクリエイティブを提供いたします。細部に至るまで丁寧に取り組み、最高水準の制作を目指します。",
  },
  {
    number: "02",
    title: "独自のチーム体制",
    titleEn: "Team Building",
    description:
      "私たちのチームはカメラマンからミュージシャンまで多種多様です。お客様に合わせて最適なチーム体制を作ります。また、部分発注等も可能です。",
  },
  {
    number: "03",
    title: "理想を最速で形に",
    titleEn: "Speed & Quality",
    description:
      "お客様一人ひとりのニーズに応じたスピード感で制作を進めます。どんなご希望にも柔軟に対応可能です。",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;
      const label = scope.querySelector(".feature-label");
      const title = scope.querySelector(".feature-title");
      const cards = scope.querySelectorAll(".feature-card");
      if (label) gsap.from(label, { y: 8, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (title) gsap.from(title, { y: 20, opacity: 0, duration: 0.7, delay: 0.08, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      gsap.from(cards, { y: 24, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-[var(--surface)] relative overflow-hidden" style={{ padding: "120px 0", borderTop: "var(--section-divider)" }}>
      <NoiseOverlay />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
        <p
          className="feature-label text-[var(--text-secondary)]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--section-label-size)",
            letterSpacing: "var(--section-label-spacing)",
            textTransform: "uppercase",
          }}
        >
          Strength —
        </p>

        <RevealLine className="mt-4 mb-4" />

        <h2
          className="feature-title text-[var(--text-strong)] mb-16"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.6,
            letterSpacing: "var(--headline-spacing)",
          }}
        >
          nutoneの特徴
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {features.map((feature) => (
            <div key={feature.number} className="feature-card">
              <p
                className="text-[var(--text-secondary)]"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                {feature.number}
              </p>

              <p
                className="text-[var(--text-secondary)] mt-6"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                }}
              >
                {feature.titleEn}
              </p>

              <RevealLine delay={0.2} maxWidth={28} className="mt-4 mb-4" />

              <h3
                className="text-[var(--text-strong)] mb-5"
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                {feature.title}
              </h3>

              <p
                className="text-[var(--text-primary)]"
                style={{
                  fontSize: "0.875rem",
                  lineHeight: 2.2,
                  letterSpacing: "0.04em",
                  fontWeight: 300,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { AppleMotif } from "./AppleMotif";
import { NoiseOverlay, RevealLine, SectionWaveTop, TVStaticOverlay, WaveformBg } from "./IndustrialOverlay";
import { NewtonMotif } from "./NewtonMotif";
import { NutoneLogoBackground } from "./NutoneLogoBackground";
import { ThinLargeLogoBackground } from "./ThinLargeLogoBackground";

const services = [
  {
    number: "01",
    titleEn: "Sound Production",
    titleJa: "音楽制作・サウンドデザイン事業",
    subheading: "記憶に刻まれる音づくり",
    description:
      "過去のデータの再生産や、無難な「商品としての音」に留まらない、唯一無二のサウンドを設計します。",
  },
  {
    number: "02",
    titleEn: "Artist & IP Development",
    titleJa: "レーベル・IP事業",
    subheading: "「どこかで聞いた音」を超えて、まだ見ぬ文化を切り拓く",
    description:
      "自社IP（アーティスト・プロジェクト）を通じて、純粋な創造性が正当な経済価値を生む「新しい文化の基準」を確立します。",
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;
      const label = scope.querySelector(".service-label");
      const title = scope.querySelector(".service-title");
      const items = scope.querySelectorAll(".service-item");
      if (label) gsap.from(label, { y: 8, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      if (title) gsap.from(title, { y: 20, opacity: 0, duration: 0.7, delay: 0.08, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
      gsap.from(items, { y: 24, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: scope, start: "top 85%", once: true } });
    },
    { scope: sectionRef }
  );

  return (
    <section id="service" ref={sectionRef} className="bg-[var(--panel)] relative overflow-hidden py-16 md:py-[7.5rem]" style={{ borderTop: "var(--section-divider)" }}>
      <NutoneLogoBackground />
      <ThinLargeLogoBackground />
      <SectionWaveTop />
      <WaveformBg />
      <NoiseOverlay />
      <TVStaticOverlay opacity={0.06} />

      {/* Newton apple: 吊られて揺れて → たまに落ちてバウンド */}
      <NewtonMotif
        Motif={AppleMotif}
        seed={20}
        style={{
          bottom: "14%",
          left: "5%",
          width: 44,
          height: 53,
          color: "rgba(255,255,255,0.07)",
          zIndex: 4,
        }}
      />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
        <p
          className="service-label text-[var(--text-secondary)]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--section-label-size)",
            letterSpacing: "var(--section-label-spacing)",
            textTransform: "uppercase",
          }}
        >
          Service —
        </p>

        <RevealLine className="mt-4 mb-4" />

        <h2
          className="service-title text-[var(--text-strong)] mb-16"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.6,
            letterSpacing: "var(--headline-spacing)",
          }}
        >
          事業内容
        </h2>

        <div>
          {services.map((service) => (
            <div
              key={service.number}
              className="service-item group border-t border-[var(--line-soft)]"
              style={{ padding: "48px 0" }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
                <div className="md:w-5/12 flex items-start gap-6">
                  <span
                    className="text-[var(--text-secondary)] shrink-0 mt-0.5"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                    }}
                  >
                    {service.number}
                  </span>
                  <div>
                    <h3
                      className="text-[var(--text-strong)] group-hover:text-[var(--text-primary)] transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      {service.titleEn}
                    </h3>
                    <p className="text-[var(--text-secondary)] mt-2" style={{ fontSize: "0.8125rem", letterSpacing: "0.06em" }}>
                      {service.titleJa}
                    </p>
                    {service.subheading && (
                      <p className="text-[var(--text-primary)] mt-3" style={{ fontSize: "0.875rem", letterSpacing: "0.04em", fontWeight: 500 }}>
                        {service.subheading}
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:w-7/12 flex items-start gap-6">
                  <p
                    className="text-[var(--text-primary)] flex-1"
                    style={{
                      fontSize: "0.9375rem",
                      lineHeight: 2.2,
                      letterSpacing: "0.04em",
                      fontWeight: 300,
                    }}
                  >
                    {service.description}
                  </p>
                  <ArrowRight
                    size={16}
                    className="text-[var(--line-soft)] group-hover:text-[var(--stroke)] group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1 hidden md:block"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-[var(--line-soft)]" />
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { NoiseOverlay, RevealLine } from "./IndustrialOverlay";

const services = [
  {
    number: "01",
    titleEn: "Music Production",
    titleJa: "楽曲制作",
    description:
      "年間100曲以上の楽曲を納品。300人以上のアーティストと協業しており、どんなジャンルでも対応いたします。メジャー楽曲から上場企業の広告ソングまで幅広く制作実績がございます。",
    meta: "48 kHz  ·  24 bit  ·  Stereo",
  },
  {
    number: "02",
    titleEn: "Video Production",
    titleJa: "映像制作",
    description:
      "企画にこだわり抜いた妥協０のクリエイティブを提供します。撮影から編集まで一気通貫で行います。実写からアニメーション、CGなど幅広く制作実績がございます。",
    meta: "3840 × 2160  ·  29.97 fps  ·  HDR",
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
    <section id="service" ref={sectionRef} className="bg-[var(--panel)] relative overflow-hidden" style={{ padding: "120px 0", borderTop: "var(--section-divider)" }}>
      <NoiseOverlay />

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
                    <p
                      className="text-[var(--text-secondary)] mt-3 hidden md:block"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.4375rem",
                        letterSpacing: "0.08em",
                        fontWeight: 300,
                      }}
                    >
                      {service.meta}
                    </p>
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

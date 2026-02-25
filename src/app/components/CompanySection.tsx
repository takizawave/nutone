import { motion } from "motion/react";
import { NoiseOverlay, RevealLine } from "./IndustrialOverlay";

const companyInfo = [
  { label: "会社名", value: "nutone株式会社" },
  { label: "代表取締役", value: "濱田真秀" },
  { label: "設立", value: "2019年6月" },
  { label: "本店住所", value: "東京都板橋区常盤台２丁目７番１０号 パロ常盤台２０１号" },
  { label: "事業内容", value: "音楽/映像制作" },
  { label: "法人番号", value: "3010401146124" },
];

export function CompanySection() {
  return (
    <section id="company" className="bg-[var(--surface)] relative overflow-hidden" style={{ padding: "120px 0", borderTop: "var(--section-divider)" }}>
      <NoiseOverlay />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          {/* Left */}
          <div className="md:w-5/12">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-[var(--text-secondary)]"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--section-label-size)",
                letterSpacing: "var(--section-label-spacing)",
                textTransform: "uppercase",
              }}
            >
              Company —
            </motion.p>

            <RevealLine className="mt-4 mb-4" />

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[var(--text-strong)]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
                fontWeight: 700,
                lineHeight: 1.6,
                letterSpacing: "var(--headline-spacing)",
              }}
            >
              会社概要
            </motion.h2>
          </div>

          {/* Right */}
          <div className="md:w-7/12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {companyInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`flex items-baseline py-5 ${
                    index < companyInfo.length - 1 ? "border-b border-[var(--line-soft)]" : ""
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.16 + index * 0.04 }}
                >
                  <span
                    className="text-[var(--text-secondary)] w-28 md:w-36 shrink-0"
                    style={{ fontSize: "0.8125rem", letterSpacing: "0.06em", fontWeight: 400 }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[var(--text-primary)]"
                    style={{ fontSize: "0.9375rem", letterSpacing: "0.04em", fontWeight: 400 }}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
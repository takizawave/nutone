import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { NoiseOverlay, RevealLine, SectionWaveTop, WaveformBg } from "./IndustrialOverlay";

export function ContactSection() {
  return (
    <section id="contact" className="bg-[var(--surface)] relative overflow-hidden" style={{ padding: "120px 0", borderTop: "var(--section-divider)" }}>
      <SectionWaveTop />
      <WaveformBg />
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
              Contact —
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
              お問い合わせ
            </motion.h2>
          </div>

          {/* Right */}
          <div className="md:w-7/12 flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-[var(--text-primary)] mb-12"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 2.2,
                letterSpacing: "0.04em",
                fontWeight: 300,
              }}
            >
              お問い合わせやご依頼は、お気軽に以下のフォームからご連絡ください。一週間以内に返信いたします。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href="#contact"
                className="nutone-pill group inline-flex items-center gap-2 rounded-full border border-[var(--ghost-border-hover)] bg-[var(--text-strong)] px-6 py-3 text-[0.8125rem] uppercase tracking-wider text-[var(--primary-foreground)] transition-all duration-300 hover:bg-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                お問い合わせはこちら
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
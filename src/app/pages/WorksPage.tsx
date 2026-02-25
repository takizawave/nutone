import { useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PortfolioGrid } from "../components/PortfolioGrid";
import { NoiseOverlay, RevealLine } from "../components/IndustrialOverlay";
import { portfolioItems } from "../data/portfolio";

export function WorksPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--void)]">
      <Header />

      <section className="bg-[var(--panel)] relative overflow-hidden" style={{ paddingTop: 144, paddingBottom: 120 }}>
        <NoiseOverlay />

        <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-strong)]/50 transition-colors duration-300"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
              }}
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[var(--text-secondary)]"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ( Works )
          </motion.p>

          <RevealLine className="mt-4 mb-4" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-[var(--text-strong)]"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: "0.02em",
            }}
          >
            制作実績
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[var(--text-strong)]/20 mt-2 mb-16"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
            }}
          >
            {portfolioItems.length} Projects
          </motion.p>

          <PortfolioGrid items={portfolioItems} />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[var(--text-strong)]/20 mt-16"
            style={{ fontSize: "0.8125rem", letterSpacing: "0.04em", fontWeight: 300 }}
          >
            掲載できない制作実績が多数ありますので、直接お問い合わせいただけますと幸いです。
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
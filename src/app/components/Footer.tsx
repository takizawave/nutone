import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
const logoText = "/fix_nutone_logo-03.png";
const logoType = "/nutone_logotype@2x.png";
import { RevealLine, SectionWaveTop } from "./IndustrialOverlay";
import { NutoneLogoBackground } from "./NutoneLogoBackground";

const LOGO_REPEAT = 12;

function LogoBandRow({ direction }: { direction: "right" | "left" }) {
  const logos = Array.from({ length: LOGO_REPEAT * 2 }, (_, i) => (
    <img
      key={i}
      src={logoType}
      alt=""
      draggable={false}
      className="shrink-0 select-none"
      style={{ height: 24, width: "auto", objectFit: "contain" }}
    />
  ));
  return (
    <div
      className="flex items-center gap-6 md:gap-12 py-2 md:py-3 w-max"
      style={{ animation: `footer-logo-band-${direction} 40s linear infinite` }}
    >
      {logos}
    </div>
  );
}

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const footerLinks = [
    { label: "Service", href: "#service", isPage: false },
    { label: "Works", href: "#works", isPage: false },
    { label: "Company", href: "#company", isPage: false },
    { label: "Philosophy", href: "/philosophy", isPage: true },
    { label: "Contact", href: "#contact", isPage: false },
  ];

  const handleNav = (href: string, isPage: boolean) => {
    if (isPage) {
      navigate(href);
      return;
    }
    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  return (
    <footer
      className="bg-[var(--void)] relative overflow-hidden"
      style={{ paddingTop: "clamp(48px, 12vw, 80px)", paddingBottom: "clamp(32px, 8vw, 48px)" }}
    >
      <NutoneLogoBackground />
      <SectionWaveTop />
      <div className="absolute top-0 left-0 right-0 h-px w-full" style={{ background: "var(--section-divider)" }} />

      {/* 2段ロゴ帯: 上段→右へ流れ / 下段→左へ流れ */}
      <div className="w-full overflow-hidden border-y border-[var(--line-soft)]" style={{ borderColor: "var(--line-soft)" }}>
        <div className="py-0">
          <LogoBandRow direction="right" />
          <LogoBandRow direction="left" />
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col gap-8 md:gap-10 mb-12 md:mb-16">
          <motion.img
            src={logoText}
            alt="nutone"
            draggable={false}
            className="max-h-[120px] md:max-h-[192px] w-auto"
            style={{ height: "clamp(80px, 25vw, 192px)", objectFit: "contain" }}
            whileInView={{ opacity: [0, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          <RevealLine maxWidth={40} />

          <nav className="flex items-center gap-4 sm:gap-8 flex-wrap">
            {footerLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleNav(link.href, link.isPage)}
                className="text-[var(--text-secondary)] transition-opacity duration-200 hover:opacity-70 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation py-2 -my-2 -mx-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.06em",
                }}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.04 }}
              >
                {link.label}
              </motion.button>
            ))}
          </nav>
        </div>

        <p
          className="text-[var(--text-secondary)]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            letterSpacing: "0.04em",
          }}
        >
          &copy; 2025 nutone Inc.
        </p>
      </div>
    </footer>
  );
}
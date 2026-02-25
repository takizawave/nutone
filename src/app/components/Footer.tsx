import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
const logoText = "/fix_nutone_logo-03.png";
import { RevealLine, SectionWaveTop } from "./IndustrialOverlay";
import { NutoneLogoBackground } from "./NutoneLogoBackground";

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
      style={{ padding: "80px 0 48px" }}
    >
      <NutoneLogoBackground />
      <SectionWaveTop />
      <div className="absolute top-0 left-0 right-0 h-px w-full" style={{ background: "var(--section-divider)" }} />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-10 mb-16">
          <motion.img
            src={logoText}
            alt="nutone"
            draggable={false}
            style={{ height: 192, width: "auto", objectFit: "contain" }}
            whileInView={{ opacity: [0, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          <RevealLine maxWidth={40} />

          <nav className="flex items-center gap-8 flex-wrap">
            {footerLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleNav(link.href, link.isPage)}
                className="text-[var(--text-secondary)] transition-opacity duration-200 hover:opacity-70 cursor-pointer"
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
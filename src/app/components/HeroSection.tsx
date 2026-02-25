import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, useScroll, useReducedMotion } from "motion/react";
import { ShaderLinesBackground } from "./ShaderLinesBackground";
import { NutoneLogoBackground } from "./NutoneLogoBackground";

const logoText = "/fix_nutone_logo-03.png";
const appleBg =
  "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=1200&q=80";

/* ─── GSAP Split text (chars for stagger) ─── */
function HeroSplitText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <span key={i} className="hero-headline-char inline-block">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/* ─── AnimatedCounter ─── */
function AnimatedCounter({
  target,
  suffix = "",
  delay = 0,
}: {
  target: number;
  suffix?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const inc = target / 50;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= target) {
        setCount(target);
        clearInterval(iv);
      } else setCount(Math.floor(cur));
    }, 33);
    return () => clearInterval(iv);
  }, [started, target]);

  return (
    <span style={{ opacity: started ? 1 : 0 }}>
      {count}
      {suffix}
    </span>
  );
}

const easeOut = "power2.out";

/* ═══════════════════════════════════════════════════════ */
/*                     HERO SECTION                       */
/* ═══════════════════════════════════════════════════════ */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useGSAP(
    () => {
      const scope = contentRef.current;
      if (!scope || !sectionRef.current) return;

      const eyebrow = scope.querySelector(".hero-eyebrow");
      const logo = scope.querySelector(".hero-logo");
      const separatorLine = scope.querySelector(".hero-separator-line");
      const line1Chars = scope.querySelectorAll(".hero-line1 .hero-headline-char");
      const line2Chars = scope.querySelectorAll(".hero-line2 .hero-headline-char");
      const subLine = scope.querySelector(".hero-sub-line");
      const subCopy = scope.querySelector(".hero-sub-copy");
      const bottomBar = scope.querySelector(".hero-bottom-bar");
      const stats = scope.querySelector(".hero-stats");
      const scrollBtn = scope.querySelector(".hero-scroll-btn");

      const tl = gsap.timeline({ defaults: { ease: easeOut } });

      tl.from(logo, { y: 12, opacity: 0, duration: 0.8 })
        .from(eyebrow, { y: 8, opacity: 0, duration: 0.5 }, 0.35)
        .from(separatorLine, { scaleX: 0, duration: 1.2, ease: "power2.inOut" }, 0.4)
        .from(line1Chars, { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.025 }, 0.6)
        .from(line2Chars, { yPercent: 110, opacity: 0, duration: 0.9 }, 0.9)
        .from(subLine, { width: 0, duration: 0.8 }, 1.8)
        .from(subCopy, { y: 10, opacity: 0, duration: 0.7 }, 2)
        .from(bottomBar, { opacity: 0 }, 2.4)
        .from(stats, { opacity: 0 }, 2.5)
        .from(scrollBtn, { opacity: 0 }, 2.6);

      const scrollIndicator = scope.querySelector(".hero-scroll-indicator");
      if (scrollIndicator) {
        gsap.to(scrollIndicator, {
          y: 14,
          repeat: -1,
          yoyo: true,
          duration: 1.2,
          ease: "power1.inOut",
        });
      }
    },
    { scope: contentRef, dependencies: [] }
  );


  const scrollDown = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ paddingTop: 72, background: "#020204" }}
    >
      <ShaderLinesBackground reducedMotion={reducedMotion} />
      {/* Readability overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 100% 50% at 45% 50%, rgba(2,2,4,0) 0%, rgba(2,2,4,0.5) 60%, rgba(2,2,4,0.9) 100%)",
            "linear-gradient(180deg, rgba(2,2,4,0.5) 0%, transparent 20%, transparent 80%, rgba(2,2,4,0.6) 100%)",
          ].join(", "),
          zIndex: 0,
        }}
        aria-hidden
      />
      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
          mixBlendMode: "overlay",
        }}
        aria-hidden
      />
      <NutoneLogoBackground />
      {/* 下あたりにメッチャでかいロゴ背景 x2 */}
      <div
        className="pointer-events-none absolute inset-0 flex items-end justify-between"
        style={{ zIndex: 1 }}
        aria-hidden
      >
        <img
          src={logoText}
          alt=""
          className="max-w-none select-none object-contain object-left-bottom"
          style={{
            width: "clamp(700px, 95vw, 1600px)",
            height: "auto",
            maxHeight: "85vh",
            opacity: 0.045,
            filter: "blur(48px)",
          }}
        />
        <img
          src={logoText}
          alt=""
          className="max-w-none select-none object-contain object-right-bottom"
          style={{
            width: "clamp(700px, 95vw, 1600px)",
            height: "auto",
            maxHeight: "85vh",
            opacity: 0.045,
            filter: "blur(48px)",
          }}
        />
      </div>
      {/* 薄くデカいリンゴを背景に */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-end"
        style={{ zIndex: 1 }}
        aria-hidden
      >
        <img
          src={appleBg}
          alt=""
          className="max-w-none select-none object-contain object-right"
          style={{
            width: "clamp(480px, 95vw, 1400px)",
            height: "clamp(480px, 95vh, 1000px)",
            opacity: 0.06,
            filter: "blur(40px)",
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="max-w-[1080px] mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center relative hero-content"
        style={{ zIndex: 10 }}
      >
        <div className="hero-logo mb-6">
          <img
            src={logoText}
            alt="nutone"
            draggable={false}
            style={{
              width: "clamp(120px, 20vw, 200px)",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        <p
          className="hero-eyebrow text-[var(--text-secondary)] mb-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Sound. Standard.
        </p>
        <div className="hero-separator mb-12">
          <div
            className="hero-separator-line h-px bg-[var(--line-soft)] origin-left"
            style={{ width: 40 }}
          />
        </div>

        <h1 className="text-[var(--text-strong)]">
          <span className="hero-line1 block" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            <HeroSplitText text="EXPLOSIONS," />
          </span>
          <span className="hero-line2 block mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", WebkitTextStroke: "1.5px var(--stroke)", WebkitTextFillColor: "transparent" }}>
            <HeroSplitText text="MADE STANDARD." />
          </span>
        </h1>

        <div className="mt-12 md:mt-16 max-w-lg">
          <div className="hero-sub-line h-px bg-[var(--line-soft)] mb-5" style={{ width: 24 }} />
          <p
            className="hero-sub-copy text-[var(--text-subtle)]"
            style={{ fontSize: "0.875rem", lineHeight: 2.2, letterSpacing: "0.04em", fontWeight: 300 }}
          >
            表現が本来持っている、世界を動かす力を信じて。
            <br className="hidden md:block" />
            私たちは、新時代のスタンダードを探求し続けます。
          </p>
        </div>
      </div>

      <div ref={bottomBarRef} className="hero-bottom-bar relative border-t border-[var(--line-soft)]" style={{ zIndex: 10 }}>
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="hero-stats flex items-center gap-8 md:gap-12">
            {[
              { target: 100, suffix: "+", label: "Songs / Year", d: 2.5 },
              { target: 300, suffix: "+", label: "Artists", d: 2.7 },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2">
                {i > 0 && <div className="w-px h-4 bg-[var(--line-soft)] mr-6 md:mr-10" />}
                <span
                  className="text-[var(--text-strong)]"
                  style={{ fontFamily: "var(--font-body)", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" }}
                >
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} delay={stat.d} />
                </span>
                <span
                  className="text-[var(--text-secondary)] ml-1"
                  style={{ fontFamily: "var(--font-body)", fontSize: "0.5625rem", letterSpacing: "0.06em", fontWeight: 400 }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollDown}
            className="hero-scroll-btn flex items-center gap-3 cursor-pointer group"
          >
            <span
              className="text-[var(--text-secondary)] group-hover:text-[var(--text-subtle)] transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              Scroll
            </span>
            <div className="relative w-4 h-7 overflow-hidden">
              <div className="hero-scroll-indicator absolute left-1/2 top-0 -translate-x-1/2">
                <div className="w-px h-4 bg-[var(--line-soft)] group-hover:bg-[var(--stroke)] transition-colors duration-300" />
                <svg width="5" height="4" viewBox="0 0 5 4" className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px">
                  <path d="M0.5 0.5L2.5 2.5L4.5 0.5" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-[var(--line-soft)] group-hover:text-[var(--stroke)] transition-colors duration-300" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

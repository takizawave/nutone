import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion, useReducedMotion } from "motion/react";
import { ShaderLinesBackground } from "./ShaderLinesBackground";
import { NutoneLogoBackground } from "./NutoneLogoBackground";

const logoText = "/fix_nutone_logo-03.png";

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

  useGSAP(
    () => {
      const scope = contentRef.current;
      if (!scope || !sectionRef.current) return;

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
      className="relative min-h-screen min-h-[100dvh] flex flex-col justify-between overflow-x-hidden overflow-y-hidden"
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "#000000",
      }}
    >
      <ShaderLinesBackground reducedMotion={reducedMotion} />
      {/* Very subtle overlay so shader stays visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)",
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
      {/* ニュートンのリンゴ: 落ちて弾む動き */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1 }}
        aria-hidden
      >
        <img
          src={logoText}
          alt=""
          className="max-w-none select-none object-contain absolute"
          style={{
            width: "clamp(280px, 45vw, 520px)",
            height: "auto",
            opacity: 0.08,
            filter: "blur(24px)",
            top: "18%",
            left: "58%",
            animation: reducedMotion ? "none" : "newton-apple-fall 8s ease-in-out infinite",
          }}
        />
        <img
          src={logoText}
          alt=""
          className="max-w-none select-none object-contain absolute"
          style={{
            width: "clamp(200px, 32vw, 380px)",
            height: "auto",
            opacity: 0.05,
            filter: "blur(20px)",
            top: "25%",
            right: "20%",
            animation: reducedMotion ? "none" : "newton-apple-fall 10s ease-in-out infinite",
            animationDelay: "-3.5s",
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="flex-1 flex flex-col w-full min-h-0 hero-content overflow-x-hidden"
        style={{ zIndex: 10 }}
      >
        {/* 共通ラッパー: 見出しとサブコピーの left を完全に一致させる */}
        <div className="flex-1 min-h-0 flex flex-col max-w-[1080px] mx-auto w-full px-4 sm:px-6 md:px-8">
          <div className="flex-1 min-h-0 relative flex flex-col justify-end">
            <div
              className="hero-logo absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 0 }}
              aria-hidden
            >
              <img
                src={logoText}
                alt=""
                draggable={false}
                className="max-w-none select-none"
                style={{
                  width: "clamp(280px, 65vw, 900px)",
                  height: "auto",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  opacity: 0.07,
                  filter: "blur(32px)",
                }}
              />
            </div>

            <motion.div
              className="relative left-0 right-0 pointer-events-none pb-2 sm:pb-8"
              style={{
                fontFamily: "'Inter Tight', 'Helvetica Now Display', 'Suisse Int\\'l', sans-serif",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                fontWeight: 700,
              }}
            >
              <div className="relative" style={{ minHeight: "clamp(5rem, 14vw, 9rem)" }}>
                {/* Layer C: ghost behind */}
              <h1
                className="hero-line1 hero-line2 absolute left-0 right-0 bottom-0 w-full origin-bottom-left"
                aria-hidden
                style={{
                  color: "rgba(255,255,255,0.03)",
                  filter: "blur(0.5px)",
                  transform: "translate(1px, 1px)",
                  zIndex: 0,
                }}
              >
                <span className="hero-line1 block" style={{ fontSize: "clamp(2.75rem, 14vw, 280px)" }}>
                  <HeroSplitText text="EXPLOSIONS," />
                </span>
                <span className="hero-line2 block -mt-[0.15em]" style={{ fontSize: "clamp(1.875rem, 9vw, 160px)" }}>
                  <HeroSplitText text="MADE STANDARD." />
                </span>
              </h1>
              {/* Layer B: thick blur */}
              <h1
                className="hero-line1 hero-line2 absolute left-0 right-0 bottom-0 w-full origin-bottom-left"
                aria-hidden
                style={{
                  color: "rgba(255,255,255,0.06)",
                  filter: "blur(1px)",
                  transform: "translate(0.5px, 0.5px)",
                  zIndex: 1,
                }}
              >
                <span className="hero-line1 block" style={{ fontSize: "clamp(2.75rem, 14vw, 280px)" }}>
                  <HeroSplitText text="EXPLOSIONS," />
                </span>
                <span className="hero-line2 block -mt-[0.15em]" style={{ fontSize: "clamp(1.875rem, 9vw, 160px)" }}>
                  <HeroSplitText text="MADE STANDARD." />
                </span>
              </h1>
              {/* Layer A: primary stroke */}
              <h1
                className="hero-line1 hero-line2 absolute left-0 right-0 bottom-0 w-full origin-bottom-left text-[var(--text-strong)]"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.9)",
                  zIndex: 2,
                }}
              >
                <span className="hero-line1 block" style={{ fontSize: "clamp(2.75rem, 14vw, 280px)" }}>
                  <HeroSplitText text="EXPLOSIONS," />
                </span>
                <span className="hero-line2 block -mt-[0.15em]" style={{ fontSize: "clamp(1.875rem, 9vw, 160px)" }}>
                  <HeroSplitText text="MADE STANDARD." />
                </span>
              </h1>
              </div>
            </motion.div>
          </div>

          {/* サブコピー: 同じラッパー内なので left が揃う */}
          <div
            className="shrink-0 w-full pt-0 pb-6 sm:pb-8 md:pb-10 -mt-1 sm:mt-0"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <div className="hero-separator mb-6 sm:mb-8">
              <div
                className="hero-separator-line h-px bg-[var(--line-soft)] origin-left"
                style={{ width: 40 }}
              />
            </div>
            <div className="hero-sub-line h-px bg-[var(--line-soft)] mb-5" style={{ width: 24 }} />
            <p
              className="hero-sub-copy text-[var(--text-primary)]"
              style={{
                fontFamily: "var(--font-display-italic)",
                fontSize: "clamp(0.9375rem, 2.5vw, 1.75rem)",
                lineHeight: 2,
                letterSpacing: "0.05em",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              表現が本来持っている、世界を動かす力を信じて。
              <br className="hidden md:block" />
              私たちは、新時代のスタンダードを探求し続けます。
            </p>
          </div>
        </div>
      </div>

      <div
        ref={bottomBarRef}
        className="hero-bottom-bar relative shrink-0"
        style={{ zIndex: 10, paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-12 py-4 md:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="hero-stats flex items-center gap-4 sm:gap-8 md:gap-12 flex-wrap">
            {[
              { target: 100, suffix: "+", label: "Songs / Year", d: 2.5 },
              { target: 300, suffix: "+", label: "Artists", d: 2.7 },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2">
                {i > 0 && <div className="w-px h-4 bg-[var(--line-soft)] mr-4 md:mr-10" />}
                <span
                  className="text-[var(--text-strong)]"
                  style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 4vw, 1.25rem)", fontWeight: 600, letterSpacing: "-0.02em" }}
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
            className="hero-scroll-btn flex items-center gap-3 cursor-pointer group min-h-[44px] min-w-[44px] touch-manipulation"
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

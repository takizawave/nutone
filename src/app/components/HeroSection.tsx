import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
const logoText = "/fix_nutone_logo-03.png";

/* ─── Particle Network ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number }[]
  >([]);
  const rafRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const count = Math.min(50, Math.floor((w * h) / 22000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1 + 0.5,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    const linkDist = 140;
    const mouseDist = 160;

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const ps = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of ps) {
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < mouseDist && dm > 0) {
          const force = (mouseDist - dm) / mouseDist;
          p.vx += (dmx / dm) * force * 0.1;
          p.vy += (dmy / dm) * force * 0.1;
        }
        p.vx *= 0.988;
        p.vy *= 0.988;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.06;
            ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.4})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < mouseDist) {
          const alpha = (1 - d / mouseDist) * 0.1;
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.4})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }

      for (const p of ps) {
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [init]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: 0.8 }}
    />
  );
}

/* ─── Orbital Diagram ─── */
function OrbitalDiagram({
  mx,
  my,
  scrollProgress,
}: {
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  scrollProgress: ReturnType<typeof useTransform>;
}) {
  const sY = useTransform(scrollProgress, [0, 1], [0, 60]);
  const sOp = useTransform(scrollProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      className="absolute top-1/2 right-[2%] -translate-y-1/2 pointer-events-none hidden lg:block"
      style={{
        width: "clamp(360px, 40vw, 560px)",
        height: "clamp(360px, 40vw, 560px)",
        y: sY,
        opacity: sOp,
        zIndex: 2,
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{ x: mx, y: my }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          {[50, 85, 120, 155].map((r, i) => (
            <circle
              key={r}
              cx="200"
              cy="200"
              r={r}
              stroke="var(--line-soft)"
              strokeWidth={i === 3 ? 0.5 : 0.3}
              opacity={0.04 + i * 0.015}
              strokeDasharray={i < 2 ? `${2 + i} ${5 + i}` : "none"}
            />
          ))}
          <ellipse
            cx="200"
            cy="200"
            rx="155"
            ry="14"
            stroke="var(--line-soft)"
            strokeWidth="0.4"
            opacity="0.08"
          />
          {[30, 60, 90, 120, 150].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const rx = Math.abs(Math.sin(rad) * 155);
            return (
              <ellipse
                key={angle}
                cx="200"
                cy="200"
                rx={Math.max(rx, 0.5)}
                ry="155"
                stroke="var(--line-soft)"
                strokeWidth="0.25"
                opacity={0.04 + Math.sin(rad) * 0.02}
              />
            );
          })}
          <line x1="200" y1="35" x2="200" y2="365" stroke="var(--line-soft)" strokeWidth="0.2" opacity="0.04" strokeDasharray="4 8" />
          <line x1="35" y1="200" x2="365" y2="200" stroke="var(--line-soft)" strokeWidth="0.2" opacity="0.04" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="1.5" fill="var(--line-soft)" opacity="0.1" />
          <circle cx="200" cy="200" r="4" stroke="var(--line-soft)" strokeWidth="0.3" opacity="0.06" fill="none" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mx = useSpring(mouseX, { stiffness: 25, damping: 20 });
  const my = useSpring(mouseY, { stiffness: 25, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useGSAP(
    () => {
      const scope = contentRef.current;
      if (!scope || !sectionRef.current) return;

      const logo = scope.querySelector(".hero-logo");
      const separatorLine = scope.querySelector(".hero-separator-line");
      const separatorLabel = scope.querySelector(".hero-separator-label");
      const line1Chars = scope.querySelectorAll(".hero-line1 .hero-headline-char");
      const line2Chars = scope.querySelectorAll(".hero-line2 .hero-headline-char");
      const line3Chars = scope.querySelectorAll(".hero-line3 .hero-headline-char");
      const subLine = scope.querySelector(".hero-sub-line");
      const subCopy = scope.querySelector(".hero-sub-copy");
      const bottomBar = scope.querySelector(".hero-bottom-bar");
      const stats = scope.querySelector(".hero-stats");
      const scrollBtn = scope.querySelector(".hero-scroll-btn");

      const tl = gsap.timeline({ defaults: { ease: easeOut } });

      tl.from(logo, { y: 12, opacity: 0, duration: 0.8 })
        .from(separatorLine, { scaleX: 0, duration: 1.2, ease: "power2.inOut" }, 0.4)
        .from(separatorLabel, { opacity: 0, duration: 0.8 }, 1)
        .from(line1Chars, { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.025 }, 0.6)
        .from(line2Chars, { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.025 }, 0.82)
        .from(line3Chars, { yPercent: 110, opacity: 0, duration: 0.9 }, 1.2)
        .from(subLine, { width: 0, duration: 0.8 }, 1.8)
        .from(subCopy, { y: 10, opacity: 0, duration: 0.7 }, 2)
        .from(bottomBar, { opacity: 0 }, 2.4)
        .from(stats, { opacity: 0 }, 2.5)
        .from(scrollBtn, { opacity: 0 }, 2.6);

      gsap.to(scope, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "45% top",
          scrub: 1,
        },
      });
      if (bottomBarRef.current) {
        gsap.to(bottomBarRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "45% top",
            scrub: 1,
          },
        });
      }

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


  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const scrollDown = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between bg-[var(--void)] overflow-hidden"
      style={{ paddingTop: 72 }}
    >
      <ParticleCanvas />
      <OrbitalDiagram mx={mx} my={my} scrollProgress={scrollYProgress} />

      <div
        ref={contentRef}
        className="max-w-[1080px] mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center relative hero-content"
        style={{ zIndex: 10 }}
      >
        <div className="hero-logo mb-10">
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

        <div className="hero-separator mb-12 flex items-center gap-4">
          <div
            className="hero-separator-line h-px bg-[var(--line-soft)] origin-left"
            style={{ width: 40 }}
          />
          <span
            className="hero-separator-label"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--section-label-size)",
              letterSpacing: "var(--section-label-spacing)",
              color: "var(--text-secondary)",
              opacity: 0.5,
            }}
          >
            001
          </span>
        </div>

        <h1 className="text-[var(--text-strong)]">
          <span className="hero-line1 block" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            <HeroSplitText text="CREATING" />
          </span>
          <span className="hero-line2 block mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
            <HeroSplitText text="THE GREATEST" />
          </span>
          <span className="hero-line3 block mt-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", WebkitTextStroke: "1.5px var(--stroke)", WebkitTextFillColor: "transparent" }}>
            <HeroSplitText text="SCENES." />
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

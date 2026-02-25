/**
 * 白黒のみの音楽的ランディングページ
 * React + Framer Motion (motion/react). Canvas/SVGのみ、画像なし.
 * prefers-reduced-motion 対応・レスポンシブ.
 */
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

// ----- 定数 -----
const BAND_RECT_COUNT = 280;
const BAND_ROWS = 14;
const SPECTRUM_BARS = 24;
const REDUCED_MOTION_DURATION = 0.01;

// ----- 軽量ノイズ層（CSS only） -----
function NoiseLayer({ intensity }: { intensity: ReturnType<typeof useTransform<number>> }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: intensity,
      }}
      aria-hidden
    />
  );
}

// ----- 微細グリッド（SVG） -----
function GridTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
      aria-hidden
    >
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// ----- ピクセル帯（Canvas）：波形のうねり、scrollで振幅・密度・opacity変化 -----
function PixelBand({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let progress = 0;
    const unsub = scrollProgress.on("change", (v) => (progress = v));

    const rectsPerRow = Math.floor(BAND_RECT_COUNT / BAND_ROWS);
    let rafId = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const amplitude = reducedMotion ? 0 : 6 + progress * 22;
      const frequency = 0.02 + progress * 0.04;
      const twist = progress * 0.4;
      const baseOpacity = 0.25 + progress * 0.5;

      for (let i = 0; i < BAND_RECT_COUNT; i++) {
        const row = Math.floor(i / rectsPerRow);
        const col = i % rectsPerRow;
        const x = (col / rectsPerRow) * w;
        const baseY = (row / BAND_ROWS) * h + h * 0.2;
        const phase = i * 0.1 + twist * 50;
        const yOff = amplitude * Math.sin(frequency * i + phase);
        const y = baseY + yOff;
        const rectW = w / rectsPerRow - 1;
        const rectH = Math.max(1.5, h / BAND_ROWS - 1);
        const alpha = baseOpacity * (0.7 + 0.3 * Math.sin(i * 0.05));
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(x, y, rectW, rectH);
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      unsub();
      cancelAnimationFrame(rafId);
    };
  }, [scrollProgress, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio);
    const h = Math.min(180, window.innerHeight * 0.18);
    canvas.width = window.innerWidth * dpr;
    canvas.height = h * dpr;
    canvas.style.width = "100%";
    canvas.style.height = `${h}px`;
  }, []);

  const bandOpacity = useTransform(scrollProgress, [0, 0.15], [0.3, 1]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute left-0 top-1/2 w-full -translate-y-1/2"
      style={{ opacity: bandOpacity }}
      aria-hidden
    />
  );
}

// ----- Hero 用 Canvas 波形帯（scroll連動・60fps） -----
function HeroWaveCanvas({
  scrollYProgress,
  reducedMotion,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let progress = 0;
    const unsub = scrollYProgress.on("change", (v) => (progress = v));

    const cols = 120;
    const rows = 10;
    const cellW = 4;
    const cellH = 3;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);

      const amp = reducedMotion ? 0 : 6 + progress * 18;
      const freq = 0.03 + progress * 0.04;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c / cols) * w;
          const baseY = (r / rows) * h + h * 0.3;
          const phase = r * 0.5 + progress * 20;
          const yOff = amp * Math.sin(c * freq + phase);
          const y = baseY + yOff;
          const alpha = 0.12 + 0.08 * Math.sin(c * 0.1 + progress * 5);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillRect(x, y, cellW, cellH);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio);
      canvas.width = window.innerWidth * dpr;
      canvas.height = Math.min(400, window.innerHeight * 0.5) * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-1/2 w-full -translate-y-1/2 opacity-80"
      style={{ height: "min(400px, 50vh)" }}
      aria-hidden
    />
  );
}

// ----- スペクトラムバー（section間）：フェードインして「踊る」 -----
function SpectrumBars({
  progress,
  reducedMotion,
}: {
  progress: ReturnType<typeof useTransform<number>>;
  reducedMotion: boolean;
}) {
  const count = SPECTRUM_BARS;
  const barWidth = 100 / count - 0.5;

  return (
    <motion.svg
      viewBox="0 0 100 12"
      className="h-12 w-full opacity-60"
      preserveAspectRatio="none"
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <SpectrumBar
          key={i}
          i={i}
          x={i * (100 / count)}
          barWidth={barWidth}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.svg>
  );
}

function SpectrumBar({
  i,
  x,
  barWidth,
  progress,
  reducedMotion,
}: {
  i: number;
  x: number;
  barWidth: number;
  progress: ReturnType<typeof useTransform<number>>;
  reducedMotion: boolean;
}) {
  const height = useTransform(
    progress,
    [0, 0.3, 0.6, 1],
    reducedMotion ? [2, 2, 2, 2] : [1, 4 + (i % 5), 3 + (i % 4), 2]
  );
  const opacity = useTransform(progress, [0, 0.2], [0, 0.7]);
  const y = useTransform(height, (h) => 12 - h);
  return (
    <motion.rect
      x={x}
      width={barWidth}
      fill="white"
      style={{ y, height, opacity }}
    />
  );
}

// ----- Nav: 3 pills -----
function Nav({ reducedMotion }: { reducedMotion: boolean }) {
  const duration = reducedMotion ? REDUCED_MOTION_DURATION : 0.4;
  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 flex justify-center gap-3 p-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration, staggerChildren: 0.05, delayChildren: 0.2 }}
    >
      {["Mission", "Vision", "Values"].map((label, i) => (
        <motion.a
          key={label}
          href={`#${label.toLowerCase()}`}
          className="rounded-full border border-white/40 px-5 py-2 text-xs uppercase tracking-widest text-white/90 transition-colors hover:border-white hover:text-white"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration, delay: 0.25 + i * 0.05 }}
          whileHover={reducedMotion ? {} : { scale: 1.03 }}
          whileTap={reducedMotion ? {} : { scale: 0.98 }}
        >
          {label}
        </motion.a>
      ))}
    </motion.nav>
  );
}

// ----- Hero: 巨大タイポ + 2行コピー + CTA 2つ -----
function HeroSection({
  scrollYProgress,
  reducedMotion,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const duration = reducedMotion ? REDUCED_MOTION_DURATION : 0.7;
  const stagger = reducedMotion ? 0 : 0.04;
  const headlineChars = "SIGNAL".split("");
  const headlineChars2 = "NOISE".split("");

  const bandOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  return (
    <section className="relative flex min-h-screen flex-col justify-end pb-24 pt-24">
      <HeroWaveCanvas scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
      <motion.div
        className="absolute left-0 top-1/2 w-full -translate-y-1/2"
        style={{ opacity: bandOpacity }}
      >
        <PixelBand scrollProgress={scrollYProgress} reducedMotion={reducedMotion} />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[900px] px-6">
        {/* タイポ：下から上へ収束（y, opacity, stagger） */}
        <h1 className="flex flex-wrap justify-center gap-x-2 overflow-hidden text-[clamp(3rem,14vw,11rem)] font-semibold leading-[0.88] tracking-tighter text-white">
          {headlineChars.map((char, i) => (
            <motion.span
              key={`1-${i}`}
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration,
                delay: 0.3 + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          <span className="w-2 md:w-4" />
          {headlineChars2.map((char, i) => (
            <motion.span
              key={`2-${i}`}
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration,
                delay: 0.5 + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* 2行コピー */}
        <motion.p
          className="mt-8 max-w-md text-sm leading-relaxed text-white/60"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration, delay: 1 }}
        >
          表現が本来持つ、世界を動かす力を信じて。
          <br />
          新時代のスタンダードを探求し続けます。
        </motion.p>

        {/* CTA 2つ */}
        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration, delay: 1.15 }}
        >
          <motion.a
            href="#mission"
            className="rounded-full border border-white px-6 py-3 text-xs uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
          >
            Explore
          </motion.a>
          <motion.a
            href="#values"
            className="rounded-full border border-white/50 bg-white/5 px-6 py-3 text-xs uppercase tracking-widest text-white/90 backdrop-blur-sm transition-colors hover:border-white/80 hover:bg-white/10"
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
          >
            Our Values
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ----- Mission: ノイズ層が少し強まる -----
function MissionSection({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: ReturnType<typeof useTransform<number>>;
  reducedMotion: boolean;
}) {
  const noiseIntensity = useTransform(scrollProgress, [0, 0.5], [0.02, 0.06]);
  const opacity = useTransform(scrollProgress, [0, 0.25], [0, 1]);
  const y = useTransform(scrollProgress, [0, 0.2], [24, 0]);

  return (
    <section id="mission" className="relative flex min-h-[70vh] items-center py-24">
      <NoiseLayer intensity={noiseIntensity} />
      <motion.div
        className="relative z-10 mx-auto max-w-[720px] px-6"
        style={{ opacity, y }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
          Mission —
        </p>
        <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-white">
          突き刺さる、剥き出しのエネルギーを。
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-white/70">
          慣習や技法に安住せず、常に「表現の原液」を追い求める。それが私たちのスタイルです。整った音ではなく、心を動かす熱狂を。
        </p>
      </motion.div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <SpectrumBars
          progress={useTransform(scrollProgress, [0.1, 0.4], [0, 1])}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}

// ----- Vision: 波紋リング（SVG circle）を拡張 -----
function VisionSection({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: ReturnType<typeof useTransform<number>>;
  reducedMotion: boolean;
}) {
  const ringScale = useTransform(
    scrollProgress,
    [0, 0.35, 0.7],
    reducedMotion ? [1, 1, 1] : [0.3, 1.2, 1.5]
  );
  const ringOpacity = useTransform(scrollProgress, [0, 0.2, 0.5], [0, 0.4, 0.15]);
  const contentOpacity = useTransform(scrollProgress, [0.25, 0.45], [0, 1]);
  const contentY = useTransform(scrollProgress, [0.25, 0.4], [20, 0]);

  return (
    <section id="vision" className="relative flex min-h-[80vh] items-center justify-center py-24">
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
        style={{ scale: ringScale, opacity: ringOpacity }}
        aria-hidden
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
        style={{
          scale: useTransform(scrollProgress, [0.15, 0.4], [0.2, 1.1]),
          opacity: useTransform(scrollProgress, [0.15, 0.35], [0, 0.25]),
        }}
        aria-hidden
      />
      <motion.div
        className="relative z-10 mx-auto max-w-[640px] px-6 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
          Vision —
        </p>
        <h2 className="mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-tight text-white">
          新しい時代の基準を、共に創る。
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-white/60">
          表現が持つ真の力を解放し、スタンダードそのものをアップデートしていく。
        </p>
      </motion.div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <SpectrumBars
          progress={useTransform(scrollProgress, [0.35, 0.65], [0, 1])}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}

// ----- Values: 3 cards、互いに近づきグリッドに整列（x/y + spring） -----
function ValuesSection({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: ReturnType<typeof useTransform<number>>;
  reducedMotion: boolean;
}) {
  const card1X = useTransform(
    scrollProgress,
    [0.5, 0.72],
    reducedMotion ? [0, 0] : [-80, 0]
  );
  const card1Y = useTransform(
    scrollProgress,
    [0.5, 0.72],
    reducedMotion ? [0, 0] : [40, 0]
  );
  const card2Y = useTransform(
    scrollProgress,
    [0.52, 0.74],
    reducedMotion ? [0, 0] : [30, 0]
  );
  const card3X = useTransform(
    scrollProgress,
    [0.54, 0.76],
    reducedMotion ? [0, 0] : [80, 0]
  );
  const card3Y = useTransform(
    scrollProgress,
    [0.54, 0.76],
    reducedMotion ? [0, 0] : [40, 0]
  );
  const cardsOpacity = useTransform(scrollProgress, [0.48, 0.62], [0, 1]);

  const values = [
    { title: "Energy", body: "剥き出しの熱量を、そのまま届ける。" },
    { title: "Original", body: "表現の原液を、妥協なく追い求める。" },
    { title: "Standard", body: "新時代の基準を、共に創り上げる。" },
  ];

  return (
    <section id="values" className="relative py-24">
      <div className="mx-auto max-w-[1000px] px-6">
        <motion.p
          className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40"
          style={{ opacity: cardsOpacity }}
        >
          Values —
        </motion.p>
        <motion.h2
          className="mt-4 text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold text-white"
          style={{ opacity: cardsOpacity }}
        >
          私たちが大切にしていること
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            className="rounded-lg border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
            style={{ x: card1X, y: card1Y, opacity: cardsOpacity }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              {values[0].title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {values[0].body}
            </p>
          </motion.div>
          <motion.div
            className="rounded-lg border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
            style={{ y: card2Y, opacity: cardsOpacity }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              {values[1].title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {values[1].body}
            </p>
          </motion.div>
          <motion.div
            className="rounded-lg border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
            style={{ x: card3X, y: card3Y, opacity: cardsOpacity }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/90">
              {values[2].title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {values[2].body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ----- Footer: 動きが静止に近づく -----
function FooterSection({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: ReturnType<typeof useTransform<number>>;
  reducedMotion: boolean;
}) {
  const opacity = useTransform(scrollProgress, [0.75, 1], [0.4, 1]);
  const y = useTransform(scrollProgress, [0.75, 0.95], [20, 0]);
  const scale = useTransform(
    scrollProgress,
    [0.8, 1],
    reducedMotion ? [1, 1] : [0.98, 1]
  );

  return (
    <motion.footer
      className="relative border-t border-white/10 py-20"
      style={{ opacity, y, scale }}
    >
      <GridTexture />
      <div className="relative z-10 mx-auto max-w-[720px] px-6 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
          Contact —
        </p>
        <p className="mt-4 text-sm text-white/60">
          表現の力で、世界を動かす。一緒にスタンダードを創りませんか。
        </p>
        <p className="mt-8 text-xs text-white/30">
          © Signal Noise. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}

// ----- メインページ -----
export function MusicLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // セクション別 progress（0〜1）を useTransform でスライス
  const missionProgress = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const visionProgress = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const valuesProgress = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const footerProgress = useTransform(scrollYProgress, [0.75, 1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0a] text-white antialiased"
    >
      <GridTexture />
      <Nav reducedMotion={reducedMotion} />
      <HeroSection scrollYProgress={scrollYProgress} reducedMotion={reducedMotion} />
      <MissionSection scrollProgress={missionProgress} reducedMotion={reducedMotion} />
      <VisionSection scrollProgress={visionProgress} reducedMotion={reducedMotion} />
      <ValuesSection scrollProgress={valuesProgress} reducedMotion={reducedMotion} />
      <FooterSection scrollProgress={footerProgress} reducedMotion={reducedMotion} />
    </div>
  );
}

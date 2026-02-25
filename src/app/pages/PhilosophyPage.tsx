import { useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { NoiseOverlay, RevealLine } from "../components/IndustrialOverlay";

/* ── Animation presets ── */
const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.7, delay, ease },
});
const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 } as const,
  animate: { opacity: 1 } as const,
  transition: { duration: 0.7, delay, ease },
});

/* ── Data ── */
const values = [
  {
    number: "01",
    titleEn: "Burn the Miles",
    titleJa: "軌跡を燃やせ",
    description:
      "経験やテクニックを「守るべき資産」にしない。それらは今の表現を爆発させるための燃料であり、常に使い切り、更新し続ける。昨日の成功も、これまでの手法も、今の表現を爆発させるための燃料に過ぎない。常に「今、この瞬間」が最高傑作であるために、過去の自分を壊し続ける。",
  },
  {
    number: "02",
    titleEn: "Pure Collision",
    titleJa: "純粋なる衝突",
    description:
      "ビジネス的な計算ではなく、クリエイティブにおける「真実」のみを基準にセッションを行う。その妥協なき追求が、最強のIPを形作る。",
  },
  {
    number: "03",
    titleEn: "Invisible Foundation",
    titleJa: "静かなる基盤",
    description:
      "ユーザーやクライアントに届けるのは、常に純粋な芸術的衝撃のみ。その裏側では、表現の自由を守り抜くための強固な事業基盤と戦略を、プロフェッショナルとして完備する。",
  },
];

const missionItems = [
  {
    label: "解決したい問い",
    text: "過去の成功やデータの再生産によって、表現が「無難な商品」と化した退屈な社会。",
  },
  {
    label: "私たちが立ち向かうもの",
    text: "世の中には「上手で、心地よいだけの表現」が溢れています。しかし、過去の成功法則や手慣れた技術に頼った瞬間、表現は鮮度を失い、人の心を動かす力を失います。",
  },
  {
    label: "nutoneの約束",
    text: "私たちは、あらゆるクリエイティブにおいて「守り」に入ることを拒絶します。磨き上げた技術すら一度捨て去り、今この瞬間にしか生まれない「剥き出しの衝撃」を追い求めること。その純粋なエネルギーを、自社アーティストの活動から、ゲームBGM・劇伴制作、アイドルやアーティストへの楽曲提供、企業広告のサウンドデザインまで、あらゆる音の領域に実装します。予定調和を破壊する熱狂が、新しい文化と価値を切り拓く。私たちは、表現が持つ真の力を信じ、それを次世代の基準（スタンダード）に変えていきます。",
  },
];

export function PhilosophyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--void)]">
      <Header />

      {/* ── Hero / Intro ── */}
      <section className="bg-[var(--surface)] relative overflow-hidden" style={{ paddingTop: 144, paddingBottom: 80 }}>
        <NoiseOverlay />
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
          <motion.div {...fadeIn()} className="mb-16">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
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
            {...fadeIn(0.05)}
            className="text-[var(--text-secondary)]"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ( Philosophy )
          </motion.p>

          <RevealLine className="mt-4 mb-4" />

          <motion.h1
            {...fadeIn(0.1)}
            className="text-[var(--text-strong)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: "0.02em",
            }}
          >
            Mission / Vision / Value
          </motion.h1>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="bg-[var(--panel)] relative overflow-hidden" style={{ padding: "120px 0" }}>
        <NoiseOverlay />
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
          <motion.p
            {...fadeUp(0.04)}
            className="text-[var(--text-strong)]/20 mb-4"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Mission
          </motion.p>
          <motion.p
            {...fadeUp(0.06)}
            className="text-[var(--text-strong)]/25 mb-12"
            style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}
          >
            存在意義
          </motion.p>

          <motion.h2
            {...fadeUp(0.1)}
            className="text-[var(--text-strong)] mb-16 md:mb-20"
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 700,
              lineHeight: 1.7,
              letterSpacing: "0.02em",
            }}
          >
            「表現の爆発を、
            <br className="md:hidden" />
            新しい時代のスタンダードに」
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {missionItems.map((item, i) => (
              <motion.div key={item.label} {...fadeUp(0.14 + i * 0.06)}>
                <p
                  className="text-[var(--text-strong)]/50 mb-4"
                  style={{ fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.04em" }}
                >
                  {item.label}
                </p>
                <p
                  className="text-[var(--text-strong)]/40"
                  style={{ fontSize: "0.875rem", lineHeight: 2.2, letterSpacing: "0.04em", fontWeight: 300 }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="bg-[var(--surface)] relative overflow-hidden" style={{ padding: "120px 0" }}>
        <NoiseOverlay />
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
          <motion.p
            {...fadeUp(0.04)}
            className="text-[var(--text-strong)]/20 mb-4"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Vision
          </motion.p>
          <motion.p
            {...fadeUp(0.06)}
            className="text-[var(--text-strong)]/25 mb-12"
            style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}
          >
            理想の姿
          </motion.p>

          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="md:w-5/12">
              <motion.h2
                {...fadeUp(0.1)}
                className="text-[var(--text-strong)]"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  fontWeight: 700,
                  lineHeight: 1.7,
                  letterSpacing: "0.02em",
                }}
              >
                「情熱が自走し、
                <br />
                新しい基準を
                <br />
                創り続ける
                <br />
                コレクティブ」
              </motion.h2>
            </div>

            <div className="md:w-7/12 flex items-end">
              <motion.p
                {...fadeUp(0.14)}
                className="text-[var(--text-strong)]/40"
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 2.2,
                  letterSpacing: "0.04em",
                  fontWeight: 300,
                }}
              >
                私たちが目指すのは、表現から生まれた熱狂が波紋のように広がり、それ自体が新しい価値として動き出す未来です。独立した才能を持つクリエイターが集まり、過去の成功や手慣れた技術に頼ることなく、今の自分たちの「最高」をぶつけ合う。その純粋な衝突から生まれるエネルギーが、関わるすべての人を巻き込み、新しい文化と価値を動かしていく集団であり続けます。
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Value ── */}
      <section className="bg-[var(--panel)] relative overflow-hidden" style={{ padding: "120px 0" }}>
        <NoiseOverlay />
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative" style={{ zIndex: 5 }}>
          <motion.p
            {...fadeUp(0.04)}
            className="text-[var(--text-strong)]/20 mb-4"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Value
          </motion.p>
          <motion.p
            {...fadeUp(0.06)}
            className="text-[var(--text-strong)]/25 mb-16"
            style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}
          >
            行動指針
          </motion.p>

          <div>
            {values.map((value, index) => (
              <motion.div
                key={value.number}
                {...fadeUp(0.1 + index * 0.06)}
                className="border-t border-[var(--line-soft)] last:border-b"
                style={{ padding: "40px 0" }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-16">
                  <div className="md:w-5/12 flex items-start gap-5">
                    <span
                      className="text-[var(--text-strong)]/8 shrink-0 mt-0.5"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", fontWeight: 500 }}
                    >
                      {value.number}
                    </span>
                    <div>
                      <h3
                        className="text-[var(--text-strong)]"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
                          fontWeight: 700,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.4,
                        }}
                      >
                        {value.titleEn}
                      </h3>
                      <p
                        className="text-[var(--text-strong)]/25 mt-1.5"
                        style={{ fontSize: "0.8125rem", letterSpacing: "0.06em" }}
                      >
                        {value.titleJa}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-7/12">
                    <p
                      className="text-[var(--text-strong)]/40"
                      style={{ fontSize: "0.9375rem", lineHeight: 2.2, letterSpacing: "0.04em", fontWeight: 300 }}
                    >
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
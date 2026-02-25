import { useEffect, useRef } from "react";
import { NutoneLogoBackground } from "./NutoneLogoBackground";

const newsItems = [
  'シングル「Flames Within Me」リリースのお知らせ',
  "「ゆけむり (feat. asu)」リリースのお知らせ",
  'シングル「Flames Within Me」リリースのお知らせ',
  "「ゆけむり (feat. asu)」リリースのお知らせ",
];

export function NewsTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= 0.3;
      const halfWidth = el.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) position = 0;
      el.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const allItems = [...newsItems, ...newsItems];

  return (
    <section className="bg-[var(--panel)] py-5 overflow-hidden border-y border-[var(--line-soft)] relative">
      <NutoneLogoBackground />
      <div
        ref={scrollRef}
        className="flex items-center gap-16 whitespace-nowrap w-max"
      >
        {allItems.map((item, index) => (
          <div key={index} className="flex items-center gap-16">
            <span
              className="text-[var(--text-secondary)]"
              style={{ fontSize: "0.8125rem", letterSpacing: "0.04em", fontWeight: 300 }}
            >
              {item}
            </span>
            <span className="text-[var(--line-soft)]" style={{ fontSize: "0.25rem" }}>
              ●
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

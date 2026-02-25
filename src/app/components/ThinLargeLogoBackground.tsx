/**
 * 薄くデカい fix_nutone_logo-03 をセクション背景に1枚だけ表示
 */
const LOGO_SRC = "/fix_nutone_logo-03.png";

export function ThinLargeLogoBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <img
        src={LOGO_SRC}
        alt=""
        className="max-w-none select-none object-contain"
        style={{
          width: "clamp(400px, 75vw, 1100px)",
          height: "auto",
          maxHeight: "85%",
          opacity: 0.05,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

/**
 * Scattered, thin, large nutone logo as section background.
 * Use once per section; positions/sizes are deterministic.
 */
const LOGO_SRC = "/fix_nutone_logo-03.png";

const SPOTS: { left: string; top: string; width: string; opacity: number; rotate: number }[] = [
  { left: "50%", top: "50%", width: "clamp(420px, 85vw, 1000px)", opacity: 0.032, rotate: 0 },
  { left: "5%", top: "15%", width: "clamp(320px, 55vw, 720px)", opacity: 0.022, rotate: -8 },
  { left: "75%", top: "20%", width: "clamp(280px, 48vw, 640px)", opacity: 0.02, rotate: 6 },
  { left: "15%", top: "65%", width: "clamp(300px, 52vw, 680px)", opacity: 0.025, rotate: 5 },
  { left: "82%", top: "72%", width: "clamp(260px, 45vw, 600px)", opacity: 0.018, rotate: -5 },
  { left: "35%", top: "88%", width: "clamp(240px, 42vw, 560px)", opacity: 0.02, rotate: -3 },
  { left: "90%", top: "45%", width: "clamp(220px, 38vw, 500px)", opacity: 0.016, rotate: 4 },
];

export function NutoneLogoBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      {SPOTS.map((spot, i) => (
        <img
          key={i}
          src={LOGO_SRC}
          alt=""
          className="absolute max-w-none select-none"
          style={{
            left: spot.left,
            top: spot.top,
            width: spot.width,
            height: "auto",
            opacity: spot.opacity,
            filter: "blur(56px)",
            transform: `translate(-50%, -50%) rotate(${spot.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

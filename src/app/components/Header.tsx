import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router";
const logoIcon = "/nutone_logotype@2x.png";

type NavItem =
  | { label: string; href: string; type: "scroll" }
  | { label: string; to: string; type: "link" };

const navItems: NavItem[] = [
  { label: "Service", href: "#service", type: "scroll" },
  { label: "Works", href: "#works", type: "scroll" },
  { label: "Company", href: "#company", type: "scroll" },
  { label: "Philosophy", to: "/philosophy", type: "link" },
  { label: "Contact", href: "#contact", type: "scroll" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      const items = nav.querySelectorAll("button");
      gsap.fromTo(
        items,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, delay: 0.2, ease: "power2.out" }
      );
    },
    { scope: headerRef }
  );

  const handleScrollNav = (href: string) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + href);
    }
  };

  const handleLinkNav = (to: string) => {
    setIsOpen(false);
    navigate(to);
  };

  const linkStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "0.8125rem",
    letterSpacing: "0.04em",
    fontWeight: 400,
  } as const;

  return (
    <div
      className="fixed left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 z-50"
      style={{ top: "calc(1rem + env(safe-area-inset-top))" }}
    >
      <header
        ref={headerRef}
        className="max-w-[1080px] mx-auto rounded-2xl border border-white/[0.12] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(228,234,242,0.08) 100%)",
        }}
      >
        <div className="px-4 sm:px-6 md:px-8 h-[60px] md:h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={logoIcon}
            alt="nutone"
            draggable={false}
            className="h-8 md:h-9 w-auto object-contain opacity-95"
            style={{ objectFit: "contain" }}
          />
        </Link>

        <nav ref={navRef} className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item) =>
            item.type === "scroll" ? (
              <button
                key={item.label}
                onClick={() => handleScrollNav(item.href)}
                className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
                style={linkStyle}
              >
                {item.label}
              </button>
            ) : (
              <button
                key={item.label}
                onClick={() => handleLinkNav(item.to)}
                className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
                style={linkStyle}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white/70 hover:text-white cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 touch-manipulation transition-colors duration-300"
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>

      {isOpen && (
        <div
          className="md:hidden rounded-b-2xl border-t border-white/[0.12] backdrop-blur-xl"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(228,234,242,0.06) 100%)",
          }}
        >
          <nav className="flex flex-col px-6 py-6 gap-1">
            {navItems.map((item) =>
            item.type === "scroll" ? (
              <button
                key={item.label}
                onClick={() => handleScrollNav(item.href)}
                className="text-white/70 hover:text-white transition-colors text-left cursor-pointer py-3 rounded-lg hover:bg-white/5 -mx-2 px-2"
                style={{ ...linkStyle, fontSize: "0.875rem" }}
              >
                {item.label}
              </button>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleLinkNav(item.to)}
                  className="text-white/70 hover:text-white transition-colors text-left cursor-pointer py-3 rounded-lg hover:bg-white/5 -mx-2 px-2"
                  style={{ ...linkStyle, fontSize: "0.875rem" }}
                >
                  {item.label}
                </button>
              )
            )}
          </nav>
        </div>
      )}
      </header>
    </div>
  );
}
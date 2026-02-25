import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router";
const logoIcon = "/fix_nutone_logo-03.png";

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
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--section-divider)" }} />

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={logoIcon}
            alt="nutone"
            draggable={false}
            style={{ height: 36, width: "auto", objectFit: "contain" }}
          />
        </Link>

        <nav ref={navRef} className="hidden md:flex items-center gap-10">
          {navItems.map((item) =>
            item.type === "scroll" ? (
              <button
                key={item.label}
                onClick={() => handleScrollNav(item.href)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-strong)] transition-colors duration-300 cursor-pointer"
                style={linkStyle}
              >
                {item.label}
              </button>
            ) : (
              <button
                key={item.label}
                onClick={() => handleLinkNav(item.to)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-strong)] transition-colors duration-300 cursor-pointer"
                style={linkStyle}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[var(--text-secondary)] cursor-pointer"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--panel)]/95 backdrop-blur-md border-t border-[var(--line-soft)]">
          <nav className="flex flex-col px-6 py-8 gap-6">
            {navItems.map((item) =>
              item.type === "scroll" ? (
                <button
                  key={item.label}
                  onClick={() => handleScrollNav(item.href)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-strong)] transition-colors text-left cursor-pointer"
                  style={{ ...linkStyle, fontSize: "0.875rem" }}
                >
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleLinkNav(item.to)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-strong)] transition-colors text-left cursor-pointer"
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
  );
}
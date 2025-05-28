"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  /* ---------- LOGO CLICK (come prima) ---------- */
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (typeof window === "undefined") return;

    if (isHomePage) {
      window.lenis?.scrollTo(0, { duration: 1.2 });
      requestAnimationFrame(() => {
        window.ScrollTrigger?.getAll().forEach((t) => t.kill());
        window.ScrollTrigger?.refresh(true);
      });
    } else {
      router.push("/");
    }
  };

  /* ---------- INDICATORE HOVER (come prima) ---------- */
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  /* al montaggio: posiziono l’indicatore sul link attivo */
  useEffect(() => {
    if (!navRef.current) return;
    const active = Array.from(navRef.current.children).find((el) =>
      el.classList.contains("active")
    );
    if (active) updateIndicator(active);
  }, [pathname]);

  const updateIndicator = (el) => {
    const { offsetLeft: left, clientWidth: width } = el;
    setIndicator({ left, width });
  };

  /* ---------- MOSTRA/NASCONDI LOGO SU SCROLL ---------- */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();                                   // inizializza
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- RENDER ---------- */
  return (
    <div className={`navbar${scrolled ? " scrolled" : ""}`}>
      {/* logo a sinistra */}
      <div className="navbar-col">
        <div className="navbar-sub-col logo">
          <a
            href="/"
            className="logo-link"
            onClick={handleLogoClick}
          /* lo faremo diventare invisibile via CSS */
          >
            <img
              src="/images/logos/logo-etere.svg"
              className="logo-img"
              alt="Logo"
            />
          </a>
        </div>
      </div>

      {/* nav pills a destra */}
      <div className="navbar-col">
        <div className="navbar-sub-col nav-items" ref={navRef}>
          {/* indicatore animato */}
          <div
            className="nav-indicator"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
            }}
          />

          <a
            href="/"
            className={`nav-link${pathname === "/" ? " active" : ""}`}
            onMouseEnter={(e) => updateIndicator(e.currentTarget)}
          >
            Home
          </a>
          <a
            href="/projects"
            className={`nav-link${pathname.startsWith("/projects") ? " active" : ""
              }`}
            onMouseEnter={(e) => updateIndicator(e.currentTarget)}
          >
            Projects
          </a>
          <a
            href="/about"
            className={`nav-link${pathname === "/about" ? " active" : ""}`}
            onMouseEnter={(e) => updateIndicator(e.currentTarget)}
          >
            About
          </a>
          <a
            href="/contact"
            className={`nav-link${pathname === "/contact" ? " active" : ""}`}
            onMouseEnter={(e) => updateIndicator(e.currentTarget)}
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}

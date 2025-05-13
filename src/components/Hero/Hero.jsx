/*  ────────────────────────────────────────────────────────────
    src/components/Hero/Hero.jsx
    ──────────────────────────────────────────────────────────── */
"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "../Marquee/Marquee";
import { useContent } from "../../context/ContentContext";
import { usePathname } from "next/navigation";
import { useTransition } from "../PageWrapper/PageWrapper";
import BlurScrollEffect from "./BlurScrollEffect";
import "./Hero.css";

const START = "polygon(37.5% 10%, 62.5% 10%, 62.5% 90%, 37.5% 90%)";
const MID = "polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)";
const END = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";

export default function Hero() {
  /* ‑‑‑ context & router info ‑‑‑ */
  const { home } = useContent();
  const pathname = usePathname();
  const { isTransitioning } = useTransition();

  if (!home?.hero) return null;
  const { hero } = home;

  /* ‑‑‑ refs & state ‑‑‑ */
  const heroRef = useRef(null);
  const txtBoxRef = useRef(null);
  const blurFxRef = useRef(null);
  const gsapCtxRef = useRef(null);
  const scrollRef = useRef(null);
  const setupTimeoutRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [animationProgress, setAnimProgress] = useState(0);

  /* ‑‑‑ utils ‑‑‑ */
  const cleanup = () => {
    setupTimeoutRef.current && clearTimeout(setupTimeoutRef.current);

    scrollRef.current?.kill();
    scrollRef.current = null;

    gsapCtxRef.current?.revert();
    gsapCtxRef.current = null;

    blurFxRef.current?.destroy();
    blurFxRef.current = null;
  };

  /* ‑‑‑ build animazioni ‑‑‑ */
  const build = () => {
    if (!heroRef.current || isTransitioning) return;

    gsap.registerPlugin(ScrollTrigger);

    gsapCtxRef.current = gsap.context(() => {
      const section = heroRef.current;

      /* 1. Disegno titolo con span */
      const titleEl = section.querySelector(".hero-title");
      if (titleEl) {
        titleEl.innerHTML = hero.title
          .split(" ")
          .map((w) =>
            w.toLowerCase() === "unseen"
              ? `<span class="blur-word">${w}</span>`
              : `<span class="hero-line">${w}</span>`
          )
          .join(" ");
      }

      /* 2. Elementi DOM utili  */
      const mask = section.querySelector(".hero-img");
      const img = mask?.querySelector("video, img");
      const blurEl = section.querySelector(".blur-word");
      const lines = section.querySelectorAll(".hero-line");
      const txt = txtBoxRef.current;
      const cta = section.querySelector(".cta-button");
      const mq = section.querySelector(".marquee");
      const logos = section.querySelectorAll(".hero-logos img");

      if (!mask || !img || !blurEl || !lines.length || !txt || !cta || !mq) {
        return;
      }

      /* 3. Blur effect – viene distrutto nel cleanup */
      blurFxRef.current = new BlurScrollEffect(blurEl);

      /* 4. Preset iniziali */
      gsap.set([mask, img, blurEl, lines, txt, cta, logos], { clearProps: "all" });
      gsap.set(mq, { autoAlpha: 1 });
      gsap.set(mask, { "--clip": START, opacity: 0, scaleY: .95, y: 20 });
      gsap.set(img, { scale: 0.8 });
      gsap.set(lines, { autoAlpha: 0, y: 40 });
      gsap.set(txt, { autoAlpha: 0, y: 20 });
      gsap.set(cta, { autoAlpha: 0, scale: 0.8 });
      gsap.set(logos, { autoAlpha: 0, y: 30 });

      /* 5. Intro non scrollata */
      gsap.timeline()
        .to(mask, { opacity: 1, scaleY: 1, y: 0, duration: 2, ease: "power1.out" })
        .to(blurEl, { filter: "blur(0px)", duration: 1.2, ease: "power2.out" }, "<");

      /* 6. Timeline scroll/trigger */
      const tl = gsap.timeline({
        paused: !isActive,
        onUpdate: () => setAnimProgress(tl.progress()),
      });

      tl.to(mq, { autoAlpha: 0 }, 0)
        .fromTo(mask, { "--clip": START }, { "--clip": MID, ease: "power2.inOut" }, 0)
        .to(img, { scale: 2.5, filter: "blur(40px)", ease: "power2.out" }, 0)
        .to(txt, { autoAlpha: 1, y: 0, duration: .6 }, 0.35)
        .to(mask, { "--clip": END, ease: "power2.inOut" }, 0.5)
        .to(lines, { autoAlpha: 1, y: 0, duration: 1.4, stagger: .35 }, 0.55)
        .to(".hero-subtitle", { autoAlpha: 1, y: 0, duration: .6 }, ">0.3")
        .to(cta, { autoAlpha: 1, scale: 1, duration: .6, ease: "back.out(1.7)" }, ">0.2")
        .to(logos, { autoAlpha: 1, y: 0, duration: .6, stagger: .2 }, ">0.15");

      /* 7. ScrollTrigger (solo se la sezione NON è gestita da PinSection) */
      if (!isActive) {
        scrollRef.current = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=250vh",
          scrub: true,
          pin: true,
          animation: tl,
          onUpdate: (self) => {
            setAnimProgress(self.progress);
            if (self.progress < 0.001) {
              gsap.set(mask, { "--clip": START });
              gsap.set(img, { scale: 0.8 });
            }
          },
        });
      } else {
        scrollRef.current = { kill: () => tl.kill() };
      }
    }, heroRef);

    /* refresh dopo layout shift */
    setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  /* ‑‑‑ sezione attiva (PinSection) ‑‑‑ */
  useEffect(() => {
    const onActivate = (e) => {
      if (e.detail.id === "hero") {
        setIsActive(true);
        if (e.detail.reset) {
          cleanup();
          setTimeout(build, 150);
        }
      } else {
        setIsActive(false);
      }
    };
    window.addEventListener("sectionActivated", onActivate);
    return () => window.removeEventListener("sectionActivated", onActivate);
  }, []);

  /* ‑‑‑ wheel → comunica a PinSection quando finiamo anim ‑‑‑ */
  useEffect(() => {
    if (!isActive || !heroRef.current) return;
    const wheel = (e) => {
      if (animationProgress > 0.95 && e.deltaY > 0) {
        window.dispatchEvent(
          new CustomEvent("sectionComplete", {
            detail: { id: "hero", direction: "down" },
          })
        );
      }
    };
    heroRef.current.addEventListener("wheel", wheel);
    return () => heroRef.current?.removeEventListener("wheel", wheel);
  }, [isActive, animationProgress]);

  /* ‑‑‑ rebuild on route‑change / data‑change ‑‑‑ */
  useLayoutEffect(() => {
    cleanup();
    setupTimeoutRef.current = setTimeout(build, 50);
    return cleanup;
  }, [pathname, hero.title, isTransitioning]);

  /* ‑‑‑ RENDER ‑‑‑ */
  return (
    <section
      ref={heroRef}
      className={`hero${isActive ? " active" : ""}`}
      data-section-id="hero"
    >
      <div className="hero-img">
        <video
          src="/videos/hero-web.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="hero-img-element"
          poster="data:image/gif;base64,R0lGODlhAQABAAAAACw="
          style={{ maxHeight: "100vh", objectFit: "contain" }}
        />
      </div>

      <Marquee text={hero.marquee} />

      <div className="hero-text-wrapper" ref={txtBoxRef}>
        <h1 className="hero-title" />
        <p className="hero-subtitle">{hero.subtitle}</p>

        <div className="hero-logos">
          <img src="/images/logos/clutch.svg" alt="Clutch" />
          <img src="/images/logos/designrush.svg" alt="DesignRush" />
          <img src="/images/logos/awwwards.svg" alt="Awwwards" />
          <img src="/images/logos/google-review.svg" alt="Google" />
        </div>
      </div>

      <button className="cta-button">{hero.cta}</button>

      {isActive && animationProgress > 0.95 && (
        <div className="scroll-indicator">
          <span>Scroll to continue</span>
          <div className="scroll-arrow" />
        </div>
      )}
    </section>
  );
}

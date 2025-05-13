"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useContent } from "@/context/ContentContext";
import { usePathname } from "next/navigation";
import { useTransition } from "@/components/PageWrapper/PageWrapper";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import "./Carousel.css";

gsap.registerPlugin(CustomEase);
const ease = CustomEase.create("cubic", ".87,0,.13,1");

/* ------------------------------------------------------------------ */
/*  1. TRANSIZIONE SLIDE (nessun altro file!)                          */
/* ------------------------------------------------------------------ */
function crossFadeSlide(currentEl, nextEl, direction, onDone) {
    const curBg = currentEl.querySelector(".carousel-image");
    const nxtBg = nextEl.querySelector(".carousel-image");
    const curTxt = currentEl.querySelectorAll(".carousel-text > *");
    const nxtTxt = nextEl.querySelectorAll(".carousel-text > *");

    // timeline
    const tl = gsap.timeline({ onComplete: onDone });

    // zoom leggero sul bg corrente
    tl.to(curBg.querySelector("img"), { scale: 1.2, duration: 1.25, ease }, 0);

    // apre clip‑path del nuovo bg
    tl.to(
        nxtBg,
        {
            clipPath:
                direction === "down"
                    ? "polygon(0% 100%,100% 100%,100% 0%,0% 0%)"
                    : "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
            duration: 1.25,
            ease,
        },
        0
    );

    // testo corrente out
    tl.to(curTxt, { y: direction === "down" ? -40 : 40, opacity: 0, duration: 0.8, ease }, 0);

    // testo nuovo in
    tl.fromTo(
        nxtTxt,
        { y: direction === "down" ? 40 : -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease, stagger: 0.04 },
        0.25
    );
}

/* ------------------------------------------------------------------ */
/*  2. COMPONENTE CAROUSEL                                            */
/* ------------------------------------------------------------------ */

export default function Carousel() {
    /* ---------- stato & refs --------------------------------------- */
    const { home } = useContent();
    const items = home?.carousel || [];
    const pathname = usePathname();
    const { isTransitioning } = useTransition();

    const containerRef = useRef(null);
    const [idx, setIdx] = useState(0);        // slide corrente
    const [busy, setBusy] = useState(false);    // blocco animazioni
    const [done, setDone] = useState(false);    // completato N slide
    const [active, setActive] = useState(false); // sezione attiva (PinSection)

    const TOTAL_SLIDES_TO_SHOW = 3;

    /* ---------- helpers ------------------------------------------- */
    const makeSlide = useCallback((item, dir = null) => {
        const slide = document.createElement("div");
        slide.className = "carousel-panel";

        const bgWrap = document.createElement("div");
        bgWrap.className = "carousel-image";
        bgWrap.innerHTML = `<img src="${item.bg}" alt="${item.title}" />`;

        const txtWrap = document.createElement("div");
        txtWrap.className = "carousel-text";
        txtWrap.innerHTML = `
      <div class="carousel-expertise">Our Expertise</div>
      <div class="carousel-index">${item.index}</div>
      <h2  class="carousel-title">${item.title}</h2>
      <p   class="carousel-sub">${item.subtitle}</p>
      <p   class="carousel-desc">${item.description}</p>`;

        // clip‑path iniziale
        if (dir === "down") {
            bgWrap.style.clipPath = "polygon(0% 100%,100% 100%,100% 100%,0% 100%)";
        } else if (dir === "up") {
            bgWrap.style.clipPath = "polygon(0% 0%,100% 0%,100% 0%,0% 0%)";
        }

        slide.appendChild(bgWrap);
        slide.appendChild(txtWrap);
        return slide;
    }, []);

    const mountFirstSlide = useCallback(() => {
        const c = containerRef.current;
        if (!c || !items.length) return;
        c.innerHTML = "";
        c.appendChild(makeSlide(items[0]));
        setIdx(0);
        setBusy(false);
        setDone(false);
    }, [items, makeSlide]);

    /* ---------- scroll/gesture handler ---------------------------- */
    const lastScroll = useRef(0);
    const onWheel = useCallback(
        (e) => {
            if (!active) return;
            const now = Date.now();
            if (busy || now - lastScroll.current < 800) return;
            lastScroll.current = now;

            const dir = e.deltaY > 0 ? "down" : "up";
            const nextI = dir === "down" ? idx + 1 : idx - 1;

            // fuori range => lascia scorrere pagina
            if (nextI < 0 || nextI >= items.length) {
                window.dispatchEvent(
                    new CustomEvent("sectionComplete", {
                        detail: { id: "carousel", direction: dir },
                    })
                );
                return;
            }

            playTransition(dir, nextI);
        },
        [idx, active, busy, items.length]
    );

    /* ---------- transizione --------------------------------------- */
    const playTransition = (dir, nextIndex) => {
        if (!containerRef.current) return;
        setBusy(true);

        const curSlide = containerRef.current.querySelector(".carousel-panel");
        const nextSlide = makeSlide(items[nextIndex], dir);
        containerRef.current.appendChild(nextSlide);

        crossFadeSlide(curSlide, nextSlide, dir, () => {
            curSlide.remove();
            setIdx(nextIndex);
            setBusy(false);
            if (nextIndex >= TOTAL_SLIDES_TO_SHOW - 1) setDone(true);
        });
    };

    /* ---------- effetti ------------------------------------------- */
    // primo montaggio & route change
    useEffect(() => mountFirstSlide(), [mountFirstSlide, pathname, isTransitioning]);

    // wheel listener
    useEffect(() => {
        const c = containerRef.current;
        if (!c) return;
        c.addEventListener("wheel", onWheel, { passive: false });
        return () => c.removeEventListener("wheel", onWheel);
    }, [onWheel]);

    // evento da PinSection
    useEffect(() => {
        const handler = (e) => {
            if (e.detail.id !== "carousel") return;
            setActive(true);
            if (e.detail.reset) mountFirstSlide();
        };
        window.addEventListener("sectionActivated", handler);
        return () => window.removeEventListener("sectionActivated", handler);
    }, [mountFirstSlide]);

    /* ---------- render -------------------------------------------- */
    if (!items.length) return null;

    return (
        <section
            className={`carousel-section ${active ? "active" : ""}`}
            ref={containerRef}
            data-section-id="carousel"
        >
            {active && done && (
                <div className="carousel-indicator">
                    <span>Scroll to continue</span>
                    <div className="carousel-arrow" />
                </div>
            )}
        </section>
    );
}

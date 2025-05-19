// src/components/Providers.jsx
"use client";

import { ContentProvider } from "../context/ContentContext";
import { ReactLenis } from "lenis/react";
import Navbar from "../components/Navbar/Navbar";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function Providers({ children }) {
  const lenisRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !lenisRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    // nodo che Lenis controlla
    const appScroller =
      document.querySelector(".app") || lenisRef.current.rootElement;
    if (!appScroller) return; // sicurezza

    // esponi Lenis globalmente
    window.lenis = lenisRef.current;

    // proxy GSAP ⇄ Lenis
    ScrollTrigger.scrollerProxy(appScroller, {
      scrollTop(v) {
        return arguments.length
          ? window.lenis.scrollTo(v, { immediate: true })
          : window.lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: innerWidth, height: innerHeight };
      },
      pinType: appScroller.style?.transform ? "transform" : "fixed",
    });

    // aggiorna GSAP ad ogni tick di Lenis (se on/off esistono)
    window.lenis?.on?.("scroll", ScrollTrigger.update);

    // defaults per tutti i trigger
    ScrollTrigger.defaults({ scroller: appScroller, markers: false });

    return () => {
      window.lenis?.off?.("scroll", ScrollTrigger.update);
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <ContentProvider>
      <ReactLenis
        ref={lenisRef}
        root
        className="app"
        options={{
          duration: 1.5,
          easing: t => 1 - Math.pow(2, -10 * t),
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 1.5,
        }}
      >
        <Navbar />
        {children}
      </ReactLenis>
    </ContentProvider>
  );
}

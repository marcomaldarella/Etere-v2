"use client";
import { useRef, useLayoutEffect, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";

import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import Carousel from "../../components/Carousel/Carousel";
import FinalHero from "../../components/FinalHero/FinalHero";
import Footer from "../../components/Footer/Footer";
import ProjectsSlider from "../../components/ProjectsSlider/ProjectsSlider";
import { useContent } from "../../context/ContentContext";
import { usePageTransition } from "../../hooks/usePageTransition";
import "./home.css";
import PinSection from "../../components/PinSection/PinSection";

// Only register the plugin on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePageWrapper() {
  const pathname = usePathname();
  const pageKey = usePageTransition();

  return <Home key={pageKey} pathname={pathname} />;
}

function Home({ pathname }) {
  const containerRef = useRef(null);
  const lenis = useLenis();
  const { home } = useContent();

  // Reset scroll position when path changes
  useEffect(() => {
    if (!lenis) return;

    // Reset scroll position with a slight delay to ensure DOM updates
    const timer = setTimeout(() => {
      lenis.scrollTo(0, { immediate: true, force: true });
    }, 50);

    return () => clearTimeout(timer);
  }, [lenis, pathname]);

  // Set up ScrollTrigger integration
  useLayoutEffect(() => {
    if (!lenis || !containerRef.current || typeof window === "undefined") return;

    // Create a GSAP context for better cleanup
    const ctx = gsap.context(() => {
      // Force refresh to ensure proper positioning
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 200);
    }, containerRef);

    // Clean up when component unmounts
    return () => {
      ctx.revert(); // This handles basic GSAP cleanup
    };
  }, [lenis]);

  // Attiva il Carousel come nel debug
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sectionActivated", {
        detail: { id: "carousel", reset: true },
      })
    );
  }, []);

  return (
    <div className="app" ref={containerRef}>
      <Hero key={`hero-${pathname}`} />
      <Services />
      <ProjectsSlider />
      <Carousel key={`carousel-${pathname}`} />
      <FinalHero />
      <Footer />
    </div>
  );
}

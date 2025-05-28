"use client";

import { useEffect, useRef } from "react";
import Link from "next/link"; // Potrebbe non essere più necessario se non usato altrove
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import Marquee from "../components/Marquee/Marquee"; // Potrebbe non essere più necessario
import Footer from "../components/Footer/Footer"; // Potrebbe non essere più necessario
import ShuffleText from "../components/ShuffleText/ShuffleText"; // Potrebbe non essere più necessario
import Hero from "../components/Hero/Hero";
import Services from "../components/Services/Services";
import FinalHero from "../components/FinalHero/FinalHero";
import { useContent } from "../context/ContentContext";
import StickyCards from "../components/StickyCards/StickyCards";
import ProjectCards from "../components/ProjectCards/ProjectCards";

import "./home.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef();
  const { projects } = useContent(); // `projects` non viene più usato direttamente in questo JSX, potresti volerlo rimuovere se non è usato da altri componenti figli.

  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      window.lenis = lenis;
    }

    return () => {
      window.lenis = null;
    };
  }, [lenis]);

  useEffect(() => {
    if (window.ScrollTrigger) {
      setTimeout(() => {
        window.ScrollTrigger.refresh(true);
      }, 100);
    }
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      }}
    >
      <div className="app" ref={container}>
        <Hero />
        <Services />

        <ProjectCards />

        {/* <div className="verticals-header"> // Rimosso questo blocco
          <div className="container">
            <ShuffleText
              as="h2"
              text="Our Expertise"
              triggerOnScroll={true}
            />
          </div>
        </div> */}

        {/* carousel rimosso (già commentato/rimosso in precedenza) */}

        <StickyCards />
        <FinalHero />
      </div>
    </ReactLenis>
  );
}
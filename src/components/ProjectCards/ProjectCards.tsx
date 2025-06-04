"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import Image from "next/image";
import Link from "next/link"; // Assicurati che Link sia importato
import "./ProjectCards.css"; // Assicurati che questo path sia corretto per il tuo file CSS rinominato

gsap.registerPlugin(ScrollTrigger, SplitText);

const CARDS = [
  {
    id: "investment-management-app",
    title: "Fintech",
    subtitle: "Bestinver",
    description:
      "Crafting secure, user-centric financial solutions for portfolio tracking.",
    bg: "/images/home/case-study-12.jpg",
    categories: ["Fintech", "Data Visualization"],
    link: "/projects/investment-management-app",
  },
  {
    id: "iot-healthcare-app",
    title: "Healthcare",
    subtitle: "Harvard Lab",
    description:
      "Building intuitive, data-driven health platforms for real-time biosignal tracking.",
    bg: "/images/home/case-study-6.jpg",
    categories: ["Healthcare", "IoT", "Wearables"],
    link: "/projects/iot-healthcare-app",
  },
  {
    id: "vehicle-rental-portal",
    title: "Logistics",
    subtitle: "Iveco",
    description:
      "Optimizing end-to-end operations with a distributed platform for vehicle rentals and telematics.",
    bg: "/images/home/case-study-7.jpg",
    categories: ["Logistics", "Fleet Management", "IoT"],
    link: "/projects/vehicle-rental-portal",
  },
  {
    id: "sportsbook-and-casino-app",
    title: "Betting",
    subtitle: "SportServe",
    description:
      "Deploying scalable white-label betting solutions from model to production.",
    bg: "/images/home/case-study-9.jpg",
    categories: ["Betting", "Entertainment"],
    link: "/projects/sportsbook-and-casino-app",
  },
];

export default function ProjectCards() {
  const scope = useRef(null);
  const ctaRef = useRef(null); // Ref per la nuova CTA

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".sticky-card", scope.current);
      const introCard = cards[0]; // La prima card

      const titles = gsap.utils.toArray(".sticky-card-title h1", scope.current);
      titles.forEach((title) => {
        const split = new SplitText(title, {
          type: "chars",
          charsClass: "sticky-char",
          tag: "div",
        });
        split.chars.forEach((char) => {
          char.innerHTML = `<span>${char.textContent}</span>`;
        });
      });

      function animateContentIn(titleChars, description) {
        gsap.to(titleChars, { y: "0%", duration: 0.75, ease: "power4.out" });
        gsap.to(description, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          delay: 0.1,
          ease: "power4.out",
        });
      }

      function animateContentOut(titleChars, description) {
        gsap.to(titleChars, { y: "100%", duration: 0.5, ease: "power4.out" });
        gsap.to(description, {
          y: "40px",
          opacity: 0,
          duration: 0.5,
          ease: "power4.out",
        });
      }

      const titleChars = introCard.querySelectorAll(".sticky-char span");
      const description = introCard.querySelector(".sticky-card-description");

      // Nuovo ScrollTrigger per gestire solo l'animazione del testo della prima card
      ScrollTrigger.create({
        trigger: introCard,
        start: "top top",
        end: "top top+=100",
        onEnter: () => {
          if (!introCard.contentRevealed) {
            introCard.contentRevealed = true;
            animateContentIn(titleChars, description);
          }
        },
        onLeaveBack: () => {
          if (introCard.contentRevealed) {
            introCard.contentRevealed = false;
            animateContentOut(titleChars, description);
          }
        },
      });

      // Animazione di pinning per tutte le card
      cards.forEach((card, index) => {
        const isLastCard = index === cards.length - 1;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          end: "top top",
          endTrigger: isLastCard ? null : cards[cards.length - 1],
          pin: true,
          pinSpacing: false,
        });
      });

      // Animazione di scaling e fade out per le card che passano dietro
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          // Per tutte le card tranne l'ultima
          const cardWrapper = card.querySelector(".sticky-card-wrapper");
          ScrollTrigger.create({
            trigger: cards[index + 1], // Si attiva quando la card successiva entra
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(cardWrapper, {
                scale: 1 - progress * 0.25,
                opacity: 1 - progress,
              });
            },
          });
        }
      });

      // Animazione di ingrandimento dell'immagine e modifica del bordo per le card successive alla prima
      cards.forEach((card, index) => {
        if (index > 0) {
          // Applica questa animazione solo dalla seconda card in poi
          const cardImg = card.querySelector(".sticky-card-img img");
          const imgContainer = card.querySelector(".sticky-card-img");
          ScrollTrigger.create({
            trigger: card,
            start: "top bottom",
            end: "top top",
            onUpdate: (self) => {
              const progress = self.progress;
              gsap.set(cardImg, { scale: 2 - progress });
              gsap.set(imgContainer, {
                borderRadius: 150 - progress * 125 + "px",
              });
            },
          });
        }
      });

      // Animazione di entrata/uscita del testo per le card successive alla prima
      cards.forEach((card, index) => {
        if (index === 0) return;

        const cardDescription = card.querySelector(".sticky-card-description");
        const cardTitleChars = card.querySelectorAll(".sticky-char span");

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          onEnter: () => animateContentIn(cardTitleChars, cardDescription),
          onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription),
        });
      });

      // ****** NUOVA ANIMAZIONE PER LA CTA "VIEW ALL PROJECTS" ******
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 50, scale: 0.8 }); // Stato iniziale nascosto

        ScrollTrigger.create({
          trigger: cards[cards.length - 1], // Trigger sull'ultima card
          start: "bottom center", // Quando la fine dell'ultima card è al centro della viewport
          // end: "bottom top", // Fine dell'animazione (puoi regolare)
          toggleActions: "play none none reverse", // Play all'entrata, reverse all'uscita
          animation: gsap.to(ctaRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)", // Stesso easing della CTA della Hero.tsx per coerenza
          }),
        });
      }
      // ************************************************************

      ScrollTrigger.refresh();
    }, scope);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <section ref={scope}>
      <div className="intro-project-cards">
        <h1>Success Stories</h1>
      </div>

      <div className="cards">
        {CARDS.map((card, index) => (
          <Link href={card.link} className="sticky-card" key={card.id}>
            <div className="sticky-card-wrapper">
              <div className="sticky-card-img">
                <Image
                  src={card.bg || "/placeholder.svg"}
                  alt={card.title}
                  fill
                  priority={index === 0}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="sticky-card-content">
                <div className="sticky-card-title">
                  <h1>{card.title}</h1>
                </div>
                <div className="sticky-card-description">
                  <p className="sticky-card-subtitle">{card.subtitle}</p>
                  <p>{card.description}</p>
                  {card.categories && (
                    <div className="sticky-project-tags">
                      {card.categories.map((cat) => (
                        <span key={cat} className="sticky-project-tag">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ****** NUOVA CTA "VIEW ALL PROJECTS" ****** */}
      <div className="cta-all-projects-wrapper">
        {" "}
        {/* Wrapper per il centraggio e padding */}
        <Link href="/projects" className="cta-all-projects-link">
          <button ref={ctaRef} className="cta-all-projects-button">
            View All Projects
          </button>
        </Link>
      </div>
    </section>
  );
}

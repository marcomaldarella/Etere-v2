"use client";

import { useRef } from "react";
import { useContent } from "@/context/ContentContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProjectsSlider.css";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSlider() {
    const { projects } = useContent();
    const cards = (projects || []).slice(0, 5); // max 5 cards
    const container = useRef(null);

    useGSAP(() => {
        if (!cards.length) return;
        const cardEls = container.current.querySelectorAll(".card");
        const imgEls = container.current.querySelectorAll(".card img");
        const totalCards = cardEls.length;

        gsap.set(cardEls[0], { y: "0%", scale: 1, rotation: 0 });
        gsap.set(imgEls[0], { scale: 1 });
        for (let i = 1; i < totalCards; i++) {
            gsap.set(cardEls[i], { y: "100%", scale: 1, rotation: 0 });
            gsap.set(imgEls[i], { scale: 1 });
        }

        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".sticky-cards",
                start: "top top",
                end: `+=${window.innerHeight * (totalCards - 1)}`,
                pin: true,
                scrub: 0.5,
            },
        });

        for (let i = 0; i < totalCards - 1; i++) {
            const currentCard = cardEls[i];
            const currentImage = imgEls[i];
            const nextCard = cardEls[i + 1];
            const position = i;
            scrollTimeline.to(
                currentCard,
                { scale: 0.5, rotation: 10, duration: 1, ease: "none" },
                position
            );
            scrollTimeline.to(
                currentImage,
                { scale: 1.5, duration: 1, ease: "none" },
                position
            );
            scrollTimeline.to(
                nextCard,
                { y: "0%", duration: 1, ease: "none" },
                position
            );
        }

        return () => {
            scrollTimeline.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, { scope: container });

    if (!cards.length) return null;

    return (
        <section className="sticky-cards" style={{ background: "#000", fontFamily: "Geist, sans-serif", minHeight: "100vh" }}>
            <div className="cards-container" ref={container}>
                {cards.map((proj, i) => (
                    <div className="card" key={proj.id} style={{ borderRadius: 16, overflow: "hidden", position: "absolute", width: "60vw", left: "20vw", top: 0, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
                        <div className="tag" style={{ position: "absolute", top: 16, left: 16, background: "#111", color: "#fff", borderRadius: 6, padding: "4px 12px", fontSize: 14, fontFamily: "Geist, monospace", zIndex: 2, letterSpacing: 1 }}>
                            <p style={{ margin: 0 }}>{proj.tag || proj.title}</p>
                        </div>
                        <img src={proj.cover} alt={proj.title} style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }} />
                    </div>
                ))}
            </div>
        </section>
    );
}

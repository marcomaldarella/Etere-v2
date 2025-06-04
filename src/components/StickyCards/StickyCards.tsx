"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"
import Image from "next/image"
import "./StickyCards.css"

gsap.registerPlugin(ScrollTrigger, SplitText)

const CARDS = [
    {
        id: "fintech",
        title: "Fintech",
        subtitle: "Shaping seamless digital transactions",
        description: "Crafting secure, user-centric financial solutions.",
        bg: "/images/carousel/carousel1.jpg",
    },
    {
        id: "healthcare",
        title: "Healthcare",
        subtitle: "Empowering modern patient care",
        description: "Building intuitive, data-driven health platforms.",
        bg: "/images/carousel/carousel2.jpg",
    },
    {
        id: "logistics",
        title: "Logistics",
        subtitle: "Optimizing end-to-end operations",
        description: "Streamlining supply-chains with intelligent tools.",
        bg: "/images/carousel/carousel3.jpg",
    },
    {
        id: "betting", // Nuovo ID coerente
        title: "Betting",
        subtitle: "Building dynamic platforms for sports and casino", // Sottotitolo adattato al settore betting
        description: "Developing robust and engaging solutions for online sportsbooks and casinos.", // Descrizione per il betting
        bg: "/images/carousel/carousel4.jpg", // Immagine suggerita (o usa la tua)
    },

]

export default function StickyCards() {
    const scope = useRef(null)

    useEffect(() => {
        const lenis = new Lenis()
        lenis.on("scroll", ScrollTrigger.update)
        gsap.ticker.add((time) => lenis.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".card", scope.current)
            const introCard = cards[0]

            // SplitText setup for all titles
            const titles = gsap.utils.toArray(".card-title h1", scope.current)
            titles.forEach((title) => {
                const split = new SplitText(title, {
                    type: "chars",
                    charsClass: "char",
                    tag: "div",
                })
                split.chars.forEach((char) => {
                    char.innerHTML = `<span>${char.textContent}</span>`
                })
            })

            // Initial setup for intro card
            const cardImgWrapper = introCard.querySelector(".card-img")
            const cardImg = introCard.querySelector(".card-img img")
            gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px" })
            gsap.set(cardImg, { scale: 1.5 })

            function animateContentIn(titleChars, description) {
                gsap.to(titleChars, { x: "0%", duration: 0.75, ease: "power4.out" })
                gsap.to(description, {
                    x: 0,
                    opacity: 1,
                    duration: 0.75,
                    delay: 0.1,
                    ease: "power4.out",
                })
            }

            function animateContentOut(titleChars, description) {
                gsap.to(titleChars, { x: "100%", duration: 0.5, ease: "power4.out" })
                gsap.to(description, {
                    x: "40px",
                    opacity: 0,
                    duration: 0.5,
                    ease: "power4.out",
                })
            }

            const titleChars = introCard.querySelectorAll(".char span")
            const description = introCard.querySelector(".card-description")

            // Main intro card scroll animation
            ScrollTrigger.create({
                trigger: introCard,
                start: "top top",
                end: "+=300vh",
                onUpdate: (self) => {
                    const progress = self.progress
                    const imgScale = 0.5 + progress * 0.5
                    const borderRadius = 400 - progress * 375
                    const innerImgScale = 1.5 - progress * 0.5

                    gsap.set(cardImgWrapper, {
                        scale: imgScale,
                        borderRadius: borderRadius + "px",
                    })
                    gsap.set(cardImg, { scale: innerImgScale })

                    if (progress >= 1 && !introCard.contentRevealed) {
                        introCard.contentRevealed = true
                        animateContentIn(titleChars, description)
                    }
                    if (progress < 1 && introCard.contentRevealed) {
                        introCard.contentRevealed = false
                        animateContentOut(titleChars, description)
                    }
                },
            })

            // Pin all cards
            cards.forEach((card, index) => {
                const isLastCard = index === cards.length - 1
                ScrollTrigger.create({
                    trigger: card,
                    start: "top top",
                    end: "top top",
                    endTrigger: isLastCard ? null : cards[cards.length - 1],
                    pin: true,
                    pinSpacing: false,    // tutte false, nessuna aggiunge spazio extra
                })
            })

            // Scale and fade out effect for stacked cards
            cards.forEach((card, index) => {
                if (index < cards.length - 1) {
                    const cardWrapper = card.querySelector(".card-wrapper")
                    ScrollTrigger.create({
                        trigger: cards[index + 1],
                        start: "top bottom",
                        end: "top top",
                        onUpdate: (self) => {
                            const progress = self.progress
                            gsap.set(cardWrapper, {
                                scale: 1 - progress * 0.25,
                                opacity: 1 - progress,
                            })
                        },
                    })
                }
            })

            // Image scale and border radius animation for non-intro cards
            cards.forEach((card, index) => {
                if (index > 0) {
                    const cardImg = card.querySelector(".card-img img")
                    const imgContainer = card.querySelector(".card-img")
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top bottom",
                        end: "top top",
                        onUpdate: (self) => {
                            const progress = self.progress
                            gsap.set(cardImg, { scale: 2 - progress })
                            gsap.set(imgContainer, { borderRadius: 150 - progress * 125 + "px" })
                        },
                    })
                }
            })

            // Content animation for non-intro cards
            cards.forEach((card, index) => {
                if (index === 0) return

                const cardDescription = card.querySelector(".card-description")
                const cardTitleChars = card.querySelectorAll(".char span")

                ScrollTrigger.create({
                    trigger: card,
                    start: "top top",
                    onEnter: () => animateContentIn(cardTitleChars, cardDescription),
                    onLeaveBack: () => animateContentOut(cardTitleChars, cardDescription),
                })
            })

            ScrollTrigger.refresh()
        }, scope)

        return () => {
            ctx.revert()
            lenis.destroy()
        }
    }, [])

    return (
        <section ref={scope}>
            <div className="intro">
                <h1>From vision to execution our expertise drives results across key industries.</h1>
            </div>

            <div className="cards">
                {CARDS.map((card, index) => (
                    <div className="card" key={card.id}>
                        <div className="card-wrapper">
                            <div className="card-img">
                                <Image
                                    src={card.bg || "/placeholder.svg"}
                                    alt={card.title}
                                    fill
                                    priority={index === 0}
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="card-content">
                                <div className="card-title">
                                    <h1>{card.title}</h1>
                                </div>
                                <div className="card-description">
                                    <p>{card.subtitle}</p>
                                    <p>{card.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

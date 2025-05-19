"use client";

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./about.module.css"
import Footer from "../../components/Footer/Footer";
import FinalHero from "../../components/FinalHero/FinalHero";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

const stats = [
    { icon: "📱", value: 10, suffix: "+", label: "Years in Software Development" },
    { icon: "🚀", value: 50, suffix: "+", label: "Skilled IT Professionals" },
    { icon: "🌎", value: 7, suffix: "", label: "Countries where we served clients" },
]

const team = [
    {
        name: "Pierluigi Raffone",
        role: "CEO",
        image: "/images/team/team-3.jpg",
        background: ["Tech Lead in 4+ Start-Ups and Agencies"],
        education: [
            "Researcher - University of California, Berkeley",
            "Master in Electronic Engineering - Politecnico di Milano",
        ],
    },
    {
        name: "Andrea Sanvido",
        role: "Business Development",
        image: "/images/team/team-1.jpg",
        background: ["Product Strategy - Revolut"],
        education: ["Master in Finance - ESCP"],
    },
    {
        name: "Giuseppe Maiarù",
        role: "CTO",
        image: "/images/team/team-2.jpg",
        background: ["Tech Lead"],
        education: [],
    },
]

function AnimatedCounter({ value, suffix }) {
    const counterRef = useRef(null)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (typeof window === "undefined") return

        const el = counterRef.current
        if (!el) return

        const animate = () => {
            const obj = { val: 0 }
            gsap.to(obj, {
                val: value,
                duration: 2.5,
                ease: "power2.out",
                onUpdate() {
                    setCount(Math.floor(obj.val))
                },
            })
        }

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 80%",
            once: true,
            onEnter: animate,
        })

        return () => {
            trigger.kill()
        }
    }, [value])

    return (
        <div ref={counterRef} className={styles.counterValue}>
            <span className={styles.animatedDigit}>{count}</span>
            <span className={styles.counterSuffix}>{suffix}</span>
        </div>
    )
}

function AnimatedElement({ children, delay = 0, yOffset = 30, className = "" }) {
    const ref = useRef(null)

    useEffect(() => {
        if (typeof window === "undefined") return

        const el = ref.current
        if (!el) return

        gsap.set(el, { y: yOffset, opacity: 0 })

        const anim = gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: delay / 1000,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true,
            },


        })

        setTimeout(() => {
            ScrollTrigger.refresh()
        }, 100)

        return () => {
            if (anim.scrollTrigger) {
                anim.scrollTrigger.kill()
            }
        }
    }, [delay, yOffset])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}

export default function AboutPage() {
    const statsRef = useRef(null)
    const teamRef = useRef(null)
    const statCardsRef = useRef([])
    const teamCardsRef = useRef([])

    useEffect(() => {
        if (typeof window === "undefined") return

        gsap.registerPlugin(ScrollTrigger)

        if (window.lenis) {
            window.lenis.on("scroll", ScrollTrigger.update)
        }

        return () => {
            if (window.lenis) {
                window.lenis.off("scroll", ScrollTrigger.update)
            }

            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.id?.startsWith("about-")) {
                    trigger.kill()
                }
            })
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined" || !statsRef.current) return

        const statCards = statsRef.current.querySelectorAll(`.${styles.statCard}`)

        statCards.forEach((card, index) => {
            statCardsRef.current[index] = card

            gsap.set(card, { y: 40, opacity: 0 })

            gsap.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    id: `about-stat-${index}`,
                    trigger: card,
                    start: "top 1%",
                },
            })
        })
    }, [])

    useEffect(() => {
        if (typeof window === "undefined" || !teamRef.current) return

        const teamCards = teamRef.current.querySelectorAll(`.${styles.teamCard}`)

        teamCards.forEach((card, index) => {
            teamCardsRef.current[index] = card

            gsap.set(card, { y: 40, opacity: 0 })

            gsap.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    id: `about-team-${index}`,
                    trigger: card,
                    start: "top 85%",
                    once: true,
                },
            })
        })
    }, [])

    return (
        <main className={styles.aboutPage}>
            <section className={styles.heroSection}>
                <div className={styles.gridContainer}>
                    <div className={styles.gridCol8}>
                        <AnimatedElement className={styles.heroHeadline}>
                            We master Flutter architectures for custom products and great experience across mobile, web and embedded systems.
                        </AnimatedElement>
                    </div>
                    <div className={styles.gridSpacer} />
                    <div className={`${styles.gridCol4} ${styles.descriptionWider}`}>
                        <AnimatedElement delay={300} className={styles.companyDescription}>
                            etere studio, a miami-based agency born in 2021, is a partnership of high-caliber developers and designers. we work with a global footprint, with offices in us, middle east and europe.
                            <br /><br />
                            Our work exists behind the digital foundations of some of the world’s most respected brands, where complexity transforms into seamless solutions. Trust is built through precision, adaptability, and results that speak louder than names.
                        </AnimatedElement>
                    </div>
                </div>
            </section>

            <section className={styles.statsSection} ref={statsRef}>
                <div className={styles.gridContainer}>
                    {stats.map((stat, index) => (
                        <div className={styles.gridCol4} key={index}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>{stat.icon}</div>
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.aboutTeam} ref={teamRef} style={{ background: 'linear-gradient(to bottom, #fff 0%, #f0f0f0 50%, #fff 100%)' }}>
                <div className={styles.gridContainer}>
                    <div className={styles.gridCol12}>
                        <AnimatedElement className={styles.sectionTitle}>Meet the Team</AnimatedElement>
                    </div>

                    {team.map((member, index) => (
                        <div className={styles.gridCol4} key={index}>
                            <div className={styles.teamCard}>
                                <div className={styles.teamPhotoWrapper}>
                                    <img src={member.image || "/placeholder.svg"} alt={member.name} className={styles.teamPhoto} />
                                </div>
                                <div className={styles.teamInfo}>
                                    <h3 className={styles.teamName}>{member.name}</h3>
                                    <p className={styles.teamRole}>{member.role}</p>

                                    <div className={styles.teamSection}>
                                        <strong>Professional Background:</strong>
                                        <div>{member.background.map((item, i) => (<div key={i}>{item}</div>))}</div>
                                    </div>

                                    {member.education.length > 0 && (
                                        <div className={styles.teamSection}>
                                            <strong>Education Background:</strong>
                                            <div>{member.education.map((item, i) => (<div key={i}>{item}</div>))}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <FinalHero></FinalHero>
            <Footer />
        </main>
    )
}

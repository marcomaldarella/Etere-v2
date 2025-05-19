"use client"

import Image from "next/image"
import { useContent } from "../../context/ContentContext"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import "./projects.css"
import FinalHero from "../../components/FinalHero/FinalHero"
import LinkWithScrollReset from "../../components/LinkWithScrollReset"
import Footer from "../../components/Footer/Footer"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

export default function ProjectsListPage() {
    const { projects } = useContent()
    const pathname = usePathname()
    const containerRef = useRef(null)
    const gsapCtx = useRef(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            // 1️⃣ assicurati che ScrollTrigger parli con Lenis (.app)
            gsap.registerPlugin(ScrollTrigger)
            ScrollTrigger.defaults({
                scroller: document.querySelector(".app"),
            })

            // 2️⃣ azzera qualunque trigger rimasto (niente pin “fantasma”)
            ScrollTrigger.getAll().forEach(t => t.kill())
            ScrollTrigger.refresh()
        }

        // 3️⃣ se c’era un vecchio contesto GSAP di questa pagina, lo ripristiniamo
        gsapCtx.current?.revert()

        // 4️⃣ creiamo il nuovo contesto (fade-in + slide delle card)
        if (containerRef.current) {
            gsapCtx.current = gsap.context(() => {
                gsap.fromTo(
                    ".project-card",
                    { y: 30, scale: 0.98, autoAlpha: 0 },
                    {
                        y: 0,
                        scale: 1,
                        autoAlpha: 1,
                        stagger: 0.05,
                        duration: 0.8,
                        ease: "power2.out",
                        clearProps: "all",
                    }
                )
            }, containerRef)
        }

        return () => {
            // pulizia al cambio pagina
            gsapCtx.current?.revert()
            if (typeof window !== "undefined") {
                ScrollTrigger.getAll().forEach(t => t.kill())
                ScrollTrigger.refresh()
            }
        }
    }, [pathname])

    if (!projects?.length) {
        return (
            <div className="projects-container">
                <div className="projects-grid"><p>No projects found.</p></div>
            </div>
        )
    }

    return (
        <>
            <div className="projects-container" ref={containerRef}>
                <div className="projects-grid">
                    {projects.map(project => (
                        <LinkWithScrollReset
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="project-card"
                        >
                            <div className="project-info">
                                <div className="project-image">
                                    <Image
                                        src={project.cover || "/placeholder.svg"}
                                        alt={project.title}
                                        width={800}
                                        height={600}
                                        priority
                                        loading="eager"
                                        style={{ objectFit: "cover", width: "100%", height: "auto", aspectRatio: "1/1" }}
                                    />
                                </div>
                                <h2 className="project-title">{project.title}</h2>
                                {project.categories && (
                                    <div className="project-tags">
                                        {project.categories.map(cat => (
                                            <span key={cat} className="project-tag">{cat}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </LinkWithScrollReset>
                    ))}
                </div>
            </div>
            <FinalHero></FinalHero>
            <Footer />
        </>
    )
}

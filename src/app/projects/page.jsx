"use client"

import Image from "next/image"
import { useContent } from "../../context/ContentContext"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import "./projects.css"
import LinkWithScrollReset from "../../components/LinkWithScrollReset"
import Footer from "../../components/Footer/Footer"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

export default function ProjectsListPage() {
    const { projects } = useContent()
    const pathname = usePathname()
    const projectsRef = useRef(null)
    const gsapContextRef = useRef(null)

    // Initialize GSAP and handle scroll behavior
    useEffect(() => {
        // Register ScrollTrigger
        if (typeof window !== "undefined") {
            gsap.registerPlugin(ScrollTrigger)
        }

        // Clean up previous animations
        if (gsapContextRef.current) {
            gsapContextRef.current.revert()
        }

        // Ensure smooth scrolling is properly initialized
        if (typeof window !== "undefined" && window.lenis) {
            // Stop any ongoing scroll animations
            window.lenis.stop()

            // Reset scroll position without animation
            window.scrollTo(0, 0)

            // Resume smooth scrolling with a small delay
            setTimeout(() => {
                if (window.lenis) {
                    window.lenis.start()
                    window.lenis.resize()
                }
            }, 50)
        }

        // Create a new GSAP context
        if (projectsRef.current) {
            gsapContextRef.current = gsap.context(() => {
                // Stagger animation for project cards
                gsap.fromTo(
                    ".project-card",
                    {
                        y: 30,
                        opacity: 0,
                        scale: 0.98,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        stagger: 0.05,
                        duration: 0.8,
                        ease: "power2.out",
                        clearProps: "all",
                        onComplete: () => {
                            // Refresh ScrollTrigger after animation completes
                            ScrollTrigger.refresh()
                        },
                    },
                )
            }, projectsRef)
        }

        return () => {
            // Clean up GSAP context
            if (gsapContextRef.current) {
                gsapContextRef.current.revert()
            }

            // Clean up ScrollTrigger instances
            if (typeof window !== "undefined" && ScrollTrigger) {
                ScrollTrigger.getAll().forEach((trigger) => {
                    trigger.kill()
                })
            }
        }
    }, [pathname])

    if (!projects || !projects.length) {
        return (
            <div className="projects-container">
                <div className="projects-grid">
                    <p>No projects found.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="projects-container" ref={projectsRef}>
                <div className="projects-grid">
                    {projects.map((project) => (
                        <LinkWithScrollReset key={project.id} href={`/projects/${project.id}`} className="project-card">
                            <div className="project-info">
                                <div className="project-image">
                                    <Image
                                        src={project.cover || "/placeholder.svg"}
                                        alt={project.title}
                                        width={800}
                                        height={600}
                                        priority={true} // Add priority for images above the fold
                                        loading="eager" // Force eager loading for smoother experience
                                        style={{
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "auto",
                                            aspectRatio: "1 / 1",
                                        }}
                                    />
                                </div>
                                <h2 className="project-title">{project.title}</h2>
                                {project.categories && (
                                    <div className="project-tags">
                                        {project.categories.map((category) => (
                                            <span key={category} className="project-tag">
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </LinkWithScrollReset>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    )
}

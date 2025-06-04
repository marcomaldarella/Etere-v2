"use client"

import { useParams, useRouter, usePathname } from "next/navigation"
import { useContent } from "../../../context/ContentContext"
import { useEffect, useRef, useLayoutEffect, useMemo } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ShuffleText from "../../../components/ShuffleText/ShuffleText"
import Link from "next/link"
import Image from "next/image"
import "../../archive/archive.css"
import "./project.css"

gsap.registerPlugin(ScrollTrigger)

export default function ProjectPage() {
    const { id } = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const { projects } = useContent()
    const project = projects?.find((p) => p?.id === id)
    const containerRef = useRef(null)
    const ctxRef = useRef(null)

    // Get 3 deterministic related projects (excluding current project)
    const relatedProjects = useMemo(() => {
        if (!projects || !project) return []

        const otherProjects = projects.filter((p) => p.id !== project.id)

        // Create a deterministic "random" selection based on current project ID
        const seed = project.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

        // Sort deterministically based on the seed
        const sortedProjects = otherProjects.sort((a, b) => {
            const aHash = (a.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 1000
            const bHash = (b.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 1000
            return aHash - bHash
        })

        return sortedProjects.slice(0, 3)
    }, [projects, project])

    // Enhanced scroll to top quando si accede alla pagina progetto
    useEffect(() => {
        if (typeof window === "undefined") return

        // Multiple scroll reset attempts to ensure it works
        const resetScroll = () => {
            // Native scroll reset
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0

            // Lenis scroll reset with error handling
            try {
                if (window.lenis?.scrollTo) {
                    window.lenis.scrollTo(0, { immediate: true, force: true })
                }
            } catch (error) {
                console.warn("Lenis scroll reset failed, using native scroll")
            }

            // Direct container reset
            const scrollContainer = document.querySelector(".app")
            if (scrollContainer) {
                scrollContainer.scrollTop = 0
            }
        }

        // Reset immediately
        resetScroll()

        // Reset again after small delays to ensure DOM is ready
        const timeouts = [setTimeout(resetScroll, 50), setTimeout(resetScroll, 150)]

        return () => {
            timeouts.forEach(clearTimeout)
        }
    }, [id])

    // Setup animazioni e scrolltrigger
    useLayoutEffect(() => {
        if (!project || typeof window === "undefined") return

        ScrollTrigger.getAll().forEach((t) => t.kill())
        ScrollTrigger.defaults({ scroller: document.querySelector(".app") })

        if (window.lenis?.start) {
            window.lenis.start()
        }

        ctxRef.current?.revert()

        if (containerRef.current) {
            ctxRef.current = gsap.context(() => {
                // Animate related projects cards
                gsap.to(".related-project-card", {
                    y: 0,
                    autoAlpha: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".related-projects",
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse",
                    },
                })
            }, containerRef)
        }

        ScrollTrigger.refresh()

        // Force another scroll reset after ScrollTrigger setup
        setTimeout(() => {
            window.scrollTo(0, 0)
            if (window.lenis?.scrollTo) {
                try {
                    window.lenis.scrollTo(0, { immediate: true, force: true })
                } catch (error) {
                    // Silent fail
                }
            }
        }, 100)

        return () => {
            ctxRef.current?.revert()
            ScrollTrigger.getAll().forEach((t) => t.kill())
        }
    }, [pathname, id])

    if (!project) {
        router.push("/projects")
        return null
    }

    return (
        <div className="archive" ref={containerRef}>
            <section className="archive-hero">
                <div className="container">
                    <div className="project-hero-header">
                        <ShuffleText as="h1" text={project.title} />
                        {project.categories && (
                            <div className="project-categories">
                                {project.categories.map((cat, idx) => (
                                    <span key={idx} className="category-pill">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="archive-hero-img-wrapper">
                        <div className="archive-hero-img-wrapper-row">
                            <div className="archive-hero-img">
                                <img src={project.cover || "/placeholder.svg"} alt={project.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="project-details">
                <div className="left-col">
                    <div className="pain-solution">
                        <p className="label">Pain Point</p>
                        <p>{project.pain}</p>
                        <p className="label">Solution</p>
                        <p>{project.solution}</p>
                    </div>

                    {project.highlights?.length > 0 && (
                        <div className="highlights">
                            <p className="label">Highlights</p>
                            <ul className="highlights-list">
                                {project.highlights.map((highlight, index) => (
                                    <li className="highlight-item" key={index}>
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.images?.length > 0 && (
                        <div className="ui-extracts">
                            <p className="label">UI Extracts</p>
                            <div className="image-row">
                                {project.images.map((src, index) => (
                                    <img key={index} src={src || "/placeholder.svg"} alt={`UI ${index + 1}`} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="right-col">
                    <div className="project-info">
                        <div className="info-group">
                            <p className="label">Category</p>
                            <div className="category-tags">
                                {project.categories.map((cat, idx) => (
                                    <span key={idx} className="category-pill">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="info-group">
                            <p className="label">Client</p>
                            <p className="info-value">{project.client}</p>
                        </div>

                        <div className="info-group">
                            <p className="label">Sector</p>
                            <p className="info-value">{project.sector}</p>
                        </div>

                        <div className="info-group">
                            <p className="label">Technology</p>
                            <p className="info-value">{project.tech}</p>
                        </div>
                    </div>
                </div>
                {/* Related Projects Section */}
                {relatedProjects.length > 0 && (
                    <section className="related-projects">

                        <div className="related-projects-header">
                            <ShuffleText className="relatedTitle" as="h2" text="Related Projects" />
                        </div>
                        <div className="related-projects-grid">
                            {relatedProjects.map((relatedProject) => (
                                <Link key={relatedProject.id} href={`/projects/${relatedProject.id}`} className="related-project-card">
                                    <div className="related-project-image">
                                        <Image
                                            src={relatedProject.cover || "/placeholder.svg"}
                                            alt={relatedProject.title}
                                            width={400}
                                            height={300}
                                            style={{
                                                objectFit: "cover",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </div>
                                    <div className="related-project-info">
                                        <h3 className="related-project-title">{relatedProject.title}</h3>
                                        {relatedProject.categories && (
                                            <div className="related-project-tags">
                                                {relatedProject.categories.map((cat) => (
                                                    <span key={cat} className="related-project-tag">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </section>
                )}
            </section>



            {/* Add some spacing before footer */}
            <div style={{ height: "4rem" }} />
        </div>
    )
}

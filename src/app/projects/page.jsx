"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "../../context/ContentContext";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import "./projects.css";
import FinalHero from "../../components/FinalHero/FinalHero";
import Footer from "../../components/Footer/Footer";

export default function ProjectsListPage() {
    const { projects } = useContent();
    const pathname = usePathname();
    const wrapRef = useRef(null);
    const ctxRef = useRef(null);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.defaults({ scroller: document.querySelector(".app") });

        if (window.lenis?.start) {
            window.lenis.start();
        }

        ctxRef.current?.revert();
        ScrollTrigger.getAll().forEach(t => t.kill());

        if (wrapRef.current) {
            ctxRef.current = gsap.context(() => {
                gsap.to(".project-card", {
                    y: 0,
                    autoAlpha: 1,
                    stagger: 0.06,
                    duration: 0.6,
                    ease: "power2.out",
                    immediateRender: false,
                });
            }, wrapRef);
        }

        ScrollTrigger.refresh();

        return () => {
            ctxRef.current?.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
            ScrollTrigger.refresh();
        };
    }, [pathname]);

    if (!projects?.length) {
        return (
            <div className="projects-container">
                <div className="projects-grid">
                    <p>No projects found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="projects-container" ref={wrapRef}>
                <div className="projects-grid">
                    {projects.map((p) => (
                        <Link key={p.id} href={`/projects/${p.id}`} className="project-card">
                            <div className="project-info">
                                <div className="project-image">
                                    <Image
                                        src={p.cover || "/placeholder.svg"}
                                        alt={p.title}
                                        width={800}
                                        height={600}
                                        priority
                                        unoptimized
                                        style={{
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "auto",
                                            aspectRatio: "1/1",
                                        }}
                                    />
                                </div>
                                <h2 className="project-title">{p.title}</h2>
                                {p.categories && (
                                    <div className="project-tags">
                                        {p.categories.map((cat) => (
                                            <span key={cat} className="project-tag">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <FinalHero />
        </>
    );
}

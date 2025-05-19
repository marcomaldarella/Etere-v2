"use client";

import { useParams, useRouter, usePathname } from "next/navigation";
import { useContent } from "../../../context/ContentContext";
import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import Footer from "../../../components/Footer/Footer";
import ShuffleText from "../../../components/ShuffleText/ShuffleText";
import "../../archive/archive.css";
import "./project.css";
import { useScrollManager } from "../../../hooks/useScrollManager";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const { projects } = useContent();
    const project = projects?.find((p) => p?.id === id);
    const container = useRef();
    const pathname = usePathname();
    const { resetScroll, cleanup } = useScrollManager();

    useLayoutEffect(() => {
        cleanup();
        resetScroll({ immediate: true });

        // ✅ Forza Lenis a ripartire dopo il reset
        if (typeof window !== "undefined" && window.lenis?.start) {
            window.lenis.start();
        }
    }, [pathname, id]);

    if (!project) {
        router.push("/projects");
        return null;
    }

    return (
        <div className="archive" ref={container}>
            <section className="archive-hero">
                <div className="container">
                    <ShuffleText as="h1" text={project.title} />
                    <div className="archive-hero-img-wrapper">
                        <div className="archive-hero-img-wrapper-row">
                            <div className="archive-hero-img">
                                <img src={project.cover} alt={project.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="project-details">
                <div className="left-col">
                    <div className="project-info">
                        <p className="label">Client</p>
                        <p>{project.client}</p>

                        <p className="label">Sector</p>
                        <p>{project.sector}</p>

                        <p className="label">Technology</p>
                        <p>{project.tech}</p>
                    </div>
                </div>

                <div className="right-col">
                    <div className="pain-solution">
                        <p className="label">❌ Pain Point</p>
                        <p>{project.pain}</p>

                        <p className="label">✅ Solution</p>
                        <p>{project.solution}</p>
                    </div>

                    {project.highlights?.length > 0 && (
                        <div className="highlights">
                            <p className="label">Highlights</p>
                            <ul>
                                {project.highlights.map((highlight, index) => (
                                    <li key={index}>{highlight}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.images?.length > 0 && (
                        <div className="ui-extracts">
                            <p className="label">UI Extracts</p>
                            <div className="image-row">
                                {project.images.map((src, index) => (
                                    <img key={index} src={src} alt={`UI ${index + 1}`} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}

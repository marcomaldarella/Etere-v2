"use client";

import { useParams, useRouter } from "next/navigation";
import { useContent } from "../../../context/ContentContext";
import { useEffect, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import Marquee from "../../../components/Marquee/Marquee";
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
    }, [pathname, id]);

    useGSAP(
        () => {
            let pinAnimation;
            const initPinning = () => {
                if (pinAnimation) pinAnimation.kill();
                if (window.innerWidth > 900) {
                    pinAnimation = ScrollTrigger.create({
                        trigger: ".sticky-archive",
                        start: "top top",
                        endTrigger: ".gallery",
                        end: "bottom bottom",
                        pin: ".source",
                        pinSpacing: false,
                        invalidateOnRefresh: true,
                    });
                }
            };
            initPinning();
            const handleResize = () => { initPinning(); };
            window.addEventListener("resize", handleResize);
            return () => {
                if (pinAnimation) pinAnimation.kill();
                window.removeEventListener("resize", handleResize);
            };
        },
        { scope: container }
    );

    if (!project) {
        router.push('/projects');
        return null;
    }

    return (
        <ReactLenis root>
            <div className="archive" ref={container}>
                <section className="archive-hero">
                    <div className="container">
                        <ShuffleText as="h1" text={project.title} />
                        <div className="archive-hero-img-wrapper">
                            <div className="archive-hero-img-wrapper-row">
                                <p>+</p><p>+</p><p>+</p>
                            </div>
                            <div className="archive-hero-img-wrapper-row">
                                <div className="archive-hero-img">
                                    <img src={project.cover} alt={project.title} />
                                </div>
                            </div>
                            <div className="archive-hero-img-wrapper-row">
                                <p>+</p><p>+</p><p>+</p>
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
        </ReactLenis>
    );
} 
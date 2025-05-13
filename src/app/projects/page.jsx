"use client";

import Link from "next/link";
import Image from "next/image";
import { useContent } from "../../context/ContentContext";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/react";
import "./projects.css";
import { useScrollManager } from "../../hooks/useScrollManager";
import LinkWithScrollReset from "../../components/LinkWithScrollReset";
import ScrollReset from "../../components/ScrollReset";

export default function ProjectsListPage() {
    const { projects } = useContent();
    const pathname = usePathname();
    const { resetScroll, cleanup } = useScrollManager();

    useLayoutEffect(() => {
        cleanup();
        setTimeout(() => {
            resetScroll({ immediate: true });
        }, 0);
    }, [pathname]);

    if (!projects || !projects.length) {
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
            <ScrollReset />
            <ReactLenis root>
                <div className="projects-container">
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <LinkWithScrollReset
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="project-card"
                            >
                                <div className="project-info">
                                    <div className="project-image">
                                        <Image
                                            src={project.cover}
                                            alt={project.title}
                                            width={300}
                                            height={400}
                                            style={{
                                                objectFit: "cover",
                                                width: "100%",
                                                height: "auto",
                                                aspectRatio: "3 / 4",
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
            </ReactLenis>
        </>
    );
} 
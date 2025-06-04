"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function Providers({ children }) {
    const lenisRef = useRef();

    // 1. Setup ScrollTrigger
    useEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.defaults({
            scroller: document.querySelector(".app"),
            markers: false,
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
        };
    }, []);

    // ✅ 2. Inietta lenis su window per usarlo globalmente
    useEffect(() => {
        if (typeof window !== "undefined" && lenisRef.current) {
            window.lenis = lenisRef.current;
        }
    }, []);

    return (
        <ContentProvider>
            <ReactLenis
                ref={lenisRef}
                root
                className="app"
                options={{
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                    smoothTouch: false,
                    touchMultiplier: 1.5,
                }}
            >
                <Navbar />
                {children}
            </ReactLenis>
        </ContentProvider>
    );
}


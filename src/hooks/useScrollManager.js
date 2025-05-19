"use client"

import { useCallback, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ✅ Registra ScrollTrigger in modo sicuro (solo lato client)
if (typeof window !== "undefined" && !gsap.core.globals().ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger)
}

export function useScrollManager() {
    const resetScroll = useCallback(({ immediate = false } = {}) => {
        if (typeof window === "undefined") return

        // Stop scrolling
        if (window.lenis?.stop) {
            window.lenis.stop()
        }

        // Kill all ScrollTriggers
        if (typeof ScrollTrigger?.getAll === "function") {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }

        // Reset scroll position
        if (immediate) {
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        } else {
            if (window.lenis?.scrollTo) {
                window.lenis.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo({ top: 0, behavior: "auto" })
            }
        }

        // Restart Lenis and refresh ScrollTrigger in next frame
        requestAnimationFrame(() => {
            if (window.lenis?.start) {
                window.lenis.start()
            }
            if (window.lenis?.resize) {
                window.lenis.resize()
            }
            if (typeof ScrollTrigger?.refresh === "function") {
                ScrollTrigger.refresh(true)
            }
        })
    }, [])

    const cleanup = useCallback(() => {
        if (typeof window === "undefined") return

        if (typeof ScrollTrigger?.getAll === "function") {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }

        if (typeof ScrollTrigger?.refresh === "function") {
            ScrollTrigger.refresh(true)
        }
    }, [])

    useEffect(() => {
        return () => {
            cleanup()
        }
    }, [cleanup])

    return { resetScroll, cleanup }
}

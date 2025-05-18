"use client"

import { useCallback, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

export function useScrollManager() {
    // Function to reset scroll position
    const resetScroll = useCallback(({ immediate = false } = {}) => {
        if (typeof window === "undefined") return

        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        // Stop any ongoing scroll animations
        if (window.lenis) {
            window.lenis.stop()
        }

        // Kill all ScrollTrigger instances
        ScrollTrigger.getAll().forEach((trigger) => {
            trigger.kill()
        })

        // Reset scroll position
        if (immediate) {
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        } else {
            if (window.lenis) {
                window.lenis.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo({ top: 0, behavior: "auto" })
            }
        }

        // Resume smooth scrolling
        if (window.lenis) {
            setTimeout(() => {
                window.lenis.start()
                window.lenis.resize()
            }, 50)
        }

        // Refresh ScrollTrigger
        setTimeout(() => {
            ScrollTrigger.refresh()
        }, 100)
    }, [])

    // Cleanup function
    const cleanup = useCallback(() => {
        if (typeof window === "undefined") return

        // Clean up GSAP ScrollTrigger instances
        if (window.ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill()
            })

            if (ScrollTrigger.refresh) {
                ScrollTrigger.refresh()
            }
        }
    }, [])

    // Clean up on unmount
    useEffect(() => {
        return () => {
            cleanup()
        }
    }, [cleanup])

    return { resetScroll, cleanup }
}

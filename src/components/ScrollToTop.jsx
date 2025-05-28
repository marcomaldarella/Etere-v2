"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
    const pathname = usePathname()

    useEffect(() => {
        // Disable browser's scroll restoration
        if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual"
        }

        // Force immediate scroll reset
        const resetScroll = () => {
            // Reset native scroll first
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0

            // Reset Lenis scroll if available - check for different method names
            if (window.lenis) {
                try {
                    // Try different Lenis methods that might exist
                    if (typeof window.lenis.scrollTo === "function") {
                        window.lenis.scrollTo(0, { immediate: true, force: true })
                    } else if (typeof window.lenis.scroll === "function") {
                        window.lenis.scroll(0)
                    } else if (typeof window.lenis.setScroll === "function") {
                        window.lenis.setScroll(0)
                    } else if (window.lenis.lenis && typeof window.lenis.lenis.scrollTo === "function") {
                        window.lenis.lenis.scrollTo(0, { immediate: true })
                    }
                } catch (error) {
                    console.warn("Lenis scroll reset failed:", error)
                }
            }

            // Also try to reset the scroll container directly
            const scrollContainer = document.querySelector(".app")
            if (scrollContainer) {
                scrollContainer.scrollTop = 0
            }
        }

        // Reset immediately
        resetScroll()

        // Also reset after a small delay to ensure DOM is ready
        const timeoutId = setTimeout(resetScroll, 100)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [pathname])

    return null
}

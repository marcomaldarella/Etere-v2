"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import styles from "./PageWrapper.module.css"
// Import the useTransition hook from the hooks directory
import { useTransition as useTransitionHook } from "../../hooks/useTransition"

// Re-export the useTransition hook so it can be imported from PageWrapper
export { useTransition } from "../../hooks/useTransition"

setTimeout(() => {
  if (window?.lenis?.start && window?.lenis?.resize) {
    window.lenis.start();
    window.lenis.resize();
  }
}, 50);

export default function PageWrapper({ children }) {
  const pathname = usePathname()
  const { isTransitioning } = useTransitionHook()

  // Handle scroll reset on page navigation
  useEffect(() => {
    // Ensure smooth scrolling is properly initialized
    if (typeof window !== "undefined" && window.lenis) {
      // Force a small delay before starting animations
      setTimeout(() => {
        if (window.lenis && window.lenis.isStopped) {
          window.lenis.start()
        }

        // Resize lenis to ensure proper scrolling
        if (window.lenis && window.lenis.resize) {
          window.lenis.resize()
        }
      }, 50)
    }

    // Clean up ScrollTrigger instances
    if (typeof window !== "undefined" && window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill()
      })

      // Refresh ScrollTrigger
      setTimeout(() => {
        if (window.ScrollTrigger && window.ScrollTrigger.refresh) {
          window.ScrollTrigger.refresh()
        }
      }, 100)
    }
  }, [pathname])

  return <main className={`${styles.pageWrapper} ${isTransitioning ? styles.transitioning : ""}`}>{children}</main>
}

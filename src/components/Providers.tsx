"use client"

import { ContentProvider } from "../context/ContentContext"
import { ReactLenis } from "lenis/react"
import Navbar from "../components/Navbar/Navbar"
import Footer from "./Footer/Footer"
import ScrollToTop from "./ScrollToTop"
import { useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

export default function Providers({ children }) {
  const lenisRef = useRef()
  const pathname = usePathname()

  // 1. Setup ScrollTrigger & cleanup
  useEffect(() => {
    if (typeof window === "undefined") return

    gsap.registerPlugin(ScrollTrigger)

    // Disable browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    ScrollTrigger.defaults({
      scroller: document.querySelector(".app"),
      markers: false,
    })

    // Force refresh to recalculate layout
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timeout)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [])

  // 2. Inject Lenis on window for global access
  useEffect(() => {
    if (typeof window !== "undefined" && lenisRef.current) {
      window.lenis = lenisRef.current
    }
  }, [])

  // 3. Enhanced scroll reset on route change
  useEffect(() => {
    // Kill all ScrollTrigger instances first
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // Multiple scroll reset attempts
    const resetScroll = () => {
      // Native scroll reset
      window.scrollTo(0, 0)

      // Lenis scroll reset with error handling
      if (lenisRef.current) {
        try {
          // Try different methods to reset Lenis scroll
          if (typeof lenisRef.current.scrollTo === "function") {
            lenisRef.current.scrollTo(0, { immediate: true, force: true })
          } else if (typeof lenisRef.current.scroll === "function") {
            lenisRef.current.scroll(0)
          } else if (typeof lenisRef.current.setScroll === "function") {
            lenisRef.current.setScroll(0)
          }
        } catch (error) {
          console.warn("Lenis scroll reset failed:", error)
        }
      }

      // Direct container reset
      const scrollContainer = document.querySelector(".app")
      if (scrollContainer) {
        scrollContainer.scrollTop = 0
      }
    }

    // Reset immediately
    resetScroll()

    // Reset again after delays to ensure it works
    const timeouts = [
      setTimeout(resetScroll, 50),
      setTimeout(resetScroll, 150),
      setTimeout(() => {
        ScrollTrigger.refresh(true)
        // Force Lenis to recalculate scroll height
        if (lenisRef.current && typeof lenisRef.current.resize === "function") {
          lenisRef.current.resize()
        }
      }, 200),
    ]

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [pathname])

  // 4. Force Lenis resize when content changes
  useEffect(() => {
    const resizeTimeout = setTimeout(() => {
      if (lenisRef.current && typeof lenisRef.current.resize === "function") {
        lenisRef.current.resize()
      }
      ScrollTrigger.refresh(true)
    }, 500)

    return () => clearTimeout(resizeTimeout)
  }, [pathname])

  return (
    <ContentProvider>
      <ReactLenis
        ref={lenisRef}
        root
        className="app"
        options={{
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 1.5,
          autoResize: true,
          // AGGIUNTO: opzioni per assicurarsi che raggiunga il fondo
          infinite: false,
          orientation: "vertical",
          gestureOrientation: "vertical",
          syncTouch: false,
          // IMPORTANTE: permette di scrollare oltre il viewport
          normalizeWheel: true,
        }}
      >
        <ScrollToTop />
        <div className="main-layout">
          <Navbar />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </ReactLenis>
    </ContentProvider>
  )
}

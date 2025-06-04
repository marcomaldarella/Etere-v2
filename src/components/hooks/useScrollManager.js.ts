"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function useTransition() {
    const [isTransitioning, setIsTransitioning] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Set transitioning to true when navigation starts
        setIsTransitioning(true)

        // After a short delay, set transitioning to false
        const timer = setTimeout(() => {
            setIsTransitioning(false)
        }, 600) // Adjust timing to match your transition duration

        return () => {
            clearTimeout(timer)
        }
    }, [pathname])

    return { isTransitioning }
}

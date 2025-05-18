"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LinkWithScrollReset({ href, children, className }) {
    const router = useRouter()

    const handleClick = (e) => {
        e.preventDefault()

        // Stop any ongoing scroll animations
        if (typeof window !== "undefined" && window.lenis) {
            window.lenis.stop()
        }

        // Clean up ScrollTrigger instances before navigation
        if (typeof window !== "undefined" && window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach((trigger) => {
                trigger.kill()
            })
        }

        // Navigate to the new page
        router.push(href)
    }

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    )
}

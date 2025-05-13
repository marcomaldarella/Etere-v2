"use client";
import { useRouter } from "next/navigation";

export default function LinkWithScrollReset({ href, children, ...props }) {
    const router = useRouter();

    const handleClick = (e) => {
        e.preventDefault();
        // Animazione scroll a zero
        if (window.lenis) {
            window.lenis.scrollTo(0, { duration: 1, force: true });
            setTimeout(() => {
                router.push(href);
            }, 1000); // Attendi la fine dell'animazione Lenis
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
                router.push(href);
            }, 600); // Tempo stimato per lo scroll nativo
        }
        if (props.onClick) props.onClick(e);
    };

    return (
        <a href={href} {...props} onClick={handleClick}>
            {children}
        </a>
    );
} 
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LinkWithScrollReset({ href, children, className }) {
    const router = useRouter();

    const handleClick = async (e) => {
        e.preventDefault();

        // Ferma Lenis per evitare scroll coasting
        window.lenis?.stop();

        // Naviga alla nuova pagina
        router.push(href);

        // Delay per aspettare che il DOM cambi (App Router workaround)
        setTimeout(() => {
            // Reset scroll nativo
            window.scrollTo(0, 0);
            // Reset scroll Lenis
            window.lenis?.scrollTo(0, { immediate: true });

            // Riavvia Lenis dopo frame
            requestAnimationFrame(() => {
                window.lenis?.start();
            });
        }, 50); // Puoi anche alzare a 100ms se il contenuto è pesante
    };

    return (
        <Link href={href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
}
